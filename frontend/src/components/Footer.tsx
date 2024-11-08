// src/components/Footer.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-6 shadow-inner">
      <div className="container mx-auto text-center text-sm">
        
        {/* Footer Links */}
        <div className="mb-4 space-x-6">
          <a href="/privacy" className="hover:text-accent transition duration-300">Privacy Policy</a>
          <a href="/terms" className="hover:text-accent transition duration-300">Terms of Service</a>
        </div>

        {/* Copyright */}
        <p className="mb-4">&copy; {new Date().getFullYear()} My Anime List. All rights reserved.</p>
        
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition duration-300">
            <FontAwesomeIcon icon={faFacebook} size="lg" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition duration-300">
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition duration-300">
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;