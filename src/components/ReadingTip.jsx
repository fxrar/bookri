import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

const ReadingTip = () => {
  const tips = [
    'Try the Pomodoro technique: read for 25 minutes, then take a 5-minute break to boost retention.',
    'Preview chapters by reading headings and summaries first to build a mental framework for the content.',
    'Take brief notes in your own words to improve comprehension and memory retention.',
    'Read actively by asking questions about the material and seeking answers as you go.',
    'Use a physical bookmark with key questions to answer while reading each section.',
    'Try the SQ3R method: Survey, Question, Read, Recite, and Review for better understanding.',
    'Read difficult material aloud to engage multiple senses and improve focus.',
    'Create mind maps to visualize connections between key concepts in your reading.',
    'Schedule reading sessions during your peak alertness hours for maximum effectiveness.',
    "Minimize distractions by putting your phone on 'Do Not Disturb' mode while reading.",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <div className="bg-gray-100 rounded-xl p-4 mb-6 sm:p-3">
      <div className="flex items-start">
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1 sm:w-8 sm:h-8 sm:mr-2 flex-shrink-0">
          <FontAwesomeIcon
            icon={faLightbulb}
            className="text-yellow-500 sm:text-sm"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-800 mb-1 sm:text-sm">
            Reading Tip
          </h3>
          <p className="text-sm text-gray-600 sm:text-xs break-words">
            {tips[currentTipIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReadingTip;
