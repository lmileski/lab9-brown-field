import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display the app title and empty state', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('My Tasks');
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.empty-state')).toContainText('No todos yet');
  });

  test('should add a new todo', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const addButton = page.locator('button:has-text("Add")');

    await input.fill('Buy groceries');
    await addButton.click();

    await expect(page.locator('.todo-text')).toHaveText('Buy groceries');
    await expect(page.locator('.stat-value').first()).toHaveText('1'); // Total count
  });

  test('should not add empty todo', async ({ page }) => {
    const addButton = page.locator('button:has-text("Add")');

    // Button should be disabled when input is empty
    await expect(addButton).toBeDisabled();
  });

  test('should add multiple todos', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    const addButton = page.locator('button:has-text("Add")');

    await input.fill('Task 1');
    await addButton.click();

    await input.fill('Task 2');
    await addButton.click();

    await input.fill('Task 3');
    await addButton.click();

    const todos = page.locator('.todo-text');
    await expect(todos).toHaveCount(3);
    await expect(page.locator('.stat-value').first()).toHaveText('3'); // Total
  });

  test('should toggle todo completion', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Complete this task');
    await input.press('Enter');

    const checkbox = page.locator('.checkbox').first();
    const todoText = page.locator('.todo-text').first();

    // Initially not completed
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/completed/);

    // Toggle to completed
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(todoText).toHaveClass(/completed/);
    await expect(page.locator('.stat-value').nth(2)).toHaveText('1'); // Completed count

    // Toggle back to active
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveClass(/completed/);
    await expect(page.locator('.stat-value').nth(2)).toHaveText('0'); // Completed count
  });

  test('should update active and completed counts', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add 3 todos
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Check counts: 3 total, 3 active, 0 completed
    await expect(page.locator('.stat-value').nth(0)).toHaveText('3');
    await expect(page.locator('.stat-value').nth(1)).toHaveText('3');
    await expect(page.locator('.stat-value').nth(2)).toHaveText('0');

    // Complete 2 todos
    await page.locator('.checkbox').nth(0).click();
    await page.locator('.checkbox').nth(1).click();

    // Check counts: 3 total, 1 active, 2 completed
    await expect(page.locator('.stat-value').nth(0)).toHaveText('3');
    await expect(page.locator('.stat-value').nth(1)).toHaveText('1');
    await expect(page.locator('.stat-value').nth(2)).toHaveText('2');
  });

  test('should edit a todo', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Original text');
    await input.press('Enter');

    // Click edit button
    const editButton = page.locator('button:has-text("Edit")').first();
    await editButton.click();

    // Edit input should be visible
    const editInput = page.locator('.edit-input');
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue('Original text');

    // Update text
    await editInput.fill('Updated text');
    await page.locator('button:has-text("Save")').click();

    // Verify updated text
    await expect(page.locator('.todo-text')).toHaveText('Updated text');
  });

  test('should cancel editing', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Original text');
    await input.press('Enter');

    await page.locator('button:has-text("Edit")').click();
    const editInput = page.locator('.edit-input');
    await editInput.fill('Changed text');
    await page.locator('button:has-text("Cancel")').click();

    // Text should remain unchanged
    await expect(page.locator('.todo-text')).toHaveText('Original text');
  });

  test('should save edit with Enter key', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Original text');
    await input.press('Enter');

    await page.locator('button:has-text("Edit")').click();
    const editInput = page.locator('.edit-input');
    await editInput.fill('Keyboard saved');
    await editInput.press('Enter');

    await expect(page.locator('.todo-text')).toHaveText('Keyboard saved');
  });

  test('should cancel edit with Escape key', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Original text');
    await input.press('Enter');

    await page.locator('button:has-text("Edit")').click();
    const editInput = page.locator('.edit-input');
    await editInput.fill('Changed');
    await editInput.press('Escape');

    await expect(page.locator('.todo-text')).toHaveText('Original text');
  });

  test('should delete a todo', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Task to delete');
    await input.press('Enter');

    // Listen for dialog
    page.on('dialog', dialog => dialog.accept());

    await page.locator('button:has-text("Delete")').click();

    // Todo should be removed
    await expect(page.locator('.todo-text')).toHaveCount(0);
    await expect(page.locator('.empty-state')).toBeVisible();
  });

  test('should clear completed todos', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add 3 todos
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');
    await input.fill('Task 3');
    await input.press('Enter');

    // Complete 2 todos
    await page.locator('.checkbox').nth(0).click();
    await page.locator('.checkbox').nth(2).click();

    // Accept confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Clear completed
    await page.locator('button:has-text("Clear Completed")').click();

    // Only 1 todo should remain
    await expect(page.locator('.todo-text')).toHaveCount(1);
    await expect(page.locator('.todo-text')).toHaveText('Task 2');
  });

  test('should clear all todos', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Add todos
    await input.fill('Task 1');
    await input.press('Enter');
    await input.fill('Task 2');
    await input.press('Enter');

    // Accept confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // Clear all
    await page.locator('button:has-text("Clear All")').click();

    // All todos should be removed
    await expect(page.locator('.empty-state')).toBeVisible();
    await expect(page.locator('.stat-value').first()).toHaveText('0');
  });

  test('should persist todos in localStorage', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Persistent todo');
    await input.press('Enter');

    // Reload page
    await page.reload();

    // Todo should still be there
    await expect(page.locator('.todo-text')).toHaveText('Persistent todo');
  });

  test('should persist completion status', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Task to complete');
    await input.press('Enter');

    await page.locator('.checkbox').click();

    // Reload page
    await page.reload();

    // Completion should persist
    await expect(page.locator('.checkbox')).toBeChecked();
    await expect(page.locator('.todo-text')).toHaveClass(/completed/);
  });

  test('should disable Clear Completed when no completed todos', async ({ page }) => {
    const input = page.locator('input[type="text"]');
    await input.fill('Active task');
    await input.press('Enter');

    const clearCompletedBtn = page.locator('button:has-text("Clear Completed")');
    await expect(clearCompletedBtn).toBeDisabled();
  });

  test('should disable Clear All when no todos', async ({ page }) => {
    const clearAllBtn = page.locator('button:has-text("Clear All")');
    await expect(clearAllBtn).toBeDisabled();
  });

  test('should handle rapid todo additions', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    // Rapidly add todos
    for (let i = 1; i <= 10; i++) {
      await input.fill(`Task ${i}`);
      await input.press('Enter');
    }

    await expect(page.locator('.todo-text')).toHaveCount(10);
    await expect(page.locator('.stat-value').first()).toHaveText('10');
  });

  test('should maintain correct order of todos', async ({ page }) => {
    const input = page.locator('input[type="text"]');

    await input.fill('First');
    await input.press('Enter');
    await input.fill('Second');
    await input.press('Enter');
    await input.fill('Third');
    await input.press('Enter');

    const todos = page.locator('.todo-text');
    await expect(todos.nth(0)).toHaveText('First');
    await expect(todos.nth(1)).toHaveText('Second');
    await expect(todos.nth(2)).toHaveText('Third');
  });
});
