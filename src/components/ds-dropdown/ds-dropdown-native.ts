import { DS_DROPDOWN_TAG_STYLES } from './ds-dropdown-base.js';
import { registerMCPTool } from '../../webmcp/index.js';

// Inject styles once into document head
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(DS_DROPDOWN_TAG_STYLES);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    const style = document.createElement('style');
    style.textContent = DS_DROPDOWN_TAG_STYLES;
    document.head.appendChild(style);
  }

  stylesInjected = true;
}

injectStyles();

const isBrowser = typeof window !== 'undefined';
const BaseSelectClass = isBrowser
  ? HTMLSelectElement
  : (class {} as typeof HTMLSelectElement);

/**
 * DsDropdownNative — Customized built-in element
 * <select is="ds-dropdown-native">
 *   <option value="admin">Admin</option>
 * </select>
 */
export class DsDropdownNative extends BaseSelectClass {
  static observedAttributes = ['placeholder'];

  connectedCallback() {
    // Ensure a placeholder option is present if placeholder attr is set
    this._ensurePlaceholder();
  }

  attributeChangedCallback(name: string, _old: string | null, next: string | null) {
    if (name === 'placeholder') {
      this._ensurePlaceholder(next ?? undefined);
    }
  }

  private _ensurePlaceholder(text?: string) {
    const label = text ?? this.getAttribute('placeholder') ?? '';
    if (!label) return;

    // Check if a placeholder option already exists (value="")
    const existing = this.querySelector<HTMLOptionElement>('option[value=""]');
    if (!existing) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = label;
      opt.disabled = true;
      opt.selected = true;
      this.prepend(opt);
    } else {
      existing.textContent = label;
    }
  }
}

if (isBrowser) {
  customElements.define('ds-dropdown-native', DsDropdownNative, { extends: 'select' });
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-dropdown-native': DsDropdownNative;
  }
}

registerMCPTool({
  name: 'ds_dropdown_native',
  title: 'DS Dropdown Native',
  description: 'Customized built-in select element — extends the native <select> tag using the "is" attribute. Automatically injects a disabled placeholder option when the "placeholder" attribute is set. Safari requires the @ungap/custom-elements polyfill. Usage: <select is="ds-dropdown-native">.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'select',
    is: 'ds-dropdown-native',
    extendsElement: 'HTMLSelectElement',
    keyDifference: 'Use this instead of <ds-dropdown> when you need a real <select> in the DOM — works natively in forms, with FormData, and in table contexts.',
    safariSupport: 'Requires the @ungap/custom-elements polyfill.',
    observedAttributes: [
      {name: 'placeholder', type: 'string', description: 'Text for the auto-injected disabled placeholder <option value="">. Omit if you supply your own.'},
    ],
    nativeAttributes: ['disabled', 'name', 'required', 'multiple', 'size'],
    nativeEvents: ['change', 'input', 'focus', 'blur'],
    note: 'All standard <select> attributes and events work as normal. Options are slotted as child <option> elements.',
    examples: [
      '<select is="ds-dropdown-native" placeholder="Choose role" name="role"><option value="admin">Admin</option><option value="user">User</option></select>',
      '<select is="ds-dropdown-native" disabled><option value="a">Option A</option></select>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_dropdown_native_select',
  title: 'Select DS Dropdown Native Option',
  description: 'Set the selected value of a native ds-dropdown-native element on the page and fire its change event.',
  inputSchema: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {type: 'string', description: 'The option value to select.'},
      name: {type: 'string', description: 'Filter by the select element\'s name attribute.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific select[is="ds-dropdown-native"].'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const selects = Array.from(document.querySelectorAll<HTMLSelectElement>('select[is="ds-dropdown-native"]'));
    let target: HTMLSelectElement | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el instanceof HTMLSelectElement) target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['name'] === 'string' && input['name']) {
      target = selects.find(s => s.name === input['name']) ?? null;
    }
    if (!target) target = selects[0] ?? null;

    if (!target) {
      const available = selects.map(s => s.name || s.getAttribute('placeholder') || '(unnamed)');
      return {success: false, error: 'No matching ds-dropdown-native found.', availableDropdowns: available};
    }
    target.value = String(input['value']);
    target.dispatchEvent(new Event('change', {bubbles: true}));
    return {success: true, value: target.value};
  },
});
