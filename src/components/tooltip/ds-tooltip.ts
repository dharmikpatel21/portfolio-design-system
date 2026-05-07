import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

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

registerMCPTool({
  name: 'ds_tooltip',
  title: 'DS Tooltip',
  description: 'CSS-only hover tooltip that appears above or below its trigger content. Wrap any element as the default slot and set the content/title props. Tag: <ds-tooltip>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-tooltip',
    properties: [
      {name: 'content', type: 'string', description: 'Main tooltip body text.'},
      {name: 'title', type: 'string', description: 'Optional small uppercase label above the body text.'},
      {name: 'position', type: "'top' | 'bottom'", default: 'top', description: 'Whether the tooltip appears above or below the trigger.'},
    ],
    slots: [
      {name: '(default)', description: 'The trigger element that the user hovers to reveal the tooltip.'},
      {name: 'content', description: 'Custom tooltip body content (alternative to the content property).'},
    ],
    cssParts: ['trigger', 'content'],
    example: '<ds-tooltip content="Copy to clipboard" position="top"><ds-button label="Copy" variant="ghost"></ds-button></ds-tooltip>',
  }),
});

registerMCPTool({
  name: 'ds_tooltip_read',
  title: 'Read DS Tooltips',
  description: 'List all ds-tooltip elements on the page with their content, title, position, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const tooltips = Array.from(document.querySelectorAll('ds-tooltip'));
    return tooltips.map((t, i) => ({
      index: i,
      selector: t.id ? `#${t.id}` : `ds-tooltip:nth-of-type(${i + 1})`,
      content: t.getAttribute('content') ?? '',
      title: t.getAttribute('title') ?? '',
      position: t.getAttribute('position') ?? 'top',
    }));
  },
});
