import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import {
  setupBookriReminder,
  checkPermission,
  cancelNotifications,
} from '../../utils/setNotification';

const ReminderSettings = () => {
  const [enabled, setEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('20');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      const savedTime = localStorage.getItem('reminderTime') || '20';
      setReminderTime(savedTime);

      const hasPermission = await checkPermission();

      const savedEnabledState =
        localStorage.getItem('reminderEnabled') === 'true';

      setEnabled(hasPermission && savedEnabledState);
    };

    initializeSettings();
  }, []);

  const handleToggleReminder = async () => {
    setIsSaving(true);

    try {
      if (!enabled) {
        const formattedTime = `${reminderTime}:00`;
        const success = await setupBookriReminder(formattedTime);

        if (success) {
          setEnabled(true);
          localStorage.setItem('reminderEnabled', 'true');
        }
      } else {
        await cancelNotifications();
        setEnabled(false);
        localStorage.setItem('reminderEnabled', 'false');
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimeChange = async (e) => {
    const newTime = e.target.value;
    setReminderTime(newTime);
    localStorage.setItem('reminderTime', newTime);

    if (enabled) {
      setIsSaving(true);
      try {
        const formattedTime = `${newTime}:00`;
        await setupBookriReminder(formattedTime);
      } catch (error) {
        console.error('Error updating reminder time:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-6">
      <h2 className="font-semibold text-gray-800 mb-4">Reminder Settings</h2>

      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-3">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faBell} className="text-blue-500 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-800">Daily Reminder</p>
            <p className="text-xs text-gray-500">
              Get notified to complete your goal
            </p>
          </div>
        </div>
        <label
          className={`relative inline-flex items-center ${isSaving ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            onChange={handleToggleReminder}
            disabled={isSaving}
            aria-label="Toggle daily reminder"
          />
          <div
            className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500 ${isSaving ? 'opacity-50' : ''}`}
          ></div>
        </label>
      </div>

      {enabled && (
        <div className="p-3 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-800">Reminder Time</p>
            <p className="text-sm text-blue-500">
              {parseInt(reminderTime) > 11
                ? `${parseInt(reminderTime) > 12 ? parseInt(reminderTime) - 12 : parseInt(reminderTime)}:00 PM`
                : `${parseInt(reminderTime)}:00 AM`}
            </p>
          </div>
          <input
            type="range"
            min="0"
            max="23"
            value={reminderTime}
            onChange={handleTimeChange}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            disabled={isSaving}
            aria-label="Set reminder time"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6 AM</span>
            <span>12 PM</span>
            <span>6 PM</span>
            <span>12 AM</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReminderSettings;
