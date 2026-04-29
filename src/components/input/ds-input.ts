import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

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

registerMCPTool({
  name: 'ds_input',
  title: 'DS Input',
  description: 'Styled text input with label, placeholder, optional Material Symbol icon prefix, error message state, and bubbling "input" event. Tag: <ds-input>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-input',
    properties: [
      {name: 'label', type: 'string', description: 'Label text rendered above the input.'},
      {name: 'placeholder', type: 'string', description: 'Placeholder text inside the input.'},
      {name: 'value', type: 'string', description: 'Current input value (two-way bindable).'},
      {name: 'type', type: 'string', default: 'text', description: 'HTML input type: text, email, password, number, etc.'},
      {name: 'icon', type: 'string', description: 'Material Symbol icon name shown as a prefix inside the input.'},
      {name: 'error', type: 'string', description: 'Error message shown below the input in red.'},
    ],
    events: [{name: 'input', detail: '{value: string}', description: 'Fired on every keystroke with the current value.'}],
    examples: [
      '<ds-input label="Email" type="email" placeholder="you@example.com" icon="mail"></ds-input>',
      '<ds-input label="Password" type="password" error="Too short"></ds-input>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_input_set_value',
  title: 'Set DS Input Value',
  description: 'Set the value of a ds-input component on the page and fire its input event.',
  inputSchema: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {type: 'string', description: 'The new value to set.'},
      label: {type: 'string', description: 'Filter by the ds-input label attribute.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific ds-input.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const inputs = Array.from(document.querySelectorAll('ds-input'));
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-input') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['label'] === 'string' && input['label']) {
      target = inputs.find(el => el.getAttribute('label') === input['label']) ?? null;
    }
    if (!target) target = inputs[0] ?? null;

    if (!target) {
      const available = inputs.map(el => el.getAttribute('label') || el.getAttribute('placeholder') || '(unnamed)');
      return {success: false, error: 'No matching ds-input found.', availableInputs: available};
    }
    (target as HTMLElement & {value: string}).value = String(input['value']);
    target.dispatchEvent(new CustomEvent('input', {detail: {value: input['value']}, bubbles: true, composed: true}));
    return {success: true, value: input['value']};
  },
});

registerMCPTool({
  name: 'ds_input_get_values',
  title: 'Get DS Input Values',
  description: 'Read the current label and value of all ds-input components on the page.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const inputs = Array.from(document.querySelectorAll('ds-input'));
    return inputs.map(el => ({
      label: el.getAttribute('label') ?? '',
      value: (el as HTMLElement & {value: string}).value ?? '',
      selector: el.id ? `#${el.id}` : undefined,
    }));
  },
});
