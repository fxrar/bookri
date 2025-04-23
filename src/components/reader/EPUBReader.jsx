import React, { useState, useEffect, useRef } from 'react';
import ePub from 'epubjs';

const EPUBReader = ({ content, currentPage, onPageChange, totalPages }) => {
  const viewerRef = useRef(null);
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);

  useEffect(() => {
    if (!content || !viewerRef.current) return;

    try {
      const binary = atob(content);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: 'application/epub+zip' });

      const url = URL.createObjectURL(blob);

      const epubBook = ePub(url);
      setBook(epubBook);

      const epubRendition = epubBook.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        spread: 'none',
      });

      setRendition(epubRendition);

      epubRendition.display();

      return () => {
        if (epubRendition) {
          epubRendition.destroy();
        }
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Error initializing EPUB reader:', error);
    }
  }, [content]);

  useEffect(() => {
    if (!rendition || !book) return;

    const spine = book.spine.items;

    if (spine.length > 0) {
      const spineIndex = Math.min(
        Math.floor((currentPage / totalPages) * spine.length),
        spine.length - 1
      );

      rendition.display(spine[spineIndex].href);
    }
  }, [rendition, book, currentPage, totalPages]);

  useEffect(() => {
    if (!rendition) return;

    const handleKeyPress = (event) => {
      if (event.key === 'ArrowRight') {
        rendition.next();
        onPageChange(Math.min(totalPages, currentPage + 1));
      } else if (event.key === 'ArrowLeft') {
        rendition.prev();
        onPageChange(Math.max(1, currentPage - 1));
      }
    };

    document.addEventListener('keyup', handleKeyPress);

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (event) => {
      touchStartX = event.changedTouches[0].screenX;
    };

    const handleTouchEnd = (event) => {
      touchEndX = event.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchEndX - touchStartX > swipeThreshold) {
        rendition.prev();
        onPageChange(Math.max(1, currentPage - 1));
      } else if (touchStartX - touchEndX > swipeThreshold) {
        rendition.next();
        onPageChange(Math.min(totalPages, currentPage + 1));
      }
    };

    const element = viewerRef.current;
    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('keyup', handleKeyPress);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [rendition, currentPage, totalPages, onPageChange]);

  return (
    <div
      ref={viewerRef}
      className="reader-content w-full h-full bg-white"
      style={{
        fontSize: '16px',
        lineHeight: '1.7',
      }}
    ></div>
  );
};

export default EPUBReader;
