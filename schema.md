Bookri App - Complete Schema and Project Structure
Complete Database Schema
{
  // Books collection
  "books": [
    {
      "id": "book_123456", // Unique identifier for the book
      "name": "Homo Sapiens",
      "author": "Yuval Noah Harari",
      "fileLocation": "/storage/books/homo_sapiens.epub", // Path to the book file
      "coverImage": "/storage/covers/homo_sapiens.jpg", // Optional cover image
      "totalPages": 300,
      "addedDate": "2025-03-15T14:30:00Z",
      "fileFormat": "epub", // epub, pdf, mobi, etc.
      "fileSize": 2500000, // In bytes
      "progress": {
        "currentPage": 19,
        "percentage": 6.33, // (currentPage/totalPages)*100
        "lastReadDate": "2025-03-19T10:45:00Z"
      },
      "category": "Fiction"
      "bookmarked": true,
      "currentlyReading": false,
      "bookmarks": [
        {
          "id": "bm_78901",
          "name": "Chapter related to humans",
          "page": 19,
          "position": 0.45, // Position within the page (0-1)
          "dateCreated": "2025-03-19T10:30:00Z",
          "notes": "Interesting perspective on human evolution" // Optional notes
        }
      ],
      "metadata": {
        "language": "en",
        "publisher": "Random House",
        "publicationDate": "2014-02-10",
        "isbn": "9780062316097",
        "categories": ["History", "Anthropology", "Science"]
      }
    }
  ],
  
  // User reading goals
  "goals": {
    "daily": {
      "duration": "30M", // 30 minutes
      "pages": 20
    },
    "weekly": {
      "duration": "3.5H", // 3.5 hours
      "pages": 140,
      "books": 1
    },
    "notifications": {
      "enabled": true,
      "reminderTime": "19:00" // Time for daily reminder
    }
  },
  
  // Reading data (activity tracking)
  "readData": [
    {
      "date": "2025-03-19",
      "totalPagesRead": 90,
      "totalDurationSpent": "10M", // 10 minutes
      "books": [
        {
          "id": "book_123456",
          "name": "Homo Sapiens",
          "pagesRead": 90,
          "durationSpent": "10M",
          "sessions": [
            {
              "startTime": "2025-03-19T09:30:00Z",
              "endTime": "2025-03-19T09:40:00Z",
              "pagesRead": 90,
              "startPage": 10,
              "endPage": 19
            }
          ]
        }
      ],
      "goalsAchieved": {
        "dailyPages": false, // 90 < 20
        "dailyDuration": false // 10M < 30M
      }
    }
  ],
  
  // User preferences
  "preferences": {
    "theme": "dark", // dark, light, sepia
    "fontSize": 16,
    "fontFamily": "Georgia",
    "lineSpacing": 1.5,
    "margins": "medium", // narrow, medium, wide
    "dictionary": {
      "enabled": true,
      "language": "en"
    },
    "scrollDirection": "vertical" // vertical, horizontal
  },
  
  // User highlights
  "highlights": [
    {
      "id": "hl_345678",
      "bookId": "book_123456",
      "page": 15,
      "position": {
        "start": 0.2,
        "end": 0.4
      },
      "text": "Humans began as an animal of no significance",
      "color": "#FFEB3B", // Yellow
      "dateCreated": "2025-03-18T15:20:00Z",
      "notes": "Key thesis of the book"
    }
  ],
  
  // User stats (aggregated data)
  "stats": {
    "totalBooksRead": 12,
    "totalBooksStarted": 18,
    "totalPagesRead": 3450,
    "totalTimeSpent": "85H", // 85 hours
    "dailyStreak": 7, // Days in a row with reading activity
    "bestDailyStreak": 21,
    "averageDailyReading": "25M", // 25 minutes
    "yearlyStats": {
      "2025": {
        "booksRead": 5,
        "pagesRead": 1280,
        "timeSpent": "32H"
      }
    },
    "monthlyStats": {
      "2025-03": {
        "booksRead": 2,
        "pagesRead": 520,
        "timeSpent": "12.5H"
      }
    }
  }
}

