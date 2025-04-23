import React from 'react';

const ProgressBar = ({ percentage = 0 }) => {
  return (
    <div
      className="progress-bar"
      style={{
        height: '6px',
        borderRadius: '3px',
        backgroundColor: '#E5E7EB',
        overflow: 'hidden',
      }}
    >
      <div
        className="progress-fill"
        style={{
          width: `${percentage}%`,
          height: '100%',
          borderRadius: '3px',
          backgroundColor: '#3B82F6',
        }}
      ></div>

      <style jsx>{`
        .progress-bar {
          height: 6px;
          border-radius: 3px;
          background-color: #e5e7eb;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
