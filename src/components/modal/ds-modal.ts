import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

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
