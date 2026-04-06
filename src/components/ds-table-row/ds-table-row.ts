import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_TABLE_ROW_STYLES } from './ds-table-row-base.js';

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
