import React, { useState, useEffect } from 'react';
import { getBooks } from '../db/bookDb';
import { getReadingStats, getReadingStreak } from '../utils/progressUpdater';
import { getGoals } from '../db/goalsDb';
import { getReadDataForDateRange } from '../db/readDataDb';
import NavBar from '../components/NavBar';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import StatsTabs from '../components/profile/StatsTabs';
import ActivityChart from '../components/profile/ActivityChart';
import ReadingHabits from '../components/profile/ReadingHabits';
import GenreDistribution from '../components/profile/GenreDistribution';
import Achievements from '../components/profile/Achievements';
import SectionCard from '../components/profile/SectionCard';
import ProfileStyles from '../components/profile/ProfileStyles';

function convertDurationToMinutes(duration) {
  try {
    if (!duration) return 0;

    const unit = duration.slice(-1).toUpperCase();
    const value = parseFloat(duration.slice(0, -1));

    if (isNaN(value)) return 0;

    switch (unit) {
      case 'H':
        return value * 60;
      case 'M':
        return value;
      default:
        return 0;
    }
  } catch (error) {
    console.error('Error converting duration to minutes:', error);
    return 0;
  }
}

function formatMinutesToDuration(minutes) {
  if (minutes >= 60) {
    const hours = minutes / 60;
    return `${hours.toFixed(1)}H`;
  } else {
    return `${Math.round(minutes)}M`;
  }
}

function formatDateToString(date) {
  const d = date || new Date();
  return d.toISOString().split('T')[0];
}

function Profile() {
  const [activeTab, setActiveTab] = useState('profile-tab');
  const [statsTab, setStatsTab] = useState('weekly');
  const [readingStats, setReadingStats] = useState(null);
  const [readingStreak, setReadingStreak] = useState({
    currentStreak: 0,
    bestStreak: 0,
  });
  const [books, setBooks] = useState([]);
  const [goals, setGoals] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [readingTimeDistribution, setReadingTimeDistribution] = useState([
    20, 15, 25, 80,
  ]);
  const [weeklyConsistency, setWeeklyConsistency] = useState([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);
  const [genreDistribution, setGenreDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferredTime, setPreferredTime] = useState('Evening');
  const [readingSpeed, setReadingSpeed] = useState({
    value: 275,
    percentage: 65,
  });

  const [userData, setUserData] = useState({
    name: 'John Doe',
    joinedDate: 'January 2025',
    totalReadingTime: '87h',
    completedBooks: 12,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        const allBooks = await getBooks();
        setBooks(allBooks);

        const stats = await getReadingStats(statsTab);
        setReadingStats(stats);

        const streak = await getReadingStreak();
        setReadingStreak(streak);

        const userGoals = await getGoals();
        setGoals(userGoals);

        await loadActivityData();

        calculateGenreDistribution(allBooks);

        await calculateWeeklyConsistency();

        await calculateReadingTimeDistribution();

        updateUserData(allBooks);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [statsTab]);

  const updateUserData = (allBooks) => {
    let totalMinutes = 0;
    allBooks.forEach((book) => {
      if (book.progress && book.progress.totalDurationSpent) {
        totalMinutes += convertDurationToMinutes(
          book.progress.totalDurationSpent
        );
      }
    });

    const hours = Math.floor(totalMinutes / 60);

    const completedCount = allBooks.filter(
      (book) =>
        book.progress &&
        book.progress.percentage &&
        book.progress.percentage >= 100
    ).length;

    setUserData({
      ...userData,
      totalReadingTime: `${hours}h`,
      completedBooks: completedCount,
    });
  };

  const loadActivityData = async () => {
    try {
      const today = new Date();
      const startDate = subDays(today, 7);
      const endDate = today;

      const readData = await getReadDataForDateRange(
        formatDateToString(startDate),
        formatDateToString(endDate)
      );

      const newActivityData = [];

      for (let i = 7; i >= -1; i--) {
        const currentDate = subDays(today, i);
        const dateString = formatDateToString(currentDate);
        const shortDate = format(currentDate, 'MMM d');

        const dayData = readData.find((item) => item.date === dateString);

        let height = 0;
        if (dayData) {
          const minutes = convertDurationToMinutes(dayData.totalDurationSpent);

          height = Math.min(100, (minutes / 120) * 100);
        }

        newActivityData.push({
          label: shortDate,
          height,
          future: i < 0,
        });
      }

      setActivityData(newActivityData);
    } catch (error) {
      console.error('Error loading activity data:', error);
    }
  };

  const calculateGenreDistribution = (books) => {
    try {
      const genreCounts = {};
      let totalBooks = 0;

      books.forEach((book) => {
        if (book.genre) {
          genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
          totalBooks++;
        }
      });

      const genrePercentages = Object.entries(genreCounts).map(
        ([genre, count]) => ({
          name: genre,
          percentage: Math.round((count / totalBooks) * 100) || 0,
        })
      );

      genrePercentages.sort((a, b) => b.percentage - a.percentage);

      setGenreDistribution(genrePercentages.slice(0, 5));

      if (genrePercentages.length < 5) {
        const defaultGenres = [
          { name: 'Self-Improvement', percentage: 45 },
          { name: 'Business', percentage: 25 },
          { name: 'Psychology', percentage: 15 },
          { name: 'Science', percentage: 10 },
          { name: 'Fiction', percentage: 5 },
        ];

        const existingGenres = genrePercentages.map((g) => g.name);
        const additionalGenres = defaultGenres.filter(
          (g) => !existingGenres.includes(g.name)
        );

        setGenreDistribution([
          ...genrePercentages,
          ...additionalGenres.slice(0, 5 - genrePercentages.length),
        ]);
      }
    } catch (error) {
      console.error('Error calculating genre distribution:', error);

      setGenreDistribution([
        { name: 'Self-Improvement', percentage: 45 },
        { name: 'Business', percentage: 25 },
        { name: 'Psychology', percentage: 15 },
        { name: 'Science', percentage: 10 },
        { name: 'Fiction', percentage: 5 },
      ]);
    }
  };

  const calculateWeeklyConsistency = async () => {
    try {
      const today = new Date();
      const weekStart = startOfWeek(today);
      const weekEnd = endOfWeek(today);

      const weekData = await getReadDataForDateRange(
        formatDateToString(weekStart),
        formatDateToString(weekEnd)
      );

      const daysActive = Array(7).fill(false);

      weekData.forEach((dayData) => {
        const date = new Date(dayData.date);
        const dayIndex = date.getDay();
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;

        if (dayData.totalPagesRead > 0) {
          daysActive[adjustedIndex] = true;
        }
      });

      setWeeklyConsistency(daysActive);
    } catch (error) {
      console.error('Error calculating weekly consistency:', error);
    }
  };

  const calculateReadingTimeDistribution = async () => {
    try {
      const allReadData = await getReadDataForDateRange(
        '2000-01-01',
        formatDateToString(new Date())
      );

      const timeDistribution = [0, 0, 0, 0];
      let totalSessions = 0;

      allReadData.forEach((dayData) => {
        dayData.books.forEach((book) => {
          book.sessions.forEach((session) => {
            const sessionTime = new Date(session.startTime);
            const hour = sessionTime.getHours();

            if (hour >= 5 && hour < 12) {
              timeDistribution[0]++;
            } else if (hour >= 12 && hour < 17) {
              timeDistribution[1]++;
            } else if (hour >= 17 && hour < 21) {
              timeDistribution[2]++;
            } else {
              timeDistribution[3]++;
            }

            totalSessions++;
          });
        });
      });

      if (totalSessions > 0) {
        const percentages = timeDistribution.map((count) =>
          Math.round((count / totalSessions) * 100)
        );
        setReadingTimeDistribution(percentages);

        const maxIndex = percentages.indexOf(Math.max(...percentages));
        const timeLabels = ['Morning', 'Afternoon', 'Evening', 'Night'];
        setPreferredTime(timeLabels[maxIndex]);
      } else {
        setReadingTimeDistribution([20, 15, 25, 80]);
      }
    } catch (error) {
      console.error('Error calculating reading time distribution:', error);
    }
  };

  const getAchievements = () => {
    return [
      {
        icon: 'book',
        title: 'Bookworm',
        progress: books.length >= 10 ? 10 : books.length,
        total: 10,
        locked: books.length < 10,
      },
      {
        icon: 'streak',
        title: 'Consistent',
        progress: readingStreak.currentStreak,
        total: 14,
        locked: readingStreak.currentStreak < 14,
      },
      {
        icon: 'night',
        title: 'Night Owl',
        progress:
          readingTimeDistribution[3] > 50
            ? 20
            : Math.round(readingTimeDistribution[3] / 5),
        total: 20,
        locked: readingTimeDistribution[3] < 50,
      },
      {
        icon: 'speed',
        title: 'Speed Reader',
        progress: 3,
        total: 10,
        locked: true,
      },
      {
        icon: 'explorer',
        title: 'Explorer',
        progress: genreDistribution.length,
        total: 5,
        locked: genreDistribution.length < 5,
      },
      {
        icon: 'milestone',
        title: 'Milestone',
        progress: Math.min(
          100,
          Math.round(convertDurationToMinutes(userData.totalReadingTime) / 60)
        ),
        total: 100,
        locked: convertDurationToMinutes(userData.totalReadingTime) / 60 < 100,
      },
    ];
  };

  const getActivityStats = () => {
    return {
      period: statsTab,
      totalTime: loading ? '...' : readingStats?.totalDurationSpent || '5h 45m',
      averageTime: loading
        ? '...'
        : readingStats?.averageDurationPerDay || '49m',
      bestDay: 'Saturday',
    };
  };

  return (
    <div className="bg-gray-50 h-screen">
      {}
      <div className="h-full pb-20 overflow-auto">
        {}
        <div id="profile-tab" className="px-4 pt-6">
          {}
          <ProfileHeader
            username={userData.name}
            joinedDate={userData.joinedDate}
            readingStreak={readingStreak.currentStreak}
          />

          {}
          <div className="profile-header p-4 mb-6">
            <ProfileStats
              booksCount={books.length}
              completedCount={userData.completedBooks}
              totalReadingTime={userData.totalReadingTime}
            />
          </div>

          {}
          <StatsTabs activeTab={statsTab} onTabChange={setStatsTab} />

          {}
          <SectionCard title="Reading Activity">
            <ActivityChart
              data={activityData}
              loading={loading}
              stats={getActivityStats()}
            />
          </SectionCard>

          {}
          <SectionCard title="Reading Habits">
            <ReadingHabits
              preferredTime={preferredTime}
              readingTimeData={readingTimeDistribution}
              readingSpeed={readingSpeed}
              weeklyConsistency={weeklyConsistency}
            />
          </SectionCard>

          {}
          <SectionCard title="Favorite Genres">
            <GenreDistribution genres={genreDistribution} />
          </SectionCard>

          {}
          <h2 className="font-semibold text-gray-800 mb-4">Achievements</h2>
          <SectionCard>
            <Achievements achievements={getAchievements()} />
          </SectionCard>

          {}
          <div className="flex justify-center mb-6">
            <button className="bg-white border border-gray-200 text-gray-600 text-sm py-2 px-4 rounded-lg flex items-center shadow-sm hover:shadow transition-all duration-200">
              <i className="fas fa-cog mr-2"></i>
              Account Settings
            </button>
          </div>
        </div>
      </div>

      {}
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {}
      <ProfileStyles />
    </div>
  );
}

export default Profile;
