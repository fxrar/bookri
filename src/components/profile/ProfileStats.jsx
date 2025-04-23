import React from 'react';

const ProfileStats = ({ booksCount, completedCount, totalReadingTime }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{booksCount}</p>
        <p className="text-xs text-gray-600">Books</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
        <p className="text-xs text-gray-600">Completed</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{totalReadingTime}</p>
        <p className="text-xs text-gray-600">Reading Time</p>
      </div>
    </div>
  );
};

export default ProfileStats;
