import { Filesystem, Directory } from '@capacitor/filesystem';
import { v4 as uuidv4 } from 'uuid';

const filePath = 'bookri_books.json';

let booksCache = null;

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
      console.log('Books database file does not exist yet');
      return { books: [] };
    }

    const result = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully read books database file');

    try {
      return JSON.parse(result.data);
    } catch (parseError) {
      console.error('Error parsing books JSON:', parseError);
      return { books: [] };
    }
  } catch (error) {
    console.error('Error reading books file:', error);
    return { books: [] };
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
      console.error('Error stringifying books data:', stringifyError);
      return false;
    }

    await Filesystem.writeFile({
      path: filePath,
      data: jsonData,
      directory: Directory.Data,
      encoding: 'utf8',
    });

    console.log('Successfully wrote books database file');

    booksCache = data;
    return true;
  } catch (error) {
    console.error('Error writing books file:', error);

    console.error('Write error details:', JSON.stringify(error));
    return false;
  }
}

export async function init() {
  try {
    console.log('Initializing books database...');

    const exists = await fileExists(filePath);

    if (exists) {
      console.log('Books database file exists, reading data...');
      booksCache = await readFile();
    } else {
      console.log('Books database file does not exist, creating new one...');
      booksCache = { books: [] };

      await writeFile(booksCache);
    }

    if (!booksCache || !Array.isArray(booksCache.books)) {
      console.log('Invalid books data structure, resetting...');
      booksCache = { books: [] };
      await writeFile(booksCache);
    }

    console.log(
      'Books database initialized with',
      booksCache.books.length,
      'books'
    );
    return true;
  } catch (error) {
    console.error('Error initializing books database:', error);
    booksCache = { books: [] };
    return false;
  }
}

export async function addBook(book) {
  try {
    if (!booksCache) {
      await init();
    }

    const requiredFields = ['fileLocation', 'totalPages', 'fileFormat'];
    for (const field of requiredFields) {
      if (!book[field]) {
        return `${field} is required`;
      }
    }

    const now = new Date().toISOString();
    const newBook = {
      id: uuidv4(),
      name: book.name || 'Untitled Book',
      author: book.author || 'Unknown Author',
      fileLocation: book.fileLocation,
      coverImage: book.coverImage || null,
      totalPages: book.totalPages,
      addedDate: now,
      fileFormat: book.fileFormat,
      fileSize: book.fileSize || 0,
      progress: {
        currentPage: 0,
        percentage: 0,
        lastReadDate: null,
      },
      bookmarks: [],
      metadata: book.metadata || {
        language: 'en',
        publisher: '',
        publicationDate: '',
        isbn: '',
        categories: [],
      },
    };

    // Add to books array
    booksCache.books.push(newBook);

    // Save to file
    const success = await writeFile(booksCache);

    if (!success) {
      console.error('Failed to save book to file');
      return null;
    }

    console.log('Book added successfully:', newBook.id);
    return newBook.id;
  } catch (error) {
    console.error('Error adding book:', error);
    return null;
  }
}

export async function getBook(id) {
  try {
    if (!booksCache) {
      await init();
    }

    const book = booksCache.books.find((book) => book.id === id);
    return book || null;
  } catch (error) {
    console.error('Error getting book:', error);
    return null;
  }
}

export async function getBooks() {
  try {
    if (!booksCache) {
      await init();
    }

    return booksCache.books;
  } catch (error) {
    console.error('Error getting books:', error);
    return [];
  }
}

export async function updateProgress(id, progress) {
  try {
    if (!booksCache) {
      await init();
    }

    const bookIndex = booksCache.books.findIndex((book) => book.id === id);

    if (bookIndex === -1) {
      console.error('Book not found:', id);
      return false;
    }

    const percentage =
      (progress.currentPage / booksCache.books[bookIndex].totalPages) * 100;

    booksCache.books[bookIndex].progress = {
      currentPage: progress.currentPage,
      percentage: percentage.toFixed(2),
      lastReadDate: new Date().toISOString(),
    };

    const success = await writeFile(booksCache);

    if (!success) {
      console.error('Failed to save progress to file');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating progress:', error);
    return false;
  }
}

init().catch((error) =>
  console.error('Failed to initialize books database:', error)
);

export default {
  init,
  addBook,
  getBook,
  getBooks,
  updateProgress,
};
