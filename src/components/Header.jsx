import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const Header = ({ date }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bookri</h1>
        <p className="text-gray-600 text-sm">{date}</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center -sm">
          <FontAwesomeIcon icon={faBell} className="text-gray-500" />
        </button>
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center -sm">
          <span className="text-white font-medium">JD</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
