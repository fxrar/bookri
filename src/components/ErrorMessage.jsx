import React from 'react';

const ErrorMessage = ({ message, onBack }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-red-500 text-5xl mb-4">
        <i className="fas fa-exclamation-circle"></i>
      </div>
      <h1 className="text-xl font-medium text-gray-800 mb-2">
        Error Loading Book
      </h1>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={onBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorMessage;
