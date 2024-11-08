// src/components/Header.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fetch token from localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);

    if (token) {
      try {
        const decodedToken = jwtDecode<{ username: string }>(token);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, [authToken]); // Re-run if authToken changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null); // Clear token in state
    setUsername(null); // Clear username
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
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

        <div className="relative space-x-4">
          {authToken && username ? (
            <div className="relative inline-block">
              <button onClick={toggleDropdown} className="hover:text-accent transition duration-300">
                {username}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
