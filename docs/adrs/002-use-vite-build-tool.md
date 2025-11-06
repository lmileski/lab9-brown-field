# ADR 002: Use Vite for Build Tool

## Status
Accepted

## Context
We needed a modern build tool for development and production builds that works well with ES modules and Lit web components.

## Decision
We will use Vite 5.4.21 as our build tool and development server.

## Rationale
- **Fast dev server**: Native ESM in development, no bundling required
- **Instant HMR**: Hot module replacement updates in milliseconds
- **Optimized builds**: Rollup-based production builds with code splitting
- **Zero config**: Works with Lit out of the box, minimal configuration
- **Modern defaults**: ES modules, tree-shaking, minification included
- **Great DX**: Clear error messages, fast startup (280ms)

## Consequences

### Positive
- Development server starts in <300ms vs several seconds with Webpack
- HMR updates components instantly during development
- Production builds optimized: 37KB JS gzipped to 11.37KB
- Simple configuration (13 lines in `vite.config.js`)
- Compatible with modern browsers (ES2015+)
- Easy integration with testing tools (Playwright, Node test runner)

### Negative
- Requires modern browser for development (no IE11 support)
- Different behavior between dev (ESM) and prod (bundled)
- Smaller ecosystem than Webpack (fewer plugins)

## Configuration
```javascript
{
  root: 'src',
  build: { outDir: '../dist', emptyOutDir: true },
  server: { port: 8080, open: true }
}
```

## Alternatives Considered
- **Webpack**: More mature but slower, complex configuration
- **Parcel**: Zero config but less control, slower HMR
- **esbuild**: Faster builds but less mature ecosystem
- **Rollup**: Great for libraries but missing dev server features
