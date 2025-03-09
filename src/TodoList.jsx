import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // Save Dark Mode in LocalStorage
    useEffect(() => {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    // Function to add or update a task
    const addTask = () => {
        if (task.trim() === "") return;
        if (editIndex !== null) {
            const updatedTasks = tasks.map((t, i) =>
                i === editIndex ? { ...t, name: task } : t
            );
            setTasks(updatedTasks);
            setEditIndex(null);
        } else {
            setTasks([...tasks, { name: task, completed: false }]);
        }
        setTask("");
    };

    // Function to mark task as completed
    const markCompleted = (index) => {
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
    };

    // Function to edit a task
    const editTask = (index) => {
        setTask(tasks[index].name);
        setEditIndex(index);
    };

    // Function to delete a task
    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    // Function to clear all tasks
    const clearAllTasks = () => {
        setTasks([]);
    };

    // Filter tasks based on filter selection
    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
    });

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div style={{
            height: '100vh',
            backgroundColor: darkMode ? '#121212' : '#f4f4f4',
            color: darkMode ? 'white' : 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            transition: 'all 0.3s'
        }}>

            {/* 💎 DARK MODE BUTTON IN UPPER LEFT CORNER */}
            <button
                onClick={toggleDarkMode}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: darkMode ? '#ffb703' : '#007bff',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>

            {/* 💖 THE TASKS CARD */}
            <div style={{
                backgroundColor: darkMode ? '#1c1c1c' : 'white',
                padding: '30px',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                width: '400px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                    <h2>✅ Todo-List App</h2>
                </div>

                {/* Input Field */}
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
                            backgroundColor: darkMode ? '#2c2c2c' : 'white',
                            color: darkMode ? 'white' : 'black'
                        }}
                    />
                    <button
                        onClick={addTask}
                        style={{
                            backgroundColor: editIndex !== null ? '#FFA500' : '#4CAF50',
                            color: 'white',
                            border: 'none',
                            padding: '10px 15px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {editIndex !== null ? 'Update' : '➕ Add'}
                    </button>
                </div>

                {/* Task List */}
                <ul style={{ marginTop: '20px', padding: '0' }}>
                    {filteredTasks.length === 0 ? (
                        <p>wala pay task</p>
                    ) : (
                        filteredTasks.map((t, index) => (
                            <li key={index}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '10px',
                                    borderBottom: '1px solid #e0e0e0'
                                }}
                            >
                                <span style={{
                                    textDecoration: t.completed ? 'line-through' : 'none',
                                    color: t.completed ? '#32CD32' : 'black'
                                }}>
                                    {t.name}
                                </span>

                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        onClick={() => markCompleted(index)}
                                        style={{
                                            backgroundColor: '#32CD32',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}>
                                        Completed
                                    </button>
                                    <button
                                        onClick={() => editTask(index)}
                                        style={{
                                            backgroundColor: '#FFA500',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeTask(index)}
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white',
                                            padding: '5px 10px',
                                            border: 'none',
                                            borderRadius: '5px'
                                        }}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
