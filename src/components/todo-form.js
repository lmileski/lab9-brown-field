import { LitElement, html, css } from 'lit';

/**
 * TodoForm - Input form for adding new todos.
 * 
 * @class
 * @extends {LitElement}
 * @fires add-todo - Dispatched when a new todo is submitted
 * 
 * @property {string} inputValue - Current value of the input field
 */
export class TodoForm extends LitElement {
  static properties = {
    inputValue: { state: true }
  };

  static styles = css`
    :host {
      display: block;
      margin-bottom: 20px;
    }

    form {
      display: flex;
      gap: 8px;
    }

    input {
      flex: 1;
      padding: 12px 16px;
      font-size: 16px;
      border: 2px solid var(--color-border, #e0e0e0);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.3s, background 0.3s ease, color 0.3s ease;
      background: var(--color-surface, white);
      color: var(--color-text, #333);
    }

    input:focus {
      border-color: var(--color-primary, #667eea);
    }

    button {
      padding: 12px 24px;
      background: var(--color-primary, #667eea);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: var(--color-primary-hover, #5568d3);
    }

    button:active {
      transform: translateY(1px);
    }

    button:disabled {
      background: var(--color-btn-disabled, #ccc);
      cursor: not-allowed;
    }
  `;

  /**
   * Creates a TodoForm instance.
   */
  constructor() {
    super();
    this.inputValue = '';
  }

  /**
   * Handles form submission.
   * Dispatches add-todo event with trimmed text and clears input.
   * 
   * @param {Event} e - Form submit event
   */
  handleSubmit(e) {
    e.preventDefault();
    const text = this.inputValue.trim();

    if (text) {
      this.dispatchEvent(new CustomEvent('add-todo', {
        detail: { text },
        bubbles: true,
        composed: true
      }));

      this.inputValue = '';
    }
  }

  /**
   * Handles input changes.
   * 
   * @param {Event} e - Input event
   */
  handleInput(e) {
    this.inputValue = e.target.value;
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          type="text"
          placeholder="What needs to be done?"
          .value=${this.inputValue}
          @input=${this.handleInput}
          aria-label="New todo"
          maxlength="500"
          autofocus
        />
        <button type="submit" ?disabled=${!this.inputValue.trim()}>
          Add
        </button>
      </form>
    `;
  }
}

customElements.define('todo-form', TodoForm);
