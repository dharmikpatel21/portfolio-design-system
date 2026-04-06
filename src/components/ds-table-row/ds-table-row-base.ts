import {css} from 'lit';

export const DS_TABLE_ROW_STYLES = css`
  :host {
    display: table-row;
    width: 100%;
  }

  :host([data-layout="flex"]) {
    display: flex;
    align-items: center;
  }

  td, .ds-cell {
    padding: var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    font-size: var(--ds-font-size-sm, 14px);
    color: var(--ds-text-main, #0f172a);
    border-bottom: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.08));
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1; /* For flex layout */
  }

  td.action-cell, .ds-cell.action-cell {
    text-align: right;
    flex: 0 0 auto;
    min-width: 120px;
  }

  :host(:hover) td, :host(:hover) .ds-cell {
    background-color: var(--ds-bg-hover, rgba(19, 91, 236, 0.03));
  }

  .delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: var(--ds-font-size-xs, 12px);
    font-weight: var(--ds-font-weight-bold, 700);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    cursor: pointer;
    border: 1px solid transparent;
    background-color: var(--ds-button-danger-bg, rgba(239, 68, 68, 0.1));
    color: var(--ds-button-danger-text, #ef4444);
    transition: all 0.2s ease-in-out;
  }

  .delete-btn:hover {
    background-color: var(--ds-button-danger-hover, rgba(239, 68, 68, 0.2));
  }
`;

export const DS_TABLE_ROW_TAG_STYLES = `
  tr[is="ds-table-row-native"] td {
    padding: var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    font-size: var(--ds-font-size-sm, 14px);
    color: var(--ds-text-main, #0f172a);
    border-bottom: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.08));
    vertical-align: middle;
    white-space: nowrap;
  }

  tr[is="ds-table-row-native"] td.action-cell {
    text-align: right;
  }

  tr[is="ds-table-row-native"]:hover td {
    background-color: var(--ds-bg-hover, rgba(19, 91, 236, 0.03));
  }

  tr[is="ds-table-row-native"] .ds-row-delete-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: var(--ds-font-size-xs, 12px);
    font-weight: var(--ds-font-weight-bold, 700);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    cursor: pointer;
    border: 1px solid transparent;
    background-color: var(--ds-button-danger-bg, rgba(239, 68, 68, 0.1));
    color: var(--ds-button-danger-text, #ef4444);
    transition: all 0.2s ease-in-out;
  }

  tr[is="ds-table-row-native"] .ds-row-delete-btn:hover {
    background-color: var(--ds-button-danger-hover, rgba(239, 68, 68, 0.2));
  }
`;
