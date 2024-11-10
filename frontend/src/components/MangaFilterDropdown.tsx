// src/components/MangaFilterDropdown.tsx

import React from 'react';

interface MangaFilterDropdownProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
}

const MangaFilterDropdown: React.FC<MangaFilterDropdownProps> = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="flex flex-wrap space-x-4 mb-4">
      {/* Type Filter */}
      <select
        value={filters.type || ''}
        onChange={(e) => handleFilterChange('type', e.target.value)}
        className="p-2 border rounded-md w-full md:w-auto"
      >
        <option value="">All Types</option>
        <option value="manga">Manga</option>
        <option value="novel">Novel</option>
        <option value="lightnovel">Light Novel</option>
        <option value="oneshot">One-shot</option>
        <option value="doujin">Doujin</option>
        <option value="manhwa">Manhwa</option>
        <option value="manhua">Manhua</option>
      </select>

      {/* Status Filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="p-2 border rounded-md w-full md:w-auto"
      >
        <option value="">All Statuses</option>
        <option value="publishing">Publishing</option>
        <option value="complete">Completed</option>
        <option value="hiatus">On Hiatus</option>
        <option value="discontinued">Discontinued</option>
        <option value="upcoming">Upcoming</option>
      </select>

      {/* Score Filter */}
      <select
        value={filters.score || ''}
        onChange={(e) => handleFilterChange('score', e.target.value)}
        className="p-2 border rounded-md w-full md:w-auto"
      >
        <option value="">All Scores</option>
        <option value="8">8+</option>
        <option value="7">7+</option>
        <option value="6">6+</option>
        <option value="5">5+</option>
      </select>

      {/* Order By Filter */}
      <select
        value={filters.order_by || ''}
        onChange={(e) => handleFilterChange('order_by', e.target.value)}
        className="p-2 border rounded-md w-full md:w-auto"
      >
        <option value="title">Title</option>
        <option value="start_date">Start Date</option>
        <option value="end_date">End Date</option>
        <option value="score">Score</option>
        <option value="rank">Rank</option>
      </select>

      {/* Sort Order Filter */}
      <select
        value={filters.sort || ''}
        onChange={(e) => handleFilterChange('sort', e.target.value)}
        className="p-2 border rounded-md w-full md:w-auto"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default MangaFilterDropdown;
