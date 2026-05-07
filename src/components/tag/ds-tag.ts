import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

export type TagVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * DsTag component
 * Part of the Portfolio Design System
 */
@customElement('ds-tag')
export class DsTag extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 6px; /* rounded-md-ish */
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: -0.01em;
      transition: all 0.2s ease-in-out;
      border: 1px solid transparent;
    }

    /* Primary Variant (Subtle with border) */
    .tag.primary {
      background-color: var(--ds-tag-primary-bg, rgba(19, 91, 236, 0.05));
      color: var(--ds-tag-primary-text, #135bec);
      border-color: var(--ds-tag-primary-border, rgba(19, 91, 236, 0.2));
    }

    /* Neutral Variant (The one used for tech stack) */
    .tag.neutral {
      background-color: var(--ds-tag-neutral-bg, #f1f5f9);
      color: var(--ds-tag-neutral-text, #475569);
      border-color: var(--ds-tag-neutral-border, transparent);
    }

    /* Variants below are inherited but can be customized if needed */
    .tag.success {
      background-color: var(--ds-badge-success-bg, rgba(34, 197, 94, 0.1));
      color: var(--ds-badge-success-text, #16a34a);
    }

    .tag.warning {
      background-color: var(--ds-badge-warning-bg, rgba(245, 158, 11, 0.1));
      color: var(--ds-badge-warning-text, #d97706);
    }

    .tag.danger {
      background-color: var(--ds-badge-danger-bg, rgba(239, 68, 68, 0.1));
      color: var(--ds-badge-danger-text, #dc2626);
    }
  `;

  @property()
  label = '';

  @property({reflect: true})
  variant: TagVariant = 'primary';

  override render() {
    return html`
      <div class="tag ${this.variant}" part="tag">
        ${this.label}<slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tag': DsTag;
  }
}

registerMCPTool({
  name: 'ds_tag',
  title: 'DS Tag',
  description: 'Small rounded-corner category or status label. Unlike ds-badge (pill), tags use a rounded-md shape. Variants: primary, neutral, success, warning, danger. Tag: <ds-tag>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-tag',
    properties: [
      {name: 'label', type: 'string', description: 'Text inside the tag. Can also use default slot.'},
      {name: 'variant', type: "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", default: 'primary', reflected: true},
    ],
    slots: [{name: '(default)', description: 'Alternative to the label property.'}],
    cssParts: ['tag'],
    note: 'Use ds-tag for taxonomy labels (tech stack, categories). Use ds-badge for status/count indicators.',
    examples: [
      '<ds-tag label="TypeScript" variant="neutral"></ds-tag>',
      '<ds-tag label="Active" variant="success"></ds-tag>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_tag_read',
  title: 'Read DS Tags',
  description: 'List all ds-tag elements on the page with their label, variant, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const tags = Array.from(document.querySelectorAll('ds-tag'));
    return tags.map((t, i) => ({
      index: i,
      selector: t.id ? `#${t.id}` : `ds-tag:nth-of-type(${i + 1})`,
      label: t.getAttribute('label') ?? t.textContent?.trim() ?? '',
      variant: t.getAttribute('variant') ?? 'primary',
    }));
  },
});

registerMCPTool({
  name: 'ds_tag_update',
  title: 'Update DS Tag',
  description: 'Update the label or variant of a ds-tag element on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-tag. Defaults to the first one found.'},
      label: {type: 'string', description: 'New tag label text.'},
      variant: {type: 'string', enum: ['primary', 'neutral', 'success', 'warning', 'danger'], description: 'New variant.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try { target = document.querySelector(input['selector']); } catch { /* invalid */ }
    }
    if (!target) target = document.querySelector('ds-tag');
    if (!target) return {success: false, error: 'No ds-tag found on the page.'};

    if (typeof input['label'] === 'string') (target as any).label = input['label'];
    if (typeof input['variant'] === 'string') (target as any).variant = input['variant'];
    return {success: true};
  },
});
