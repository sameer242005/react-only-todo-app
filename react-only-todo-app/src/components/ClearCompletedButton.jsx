// src/components/ClearCompletedButton.jsx
import React from 'react';
import './ClearCompletedButton.css'; // Import specific component CSS

function ClearCompletedButton({ onClear }) {
  return (
    <button
      onClick={onClear}
      className="clear-completed-button"
    >
      Clear Completed
    </button>
  );
}

export default ClearCompletedButton;