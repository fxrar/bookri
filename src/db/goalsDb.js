import { Filesystem, Directory } from '@capacitor/filesystem';

const filePath = 'bookri_goals.json';

let goalsCache = null;

const defaultGoals = {
  daily: {
    duration: '30M',
    pages: 20,
  },
  weekly: {
    duration: '3.5H',
    pages: 140,
    books: 1,
  },
  notifications: {
    enabled: true,
    reminderTime: '19:00',
  },
};

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
      console.log('Goals database file does not exist yet');
      return { ...defaultGoals };
    }

    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully read goals database file');

    try {
      return JSON.parse(result.data);
    } catch (parseError) {
      console.error('Error parsing goals JSON:', parseError);
      return { ...defaultGoals };
    }
  } catch (error) {
    console.error('Error reading goals file:', error);
    return { ...defaultGoals };
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
      console.error('Error stringifying goals data:', stringifyError);
      return false;
    }

    await Filesystem.writeFile({
      path: filePath,
      data: jsonData,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully wrote goals database file');

    goalsCache = data;
    return true;
  } catch (error) {
    console.error('Error writing goals file:', error);
    console.error('Write error details:', JSON.stringify(error));
    return false;
  }
}

export async function init() {
  try {
    console.log('Initializing goals database...');

    const exists = await fileExists(filePath);

    if (exists) {
      console.log('Goals database file exists, reading data...');
      goalsCache = await readFile();
    } else {
      console.log('Goals database file does not exist, creating new one...');
      goalsCache = { ...defaultGoals };

      await writeFile(goalsCache);
    }

    if (!goalsCache || !goalsCache.daily || !goalsCache.weekly) {
      console.log('Invalid goals data structure, resetting...');
      goalsCache = { ...defaultGoals };
      await writeFile(goalsCache);
    }

    console.log('Goals database initialized');
    return true;
  } catch (error) {
    console.error('Error initializing goals database:', error);
    goalsCache = { ...defaultGoals };
    return false;
  }
}

export async function getGoals() {
  try {
    if (!goalsCache) {
      await init();
    }

    return goalsCache;
  } catch (error) {
    console.error('Error getting goals:', error);
    return { ...defaultGoals };
  }
}

export async function updateDailyGoals(dailyGoals) {
  try {
    if (!goalsCache) {
      await init();
    }

    goalsCache.daily = {
      ...goalsCache.daily,
      ...dailyGoals,
    };

    return await writeFile(goalsCache);
  } catch (error) {
    console.error('Error updating daily goals:', error);
    return false;
  }
}

export async function updateWeeklyGoals(weeklyGoals) {
  try {
    if (!goalsCache) {
      await init();
    }

    goalsCache.weekly = {
      ...goalsCache.weekly,
      ...weeklyGoals,
    };

    return await writeFile(goalsCache);
  } catch (error) {
    console.error('Error updating weekly goals:', error);
    return false;
  }
}

export async function updateNotifications(notificationSettings) {
  try {
    if (!goalsCache) {
      await init();
    }

    goalsCache.notifications = {
      ...goalsCache.notifications,
      ...notificationSettings,
    };

    return await writeFile(goalsCache);
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return false;
  }
}

export async function checkDailyGoalsAchievement(pagesRead, durationSpent) {
  try {
    if (!goalsCache) {
      await init();
    }

    const durationInMinutes = convertDurationToMinutes(durationSpent);
    const goalDurationInMinutes = convertDurationToMinutes(
      goalsCache.daily.duration
    );

    return {
      dailyPages: pagesRead >= goalsCache.daily.pages,
      dailyDuration: durationInMinutes >= goalDurationInMinutes,
      overall:
        pagesRead >= goalsCache.daily.pages &&
        durationInMinutes >= goalDurationInMinutes,
    };
  } catch (error) {
    console.error('Error checking daily goals achievement:', error);
    return {
      dailyPages: false,
      dailyDuration: false,
      overall: false,
    };
  }
}

export async function checkWeeklyGoalsAchievement(
  pagesRead,
  durationSpent,
  booksCompleted
) {
  try {
    if (!goalsCache) {
      await init();
    }

    const durationInMinutes = convertDurationToMinutes(durationSpent);
    const goalDurationInMinutes = convertDurationToMinutes(
      goalsCache.weekly.duration
    );

    return {
      weeklyPages: pagesRead >= goalsCache.weekly.pages,
      weeklyDuration: durationInMinutes >= goalDurationInMinutes,
      weeklyBooks: booksCompleted >= goalsCache.weekly.books,
      overall:
        pagesRead >= goalsCache.weekly.pages &&
        durationInMinutes >= goalDurationInMinutes &&
        booksCompleted >= goalsCache.weekly.books,
    };
  } catch (error) {
    console.error('Error checking weekly goals achievement:', error);
    return {
      weeklyPages: false,
      weeklyDuration: false,
      weeklyBooks: false,
      overall: false,
    };
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

init().catch((error) =>
  console.error('Failed to initialize goals database:', error)
);

export default {
  init,
  getGoals,
  updateDailyGoals,
  updateWeeklyGoals,
  updateNotifications,
  checkDailyGoalsAchievement,
  checkWeeklyGoalsAchievement,
};
