import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSearch,
  faTh,
  faList,
  faBrain,
  faLightbulb,
  faChartLine,
  faHistory,
  faBook,
  faGraduationCap,
  faFlask,
  faLeaf,
} from '@fortawesome/free-solid-svg-icons';
import BookCard from '../components/BookCard';
import NavBar from '../components/NavBar';
import { getBooks } from '../db/bookDb';
import AddBookModal from '../components/AddBookModal';
import { useNavigate } from 'react-router-dom';

const CATEGORY_ICONS = {
  'Self Improvement': { icon: faBrain, color: 'blue' },
  Philosophy: { icon: faLightbulb, color: 'purple' },
  Business: { icon: faChartLine, color: 'green' },
  History: { icon: faHistory, color: 'yellow' },
  Science: { icon: faFlask, color: 'red' },
  Fiction: { icon: faBook, color: 'indigo' },
  Education: { icon: faGraduationCap, color: 'orange' },
  Nature: { icon: faLeaf, color: 'emerald' },
};

const DEFAULT_CATEGORY = { icon: faBook, color: 'gray' };

const COLOR_CLASSES = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-500' },
  green: { bg: 'bg-green-100', text: 'text-green-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-500' },
  red: { bg: 'bg-red-100', text: 'text-red-500' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-500' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-500' },
  gray: { bg: 'bg-gray-100', text: 'text-gray-500' },
};

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState('recentlyAdded');
  const [viewMode, setViewMode] = useState('grid');
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(8);
  const [activeCollection, setActiveCollection] = useState('All Books');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const booksData = await getBooks();
    setBooks(booksData || []);
    console.log('Books loaded:', booksData);

    generateCollections(booksData || []);
  };

  const generateCollections = (booksData) => {
    const categoryMap = new Map();

    booksData.forEach((book) => {
      const categories = book.metadata?.categories || [];

      categories.forEach((category) => {
        if (categoryMap.has(category)) {
          categoryMap.set(category, categoryMap.get(category) + 1);
        } else {
          categoryMap.set(category, 1);
        }
      });
    });

    const collectionArray = Array.from(categoryMap.entries()).map(
      ([name, count], index) => {
        const { icon, color } = CATEGORY_ICONS[name] || DEFAULT_CATEGORY;

        return {
          id: index + 1,
          name,
          count,
          icon,
          color,
        };
      }
    );

    const allCollection = {
      id: 0,
      name: 'All Books',
      count: booksData.length,
      icon: faBook,
      color: 'blue',
    };

    const sortedCollections = collectionArray.sort((a, b) => b.count - a.count);

    setCollections([allCollection, ...sortedCollections]);
  };

  const searchBooks = (books, query) => {
    if (!query || query.trim() === '') return books;

    const lowercaseQuery = query.toLowerCase().trim();

    return books.filter((book) => {
      // Search in title
      if (book.name && book.name.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }

      // Search in author
      if (book.author && book.author.toLowerCase().includes(lowercaseQuery)) {
        return true;
      }

      // Search in description
      if (
        book.description &&
        book.description.toLowerCase().includes(lowercaseQuery)
      ) {
        return true;
      }

      // Search in categories
      if (book.metadata && book.metadata.categories) {
        return book.metadata.categories.some((category) =>
          category.toLowerCase().includes(lowercaseQuery)
        );
      }

      // If no match found
      return false;
    });
  };

  // Filter books based on active tab, active collection, and search query
  const getFilteredBooks = () => {
    // First, filter by active tab
    let result = books.filter((book) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'reading') {
        return book.progress?.percentage > 0 && book.progress?.percentage < 100;
      }
      if (activeTab === 'completed') {
        return book.progress?.percentage >= 100;
      }
      if (activeTab === 'bookmarked') {
        return book.bookmarks && book.bookmarks.length > 0;
      }
      return true;
    });

    if (activeCollection !== 'All Books') {
      result = result.filter((book) =>
        book.metadata?.categories?.includes(activeCollection)
      );
    }

    if (searchQuery) {
      result = searchBooks(result, searchQuery);
    }

    return result;
  };

  const filteredBooks = getFilteredBooks();

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'recentlyAdded') {
      return new Date(b.addedDate || 0) - new Date(a.addedDate || 0);
    }
    if (sortBy === 'titleAZ') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'authorAZ') {
      return a.author.localeCompare(b.author);
    }
    if (sortBy === 'progress') {
      return (b.progress?.percentage || 0) - (a.progress?.percentage || 0);
    }
    return 0;
  });

  const counts = {
    all: books.length,
    reading: books.filter(
      (book) => book.progress?.percentage > 0 && book.progress?.percentage < 100
    ).length,
    completed: books.filter((book) => book.progress?.percentage >= 100).length,
    bookmarked: books.filter(
      (book) => book.bookmarks && book.bookmarks.length > 0
    ).length,
  };

  const stats = {
    totalBooks: books.length,
    completed: books.filter((book) => book.progress?.percentage >= 100).length,
    inProgress: books.filter(
      (book) => book.progress?.percentage > 0 && book.progress?.percentage < 100
    ).length,
    totalPagesRead: books.reduce(
      (total, book) => total + (book.progress?.currentPage || 0),
      0
    ),
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCollectionSelect = (collectionName) => {
    setActiveCollection(collectionName);
    console.log(`Selected collection: ${collectionName}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);

    setDisplayLimit(8);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle book opening - fixed to pass current page
  const handleOpenBook = (book) => {
    const currentPage = book.progress?.currentPage || 1;
    navigate(`/reader?id=${book.id}&page=${currentPage}`);
  };

  // Handle book addition
  const handleBookAdded = async () => {
    await loadBooks(); // Reload all books after adding a new one
  };

  // Handle create collection
  const handleCreateCollection = () => {
    // Implementation for creating a new collection
    console.log('Create new collection');
  };

  return (
    <div className="bg-gray-50 h-screen">
      {}
      <div className="h-full pb-20 overflow-auto">
        <div className="px-4 pt-6">
          {}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Library</h1>
              <p className="text-gray-600 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
                onClick={toggleModal}
              >
                <FontAwesomeIcon icon={faPlus} className="text-gray-500" />
              </button>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">JD</span>
              </div>
            </div>
          </div>

          {}
          <div className="mb-6">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 pr-10 text-sm"
                placeholder="Search books, authors, or genres..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            {activeCollection !== 'All Books' && (
              <div className="mt-2 flex items-center">
                <span className="text-sm text-gray-600 mr-2">
                  Filtering by collection:
                </span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                  {activeCollection}
                  <button
                    className="ml-1 text-blue-400 hover:text-blue-600"
                    onClick={() => setActiveCollection('All Books')}
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {}
          <div className="flex space-x-2 mb-6 overflow-x-auto py-1">
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('all')}
            >
              All Books ({counts.all})
            </button>
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'reading' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('reading')}
            >
              Currently Reading ({counts.reading})
            </button>
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('completed')}
            >
              Completed ({counts.completed})
            </button>
            <button
              className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'bookmarked' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => handleTabChange('bookmarked')}
            >
              Bookmarked ({counts.bookmarked})
            </button>
          </div>

          {}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recentlyAdded">Recently Added</option>
                <option value="titleAZ">Title (A-Z)</option>
                <option value="authorAZ">Author (A-Z)</option>
                <option value="progress">Progress</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                className={`border border-gray-200 rounded-lg p-1.5 ${viewMode === 'grid' ? 'bg-blue-500' : 'bg-white'}`}
                onClick={() => setViewMode('grid')}
              >
                <FontAwesomeIcon
                  icon={faTh}
                  className={
                    viewMode === 'grid' ? 'text-white' : 'text-gray-400'
                  }
                />
              </button>
              <button
                className={`border border-gray-200 rounded-lg p-1.5 ${viewMode === 'list' ? 'bg-blue-500' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                <FontAwesomeIcon
                  icon={faList}
                  className={
                    viewMode === 'list' ? 'text-white' : 'text-gray-400'
                  }
                />
              </button>
            </div>
          </div>

          {}
          {(searchQuery || activeCollection !== 'All Books') && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {sortedBooks.length === 0
                  ? 'No books found matching your criteria'
                  : `Found ${sortedBooks.length} ${sortedBooks.length === 1 ? 'book' : 'books'} matching your criteria`}
              </p>
            </div>
          )}

          {}
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 gap-4 mb-6'
                : 'flex flex-col space-y-3 mb-6'
            }
          >
            {sortedBooks.length > 0 ? (
              sortedBooks
                .slice(0, displayLimit)
                .map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    viewMode={viewMode}
                    showProgress={true}
                    onOpen={handleOpenBook}
                  />
                ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500">
                  {searchQuery || activeCollection !== 'All Books'
                    ? 'No books found matching your search criteria. Try a different search term or clear filters.'
                    : 'No books found. Add books to your library!'}
                </p>
                {(searchQuery || activeCollection !== 'All Books') && (
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCollection('All Books');
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {}
          {sortedBooks.length > displayLimit && (
            <div className="flex justify-center mb-6">
              <button
                className="bg-white border border-gray-200 text-gray-600 text-sm py-2 px-4 rounded-lg"
                onClick={() => setDisplayLimit((prev) => prev + 8)}
              >
                Load More Books
              </button>
            </div>
          )}

          {}
          <div className="bg-white rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">
              Library Statistics
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Books</p>
                <p className="font-semibold text-gray-800 text-xl">
                  {stats.totalBooks}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="font-semibold text-gray-800 text-xl">
                  {stats.completed}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="font-semibold text-gray-800 text-xl">
                  {stats.inProgress}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-600">Total Pages Read</p>
              <p className="font-medium text-gray-800">
                {stats.totalPagesRead.toLocaleString()}
              </p>
            </div>
          </div>

          {}
          <h2 className="font-semibold text-gray-800 mb-3">My Collections</h2>
          <div className="flex space-x-3 overflow-x-auto pb-4 mb-6">
            {collections.map((collection) => {
              const colorBg =
                COLOR_CLASSES[collection.color]?.bg || 'bg-gray-100';
              const colorText =
                COLOR_CLASSES[collection.color]?.text || 'text-gray-500';

              return (
                <div
                  key={collection.id}
                  className={`flex-shrink-0 w-40 bg-white rounded-xl p-3 cursor-pointer hover:-md transition- ${activeCollection === collection.name ? 'border-2 border-blue-500' : ''}`}
                  onClick={() => handleCollectionSelect(collection.name)}
                >
                  <div
                    className={`h-20 ${colorBg} rounded-lg flex items-center justify-center mb-2`}
                  >
                    <FontAwesomeIcon
                      icon={collection.icon}
                      className={`${colorText} text-2xl`}
                    />
                  </div>
                  <h3 className="font-medium text-gray-800 text-sm">
                    {collection.name}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {collection.count} books
                  </p>
                </div>
              );
            })}

            {}
            <div
              className="flex-shrink-0 w-40 bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={handleCreateCollection}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <FontAwesomeIcon icon={faPlus} className="text-blue-500" />
              </div>
              <p className="text-gray-600 text-sm text-center">
                Create New Collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <NavBar activePage="books" />

      {}
      {showModal && (
        <AddBookModal onClose={toggleModal} onBookAdded={handleBookAdded} />
      )}
    </div>
  );
};

export default Books;
