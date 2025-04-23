import React from 'react';

const ProfileStyles = () => {
  return (
    <style jsx global>{`
      .profile-header {
        background: linear-gradient(to right, #ebf5ff, #dbeafe);
        border-radius: 16px;
        box-shadow: 0 2px 10px rgba(59, 130, 246, 0.1);
      }

      .progress-bar {
        height: 6px;
        border-radius: 3px;
        background-color: #e5e7eb;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 3px;
        background-color: #3b82f6;
      }

      .chart-container {
        position: relative;
        height: 200px;
        width: 100%;
      }

      .chart-bar {
        position: absolute;
        bottom: 0;
        width: 8%;
        background-color: #3b82f6;
        border-radius: 4px 4px 0 0;
        transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .chart-label {
        position: absolute;
        bottom: -25px;
        width: 8%;
        text-align: center;
        font-size: 10px;
        color: #6b7280;
      }

      .achievement-badge {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #eff6ff;
      }

      .achievement-badge.locked {
        background-color: #f3f4f6;
        opacity: 0.7;
      }

      .achievement-badge i {
        font-size: 24px;
        color: #3b82f6;
      }

      .achievement-badge.locked i {
        color: #9ca3af;
      }

      .progress-circle {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .progress-circle-track {
        fill: none;
        stroke: #e5e7eb;
        stroke-width: 4;
      }

      .progress-circle-fill {
        fill: none;
        stroke: #3b82f6;
        stroke-width: 4;
        stroke-linecap: round;
        transform: rotate(-90deg);
        transform-origin: center;
        transition: stroke-dashoffset 1s ease;
      }

      .tab-button {
        transition: all 0.2s ease;
      }

      .tab-button.active {
        background-color: #3b82f6;
        color: white;
      }

      .tab-button:hover:not(.active) {
        background-color: #eff6ff;
      }
    `}</style>
  );
};

export default ProfileStyles;
