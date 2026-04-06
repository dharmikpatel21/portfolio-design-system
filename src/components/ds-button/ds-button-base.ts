import {css} from 'lit';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'slate'
  | 'danger'
  | 'ghost'
  | 'icon';

export const DS_BUTTON_STYLES = css`
  :host {
    display: inline-block;
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-spacing-2, 8px);
    padding: var(--ds-spacing-2, 8px) var(--ds-spacing-4, 16px);
    border-radius: 8px;
    font-size: var(--ds-font-size-sm, 14px);
    font-weight: var(--ds-font-weight-bold, 700);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    width: 100%;
    line-height: 1;
  }

  /* Icon within button */
  .icon-element {
    font-family: 'Material Symbols Outlined';
    font-size: 1.25em;
    font-style: normal;
    font-weight: normal;
    text-transform: none;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    line-height: 1;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Primary Variant */
  button.primary {
    background-color: var(--ds-button-primary-bg, #135bec);
    color: var(--ds-button-primary-text, white);
  }

  button.primary:hover:not(:disabled) {
    background-color: var(--ds-button-primary-hover, #1151d4);
  }

  /* Secondary / Slate Variant */
  button.secondary,
  button.slate {
    background-color: var(--ds-button-secondary-bg, #f1f5f9);
    color: var(--ds-button-secondary-text, #0f172a);
    border-color: var(--ds-button-secondary-border, transparent);
  }

  button.secondary:hover:not(:disabled),
  button.slate:hover:not(:disabled) {
    background-color: var(--ds-button-secondary-hover, #e2e8f0);
  }

  /* Danger Variant */
  button.danger {
    background-color: var(--ds-button-danger-bg, rgba(239, 68, 68, 0.1));
    color: var(--ds-button-danger-text, #ef4444);
    border-color: var(--ds-button-danger-border, transparent);
  }

  button.danger:hover:not(:disabled) {
    background-color: var(--ds-button-danger-hover, rgba(239, 68, 68, 0.2));
  }

  /* Ghost Variant */
  button.ghost {
    background-color: transparent;
    color: var(--ds-button-ghost-text, #135bec);
    border-color: transparent;
  }

  button.ghost:hover:not(:disabled) {
    background-color: var(--ds-button-ghost-hover, rgba(19, 91, 236, 0.05));
  }

  /* Icon Variant (Square/Circle icon button) */
  button.icon {
    aspect-ratio: 1 / 1;
    padding: var(--ds-spacing-2, 8px);
    width: auto;
    min-width: 40px;
    min-height: 40px;
    background-color: transparent;
    color: var(--ds-button-icon-text, #0f172a);
    border-color: var(--ds-border-base, #e2e8f0);
  }

  button.icon:hover:not(:disabled) {
    background-color: var(--ds-button-icon-hover, #f1f5f9);
  }

  button.icon.tiny {
    min-width: 32px;
    min-height: 32px;
    padding: var(--ds-spacing-1, 4px);
  }

  /* Small font for specific modal buttons if needed */
  button.tiny {
    font-size: var(--ds-font-size-2xs, 10px);
    padding: var(--ds-spacing-1, 4px) var(--ds-spacing-3, 12px);
  }
`;

export const DS_BUTTON_TAG_STYLES = `
  button[is="ds-button-native"] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-spacing-2, 8px);
    padding: var(--ds-spacing-2, 8px) var(--ds-spacing-4, 16px);
    border-radius: 8px;
    font-size: var(--ds-font-size-sm, 14px);
    font-weight: var(--ds-font-weight-bold, 700);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
    width: auto;
    line-height: 1;
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
  }

  button[is="ds-button-native"] .icon-element {
    font-family: 'Material Symbols Outlined';
    font-size: 1.25em;
    font-style: normal;
    font-weight: normal;
    text-transform: none;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    line-height: 1;
  }

  button[is="ds-button-native"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Variant Styling - Attribute Based for Native Buttons */
  button[is="ds-button-native"]:not([variant]),
  button[is="ds-button-native"][variant="primary"] {
    background-color: var(--ds-button-primary-bg, #135bec);
    color: var(--ds-button-primary-text, white);
  }

  button[is="ds-button-native"]:not([variant]):hover:not(:disabled),
  button[is="ds-button-native"][variant="primary"]:hover:not(:disabled) {
    background-color: var(--ds-button-primary-hover, #1151d4);
  }

  button[is="ds-button-native"][variant="secondary"] {
    background-color: var(--ds-button-secondary-bg, #f1f5f9);
    color: var(--ds-button-secondary-text, #0f172a);
  }

  button[is="ds-button-native"][variant="secondary"]:hover:not(:disabled) {
    background-color: var(--ds-button-secondary-hover, #e2e8f0);
  }

  button[is="ds-button-native"][variant="slate"] {
    background-color: var(--ds-button-slate-bg, #334155);
    color: var(--ds-button-slate-text, white);
  }

  button[is="ds-button-native"][variant="slate"]:hover:not(:disabled) {
    background-color: var(--ds-button-slate-hover, #1e293b);
  }

  button[is="ds-button-native"][variant="danger"] {
    background-color: var(--ds-button-danger-bg, #fee2e2);
    color: var(--ds-button-danger-text, #dc2626);
  }

  button[is="ds-button-native"][variant="danger"]:hover:not(:disabled) {
    background-color: var(--ds-button-danger-hover, #fecaca);
  }

  button[is="ds-button-native"][variant="ghost"] {
    background-color: transparent;
    color: var(--ds-button-primary-bg, #135bec);
  }

  button[is="ds-button-native"][variant="ghost"]:hover:not(:disabled) {
    background-color: var(--ds-button-secondary-bg, #f1f5f9);
  }

  button[is="ds-button-native"][variant="icon"] {
    padding: var(--ds-spacing-2, 8px);
    background-color: transparent;
    color: var(--ds-text-muted, #64748b);
    border: 1px solid var(--ds-border-color, #e2e8f0);
  }

  button[is="ds-button-native"][variant="icon"]:hover:not(:disabled) {
    background-color: var(--ds-button-secondary-bg, #f1f5f9);
    color: var(--ds-text-main, #0f172a);
  }

  /* Size Variants - Attribute Based */
  button[is="ds-button-native"][tiny] {
    padding: var(--ds-spacing-1, 4px) var(--ds-spacing-2, 8px);
    font-size: var(--ds-font-size-xs, 12px);
  }
`;
