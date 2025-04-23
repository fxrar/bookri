import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';

const ReadingAssistant = () => {
  return (
    <div className="bg-blue-500 rounded-xl p-4 mb-6 text-white relative overflow-hidden">
      <div className="absolute right-0 bottom-0 opacity-10">
        <FontAwesomeIcon icon={faBookReader} className="text-8xl" />
      </div>
      <h2 className="font-bold text-lg mb-1">Smart Reading Assistant</h2>
      <p className="text-sm opacity-90 mb-3">
        Get summaries, explanations, and insights as you read.
      </p>
      <button className="bg-white text-blue-600 text-sm py-1.5 px-4 rounded-lg font-medium">
        Try Now
      </button>
    </div>
  );
};

export default ReadingAssistant;
