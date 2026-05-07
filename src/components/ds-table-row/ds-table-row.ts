import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_TABLE_ROW_STYLES } from './ds-table-row-base.js';
import { registerMCPTool } from '../../webmcp/index.js';

/**
 * DsTableRow — Lit autonomous custom element
 * This component renders a table row (tr) with its corresponding table cells (td).
 * It includes a slot to allow adding additional cells (like buttons or controls) 
 * directly in your markup.
 *
 * Usage:
 *   <ds-table-row
 *     row-id="123"
 *     .columns=${['name','email','role']}
 *     .rowData=${{ name: 'Alice', email: 'a@b.com', role: 'Admin' }}
 *   >
 *     <td><button>Delete</button></td>
 *   </ds-table-row>
 */
@customElement('ds-table-row')
export class DsTableRow extends LitElement {
  static override styles = DS_TABLE_ROW_STYLES;

  @property({ attribute: 'row-id' }) rowId = '';
  @property({ type: Array }) columns: string[] = [];
  @property({ type: Object }) rowData: Record<string, string> = {};

  override render() {
    return html`
      ${this.columns.map(
        (col) => html`<div class="ds-cell">${this.rowData[col] ?? '—'}</div>`
      )}
      <div class="ds-cell action-cell">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-table-row': DsTableRow;
  }
}

registerMCPTool({
  name: 'ds_table_row',
  title: 'DS Table Row',
  description: 'Renders data cells for a table row from a columns key list and a rowData object. Appends an action cell via the default slot for custom controls. Tag: <ds-table-row>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-table-row',
    properties: [
      {name: 'rowId', attribute: 'row-id', type: 'string', description: 'Unique identifier for the row.'},
      {name: 'columns', type: 'string[]', description: 'Ordered list of data keys to render as cells.'},
      {name: 'rowData', type: 'Record<string, string>', description: 'Data object — cell values are looked up by column key.'},
    ],
    slots: [{name: '(default)', description: 'Appended as the last cell — use for action buttons or controls.'}],
    example: `<ds-table-row row-id="1" .columns=\${['name','email']} .rowData=\${{name:'Alice',email:'a@b.com'}}>\n  <td><button>Delete</button></td>\n</ds-table-row>`,
  }),
});

registerMCPTool({
  name: 'ds_table_row_read',
  title: 'Read DS Table Row Data',
  description: 'Read all data from ds-table-row elements currently in the page.',
  annotations: {readOnlyHint: true},
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'Optional CSS selector to scope the search (e.g. "ds-table-row").'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let scope: Element | Document = document;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el) scope = el;
      } catch { /* invalid selector */ }
    }

    const rows = Array.from(scope.querySelectorAll('ds-table-row')) as any[];
    if (rows.length === 0) return {success: false, error: 'No ds-table-row elements found.'};

    return rows.map(row => ({
      rowId: row.rowId ?? row.getAttribute('row-id') ?? '',
      columns: row.columns ?? [],
      data: row.rowData ?? {},
    }));
  },
});
