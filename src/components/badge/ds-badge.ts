import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsBadge component
 * Part of the Portfolio Design System
 */
@customElement('ds-badge')
export class DsBadge extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 10px;
      border-radius: 9999px;
      background-color: var(--ds-badge-primary-bg, rgba(19, 91, 236, 0.1));
      color: var(--ds-badge-primary-text, #135bec);
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 11px;
      font-weight: 700;
      line-height: 1;
      transition: all 0.2s ease;
    }

    .badge.secondary {
      background-color: var(--ds-button-secondary-bg, #f1f5f9);
      color: var(--ds-button-secondary-text, #0f172a);
      border: 1px solid var(--ds-border-base, rgba(0,0,0,0.1));
    }

    .badge.success {
      background-color: var(--ds-badge-success-bg, rgba(34, 197, 94, 0.1));
      color: var(--ds-badge-success-text, #16a34a);
    }

    .badge.warning {
      background-color: var(--ds-badge-warning-bg, rgba(245, 158, 11, 0.1));
      color: var(--ds-badge-warning-text, #d97706);
    }

    .badge.danger {
      background-color: var(--ds-badge-danger-bg, rgba(239, 68, 68, 0.1));
      color: var(--ds-badge-danger-text, #dc2626);
    }

    .badge.outline {
      background-color: transparent;
      color: var(--ds-color-primary, #135bec);
      border: 1px solid var(--ds-color-primary, #135bec);
    }
  `;

  @property()
  label = '';

  @property()
  variant: 'primary' | 'secondary' | 'outline' = 'primary';

  override render() {
    return html`
      <div class="badge ${this.variant}" part="badge">
        ${this.label}<slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge;
  }
}

registerMCPTool({
  name: 'ds_badge',
  title: 'DS Badge',
  description: 'Pill-shaped status label for counts, categories, or states. Variants: primary, secondary, success, warning, danger, outline. Tag: <ds-badge>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-badge',
    properties: [
      {name: 'label', type: 'string', description: 'Text inside the badge. Can also use default slot.'},
      {name: 'variant', type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'", default: 'primary'},
    ],
    slots: [{name: '(default)', description: 'Alternative to the label property.'}],
    cssParts: ['badge'],
    examples: [
      '<ds-badge label="New" variant="success"></ds-badge>',
      '<ds-badge label="3" variant="danger"></ds-badge>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_badge_read',
  title: 'Read DS Badges',
  description: 'List all ds-badge elements on the page with their label, variant, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const badges = Array.from(document.querySelectorAll('ds-badge'));
    return badges.map((b, i) => ({
      index: i,
      selector: b.id ? `#${b.id}` : `ds-badge:nth-of-type(${i + 1})`,
      label: b.getAttribute('label') ?? b.textContent?.trim() ?? '',
      variant: b.getAttribute('variant') ?? 'primary',
    }));
  },
});

registerMCPTool({
  name: 'ds_badge_update',
  title: 'Update DS Badge',
  description: 'Update the label or variant of a ds-badge element on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-badge. Defaults to the first one found.'},
      label: {type: 'string', description: 'New badge label text.'},
      variant: {type: 'string', enum: ['primary', 'secondary', 'success', 'warning', 'danger', 'outline'], description: 'New variant.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try { target = document.querySelector(input['selector']); } catch { /* invalid */ }
    }
    if (!target) target = document.querySelector('ds-badge');
    if (!target) return {success: false, error: 'No ds-badge found on the page.'};

    if (typeof input['label'] === 'string') (target as any).label = input['label'];
    if (typeof input['variant'] === 'string') (target as any).variant = input['variant'];
    return {success: true};
  },
});
