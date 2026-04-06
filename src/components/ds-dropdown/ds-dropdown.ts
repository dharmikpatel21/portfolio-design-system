import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_DROPDOWN_STYLES } from './ds-dropdown-base.js';

export interface DropdownOption {
  value: string;
  label: string;
}

/**
 * DsDropdown — Lit autonomous custom element
 * This component provides an accessible and styled dropdown select.
 * 
 * Usage options:
 * 1. Using property: 
 *    <ds-dropdown .options=${opts} value="admin"></ds-dropdown>
 * 
 * 2. Using native options (slotted):
 *    <ds-dropdown label="Role" value="admin">
 *      <option value="admin">Admin</option>
 *      <option value="user">User</option>
 *    </ds-dropdown>
 */
@customElement('ds-dropdown')
export class DsDropdown extends LitElement {
  static override styles = DS_DROPDOWN_STYLES;

  @property() label = '';
  @property() value = '';
  @property() placeholder = 'Select…';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Array }) options: DropdownOption[] = [];

  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent('ds-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      ${this.label ? html`<label>${this.label}</label>` : ''}
      <div class="select-wrapper">
        <select
          .value=${this.value}
          ?disabled=${this.disabled}
          @change=${this._handleChange}
        >
          ${this.placeholder && !this.querySelector('option[value=""]') 
            ? html`<option value="" ?selected=${!this.value} disabled>${this.placeholder}</option>`
            : ''}
          ${this.options?.map(
            (opt) => html`
              <option value=${opt.value} ?selected=${this.value === opt.value}>
                ${opt.label}
              </option>
            `
          )}
          <slot></slot>
        </select>
        <span class="chevron">expand_more</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-dropdown': DsDropdown;
  }
}
