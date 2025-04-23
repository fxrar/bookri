import React, { useState, useEffect } from 'react';
import { getBooks } from '../../db/bookDb';

const GenreBar = ({ genre, percentage }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="text-sm text-gray-600">{genre}</p>
        <p className="text-sm font-medium text-gray-800">
          {percentage.toFixed(1)}%
        </p>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const GenreDistribution = () => {
  const [genreData, setGenreData] = useState([]);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const books = await getBooks();

        if (!books || books.length === 0) {
          setGenreData([]);
          return;
        }

        const genreCounts = {};
        let totalCategoriesCount = 0;

        books.forEach((book) => {
          const categories = book.metadata?.categories || [];

          if (categories.length === 0) {
            genreCounts['Uncategorized'] =
              (genreCounts['Uncategorized'] || 0) + 1;
            totalCategoriesCount++;
          } else {
            categories.forEach((category) => {
              genreCounts[category] = (genreCounts[category] || 0) + 1;
              totalCategoriesCount++;
            });
          }
        });

        const genrePercentages = Object.entries(genreCounts).map(
          ([name, count]) => ({
            name,
            percentage: (count / totalCategoriesCount) * 100,
          })
        );

        genrePercentages.sort((a, b) => b.percentage - a.percentage);

        setGenreData(genrePercentages);
      } catch (error) {
        console.error('Error fetching genre data:', error);
        setGenreData([]);
      }
    };

    fetchGenreData();
  }, []);

  if (genreData.length === 0) {
    return <div className="text-gray-500">No genre data available</div>;
  }

  return (
    <div className="space-y-3">
      {genreData.map((genre, index) => (
        <GenreBar
          key={index}
          genre={genre.name}
          percentage={genre.percentage}
        />
      ))}
    </div>
  );
};

export default GenreDistribution;
