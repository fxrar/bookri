import React from 'react';
import { format } from 'date-fns';

const ProfileHeader = ({ username, joinedDate, readingStreak }) => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, 'EEEE, MMMM d');

  const initials = username
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const readerStatus =
    readingStreak > 14
      ? 'Bookworm'
      : readingStreak > 7
        ? 'Avid Reader'
        : readingStreak > 3
          ? 'Regular Reader'
          : 'Casual Reader';

  return (
    <>
      {}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600 text-sm">{formattedDate}</p>
        </div>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <i className="fas fa-cog text-gray-500"></i>
        </button>
      </div>

      {}
      <div className="profile-header p-4 mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4 shadow-md">
            <span className="text-white font-bold text-xl">{initials}</span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">{username}</h2>
            <p className="text-gray-600 text-sm">Joined {joinedDate}</p>
            <div className="flex items-center mt-1">
              <i className="fas fa-book-open text-blue-500 mr-1 text-sm"></i>
              <span className="text-gray-600 text-sm">{readerStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
