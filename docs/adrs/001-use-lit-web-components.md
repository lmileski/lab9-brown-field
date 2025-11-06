# ADR 001: Use Lit for Web Components

## Status
Accepted

## Context
We needed a modern framework for building the Todo application with reusable, maintainable components. The original codebase had tightly coupled logic and presentation.

## Decision
We will use Lit 3.1.0 as our web component framework.

## Rationale
- **Standards-based**: Uses native Web Components APIs (Custom Elements, Shadow DOM, Templates)
- **Lightweight**: Only 5KB minified, minimal runtime overhead
- **Modern DX**: Reactive properties, declarative templates, TypeScript support
- **Framework-agnostic**: Web components work anywhere, no vendor lock-in
- **Performance**: Efficient updates via reactive property system
- **Native shadow DOM**: True encapsulation for styles and markup

## Consequences

### Positive
- Clean component architecture with `todo-app`, `todo-form`, `todo-item`, `todo-list`, `todo-filter`
- Reactive properties automatically trigger re-renders on state changes
- Shadow DOM prevents CSS conflicts and enables component-level styling
- Small bundle size (37KB total including all components)
- Easy to test and maintain individual components

### Negative
- Shadow DOM complicates global styling (requires CSS variables)
- Learning curve for developers unfamiliar with Web Components
- Limited ecosystem compared to React/Vue (fewer third-party components)

## Alternatives Considered
- **React**: More ecosystem support but larger bundle size, JSX overhead, virtual DOM complexity
- **Vue**: Good DX but framework lock-in, larger runtime
- **Vanilla JS**: No dependencies but loses reactive benefits, more boilerplate
