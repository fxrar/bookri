import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const TipBox = ({ title, content }) => (
  <div className="bg-blue-50 rounded-xl p-4 mb-6">
    <div className="flex items-start">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
        <FontAwesomeIcon icon={faLightbulb} className="text-blue-500" />
      </div>
      <div>
        <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{content}</p>
      </div>
    </div>
  </div>
);

export default TipBox;
