import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

const ActivityChart = ({ data, loading, stats }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!loading && chartRef.current) {
      const chartBars = chartRef.current.querySelectorAll('.chart-bar');

      chartBars.forEach((bar, index) => {
        const originalHeight = bar.style.height;
        bar.style.height = '0%';

        setTimeout(() => {
          bar.style.height = originalHeight;
        }, 50 * index);
      });
    }
  }, [loading, data]);

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="chart-container mb-6" ref={chartRef}>
        {data.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className={`chart-bar ${item.future ? 'bg-gray-200' : ''}`}
              style={{ left: `${2 + index * 11}%`, height: `${item.height}%` }}
            ></div>
            <div className="chart-label" style={{ left: `${2 + index * 11}%` }}>
              {item.label}
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Time this {stats.period}</p>
          <p className="font-semibold text-gray-800">{stats.totalTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Daily average</p>
          <p className="font-semibold text-gray-800">{stats.averageTime}</p>
        </div>
        <div>
          <p className="text-gray-500">Best day</p>
          <p className="font-semibold text-gray-800">{stats.bestDay}</p>
        </div>
      </div>
    </>
  );
};

export default ActivityChart;
