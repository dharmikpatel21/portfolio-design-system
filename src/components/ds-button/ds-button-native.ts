import {DS_BUTTON_TAG_STYLES, ButtonVariant} from './ds-button-base.js';

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
