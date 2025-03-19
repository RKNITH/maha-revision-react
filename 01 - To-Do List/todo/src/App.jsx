import React, { useState, useEffect } from 'react'

const App = () => {

  const [todos, setTodos] = useState([])
  const [task, setTask] = useState('')
  const [editIndex, setEditIndex] = useState(null)


  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem('todos')) || []
    if (savedTodos.length > 0) {
      setTodos(savedTodos)
    }
  }, [])

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);


  const addTodo = () => {
    if (task.trim() === '') return

    let newTodos = [...todos]
    if (editIndex !== null) {
      newTodos[editIndex] = task
      setEditIndex(null)
    }
    else {
      newTodos.push(task)
    }
    setTodos(newTodos)
    setTask('')
    localStorage.setItem('todos', JSON.stringify(newTodos))


  }

  const editTodo = (index) => {
    setTask(todos[index])
    setEditIndex(index)

  }

  const deleteTodo = (index) => {
    let newTodos = todos.filter((_, i) => i !== index)
    setTodos(newTodos)
    localStorage.setItem('todos', JSON.stringify(newTodos))

  }




  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">TODO List</h1>
      <div className="mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
          className="border p-2 rounded w-64"
        />
        <button onClick={addTodo} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
          {editIndex !== null ? 'Update' : 'Add'}
        </button>
      </div>
      <div className="w-full max-w-md">
        {todos.map((todo, index) => (
          <div key={index} className="bg-white p-3 rounded shadow mb-2 flex justify-between">
            <span>{todo}</span>
            <div>
              <button onClick={() => editTodo(index)} className="text-yellow-500 mr-2">Edit</button>
              <button onClick={() => deleteTodo(index)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App