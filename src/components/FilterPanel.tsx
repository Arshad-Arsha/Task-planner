// src/components/FilterPanel.tsx
import React from 'react';
import { FilterState } from '../types';
import { Category } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  categories: Category[];
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  setFilters,
  categories
}) => {
  const handleCategoryChange = (categoryId: string) => {
    setFilters({
      ...filters,
      category: {
        ...filters.category,
        [categoryId]: !filters.category[categoryId]
      }
    });
  };

  const handleDurationChange = (duration: FilterState['duration']) => {
    setFilters({
      ...filters,
      duration
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      
      <div className="filter-section">
        <h4>Category</h4>
        {categories.map(category => (
          <div key={category.id} className="filter-item">
            <label>
              <input
                type="checkbox"
                checked={filters.category[category.id]}
                onChange={() => handleCategoryChange(category.id)}
              />
              <span className="category-color" style={{ backgroundColor: category.color }}></span>
              {category.name}
            </label>
          </div>
        ))}
      </div>
      
      <div className="filter-section">
        <h4>Time Range</h4>
        <div className="filter-item">
          <label>
            <input
              type="radio"
              name="duration"
              checked={filters.duration === 'all'}
              onChange={() => handleDurationChange('all')}
            />
            All Tasks
          </label>
        </div>
        <div className="filter-item">
          <label>
            <input
              type="radio"
              name="duration"
              checked={filters.duration === '1week'}
              onChange={() => handleDurationChange('1week')}
            />
            Within 1 Week
          </label>
        </div>
        <div className="filter-item">
          <label>
            <input
              type="radio"
              name="duration"
              checked={filters.duration === '2weeks'}
              onChange={() => handleDurationChange('2weeks')}
            />
            Within 2 Weeks
          </label>
        </div>
        <div className="filter-item">
          <label>
            <input
              type="radio"
              name="duration"
              checked={filters.duration === '3weeks'}
              onChange={() => handleDurationChange('3weeks')}
            />
            Within 3 Weeks
          </label>
        </div>
      </div>
    </div>
  );
};