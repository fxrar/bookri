bookri/
├── src/
│   ├── pages/
│   │   ├── Home.jsx               # Home page with recent reads, goals
│   │   ├── Books.jsx              # Library view with all books
│   │   ├── Reader.jsx             # Book reading page
│   │   ├── Goals.jsx              # Set and track reading goals
│   │   ├── Profile.jsx            # User stats and analytics
│   │   ├── Settings.jsx           # App preferences
│   │   └── Search.jsx             # Book search functionality
│   │
│   ├── db/
│   │   ├── db.js                  # Database initialization
│   │   ├── bookStore.js           # Book data operations
│   │   ├── readingStore.js        # Reading data and sessions
│   │   ├── goalStore.js           # Reading goals management
│   │   ├── highlightStore.js      # Highlights and bookmarks
│   │   └── statsStore.js          # Reading statistics
│   │
│   ├── components/
│   │   ├── books/
│   │   │   ├── BookCard.jsx       # Book card for library
│   │   │   ├── BookGrid.jsx       # Grid of books
│   │   │   ├── BookList.jsx       # List view of books
│   │   │   ├── BookCover.jsx      # Book cover image component
│   │   │   └── ProgressBar.jsx    # Reading progress indicator
│   │   │
│   │   ├── reader/
│   │   │   ├── ReaderToolbar.jsx  # Reader top controls
│   │   │   ├── PageView.jsx       # Page rendering component
│   │   │   ├── Dictionary.jsx     # Dictionary lookup
│   │   │   ├── Explainer.jsx      # AI explanation feature
│   │   │   ├── BookmarkButton.jsx # Add/remove bookmark
│   │   │   ├── HighlightTool.jsx  # Text highlighting tool
│   │   │   └── ReaderSettings.jsx # Font, theme controls
│   │   │
│   │   ├── goals/
│   │   │   ├── GoalCard.jsx       # Goal display card
│   │   │   ├── GoalSetter.jsx     # Set new goals
│   │   │   └── GoalProgress.jsx   # Progress visualization
│   │   │
│   │   ├── stats/
│   │   │   ├── ReadingChart.jsx   # Reading data visualization
│   │   │   ├── StreakCounter.jsx  # Reading streak display
│   │   │   └── StatsSummary.jsx   # Stats summary component
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.jsx         # Custom button component
│   │   │   ├── Card.jsx           # Card container
│   │   │   ├── Modal.jsx          # Modal dialog
│   │   │   ├── Tabs.jsx           # Tab navigation
│   │   │   ├── Toast.jsx          # Toast notifications
│   │   │   └── Loader.jsx         # Loading indicator
│   │   │
│   │   └── layout/
│   │       ├── Header.jsx         # App header
│   │       ├── Footer.jsx         # App footer
│   │       ├── TabBar.jsx         # Bottom tab navigation
│   │       └── PageContainer.jsx  # Common page wrapper
│   │
│   ├── hooks/
│   │   ├── useBooks.js            # Book management hooks
│   │   ├── useReader.js           # Reader functionality
│   │   ├── useGoals.js            # Goals management
│   │   ├── useStats.js            # Statistics hooks
│   │   └── useFileSystem.js       # File system operations
│   │
│   ├── utils/
│   │   ├── fileUtils.js           # File handling utilities
│   │   ├── timeUtils.js           # Time formatting and calculations
│   │   ├── epubParser.js          # EPUB file parsing
│   │   ├── pdfParser.js           # PDF file parsing
│   │   └── statsCalculator.js     # Statistics calculations
│   │
│   ├── context/
│   │   ├── AppContext.jsx         # Global app context
│   │   ├── BookContext.jsx        # Book data context
│   │   └── ThemeContext.jsx       # Theme management
│   │
│   ├── styles/
│   │   ├── tailwind.css           # Tailwind imports
│   │   ├── reader.css             # Reader-specific styles
│   │   └── animations.css         # Custom animations
│   │
│   ├── assets/
│   │   ├── icons/                 # App icons
│   │   ├── images/                # Static images
│   │   └── fonts/                 # Custom fonts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.jsx       # Main navigation setup
│   │   ├── TabNavigator.jsx       # Tab navigation config
│   │   └── routes.js              # Route definitions
│   │
│   ├── services/
│   │   ├── notifications.js       # Reading reminder notifications
│   │   ├── fileSystem.js          # File system operations
│   │   ├── dictionary.js          # Dictionary API service
│   │   └── analytics.js           # Usage analytics
│   │
│   ├── App.jsx                    # Main App component
│   └── index.jsx                  # Entry point
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
│
├── capacitor.config.json          # Capacitor configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── package.json
└── README.md
