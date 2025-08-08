// src/App.jsx
import React from 'react';
import TodoApp from './components/TodoApp'; // We'll create this
import './App.css'; // Import global app styles

function App() {
  return (
    <div className="app-container">
      <TodoApp />
    </div>
  );
}

export default App;