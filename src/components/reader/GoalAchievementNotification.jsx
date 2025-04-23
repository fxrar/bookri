import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GoalAchievementNotification = ({ type, message, details, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'daily':
        return 'bg-green-500';
      case 'weekly':
        return 'bg-blue-500';
      case 'streak':
        return 'bg-purple-500';
      default:
        return 'bg-teal-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 ${getBackgroundColor()} text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm`}
      >
        <div className="flex items-start">
          <div className="flex-1">
            <h3 className="font-bold text-lg">{message}</h3>
            {details && <p className="mt-1 text-sm text-white/90">{details}</p>}
          </div>
          <button
            onClick={onDismiss}
            className="ml-4 text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoalAchievementNotification;
