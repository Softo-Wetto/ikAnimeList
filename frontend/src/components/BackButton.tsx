// src/components/BackButton.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-semibold py-2 px-4 rounded-lg shadow-md bg-white hover:bg-indigo-50 transition duration-200"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
      </svg>
      <span>Back</span>
    </button>
  );
};

export default BackButton;
