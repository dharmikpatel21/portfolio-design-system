# Portfolio Design System

A modern, multi-component design system built with [Lit](https://lit.dev) and TypeScript.

## Project Structure

```text
portfolio-design-system/
│
├── src/
│   ├── components/      # Individual web components
│   │   ├── button/
│   │   ├── card/
│   │   └── ...
│   ├── tokens/          # Centralized Design Tokens (CSS Variables)
│   │   ├── colors.css
│   │   ├── typography.css
│   │   └── spacing.css
│   └── index.ts         # Main entry point (exports all components)
│
├── dev/
│   └── index.html       # Local development & demo page
│
├── docs-src/            # Documentation site source (Eleventy)
└── package.json
```

## Setup

Install dependencies:

```bash
npm i
```

## Development

Build the project:

```bash
npm run build
```

Watch for changes:

```bash
npm run build:watch
```

Run dev server:

```bash
npm run serve
```
Preview the components at [http://localhost:8000/dev/index.html](http://localhost:8000/dev/index.html).

## Testing

Run tests:

```bash
npm test
```

## Adding a Component

1. Create a new directory in `src/components/[name]`.
2. Implement your component using Lit and design tokens.
3. Export your component in `src/index.ts`.
4. Add a demo section in `dev/index.html`.

## Documentation

The documentation site is built with Eleventy and lives in `docs-src/`. To build the documentation:

```bash
npm run docs
```
