import { test } from 'node:test';
import assert from 'node:assert';
import { StorageService } from '../src/services/storage-service.js';

/**
 * Mock localStorage for testing
 */
class MockLocalStorage {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value;
  }

  removeItem(key) {
    delete this.store[key];
  }

  key(index) {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }

  get length() {
    return Object.keys(this.store).length;
  }

  clear() {
    this.store = {};
  }
}

// Replace global localStorage with mock
global.localStorage = new MockLocalStorage();

test('StorageService - should save data to localStorage', () => {
  const service = new StorageService('test');
  
  service.save('key1', { value: 'data' });
  
  const stored = JSON.parse(localStorage.getItem('test_key1'));
  assert.deepStrictEqual(stored, { value: 'data' });
});

test('StorageService - should load data from localStorage', () => {
  const service = new StorageService('test');
  
  localStorage.setItem('test_key2', JSON.stringify({ value: 'data' }));
  
  const loaded = service.load('key2');
  assert.deepStrictEqual(loaded, { value: 'data' });
});

test('StorageService - should return default value when key does not exist', () => {
  const service = new StorageService('test');
  
  const loaded = service.load('nonexistent', 'default');
  assert.strictEqual(loaded, 'default');
});

test('StorageService - should return null when no default value provided', () => {
  const service = new StorageService('test');
  
  const loaded = service.load('nonexistent');
  assert.strictEqual(loaded, null);
});

test('StorageService - should handle arrays', () => {
  const service = new StorageService('test');
  const data = [1, 2, 3, 4, 5];
  
  service.save('array', data);
  const loaded = service.load('array');
  
  assert.deepStrictEqual(loaded, data);
});

test('StorageService - should handle complex objects', () => {
  const service = new StorageService('test');
  const data = {
    id: 1,
    name: 'Test',
    nested: {
      value: 'nested data'
    },
    array: [1, 2, 3]
  };
  
  service.save('complex', data);
  const loaded = service.load('complex');
  
  assert.deepStrictEqual(loaded, data);
});

test('StorageService - should remove data from localStorage', () => {
  const service = new StorageService('test');
  
  service.save('key3', 'data');
  assert.notStrictEqual(localStorage.getItem('test_key3'), null);
  
  service.remove('key3');
  assert.strictEqual(localStorage.getItem('test_key3'), null);
});

test('StorageService - should clear all data with storageKey prefix', () => {
  const service = new StorageService('test');
  
  service.save('key1', 'data1');
  service.save('key2', 'data2');
  localStorage.setItem('other_key', 'other data');
  
  service.clear();
  
  assert.strictEqual(localStorage.getItem('test_key1'), null);
  assert.strictEqual(localStorage.getItem('test_key2'), null);
  assert.strictEqual(localStorage.getItem('other_key'), 'other data');
});

test('StorageService - should handle save errors gracefully', () => {
  const service = new StorageService('test');
  
  // Mock setItem to throw error
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = () => {
    throw new Error('Storage full');
  };
  
  // Should not throw
  assert.doesNotThrow(() => {
    service.save('key', 'data');
  });
  
  localStorage.setItem = originalSetItem;
});

test('StorageService - should handle load errors gracefully', () => {
  const service = new StorageService('test');
  
  // Store invalid JSON
  localStorage.setItem('test_invalid', 'not valid json{');
  
  // Should return default value on parse error
  const loaded = service.load('invalid', 'default');
  assert.strictEqual(loaded, 'default');
});

test('StorageService - should use custom storageKey prefix', () => {
  const service = new StorageService('custom');
  
  service.save('key', 'data');
  
  assert.notStrictEqual(localStorage.getItem('custom_key'), null);
  assert.strictEqual(localStorage.getItem('test_key'), null);
});

test('StorageService - should handle empty strings', () => {
  const service = new StorageService('test');
  
  service.save('empty', '');
  const loaded = service.load('empty');
  
  assert.strictEqual(loaded, '');
});

test('StorageService - should handle null values', () => {
  const service = new StorageService('test');
  
  service.save('null', null);
  const loaded = service.load('null');
  
  assert.strictEqual(loaded, null);
});

test('StorageService - should handle boolean values', () => {
  const service = new StorageService('test');
  
  service.save('bool', true);
  const loaded = service.load('bool');
  
  assert.strictEqual(loaded, true);
});

test('StorageService - should handle number values', () => {
  const service = new StorageService('test');
  
  service.save('number', 42);
  const loaded = service.load('number');
  
  assert.strictEqual(loaded, 42);
});
