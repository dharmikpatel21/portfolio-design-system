import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsModal component
 * Part of the Portfolio Design System
 */
@customElement('ds-modal')
export class DsModal extends LitElement {
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
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-container {
      background-color: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.1));
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      z-index: 2001;
      transform: scale(0.95) translateY(10px);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      overflow: hidden;
    }

    .backdrop.open .modal-container {
      transform: scale(1) translateY(0);
    }

    /* Sizes */
    .modal-container.sm { max-width: 400px; }
    .modal-container.md { max-width: 600px; }
    .modal-container.lg { max-width: 900px; }

    /* Header */
    .modal-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.05));
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-header h2 {
      margin: 0;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      tracking: 0.05em;
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

    /* Body */
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--ds-text-muted, #475569);
    }

    /* Footer */
    .modal-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--ds-border-base, rgba(0, 0, 0, 0.05));
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    /* Mobile Sheet Behavior */
    @media (max-width: 640px) {
      .backdrop {
        align-items: flex-end;
        padding: 0;
      }

      .modal-container {
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .backdrop.open .modal-container {
        transform: translateY(0);
      }
      
      .modal-container.sm, .modal-container.md, .modal-container.lg {
        max-width: 100%;
      }
    }
  `;

  @property({type: Boolean, reflect: true})
  open = false;

  @property()
  override title = '';

  @property()
  size: 'sm' | 'md' | 'lg' = 'md';

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
      >
        <div class="${classMap({'modal-container': true, [this.size]: true})}" part="container">
          <div class="modal-header">
            <h2>${this.title}</h2>
            <button 
            class="close-button" 
            @click="${this._handleClose}"
            aria-label="Close modal"
          >
            <slot name="close-icon">close</slot>
          </button>
          </div>
          
          <div class="modal-body">
            <slot></slot>
          </div>
          
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-modal': DsModal;
  }
}

registerMCPTool({
  name: 'ds_modal',
  title: 'DS Modal',
  description: 'Dialog overlay with blurred backdrop, animated entry, header title, scrollable body slot, and footer slot. Closes on backdrop click or close button — fires "close" event. Responsive: slides up from bottom on mobile. Tag: <ds-modal>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-modal',
    properties: [
      {name: 'open', type: 'boolean', default: false, reflected: true, description: 'Controls visibility. Set to true to open, false to close.'},
      {name: 'title', type: 'string', description: 'Modal header heading text.'},
      {name: 'size', type: "'sm' | 'md' | 'lg'", default: 'md', description: '400px / 600px / 900px max-width.'},
    ],
    events: [{name: 'close', description: 'Fired when the modal is dismissed via close button or backdrop click.'}],
    slots: [
      {name: '(default)', description: 'Scrollable body content.'},
      {name: 'footer', description: 'Action buttons in the modal footer.'},
      {name: 'close-icon', description: 'Custom close icon (defaults to "close").'},
    ],
    cssParts: ['container'],
    example: '<ds-modal open title="Confirm" size="sm"><p>Are you sure?</p><ds-button slot="footer" label="OK"></ds-button></ds-modal>',
  }),
});

registerMCPTool({
  name: 'ds_modal_open',
  title: 'Open DS Modal',
  description: 'Open a ds-modal on the page by setting its open property to true.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-modal. Defaults to the first ds-modal found.'},
      title: {type: 'string', description: 'Filter by the modal title attribute.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const modals = Array.from(document.querySelectorAll('ds-modal'));
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-modal') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target && typeof input['title'] === 'string' && input['title']) {
      target = modals.find(m => m.getAttribute('title') === input['title']) ?? null;
    }
    if (!target) target = modals[0] ?? null;

    if (!target) {
      const available = modals.map(m => m.getAttribute('title') || '(no title)');
      return {success: false, error: 'No matching ds-modal found.', availableModals: available};
    }
    (target as HTMLElement & {open: boolean}).open = true;
    return {success: true, opened: target.getAttribute('title')};
  },
});

registerMCPTool({
  name: 'ds_modal_close',
  title: 'Close DS Modal',
  description: 'Close an open ds-modal on the page by setting its open property to false.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-modal. Defaults to the first open ds-modal found.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;

    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-modal') target = el;
      } catch { /* invalid selector */ }
    }
    if (!target) target = document.querySelector('ds-modal[open]');

    if (!target) return {success: false, error: 'No open ds-modal found.'};
    (target as HTMLElement & {open: boolean}).open = false;
    return {success: true};
  },
});

registerMCPTool({
  name: 'ds_modal_read',
  title: 'Read DS Modals',
  description: 'List all ds-modal elements on the page with their title, open state, size, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const modals = Array.from(document.querySelectorAll('ds-modal'));
    return modals.map((m, i) => ({
      index: i,
      selector: m.id ? `#${m.id}` : `ds-modal:nth-of-type(${i + 1})`,
      title: m.getAttribute('title') ?? '',
      open: m.hasAttribute('open'),
      size: m.getAttribute('size') ?? 'md',
    }));
  },
});
