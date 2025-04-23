import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBook,
  faBullseye,
  faChartLine,
  faBookReader,
} from '@fortawesome/free-solid-svg-icons';

const NavBar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home-tab', icon: faHome, label: 'Home' },
    { id: 'books-tab', icon: faBook, label: 'Books' },
    { id: 'goal-tab', icon: faBullseye, label: 'Goal' },
    { id: 'profile-tab', icon: faChartLine, label: 'Profile' },
    { id: 'read-tab', icon: faBookReader, label: 'Read' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 -lg">
      <div className="flex justify-around py-3">
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeTab === item.id ? 'active' : ''} text-gray-500`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.id);
            }}
          >
            <div className="icon-container">
              <div className="icon-background"></div>
              <FontAwesomeIcon icon={item.icon} className="text-xl" />
            </div>
            <div className="indicator-line"></div>
            <span className="nav-text">{item.label}</span>
          </a>
        ))}
      </div>

      <style jsx>{`
        .nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: color 0.3s ease;
        }

        .nav-item.active {
          color: #3b82f6;
        }

        .indicator-line {
          width: 0;
          height: 3px;
          border-radius: 999px;
          background-color: #3b82f6;
          margin: 4px 0;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-item.active .indicator-line {
          width: 20px;
        }

        .icon-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
        }

        .icon-background {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(59, 130, 246, 0.1);
          border-radius: 12px;
          transform: scale(0);
          opacity: 0;
          transition:
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.3s ease;
        }

        .nav-item.active .icon-background {
          transform: scale(1);
          opacity: 1;
        }

        .nav-text {
          font-size: 12px;
          font-weight: 500;
          margin-top: 2px;
          opacity: 0.8;
          transform: translateY(0);
          transition:
            transform 0.3s ease,
            opacity 0.3s ease;
        }

        .nav-item.active .nav-text {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes iconBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .nav-item.active i,
        .nav-item.active svg {
          animation: iconBounce 0.5s ease;
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
