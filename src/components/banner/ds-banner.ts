import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * DsBanner component
 * Part of the Portfolio Design System
 */
@customElement('ds-banner')
export class DsBanner extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-4, 16px);
    }

    .banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: var(--ds-spacing-4, 16px);
      border-radius: 8px;
      border: 1px solid transparent;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      transition: all 0.2s ease-in-out;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      flex-shrink: 0;
    }

    .content {
      flex-grow: 1;
    }

    h5 {
      margin: 0 0 4px 0;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    p {
      margin: 0;
      font-size: 11px;
      line-height: 1.4;
    }

    .close {
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }

    .close:hover {
      opacity: 1;
    }

    /* Variants */
    .banner.info {
      background-color: var(--ds-button-ghost-hover, rgba(19, 91, 236, 0.05));
      border-color: var(--ds-border-base, rgba(19, 91, 236, 0.2));
      color: var(--ds-color-primary, #135bec);
    }

    .banner.success {
      background-color: rgba(34, 197, 94, 0.05);
      border-color: rgba(34, 197, 94, 0.2);
      color: #15803d; /* green-700 */
    }

    .banner.warning {
      background-color: rgba(245, 158, 11, 0.05);
      border-color: rgba(245, 158, 11, 0.2);
      color: #b45309; /* amber-700 */
    }

    .banner.error {
      background-color: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
      color: var(--ds-color-danger, #ef4444);
    }
  `;

  @property()
  override title = '';

  @property()
  description = '';

  @property()
  variant: BannerVariant = 'info';

  @property()
  icon = 'info';

  @property({type: Boolean})
  dismissible = false;

  override render() {
    return html`
      <div class="banner ${this.variant}" part="banner">
        <span class="icon">${this.icon}</span>
        <div class="content">
          ${this.title ? html`<h5>${this.title}</h5>` : ''}
          <p>${this.description}<slot></slot></p>
        </div>
        ${this.dismissible ? html`<span class="icon close" @click="${this._handleDismiss}"><slot name="close-icon">close</slot></span>` : ''}
      </div>
    `;
  }

  private _handleDismiss() {
    this.dispatchEvent(new CustomEvent('dismiss', {
      bubbles: true,
      composed: true
    }));
    this.remove();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-banner': DsBanner;
  }
}

registerMCPTool({
  name: 'ds_banner',
  title: 'DS Banner',
  description: 'Alert/notification banner with icon, title, and description. Variants: info, success, warning, error. Optional dismiss button that fires a "dismiss" event and removes the element. Tag: <ds-banner>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-banner',
    properties: [
      {name: 'title', type: 'string', description: 'Bold heading text.'},
      {name: 'description', type: 'string', description: 'Body text below the title.'},
      {name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: 'info'},
      {name: 'icon', type: 'string', default: 'info', description: 'Material Symbol icon name shown on the left.'},
      {name: 'dismissible', type: 'boolean', default: false, description: 'When true shows a close button. Clicking it fires "dismiss" and removes the element.'},
    ],
    events: [{name: 'dismiss', description: 'Fired when the dismiss button is clicked.'}],
    slots: [
      {name: '(default)', description: 'Additional description content.'},
      {name: 'close-icon', description: 'Custom close icon (defaults to "close").'},
    ],
    cssParts: ['banner'],
    examples: [
      '<ds-banner title="Saved!" description="Your changes were saved." variant="success" dismissible></ds-banner>',
      '<ds-banner title="Error" description="Something went wrong." variant="error" icon="error"></ds-banner>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_banner_dismiss',
  title: 'Dismiss DS Banner',
  description: 'Programmatically dismiss (remove) a ds-banner element on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-banner to dismiss. Defaults to the first ds-banner found.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-banner') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target) target = document.querySelector('ds-banner');

    if (!target) return {success: false, error: 'No ds-banner found on the page.'};
    target.remove();
    return {success: true};
  },
});

registerMCPTool({
  name: 'ds_banner_read',
  title: 'Read DS Banners',
  description: 'List all ds-banner elements on the page with their title, description, variant, icon, and dismissible state.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const banners = Array.from(document.querySelectorAll('ds-banner'));
    return banners.map((b, i) => ({
      index: i,
      selector: b.id ? `#${b.id}` : `ds-banner:nth-of-type(${i + 1})`,
      title: b.getAttribute('title') ?? '',
      description: b.getAttribute('description') ?? '',
      variant: b.getAttribute('variant') ?? 'info',
      icon: b.getAttribute('icon') ?? 'info',
      dismissible: b.hasAttribute('dismissible'),
    }));
  },
});
