var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * DsButton component
 * Part of the Portfolio Design System
 */
let DsButton = class DsButton extends LitElement {
    constructor() {
        super(...arguments);
        this.label = '';
        this.variant = 'primary';
        this.disabled = false;
        this.tiny = false;
        this.iconPrefix = '';
        this.iconSuffix = '';
    }
    render() {
        return html `
      <button 
        class="${this.variant} ${this.tiny ? 'tiny' : ''}" 
        ?disabled=${this.disabled}
        part="button"
      >
        ${this.iconPrefix ? html `<i class="icon-element" part="icon-prefix">${this.iconPrefix}</i>` : ''}
        ${this.label ? html `<span part="label">${this.label}</span>` : ''}
        <slot></slot>
        ${this.iconSuffix ? html `<i class="icon-element" part="icon-suffix">${this.iconSuffix}</i>` : ''}
      </button>
    `;
    }
};
DsButton.styles = css `
    :host {
      display: inline-block;
      font-family: var(--ds-font-family-sans);
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
      background-color: var(--ds-color-primary, #135bec);
      color: white;
    }

    button.primary:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    /* Slate Variant */
    button.slate {
      background-color: var(--ds-color-slate-100, #f1f5f9);
      color: var(--ds-color-dark, #0f172a);
    }

    button.slate:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    /* Danger Variant */
    button.danger {
      background-color: var(--ds-color-danger, #ef4444);
      color: white;
    }

    button.danger:hover:not(:disabled) {
      filter: brightness(1.1);
    }

    /* Ghost Variant */
    button.ghost {
      background-color: transparent;
      color: var(--ds-color-dark, #0f172a);
      border-color: var(--ds-border-base, #e2e8f0);
    }

    button.ghost:hover:not(:disabled) {
      background-color: var(--ds-bg-app, #f1f5f9);
      filter: brightness(1.1);
    }

    /* Icon Variant (Square/Circle icon button) */
    button.icon {
      aspect-ratio: 1 / 1;
      padding: var(--ds-spacing-2, 8px);
      width: auto;
      min-width: 40px;
      min-height: 40px;
      background-color: transparent;
      color: var(--ds-color-dark, #0f172a);
      border-color: var(--ds-border-base, #e2e8f0);
    }

    button.icon:hover:not(:disabled) {
      background-color: var(--ds-bg-app, #f1f5f9);
      filter: brightness(1.1);
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
__decorate([
    property()
], DsButton.prototype, "label", void 0);
__decorate([
    property({ reflect: true })
], DsButton.prototype, "variant", void 0);
__decorate([
    property({ type: Boolean })
], DsButton.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], DsButton.prototype, "tiny", void 0);
__decorate([
    property()
], DsButton.prototype, "iconPrefix", void 0);
__decorate([
    property()
], DsButton.prototype, "iconSuffix", void 0);
DsButton = __decorate([
    customElement('ds-button')
], DsButton);
export { DsButton };
//# sourceMappingURL=ds-button.js.map