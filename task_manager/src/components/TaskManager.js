import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/task_manager.css'; // Import the CSS file

// Bind modal to your app element
Modal.setAppElement('#root');

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('All');
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [status]);

  const fetchTasks = () => {
    axios.get('/tasks', { params: { status } })
      .then(response => {
        setTasks(response.data);
        setError(null);
      })
      .catch(error => {
        console.error(error);
        setError('Error fetching tasks');
      });
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, newTask);
    } else {
      createTask(newTask);
    }
    setNewTask({ title: '', description: '', status: 'To Do' });
    setIsModalOpen(false);
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
          setError('Error creating task');
        }
      });
  };

  const updateTask = (id, updatedTask) => {
    axios.put(`/tasks/${id}`, updatedTask)
      .then(response => {
        setTasks(tasks.map(task => (task.id === id ? response.data : task)));
        setError(null);
        setEditingTask(null);
      })
      .catch(error => {
        if (error.response && error.response.data.error) {
          setError(error.response.data.error);
        } else {
          console.error(error);
          setError('Error updating task');
        }
      });
  };

  const deleteTask = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      axios.delete(`/tasks/${id}`)
        .then(() => {
          setTasks(tasks.filter(task => task.id !== id));
          setError(null);
        })
        .catch(error => {
          console.error(error);
          setError('Error deleting task');
        });
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description, status: task.status });
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setEditingTask(null);
      setNewTask({ title: '', description: '', status: 'To Do' });
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div onChange={handleStatusChange}>
        <label>
          <input type="radio" value="All" checked={status === 'All'} />
          All
        </label>
        <label>
          <input type="radio" value="To Do" checked={status === 'To Do'} />
          To Do
        </label>
        <label>
          <input type="radio" value="In Progress" checked={status === 'In Progress'} />
          In Progress
        </label>
        <label>
          <input type="radio" value="Done" checked={status === 'Done'} />
          Done
        </label>
        <div className="btn">
          <button onClick={toggleModal} className="create-button">
            {isModalOpen ? 'Cancel' : 'Create Task'}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={toggleModal}
        contentLabel="Task Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editingTask ? 'Edit Task' : 'Create New Task'}</h2>
        <form onSubmit={handleFormSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newTask.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={newTask.description}
              onChange={handleInputChange}
            />
          </div>
          {editingTask && (
            <div>
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          )}
          <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
          {isModalOpen && (
            <button type="button" onClick={toggleModal}>Cancel</button>
          )}
        </form>
      </Modal>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => startEditing(task)} className="edit-button">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskManager;
