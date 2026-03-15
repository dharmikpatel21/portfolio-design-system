var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
/**
 * DsCard component
 * Part of the Portfolio Design System
 */
let DsCard = class DsCard extends LitElement {
    constructor() {
        super(...arguments);
        this.label = 'Card component';
    }
    render() {
        return html `
      <div>${this.label}</div>
    `;
    }
};
DsCard.styles = css `
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-4, 16px);
      padding: var(--ds-spacing-4, 16px);
      border: 1px solid var(--ds-color-secondary, #ccc);
      border-radius: 4px;
      font-family: var(--ds-font-family-sans);
      color: var(--ds-color-dark, #333);
    }
  `;
__decorate([
    property()
], DsCard.prototype, "label", void 0);
DsCard = __decorate([
    customElement('ds-card')
], DsCard);
export { DsCard };
//# sourceMappingURL=ds-card.js.map