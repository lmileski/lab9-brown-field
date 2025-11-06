# ADR 004: Use Observer Pattern for State Management

## Status
Accepted

## Context
We needed a way for the UI components to reactively update when the underlying todo data changes, without tightly coupling the model to the view.

## Decision
We will implement the Observer pattern in `TodoModel` to notify subscribers of state changes.

## Rationale
- **Decoupling**: TodoModel doesn't need to know about UI components
- **Reactive updates**: Components automatically re-render on data changes
- **Simple implementation**: Just 3 methods (subscribe, unsubscribe, notify)
- **Testable**: Easy to verify notifications are sent (5 tests)
- **Scalable**: Multiple components can observe same model
- **Standard pattern**: Well-known design pattern, easy to understand

## Implementation
```javascript
class TodoModel {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // All mutation methods call notifyListeners()
  addTodo(text) {
    // ... add logic
    this.notifyListeners();
  }
}
```

Usage in TodoApp:
```javascript
connectedCallback() {
  this.unsubscribe = this.todoModel.subscribe(() => {
    this.requestUpdate(); // Lit re-render
  });
}
```

## Consequences

### Positive
- Clean separation of concerns (model, view, storage)
- TodoApp automatically updates when todos change
- Easy to add new observers (e.g., analytics, logging)
- Prevents stale UI state
- Follows single responsibility principle

### Negative
- Slight memory overhead (Set of listeners)
- Need to remember to unsubscribe on component disconnect
- All listeners notified on any change (not granular)

## Alternatives Considered
- **Direct component refs**: Would tightly couple model to view
- **Event emitters**: More complex API, similar outcome
- **State management library** (Redux, MobX): Overkill for simple app
- **Lit reactive properties only**: Would require passing state down through all components
