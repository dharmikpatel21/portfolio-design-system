import {registerMCPTool} from '../../webmcp/index.js';

// Inject styles once (reuse button's existing injection logic)
let nativeInputStylesInjected = false;
function injectStyles() {
  if (nativeInputStylesInjected || typeof document === 'undefined') return;

  const INPUT_NATIVE_STYLES = `
    input[is="ds-input-native"] {
      display: block;
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
      box-sizing: border-box;
    }

    input[is="ds-input-native"]:focus {
      border-color: var(--ds-color-primary, #135bec);
      box-shadow: 0 0 0 2px rgba(19, 91, 236, 0.1);
    }

    input[is="ds-input-native"]:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    input[is="ds-input-native"]::placeholder {
      color: var(--ds-text-muted, #64748b);
    }

    /* When has an icon sibling, add left padding */
    input[is="ds-input-native"][data-has-icon] {
      padding-left: 40px;
    }
  `;

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(INPUT_NATIVE_STYLES);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    const style = document.createElement('style');
    style.textContent = INPUT_NATIVE_STYLES;
    document.head.appendChild(style);
  }

  nativeInputStylesInjected = true;
}

injectStyles();

const isBrowser = typeof window !== 'undefined';
const BaseInputClass = isBrowser
  ? HTMLInputElement
  : (class {} as typeof HTMLInputElement);

/**
 * DsInputNative — Customized built-in element
 * <input is="ds-input-native" placeholder="Search..." icon="search" />
 *
 * Wrapping with a label must be done in the consuming HTML:
 *   <label>Name <input is="ds-input-native" /></label>
 */
export class DsInputNative extends BaseInputClass {
  static observedAttributes = ['icon', 'data-has-icon'];

  connectedCallback() {
    this._syncIcon();
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    _next: string | null
  ) {
    if (name === 'icon') this._syncIcon();
  }

  private _syncIcon() {
    const icon = this.getAttribute('icon');

    // Remove existing icon sibling if injected by us
    const existing = this.parentElement?.querySelector('[data-ds-input-icon]');
    if (existing) existing.remove();

    if (icon) {
      this.setAttribute('data-has-icon', '');
      const iconEl = document.createElement('span');
      iconEl.setAttribute('data-ds-input-icon', '');
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.style.cssText = `
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-family: 'Material Symbols Outlined';
        font-size: 18px;
        color: var(--ds-text-muted, #64748b);
        pointer-events: none;
      `;
      iconEl.textContent = icon;

      // Wrap in relative container if parent isn't already positioned
      if (
        this.parentElement &&
        getComputedStyle(this.parentElement).position === 'static'
      ) {
        this.parentElement.style.position = 'relative';
      }
      this.insertAdjacentElement('beforebegin', iconEl);
    } else {
      this.removeAttribute('data-has-icon');
    }
  }
}

if (isBrowser) {
  customElements.define('ds-input-native', DsInputNative, {extends: 'input'});
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-input-native': DsInputNative;
  }
}

registerMCPTool({
  name: 'ds_input_native',
  title: 'DS Input Native',
  description: 'Customized built-in input element — extends the native <input> tag using the "is" attribute. Applies design-system styling via document-level CSS. Optionally injects a Material Symbol icon sibling before the input. Wrap in a <label> for accessibility. Usage: <input is="ds-input-native">.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'input',
    is: 'ds-input-native',
    extendsElement: 'HTMLInputElement',
    keyDifference: 'Use this instead of <ds-input> when you need a real <input> in the DOM — works natively with FormData, constraint validation API, autofill, and table/form contexts.',
    safariSupport: 'Requires the @ungap/custom-elements polyfill.',
    observedAttributes: [
      {name: 'icon', type: 'string', description: 'Material Symbol icon name. Injects a positioned <span> sibling before the input and adds left padding via data-has-icon attribute.'},
    ],
    nativeAttributes: ['type', 'placeholder', 'value', 'disabled', 'required', 'name', 'min', 'max', 'pattern'],
    nativeEvents: ['input', 'change', 'focus', 'blur'],
    accessibilityNote: 'No built-in label — wrap in <label> or link via id/for.',
    examples: [
      '<label>Name <input is="ds-input-native" type="text" placeholder="Alice" name="name" /></label>',
      '<input is="ds-input-native" type="email" placeholder="you@example.com" icon="mail" />',
      '<input is="ds-input-native" type="password" placeholder="Password" required />',
    ],
  }),
});

registerMCPTool({
  name: 'ds_input_native_set_value',
  title: 'Set DS Input Native Value',
  description: 'Set the value of a native ds-input-native element on the page and fire its input and change events.',
  inputSchema: {
    type: 'object',
    required: ['value'],
    properties: {
      value: {type: 'string', description: 'The new value to set.'},
      name: {type: 'string', description: 'Filter by the input\'s name attribute.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific input[is="ds-input-native"].'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[is="ds-input-native"]'));
    let target: HTMLInputElement | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el instanceof HTMLInputElement) target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['name'] === 'string' && input['name']) {
      target = inputs.find(el => el.name === input['name']) ?? null;
    }
    if (!target) target = inputs[0] ?? null;

    if (!target) {
      const available = inputs.map(el => el.name || el.placeholder || el.type || '(unnamed)');
      return {success: false, error: 'No matching ds-input-native found.', availableInputs: available};
    }
    target.value = String(input['value']);
    target.dispatchEvent(new Event('input', {bubbles: true}));
    target.dispatchEvent(new Event('change', {bubbles: true}));
    return {success: true, value: target.value};
  },
});

registerMCPTool({
  name: 'ds_input_native_get_values',
  title: 'Get DS Input Native Values',
  description: 'Read the current name and value of all ds-input-native elements on the page.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('input[is="ds-input-native"]'));
    return inputs.map(el => ({
      name: el.name || undefined,
      type: el.type,
      value: el.value,
      placeholder: el.placeholder || undefined,
    }));
  },
});
