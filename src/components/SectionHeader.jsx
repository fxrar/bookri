import React from 'react';

const SectionHeader = ({ title, linkText, linkHref = '#' }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-semibold text-gray-800">{title}</h2>
      {linkText && (
        <a href={linkHref} className="text-blue-500 text-sm">
          {linkText}
        </a>
      )}
    </div>
  );
};

export default SectionHeader;
