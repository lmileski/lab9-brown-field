/**
 * StorageService - Handles localStorage operations for the TODO app.
 * Provides a simple CRUD interface with automatic error handling.
 * 
 * @class
 */
export class StorageService {
  /**
   * Creates a StorageService instance.
   * 
   * @param {string} [storageKey='todos'] - Namespace prefix for localStorage keys
   */
  constructor(storageKey = 'todos') {
    /**
     * @type {string}
     * @private
     */
    this.storageKey = storageKey;
  }

  /**
   * Saves data to localStorage with JSON serialization.
   * 
   * @param {string} key - The key to save under (will be prefixed with storageKey)
   * @param {*} data - The data to save (will be JSON stringified)
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
   * Loads data from localStorage with JSON parsing.
   * 
   * @param {string} key - The key to load (will be prefixed with storageKey)
   * @param {*} [defaultValue=null] - Value to return if key doesn't exist or parsing fails
   * @returns {*} The parsed data or defaultValue
   */
  load(key, defaultValue = null) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      const item = localStorage.getItem(fullKey);
      if (!item) {
        return defaultValue;
      }
      
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      // Return default value on parse error
      return defaultValue;
    }
  }

  /**
   * Removes a specific key from localStorage.
   * 
   * @param {string} key - The key to remove (will be prefixed with storageKey)
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
   * Clears all data for this app from localStorage.
   * Only removes keys that start with the storageKey prefix.
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
