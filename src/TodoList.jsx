import { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = "https://todo-list-w-api.onrender.com/api/todos/"; // Your API endpoint

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editId, setEditId] = useState(null);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "black" : "lightblue";
        fetchTasks();  // Fetch tasks on component mount
    }, [darkMode]);

    // Function to fetch tasks from backend
    const fetchTasks = async () => {
        try {
            const response = await axios.get(API_URL);
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Function to add a task to the backend
    const addTask = async () => {
        if (task.trim() === "") return;
        const newTask = { title: task, completed: false };

        try {
            const response = await axios.post(API_URL, newTask);
            setTasks([...tasks, response.data]); // Update tasks state with the newly added task
            setTask(""); // Clear the input field
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Function to mark a task as completed
    const markCompleted = async (id) => {
        const taskToUpdate = tasks.find((t) => t.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        try {
            const response = await axios.put(`${API_URL}${id}/`, updatedTask);
            setTasks(tasks.map((t) => (t.id === id ? response.data : t))); // Update the state with the updated task
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Function to start editing a task
    const editTask = (id) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (taskToEdit) {
            setTask(taskToEdit.title);
            setEditId(id);
        }
    };

    // Function to update a task
    const updateTask = async () => {
        if (!editId || task.trim() === "") return;

        const updatedTask = { title: task, completed: false };

        try {
            const response = await axios.put(`${API_URL}${editId}/`, updatedTask);
            setTasks(tasks.map((t) => (t.id === editId ? response.data : t))); // Update state with the updated task
            setEditId(null); // Reset the edit mode
            setTask(""); // Clear the input field
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Function to delete a task
    const removeTask = async (id) => {
        try {
            await axios.delete(`${API_URL}${id}/`);
            setTasks(tasks.filter((t) => t.id !== id)); // Remove task from the state
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Filter tasks based on the filter state (all, completed, pending)
    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        return !t.completed;
    });

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("theme", darkMode ? "light" : "dark"); // Save the theme preference in local storage
    };

    return (
        <div style={{
            height: '100vh',
            backgroundColor: darkMode ? 'black' : 'lightblue',
            color: darkMode ? 'white' : 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            transition: 'all 0.5s ease-in-out'
        }}>

            <button
                onClick={toggleDarkMode}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: 'lightblue',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                }}
            >
                {darkMode ? '☀️ ' : '🌙 '}
            </button>

            <div style={{
                backgroundColor: darkMode ? 'black' : 'lightblue',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: darkMode
                    ? '0 10px 30px rgba(255, 255, 255, 0.1)'
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                width: '400px',
                transition: 'all 0.5s ease-in-out'
            }}>

                <div style={{ textAlign: 'center' }}>
                    <h2>✅ Todo-List App</h2>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        style={{
                            padding: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            width: '100%',
                            backgroundColor: 'white',
                            color: 'black'
                        }}
                    />
                    <button
                        onClick={editId ? updateTask : addTask}
                        style={{
                            backgroundColor: editId ? '#FFA500' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {editId ? 'Update' : '➕ Add'}
                    </button>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    {["all", "completed", "pending"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                backgroundColor: filter === status ? '#007bff' : '#e0e0e0',
                                color: filter === status ? 'white' : 'black',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>

                <ul style={{ marginTop: '20px', padding: '0' }}>
                    {filteredTasks.length === 0 ? (
                        <p>No tasks listed.</p>
                    ) : (
                        filteredTasks.map((t) => (
                            <li key={t.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px',
                                borderBottom: '1px solid #e0e0e0'
                            }}>
                                <span style={{
                                    textDecoration: t.completed ? 'line-through' : 'none',
                                    color: t.completed ? '#32CD32' : 'black'
                                }}>
                                    {t.title}
                                </span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={() => markCompleted(t.id)}>✔️</button>
                                    <button onClick={() => editTask(t.id)}>✏️</button>
                                    <button onClick={() => removeTask(t.id)}>❌</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
