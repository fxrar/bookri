import React, { useEffect, useState, useRef } from 'react';
import { getBooks, addBook, init } from '../db/bookDb';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedBookId, setExpandedBookId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        await init();
        console.log('Database initialized, loading books...');

        const allBooks = await getBooks();
        console.log('Books loaded:', allBooks);
        setBooks(allBooks);
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    console.log('File selected:', file.name);

    await handleAddBookFromFile(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = async () => {
    if (!Capacitor.isNativePlatform()) {
      // On web, trigger the file input click
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
      return;
    }

    try {
      const result = await FilePicker.pickFiles({
        types: [
          'application/epub+zip',
          'application/pdf',
          'application/x-mobipocket-ebook',
        ],
        multiple: false,
      });

      if (result.files.length > 0) {
        const fileInfo = result.files[0];
        console.log('File selected via native picker:', fileInfo);

        const fileResult = await Filesystem.readFile({
          path: fileInfo.path,
        });

        const binaryString = window.atob(fileResult.data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;

        const file = {
          name: fileInfo.name,
          size: fileInfo.size,
          type: fileInfo.mimeType,
          nativePath: fileInfo.path,
          arrayBuffer: () => Promise.resolve(arrayBuffer),
        };

        await handleAddBookFromFile(file, arrayBuffer);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      alert(`Error selecting file: ${error.message}`);
    }
  };

  const handleAddBookFromFile = async (file, arrayBufferData = null) => {
    if (!file) return;

    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!['epub', 'pdf', 'mobi'].includes(fileExtension)) {
        alert(
          'Unsupported file format. Please upload epub, pdf, or mobi files.'
        );
        return;
      }

      if (arrayBufferData) {
        processFileData(file, arrayBufferData);
      } else {
        const reader = new FileReader();

        reader.onload = async (e) => {
          processFileData(file, e.target.result);
        };

        reader.onerror = () => {
          console.error('Error reading file');
          alert('Error reading file. Please try again.');
        };

        reader.readAsArrayBuffer(file);
      }
    } catch (error) {
      console.error('Error adding book from file:', error);
      alert(`Error processing file: ${error.message}`);
    }
  };

  const processFileData = async (file, fileData) => {
    try {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      let filePath = null;
      let fileUri = null;
      let fileDirectory = null;

      const fileName = `book_${Date.now()}.${fileExtension}`;
      const dirPath = 'bookri_books';

      if (Capacitor.isNativePlatform()) {
        try {
          await Filesystem.mkdir({
            path: dirPath,
            directory: Directory.Documents,
            recursive: true,
          }).catch((e) => console.log('Directory might already exist:', e));

          const base64Data = arrayBufferToBase64(fileData);
          const savedFile = await Filesystem.writeFile({
            path: `${dirPath}/${fileName}`,
            data: base64Data,
            directory: Directory.Documents,
          });

          console.log('File saved successfully:', savedFile);
          filePath = `${dirPath}/${fileName}`;
          fileUri = savedFile.uri;
          fileDirectory = Directory.Documents;

          const stat = await Filesystem.stat({
            path: filePath,
            directory: Directory.Documents,
          });
          console.log('File stats:', stat);
        } catch (err) {
          console.error('Error saving file to filesystem:', err);

          const base64Data = arrayBufferToBase64(fileData);
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache,
          });
          filePath = fileName;
          fileUri = savedFile.uri;
          fileDirectory = Directory.Cache;
        }
      } else {
        const blob = new Blob([fileData], { type: getMimeType(fileExtension) });
        filePath = URL.createObjectURL(blob);
        fileUri = filePath;
        fileDirectory = 'browser';

        try {
          localStorage.setItem(`book_${fileName}`, filePath);
        } catch (e) {
          console.warn(
            'Could not store book in localStorage - file may be too large'
          );
        }
      }

      const estimatedPages = Math.max(1, Math.floor(file.size / 1000 / 2));

      const newBook = {
        name: file.name.replace(`.${fileExtension}`, ''),
        author: 'Unknown',
        fileLocation: fileUri || filePath,
        filePath: filePath,
        fileUri: fileUri,
        fileDirectory: fileDirectory,
        fileName: fileName,
        originalFileName: file.name,
        fileSize: file.size,
        fileData: Capacitor.isNativePlatform() ? null : fileData,
        totalPages: estimatedPages,
        fileFormat: fileExtension,
        fileType: file.type || getMimeType(fileExtension),
        addedDate: new Date().toISOString(),
        metadata: {
          language: 'en',
          publisher: '',
          publicationDate: '',
          isbn: '',
          categories: [],
        },
      };

      const result = await addBook(newBook);

      if (typeof result === 'string' && result.includes('required')) {
        console.error('Error adding book:', result);
        alert(`Failed to add book: ${result}`);
      } else {
        console.log('Book added with ID:', result);

        const updatedBooks = await getBooks();
        setBooks(updatedBooks);

        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error saving book data:', error);
      alert(`Error adding book: ${error.message}`);
    }
  };

  const getMimeType = (extension) => {
    const mimeTypes = {
      pdf: 'application/pdf',
      epub: 'application/epub+zip',
      mobi: 'application/x-mobipocket-ebook',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleOpenBook = async (book) => {
    console.log('Opening book:', book);

    try {
      if (!book.fileLocation) {
        alert('No file location available for this book');
        return;
      }

      if (Capacitor.isNativePlatform()) {
        try {
          const fileInfo = await Filesystem.stat({
            path: book.filePath || book.fileLocation,
            directory: book.fileDirectory || Directory.Documents,
          }).catch(async (e) => {
            console.log(
              'File not found at original location, trying absolute path',
              e
            );

            if (book.fileLocation.startsWith('file://') || book.fileUri) {
              return { uri: book.fileUri || book.fileLocation };
            }

            return await Filesystem.stat({
              path: book.fileLocation,
            });
          });

          console.log('File exists at:', fileInfo.uri || book.fileLocation);

          await FileOpener.open({
            filePath: fileInfo.uri || book.fileUri || book.fileLocation,
            contentType: getMimeType(book.fileFormat),
          });
        } catch (err) {
          console.error('Error checking file existence:', err);

          console.log('Attempting fallback method...');

          let fileData;

          if (book.fileData) {
            fileData = book.fileData;
          } else {
            try {
              const result = await Filesystem.readFile({
                path: book.filePath || book.fileLocation,
                directory: book.fileDirectory || Directory.Documents,
              }).catch(async () => {
                return await Filesystem.readFile({
                  path: book.fileLocation,
                });
              });

              if (result && result.data) {
                if (typeof result.data === 'string') {
                  const binaryString = window.atob(result.data);
                  const bytes = new Uint8Array(binaryString.length);
                  for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                  }
                  fileData = bytes.buffer;
                } else {
                  fileData = result.data;
                }
              }
            } catch (readErr) {
              console.error('Error reading file:', readErr);
              throw new Error('Could not read the book file');
            }
          }

          if (!fileData) {
            throw new Error('No file data available');
          }

          const tempFileName = `temp_${Date.now()}.${book.fileFormat}`;
          const base64Data = arrayBufferToBase64(fileData);

          const savedFile = await Filesystem.writeFile({
            path: tempFileName,
            data: base64Data,
            directory: Directory.Cache,
            recursive: true,
          });

          console.log('Temporary file saved at:', savedFile.uri);

          await FileOpener.open({
            filePath: savedFile.uri,
            contentType: getMimeType(book.fileFormat),
          });
        }
      } else {
        let fileUrl = book.fileLocation;

        if (!fileUrl.startsWith('blob:') && !fileUrl.startsWith('http')) {
          const fileName = book.fileName || `${book.name}.${book.fileFormat}`;
          fileUrl = localStorage.getItem(`book_${fileName}`);
        }

        if (!fileUrl && book.fileData) {
          const blob = new Blob([book.fileData], {
            type: book.fileType || getMimeType(book.fileFormat),
          });
          fileUrl = URL.createObjectURL(blob);
        }

        if (fileUrl) {
          window.open(fileUrl, '_blank');

          if (fileUrl.startsWith('blob:')) {
            setTimeout(() => {
              URL.revokeObjectURL(fileUrl);
            }, 1000);
          }
        } else {
          alert('Could not retrieve file data for this book');
        }
      }
    } catch (error) {
      console.error('Error opening book:', error);
      alert(`Failed to open the book: ${error.message}`);
    }
  };

  const handleAddTestBook = async () => {
    try {
      console.log('Adding test book...');

      const textEncoder = new TextEncoder();
      const fileData = textEncoder.encode('This is a test book content').buffer;

      let filePath;
      let fileUri;
      let fileDirectory;
      const fileName = `test-book-${Date.now()}.epub`;

      if (Capacitor.isNativePlatform()) {
        const dirPath = 'bookri_books';

        await Filesystem.mkdir({
          path: dirPath,
          directory: Directory.Documents,
          recursive: true,
        }).catch((e) => console.log('Directory might already exist:', e));

        const base64Data = arrayBufferToBase64(fileData);
        const savedFile = await Filesystem.writeFile({
          path: `${dirPath}/${fileName}`,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        });
        filePath = `${dirPath}/${fileName}`;
        fileUri = savedFile.uri;
        fileDirectory = Directory.Documents;

        console.log('Test file saved at:', savedFile.uri);
      } else {
        const blob = new Blob([fileData], { type: 'application/epub+zip' });
        filePath = URL.createObjectURL(blob);
        fileUri = filePath;
        fileDirectory = 'browser';
        localStorage.setItem(`book_${fileName}`, filePath);
      }

      const newBook = {
        name: 'Test Book ' + new Date().toLocaleTimeString(),
        author: 'Test Author',
        fileLocation: fileUri || filePath,
        filePath: filePath,
        fileUri: fileUri,
        fileDirectory: fileDirectory,
        fileName: fileName,
        originalFileName: fileName,
        fileSize: fileData.byteLength,
        totalPages: 10,
        fileFormat: 'epub',
        fileType: 'application/epub+zip',
        addedDate: new Date().toISOString(),
        metadata: {
          language: 'en',
          publisher: 'Test Publisher',
          publicationDate: '',
          isbn: '',
          categories: ['Test'],
        },
      };

      const result = await addBook(newBook);

      if (typeof result === 'string' && result.includes('required')) {
        console.error('Error adding test book:', result);
        alert(`Failed to add test book: ${result}`);
      } else {
        console.log('Test book added with ID:', result);

        const updatedBooks = await getBooks();
        console.log('Updated book count:', updatedBooks.length);
        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error('Error adding test book:', error);
      alert(`Error adding test book: ${error.message}`);
    }
  };

  const toggleBookDetails = (bookId) => {
    if (expandedBookId === bookId) {
      setExpandedBookId(null);
    } else {
      setExpandedBookId(bookId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bookri App</h1>

      <div className="mb-4 p-4 border rounded">
        <h2 className="text-xl mb-2">Add a Book</h2>

        <div className="mb-3">
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept=".epub,.pdf,.mobi"
            onChange={handleFileSelect}
            className={`border p-2 w-full ${Capacitor.isNativePlatform() ? 'hidden' : ''}`}
          />

          {Capacitor.isNativePlatform() && (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
              onClick={openFilePicker}
            >
              Select Book File
            </button>
          )}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddTestBook}
        >
          Add Test Book
        </button>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div>
          <h2 className="text-xl mb-2">Books ({books.length})</h2>
          {books.length === 0 ? (
            <p>No books found</p>
          ) : (
            <ul className="divide-y">
              {books.map((book) => (
                <li key={book.id} className="py-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{book.name}</p>
                      <p className="text-sm text-gray-600">by {book.author}</p>
                      <p className="text-xs text-gray-500">
                        Format: {book.fileFormat}
                        {book.fileSize
                          ? ` • ${formatFileSize(book.fileSize)}`
                          : ''}
                        {book.addedDate
                          ? ` • Added: ${formatDate(book.addedDate)}`
                          : ''}
                      </p>
                    </div>
                    <div className="flex">
                      <button
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded mr-2"
                        onClick={() => toggleBookDetails(book.id)}
                      >
                        {expandedBookId === book.id
                          ? 'Hide Details'
                          : 'Show Details'}
                      </button>
                      <button
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                        onClick={() => handleOpenBook(book)}
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  {expandedBookId === book.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                      <h3 className="font-semibold mb-2">File Details:</h3>
                      <table className="w-full text-left">
                        <tbody>
                          <tr>
                            <td className="font-medium pr-2">ID:</td>
                            <td className="break-all">{book.id}</td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Original Name:</td>
                            <td className="break-all">
                              {book.originalFileName || book.fileName}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Stored As:</td>
                            <td className="break-all">{book.fileName}</td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">File Type:</td>
                            <td>
                              {book.fileType || getMimeType(book.fileFormat)}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Size:</td>
                            <td>{formatFileSize(book.fileSize)}</td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Added:</td>
                            <td>{formatDate(book.addedDate)}</td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Pages:</td>
                            <td>{book.totalPages}</td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Directory:</td>
                            <td className="break-all">
                              {book.fileDirectory || 'Unknown'}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Path:</td>
                            <td className="break-all">
                              {book.filePath || 'Unknown'}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">URI:</td>
                            <td className="break-all">
                              {book.fileUri || book.fileLocation || 'Unknown'}
                            </td>
                          </tr>
                          <tr>
                            <td className="font-medium pr-2">Metadata:</td>
                            <td>
                              <details>
                                <summary>View Metadata</summary>
                                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                  {JSON.stringify(book.metadata, null, 2)}
                                </pre>
                              </details>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="mt-3">
                        <h3 className="font-semibold mb-2">Debug Actions:</h3>
                        <button
                          className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs mr-2"
                          onClick={async () => {
                            try {
                              console.log('Checking file existence...');
                              const fileInfo = await Filesystem.stat({
                                path: book.filePath || book.fileLocation,
                                directory:
                                  book.fileDirectory || Directory.Documents,
                              }).catch(async (e) => {
                                console.log(
                                  'Error with directory, trying absolute path',
                                  e
                                );
                                return await Filesystem.stat({
                                  path: book.fileLocation,
                                });
                              });
                              console.log('File exists:', fileInfo);
                              alert(
                                `File exists!\nURI: ${fileInfo.uri}\nPath: ${fileInfo.path}\nSize: ${fileInfo.size} bytes`
                              );
                            } catch (error) {
                              console.error('File check failed:', error);
                              alert(`File check failed: ${error.message}`);
                            }
                          }}
                        >
                          Check File
                        </button>

                        <button
                          className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"
                          onClick={() => {
                            console.log('Full book object:', book);
                            alert('Full book details logged to console');
                          }}
                        >
                          Log Details
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
