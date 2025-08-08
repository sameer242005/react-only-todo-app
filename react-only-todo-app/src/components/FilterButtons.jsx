// src/components/FilterButtons.jsx
import React from 'react';
import './FilterButtons.css'; // Import specific component CSS

function FilterButtons({ currentFilter, setFilter }) {
  const buttonClasses = (filterName) =>
    `filter-button ${currentFilter === filterName ? 'filter-button-active' : ''}`;

  return (
    <div className="filter-buttons-container">
      <button onClick={() => setFilter('all')} className={buttonClasses('all')}>
        All
      </button>
      <button onClick={() => setFilter('active')} className={buttonClasses('active')}>
        Active
      </button>
      <button onClick={() => setFilter('completed')} className={buttonClasses('completed')}>
        Completed
      </button>
    </div>
  );
}

export default FilterButtons;