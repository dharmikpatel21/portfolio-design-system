import {DS_BUTTON_TAG_STYLES, ButtonVariant} from './ds-button-base.js';
import {registerMCPTool} from '../../webmcp/index.js';

// Inject @layer styles once into document head
let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(DS_BUTTON_TAG_STYLES);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch (e) {
    // Fallback for browsers that don't support adoptedStyleSheets (e.g. Safari < 16.4)
    const style = document.createElement('style');
    style.textContent = DS_BUTTON_TAG_STYLES;
    document.head.appendChild(style);
  }

  stylesInjected = true;
}

// Inject styles immediately on module load
injectStyles();

// SSR Safety Fallback
const isBrowser = typeof window !== 'undefined';
const BaseButtonClass = isBrowser
  ? HTMLButtonElement
  : (class {} as typeof HTMLButtonElement);

export class DsButtonNative extends BaseButtonClass {
  static observedAttributes = ['variant', 'tiny', 'icon-prefix', 'icon-suffix'];

  private _iconPrefix = '';
  private _iconSuffix = '';

  constructor() {
    super();
  }

  connectedCallback() {
    // 1. Initial state sync from attributes
    this._syncStateFromAttributes();

    // 2. Initial icon injection
    this._updateIcons();
  }

  private _syncStateFromAttributes() {
    const variant = (this.getAttribute('variant') as ButtonVariant) || 'primary';
    this._iconPrefix = this.getAttribute('icon-prefix') || '';
    this._iconSuffix = this.getAttribute('icon-suffix') || '';

    // If 'variant' attribute is missing, ensure it exists for CSS selection
    if (!this.hasAttribute('variant')) {
      this.setAttribute('variant', variant);
    }
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    next: string | null
  ) {
    if (name === 'variant' && !next) {
      this.setAttribute('variant', 'primary');
    }
    if (name === 'icon-prefix') this._iconPrefix = next || '';
    if (name === 'icon-suffix') this._iconSuffix = next || '';

    this._updateIcons();
  }

  private _updateIcons() {
    // 1. Clean up existing icons we injected (marked with data-ds-icon)
    this.querySelectorAll('[data-ds-icon]').forEach((el) => el.remove());

    // 2. Inject Prefix Icon
    if (this._iconPrefix) {
      const icon = document.createElement('i');
      icon.className = 'icon-element';
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('data-ds-icon', 'prefix');
      icon.textContent = this._iconPrefix;
      this.prepend(icon);
    }

    // 3. Inject Suffix Icon
    if (this._iconSuffix) {
      const icon = document.createElement('i');
      icon.className = 'icon-element';
      icon.setAttribute('aria-hidden', 'true');
      icon.setAttribute('data-ds-icon', 'suffix');
      icon.textContent = this._iconSuffix;
      this.append(icon);
    }
  }
}

// Register as customized built-in safely
if (isBrowser) {
  customElements.define('ds-button-native', DsButtonNative, {extends: 'button'});
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button-native': DsButtonNative;
  }
}

registerMCPTool({
  name: 'ds_button_native',
  title: 'DS Button Native',
  description: 'Customized built-in button element — extends the native <button> tag using the "is" attribute. Zero Shadow DOM overhead; styles injected into the document head. Safari requires the @ungap/custom-elements polyfill. Usage: <button is="ds-button-native">.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'button',
    is: 'ds-button-native',
    extendsElement: 'HTMLButtonElement',
    keyDifference: 'Use this instead of <ds-button> when you need a real <button> in the DOM (e.g. inside a <form>, <table>, or framework that does not support autonomous custom elements).',
    safariSupport: 'Requires the @ungap/custom-elements polyfill — import it before this module.',
    observedAttributes: [
      {name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: 'primary'},
      {name: 'tiny', type: 'boolean (presence)', description: 'Add the attribute to enable the compact size.'},
      {name: 'icon-prefix', type: 'string', description: 'Material Symbol icon name injected before the text content.'},
      {name: 'icon-suffix', type: 'string', description: 'Material Symbol icon name injected after the text content.'},
    ],
    note: 'Button label comes from text content, not a "label" attribute.',
    examples: [
      '<button is="ds-button-native" variant="primary">Save</button>',
      '<button is="ds-button-native" variant="danger" icon-prefix="delete">Delete</button>',
      '<button is="ds-button-native" variant="ghost" tiny>Cancel</button>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_button_native_click',
  title: 'Click DS Button Native',
  description: 'Click a native ds-button-native element on the page identified by its visible text content or a CSS selector.',
  inputSchema: {
    type: 'object',
    properties: {
      text: {type: 'string', description: 'Visible text of the button (e.g. "Standard", "Delete"). Ignores injected icon text.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific button (e.g. \'button[is="ds-button-native"][variant="danger"]\').'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[is="ds-button-native"]'));

    // Get visible text by excluding icon nodes injected by _updateIcons()
    const buttonText = (btn: HTMLButtonElement) =>
      Array.from(btn.childNodes)
        .filter(n => !(n instanceof Element && n.hasAttribute('data-ds-icon')))
        .map(n => n.textContent ?? '')
        .join('')
        .trim();

    let target: HTMLButtonElement | null = null;

    // Try selector first — but only accept it if it actually resolves to a button
    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el instanceof HTMLButtonElement) target = el;
      } catch {
        // Invalid selector syntax — fall through to text matching
      }
    }

    // Fall back to text matching
    if (!target && typeof input['text'] === 'string' && input['text']) {
      target = buttons.find(b => buttonText(b) === input['text']) ?? null;
    }

    if (!target) {
      const available = buttons.map(b => buttonText(b)).filter(Boolean);
      return {success: false, error: 'No matching ds-button-native found.', availableButtons: available};
    }
    if (target.disabled) return {success: false, error: 'Button is disabled.'};
    target.click();
    return {success: true, clicked: buttonText(target)};
  },
});

registerMCPTool({
  name: 'ds_button_native_read',
  title: 'Read DS Button Native Elements',
  description: 'List all button[is="ds-button-native"] elements on the page with their current text, variant, disabled state, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const buttonText = (btn: HTMLButtonElement) =>
      Array.from(btn.childNodes)
        .filter(n => !(n instanceof Element && n.hasAttribute('data-ds-icon')))
        .map(n => n.textContent ?? '')
        .join('')
        .trim();

    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[is="ds-button-native"]'));
    return buttons.map((b, i) => ({
      index: i,
      selector: b.id ? `#${b.id}` : `button[is="ds-button-native"]:nth-of-type(${i + 1})`,
      text: buttonText(b),
      variant: b.getAttribute('variant') ?? 'primary',
      disabled: b.disabled,
      tiny: b.hasAttribute('tiny'),
      iconPrefix: b.getAttribute('icon-prefix') ?? '',
      iconSuffix: b.getAttribute('icon-suffix') ?? '',
    }));
  },
});
