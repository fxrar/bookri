import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faFileAlt,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

const BookList = ({ books, loading, onOpenBook, formatFileSize }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const booksPerPage = 3;

  // Filter books based on search term
  useEffect(() => {
    if (!books) return;

    if (searchTerm.trim() === '') {
      setFilteredBooks(books);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = books.filter(
        (book) =>
          book.name.toLowerCase().includes(term) ||
          book.author.toLowerCase().includes(term) ||
          book.fileFormat.toLowerCase().includes(term)
      );
      setFilteredBooks(filtered);
    }

    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, books]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-5 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <FontAwesomeIcon icon={faBookOpen} className="text-blue-500" />
          </div>
          <p className="text-gray-500">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-gray-400 text-xl"
            />
          </div>
          <p className="text-gray-500 mb-1">Your library is empty</p>
          <p className="text-sm text-gray-400">Add books to get started</p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Handle page changes
  const goToPage = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col">
      {}
      {books.length > 5 && (
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search your books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 sm:p-3 pl-8 sm:pl-10 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
        {filteredBooks.length === 0 ? (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-gray-500">No books match your search</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {currentBooks.map((book) => (
              <li
                key={book.id}
                className="transition-colors duration-200 hover:bg-blue-50/30"
              >
                <div className="p-3 sm:p-5 flex items-center gap-2 sm:gap-4">
                  <div className="flex-shrink-0 hidden sm:block">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.name}
                        className="w-12 h-16 sm:w-14 sm:h-20 object-cover rounded-lg"
                      />
                    ) : (
                      <div
                        className={`w-12 h-16 sm:w-14 sm:h-20 rounded-lg flex items-center justify-center text-white ${getBookColor(book.id)}`}
                      >
                        <span className="font-medium text-sm sm:text-base">
                          {getInitials(book.name)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                      {book.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      by {book.author || 'Unknown Author'}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 mt-1 sm:mt-2 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="mr-1 sm:mr-1.5 text-gray-400"
                        />
                        <span>{book.fileFormat.toUpperCase()}</span>
                      </div>

                      {book.fileSize > 0 && (
                        <div className="flex items-center">
                          <span>{formatFileSize(book.fileSize)}</span>
                        </div>
                      )}

                      {book.addedDate && (
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="mr-1 sm:mr-1.5 text-gray-400"
                          />
                          <span>{formatDate(book.addedDate)}</span>
                        </div>
                      )}
                    </div>

                    {book.progress && book.progress.percentage > 0 && (
                      <div className="mt-2 sm:mt-3">
                        <div className="h-1 sm:h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${book.progress.percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span className="text-[10px] sm:text-xs">
                            Page {book.progress.currentPage || 0} of{' '}
                            {book.totalPages}
                          </span>
                          <span className="text-[10px] sm:text-xs">
                            {book.progress.percentage}% complete
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {}
                  <div className="flex-shrink-0">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                      onClick={() => onOpenBook(book)}
                    >
                      Open
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {}
            <div className="flex space-x-1">
              {generatePageNumbers(
                currentPage,
                totalPages,
                window.innerWidth < 640
              ).map((pageNum, index) => (
                <React.Fragment key={index}>
                  {pageNum === '...' ? (
                    <span className="px-2 sm:px-3 py-1 text-gray-500 text-xs sm:text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => goToPage(pageNum)}
                      className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )}
                </React.Fragment>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const generatePageNumbers = (currentPage, totalPages, isMobile = false) => {
  if (totalPages <= (isMobile ? 3 : 7)) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (isMobile) {
    if (currentPage <= 2) {
      return [1, 2, '...', totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, '...', totalPages - 1, totalPages];
    }

    return [1, '...', currentPage, '...', totalPages];
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      '...',
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
};

const getBookColor = (id) => {
  const colors = [
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-teal-500',
  ];

  const colorIndex =
    id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    colors.length;
  return colors[colorIndex];
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default BookList;
