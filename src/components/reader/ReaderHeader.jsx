import React from 'react';

const ReaderHeader = ({ title, author, onBack }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <button
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={onBack}
        aria-label="Go back"
      >
        <i className="fas fa-arrow-left text-gray-600"></i>
      </button>
      <div className="text-center">
        <h1 className="font-medium text-gray-800 text-sm">{title}</h1>
        <p className="text-gray-500 text-xs">{author}</p>
      </div>
      <div className="w-10"></div> {}
    </header>
  );
};

export default ReaderHeader;
