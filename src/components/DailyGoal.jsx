import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

import goalsDb from '../db/goalsDb';
import readDataDb from '../db/readDataDb';
import progressUpdater from '../utils/progressUpdater';

const DailyGoal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dailyTarget, setDailyTarget] = useState('30M');
  const [currentProgress, setCurrentProgress] = useState('0M');
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadGoalData();
  }, []);

  const loadGoalData = async () => {
    try {
      setIsLoading(true);

      const goalsData = await goalsDb.getGoals();
      setDailyTarget(goalsData.daily.duration);

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const todayData = await readDataDb.getReadDataForDate(todayStr);
      setCurrentProgress(todayData?.totalDurationSpent || '0M');

      const streakInfo = await progressUpdater.getReadingStreak();
      setCurrentStreak(streakInfo.currentStreak);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading goal data:', error);
      setIsLoading(false);
    }
  };

  const calculateProgressPercentage = () => {
    if (!dailyTarget || !currentProgress) return 0;

    const targetMinutes = convertDurationToMinutes(dailyTarget);
    const progressMinutes = convertDurationToMinutes(currentProgress);

    return targetMinutes > 0
      ? Math.min(100, Math.round((progressMinutes / targetMinutes) * 100))
      : 0;
  };

  const calculateRemainingTime = () => {
    if (!dailyTarget || !currentProgress) return '0 minutes';

    const targetMinutes = convertDurationToMinutes(dailyTarget);
    const progressMinutes = convertDurationToMinutes(currentProgress);
    const remainingMinutes = Math.max(0, targetMinutes - progressMinutes);

    return remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
  };

  const convertDurationToMinutes = (duration) => {
    if (!duration) return 0;

    try {
      const unit = duration.slice(-1).toUpperCase();
      const value = parseFloat(duration.slice(0, -1));

      if (isNaN(value)) return 0;

      switch (unit) {
        case 'H':
          return value * 60;
        case 'M':
          return value;
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error converting duration to minutes:', error);
      return 0;
    }
  };

  const formatDailyTarget = (duration) => {
    if (!duration) return '0 min / day';

    const minutes = convertDurationToMinutes(duration);
    return `${minutes} min / day`;
  };

  const formatDurationForDisplay = (duration) => {
    if (!duration) return '0 minutes';

    const minutes = convertDurationToMinutes(duration);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  };

  const handleAdjustGoal = () => {
    navigate('/goals');
  };

  const progressPercentage = calculateProgressPercentage();
  const remainingTime = calculateRemainingTime();

  return (
    <div className="bg-white rounded-xl p-4 mb-6 ">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-800">Daily Goal</h2>
        <span className="text-blue-500 text-sm font-medium">
          {isLoading ? 'Loading...' : formatDailyTarget(dailyTarget)}
        </span>
      </div>

      <ProgressBar percentage={isLoading ? 0 : progressPercentage} />

      <div className="flex justify-between text-sm mt-2">
        <span className="text-gray-600">
          {isLoading
            ? 'Loading...'
            : formatDurationForDisplay(currentProgress) + ' today'}
        </span>
        <span className="text-gray-600">
          {isLoading ? '' : remainingTime + ' left'}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <FontAwesomeIcon icon={faFire} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Current streak</p>
            <p className="font-semibold text-gray-800">
              {isLoading
                ? 'Loading...'
                : `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        <button
          className="text-blue-500 text-sm font-medium"
          onClick={handleAdjustGoal}
          disabled={isLoading}
          aria-label="Adjust reading goal"
        >
          Adjust Goal{' '}
          <FontAwesomeIcon icon={faChevronRight} className="text-xs ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DailyGoal;
