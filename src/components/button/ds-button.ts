import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * DsButton component
 * Part of the Portfolio Design System
 */
@customElement('ds-button')
export class DsButton extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-4, 16px);
      font-family: var(--ds-font-family-sans);
    }
    button {
      padding: var(--ds-spacing-4, 16px);
      border: 1px solid var(--ds-color-secondary, #ccc);
      border-radius: 4px;
      color: var(--ds-color-dark, #333);
      cursor: pointer;
    }
  `;

  @property()
  label = 'Button component';

  @property({type: Number})
  count = 0;

  override render() {
    return html`
      <button @click=${this._onClick} part="button">
        ${this.label} (Count: ${this.count})
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
