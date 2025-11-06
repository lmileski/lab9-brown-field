/**
 * StorageService - Handles localStorage operations for the TODO app
 */
export class StorageService {
  constructor(storageKey = 'todos') {
    this.storageKey = storageKey;
  }

  /**
   * Save data to localStorage
   */
  save(key, data) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  load(key, defaultValue = null) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clear all data for this app
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKey)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
