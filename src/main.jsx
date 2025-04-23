import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Tab from './navigation/Tab.jsx';
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import Reader from './pages/Reader.jsx';
import Goals from './pages/Goals.jsx';
import Profile from './pages/Profile.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Tab /> {}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/profile" element={<Profile />} />

        {}
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
