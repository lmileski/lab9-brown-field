import { test } from 'node:test';
import assert from 'node:assert';
import { TodoModel } from '../src/models/todo-model.js';

/**
 * Mock storage service for testing
 */
class MockStorage {
  constructor() {
    this.data = {};
  }

  save(key, value) {
    this.data[key] = value;
  }

  load(key, defaultValue) {
    return this.data[key] !== undefined ? this.data[key] : defaultValue;
  }

  remove(key) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}

test('TodoModel - addTodo should add a new todo', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');

  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Test todo');
  assert.strictEqual(model.todos[0].completed, false);
});

test('TodoModel - should not add empty todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('');
  model.addTodo('   ');

  assert.strictEqual(model.todos.length, 0);
});

test('TodoModel - should not add todos exceeding 500 characters', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  const longText = 'a'.repeat(501);
  model.addTodo(longText);

  assert.strictEqual(model.todos.length, 0);
});

test('TodoModel - should trim todo text', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('  Test todo  ');

  assert.strictEqual(model.todos[0].text, 'Test todo');
});

test('TodoModel - toggleComplete should toggle completion status', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');
  const todoId = model.todos[0].id;

  assert.strictEqual(model.todos[0].completed, false);

  model.toggleComplete(todoId);
  assert.strictEqual(model.todos[0].completed, true);

  model.toggleComplete(todoId);
  assert.strictEqual(model.todos[0].completed, false);
});

test('TodoModel - toggleComplete should handle invalid ID', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');
  const initialLength = model.todos.length;

  model.toggleComplete(999);

  assert.strictEqual(model.todos.length, initialLength);
});

test('TodoModel - deleteTodo should remove a todo', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  const todoId = model.todos[0].id;

  model.deleteTodo(todoId);

  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Todo 2');
});

test('TodoModel - deleteTodo should handle invalid ID', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');
  const initialLength = model.todos.length;

  model.deleteTodo(999);

  assert.strictEqual(model.todos.length, initialLength);
});

test('TodoModel - updateTodo should update todo text', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Original text');
  const todoId = model.todos[0].id;

  model.updateTodo(todoId, 'Updated text');

  assert.strictEqual(model.todos[0].text, 'Updated text');
});

test('TodoModel - updateTodo should trim new text', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Original text');
  const todoId = model.todos[0].id;

  model.updateTodo(todoId, '  Updated text  ');

  assert.strictEqual(model.todos[0].text, 'Updated text');
});

test('TodoModel - updateTodo should not update with empty text', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Original text');
  const todoId = model.todos[0].id;

  model.updateTodo(todoId, '');
  assert.strictEqual(model.todos[0].text, 'Original text');

  model.updateTodo(todoId, '   ');
  assert.strictEqual(model.todos[0].text, 'Original text');
});

test('TodoModel - updateTodo should not update with text exceeding 500 characters', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Original text');
  const todoId = model.todos[0].id;

  const longText = 'a'.repeat(501);
  model.updateTodo(todoId, longText);

  assert.strictEqual(model.todos[0].text, 'Original text');
});

test('TodoModel - updateTodo should handle invalid ID', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');

  model.updateTodo(999, 'New text');

  assert.strictEqual(model.todos[0].text, 'Test todo');
});

test('TodoModel - clearCompleted should remove completed todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.addTodo('Todo 3');

  model.toggleComplete(model.todos[0].id);
  model.toggleComplete(model.todos[2].id);

  model.clearCompleted();

  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Todo 2');
});

test('TodoModel - clearCompleted should not affect active todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');

  model.clearCompleted();

  assert.strictEqual(model.todos.length, 2);
});

test('TodoModel - clearAll should remove all todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.addTodo('Todo 3');

  model.clearAll();

  assert.strictEqual(model.todos.length, 0);
});

test('TodoModel - activeCount should return count of incomplete todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.addTodo('Todo 3');

  assert.strictEqual(model.activeCount, 3);

  model.toggleComplete(model.todos[0].id);

  assert.strictEqual(model.activeCount, 2);
});

test('TodoModel - completedCount should return count of completed todos', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.addTodo('Todo 3');

  assert.strictEqual(model.completedCount, 0);

  model.toggleComplete(model.todos[0].id);
  model.toggleComplete(model.todos[1].id);

  assert.strictEqual(model.completedCount, 2);
});

test('TodoModel - should notify subscribers on changes', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  let notificationCount = 0;
  model.subscribe(() => {
    notificationCount++;
  });

  model.addTodo('Test todo');
  assert.strictEqual(notificationCount, 1);

  model.toggleComplete(model.todos[0].id);
  assert.strictEqual(notificationCount, 2);

  model.deleteTodo(model.todos[0].id);
  assert.strictEqual(notificationCount, 3);
});

test('TodoModel - should persist todos to storage', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);

  model.addTodo('Test todo');

  assert.strictEqual(storage.data.items.length, 1);
  assert.strictEqual(storage.data.items[0].text, 'Test todo');
});

test('TodoModel - should load todos from storage', () => {
  const storage = new MockStorage();
  storage.data.items = [
    { id: 1, text: 'Existing todo', completed: false, createdAt: new Date().toISOString() }
  ];
  storage.data.nextId = 2;

  const model = new TodoModel(storage);

  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Existing todo');
});

test('TodoModel - should calculate nextId from existing todos', () => {
  const storage = new MockStorage();
  storage.data.items = [
    { id: 5, text: 'Todo 1', completed: false, createdAt: new Date().toISOString() },
    { id: 3, text: 'Todo 2', completed: false, createdAt: new Date().toISOString() }
  ];

  const model = new TodoModel(storage);
  model.addTodo('New todo');

  assert.strictEqual(model.todos[model.todos.length - 1].id, 6);
});

