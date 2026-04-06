import {DS_TABLE_ROW_TAG_STYLES} from './ds-table-row-base.js';

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(DS_TABLE_ROW_TAG_STYLES);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  } catch {
    const style = document.createElement('style');
    style.textContent = DS_TABLE_ROW_TAG_STYLES;
    document.head.appendChild(style);
  }

  stylesInjected = true;
}

injectStyles();

const isBrowser = typeof window !== 'undefined';
const BaseRowClass = isBrowser
  ? HTMLTableRowElement
  : (class {} as typeof HTMLTableRowElement);

/**
 * DsTableRowNative — Customized built-in element
 * Extends <tr>. It looks at column keys from the `data-columns` attribute
 * and cell values from corresponding `data-*` attributes.
 *
 * Usage:
 *   <tr is="ds-table-row-native"
 *     data-row-id="1"
 *     data-columns="name,email,role"
 *     data-name="Alice"
 *     data-email="a@b.com"
 *     data-role="Admin"
 *   >
 *      <td class="action-cell">
 *        <button is="ds-button-native" variant="danger">Delete</button>
 *      </td>
 *   </tr>
 */
export class DsTableRowNative extends BaseRowClass {
  static observedAttributes = ['data-row-id', 'data-columns'];

  connectedCallback() {
    this._renderCells();
  }

  attributeChangedCallback(
    _name: string,
    _old: string | null,
    _next: string | null
  ) {
    this._renderCells();
  }

  private _renderCells() {
    // Collect column data
    const columnsAttr = this.getAttribute('data-columns') ?? '';
    const columns = columnsAttr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Identify non-data cells that were manually added
    // (We use prepend to ensure columns appear first)
    // Actually, it's safer to only add cells if they're not there.

    // Instead of completely clearing everything, we clear elements we previously injected
    this.querySelectorAll('[data-ds-cell]').forEach((el) => el.remove());

    // Iterate backwards through columns to prepending so the first column ends up first
    [...columns].reverse().forEach((col) => {
      const td = document.createElement('td');
      td.setAttribute('data-ds-cell', col);
      td.textContent = this.getAttribute(`data-${col}`) ?? '—';
      this.prepend(td);
    });
  }
}

if (isBrowser) {
  customElements.define('ds-table-row-native', DsTableRowNative, {
    extends: 'tr',
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-table-row-native': DsTableRowNative;
  }
}
