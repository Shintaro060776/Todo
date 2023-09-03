import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/tasks');
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    const formData = {
      date,
      title,
      task
    };

    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      // Successfully added data can be appended to tasks
      setTasks([...tasks, data]);

      // Optionally clear the form after successful submission
      setDate("");
      setTitle("");
      setTask("");

      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = async (id, updatedTask) => {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      console.log(response);
      const data = await response.json();
      // 更新したタスクをstateで反映させる（省略）
      const updatedTasks = tasks.map(t => t._id === id ? data : t);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' });
      // 削除したタスクをstateから削除する（省略）
      const remainingTasks = tasks.filter(t => t._id !== id);
      setTasks(remainingTasks);
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <div className="App">
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label>Task:</label>
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>

      <h2>Tasks:</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <strong>Date:</strong> {task.date} <br />
            <strong>Title:</strong> {task.title} <br />
            <strong>Task:</strong> {task.task}
            {editingId === task._id ? (
              <div>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={task} onChange={(e) => setTask(e.target.value)} />
                <button onClick={() => { handleEdit(task._id, { date, title, task }); setEditingId(null); }}>Save</button>
              </div>
            ) : (
              <div>
                <button onClick={() => setEditingId(task._id)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;