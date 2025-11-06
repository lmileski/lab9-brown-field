# Lab 9: Todo App - Brownfield Cleanup

A modern, feature-rich todo application built with Lit web components, showcasing clean architecture, comprehensive testing, and production-ready deployment.

[![lab9-brown-field](https://img.shields.io/badge/deploy-netlify-00C7B7)](https://lab9-brown-field.netlify.app/)

## Features

### Core Functionality
- Add todos with text validation (max 500 characters)
- Mark complete/incomplete with visual feedback
- Edit todos inline with save/cancel actions
- Delete todos individually
- Bulk actions: Clear completed, Clear all
- Persistent storage using localStorage

### Creative Enhancements
- Dark mode toggle with theme persistence
- Filter tabs - All/Active/Completed views
- Live counters for active and completed todos
- Keyboard shortcuts - Enter to save, Escape to cancel
- Auto-save on every change

## Live Demo

**[View Live Application](https://your-app-url.netlify.app)**

## Architecture

This project demonstrates clean separation of concerns using modern web standards. The application uses Lit 3.1.0 for building lightweight web components, Vite 5.4.21 for fast development and optimized production builds, localStorage for client-side data persistence, the Observer pattern for reactive state management, and CSS variables to enable dynamic theming.

Check out the [Architecture Decision Records](docs/adrs/) to understand the reasoning behind these choices.

### Component Structure
```
todo-app (root)
├── todo-form (input)
├── todo-filter (tabs)
└── todo-list
    └── todo-item (repeating)
```

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Lit 3.1.0 |
| Build Tool | Vite 5.4.21 |
| Testing | Playwright, Node.js test runner |
| Linting | ESLint 8.55.0 |
| CI/CD | GitHub Actions |
| Deployment | Netlify |

## Getting Started

### Prerequisites
- Node.js 18 or higher (I'm using version 20)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lmileski/lab9-brown-field.git
cd lab9-brown-field

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:8080`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (37 tests) |
| `npm run test:e2e` | Run E2E tests (19 tests) |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |

## Testing

### Unit Tests (37 tests)
The project includes comprehensive unit tests for the core business logic:
- TodoModel has 22 tests covering all CRUD operations, validation, the observer pattern, and persistence
- StorageService has 17 tests with a mock localStorage implementation, testing error handling and various data types

```bash
npm test
```

### E2E Tests (19 tests)
I used Playwright to test the entire application from a user's perspective. The tests cover adding, editing, and deleting todos, toggling completion states, the filter functionality, bulk actions, dark mode switching, and data persistence across page reloads.

```bash
npm run test:e2e      # Headless
npm run test:e2e:ui   # Interactive UI
```

### Test Coverage
The test suite covers all core functionality, edge cases, error handling, and UI interactions. Everything is verified to work correctly.

## Deployment

### Netlify (Automatic)
The app automatically deploys to Netlify whenever I push to the main branch, thanks to the GitHub Actions workflow.

**Build Settings:**
```toml
[build]
  base = "."
  command = "npm ci && npm run build"
  publish = "dist"
```

### Manual Deploy
```bash
npm run build
# Upload dist/ folder to any static host
```

## Documentation

The docs/adrs directory contains detailed Architecture Decision Records explaining the key technology choices:

- **ADR 001** - Why Lit for Web Components
- **ADR 002** - Why Vite for Build Tool
- **ADR 003** - Why localStorage
- **ADR 004** - Why Observer Pattern
- **ADR 005** - Why CSS Variables

## Lab Requirements Met

### 20pt Tier (Bare Minimum)
- Fixed bugs and cleaned up the code
- Used proper variable names and formatting
- Everything works as expected

### 40pt Tier (Quality Work)
- Added comprehensive JSDocs to all files
- Wrote 37 unit tests with 100% pass rate
- Created 19 E2E tests covering all user workflows
- Refactored code following best practices

### 60pt Tier (Going Above & Beyond)
- Implemented 2 creative features (dark mode and filter tabs)
- Set up GitHub Actions CI/CD pipeline
- Wrote 5 Architecture Decision Records
- Deployed to production on Netlify
- Created this comprehensive README

## Bug Fixes

Here are the issues I fixed during the cleanup:
1. Fixed todo persistence on page reload
2. Fixed edit mode not canceling properly
3. Fixed completed count not updating
4. Added input validation (max 500 chars)
5. Fixed duplicate IDs causing state issues
6. Improved error handling in storage
7. Fixed CSS specificity conflicts

## License

MIT

## Author

Luke Mileski
- GitHub: [@lmileski](https://github.com/lmileski)
- Course: Software Design Fall 2025

---

Built with Lit and Vite
