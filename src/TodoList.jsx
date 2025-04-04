import { useState, useEffect } from "react";

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

    const fetchTasks = async () => {
        const response = await fetch("https://todo-list-w-api.onrender.com/api/todos/");
        const data = await response.json();
        setTasks(data);
    };

    const addTask = async () => {
        if (task.trim() === "") return;
        const newTask = { title: task, completed: false };
    
        try {
            console.log("Adding Task:", newTask); // ✅ Debug log
            const response = await fetch("https://todo-list-w-api.onrender.com/api/todos/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
    
            console.log("Response Status:", response.status); // ✅ Debug log
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to add task:", errorText); // ✅ Print error response
                throw new Error("Failed to add task");
            }
    
            const data = await response.json();
            console.log("Task Added Successfully:", data); // ✅ Debug log
            setTasks([...tasks, data]);
            setTask("");
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const markCompleted = async (id) => {
        const taskToUpdate = tasks.find((t) => t.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        const response = await fetch(`https://todo-list-w-api.onrender.com/api/todos/${id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            const data = await response.json();
            setTasks(tasks.map((t) => (t.id === id ? data : t)));
        }
    };

    const editTask = (id) => {
        const taskToEdit = tasks.find((t) => t.id === id);
        if (taskToEdit) {
            setTask(taskToEdit.title);
            setEditId(id);
        }
    };

    const updateTask = async () => {
        if (!editId || task.trim() === "") return;

        const updatedTask = { title: task, completed: false };

        const response = await fetch(`https://todo-list-w-api.onrender.com/api/todos/${editId}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            const data = await response.json();
            setTasks(tasks.map((t) => (t.id === editId ? data : t)));
            setEditId(null);
            setTask("");
        }
    };

    const removeTask = async (id) => {
        await fetch(`https://todo-list-w-api.onrender.com/api/todos/${id}/`, { method: "DELETE" });
        setTasks(tasks.filter((t) => t.id !== id));
    };

    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        return !t.completed;
    });

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
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
