import { useContext, useRef, useState } from "react"
import { TodoContext } from "./App"

export function TodoItem({ name, id, isComplete }) {
  const { toggleTodo, deleteTodo, updateTodo } = useContext(TodoContext)
  const [isEditing, setIsEditing] = useState(false)
  const nameRef = useRef()
  function handleSubmit(e) {
    e.preventDefault()

    if (nameRef.current.value === "") return

    updateTodo(id, nameRef.current.value)

    setIsEditing(false)
  }
  return (
    <li className="list-item" key={id}>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input autoFocus type="text" defaultValue={name} ref={nameRef} />
          <button data-button-save>Save</button>
          <button data-button-cancel onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <label className="list-item-label">
          <input
            type="checkbox"
            data-list-item-checkbox
            checked={isComplete}
            onChange={(e) => toggleTodo(id, e.target.checked)}
          />

          <span data-list-item-text>{name}</span>
          <button data-button-edit onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button data-button-delete onClick={() => deleteTodo(id)}>
            Delete
          </button>
        </label>
      )}
    </li>
  )
}
