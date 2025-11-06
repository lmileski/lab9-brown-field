/**
 * TodoModel - Manages the todo list data and business logic
 * Implements the Observer pattern for reactive updates
 */
export class TodoModel {
  constructor(storageService) {
    this.storage = storageService;
    this.todos = this.storage.load('items', []);
    this.listeners = [];
    
    // Calculate nextId from existing todos to prevent ID conflicts
    const maxId = this.todos.length > 0 
      ? Math.max(...this.todos.map(t => t.id))
      : 0;
    this.nextId = Math.max(maxId + 1, this.storage.load('nextId', 1));
  }

  /**
   * Subscribe to model changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notify all subscribers of changes
   */
  notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Add a new todo
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
   * Toggle todo completion status
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
   * Delete a todo
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
    this.notify();
  }

  /**
   * Update todo text
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
   * Clear all completed todos
   */
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
    this.notify();
  }

  /**
   * Clear all todos
   */
  clearAll() {
    this.todos = [];
    this.save();
    this.notify();
  }

  /**
   * Get count of active todos
   */
  get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  /**
   * Get count of completed todos
   */
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }

  /**
   * Save todos to storage
   */
  save() {
    this.storage.save('items', this.todos);
    this.storage.save('nextId', this.nextId);
  }
}
