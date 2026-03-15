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
        this.label = 'Button component';
        this.count = 0;
    }
    render() {
        return html `
      <button @click=${this._onClick} part="button">
        ${this.label} (Count: ${this.count})
      </button>
      <slot></slot>
    `;
    }
    _onClick() {
        this.count++;
    }
};
DsButton.styles = css `
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-4, 16px);
      font-family: var(--ds-font-family-sans);
    }
    button {
      padding: var(--ds-spacing-4, 16px);
      border: 1px solid var(--ds-color-secondary, #ccc);
      border-radius: 4px;
      color: var(--ds-color-dark, #333);
      cursor: pointer;
    }
  `;
__decorate([
    property()
], DsButton.prototype, "label", void 0);
__decorate([
    property({ type: Number })
], DsButton.prototype, "count", void 0);
DsButton = __decorate([
    customElement('ds-button')
], DsButton);
export { DsButton };
//# sourceMappingURL=ds-button.js.map