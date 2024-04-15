import React from 'react'
import { useReducer } from 'react'
import { useState } from 'react'
import { v4 as uuid } from "uuid";
import './styles.css'

const ACTIONS = {
  ADD_TODO: 'add-todo',
  DELETE_TODO: 'delete-todo',
  UPDATE_TODO: 'update-todo',
}

function reducer (state, action) {
  switch (action.type){
    case ACTIONS.ADD_TODO:
      if(action.payload.priority === 'High'){ // if newTodo is high priority add it to the top
        return [
          { id: uuid(), 
            name: action.payload.newTodo, 
            priority: action.payload.priority
          }, 
            ...state,
          ]
      }

      if(action.payload.priority === 'Medium'){
        let half = Math.floor(state.length / 2)
        let firstHalf = state.slice(0, half)
        let secondHalf = state.slice(half)
        return [...firstHalf, 
          { id: uuid(), 
            name: action.payload.newTodo, 
            priority: action.payload.priority 
          },
          ...secondHalf
        ]
      }

      return [...state, 
        { id: uuid(), 
          name: action.payload.newTodo, 
          priority: action.payload.priority 
        }]

    case ACTIONS.DELETE_TODO:
      return state.filter( todo => todo.id !== action.payload.id)


    case ACTIONS.UPDATE_TODO:
        return state.map(todo => {
          if(todo.id === action.payload.id){
            return {...todo, name: action.payload.newTodo}
          }
          return todo
        }
      )

    default:
      return state
  }
}



function ForStyling() {
  const [state, dispatch] = useReducer(reducer, [])
  const [newTodo, setNewTodo] = useState('')
  const [priority, setPriority] = useState('Low')
  const [doneTodos, setDoneTodos] = useState([])
  const [visibleTable, setVisibleTable] = useState(true)
  
  const handleAdd = (newTodo, priority) => {

    if(newTodo === ''){
      alert('Please enter a todo')
      return
    }

    if(state.find(todo => todo.name === newTodo))
    {
      alert('Todo already exists')
      return
    }

    dispatch({
      type: ACTIONS.ADD_TODO,
      payload: {newTodo, priority}
    })
    setNewTodo('')
    setPriority('Low')
  }

  const handleDelete = (id) => {
    dispatch({
      type: ACTIONS.DELETE_TODO,
      payload: {id}
    })
  }

  const handleUpdate = (id) => {
    const newTodo = prompt('Enter new todo')

    if(!newTodo){
      alert('Todo cannot be empty')
      return
    }

    if(state.find(todo => todo.name === newTodo)){
      alert('Todo already exists')
      return
    }

    dispatch({
      type: ACTIONS.UPDATE_TODO,
      payload: {id, newTodo}
    })
  }

  const handleDone = (id) => {
    const doneTodo = state.find(todo => todo.id === id)
    setDoneTodos([...doneTodos, doneTodo])
    dispatch({
      type: ACTIONS.DELETE_TODO,
      payload: {id}
    })
  }

  const handleDeleteDone = (id) => {
    setDoneTodos(doneTodos.filter(todo => todo.id !== id))
  }

  const showTodoTable = () => {
    setVisibleTable(true)
  }

  const showDoneTable = () => {
    setVisibleTable(false)
  }


  return (
    <div className='container'> 
      <div className='inputs-container'>
          <h2 className='inputs-header'>Enter a Todo</h2>
          <div className='todo-container'>
              <div className='todo-input-container'>
                <label>Todo</label>
                <input type='text' value={newTodo} onChange={e => setNewTodo(e.target.value)}/>
              </div>

              <div className='todo-priority-container'>
                <label>Priority</label>
                <select value={priority} onChange={e=> setPriority(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
          </div>

          <button className='add-todo-button' onClick={() => handleAdd(newTodo, priority)}>Add Todo</button>
      </div>
    {/* <button>View Todo</button>
    <button>View Done</button> */}

    <div className='table-container'>
      <div className='table-header-container'>
        <div>
          <h2>Todo List</h2>
        </div>

        <div className='table-header-buttons-container'>
          <button className='table-header-button' onClick={showTodoTable}>View Todo</button>
          <button className='table-header-button' onClick={showDoneTable}>View Done</button>
        </div>
      </div>
      
      {visibleTable ?
        <div className='table-main-section-container'>
          <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Todo</th>
              <th>Priority</th>
              <th>Delete</th>
              <th>Update</th>
              <th>Done</th>
            </tr>
          </thead>
          <tbody>
            {state.map(todo => (
              <tr key={todo.id}>
                <td>{todo.id.slice(0,8)}</td>
                <td>{todo.name}</td>
                <td style={{ color: 
                  todo.priority === 'High' ? 'red' : 
                  todo.priority === 'Medium' ? 'orange' : 
                  'white' }}>
                  {todo.priority}
                </td>
                <td>
                  <button className='table-delete-button' onClick={() => handleDelete(todo.id)}>Delete</button>
                </td>
                <td>
                  <button className='table-update-button' onClick={() => handleUpdate(todo.id)}>Update</button>
                </td>
                <td>
                  <button className='table-done-button' onClick={() => handleDone(todo.id)}>Done</button>
                </td>
              </tr>
            ))
            }
          </tbody>
        </table>
      </div>
      :
      <div className='table-main-section-container'>
        <h2>Done Todos</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Todo</th>
              <th>Priority</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {doneTodos.map(todo => (
              <tr key={todo.id}>
                <td>{todo.id.slice(0,8)}</td>
                <td>{todo.name}</td>
                <td 
                  style=
                  {{ color: 
                    todo.priority === 'High' ? 'red' : 
                    todo.priority === 'Medium' ? 'orange' : 
                    'white'
                  }}>
                  {todo.priority}
                </td>
                <td>
                  <button className='table-delete-button' onClick={() => handleDeleteDone(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      }
    </div>
  </div>
    )
}

export default ForStyling
