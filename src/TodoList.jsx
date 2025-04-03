import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

    const API_URL = process.env.REACT_APP_API_URL || "https://todo-list-w-api.onrender.com";
    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "black" : "lightblue";
        fetchTasks();
    }, [darkMode]);

    // Fetch tasks from backend using the environment variable
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/todos/fetch`); // Use API_URL here
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add or edit a task
    const addTask = async () => {
        if (task.trim() === "") return;

        if (editIndex !== null) {
            const updatedTask = { ...tasks[editIndex], title: task };
            try {
                const response = await fetch(`${API_URL}/api/todos/${tasks[editIndex].id}/update`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedTask),
                });
                const data = await response.json();
                setTasks(tasks.map((t, i) => (i === editIndex ? data : t)));
                setEditIndex(null);
            } catch (error) {
                console.error("Error updating task:", error);
            }
        } else {
            const newTask = { title: task, completed: false };
            try {
                const response = await fetch(`${API_URL}/api/todos/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newTask),
                });
                const data = await response.json();
                setTasks([...tasks, data]);
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
        setTask("");
    };

    // Mark task as completed
    const markCompleted = async (index) => {
        const taskToUpdate = tasks[index];
        const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };

        try {
            const response = await fetch(`${API_URL}/api/todos/${taskToUpdate.id}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });
            const data = await response.json();
            setTasks(tasks.map((t, i) => (i === index ? data : t)));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Remove a task
    const removeTask = async (index) => {
        const taskToDelete = tasks[index];

        try {
            await fetch(`${API_URL}/api/todos/${taskToDelete.id}/delete`, {
                method: "DELETE",
            });
            setTasks(tasks.filter((_, i) => i !== index));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Set task for editing
    const editTask = (index) => {
        setTask(tasks[index].title);
        setEditIndex(index);
    };

    // Filter tasks
    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        return !t.completed;
    });

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("theme", darkMode ? "light" : "dark");
    };

    return (
        <div style={{
            height: "100vh",
            backgroundColor: darkMode ? "black" : "lightblue",
            color: darkMode ? "white" : "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.5s ease-in-out",
            position: "relative"
        }}>
            <button onClick={toggleDarkMode} style={{
                position: "absolute", top: "20px", left: "20px",
                backgroundColor: "lightblue", color: "white", padding: "10px 20px",
                border: "none", borderRadius: "5px"
            }}>
                {darkMode ? "☀️" : "🌙"}
            </button>

            <div style={{
                backgroundColor: darkMode ? "black" : "lightblue",
                padding: "30px", borderRadius: "10px",
                boxShadow: darkMode ? "0 10px 30px rgba(255, 255, 255, 0.1)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
                width: "400px", transition: "all 0.5s ease-in-out"
            }}>
                <h2 style={{ textAlign: "center" }}>✅ Todo-List App</h2>

                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input type="text" placeholder="Add a new task..."
                        value={task} onChange={(e) => setTask(e.target.value)}
                        style={{
                            padding: "10px", border: "1px solid #ccc", borderRadius: "5px",
                            width: "100%", backgroundColor: "white", color: "black"
                        }} />
                    <button onClick={addTask} style={{
                        backgroundColor: editIndex !== null ? "#FFA500" : "#4CAF50",
                        color: "white", border: "none", padding: "10px 15px", borderRadius: "5px"
                    }}>
                        {editIndex !== null ? "Update" : "➕ Add"}
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    {["all", "completed", "pending"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} style={{
                            backgroundColor: filter === f ? "#007bff" : "#e0e0e0",
                            color: filter === f ? "white" : "black",
                            padding: "10px 20px", border: "none", borderRadius: "5px"
                        }}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                <ul style={{ marginTop: "20px", padding: "0" }}>
                    {filteredTasks.length === 0 ? <p>No tasks listed.</p> : filteredTasks.map((t, index) => (
                        <li key={index} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "10px", borderBottom: "1px solid #e0e0e0"
                        }}>
                            <span style={{
                                textDecoration: t.completed ? "line-through" : "none",
                                color: t.completed ? "#32CD32" : "black"
                            }}>{t.title}</span>

                            <div style={{ display: "flex", gap: "5px" }}>
                                <button onClick={() => markCompleted(index)} style={{
                                    backgroundColor: "#32CD32", color: "white", padding: "5px 10px",
                                    border: "none", borderRadius: "5px"
                                }}>✔</button>
                                <button onClick={() => editTask(index)} style={{
                                    backgroundColor: "pink", color: "white", padding: "5px 10px",
                                    border: "none", borderRadius: "5px"
                                }}>✏️</button>
                                <button onClick={() => removeTask(index)} style={{
                                    backgroundColor: "red", color: "white", padding: "5px 10px",
                                    border: "none", borderRadius: "5px"
                                }}>❌</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
