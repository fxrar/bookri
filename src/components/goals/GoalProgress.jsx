import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faEdit } from '@fortawesome/free-solid-svg-icons';
import { formatDurationForDisplay } from '../../utils/timeUtils';

const GoalProgress = ({
  progressPercentage,
  dailyStats,
  remainingTime,
  onAdjustGoal,
  isSaving,
}) => {
  const normalizedProgress = Number(progressPercentage) || 0;

  return (
    <div className="bg-white rounded-xl p-6 mb-6 flex flex-col items-center sm:p-4">
      <h2 className="font-semibold text-gray-800 mb-4 self-start text-lg sm:text-base">
        Today's Progress
      </h2>

      <div
        className="circle-progress mb-4 relative inline-flex justify-center items-center"
        style={{ '--percent': normalizedProgress }}
      >
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          className="sm:w-28 sm:h-28"
        >
          <circle className="circle-bg" cx="75" cy="75" r="67.5"></circle>
          {normalizedProgress > 0 && (
            <circle
              className="circle-progress-value"
              cx="75"
              cy="75"
              r="67.5"
            ></circle>
          )}
        </svg>
        <div className="circle-text absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-800 sm:text-2xl">
            {normalizedProgress}%
          </div>
          <div className="text-base text-gray-500 sm:text-sm">Completed</div>
        </div>
      </div>

      <div className="w-full mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600 sm:text-xs truncate max-w-[45%]">
            {formatDurationForDisplay(dailyStats.totalDurationSpent)} today
          </span>
          <span className="text-sm text-gray-600 sm:text-xs truncate max-w-[45%]">
            {remainingTime} left
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${normalizedProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex space-x-3 w-full sm:flex-col sm:space-x-0 sm:space-y-2 sm:items-stretch">
        <Link
          to="/books"
          className="bg-blue-500 text-white text-sm py-2 px-4 rounded-lg sm:text-xs sm:py-1.5 sm:px-3 text-center whitespace-nowrap overflow-hidden text-ellipsis flex-1 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faBookOpen} className="mr-2 flex-shrink-0" />
          <span className="truncate">Start Reading</span>
        </Link>
        <button
          className={`${
            isSaving ? 'bg-gray-300' : 'bg-gray-100'
          } text-gray-600 text-sm py-2 px-4 rounded-lg sm:text-xs sm:py-1.5 sm:px-3 whitespace-nowrap overflow-hidden text-ellipsis flex-1 flex items-center justify-center`}
          onClick={onAdjustGoal}
          disabled={isSaving}
          aria-label="Adjust reading goal"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2 flex-shrink-0" />
          <span className="truncate">Adjust Goal</span>
        </button>
      </div>
    </div>
  );
};

export default GoalProgress;
