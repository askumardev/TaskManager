import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [status]);

  const fetchTasks = () => {
    axios.get('/tasks', { params: { status } })
      .then(response => {
        // Ensure the response is an array
        const data = Array.isArray(response.data) ? response.data : [response.data];
        console.log(data);
        setTasks(data);
        setError(null);
      })
      .catch(error => {
        console.error(error);
        setError('Error fetching tasks');
      });
  };

  return (
    <div className="container">
      <h1>Task List</h1>
      {error && <p>{error}</p>}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <tt>Description</tt>{task.description} |    <b>Status</b>: {task.status}
            {/* <p>Created At: {new Date(task.created_at).toLocaleString()}</p>
            <p>Updated At: {new Date(task.updated_at).toLocaleString()}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Task;
