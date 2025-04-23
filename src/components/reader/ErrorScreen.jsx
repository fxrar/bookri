import React from 'react';

const ErrorScreen = ({ message = 'An error occurred' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
        <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorScreen;
