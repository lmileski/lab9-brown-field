import { LitElement, html, css } from 'lit';
import { TodoModel } from '../models/todo-model.js';
import { StorageService } from '../services/storage-service.js';
import './todo-form.js';
import './todo-list.js';
import './todo-filter.js';

/**
 * TodoApp - Main application component.
 * Coordinates between Model and View components using the Observer pattern.
 * 
 * @class
 * @extends {LitElement}
 * 
 * @property {Array<Object>} todos - Array of todo items from the model
 * @property {number} activeCount - Count of incomplete todos
 * @property {number} completedCount - Count of completed todos
 * @property {string} currentFilter - Current filter selection
 * @property {boolean} darkMode - Whether dark mode is enabled
 */
export class TodoApp extends LitElement {
  static properties = {
    todos: { state: true },
    activeCount: { state: true },
    completedCount: { state: true },
    currentFilter: { state: true },
    totalCount: { state: true },
    darkMode: { state: true }
  };

  static styles = css`
    :host {
      display: block;
    }

    .app-container {
      background: var(--color-surface, white);
      border-radius: 16px;
      box-shadow: 0 10px 40px var(--color-shadow, rgba(0, 0, 0, 0.2));
      padding: 32px;
      min-height: 400px;
      transition: background 0.3s ease, box-shadow 0.3s ease;
    }

    h1 {
      margin: 0 0 8px 0;
      color: var(--color-text, #333);
      font-size: 32px;
      font-weight: 700;
    }

    .subtitle {
      color: var(--color-text-muted, #666);
      margin-bottom: 24px;
      font-size: 14px;
    }

    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--color-background, #f5f5f5);
      border-radius: 8px;
      margin-bottom: 20px;
      transition: background 0.3s ease;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--color-primary, #667eea);
    }

    .stat-label {
      font-size: 12px;
      color: var(--color-text-muted, #666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: 20px;
    }

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .clear-completed {
      background: var(--color-btn-warning, #ff9800);
      color: white;
    }

    .clear-completed:hover {
      background: var(--color-btn-warning-hover, #f57c00);
    }

    .clear-all {
      background: var(--color-btn-delete, #f44336);
      color: white;
    }

    .clear-all:hover {
      background: var(--color-btn-delete-hover, #da190b);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--color-border, #e0e0e0);
      text-align: center;
      color: var(--color-text-muted, #666);
      font-size: 12px;
      transition: border-color 0.3s ease, color 0.3s ease;
    }

    .theme-toggle {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 8px 12px;
      background: var(--color-background, #f5f5f5);
      border: 1px solid var(--color-border, #e0e0e0);
      border-radius: 8px;
      cursor: pointer;
      font-size: 20px;
      transition: all 0.3s ease;
    }

    .theme-toggle:hover {
      transform: scale(1.1);
    }
  `;

  /**
   * Creates a TodoApp instance.
   * Initializes the model and subscribes to changes.
   */
  constructor() {
    super();
    this.storageService = new StorageService();
    this.model = new TodoModel(this.storageService);
    this.todos = this.model.filteredTodos;
    this.activeCount = this.model.activeCount;
    this.completedCount = this.model.completedCount;
    this.currentFilter = this.model.filter;
    this.totalCount = this.model.todos.length;
    
    // Load dark mode preference
    this.darkMode = this.storageService.load('darkMode', false);
    this.applyTheme();

    // Subscribe to model changes
    this.model.subscribe(() => {
      this.todos = [...this.model.filteredTodos];
      this.activeCount = this.model.activeCount;
      this.completedCount = this.model.completedCount;
      this.currentFilter = this.model.filter;
      this.totalCount = this.model.todos.length;
    });
  }

  /**
   * Applies the current theme to the document body.
   * 
   * @private
   */
  applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  /**
   * Handles adding a new todo from the form.
   * 
   * @param {CustomEvent} e - Event with detail.text containing the todo text
   */
  handleAddTodo(e) {
    this.model.addTodo(e.detail.text);
  }

  /**
   * Handles toggling a todo's completion status.
   * 
   * @param {CustomEvent} e - Event with detail.id of the todo to toggle
   */
  handleToggleTodo(e) {
    this.model.toggleComplete(e.detail.id);
  }

  /**
   * Handles deleting a todo.
   * 
   * @param {CustomEvent} e - Event with detail.id of the todo to delete
   */
  handleDeleteTodo(e) {
    this.model.deleteTodo(e.detail.id);
  }

  /**
   * Handles updating a todo's text.
   * 
   * @param {CustomEvent} e - Event with detail.id and detail.text
   */
  handleUpdateTodo(e) {
    this.model.updateTodo(e.detail.id, e.detail.text);
  }

  /**
   * Handles clearing all completed todos with confirmation.
   */
  handleClearCompleted() {
    if (confirm('Clear all completed todos?')) {
      this.model.clearCompleted();
    }
  }

  /**
   * Handles clearing all todos with confirmation.
   */
  handleClearAll() {
    if (confirm('Clear ALL todos? This cannot be undone.')) {
      this.model.clearAll();
    }
  }

  /**
   * Handles filter change from filter tabs.
   * 
   * @param {CustomEvent} e - Event with detail.filter
   */
  handleFilterChange(e) {
    this.model.setFilter(e.detail.filter);
  }

  /**
   * Toggles dark mode on/off and persists preference.
   */
  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    this.storageService.save('darkMode', this.darkMode);
    this.applyTheme();
  }

  render() {
    return html`
      <div class="app-container">
        <button 
          class="theme-toggle" 
          @click=${this.toggleDarkMode}
          aria-label="Toggle dark mode">
          ${this.darkMode ? '☀️' : '🌙'}
        </button>

        <h1>My Tasks</h1>
        <p class="subtitle">Stay organized and productive</p>

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">${this.totalCount}</div>
            <div class="stat-label">Total</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.activeCount}</div>
            <div class="stat-label">Active</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.completedCount}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <todo-form
          @add-todo=${this.handleAddTodo}>
        </todo-form>

        <todo-filter
          .currentFilter=${this.currentFilter}
          @filter-change=${this.handleFilterChange}>
        </todo-filter>

        <todo-list
          .todos=${this.todos}
          @toggle-todo=${this.handleToggleTodo}
          @delete-todo=${this.handleDeleteTodo}
          @update-todo=${this.handleUpdateTodo}>
        </todo-list>

        <div class="actions">
          <button
            class="clear-completed"
            @click=${this.handleClearCompleted}
            ?disabled=${this.completedCount === 0}>
            Clear Completed
          </button>
          <button
            class="clear-all"
            @click=${this.handleClearAll}
            ?disabled=${this.totalCount === 0}>
            Clear All
          </button>
        </div>

        <div class="footer">
          Lab 9: The final battle!
        </div>
      </div>
    `;
  }
}

customElements.define('todo-app', TodoApp);
