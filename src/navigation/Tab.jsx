import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faSearch,
  faPlusCircle,
  faBell,
  faUser,
  faBook,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons';
import './Tab.css';

const Tab = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'home', icon: faHome, label: 'Home', path: '/' },
    { id: 'book', icon: faBook, label: 'Books', path: '/books' },
    { id: 'goal', icon: faBullseye, label: 'Goals', path: '/goals' },
    { id: 'profile', icon: faUser, label: 'Profile', path: '/profile' },
  ];

  useEffect(() => {
    const currentPath = location.pathname;

    const matchingTab = tabs.find((tab) => {
      return (
        currentPath === tab.path ||
        (tab.path !== '/' && currentPath.startsWith(tab.path))
      );
    });

    if (matchingTab) {
      setActiveTab(matchingTab.id);
    } else if (currentPath === '/') {
      setActiveTab('home');
    }
  }, [location.pathname, tabs]);

  const handleTabClick = (tabId, path) => {
    if (tabId !== activeTab) {
      setActiveTab(tabId);
      navigate(path);
    }
  };

  return (
    <nav className="bottom-nav">
      <div className="nav-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id, tab.path)}
          >
            <div className="icon-container">
              <div className="icon-background"></div>
              <FontAwesomeIcon icon={tab.icon} />
            </div>
            <div className="indicator-line"></div>
            <span className="nav-text">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Tab;
