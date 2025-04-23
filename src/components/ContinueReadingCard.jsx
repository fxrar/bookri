import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faBookmark } from '@fortawesome/free-solid-svg-icons';
import ProgressBar from './ProgressBar';

const ContinueReadingCard = ({ book, onOpen }) => {
  if (!book || book.progress.percentage === 100)
    return (
      <div className="bg-white rounded-xl p-4 mb-6 -sm text-center">
        <p className="text-gray-600">No books in progress</p>
      </div>
    );

  const getRelativeTimeString = (timestamp) => {
    if (!timestamp) return 'Just now';

    const now = new Date();
    const date = new Date(timestamp);
    const secondsAgo = Math.floor((now - date) / 1000);

    if (secondsAgo < 60) {
      return 'Just now';
    }

    if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60);
      return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
    }

    if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }

    if (secondsAgo < 604800) {
      const days = Math.floor(secondsAgo / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }

    if (secondsAgo < 2592000) {
      const weeks = Math.floor(secondsAgo / 604800);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }

    if (secondsAgo < 31536000) {
      const months = Math.floor(secondsAgo / 2592000);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }

    const years = Math.floor(secondsAgo / 31536000);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-6 -sm">
      <div className="flex space-x-4">
        <div className="book-cover flex-shrink-0 w-20">
          <img
            src={
              book.coverImage ||
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
            }
            alt={book.name}
            className="w-full h-28 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800">{book.name}</h3>
            <span className="bg-blue-500 text-xs text-white px-2 py-0.5 rounded-full">
              Featured
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-2">{book.author}</p>
          <ProgressBar percentage={book.progress.percentage || 0} />
          <div className="flex justify-between text-xs text-gray-500 mb-3 mt-1">
            <span>
              Page {book.progress.currentPage || 0} of {book.totalPages}
            </span>
            <span>{book.progress.percentage || 0}% completed</span>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white text-sm py-1.5 px-4 rounded-lg flex-1 flex items-center justify-center"
              onClick={() => onOpen(book)}
            >
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" /> Continue
            </button>
            <button className="bg-gray-100 text-gray-600 text-sm py-1.5 px-3 rounded-lg">
              <FontAwesomeIcon icon={faBookmark} />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last read: {getRelativeTimeString(book.progress.lastReadDate)}
        </p>
      </div>

      <style jsx>{`
        .book-cover {
          border-radius: 8px;
          overflow: hidden;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

export default ContinueReadingCard;
