import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons';
import { Navigate, useNavigate } from 'react-router-dom';

const BookCard = ({
  book,
  onOpen,
  viewMode = 'grid',
  showProgress = false,
}) => {
  const navigate = useNavigate();
  const isReading =
    book.progress &&
    book.progress.percentage > 0 &&
    book.progress.percentage < 100;
  const isBookmarked = book.bookmarks && book.bookmarks.length > 0;

  const getBookCover = () => {
    if (book.coverImage) return book.coverImage;

    return 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  };

  if (viewMode === 'simple' || !showProgress) {
    return (
      <div
        className="book-card flex-shrink-0 w-32 sm:w-24"
        onClick={() => {
          navigate(`/reader/?id=${book.id}`);
        }}
      >
        <div className="book-cover mb-2">
          <img
            src={getBookCover()}
            alt={book.name}
            className="w-full h-44 sm:h-36 object-cover rounded-lg"
            onClick={() => onOpen && onOpen(book)}
          />
        </div>
        <h3 className="font-medium text-gray-800 text-sm sm:text-xs truncate">
          {book.name}
        </h3>
        <p className="text-gray-500 text-xs sm:text-[10px] truncate">
          {book.author}
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="book-card bg-white rounded-xl p-3 sm:p-2">
        <div className="book-cover mb-2 relative">
          <img
            src={getBookCover()}
            alt={`Cover of ${book.name}`}
            className="w-full h-40 sm:h-32 object-cover rounded-lg"
            onClick={() => onOpen && onOpen(book)}
          />
          <div className="absolute top-2 right-2 sm:top-1 sm:right-1">
            <button className="bg-white bg-opacity-80 p-1.5 sm:p-1 rounded-full">
              <FontAwesomeIcon
                icon={isBookmarked ? solidBookmark : regularBookmark}
                className={isBookmarked ? 'text-blue-500' : 'text-gray-500'}
                size="sm"
              />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 text-sm sm:text-xs truncate max-w-[70%]">
            {book.name}
          </h3>
          {isReading && (
            <span className="bg-blue-500 text-xs sm:text-[10px] text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Reading
            </span>
          )}
        </div>

        <p className="text-gray-500 text-xs sm:text-[10px] mb-2 truncate">
          {book.author}
        </p>

        {showProgress && (
          <>
            <div className="progress-bar h-1.5 sm:h-1 bg-gray-200 rounded mb-1">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${book.progress?.percentage || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs sm:text-[10px] text-gray-500">
              {book.progress?.percentage >= 100 ? (
                <span className="truncate mr-1">Completed</span>
              ) : book.progress?.percentage > 0 ? (
                <span className="truncate mr-1">
                  {book.progress.percentage}% completed
                </span>
              ) : (
                <span className="truncate mr-1">Not started</span>
              )}
              <span className="whitespace-nowrap">
                {book.progress?.currentPage || 0}/{book.totalPages || 0}
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="book-card bg-white rounded-xl p-3 sm:p-2 flex">
      <div className="book-cover relative mr-3 sm:mr-2 flex-shrink-0">
        <img
          src={getBookCover()}
          alt={`Cover of ${book.name}`}
          className="w-16 h-24 sm:w-12 sm:h-18 object-cover rounded-lg"
          onClick={() => onOpen && onOpen(book)}
        />
        <div className="absolute top-1 right-1">
          <button className="bg-white bg-opacity-80 p-1 sm:p-0.5 rounded-full">
            <FontAwesomeIcon
              icon={isBookmarked ? solidBookmark : regularBookmark}
              className={isBookmarked ? 'text-blue-500' : 'text-gray-500'}
              size="xs"
            />
          </button>
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-800 text-sm sm:text-xs truncate max-w-[70%]">
            {book.name}
          </h3>
          {isReading && (
            <span className="bg-blue-500 text-xs sm:text-[10px] text-white px-1.5 py-0.5 rounded-full whitespace-nowrap">
              Reading
            </span>
          )}
        </div>

        <p className="text-gray-500 text-xs sm:text-[10px] mb-2 truncate">
          {book.author}
        </p>

        {showProgress && (
          <>
            <div className="progress-bar h-1.5 sm:h-1 bg-gray-200 rounded mb-1">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${book.progress?.percentage || 0}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-xs sm:text-[10px] text-gray-500">
              {book.progress?.percentage >= 100 ? (
                <span className="truncate mr-1">Completed</span>
              ) : book.progress?.percentage > 0 ? (
                <span className="truncate mr-1">
                  {book.progress.percentage}% completed
                </span>
              ) : (
                <span className="truncate mr-1">Not started</span>
              )}
              <span className="whitespace-nowrap">
                {book.progress?.currentPage || 0}/{book.totalPages || 0}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCard;
