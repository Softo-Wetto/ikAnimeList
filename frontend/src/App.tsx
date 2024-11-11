// src/App.tsx

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AnimeListPage from './pages/AnimeListPage';
import AnimeDetailsPage from './pages/AnimeDetailsPage';
import MangaListPage from './pages/MangaListPage';
import MangaDetailsPage from './pages/MangaDetailsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import AnimeCategoryPage from './pages/AnimeCategoryPage';        


const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/anime" element={<AnimeListPage />} />
    <Route path="/anime/:id" element={<AnimeDetailsPage />} /> 
    <Route path="/anime/category/:category" element={<AnimeCategoryPage />} /> 
    <Route path="/manga" element={<MangaListPage />} />
    <Route path="/manga/:id" element={<MangaDetailsPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/contact" element={<ContactPage />} />
  </Routes>
);

export default App;
