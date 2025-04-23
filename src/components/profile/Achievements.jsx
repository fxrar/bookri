import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faCalendarCheck,
  faMoon,
  faTachometerAlt,
  faCompass,
  faAward,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const AchievementBadge = ({
  icon,
  title,
  progress,
  total,
  isLocked = false,
}) => {
  const percentage = Math.min(100, Math.max(0, (progress / total) * 100));
  const dashOffset = 100 - percentage;

  const iconMap = {
    book: faBook,
    streak: faCalendarCheck,
    night: faMoon,
    speed: faTachometerAlt,
    explorer: faCompass,
    milestone: faAward,
  };

  const iconToUse = iconMap[icon] || faAward;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`achievement-badge mb-2 relative ${isLocked ? 'locked' : ''}`}
      >
        <svg className="progress-circle" viewBox="0 0 36 36">
          <circle
            className="progress-circle-track"
            cx="18"
            cy="18"
            r="16"
          ></circle>
          <circle
            className="progress-circle-fill"
            cx="18"
            cy="18"
            r="16"
            strokeDasharray="100"
            strokeDashoffset={dashOffset}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <FontAwesomeIcon icon={iconToUse} />
        </div>
      </div>
      <p className="text-xs font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">
        {progress}/{total}{' '}
        {total === 1
          ? ''
          : total === 5
            ? 'genres'
            : total === 14
              ? 'days'
              : total === 100
                ? 'hours'
                : 'books'}
      </p>
    </div>
  );
};

const Achievements = ({ achievements }) => {
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementBadge
            key={index}
            icon={achievement.icon}
            title={achievement.title}
            progress={achievement.progress}
            total={achievement.total}
            isLocked={achievement.locked}
          />
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-center">
        <button className="text-blue-500 text-sm font-medium flex items-center">
          <span>View All Achievements</span>
          <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-xs" />
        </button>
      </div>
    </>
  );
};

export default Achievements;
