import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * DsTooltip component
 * Part of the Portfolio Design System
 */
@customElement('ds-tooltip')
export class DsTooltip extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .tooltip-trigger {
      display: inline-block;
    }

    .tooltip-content {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      padding: var(--ds-spacing-3, 12px) var(--ds-spacing-4, 16px);
      background-color: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.1));
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 100;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease-in-out;
      pointer-events: none;
    }

    :host(:hover) .tooltip-content {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-4px);
    }

    .tooltip-title {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 10px;
      font-weight: 700;
      color: var(--ds-text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }

    .tooltip-body {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 12px;
      font-weight: 500;
      color: var(--ds-text-main, #0f172a);
    }

    /* Direction variants */
    .tooltip-content.bottom { top: 100%; bottom: auto; transform: translateX(-50%) translateY(8px); }
    :host(:hover) .tooltip-content.bottom { transform: translateX(-50%) translateY(4px); }
  `;

  @property()
  content = '';

  @property()
  override title = '';

  @property()
  position: 'top' | 'bottom' = 'top';

  override render() {
    return html`
      <div class="tooltip-trigger" part="trigger">
        <slot></slot>
      </div>
      <div class="tooltip-content ${this.position}" part="content">
        ${this.title ? html`<div class="tooltip-title">${this.title}</div>` : ''}
        <div class="tooltip-body">${this.content}<slot name="content"></slot></div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tooltip': DsTooltip;
  }
}
