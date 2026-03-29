---
layout: page.11ty.cjs
title: Portfolio Design System ⌲ Home
---

# Portfolio Design System

Welcome to the **Portfolio Design System**. This is a collection of high-performance, reusable web components built with [Lit](https://lit.dev) and [TypeScript](https://www.typescriptlang.org/). These components are designed to provide a consistent, premium, and interactive experience across your portfolio and web applications.

## ✨ Key Features

- **Modern & Premium**: Designed with a focus on aesthetics, including glassmorphism and smooth animations.
- **Accessible**: Built with accessibility in mind, following WAI-ARIA best practices.
- **Themeable**: Completely customizable via CSS Custom Properties (Design Tokens).
- **Lightweight**: Built with Lit for minimal bundle size and maximum performance.
- **Universal**: Works with any framework (React, Next.js, Vue, Svelte) or no framework at all.

## 🚀 Components

We offer a wide range of components for various use cases:

| Category | Components |
| :--- | :--- |
| **Actions** | [Button](./api/#ds-button), [Navbar](./api/#ds-navbar) |
| **Display** | [Avatar](./api/#ds-avatar), [Badge](./api/#ds-badge), [Banner](./api/#ds-banner), [Card](./api/#ds-card), [Tag](./api/#ds-tag) |
| **Feedback** | [Skeleton](./api/#ds-skeleton), [Tooltip](./api/#ds-tooltip) |
| **Overlay** | [Modal](./api/#ds-modal), [Sheet](./api/#ds-sheet) |
| **Forms** | [Input](./api/#ds-input) |

## 📦 Installation

Install the package via NPM:

```bash
npm install portfolio-design-system
```

## 🛠 Usage

### In HTML/Vanilla JS

Simply import the component side-effect in your main JS file:

```javascript
import 'portfolio-design-system';
```

Then use the custom elements in your HTML:

```html
<ds-navbar logoText="My Portfolio">
  <a href="#projects">Projects</a>
  <a href="#about">About</a>
</ds-navbar>

<ds-hero title="Web Developer & Designer">
  <p slot="description">Building digital experiences that matter.</p>
  <ds-button slot="actions">View Work</ds-button>
</ds-hero>
```

### In Frameworks (React/Next.js)

For the best experience in React and Next.js, we recommend creating a bridge using `@lit/react`. This enables full TypeScript support and standard React event handling.

**1. Create a bridge file (e.g., `components/lit-bridge.tsx`):**

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
```

**2. Use the component in your React tree:**

```tsx
import { DsButton } from "@/components/lit-bridge";

function App() {
  return <DsButton variant="primary">Hello World</DsButton>;
}
```

## 🎨 Design Tokens

The design system is powered by CSS variables. You can override these to match your brand style.

```css
:root {
  --ds-color-primary: #ff4500;
  --ds-font-family-sans: 'Inter', sans-serif;
  --ds-border-radius-base: 4px;
}
```

Check out the [API Reference](./api) for a full list of available properties, events, and CSS parts for each component.
