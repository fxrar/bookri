import React from 'react';

const StatsTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['Weekly', 'Monthly', 'Yearly', 'All Time'];

  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto py-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === tab.toLowerCase()
              ? 'active'
              : 'text-gray-600 bg-white'
          }`}
          onClick={() => onTabChange(tab.toLowerCase())}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default StatsTabs;
