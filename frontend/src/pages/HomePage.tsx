// src/pages/HomePage.tsx

import React from 'react';
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {  
  return (
    <Layout>
      <HeroSection />
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-primary mb-10">Why You'll Love Our Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Top Anime & Manga</h3>
            <p className="text-gray-600">
              Discover the highest-rated and most popular anime and manga with ease.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Up-to-Date Information</h3>
            <p className="text-gray-600">
              Stay current with the latest trends and releases in the world of anime and manga.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">User-Friendly Design</h3>
            <p className="text-gray-600">
              Enjoy a clean, easy-to-use interface designed with anime and manga lovers in mind.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
