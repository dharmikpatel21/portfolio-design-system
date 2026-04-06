import { DS_DROPDOWN_TAG_STYLES } from './ds-dropdown-base.js';

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
