import { createContext, useEffect, useReducer, useState } from "react"
import "./styles.css"
import { NewTodoForm } from "./NewTodoForm"
import { TodoList } from "./TodoList"
import { TodoFilterForm } from "./TodoFilterForm"

const LOCAL_STORAGE_KEY = "TODOS"
const TODO_ACTIONS = {
  ADD: "ADD",
  UPDATE: "UPDATE",
  TOGGLE: "TOGGLE",
  DELETE: "DELETE",
  HIDE: "HIDE",
}

function reducer(todos, { type, payload }) {
  switch (type) {
    case TODO_ACTIONS.ADD:
      return [
        ...todos,
        { name: payload.name, isComplete: false, id: crypto.randomUUID() },
      ]
    case TODO_ACTIONS.TOGGLE:
      return todos.map((todo) => {
        if (todo.id === payload.id) {
          return { ...todo, isComplete: payload.completed }
        }
        return todo
      })
    case TODO_ACTIONS.DELETE:
      return todos.filter((todo) => todo.id !== payload.id)
    case TODO_ACTIONS.UPDATE:
      return todos.map((todo) => {
        if (todo.id === payload.id) return { ...todo, name: payload.name }
        return todo
      })
    default:
      throw new Error(`No action found ${type}`)
  }
}

export const TodoContext = createContext()

function App() {
  const [filterName, setFilterName] = useState("")
  const [hideCompletedFilter, setHideCompletedFilter] = useState(false)
  const [todos, dispatch] = useReducer(reducer, [], (initialValue) => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (value == null) return initialValue

    return JSON.parse(value)
  })

  const filteredTodos = todos.filter((todo) => {
    if (hideCompletedFilter && todo.isComplete) return false
    return todo.name.includes(filterName)
  })

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function addNewTodo(name) {
    dispatch({ type: TODO_ACTIONS.ADD, payload: { name } })
  }

  function toggleTodo(id, completed) {
    dispatch({
      type: TODO_ACTIONS.TOGGLE,
      payload: { id, completed },
    })
  }

  function deleteTodo(id) {
    dispatch({ type: TODO_ACTIONS.DELETE, payload: { id } })
  }

  function updateTodo(id, name) {
    dispatch({ type: TODO_ACTIONS.UPDATE, payload: { id, name } })
  }

  return (
    <TodoContext.Provider
      value={{
        todos: filteredTodos,
        addNewTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
      }}
    >
      <TodoFilterForm
        filterName={filterName}
        setFilterName={setFilterName}
        hideCompleted={hideCompletedFilter}
        setHideCompleted={setHideCompletedFilter}
      />
      <TodoList />
      <NewTodoForm />
    </TodoContext.Provider>
  )
}

export default App
