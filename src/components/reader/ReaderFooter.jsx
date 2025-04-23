import React, { useState } from 'react';
import SettingsPanel from './SettingsPanel';

const ReaderFooter = ({ currentPage, totalPages, onPageChange, bookId }) => {
  const [showSettings, setShowSettings] = useState(false);

  const percentage =
    totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <>
      {}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex space-x-1">
          <button
            className="tool-button p-2 rounded-lg"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            <i
              className={`fas fa-chevron-left ${currentPage <= 1 ? 'text-gray-300' : 'text-gray-600'}`}
            ></i>
          </button>
        </div>

        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">
            {currentPage}/{totalPages}
          </span>
          <button
            className="tool-button p-2 rounded-lg"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Settings"
          >
            <i className="fas fa-sliders-h text-gray-600"></i>
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            className="tool-button p-2 rounded-lg"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <i
              className={`fas fa-chevron-right ${currentPage >= totalPages ? 'text-gray-300' : 'text-gray-600'}`}
            ></i>
          </button>
        </div>
      </div>

      {}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        bookId={bookId}
      />

      {}
      <div
        className={`overlay ${showSettings ? 'open' : ''}`}
        onClick={() => setShowSettings(false)}
      ></div>
    </>
  );
};

export default ReaderFooter;
