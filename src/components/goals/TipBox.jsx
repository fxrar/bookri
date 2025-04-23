import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const TipBox = ({ title, content }) => (
  <div className="bg-blue-50 rounded-xl p-4 mb-6 sm:p-3">
    <div className="flex items-start">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1 sm:w-8 sm:h-8 sm:mr-2 flex-shrink-0">
        <FontAwesomeIcon
          icon={faLightbulb}
          className="text-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-800 mb-1 sm:text-sm">{title}</h3>
        <p className="text-sm text-gray-600 sm:text-xs break-words">
          {content}
        </p>
      </div>
    </div>
  </div>
);

export default TipBox;
