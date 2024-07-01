import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [status]);

  const fetchTasks = () => {
    axios.get('/tasks', { params: { status } })
      .then(response => {
        setTasks(response.data);
        setError(null);
      })
      .catch(error => console.error(error));
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const createTask = (task) => {
    axios.post('/tasks', task)
      .then(response => {
        setTasks([...tasks, response.data]);
        setError(null);
      })
      .catch(error => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          console.error(error);
        }
      });
  };

  return (
    <div>
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select value={status} onChange={handleStatusChange}>
        <option value="All">All</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
      {/* Add a form or button to create a new task */}
    </div>
  );
};

export default TaskManager;
