import React, { useState, useEffect } from 'react';
import goalsDb from '../db/goalsDb';
import readDataDb from '../db/readDataDb';
import progressUpdater from '../utils/progressUpdater';
import LoadingScreen from '../components/reader/LoadingScreen';
import { convertDurationToMinutes } from '../utils/timeUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import GoalProgress from '../components/goals/GoalProgress';
import TimeSelector from '../components/goals/TimeSelector';
import ReminderSettings from '../components/goals/ReminderSettings';
import StreakDisplay from '../components/goals/StreakDisplay';
import TipBox from '../components/goals/TipBox';

import '../style/Goals.css';

const Goals = () => {
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [dailyStats, setDailyStats] = useState(null);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });
  const [activeTimeOption, setActiveTimeOption] = useState('30 min');
  const [customTime, setCustomTime] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('20');
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [editedGoals, setEditedGoals] = useState({
    daily: { duration: '30M', pages: 20 },
    notifications: { enabled: true, reminderTime: '20:00' },
  });
  const [isSaving, setIsSaving] = useState(false);

  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const goalsData = await goalsDb.getGoals();
      setGoals(goalsData);
      setEditedGoals(goalsData);
      setReminderEnabled(goalsData.notifications.enabled);

      const timeHour = goalsData.notifications.reminderTime.split(':')[0];
      setReminderTime(timeHour);

      const durationValue = goalsData.daily.duration;
      if (durationValue === '15M') setActiveTimeOption('15 min');
      else if (durationValue === '30M') setActiveTimeOption('30 min');
      else if (durationValue === '45M') setActiveTimeOption('45 min');
      else if (durationValue === '60M') setActiveTimeOption('60 min');
      else {
        setActiveTimeOption('custom');
        const unit = durationValue.slice(-1);
        const value = durationValue.slice(0, -1);
        if (unit === 'M') setCustomTime(value);
        else if (unit === 'H')
          setCustomTime((parseFloat(value) * 60).toString());
      }

      const todayStr = today.toISOString().split('T')[0];
      const todayData = await readDataDb.getReadDataForDate(todayStr);
      setDailyStats(
        todayData || {
          totalPagesRead: 0,
          totalDurationSpent: '0M',
          goalsAchieved: { dailyPages: false, dailyDuration: false },
        }
      );

      const streakInfo = await progressUpdater.getReadingStreak();
      setStreak(streakInfo);

      setLoading(false);
    } catch (error) {
      console.error('Error loading goals data:', error);
      setLoading(false);
    }
  };

  const toggleCustomTimeInput = () => {
    setShowCustomTimeInput(!showCustomTimeInput);
    if (!showCustomTimeInput) {
      setActiveTimeOption('custom');
    }
  };

  const handleTimeOptionClick = async (option, value) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      const updatedGoals = {
        ...editedGoals,
        daily: {
          ...editedGoals.daily,
          duration: value,
        },
      };

      setEditedGoals(updatedGoals);
      setActiveTimeOption(option);

      await goalsDb.updateDailyGoals({
        duration: value,
        pages: parseInt(updatedGoals.daily.pages) || 20,
      });

      const refreshedGoals = await goalsDb.getGoals();
      setGoals(refreshedGoals);

      console.log('Time option saved successfully');
    } catch (error) {
      console.error('Error saving time option:', error);
      alert('Failed to save goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomTimeChange = (e) => {
    setCustomTime(e.target.value);
  };

  const handleSetCustomTime = async () => {
    if (isSaving) return;

    if (!customTime || isNaN(customTime) || parseInt(customTime) <= 0) {
      alert('Please enter a valid time in minutes');
      return;
    }

    setIsSaving(true);

    const minutes = parseInt(customTime);
    let newDuration;

    if (minutes >= 60) {
      const hours = minutes / 60;
      newDuration = `${hours}H`;
    } else {
      newDuration = `${minutes}M`;
    }

    try {
      const updatedGoals = {
        ...editedGoals,
        daily: {
          ...editedGoals.daily,
          duration: newDuration,
        },
      };

      setEditedGoals(updatedGoals);
      setActiveTimeOption('custom');

      await goalsDb.updateDailyGoals({
        duration: newDuration,
        pages: parseInt(updatedGoals.daily.pages) || 20,
      });

      const refreshedGoals = await goalsDb.getGoals();
      setGoals(refreshedGoals);

      setShowCustomTimeInput(false);

      console.log('Custom time saved successfully');
    } catch (error) {
      console.error('Error saving custom time:', error);
      alert('Failed to save goal. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReminderToggle = async () => {
    if (isSaving) return;

    setIsSaving(true);

    const newEnabled = !reminderEnabled;
    setReminderEnabled(newEnabled);

    try {
      const updatedGoals = {
        ...editedGoals,
        notifications: {
          ...editedGoals.notifications,
          enabled: newEnabled,
        },
      };

      setEditedGoals(updatedGoals);

      await goalsDb.updateNotifications(updatedGoals.notifications);

      const refreshedGoals = await goalsDb.getGoals();
      setGoals(refreshedGoals);

      console.log('Reminder toggle saved successfully');
    } catch (error) {
      console.error('Error saving reminder toggle:', error);
      alert('Failed to save notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReminderTimeChange = async (e) => {
    if (isSaving) return;

    setIsSaving(true);

    const hour = e.target.value;
    setReminderTime(hour);

    const formattedTime = `${hour.padStart(2, '0')}:00`;

    try {
      const updatedGoals = {
        ...editedGoals,
        notifications: {
          ...editedGoals.notifications,
          reminderTime: formattedTime,
        },
      };

      setEditedGoals(updatedGoals);

      await goalsDb.updateNotifications(updatedGoals.notifications);

      const refreshedGoals = await goalsDb.getGoals();
      setGoals(refreshedGoals);

      console.log('Reminder time saved successfully');
    } catch (error) {
      console.error('Error saving reminder time:', error);
      alert('Failed to save notification settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getDailyProgressPercentage = () => {
    if (!dailyStats || !goals) return 0;

    const targetMinutes = convertDurationToMinutes(goals.daily.duration);
    const actualMinutes = convertDurationToMinutes(
      dailyStats.totalDurationSpent
    );
    return targetMinutes > 0
      ? Math.min(100, Math.round((actualMinutes / targetMinutes) * 100))
      : 0;
  };

  const getRemainingReadingTime = () => {
    if (!dailyStats || !goals) return '0 minutes';

    const targetMinutes = convertDurationToMinutes(goals.daily.duration);
    const actualMinutes = convertDurationToMinutes(
      dailyStats.totalDurationSpent
    );
    const remainingMinutes = Math.max(0, targetMinutes - actualMinutes);

    return remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
  };

  if (loading) {
    return <LoadingScreen message="Loading your reading goals..." />;
  }

  const progressPercentage = getDailyProgressPercentage();
  const remainingTime = getRemainingReadingTime();

  return (
    <div className="h-full pb-20 overflow-auto bg-gray-50">
      <div id="goal-tab" className="px-4 pt-6">
        {}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Goals</h1>
            <p className="text-gray-600 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {}
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">JD</span>
            </div>
          </div>
        </div>

        {}
        <GoalProgress
          progressPercentage={progressPercentage}
          dailyStats={dailyStats}
          remainingTime={remainingTime}
          onAdjustGoal={() => setEditMode(!editMode)}
          isSaving={isSaving}
        />

        {}
        <TimeSelector
          activeOption={activeTimeOption}
          onTimeSelect={handleTimeOptionClick}
          onCustomTimeToggle={toggleCustomTimeInput}
          showCustomInput={showCustomTimeInput}
          customTime={customTime}
          onCustomTimeChange={handleCustomTimeChange}
          onCustomTimeSet={handleSetCustomTime}
          onCustomTimeCancel={() => !isSaving && setShowCustomTimeInput(false)}
          isSaving={isSaving}
        />

        {}
        <ReminderSettings
          enabled={reminderEnabled}
          reminderTime={reminderTime}
          onToggleReminder={handleReminderToggle}
          onTimeChange={handleReminderTimeChange}
          isSaving={isSaving}
        />

        {}
        <h2 className="font-semibold text-gray-800 mb-4">Reading Streaks</h2>
        <StreakDisplay
          currentStreak={streak.currentStreak}
          bestStreak={streak.bestStreak}
        />

        {}
        <TipBox
          title="Goal Setting Tip"
          content="Start with smaller, achievable goals and gradually increase them as you build your reading habit."
        />
      </div>

      {}
    </div>
  );
};

export default Goals;
