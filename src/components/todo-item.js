import { LitElement, html, css } from 'lit';

/**
 * TodoItem - Individual todo item component.
 * Handles display, editing, toggling completion, and deletion.
 * 
 * @class
 * @extends {LitElement}
 * @fires toggle-todo - Dispatched when checkbox is toggled
 * @fires delete-todo - Dispatched when delete button is clicked
 * @fires update-todo - Dispatched when todo text is edited and saved
 * 
 * @property {Object} todo - The todo object to display
 * @property {boolean} isEditing - Whether the item is in edit mode
 * @property {string} editValue - Current value of the edit input
 */
export class TodoItem extends LitElement {
  static properties = {
    todo: { type: Object },
    isEditing: { state: true },
    editValue: { state: true }
  };

  static styles = css`
    :host {
      display: block;
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--color-surface, white);
      border-radius: 8px;
      margin-bottom: 8px;
      transition: box-shadow 0.2s, background 0.3s ease;
    }

    .todo-item:hover {
      box-shadow: 0 2px 8px var(--color-surface-hover, rgba(0, 0, 0, 0.1));
    }

    .checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .todo-text {
      flex: 1;
      font-size: 16px;
      color: var(--color-text, #333);
      word-break: break-word;
      transition: color 0.3s ease;
    }

    .todo-text.completed {
      color: var(--color-text-completed, #999);
    }

    .edit-input {
      flex: 1;
      padding: 8px;
      font-size: 16px;
      border: 2px solid var(--color-primary, #667eea);
      border-radius: 4px;
      outline: none;
      color: var(--color-text, #333);
      background: var(--color-surface, white);
      transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    button {
      padding: 6px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    .edit-btn {
      background: var(--color-btn-edit, #4CAF50);
      color: white;
    }

    .edit-btn:hover {
      background: var(--color-btn-edit-hover, #45a049);
    }

    .delete-btn {
      background: var(--color-btn-delete, #f44336);
      color: white;
    }

    .delete-btn:hover {
      background: var(--color-btn-delete-hover, #da190b);
    }

    .save-btn {
      background: var(--color-btn-save, #2196F3);
      color: white;
    }

    .save-btn:hover {
      background: var(--color-btn-save-hover, #0b7dda);
    }

    .cancel-btn {
      background: var(--color-btn-cancel, #757575);
      color: white;
    }

    .cancel-btn:hover {
      background: var(--color-btn-cancel-hover, #616161);
    }
  `;

  /**
   * Creates a TodoItem instance.
   */
  constructor() {
    super();
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handles toggling the todo's completion status.
   * Dispatches toggle-todo event.
   */
  handleToggle() {
    this.dispatchEvent(new CustomEvent('toggle-todo', {
      detail: { id: this.todo.id },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles deleting the todo with confirmation.
   * Dispatches delete-todo event.
   */
  handleDelete() {
    if (confirm('Delete this todo?')) {
      this.dispatchEvent(new CustomEvent('delete-todo', {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Enters edit mode and loads current todo text.
   */
  handleEdit() {
    this.isEditing = true;
    this.editValue = this.todo.text;
  }

  /**
   * Saves the edited todo text if valid.
   * Dispatches update-todo event and exits edit mode.
   */
  handleSave() {
    const trimmedValue = this.editValue.trim();
    if (trimmedValue) {
      this.dispatchEvent(new CustomEvent('update-todo', {
        detail: { id: this.todo.id, text: trimmedValue },
        bubbles: true,
        composed: true
      }));
    }
    // Always exit edit mode after save attempt
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Cancels editing and exits edit mode without saving.
   */
  handleCancel() {
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handles keyboard shortcuts in edit mode.
   * Enter saves, Escape cancels.
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    } else if (e.key === 'Escape') {
      this.handleCancel();
    }
  }

  render() {
    if (this.isEditing) {
      return html`
        <div class="todo-item">
          <input
            class="edit-input"
            type="text"
            .value=${this.editValue}
            @input=${(e) => this.editValue = e.target.value}
            @keydown=${this.handleKeyDown}
            maxlength="500"
            autofocus
          />
          <div class="button-group">
            <button class="save-btn" @click=${this.handleSave}>Save</button>
            <button class="cancel-btn" @click=${this.handleCancel}>Cancel</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="todo-item">
        <input
          type="checkbox"
          class="checkbox"
          .checked=${this.todo.completed}
          @change=${this.handleToggle}
          aria-label="Toggle todo"
        />
        <span class="todo-text ${this.todo.completed ? 'completed' : ''}">
          ${this.todo.text}
        </span>
        <div class="button-group">
          <button
            class="edit-btn"
            @click=${this.handleEdit}
            aria-label="Edit todo">
            Edit
          </button>
          <button
            class="delete-btn"
            @click=${this.handleDelete}
            aria-label="Delete todo">
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-item', TodoItem);
