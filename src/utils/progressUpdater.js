import bookDb from '../db/bookDb';
import goalsDb from '../db/goalsDb';
import readDataDb from '../db/readDataDb';

export async function updateReadingProgress(
  bookId,
  startPage,
  endPage,
  startTime = null,
  endTime = null,
  durationMinutes = null
) {
  try {
    if (!bookId) {
      console.error('Book ID is required');
      return { success: false, error: 'Book ID is required' };
    }

    if (endPage < startPage) {
      console.error('End page must be greater than or equal to start page');
      return {
        success: false,
        error: 'End page must be greater than or equal to start page',
      };
    }

    const book = await bookDb.getBook(bookId);
    if (!book) {
      console.error('Book not found:', bookId);
      return { success: false, error: 'Book not found' };
    }

    const now = new Date();
    const actualEndTime = endTime ? new Date(endTime) : now;
    let actualStartTime;

    if (!startTime) {
      const readingDuration = durationMinutes || 10;
      actualStartTime = new Date(actualEndTime);
      actualStartTime.setMinutes(
        actualStartTime.getMinutes() - readingDuration
      );
    } else {
      actualStartTime = new Date(startTime);
    }

    const startTimeISO = actualStartTime.toISOString();
    const endTimeISO = actualEndTime.toISOString();

    const pagesRead = endPage - startPage;

    const progressUpdated = await bookDb.updateProgress(bookId, {
      currentPage: endPage,
    });
    if (!progressUpdated) {
      console.error('Failed to update book progress');
      return { success: false, error: 'Failed to update book progress' };
    }

    const sessionRecorded = await readDataDb.recordReadingSession(
      bookId,
      startPage,
      endPage,
      startTimeISO,
      endTimeISO
    );
    if (!sessionRecorded) {
      console.error('Failed to record reading session');
      return { success: false, error: 'Failed to record reading session' };
    }

    const todayData = await readDataDb.getReadDataForDate();
    if (!todayData) {
      console.error("Failed to retrieve today's reading data");
      return {
        success: true,
        bookProgress: {
          currentPage: endPage,
          percentage: (endPage / book.totalPages) * 100,
        },
        dailyProgress: null,
        goalsStatus: null,
      };
    }

    const dailyGoalsStatus = await goalsDb.checkDailyGoalsAchievement(
      todayData.totalPagesRead,
      todayData.totalDurationSpent
    );

    const weeklyStats = await readDataDb.getWeeklyStats();
    const weeklyGoalsStatus = await goalsDb.checkWeeklyGoalsAchievement(
      weeklyStats.totalPagesRead,
      weeklyStats.totalDurationSpent,
      weeklyStats.booksCompleted
    );

    return {
      success: true,
      bookProgress: {
        id: bookId,
        name: book.name,
        currentPage: endPage,
        totalPages: book.totalPages,
        percentage: ((endPage / book.totalPages) * 100).toFixed(2),
        pagesRead,
        sessionDuration: formatMinutesToDuration(
          Math.round((actualEndTime - actualStartTime) / 60000)
        ),
      },
      dailyProgress: {
        date: todayData.date,
        totalPagesRead: todayData.totalPagesRead,
        totalDurationSpent: todayData.totalDurationSpent,
        booksRead: todayData.books.length,
      },
      weeklyProgress: weeklyStats,
      goalsStatus: {
        daily: dailyGoalsStatus,
        weekly: weeklyGoalsStatus,
        newlyAchieved: {
          daily: isDailyGoalsNewlyAchieved(dailyGoalsStatus, todayData),
          weekly: false,
        },
      },
    };
  } catch (error) {
    console.error('Error updating reading progress:', error);
    return { success: false, error: 'Error updating reading progress' };
  }
}

export async function checkBookCompletion(bookId, currentPage) {
  try {
    const book = await bookDb.getBook(bookId);
    if (!book) return false;

    return currentPage >= book.totalPages;
  } catch (error) {
    console.error('Error checking book completion:', error);
    return false;
  }
}

export async function getReadingStreak() {
  try {
    const allReadData = await readDataDb.getReadDataForDateRange(
      '2000-01-01',
      formatDate(new Date())
    );

    if (!allReadData || allReadData.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    allReadData.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    const today = formatDate(new Date());

    if (allReadData[0].date === today && hasReadingActivity(allReadData[0])) {
      currentStreak = 1;

      let checkDate = new Date();

      for (let i = 1; i < allReadData.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const expectedDate = formatDate(checkDate);

        if (
          allReadData[i].date === expectedDate &&
          hasReadingActivity(allReadData[i])
        ) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    let bestStreak = currentStreak;
    let tempStreak = 0;
    let previousDate = null;

    for (const dayData of allReadData) {
      if (!hasReadingActivity(dayData)) continue;

      if (!previousDate) {
        tempStreak = 1;
        previousDate = new Date(dayData.date);
        continue;
      }

      const currentDate = new Date(dayData.date);
      const dayDiff = Math.round(
        (previousDate - currentDate) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 1;
      }

      previousDate = currentDate;
    }

    return { currentStreak, bestStreak };
  } catch (error) {
    console.error('Error calculating reading streak:', error);
    return { currentStreak: 0, bestStreak: 0 };
  }
}

export async function getReadingStats(period) {
  try {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = formatDate(now);
        break;
      case 'week':
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate = formatDate(startDate);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = formatDate(startDate);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate = formatDate(startDate);
        break;
      default:
        startDate = formatDate(now);
    }

    const readData = await readDataDb.getReadDataForDateRange(
      startDate,
      formatDate(now)
    );

    if (!readData || readData.length === 0) {
      return {
        totalPagesRead: 0,
        totalDurationSpent: '0M',
        uniqueBooksRead: 0,
        booksCompleted: 0,
        averagePagesPerDay: 0,
        averageDurationPerDay: '0M',
        daysWithActivity: 0,
      };
    }

    let totalPagesRead = 0;
    let totalMinutes = 0;
    const uniqueBookIds = new Set();
    const completedBookIds = new Set();

    readData.forEach((dayData) => {
      totalPagesRead += dayData.totalPagesRead;
      totalMinutes += convertDurationToMinutes(dayData.totalDurationSpent);

      dayData.books.forEach((book) => {
        uniqueBookIds.add(book.id);

        checkBookCompletion(book.id, book.pagesRead)
          .then((isCompleted) => {
            if (isCompleted) completedBookIds.add(book.id);
          })
          .catch((error) =>
            console.error('Error checking book completion:', error)
          );
      });
    });

    const endDate = new Date(now);
    const startDateObj = new Date(startDate);
    const daysInPeriod = Math.max(
      1,
      Math.round((endDate - startDateObj) / (1000 * 60 * 60 * 24)) + 1
    );

    const averagePagesPerDay = Math.round(totalPagesRead / daysInPeriod);
    const averageMinutesPerDay = totalMinutes / daysInPeriod;

    return {
      totalPagesRead,
      totalDurationSpent: formatMinutesToDuration(totalMinutes),
      uniqueBooksRead: uniqueBookIds.size,
      booksCompleted: completedBookIds.size,
      averagePagesPerDay,
      averageDurationPerDay: formatMinutesToDuration(averageMinutesPerDay),
      daysWithActivity: readData.length,
    };
  } catch (error) {
    console.error('Error getting reading stats:', error);
    return {
      totalPagesRead: 0,
      totalDurationSpent: '0M',
      uniqueBooksRead: 0,
      booksCompleted: 0,
      averagePagesPerDay: 0,
      averageDurationPerDay: '0M',
      daysWithActivity: 0,
    };
  }
}

function isDailyGoalsNewlyAchieved(currentStatus, todayData) {
  if (todayData.goalsAchieved && todayData.goalsAchieved.overall) {
    return false;
  }

  return currentStatus.overall;
}

function hasReadingActivity(dayData) {
  return dayData.totalPagesRead > 0 && dayData.books.length > 0;
}

function formatDate(date) {
  const d = date || new Date();
  return d.toISOString().split('T')[0];
}

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

export default {
  updateReadingProgress,
  checkBookCompletion,
  getReadingStreak,
  getReadingStats,
};
