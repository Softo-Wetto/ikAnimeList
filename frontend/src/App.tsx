// src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimeListPage from './pages/AnimeListPage';
import MangaListPage from './pages/MangaListPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';        


const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/anime" element={<AnimeListPage />} />
    <Route path="/manga" element={<MangaListPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
  </Routes>
);

export default App;
