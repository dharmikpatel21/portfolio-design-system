import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * DsAvatar component
 * Part of the Portfolio Design System
 */
@customElement('ds-avatar')
export class DsAvatar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-4, 16px);
      padding: var(--ds-spacing-4, 16px);
      border: 1px solid var(--ds-color-secondary, #ccc);
      border-radius: 4px;
      font-family: var(--ds-font-family-sans);
      color: var(--ds-color-dark, #333);
    }
  `;

  @property()
  label = 'Avatar component';

  override render() {
    return html`
      <div>${this.label}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-avatar': DsAvatar;
  }
}
