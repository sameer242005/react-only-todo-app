// src/components/TodoApp.jsx
import React, { useState, useEffect, useMemo } from 'react'; // NEW: useEffect for data fetching
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import FilterButtons from './FilterButtons';
import ClearCompletedButton from './ClearCompletedButton';
import './TodoApp.css';

// NEW: Firebase Firestore imports
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your firebase.js exports 'db'
import { writeBatch } from 'firebase/firestore';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true); // NEW: Loading state for Firestore fetch
  const [error, setError] = useState(null);   // NEW: Error state for Firestore

  // NEW: useEffect to fetch todos from Firestore on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);
        const q = query(collection(db, "todos"), orderBy("timestamp", "desc")); // Order by creation time
        const querySnapshot = await getDocs(q);
        const fetchedTodos = querySnapshot.docs.map(doc => ({
          id: doc.id, // Firestore document ID
          ...doc.data(),
          // Convert Firestore Timestamp to Date object for react-datepicker
          dueDate: doc.data().dueDate ? doc.data().dueDate.toDate() : null
        }));
        setTodos(fetchedTodos);
      } catch (err) {
        console.error("Error fetching todos from Firestore:", err);
        setError("Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []); // Empty dependency array: runs once on mount


  const addTodo = async (todo) => { // Make async
    if (!todo.text || todo.text.trim() === '') {
      return;
    }
    try {
      // NEW: Add todo to Firestore
      const docRef = await addDoc(collection(db, "todos"), {
        text: todo.text.trim(),
        isComplete: false,
        dueDate: todo.dueDate || null, // Save dueDate as Firestore Timestamp or null
        timestamp: new Date() // Add a timestamp for ordering
      });
      // Update local state with the new todo, including the Firestore-generated ID
      setTodos([{ id: docRef.id, ...todo, isComplete: false }, ...todos]);
    } catch (err) {
      console.error("Error adding todo to Firestore:", err);
      setError("Failed to add task.");
    }
  };

  const updateTodo = async (todoId, newValue) => { // Make async
    if (!newValue.text || newValue.text.trim() === '') {
      return;
    }
    try {
      // NEW: Update todo in Firestore
      const todoRef = doc(db, "todos", todoId);
      await updateDoc(todoRef, {
        text: newValue.text.trim(),
        dueDate: newValue.dueDate || null // Update dueDate
      });
      // Update local state
      setTodos(prev => prev.map(item => (item.id === todoId ? { ...item, text: newValue.text.trim(), dueDate: newValue.dueDate || null } : item)));
    } catch (err) {
      console.error("Error updating todo in Firestore:", err);
      setError("Failed to update task.");
    }
  };

  const removeTodo = async (id) => { // Make async
    try {
      // NEW: Delete todo from Firestore
      await deleteDoc(doc(db, "todos", id));
      // Update local state
      const removedArr = todos.filter(todo => todo.id !== id);
      setTodos(removedArr);
    } catch (err) {
      console.error("Error removing todo from Firestore:", err);
      setError("Failed to remove task.");
    }
  };

  const completeTodo = async (id) => { // Make async
    const todoToToggle = todos.find(todo => todo.id === id);
    if (!todoToToggle) return;
    try {
      // NEW: Update completion status in Firestore
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        isComplete: !todoToToggle.isComplete
      });
      // Update local state
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
        )
      );
    } catch (err) {
      console.error("Error updating completion in Firestore:", err);
      setError("Failed to update task status.");
    }
  };

  const clearCompleted = async () => { // Make async
    const completedTodos = todos.filter(todo => todo.isComplete);
    try {
      // NEW: Batch delete completed todos from Firestore
    const batch = writeBatch(db);
      completedTodos.forEach(todo => {
        batch.delete(doc(db, "todos", todo.id));
      });
      await batch.commit();
      // Update local state
      setTodos(todos.filter(todo => !todo.isComplete));
    } catch (err) {
      console.error("Error clearing completed todos:", err);
      setError("Failed to clear completed tasks.");
    }
  };


  const filteredTodos = useMemo(() => {
    // ... filtering logic remains the same ...
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.isComplete);
      case 'completed':
        return todos.filter(todo => todo.isComplete);
      default: // 'all'
        return todos;
    }
  }, [todos, filter]);

  const activeTasksCount = todos.filter(todo => !todo.isComplete).length;

  if (loading) return <div className="todo-app-loading">Loading tasks...</div>;
  if (error) return <div className="todo-app-error">Error: {error}</div>;

  return (
    <div className="todo-app-container">
      <h1 className="todo-app-title">To-Do-List</h1>

      <TodoForm onSubmit={addTodo} />

      <FilterButtons currentFilter={filter} setFilter={setFilter} />

      <TodoList
        todos={filteredTodos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />

      <div className="todo-app-footer">
        <span className="todo-app-task-count">
          {activeTasksCount} {activeTasksCount === 1 ? 'task' : 'tasks'} left
        </span>
        <ClearCompletedButton onClear={clearCompleted} />
      </div>
    </div>
  );
}

export default TodoApp;