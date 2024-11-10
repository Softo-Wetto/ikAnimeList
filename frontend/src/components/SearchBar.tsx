// src/components/SearchBar.tsx

import React from 'react';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, onSearchChange }) => (
  <input
    type="text"
    value={search}
    onChange={(e) => onSearchChange(e.target.value)}
    placeholder="Search..."
    className="w-full max-w-xs p-2 mb-4 border rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-primary"
  />
);

export default SearchBar;
