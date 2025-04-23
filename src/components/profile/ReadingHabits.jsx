import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSun,
  faCoffee,
  faMoon,
  faStar,
  faCheck,
  faTimes,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const ReadingHabit = ({ title, value, type, data }) => {
  if (type === 'bar') {
    return (
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${data}%` }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Slow</span>
          <span>Average</span>
          <span>Fast</span>
        </div>
      </div>
    );
  } else if (type === 'time') {
    const timePeriods = [
      { label: 'Morning', icon: faSun },
      { label: 'Afternoon', icon: faCoffee },
      { label: 'Evening', icon: faMoon },
      { label: 'Night', icon: faStar },
    ];

    return (
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full h-6 bg-gray-200 rounded-lg mb-1">
                <div
                  className="h-full bg-blue-500 rounded-lg"
                  style={{ width: `${item}%` }}
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-xs font-medium">{item}%</span>
                </div>
              </div>
              <div className="text-center">
                <FontAwesomeIcon
                  icon={timePeriods[index].icon}
                  className="text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {timePeriods[index].label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (type === 'week') {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return (
      <div>
        <div className="flex justify-between mb-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-sm font-medium text-gray-800">{value}</p>
        </div>
        <div className="flex justify-between">
          {data.map((active, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}
            >
              <FontAwesomeIcon
                icon={active ? faCheck : faTimes}
                className="text-xs"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          {days.map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

const ReadingHabits = ({
  preferredTime,
  readingTimeData,
  readingSpeed,
  weeklyConsistency,
}) => {
  return (
    <div className="space-y-4">
      {}
      <ReadingHabit
        title="Preferred Time"
        value={preferredTime}
        type="time"
        data={readingTimeData}
      />

      {}
      <ReadingHabit
        title="Reading Speed"
        value={`${readingSpeed.value} wpm`}
        type="bar"
        data={readingSpeed.percentage}
      />

      {}
      <ReadingHabit
        title="Weekly Consistency"
        value={`${weeklyConsistency.filter(Boolean).length}/7 days`}
        type="week"
        data={weeklyConsistency}
      />
    </div>
  );
};

export default ReadingHabits;
