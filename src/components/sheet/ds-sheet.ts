import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsSheet component
 * A slide-out panel that can appear from any side of the screen.
 */
@customElement('ds-sheet')
export class DsSheet extends LitElement {
  static override styles = css`
    :host {
      display: contents;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 2000;
      background-color: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      display: flex;
    }

    .backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    :host([open]) .backdrop {
      opacity: 1;
      pointer-events: auto;
    }

    .sheet-container {
      background-color: var(--ds-bg-surface, #ffffff);
      box-shadow: 10px 0 50px rgba(0, 0, 0, 0.1);
      position: fixed;
      z-index: 2001;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* Sides */
    .sheet-container.right {
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      max-width: 400px;
      transform: translateX(100%);
      border-left: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.1));
    }

    .sheet-container.left {
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      max-width: 400px;
      transform: translateX(-100%);
      border-right: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.1));
    }

    .sheet-container.top {
      top: 0;
      left: 0;
      right: 0;
      height: auto;
      max-height: 80vh;
      transform: translateY(-100%);
      border-bottom: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.1));
    }

    .sheet-container.bottom {
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
      max-height: 80vh;
      transform: translateY(100%);
      border-top: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.1));
      border-radius: 20px 20px 0 0;
    }

    :host([open]) .sheet-container {
      transform: translate(0, 0) !important;
    }

    /* Header */
    .sheet-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.05));
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sheet-header h2 {
      margin: 0;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ds-text-main, #0f172a);
    }

    .close-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: var(--ds-text-muted, #64748b);
      opacity: 0.5;
      transition: opacity 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      opacity: 1;
    }

    .material-symbols-outlined {
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
    }

    /* Body */
    .sheet-body {
      padding: 1.5rem;
      flex-grow: 1;
      overflow-y: auto;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
    }
  `;

  @property({type: Boolean, reflect: true})
  open = false;

  @property()
  side: 'left' | 'right' | 'top' | 'bottom' = 'right';

  @property()
  override title = '';

  private _handleClose() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true
    }));
  }

  private _handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this._handleClose();
    }
  }

  override render() {
    return html`
      <div 
        class="${classMap({backdrop: true, open: this.open})}" 
        @click="${this._handleBackdropClick}"
      ></div>
      <div class="${classMap({'sheet-container': true, [this.side]: true, open: this.open})}" part="container">
        <div class="sheet-header">
          <h2>${this.title}</h2>
          <button 
            class="close-button" 
            @click="${this._handleClose}"
            aria-label="Close sheet"
          >
            <slot name="close-icon">
              <span class="material-symbols-outlined">close</span>
            </slot>
          </button>
        </div>
        
        <div class="sheet-body">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-sheet': DsSheet;
  }
}

registerMCPTool({
  name: 'ds_sheet',
  title: 'DS Sheet',
  description: 'Slide-out drawer panel that can enter from any side of the viewport (left/right/top/bottom). Has a header with title and close button. Fires "close" on dismiss. Tag: <ds-sheet>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-sheet',
    properties: [
      {name: 'open', type: 'boolean', default: false, reflected: true, description: 'Controls visibility.'},
      {name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: 'right', description: 'Which edge the sheet slides in from.'},
      {name: 'title', type: 'string', description: 'Header title text.'},
    ],
    events: [{name: 'close', description: 'Fired when the sheet is dismissed via close button or backdrop click.'}],
    slots: [
      {name: '(default)', description: 'Sheet body content.'},
      {name: 'close-icon', description: 'Custom close icon (defaults to Material Symbol "close").'},
    ],
    cssParts: ['container'],
    example: '<ds-sheet open side="right" title="Settings"><p>Sheet content here.</p></ds-sheet>',
  }),
});

registerMCPTool({
  name: 'ds_sheet_open',
  title: 'Open DS Sheet',
  description: 'Open a ds-sheet on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-sheet. Defaults to the first ds-sheet found.'},
      title: {type: 'string', description: 'Filter by the sheet title attribute.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const sheets = Array.from(document.querySelectorAll('ds-sheet'));
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-sheet') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['title'] === 'string' && input['title']) {
      target = sheets.find(s => s.getAttribute('title') === input['title']) ?? null;
    }
    if (!target) target = sheets[0] ?? null;

    if (!target) {
      const available = sheets.map(s => s.getAttribute('title') || '(no title)');
      return {success: false, error: 'No matching ds-sheet found.', availableSheets: available};
    }
    (target as HTMLElement & {open: boolean}).open = true;
    return {success: true, opened: target.getAttribute('title')};
  },
});

registerMCPTool({
  name: 'ds_sheet_close',
  title: 'Close DS Sheet',
  description: 'Close an open ds-sheet on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-sheet. Defaults to the first open ds-sheet.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-sheet') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target) target = document.querySelector('ds-sheet[open]');

    if (!target) return {success: false, error: 'No open ds-sheet found.'};
    (target as HTMLElement & {open: boolean}).open = false;
    return {success: true};
  },
});
