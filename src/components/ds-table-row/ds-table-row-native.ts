import {IS_SAFARI_OR_WEBKIT} from '../../polyfills/custom-elements.js';
import {DS_TABLE_ROW_TAG_STYLES} from './ds-table-row-base.js';
import {registerMCPTool} from '../../webmcp/index.js';

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

  /**
   * Internal render logic.
   * Note: This is public so the polyfill below can access it via prototype.
   */
  public _renderCells() {
    const columnsAttr = this.getAttribute('data-columns') ?? '';
    const columns = columnsAttr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Remove previously injected cells
    this.querySelectorAll('[data-ds-cell]').forEach((el) => el.remove());

    // Prepend in reverse to maintain order at the start of the row
    [...columns].reverse().forEach((col) => {
      const td = document.createElement('td');
      td.setAttribute('data-ds-cell', col);
      // Fallback to lowercase for safety
      const val =
        this.getAttribute(`data-${col}`) ||
        this.getAttribute(`data-${col.toLowerCase()}`) ||
        '—';
      td.textContent = val;
      this.prepend(td);
    });
  }
}

if (isBrowser) {
  (() => {
    // 1. Define the Custom Element
    customElements.define('ds-table-row-native', DsTableRowNative, {
      extends: 'tr',
    });

    // 2. SAFARI EXIT: If WebKit is detected, the @ungap polyfill handles it.
    // We stop here to prevent "Double Observation" and performance lag.
    if (IS_SAFARI_OR_WEBKIT) {
      console.log('[ds-native] WebKit detected: Using ungap polyfill.');
      return;
    }

    // 3. CHROMIUM/GECKO ENGINE: Manual hydration for Angular/React
    console.log(
      '[ds-native] Chromium/Gecko detected: Activating manual hydration.'
    );

    const _renderCells = (DsTableRowNative.prototype as any)._renderCells;
    const tracked = new WeakMap<Element, MutationObserver>();

    function initNonUpgradedRow(row: Element): void {
      if (row instanceof DsTableRowNative || tracked.has(row)) return;

      // PERFORMANCE: Defer initial render to the next animation frame
      requestAnimationFrame(() => _renderCells.call(row));

      let timeout: any;
      const attrObs = new MutationObserver(() => {
        // BATCHING: Prevents multiple renders if many attributes change at once
        cancelAnimationFrame(timeout);
        timeout = requestAnimationFrame(() => _renderCells.call(row));
      });

      attrObs.observe(row, {attributes: true});
      tracked.set(row, attrObs);
    }

    const globalObserver = new MutationObserver((mutations) => {
      // IDLE SCHEDULING: Run the scan only when the browser has free time
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => processMutations(mutations), {
          timeout: 500,
        });
      } else {
        setTimeout(() => processMutations(mutations), 0);
      }
    });

    function processMutations(mutations: MutationRecord[]) {
      console.time('ds-native:hydration-task');

      // Use a temporary Set to find the "Survivor" nodes in this batch
      const finalAdded = new Set<Node>();
      const finalRemoved = new Set<Node>();

      for (let i = 0; i < mutations.length; i++) {
        const {addedNodes, removedNodes} = mutations[i];

        for (let j = 0; j < addedNodes.length; j++) {
          const node = addedNodes[j];
          finalAdded.add(node);
          finalRemoved.delete(node); // If it was removed earlier in this batch, it's back now
        }

        for (let j = 0; j < removedNodes.length; j++) {
          const node = removedNodes[j];
          finalRemoved.add(node);
          finalAdded.delete(node); // If it was added earlier in this batch, it's gone now
        }
      }

      let addedRows = 0;
      let removedRows = 0;

      // 1. Only process the nodes that are REALLY gone at the end of the batch
      finalRemoved.forEach((node: any) => {
        if (node.nodeType === 1) {
          const obs = tracked.get(node);
          if (obs) {
            obs.disconnect();
            tracked.delete(node);
            removedRows++;
          }

          const childRows = node.querySelectorAll?.(
            'tr[is="ds-table-row-native"]'
          );
          if (childRows) {
            for (let k = 0; k < childRows.length; k++) {
              const cObs = tracked.get(childRows[k]);
              if (cObs) {
                cObs.disconnect();
                tracked.delete(childRows[k]);
                removedRows++;
              }
            }
          }
        }
      });

      // 2. Only process the nodes that are REALLY still there
      finalAdded.forEach((node: any) => {
        if (node.nodeType === 1) {
          if (
            node.tagName === 'TR' &&
            node.getAttribute('is') === 'ds-table-row-native'
          ) {
            initNonUpgradedRow(node);
            addedRows++;
          } else if (node.children?.length > 0) {
            const rows = node.querySelectorAll('tr[is="ds-table-row-native"]');
            for (let k = 0; k < rows.length; k++) {
              initNonUpgradedRow(rows[k]);
              addedRows++;
            }
          }
        }
      });

      if (addedRows > 0 || removedRows > 0) {
        console.log(
          `[ds-native] Cleaned Batch: ${addedRows} added, ${removedRows} removed.`
        );
      }
      console.timeEnd('ds-native:hydration-task');
    }

    // Start observing from the document element to capture all framework changes
    globalObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  })();
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-table-row-native': DsTableRowNative;
  }
}

registerMCPTool({
  name: 'ds_table_row_native',
  title: 'DS Table Row Native',
  description: 'Customized built-in table row — extends the native <tr> element using the "is" attribute. Cell content is driven entirely by data-* attributes; no JS property binding needed. Safari uses the @ungap/custom-elements polyfill; Chromium/Gecko use a MutationObserver-based hydration system to handle framework-rendered rows that bypass the upgrade lifecycle. Usage: <tr is="ds-table-row-native">.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'tr',
    is: 'ds-table-row-native',
    extendsElement: 'HTMLTableRowElement',
    keyDifference: 'Use this instead of <ds-table-row> when rendering inside a real <table>/<tbody> — browsers enforce that only valid table elements can be children of <tbody>.',
    safariSupport: 'Uses @ungap/custom-elements polyfill (IS_SAFARI_OR_WEBKIT flag).',
    chromiumGeckoSupport: 'Manual MutationObserver hydration handles rows inserted by Angular/React that skip the customElements upgrade lifecycle.',
    observedAttributes: [
      {name: 'data-row-id', type: 'string', description: 'Unique row identifier.'},
      {name: 'data-columns', type: 'string', description: 'Comma-separated list of column keys in render order (e.g. "name,email,role").'},
      {name: 'data-{columnKey}', type: 'string', description: 'One attribute per column key holding the cell value (e.g. data-name="Alice").'},
    ],
    slots: 'Child <td> elements placed in the markup are appended after the generated data cells — use for action buttons.',
    examples: [
      '<tr is="ds-table-row-native" data-row-id="1" data-columns="name,email,role" data-name="Alice" data-email="a@b.com" data-role="Admin"><td><button is="ds-button-native" variant="danger">Delete</button></td></tr>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_table_row_native_read',
  title: 'Read DS Table Row Native Data',
  description: 'Read all data from ds-table-row-native elements currently in the page.',
  annotations: {readOnlyHint: true},
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'Optional CSS selector to scope the search (e.g. "#my-table tr[is=\'ds-table-row-native\']").'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let scope: Element | Document = document;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el) scope = el;
      } catch { /* invalid selector — fall back to document */ }
    }

    const rows = Array.from(scope.querySelectorAll('tr[is="ds-table-row-native"]'));
    if (rows.length === 0) return {success: false, error: 'No ds-table-row-native elements found.'};
    return rows.map(row => {
      const columns = (row.getAttribute('data-columns') ?? '').split(',').map(c => c.trim()).filter(Boolean);
      const data: Record<string, string> = {};
      columns.forEach(col => { data[col] = row.getAttribute(`data-${col}`) ?? '—'; });
      return {rowId: row.getAttribute('data-row-id') ?? '', columns, data};
    });
  },
});
