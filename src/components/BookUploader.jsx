import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

const BookUploader = ({ fileInputRef, selectedFile, handleFileSelect }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 -sm">
      <h2 className="font-semibold text-gray-800 mb-3">Add a New Book</h2>
      <div className="mb-3">
        <input
          ref={fileInputRef}
          id="file-input"
          type="file"
          accept=".epub,.pdf,.mobi"
          onChange={handleFileSelect}
          className="border p-2 w-full rounded-lg"
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center"
        disabled={!selectedFile}
      >
        <FontAwesomeIcon icon={faBook} className="mr-2" />
        {selectedFile ? `Upload ${selectedFile.name}` : 'Select a Book File'}
      </button>
    </div>
  );
};

export default BookUploader;
