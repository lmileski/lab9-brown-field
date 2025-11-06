/**
 * TodoModel - Manages the todo list data and business logic.
 * Implements the Observer pattern for reactive updates.
 * 
 * @class
 */
export class TodoModel {
  /**
   * Creates a TodoModel instance.
   * 
   * @param {StorageService} storageService - Service for persisting todos to localStorage
   */
  constructor(storageService) {
    /**
     * @type {StorageService}
     * @private
     */
    this.storage = storageService;
    
    /**
     * @type {Array<{id: number, text: string, completed: boolean, createdAt: string}>}
     */
    this.todos = this.storage.load('items', []);
    
    /**
     * @type {Array<Function>}
     * @private
     */
    this.listeners = [];
    
    // Calculate nextId from existing todos to prevent ID conflicts
    const maxId = this.todos.length > 0 
      ? Math.max(...this.todos.map(t => t.id))
      : 0;
    
    /**
     * @type {number}
     * @private
     */
    this.nextId = Math.max(maxId + 1, this.storage.load('nextId', 1));
    
    /**
     * @type {string}
     */
    this.filter = 'all'; // 'all' | 'active' | 'completed'
  }

  /**
   * Subscribes a listener function to model changes.
   * 
   * @param {Function} listener - Callback function invoked when model changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notifies all subscribers of model changes.
   * 
   * @private
   */
  notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Adds a new todo to the list.
   * Validates that text is non-empty and under 500 characters.
   * 
   * @param {string} text - The todo text content
   */
  addTodo(text) {
    if (!text || text.trim() === '') {
      return;
    }

    const trimmedText = text.trim();
    
    // Validate max length
    if (trimmedText.length > 500) {
      console.warn('Todo text exceeds maximum length of 500 characters');
      return;
    }

    const todo = {
      id: this.nextId++,
      text: trimmedText,
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    this.save();
    this.notify();
  }

  /**
   * Toggles the completion status of a todo.
   * Creates a new todo object to trigger Lit reactivity.
   * 
   * @param {number} id - The ID of the todo to toggle
   */
  toggleComplete(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      // Create a new todo object to trigger Lit re-rendering
      this.todos[index] = {
        ...this.todos[index],
        completed: !this.todos[index].completed
      };
      this.save();
      this.notify();
    }
  }

  /**
   * Deletes a todo from the list.
   * 
   * @param {number} id - The ID of the todo to delete
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
    this.notify();
  }

  /**
   * Updates the text content of a todo.
   * Validates that new text is non-empty and under 500 characters.
   * Creates a new todo object to trigger Lit reactivity.
   * 
   * @param {number} id - The ID of the todo to update
   * @param {string} newText - The new text content
   */
  updateTodo(id, newText) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1 || !newText || newText.trim() === '') {
      return;
    }
    
    const trimmedText = newText.trim();
    
    // Validate max length
    if (trimmedText.length > 500) {
      console.warn('Todo text exceeds maximum length of 500 characters');
      return;
    }
    
    // Create a new todo object to trigger Lit re-rendering
    this.todos[index] = {
      ...this.todos[index],
      text: trimmedText
    };
    this.save();
    this.notify();
  }

  /**
   * Removes all completed todos from the list.
   */
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
    this.notify();
  }

  /**
   * Removes all todos from the list.
   */
  clearAll() {
    this.todos = [];
    this.save();
    this.notify();
  }

  /**
   * Gets the count of active (incomplete) todos.
   * 
   * @returns {number} Number of active todos
   */
  get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  /**
   * Gets the count of completed todos.
   * 
   * @returns {number} Number of completed todos
   */
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }

  /**
   * Gets filtered todos based on current filter.
   * 
   * @returns {Array<Object>} Filtered todo array
   */
  get filteredTodos() {
    switch (this.filter) {
    case 'active':
      return this.todos.filter(t => !t.completed);
    case 'completed':
      return this.todos.filter(t => t.completed);
    default:
      return this.todos;
    }
  }

  /**
   * Sets the current filter and notifies listeners.
   * 
   * @param {string} filter - Filter type: 'all', 'active', or 'completed'
   */
  setFilter(filter) {
    if (filter === 'all' || filter === 'active' || filter === 'completed') {
      this.filter = filter;
      this.notify();
    }
  }

  /**
   * Persists current todos and nextId to storage.
   * 
   * @private
   */
  save() {
    this.storage.save('items', this.todos);
    this.storage.save('nextId', this.nextId);
  }
}
