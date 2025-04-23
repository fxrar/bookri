import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faCheck } from '@fortawesome/free-solid-svg-icons';

const WEEKDAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const StreakDisplay = ({ currentStreak, bestStreak }) => (
  <div className="bg-white rounded-xl p-4 mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FontAwesomeIcon icon={faFire} className="text-blue-500 text-xl" />
        </div>
        <div>
          <p className="font-medium text-gray-800">Current Streak</p>
          <p className="text-2xl font-bold text-blue-500">
            {currentStreak} days
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 text-right">Longest</p>
        <p className="font-medium text-gray-800">{bestStreak} days</p>
      </div>
    </div>

    <div className="flex justify-between mb-2">
      <p className="text-sm text-gray-600">Last 7 days</p>
    </div>

    <div className="flex justify-between">
      {WEEKDAY_LETTERS.map((day, index) => {
        const isActive = index < currentStreak % 7;

        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {isActive ? (
                <FontAwesomeIcon icon={faCheck} className="text-xs" />
              ) : (
                ''
              )}
            </div>
            <span className="text-xs text-gray-500">{day}</span>
          </div>
        );
      })}
    </div>
  </div>
);

export default StreakDisplay;
