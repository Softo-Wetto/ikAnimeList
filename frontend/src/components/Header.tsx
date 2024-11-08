// src/components/Header.tsx

import React from 'react';
import { Link, useNavigate  } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate(); 
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link to="/" className="text-2xl font-bold hover:text-accent">
          My Anime List
        </Link>
        
        <nav className="space-x-4 mx-auto flex">
          <Link to="/" className="hover:text-accent transition duration-300">
            Home
          </Link>
          <Link to="/anime" className="hover:text-accent transition duration-300">
            Anime List
          </Link>
          <Link to="/manga" className="hover:text-accent transition duration-300">
            Manga List
          </Link>
          <Link to="/contact" className="hover:text-accent transition duration-300">
            Contact
          </Link>
        </nav>

        <div className="space-x-4">
          {token ? (
            <button onClick={handleLogout} className="hover:text-accent transition duration-300">
              Logout
            </button>
          ) : (
            <>
              <Link to="/register" className="hover:text-accent transition duration-300">
                Register
              </Link>
              <Link to="/login" className="hover:text-accent transition duration-300">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
