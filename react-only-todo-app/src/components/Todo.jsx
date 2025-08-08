// src/components/Todo.jsx
import React, { useState } from 'react';
import TodoForm from './TodoForm';
import './Todo.css';

function Todo({ todo, completeTodo, removeTodo, updateTodo }) {
  const [edit, setEdit] = useState({
    id: null,
    value: ''
  });

  const submitUpdate = value => {
    updateTodo(edit.id, value); // Value now includes text and dueDate
    setEdit({
      id: null,
      value: ''
    });
  };

  if (edit.id) {
    return <TodoForm onSubmit={submitUpdate} initialValue={edit.value} edit={edit} />;
  }

  // Format dueDate for display
  const formattedDueDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div
      className={`todo-item ${todo.isComplete ? 'todo-item-completed' : ''}`}
      key={todo.id}
    >
      <div className="todo-item-content"> {/* Wrap text and date */}
        <div className="todo-item-text" onClick={() => completeTodo(todo.id)}>
          {todo.text}
        </div>
        {formattedDueDate && (
          <div className="todo-item-due-date">
            Due: {formattedDueDate}
          </div>
        )}
      </div>
      <div className="todo-item-actions">
        <button
          onClick={() => removeTodo(todo.id)}
          className="todo-action-button todo-action-delete"
          title="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-size">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
        <button
          onClick={() => setEdit({ id: todo.id, value: todo.text, isComplete: todo.isComplete, dueDate: todo.dueDate })} // Pass dueDate to edit
          className="todo-action-button todo-action-edit"
          title="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-size">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.268z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Todo;