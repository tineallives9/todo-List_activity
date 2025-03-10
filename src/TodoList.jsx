import { useState, useEffect } from "react";

export default function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [filter, setFilter] = useState("all");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        document.body.style.backgroundColor = darkMode ? "black" : "lightblue";
    }, [darkMode]);


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


    const markCompleted = (index) => {
        const updatedTasks = tasks.map((t, i) =>
            i === index ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
    };

    const editTask = (index) => {
        setTask(tasks[index].name);
        setEditIndex(index);
    };

    const removeTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };


    const filteredTasks = tasks.filter((t) => {
        if (filter === "all") return true;
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
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
                    backgroundColor: darkMode ? 'lightblue' : 'lightblue',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    borderColor : "white",
                    
                }}
            >
                {darkMode ? '🤍 ' : '🖤 '}
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
                            backgroundColor: darkMode ? 'white' : 'white',
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

                <div style={{ marginBottom: '20px', textAlign: 'center' }}>

<div style={{ 
    marginBottom: '20px', 
    textAlign: 'center', 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '10px' 
}}>
    <button
        onClick={() => setFilter("all")}
        style={{
            backgroundColor: filter === "all" ? '#007bff' : '#e0e0e0',
            color: filter === "all" ? 'white' : 'black',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}
    >
        All Tasks
    </button>

    <button
        onClick={() => setFilter("completed")}
        style={{
            backgroundColor: filter === "completed" ? '#32CD32' : '#e0e0e0',
            color: filter === "completed" ? 'white' : 'black',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}
    >
        Completed
    </button>

    <button
        onClick={() => setFilter("pending")}
        style={{
            backgroundColor: filter === "pending" ? '#FF6347' : '#e0e0e0',
            color: filter === "pending" ? 'white' : 'black',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}
    >
        Pending
    </button>
</div>

</div>


                <ul style={{ marginTop: '20px', padding: '0' }}>
                    {filteredTasks.length === 0 ? (
                        <p>No task listed.</p>
                    ) : (
                        filteredTasks.map((t, index) => (
                            <li key={index}
                                style={{
                                    display: 'flex',
                                   
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
                                            backgroundColor: 'pink',
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
