import React from 'react'
import { useReducer } from 'react'
import { useState } from 'react'
import { v4 as uuid } from "uuid";

const ACTIONS = {
  ADD_TODO: 'add-todo',
  DELETE_TODO: 'delete-todo',
  UPDATE_TODO: 'update-todo',
}


function reducer (state, action) {
  switch (action.type){
    case ACTIONS.ADD_TODO:
      if(action.payload.isHighPriority){ // if newTodo is high priority add it to the top
        return [
          { id: uuid(), 
            name: action.payload.newTodo, 
            isHighPriority: action.payload.isHighPriority
          }, 
            ...state,
          ]
      }

      return [...state, 
        { id: uuid(), 
          name: action.payload.newTodo, 
          isHighPriority: action.payload.isHighPriority 
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

function App() {

  const [state, dispatch] = useReducer(reducer, [])
  const [newTodo, setNewTodo] = useState('')
  const [isHighPriority, setIsHighPriority] = useState(false)
  const [doneTodos, setDoneTodos] = useState([])
  const [isTodoVisible, setIsTodoVisible] = useState(true)

  // console.log(state)


  const handleAdd = (newTodo,isHighPriority) =>{
    if(!newTodo){
      alert('Todo cannot be empty')
      return
    }

    if(state.find(todo => todo.name === newTodo)){
      alert('Todo already exists')
      return
    }

    dispatch({ type: ACTIONS.ADD_TODO, payload: { newTodo, isHighPriority } })
    setNewTodo('')
  }

  const handleDelete = (id) => {
    dispatch({ type: ACTIONS.DELETE_TODO, payload: {id}})
  }

  const handleUpdate = (id) => {
    const newTodo = prompt('Update todo:')
    // const isHighPriority = prompt('Is it high priority? (true/false)')
    if(!newTodo){
      alert('Todo cannot be empty')
      return
    }

    if(state.find(todo => todo.name === newTodo)){
      alert('Todo already exists')
      return
    }

    dispatch({ type: ACTIONS.UPDATE_TODO, payload: {id, newTodo}})
  }

  const handleDone = (id) => {
    const doneTodo = state.find(todo => todo.id === id)
    setDoneTodos([...doneTodos, doneTodo])
    dispatch({ type: ACTIONS.DELETE_TODO, payload: {id}})
  }

  const handleDeleteDone = (id) => {
    setDoneTodos(doneTodos.filter(todo => todo.id !== id))
  }

  const changeVisibility = () => {
    setIsTodoVisible(!isTodoVisible)
  }

  return (
    <div> 
      <div>
          <label>Enter a new todo</label>
          <input type='text' value={newTodo} onChange={e => setNewTodo(e.target.value)} />
          <input type='checkbox' value={isHighPriority} onChange={e => setIsHighPriority(e.target.checked)} />
      </div>

      <button onClick={() => handleAdd(newTodo, isHighPriority)}>Add Todo</button>
      <button onClick={changeVisibility}>{isTodoVisible ? 'View Done' : 'View Todo'}</button>

      {isTodoVisible ?
      <div>
        <h2>Todos</h2>
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
              <td>{todo.isHighPriority ? 'High' : 'Low'}</td>
              <td>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </td>
              <td>
                <button onClick={() => handleUpdate(todo.id)}>Update</button>
              </td>
              <td>
                <button onClick={() => handleDone(todo.id)}>Done</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      :
      <div>
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
              <td>{todo.isHighPriority ? 'High' : 'Low'}</td>
              <td>
                <button onClick={() => handleDeleteDone(todo.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      }
    </div>
  )
}

export default App
