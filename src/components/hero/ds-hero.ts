import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

/**
 * DsHero component
 * Part of the Portfolio Design System
 */
@customElement('ds-hero')
export class DsHero extends LitElement {
  static override styles = css`
    :host {
      display: block;
      margin-bottom: var(--ds-spacing-12, 48px);
    }

    .hero {
      background-color: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.05));
      border-radius: 24px;
      padding: var(--ds-spacing-12, 48px);
      text-align: center;
      overflow: hidden;
      transition: all 0.3s ease-in-out;
    }

    .badge-container {
      margin-bottom: var(--ds-spacing-6, 24px);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    h1 {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.05em;
      color: var(--ds-text-main, #0f172a);
      margin: 0 0 var(--ds-spacing-4, 16px) 0;
      max-width: 800px;
      margin-left: auto;
      margin-right: auto;
    }

    p {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-lg, 18px);
      color: var(--ds-text-muted, #64748b);
      margin: 0 auto var(--ds-spacing-8, 32px) auto;
      max-width: 500px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-spacing-4, 16px);
      flex-wrap: wrap;
    }
  `;

  @property()
  override title = '';

  @property()
  description = '';

  @property()
  badgeText = '';

  override render() {
    return html`
      <div class="hero" part="hero">
        ${this.badgeText ? html`
          <div class="badge-container">
            <ds-badge variant="primary" label="${this.badgeText}"></ds-badge>
          </div>
        ` : ''}
        
        <h1>${this.title}<slot name="title"></slot></h1>
        <p>${this.description}<slot name="description"></slot></p>
        
        <div class="actions">
          <slot name="actions"></slot>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-hero': DsHero;
  }
}
