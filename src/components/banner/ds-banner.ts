import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

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
        ${this.dismissible ? html`<span class="icon close" @click="${this._handleDismiss}">close</span>` : ''}
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
