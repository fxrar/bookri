import React from 'react';

const SettingsPanel = ({
  isOpen,
  fontSize,
  lineSpacing,
  theme,
  onClose,
  onFontSizeChange,
  onLineSpacingChange,
  onThemeChange,
}) => {
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
              onClick={() => fontSize > 12 && onFontSizeChange(fontSize - 1)}
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
              onClick={() => fontSize < 24 && onFontSizeChange(fontSize + 1)}
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
              onClick={() =>
                lineSpacing > 1.2 && onLineSpacingChange(lineSpacing - 0.1)
              }
            >
              <i className="fas fa-compress-alt text-gray-600 text-xs"></i>
            </button>
            <div className="flex-1 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${((lineSpacing - 1.2) / 0.8) * 100}%` }}
              ></div>
            </div>
            <button
              className="font-size-btn"
              onClick={() =>
                lineSpacing < 2 && onLineSpacingChange(lineSpacing + 0.1)
              }
            >
              <i className="fas fa-expand-alt text-gray-600 text-xs"></i>
            </button>
          </div>
        </div>

        {}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Theme</h3>
          <div className="grid grid-cols-4 gap-3">
            <div
              className={`theme-option p-3 bg-white ${theme === 'light' ? 'border-blue-500' : 'border-gray-200'} border rounded-lg flex items-center justify-center cursor-pointer`}
              onClick={() => onThemeChange('light')}
            >
              <div className="w-5 h-5 rounded-full bg-white border border-gray-300"></div>
            </div>
            <div
              className={`theme-option p-3 bg-gray-100 ${theme === 'gray' ? 'border-blue-500' : 'border-gray-200'} border rounded-lg flex items-center justify-center cursor-pointer`}
              onClick={() => onThemeChange('gray')}
            >
              <div className="w-5 h-5 rounded-full bg-gray-100 border border-gray-300"></div>
            </div>
            <div
              className={`theme-option p-3 bg-yellow-50 ${theme === 'sepia' ? 'border-blue-500' : 'border-gray-200'} border rounded-lg flex items-center justify-center cursor-pointer`}
              onClick={() => onThemeChange('sepia')}
            >
              <div className="w-5 h-5 rounded-full bg-yellow-50 border border-gray-300"></div>
            </div>
            <div
              className={`theme-option p-3 bg-gray-800 ${theme === 'dark' ? 'border-blue-500' : 'border-gray-200'} border rounded-lg flex items-center justify-center cursor-pointer`}
              onClick={() => onThemeChange('dark')}
            >
              <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
