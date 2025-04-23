import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faCloudUploadAlt,
  faFilePdf,
  faSpinner,
  faChevronDown,
  faBrain,
  faLightbulb,
  faChartLine,
  faHistory,
  faFlask,
  faBook,
  faUser,
  faLaptopCode,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { addBook } from '../utils/addBook';

const AddBookModal = ({ onClose }) => {
  const [bookData, setBookData] = useState({
    name: '',
    author: '',
    fileLocation: '',
    totalPages: 100, // Default value
    fileFormat: '',
    fileSize: 0,
    category: '', // Add direct category field
    metadata: {
      language: 'en',
      publisher: '',
      isbn: '',
      categories: [],
    },
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  // Available categories with icons and colors
  const categories = [
    {
      id: 'self-improvement',
      name: 'Self Improvement',
      icon: faBrain,
      color: 'blue',
    },
    {
      id: 'philosophy',
      name: 'Philosophy',
      icon: faLightbulb,
      color: 'purple',
    },
    { id: 'business', name: 'Business', icon: faChartLine, color: 'green' },
    { id: 'history', name: 'History', icon: faHistory, color: 'yellow' },
    { id: 'science', name: 'Science', icon: faFlask, color: 'red' },
    { id: 'fiction', name: 'Fiction', icon: faBook, color: 'indigo' },
    { id: 'biography', name: 'Biography', icon: faUser, color: 'pink' },
    { id: 'technology', name: 'Technology', icon: faLaptopCode, color: 'teal' },
    { id: 'other', name: 'Other', icon: faEllipsisH, color: 'gray' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setBookData((prev) => ({
      ...prev,

      category: category.name,
      metadata: {
        ...prev.metadata,
        categories: [category.name],
      },
    }));
    setShowCategories(false);
  };

  const selectFileNative = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/pdf'],
        multiple: false,
      });

      if (result.files.length > 0) {
        const fileInfo = result.files[0];
        console.log('File selected via native picker:', fileInfo);

        if (!fileInfo.mimeType.includes('pdf')) {
          setError('Only PDF files are supported at this time.');
          return;
        }

        const fileObject = {
          name: fileInfo.name,
          size: fileInfo.size,
          type: fileInfo.mimeType,
          path: fileInfo.path,

          nativePath: fileInfo.path,
        };

        setSelectedFile(fileObject);

        setBookData((prev) => ({
          ...prev,
          name: fileInfo.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          fileFormat: 'pdf',
          fileSize: fileInfo.size,
          totalPages: 100, // Default, will be updated by the addBook utility
        }));
      }
    } catch (error) {
      console.error('Error picking file:', error);
      setError(`Error selecting file: ${error.message}`);
    }
  };

  // Function to handle file selection via input (for web)
  const handleFileChange = async (e) => {
    // Reset the file input value to ensure we can select the same file again if needed
    const fileInput = document.getElementById('file-upload');

    const file = e.target.files[0];
    if (!file) return;

    // Only accept PDF files for now
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported at this time.');
      fileInput.value = '';
      return;
    }

    // Update selected file state
    setSelectedFile(file);

    // Update book data with file info
    setBookData((prev) => ({
      ...prev,
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      fileFormat: 'pdf',
      fileSize: file.size,
      totalPages: 100, // Default, will be updated by the addBook utility
    }));
  };

  // Combined function to handle file selection based on platform
  const handleSelectFile = () => {
    if (Capacitor.isNativePlatform()) {
      selectFileNative();
    } else {
      // On web, trigger the file input click
      document.getElementById('file-upload').click();
    }
  };

  const handleChangeFile = () => {
    // Clear the current selection
    setSelectedFile(null);

    // If on web, reset the file input
    if (!Capacitor.isNativePlatform()) {
      const fileInput = document.getElementById('file-upload');
      if (fileInput) {
        fileInput.value = '';
      }
    }

    // Trigger file selection
    handleSelectFile();
  };

  // Helper function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let fileData;

      // Handle file data differently based on platform
      if (Capacitor.isNativePlatform() && selectedFile.nativePath) {
        // For native platforms, read the file from the path
        const result = await Filesystem.readFile({
          path: selectedFile.nativePath,
        });

        // Convert base64 to ArrayBuffer if needed
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

        // Create a File-like object with the data
        const fileWithData = {
          ...selectedFile,
          arrayBuffer: () => Promise.resolve(fileData),
        };

        // Use the utility function with our processed file
        const bookId = await addBook(bookData, fileWithData);

        if (!bookId) {
          throw new Error('Failed to add book');
        }
      } else {
        // For web, the File object already has the data
        const bookId = await addBook(bookData, selectedFile);

        if (!bookId) {
          throw new Error('Failed to add book');
        }
      }

      // Success! Close modal
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
      // Show more detailed error message
      setError(`Failed to save book: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected category object
  const selectedCategory = categories.find(
    (cat) => bookData.metadata.categories[0] === cat.name
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-xl w-full max-h-[70vh] overflow-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Add New Book
            </h2>
            <button onClick={onClose} className="text-gray-500">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              PDF File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${selectedFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            >
              {selectedFile ? (
                <div>
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="text-blue-500 text-2xl mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    className="mt-2 text-xs text-blue-500"
                    onClick={handleChangeFile}
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon
                    icon={faCloudUploadAlt}
                    className="text-gray-400 text-2xl mb-2"
                  />
                  <p className="text-sm text-gray-500 mb-2">
                    Click to select a PDF file
                  </p>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={handleSelectFile}
                  >
                    Select PDF
                  </button>
                </div>
              )}
              {}
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Book Title
            </label>
            <input
              type="text"
              name="name"
              value={bookData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Author
            </label>
            <input
              type="text"
              name="author"
              value={bookData.author}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter author name"
            />
          </div>

          {}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Category (Optional)
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
                onClick={() => setShowCategories(!showCategories)}
              >
                {selectedCategory ? (
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full bg-${selectedCategory.color}-100 flex items-center justify-center mr-2`}
                    >
                      <FontAwesomeIcon
                        icon={selectedCategory.icon}
                        className={`text-${selectedCategory.color}-500 text-xs`}
                      />
                    </div>
                    <span>{selectedCategory.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Select a category</span>
                )}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="text-gray-400"
                />
              </button>

              {}
              {showCategories && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-${category.color}-100 flex items-center justify-center mr-2`}
                      >
                        <FontAwesomeIcon
                          icon={category.icon}
                          className={`text-${category.color}-500 text-xs`}
                        />
                      </div>
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin mr-2" />
                  Adding...
                </>
              ) : (
                'Add Book'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;
