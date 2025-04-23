Bookri
Bookri is a cross-platform book reading application built with React, Vite, and Capacitor, providing a native experience on Android, web browsers, and desktop PCs.

Features
Current Features (Beta v1)

Home Page: Personalized dashboard with your current reads and recommendations
Goals: Set and track your reading goals with streak-based motivation
Book Reader: Smooth, intuitive reading experience
Profile: View your detailed reading statistics
Streaks: Maintain your reading habits with daily streaks
Reminders: Never miss your reading time with customizable notifications
Detailed Statistics: Track your reading progress, speed, and habits

Coming Soon (Beta v1.2)

Dictionary: Look up words without leaving your book
Reading Tools: Get AI-powered explanations and learn new words
Dark Mode: Comfortable reading in low-light environments

Installation
Prerequisites

Node.js (v14 or higher)
npm or yarn
Android Studio (for Android development)

Setup

Clone the repository:

git clone https://github.com/yourusername/bookri.git
cd bookri


Install dependencies:

npm install
# or
yarn install

Running the Application
Web
To run the application in your browser:
npm run dev
# or
yarn dev

This will start a development server, typically at http://localhost:5173/.
Desktop
To run as a desktop application:
npm run build
npm run electron
# or
yarn build
yarn electron

Android
To build and run on Android:
npm run build
npx cap sync android
npx cap open android
# or
yarn build
npx cap sync android
npx cap open android

Then build and run the project from Android Studio.
Building for Production
Web
npm run build
# or
yarn build

The built files will be in the dist directory.
Android
npm run build
npx cap sync android
npx cap build android
# or
yarn build
npx cap sync android
npx cap build android

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Thanks to all contributors who have helped shape Bookri
Built with React, Vite, and Capacitor
