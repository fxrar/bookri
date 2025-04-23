import React, { useState } from 'react';

const SettingsPanel = ({ isOpen, onClose, bookId }) => {
  const [fontSize, setFontSize] = useState(16);
  const [lineSpacing, setLineSpacing] = useState(1.7);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleFontSizeChange = (newSize) => {
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
      document
        .querySelector('.reader-content')
        ?.style.setProperty('font-size', `${newSize}px`);
    }
  };

  const handleLineSpacingChange = (newSpacing) => {
    if (newSpacing >= 1.2 && newSpacing <= 2.2) {
      setLineSpacing(newSpacing);
      document
        .querySelector('.reader-content')
        ?.style.setProperty('line-height', newSpacing);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);

    if (!isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.setProperty('--bg-color', '#121212');
      document.documentElement.style.setProperty('--text-color', '#e0e0e0');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.style.setProperty('--bg-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color', '#333333');
    }
  };

  return (
    <div
      className={`settings-panel bg-white rounded-t-xl p-4 ${isOpen ? 'open' : ''}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">Reading Settings</h2>
        <button className="p-2" onClick={onClose}>
          <i className="fas fa-times text-gray-600"></i>
        </button>
      </div>

      <div className="space-y-5">
        {}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Font Size</h3>
          <div className="font-size-control">
            <button
              className="font-size-btn"
              onClick={() => handleFontSizeChange(fontSize - 1)}
              disabled={fontSize <= 12}
            >
              <i className="fas fa-minus text-gray-600 text-xs"></i>
            </button>
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${((fontSize - 12) / 12) * 100}%` }}
              ></div>
            </div>
            <button
              className="font-size-btn"
              onClick={() => handleFontSizeChange(fontSize + 1)}
              disabled={fontSize >= 24}
            >
              <i className="fas fa-plus text-gray-600 text-xs"></i>
            </button>
          </div>
        </div>

        {}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Line Spacing</h3>
          <div className="font-size-control">
            <button
              className="font-size-btn"
              onClick={() => handleLineSpacingChange(lineSpacing - 0.1)}
              disabled={lineSpacing <= 1.2}
            >
              <i className="fas fa-compress-alt text-gray-600 text-xs"></i>
            </button>
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${((lineSpacing - 1.2) / 1) * 100}%` }}
              ></div>
            </div>
            <button
              className="font-size-btn"
              onClick={() => handleLineSpacingChange(lineSpacing + 0.1)}
              disabled={lineSpacing >= 2.2}
            >
              <i className="fas fa-expand-alt text-gray-600 text-xs"></i>
            </button>
          </div>
        </div>

        {}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Theme</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="theme-option p-3 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
            </div>
            <div className="theme-option p-3 bg-gray-100 border border-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-300"></div>
            </div>
            <div className="theme-option p-3 bg-yellow-50 border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-yellow-50 border border-gray-300"></div>
            </div>
            <div className="theme-option p-3 bg-gray-800 border border-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700"></div>
            </div>
          </div>
        </div>

        {}
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">Dark Mode</h3>
          <div
            className={`theme-toggle ${isDarkMode ? 'dark' : ''}`}
            onClick={toggleDarkMode}
          >
            <div className="theme-toggle-circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
