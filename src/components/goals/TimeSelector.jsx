import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const TIME_OPTIONS = [
  { label: '15 min', value: '15M' },
  { label: '30 min', value: '30M' },
  { label: '45 min', value: '45M' },
  { label: '60 min', value: '60M' },
];

const TimeSelector = ({
  activeOption,
  onTimeSelect,
  onCustomTimeToggle,
  showCustomInput,
  customTime,
  onCustomTimeChange,
  onCustomTimeSet,
  onCustomTimeCancel,
  isSaving,
}) => (
  <div className="bg-white rounded-xl p-4 mb-6">
    <h2 className="font-semibold text-gray-800 mb-4">Set Daily Goal</h2>

    <p className="text-sm text-gray-600 mb-3">
      How much time would you like to read each day?
    </p>

    <div className="grid grid-cols-4 gap-2 mb-4">
      {TIME_OPTIONS.map((option) => (
        <button
          key={option.label}
          className={`time-selector py-2 rounded-lg text-center text-sm border ${activeOption === option.label ? 'active border-blue-500 bg-blue-500 text-white' : 'border-gray-200'} ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => onTimeSelect(option.label, option.value)}
          disabled={isSaving || activeOption === option.label}
          aria-label={`Set daily reading goal to ${option.label}`}
        >
          {option.label}
        </button>
      ))}
    </div>

    <div className="mb-4">
      {!showCustomInput ? (
        <button
          className={`text-blue-500 text-sm flex items-center ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onCustomTimeToggle}
          disabled={isSaving}
          aria-label="Set custom reading time"
        >
          <FontAwesomeIcon icon={faEdit} className="mr-2" /> Add custom time
        </button>
      ) : (
        <>
          <label
            htmlFor="custom-time"
            className="text-sm text-gray-600 mb-1 block"
          >
            Custom time (minutes)
          </label>
          <div className="flex">
            <input
              id="custom-time"
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Enter minutes"
              value={customTime}
              onChange={onCustomTimeChange}
              disabled={isSaving}
              aria-label="Custom reading time in minutes"
            />
            <button
              className={`bg-blue-500 text-white ml-2 px-4 rounded-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onCustomTimeSet}
              disabled={isSaving}
              aria-label="Set custom time"
            >
              {isSaving ? 'Saving...' : 'Set'}
            </button>
            <button
              className={`bg-gray-200 text-gray-600 ml-2 px-4 rounded-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onCustomTimeCancel}
              disabled={isSaving}
              aria-label="Cancel custom time"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

export default TimeSelector;
