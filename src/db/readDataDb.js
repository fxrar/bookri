import { Filesystem, Directory } from '@capacitor/filesystem';
import { v4 as uuidv4 } from 'uuid';
import { getBook } from './bookDb';
import { checkDailyGoalsAchievement } from './goalsDb';

const filePath = 'bookri_read_data.json';

let readDataCache = null;

async function fileExists(path) {
  try {
    await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });
    return true;
  } catch (error) {
    return false;
  }
}

async function readFile() {
  try {
    const exists = await fileExists(filePath);

    if (!exists) {
      console.log('Read data database file does not exist yet');
      return [];
    }

    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully read read data database file');

    try {
      return JSON.parse(result.data);
    } catch (parseError) {
      console.error('Error parsing read data JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error reading read data file:', error);
    return [];
  }
}

async function writeFile(data) {
  try {
    try {
      await Filesystem.mkdir({
        path: 'db',
        directory: Directory.Data,
        recursive: true,
      });
    } catch (dirError) {
      console.log(
        'Directory already exists or could not be created:',
        dirError
      );
    }

    let jsonData;
    try {
      jsonData = JSON.stringify(data, null, 2);
    } catch (stringifyError) {
      console.error('Error stringifying read data:', stringifyError);
      return false;
    }

    await Filesystem.writeFile({
      path: filePath,
      data: jsonData,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully wrote read data database file');

    readDataCache = data;
    return true;
  } catch (error) {
    console.error('Error writing read data file:', error);
    console.error('Write error details:', JSON.stringify(error));
    return false;
  }
}

export async function init() {
  try {
    console.log('Initializing read data database...');

    const exists = await fileExists(filePath);

    if (exists) {
      console.log('Read data database file exists, reading data...');
      readDataCache = await readFile();
    } else {
      console.log(
        'Read data database file does not exist, creating new one...'
      );
      readDataCache = [];

      await writeFile(readDataCache);
    }

    if (!Array.isArray(readDataCache)) {
      console.log('Invalid read data structure, resetting...');
      readDataCache = [];
      await writeFile(readDataCache);
    }

    console.log(
      'Read data database initialized with',
      readDataCache.length,
      'entries'
    );
    return true;
  } catch (error) {
    console.error('Error initializing read data database:', error);
    readDataCache = [];
    return false;
  }
}

function formatDate(date) {
  const d = date || new Date();
  return d.toISOString().split('T')[0];
}

export async function getReadDataForDate(date) {
  try {
    if (!readDataCache) {
      await init();
    }

    const formattedDate = date || formatDate(new Date());

    const dayData = readDataCache.find((item) => item.date === formattedDate);

    return dayData || null;
  } catch (error) {
    console.error('Error getting read data for date:', error);
    return null;
  }
}

export async function getReadDataForDateRange(startDate, endDate) {
  try {
    if (!readDataCache) {
      await init();
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return readDataCache.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  } catch (error) {
    console.error('Error getting read data for date range:', error);
    return [];
  }
}

export async function recordReadingSession(
  bookId,
  startPage,
  endPage,
  startTime,
  endTime
) {
  try {
    if (!readDataCache) {
      await init();
    }

    const book = await getBook(bookId);
    if (!book) {
      console.error('Book not found:', bookId);
      return false;
    }

    const today = formatDate(new Date());
    const pagesRead = endPage - startPage;

    if (pagesRead <= 0) {
      console.error('Invalid pages read:', pagesRead);
      return false;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInMinutes = Math.round((end - start) / 60000);

    const durationFormatted =
      durationInMinutes >= 60
        ? `${(durationInMinutes / 60).toFixed(1)}H`
        : `${durationInMinutes}M`;

    let todayData = readDataCache.find((item) => item.date === today);

    if (!todayData) {
      todayData = {
        date: today,
        totalPagesRead: 0,
        totalDurationSpent: '0M',
        books: [],
        goalsAchieved: {
          dailyPages: false,
          dailyDuration: false,
        },
      };
      readDataCache.push(todayData);
    }

    let bookData = todayData.books.find((item) => item.id === bookId);

    if (!bookData) {
      bookData = {
        id: bookId,
        name: book.name,
        pagesRead: 0,
        durationSpent: '0M',
        sessions: [],
      };
      todayData.books.push(bookData);
    }

    bookData.sessions.push({
      startTime,
      endTime,
      pagesRead,
      startPage,
      endPage,
    });

    bookData.pagesRead += pagesRead;

    const bookCurrentMinutes = convertDurationToMinutes(bookData.durationSpent);
    const newBookMinutes = bookCurrentMinutes + durationInMinutes;
    bookData.durationSpent = formatMinutesToDuration(newBookMinutes);

    todayData.totalPagesRead += pagesRead;

    const currentMinutes = convertDurationToMinutes(
      todayData.totalDurationSpent
    );
    const newTotalMinutes = currentMinutes + durationInMinutes;
    todayData.totalDurationSpent = formatMinutesToDuration(newTotalMinutes);

    todayData.goalsAchieved = await checkDailyGoalsAchievement(
      todayData.totalPagesRead,
      todayData.totalDurationSpent
    );

    const success = await writeFile(readDataCache);

    return success;
  } catch (error) {
    console.error('Error recording reading session:', error);
    return false;
  }
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

export async function getWeeklyStats() {
  try {
    if (!readDataCache) {
      await init();
    }

    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const weekData = await getReadDataForDateRange(
      formatDate(startDate),
      formatDate(endDate)
    );

    let totalPagesRead = 0;
    let totalMinutes = 0;
    const bookIds = new Set();
    const completedBookIds = new Set();

    weekData.forEach((dayData) => {
      totalPagesRead += dayData.totalPagesRead;
      totalMinutes += convertDurationToMinutes(dayData.totalDurationSpent);

      dayData.books.forEach((book) => {
        bookIds.add(book.id);

        const bookObj = getBook(book.id);
        if (bookObj && book.endPage >= bookObj.totalPages) {
          completedBookIds.add(book.id);
        }
      });
    });

    return {
      totalPagesRead,
      totalDurationSpent: formatMinutesToDuration(totalMinutes),
      uniqueBooksRead: bookIds.size,
      booksCompleted: completedBookIds.size,
    };
  } catch (error) {
    console.error('Error getting weekly stats:', error);
    return {
      totalPagesRead: 0,
      totalDurationSpent: '0M',
      uniqueBooksRead: 0,
      booksCompleted: 0,
    };
  }
}

init().catch((error) =>
  console.error('Failed to initialize read data database:', error)
);

export default {
  init,
  getReadDataForDate,
  getReadDataForDateRange,
  recordReadingSession,
  getWeeklyStats,
};
