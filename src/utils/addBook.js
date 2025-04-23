import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { addBook as addBookToDb } from '../db/bookDb';
import { v4 as uuidv4 } from 'uuid';
import { getPdfPageCount, getPdfMetadata } from './getPdfPageCount';

export async function addBook(bookData, file) {
  try {
    console.log('Extracting PDF information...');

    const pageCount = await getPdfPageCount(file);

    const pdfMetadata = await getPdfMetadata(file);

    let base64Data;
    const isNative = Capacitor.isNativePlatform();

    if (isNative && file.nativePath) {
      try {
        console.log('Reading file from native path:', file.nativePath);
        const fileData = await Filesystem.readFile({
          path: file.nativePath,
        });

        base64Data = fileData.data;
      } catch (error) {
        console.error('Error reading file from native path:', error);
        throw new Error('Could not read file from device storage');
      }
    } else if (file instanceof Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
          try {
            base64Data = event.target.result.split(',')[1];

            const bookId = await processAndSaveBook(
              bookData,
              file,
              base64Data,
              pageCount,
              pdfMetadata
            );

            resolve(bookId);
          } catch (error) {
            console.error('Error processing book:', error);
            reject(error);
          }
        };

        reader.onerror = (error) => {
          console.error('Error reading file:', error);
          reject(new Error('Error reading file'));
        };

        reader.readAsDataURL(file);
      });
    } else {
      throw new Error('Unsupported file object type');
    }

    return await processAndSaveBook(
      bookData,
      file,
      base64Data,
      pageCount,
      pdfMetadata
    );
  } catch (error) {
    console.error('Error in addBook utility:', error);
    return null;
  }
}

async function processAndSaveBook(
  bookData,
  file,
  base64Data,
  pageCount,
  pdfMetadata
) {
  const fileId = uuidv4().substring(0, 8);
  const fileName =
    file.name || (file.path ? file.path.split('/').pop() : 'unknown.pdf');
  const fileExtension = fileName.split('.').pop().toLowerCase();
  const safeFileName = `book_${fileId}.${fileExtension}`;
  const filePath = `books/${safeFileName}`;

  console.log(`Saving file as ${filePath} in Documents directory...`);

  const savedFile = await Filesystem.writeFile({
    path: filePath,
    data: base64Data,
    directory: Directory.Documents,
    recursive: true,
  });

  console.log('File saved successfully:', savedFile.uri);

  const title =
    pdfMetadata.Title || bookData.name || fileName.replace(/\.[^/.]+$/, '');
  const author = pdfMetadata.Author || bookData.author || '';

  // Prepare complete book data
  const completeBookData = {
    ...bookData,
    name: title,
    author: author,
    fileLocation: savedFile.uri,
    filePath: filePath, // Store the relative path
    fileDirectory: 'Documents',
    fileFormat: fileExtension,
    fileSize: file.size || 0,
    totalPages: pageCount,
    metadata: {
      ...bookData.metadata,
      publisher: pdfMetadata.Publisher || bookData.metadata?.publisher || '',
      publicationDate: pdfMetadata.CreationDate || '',
      // Keep existing categories if set
      categories: bookData.metadata?.categories || [],
    },
  };

  console.log('Adding book to database with data:', completeBookData);

  // Add to database
  const bookId = await addBookToDb(completeBookData);

  if (!bookId) {
    throw new Error('Failed to add book to database');
  }

  console.log('Book added successfully with ID:', bookId);
  return bookId;
}
