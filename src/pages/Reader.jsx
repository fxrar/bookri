import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import { getBook } from '../db/bookDb';
import progressUpdater from '../utils/progressUpdater';
import EPUBReader from '../components/reader/EPUBReader';
import ReaderHeader from '../components/reader/ReaderHeader';
import ReaderFooter from '../components/reader/ReaderFooter';
import LoadingScreen from '../components/reader/LoadingScreen';
import ErrorScreen from '../components/reader/ErrorScreen';
import GoalAchievementNotification from '../components/reader/GoalAchievementNotification';
import './reader.css';

const Reader = () => {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('id');

  const [book, setBook] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [lastSavedPage, setLastSavedPage] = useState(0);
  const [documentLoaded, setDocumentLoaded] = useState(false);
  const [readingStartTime, setReadingStartTime] = useState(null);
  const [goalAchievement, setGoalAchievement] = useState(null);
  const isAndroid =
    Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android';

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const { jumpToPage } = pageNavigationPluginInstance;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
  });

  useEffect(() => {
    const loadBook = async () => {
      try {
        if (!bookId) {
          throw new Error('Book ID is required');
        }

        const bookData = await getBook(bookId);
        if (!bookData) {
          throw new Error('Book not found');
        }

        const lastReadPage =
          bookData.progress && bookData.progress.currentPage
            ? parseInt(bookData.progress.currentPage)
            : 1;

        setBook(bookData);
        setCurrentPage(lastReadPage);
        setLastSavedPage(lastReadPage);
        setTotalPages(bookData.totalPages);

        setReadingStartTime(new Date());

        console.log(
          `Starting from page ${lastReadPage} of ${bookData.totalPages}`
        );

        const filePath = bookData.fileLocation;
        const fileFormat = bookData.fileFormat.toLowerCase();

        if (fileFormat !== 'pdf' && fileFormat !== 'epub') {
          throw new Error(`Unsupported file format: ${fileFormat}`);
        }

        console.log('Attempting to read file:', filePath);

        let fileData;

        if (Capacitor.isNativePlatform() && filePath.startsWith('file://')) {
          try {
            const webViewPath = Capacitor.convertFileSrc(filePath);
            console.log('Converted file path for webview:', webViewPath);

            const response = await fetch(webViewPath);
            const blob = await response.blob();

            const reader = new FileReader();

            fileData = await new Promise((resolve, reject) => {
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            if (fileFormat === 'epub') {
              fileData = fileData.split(',')[1];
            }
          } catch (fetchErr) {
            console.error('Error fetching file with convertFileSrc:', fetchErr);
          }
        }

        if (!fileData) {
          const directories = [null, Directory.Documents, Directory.Data];

          for (const directory of directories) {
            try {
              const options = { path: filePath };
              if (directory) options.directory = directory;

              const result = await Filesystem.readFile(options);

              if (fileFormat === 'pdf') {
                fileData = `data:application/pdf;base64,${result.data}`;
              } else {
                fileData = result.data;
              }

              console.log(
                `Successfully read file using directory: ${directory || 'none'}`
              );
              break;
            } catch (fsErr) {
              console.error(
                `Failed to read with directory ${directory || 'none'}:`,
                fsErr
              );
            }
          }
        }

        if (!fileData) {
          throw new Error(
            'Could not read book file. Please try re-adding the book.'
          );
        }

        setFileContent(fileData);
        setLoading(false);
        setInitialLoadDone(true);
      } catch (err) {
        console.error('Error loading book:', err);
        setError(err.message || 'Failed to load book');
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId]);

  useEffect(() => {
    if (
      documentLoaded &&
      book?.fileFormat?.toLowerCase() === 'pdf' &&
      currentPage > 1
    ) {
      console.log(`Document loaded, jumping to page ${currentPage - 1}`);

      setTimeout(() => {
        try {
          jumpToPage(currentPage - 1);
        } catch (err) {
          console.error('Error jumping to page:', err);
        }
      }, 300);
    }
  }, [documentLoaded, book, currentPage, jumpToPage]);

  useEffect(() => {
    return () => {
      if (book && initialLoadDone && currentPage !== lastSavedPage) {
        recordFinalReadingSession();
      }
    };
  }, [book, initialLoadDone, currentPage, lastSavedPage]);

  useEffect(() => {
    if (!initialLoadDone || loading || !book) return;

    if (currentPage === lastSavedPage) return;

    const timer = setTimeout(async () => {
      try {
        const startPage = lastSavedPage;

        if (Math.abs(currentPage - startPage) >= 1) {
          const result = await progressUpdater.updateReadingProgress(
            book.id,
            startPage,
            currentPage,
            readingStartTime,
            new Date(),
            null
          );

          console.log(`Progress updated: Page ${currentPage}/${totalPages}`);

          if (result.goalsStatus?.newlyAchieved?.daily) {
            setGoalAchievement({
              type: 'daily',
              message: 'Daily reading goal achieved! 🎉',
              details: `You've read ${result.dailyProgress.totalPagesRead} pages today!`,
            });

            setTimeout(() => setGoalAchievement(null), 5000);
          }

          setReadingStartTime(new Date());
          setLastSavedPage(currentPage);
        }
      } catch (err) {
        console.error('Error updating progress:', err);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    currentPage,
    book,
    totalPages,
    loading,
    initialLoadDone,
    lastSavedPage,
    readingStartTime,
  ]);

  const recordFinalReadingSession = async () => {
    if (!book || !readingStartTime) return;

    try {
      const result = await progressUpdater.updateReadingProgress(
        book.id,
        lastSavedPage,
        currentPage,
        readingStartTime,
        new Date()
      );

      console.log('Final reading session recorded:', result);
    } catch (err) {
      console.error('Error recording final reading session:', err);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (!book) return;

    const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));

    setCurrentPage(validPageNumber);
  };

  const handlePdfPageChange = (e) => {
    if (!documentLoaded) {
      console.log('Ignoring page change event before document is fully loaded');
      return;
    }

    const newPage = e.currentPage + 1;
    console.log(`PDF page changed to: ${newPage}`);
    handlePageChange(newPage);
  };

  const handleDocumentLoad = (doc) => {
    console.log(`PDF document loaded with ${doc.numPages} pages`);

    if (doc.numPages && doc.numPages !== totalPages) {
      setTotalPages(doc.numPages);
    }

    setDocumentLoaded(true);
  };

  const handleAddBookmark = async () => {
    console.log('Bookmark added at page', currentPage);
  };

  if (loading) {
    return <LoadingScreen message="Loading your book..." />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!book || !fileContent) {
    return <ErrorScreen message="Could not load book" />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ReaderHeader
        title={book.name}
        author={book.author}
        onBack={() => {
          recordFinalReadingSession().then(() => window.history.back());
        }}
        onBookmark={handleAddBookmark}
      />

      <div className="flex-1 overflow-auto">
        {book.fileFormat.toLowerCase() === 'pdf' ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileContent}
              plugins={[
                defaultLayoutPluginInstance,
                pageNavigationPluginInstance,
              ]}
              defaultScale={SpecialZoomLevel.PageFit}
              onPageChange={handlePdfPageChange}
              onDocumentLoad={handleDocumentLoad}
            />
          </Worker>
        ) : (
          <EPUBReader
            content={fileContent}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        )}
      </div>

      <ReaderFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        bookId={book.id}
      />

      {}
      {goalAchievement && (
        <GoalAchievementNotification
          type={goalAchievement.type}
          message={goalAchievement.message}
          details={goalAchievement.details}
          onDismiss={() => setGoalAchievement(null)}
        />
      )}
    </div>
  );
};

export default Reader;
