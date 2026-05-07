import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_DROPDOWN_STYLES } from './ds-dropdown-base.js';
import { registerMCPTool } from '../../webmcp/index.js';

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

registerMCPTool({
  name: 'ds_dropdown',
  title: 'DS Dropdown',
  description: 'Styled <select> dropdown. Accepts options as a JS array (.options property) or slotted native <option> elements. Emits "ds-change" on selection. Tag: <ds-dropdown>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-dropdown',
    properties: [
      {name: 'label', type: 'string', description: 'Label text shown above the select.'},
      {name: 'value', type: 'string', description: 'Currently selected value.'},
      {name: 'placeholder', type: 'string', default: 'Select…', description: 'Placeholder option shown when no value is selected.'},
      {name: 'disabled', type: 'boolean', default: false, reflected: true},
      {name: 'options', type: 'Array<{value: string, label: string}>', description: 'Options array. Alternative: slot native <option> elements.'},
    ],
    events: [{name: 'ds-change', detail: '{value: string}', description: 'Fired when the user selects an option.'}],
    slots: [{name: '(default)', description: 'Native <option> elements as an alternative to the options property.'}],
    examples: [
      '<ds-dropdown label="Role" .options=${[{value:"admin",label:"Admin"},{value:"user",label:"User"}]}></ds-dropdown>',
      '<ds-dropdown label="Country"><option value="us">United States</option></ds-dropdown>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_dropdown_select',
  title: 'Select DS Dropdown Option',
  description: 'Set the selected value of a ds-dropdown on the page and fire the ds-change event.',
  inputSchema: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {type: 'string', description: 'The option value to select.'},
      label: {type: 'string', description: 'Filter by the dropdown label attribute.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific ds-dropdown.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const dropdowns = Array.from(document.querySelectorAll('ds-dropdown'));
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-dropdown') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['label'] === 'string' && input['label']) {
      target = dropdowns.find(d => d.getAttribute('label') === input['label']) ?? null;
    }
    if (!target) target = dropdowns[0] ?? null;

    if (!target) {
      const available = dropdowns.map(d => d.getAttribute('label') || '(no label)');
      return {success: false, error: 'No matching ds-dropdown found.', availableDropdowns: available};
    }
    (target as HTMLElement & {value: string}).value = String(input['value']);
    target.dispatchEvent(new CustomEvent('ds-change', {detail: {value: input['value']}, bubbles: true, composed: true}));
    return {success: true, value: input['value']};
  },
});

registerMCPTool({
  name: 'ds_dropdown_read',
  title: 'Read DS Dropdowns',
  description: 'List all ds-dropdown elements on the page with their label, current value, and available options.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const dropdowns = Array.from(document.querySelectorAll('ds-dropdown'));
    return dropdowns.map((d, i) => {
      const el = d as HTMLElement & {value: string; options: Array<{value: string; label: string}>};
      const nativeSelect = d.shadowRoot?.querySelector('select');
      const opts = nativeSelect
        ? Array.from(nativeSelect.options)
            .filter(o => o.value !== '')
            .map(o => ({value: o.value, label: o.text}))
        : (el.options ?? []);
      return {
        index: i,
        selector: d.id ? `#${d.id}` : `ds-dropdown:nth-of-type(${i + 1})`,
        label: d.getAttribute('label') ?? '',
        value: el.value ?? '',
        disabled: d.hasAttribute('disabled'),
        options: opts,
      };
    });
  },
});
