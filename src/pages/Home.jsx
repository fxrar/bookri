import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBooks, addBook, init } from '../db/bookDb';
import Header from '../components/Header';
import ReadingAssistant from '../components/ReadingAssistant';
import DailyGoal from '../components/DailyGoal';
import SectionHeader from '../components/SectionHeader';
import ContinueReadingCard from '../components/ContinueReadingCard';
import BookCard from '../components/BookCard';
import BookUploader from '../components/BookUploader';
import BookList from '../components/BookList';
import ReadingTip from '../components/ReadingTip';
import NavBar from '../components/NavBar';

function Home() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('home-tab');
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('Initializing database...');
        await init();
        console.log('Database initialized, loading books...');

        const allBooks = await getBooks();
        console.log('Books loaded:', allBooks);
        setBooks(allBooks);
      } catch (error) {
        console.error('Error initializing database:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDatabase();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleOpenBook = (book) => {
    navigate(`/reader?id=${book.id}`);
  };

  const getContinueReadingBook = () => {
    if (books.length === 0) return null;

    return books.sort((a, b) => {
      if (b.progress.percentage !== a.progress.percentage) {
        return b.progress.percentage - a.progress.percentage;
      }
      if (a.progress.lastReadDate && b.progress.lastReadDate) {
        return (
          new Date(b.progress.lastReadDate) - new Date(a.progress.lastReadDate)
        );
      }
      return new Date(b.addedDate) - new Date(a.addedDate);
    })[0];
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getRecentlyAddedBooks = () => {
    return [...books]
      .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
      .slice(0, 4);
  };

  const continueReadingBook = getContinueReadingBook();
  const recentlyAddedBooks = getRecentlyAddedBooks();

  return (
    <div className="bg-gray-50 h-screen">
      {}
      <div className="h-full pb-20 overflow-auto">
        {}
        <div id="home-tab" className="px-4 pt-6">
          <Header date={formattedDate} />
          {}
          <DailyGoal />

          <SectionHeader title="Continue Reading" linkText="See all" />
          <ContinueReadingCard
            book={continueReadingBook}
            onOpen={handleOpenBook}
          />

          <SectionHeader title="Recently Added" linkText="See all" />
          <div className="flex space-x-4 overflow-x-auto pb-2 mb-6">
            {recentlyAddedBooks.length > 0 ? (
              recentlyAddedBooks.map((book) => (
                <BookCard key={book.id} book={book} onOpen={handleOpenBook} />
              ))
            ) : (
              <div className="w-full text-center py-4">
                <p className="text-gray-500">No books added yet</p>
              </div>
            )}
          </div>

          <SectionHeader title={`Your Library (${books.length})`} />
          <div className="mb-6">
            <BookList
              books={books}
              loading={loading}
              onOpenBook={handleOpenBook}
              formatFileSize={formatFileSize}
            />
          </div>

          <ReadingTip />
        </div>
      </div>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Home;
