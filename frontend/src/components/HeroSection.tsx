// src/components/HeroSection.tsx

import React from 'react';
import Button from './Button';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-primary text-white text-center py-20 px-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to My Anime & Manga List</h1>
      <p className="text-lg mb-8 max-w-xl mx-auto">
        Discover the best anime and manga from around the world! Explore our top lists
        and find your next favorite series.
      </p>
      <div className="flex justify-center space-x-6">
        <Button to="/anime">Explore Anime</Button>
        <Button to="/manga">Explore Manga</Button>
      </div>
    </section>
  );
};

export default HeroSection;
