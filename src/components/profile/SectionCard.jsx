import React from 'react';

const SectionCard = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
      <h2 className="font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default SectionCard;
