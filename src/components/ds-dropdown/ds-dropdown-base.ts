import {css} from 'lit';

export type DropdownVariant = 'default' | 'ghost';

export const DS_DROPDOWN_STYLES = css`
  :host {
    display: inline-block;
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    width: 100%;
  }

  label {
    display: block;
    font-size: var(--ds-font-size-2xs, 10px);
    font-weight: var(--ds-font-weight-bold, 700);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ds-text-muted, #64748b);
    margin-bottom: var(--ds-spacing-1, 4px);
  }

  .select-wrapper {
    position: relative;
    width: 100%;
  }

  select {
    width: 100%;
    appearance: none;
    background-color: var(--ds-bg-app, #f9f8f6);
    border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.1));
    border-radius: 8px;
    padding: var(--ds-spacing-3, 12px) var(--ds-spacing-8, 32px) var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    font-size: var(--ds-font-size-sm, 14px);
    color: var(--ds-text-main, #0f172a);
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease-in-out;
  }

  select:focus {
    border-color: var(--ds-color-primary, #135bec);
    box-shadow: 0 0 0 2px rgba(19, 91, 236, 0.1);
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .chevron {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-family: 'Material Symbols Outlined';
    font-size: 18px;
    font-style: normal;
    color: var(--ds-text-muted, #64748b);
  }
`;

export const DS_DROPDOWN_TAG_STYLES = `
  select[is="ds-dropdown-native"] {
    display: block;
    width: 100%;
    appearance: none;
    background-color: var(--ds-bg-app, #f9f8f6);
    border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.1));
    border-radius: 8px;
    padding: var(--ds-spacing-3, 12px) var(--ds-spacing-8, 32px) var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
    font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    font-size: var(--ds-font-size-sm, 14px);
    color: var(--ds-text-main, #0f172a);
    cursor: pointer;
    outline: none;
    transition: all 0.2s ease-in-out;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 16px;
  }

  select[is="ds-dropdown-native"]:focus {
    border-color: var(--ds-color-primary, #135bec);
    box-shadow: 0 0 0 2px rgba(19, 91, 236, 0.1);
  }

  select[is="ds-dropdown-native"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
