# Portfolio Design System

A modern, high-performance, and premium-themed design system built with [Lit](https://lit.dev) and [TypeScript](https://www.typescriptlang.org/). These components are designed to provide a consistent and interactive experience for high-end portfolio websites and applications.

[![NPM Version](https://img.shields.io/npm/v/portfolio-design-system.svg)](https://www.npmjs.com/package/portfolio-design-system)
[![License](https://img.shields.io/npm/l/portfolio-design-system.svg)](https://github.com/dharmikpatel/portfolio-design-system/blob/main/LICENSE)

## ✨ Features

- **Built with Lit**: Lightning-fast, standards-based web components with minimal overhead.
- **TypeScript First**: Fully typed for a developer-friendly experience.
- **Glassmorphism & Modern Styling**: Pre-styled for a premium, high-end feel.
- **Accessible**: Built with WAI-ARIA and accessibility best practices in mind.
- **Design Tokens**: Fully themeable using CSS Custom Properties.

## 🚀 Getting Started

### Installation

Install the package via NPM:

```bash
npm install portfolio-design-system
```

### Usage

#### In Vanilla JS / HTML

Import the library in your main entry file:

```javascript
import 'portfolio-design-system';
```

Then use the custom elements in your HTML:

```html
<ds-navbar logoText="Artistic Dev">
  <a href="#projects">Work</a>
  <a href="#contact">Contact</a>
</ds-navbar>

<ds-hero title="Digital Craftsman">
  <p slot="description">Building aesthetic and functional digital experiences.</p>
  <ds-button slot="actions">See Projects</ds-button>
</ds-hero>
```

#### In Frameworks (React, Next.js, Vue)

While modern frameworks support Web Components, we recommend using `@lit/react` for the best developer experience in React/Next.js (auto-complete, event handling).

**1. Install the bridge library:**
```bash
npm install @lit/react
```

**2. Create a Bridge Component (e.g., `components/lit-bridge.tsx`):**
```tsx
"use client";
import React from "react";
import { createComponent } from "@lit/react";
import { DsButton as DsButtonLit, DsModal as DsModalLit } from "portfolio-design-system";

export const DsButton = createComponent({
  tagName: "ds-button",
  elementClass: DsButtonLit,
  react: React,
  events: { onClick: "click" }
});

export const DsModal = createComponent({
  tagName: "ds-modal",
  elementClass: DsModalLit,
  react: React,
  events: { onClose: "close" }
});
```

**3. Use in your Application:**
```jsx
"use client";
import { DsButton } from "@/components/lit-bridge";

export default function Page() {
  return <DsButton variant="primary">Click Me</DsButton>;
}
```

## 🎨 Theme & Customization

The design system is powered by **Design Tokens** (CSS variables). You can import these directly into your global CSS file.

### Import Icons & Tokens (Recommended)

In your `globals.css` or main entry file:

```css
/* 1. Import Material Symbols (required for icons) */
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined";

/* 2. Import Design System Tokens */
@import "portfolio-design-system/tokens/colors.css";
@import "portfolio-design-system/tokens/typography.css";
@import "portfolio-design-system/tokens/spacing.css";
```

### Tailwind CSS Integration (v4+)

If you are using Tailwind CSS, you can map the design system variables to your theme:

```css
@theme inline {
  --color-primary: var(--ds-color-primary);
  --color-surface-soft: var(--ds-bg-surface);
  --font-sans: var(--ds-font-family-sans);
}
```

## 📖 Documentation & API

The full API documentation, including all properties, events, and CSS parts for each component, is available at: [https://dharmikpatel.github.io/portfolio-design-system](https://dharmikpatel.github.io/portfolio-design-system)

## 🛠 Development

### Setup
```bash
npm install
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Run Documentation Locally
```bash
npm run docs
npm run docs:serve
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
