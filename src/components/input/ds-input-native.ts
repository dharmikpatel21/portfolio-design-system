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
