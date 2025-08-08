// src/components/TodoList.jsx
import React from 'react';
import Todo from './Todo';
import './TodoList.css'; // Import specific component CSS

function TodoList({ todos, completeTodo, removeTodo, updateTodo }) {
  return (
    <div className="todo-list-container">
      {todos.length === 0 ? (
        <p className="todo-list-empty-message">
          No tasks yet! Add one above.
        </p>
      ) : (
        todos.map((todo) => (
          <Todo
            todo={todo}
            key={todo.id} /* Using todo.id as the unique key */
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        ))
      )}
    </div>
  );
}

export default TodoList;