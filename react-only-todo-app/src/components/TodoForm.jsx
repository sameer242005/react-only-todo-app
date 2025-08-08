// src/components/TodoForm.jsx
import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker'; // NEW: Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // NEW: Import DatePicker styles
import './TodoForm.css';

function TodoForm(props) {
  const [input, setInput] = useState(props.initialValue ? props.initialValue : '');
  const [selectedDate, setSelectedDate] = useState(props.edit?.dueDate || null); // NEW: State for selected date
  const inputRef = useRef(null);

  useEffect(() => {
    if (props.initialValue) {
      setInput(props.initialValue);
    }
    if (props.edit?.dueDate) { // Update selectedDate if in edit mode and a date exists
      setSelectedDate(props.edit.dueDate);
    } else if (!props.edit) { // Clear date if not in edit mode
      setSelectedDate(null);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.initialValue, props.edit]);

  const handleChange = e => {
    setInput(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();

    props.onSubmit({
      id: props.edit ? props.edit.id : Date.now(),
      text: input,
      isComplete: props.edit ? props.edit.isComplete : false,
      dueDate: selectedDate // NEW: Pass selectedDate with the todo
    });

    setInput('');
    setSelectedDate(null); // Clear date after submission
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder={props.edit ? "Update task..." : "Add a new task..."}
        value={input}
        name="text"
        onChange={handleChange}
        className="todo-input"
        ref={inputRef}
      />
      {/* NEW: DatePicker component */}
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="MMM d, yyyy"
        placeholderText="Due Date..."
        className="todo-datepicker"
        isClearable
      />
      <button className="todo-button">
        {props.edit ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
}

export default TodoForm;