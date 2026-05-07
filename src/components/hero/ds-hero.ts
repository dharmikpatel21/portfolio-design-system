import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsHero component
 * Part of the Portfolio Design System
 */
@customElement('ds-hero')
export class DsHero extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-12, 48px);
    }

    .hero {
      background-color: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.05));
      border-radius: 24px;
      padding: var(--ds-spacing-12, 48px);
      text-align: center;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }

    .badge-container {
      margin-bottom: var(--ds-spacing-6, 24px);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    h1 {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.05em;
      color: var(--ds-text-main, #0f172a);
      margin: 0 0 var(--ds-spacing-4, 16px) 0;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    p {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-lg, 18px);
      color: var(--ds-text-muted, #64748b);
      margin: 0 auto var(--ds-spacing-8, 32px) auto;
      max-width: 500px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-spacing-4, 16px);
      flex-wrap: wrap;
    }
  `;

  @property()
  override title = '';

  @property()
  description = '';

  @property()
  badgeText = '';

  override render() {
    return html`
      <div class="hero" part="hero">
        ${this.badgeText ? html`
          <div class="badge-container">
            <ds-badge variant="primary" label="${this.badgeText}"></ds-badge>
          </div>
        ` : ''}
        
        <h1>${this.title}<slot name="title"></slot></h1>
        <p>${this.description}<slot name="description"></slot></p>
        
        <div class="actions">
          <slot name="actions"></slot>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-hero': DsHero;
  }
}

registerMCPTool({
  name: 'ds_hero',
  title: 'DS Hero',
  description: 'Full-width hero/banner section with optional badge label, large title, description text, and an actions slot for CTA buttons. Centers all content. Tag: <ds-hero>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-hero',
    properties: [
      {name: 'title', type: 'string', description: 'Main heading (h1). Can also use "title" named slot.'},
      {name: 'description', type: 'string', description: 'Subheading paragraph. Can also use "description" named slot.'},
      {name: 'badgeText', type: 'string', description: 'If set, renders a ds-badge above the title.'},
    ],
    slots: [
      {name: 'title', description: 'Appended inside the h1.'},
      {name: 'description', description: 'Appended inside the description paragraph.'},
      {name: 'actions', description: 'CTA buttons or links rendered in a centered flex row.'},
      {name: '(default)', description: 'Additional content below the actions row.'},
    ],
    cssParts: ['hero'],
    example: '<ds-hero title="Hello World" description="Welcome to the design system." badge-text="v2.0"><ds-button slot="actions" label="Get started"></ds-button></ds-hero>',
  }),
});

registerMCPTool({
  name: 'ds_hero_read',
  title: 'Read DS Hero',
  description: 'List all ds-hero elements on the page with their title, description, and badgeText.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const heros = Array.from(document.querySelectorAll('ds-hero'));
    return heros.map((h, i) => ({
      index: i,
      selector: h.id ? `#${h.id}` : `ds-hero:nth-of-type(${i + 1})`,
      title: h.getAttribute('title') ?? '',
      description: h.getAttribute('description') ?? '',
      badgeText: h.getAttribute('badgeText') ?? h.getAttribute('badge-text') ?? '',
    }));
  },
});

registerMCPTool({
  name: 'ds_hero_update',
  title: 'Update DS Hero',
  description: 'Update the title, description, or badgeText of a ds-hero element on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-hero. Defaults to the first one found.'},
      title: {type: 'string', description: 'New hero heading text.'},
      description: {type: 'string', description: 'New hero subheading text.'},
      badgeText: {type: 'string', description: 'New badge label above the title. Empty string removes it.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try { target = document.querySelector(input['selector']); } catch { /* invalid */ }
    }
    if (!target) target = document.querySelector('ds-hero');
    if (!target) return {success: false, error: 'No ds-hero found on the page.'};

    if (typeof input['title'] === 'string') (target as any).title = input['title'];
    if (typeof input['description'] === 'string') (target as any).description = input['description'];
    if (typeof input['badgeText'] === 'string') (target as any).badgeText = input['badgeText'];
    return {success: true};
  },
});
