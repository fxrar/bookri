import React from 'react';
import {
  FiBarChart2,
  FiClock,
  FiBookOpen,
  FiCalendar,
  FiCheck,
} from 'react-icons/fi';

const ReadingStatistics = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-4">
        <FiBarChart2 className="text-indigo-500 text-2xl mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">
          Reading Statistics
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center text-blue-600 mb-2">
            <FiBookOpen className="mr-1" />
            <span className="text-sm font-medium">Total Pages</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalPagesRead}
          </div>
          <div className="text-xs text-gray-500">pages read</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center text-green-600 mb-2">
            <FiClock className="mr-1" />
            <span className="text-sm font-medium">Reading Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalDurationSpent}
          </div>
          <div className="text-xs text-gray-500">time spent reading</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center text-purple-600 mb-2">
            <FiCheck className="mr-1" />
            <span className="text-sm font-medium">Books Completed</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.booksCompleted}
          </div>
          <div className="text-xs text-gray-500">books finished</div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center text-yellow-600 mb-2">
            <FiCalendar className="mr-1" />
            <span className="text-sm font-medium">Active Days</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.daysWithActivity}
          </div>
          <div className="text-xs text-gray-500">days with reading</div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center text-red-600 mb-2">
            <FiBookOpen className="mr-1" />
            <span className="text-sm font-medium">Avg Pages/Day</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.averagePagesPerDay}
          </div>
          <div className="text-xs text-gray-500">pages per day</div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center text-indigo-600 mb-2">
            <FiClock className="mr-1" />
            <span className="text-sm font-medium">Avg Time/Day</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {stats.averageDurationPerDay}
          </div>
          <div className="text-xs text-gray-500">reading time per day</div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStatistics;
