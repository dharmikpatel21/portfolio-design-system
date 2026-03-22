import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * DsInput component
 * Part of the Portfolio Design System
 */
@customElement('ds-input')
export class DsInput extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      margin-bottom: var(--ds-spacing-4, 16px);
    }

    .input-container {
      position: relative;
      width: 100%;
    }

    label {
      display: block;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-2xs, 10px);
      font-weight: var(--ds-font-weight-bold, 700);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ds-text-muted, #64748b);
      margin-bottom: var(--ds-spacing-1, 4px);
    }

    input {
      width: 100%;
      background-color: var(--ds-bg-app, #f9f8f6);
      border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.1));
      border-radius: 8px;
      padding: var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-sm, 14px);
      color: var(--ds-text-main, #0f172a);
      outline: none;
      transition: all 0.2s ease-in-out;
    }

    input:focus {
      border-color: var(--ds-color-primary, #135bec);
      box-shadow: 0 0 0 2px var(--ds-button-ghost-hover, rgba(19, 91, 236, 0.1));
    }

    .has-icon input {
      padding-left: 40px;
    }

    .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
      color: var(--ds-text-muted, #64748b);
      pointer-events: none;
    }

    .error-text {
      font-size: 10px;
      color: var(--ds-color-danger, #ef4444);
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `;

  @property()
  label = '';

  @property()
  placeholder = '';

  @property()
  value = '';

  @property()
  type = 'text';

  @property()
  icon = '';

  @property()
  error = '';

  override render() {
    return html`
      ${this.label ? html`<label>${this.label}</label>` : ''}
      <div class="input-container ${this.icon ? 'has-icon' : ''}">
        ${this.icon ? html`<span class="icon">${this.icon}</span>` : ''}
        <input 
          type="${this.type}" 
          placeholder="${this.placeholder}" 
          .value="${this.value}"
          @input="${this._handleInput}"
        />
      </div>
      ${this.error ? html`<div class="error-text"><span class="icon" style="position:static; transform:none; font-size:12px">error</span>${this.error}</div>` : ''}
    `;
  }

  private _handleInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('input', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-input': DsInput;
  }
}
