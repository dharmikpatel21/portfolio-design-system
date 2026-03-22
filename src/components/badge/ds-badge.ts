import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

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
