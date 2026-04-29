import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsCard component
 * Part of the Portfolio Design System
 */
@customElement('ds-card')
export class DsCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
      transition: all 0.2s ease-in-out;
    }

    .card {
      background-color: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.05));
      border-radius: 12px;
      padding: var(--ds-spacing-6, 24px);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease-in-out;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: max-content;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(19, 91, 236, 0.05), 0 10px 10px -5px rgba(19, 91, 236, 0.02);
      border-color: var(--ds-color-primary, rgba(19, 91, 236, 0.2));
    }

    .media-container {
      width: 100%;
      margin-bottom: var(--ds-spacing-4, 16px);
      display: block;
    }

    .image-container {
      width: 100%;
      height: 160px;
      background-color: var(--ds-bg-app, #f1f5f9);
      border-radius: 8px;
      overflow: hidden;
    }

    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: grayscale(100%);
      transition: filter 0.3s ease-in-out;
    }

    .card:hover .image-container img {
      filter: grayscale(0%);
    }

    h4 {
      margin: 0 0 4px 0;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-md, 16px);
      font-weight: var(--ds-font-weight-bold, 700);
      color: var(--ds-text-main, #0f172a);
    }

    p {
      margin: 0 0 16px 0;
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: var(--ds-font-size-xs, 12px);
      color: var(--ds-text-muted, #64748b);
      line-height: 1.5;
    }

    .footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .footer-text {
      font-size: 10px;
      font-weight: 700;
      color: var(--ds-color-primary, #135bec);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .icon {
      font-family: 'Material Symbols Outlined';
      font-size: 14px;
      color: var(--ds-color-primary, #135bec);
    }
  `;

  @property()
  image = '';

  @property()
  override title = '';

  @property()
  description = '';

  @property()
  footerText = '';

  @property()
  footerIcon = '';

  override render() {
    return html`
      <div class="card" part="card">
        <div class="media-container">
          <slot name="media">
            ${this.image ? html`
              <div class="image-container">
                <img src="${this.image}" alt="${this.title}" />
              </div>
            ` : ''}
          </slot>
        </div>
        
        ${this.title ? html`<h4>${this.title}</h4>` : ''}
        ${this.description ? html`<p>${this.description}</p>` : ''}
        
        <slot></slot>

        ${(this.footerText || this.footerIcon) ? html`
          <div class="footer">
            ${this.footerText ? html`<span class="footer-text">${this.footerText}</span>` : ''}
            ${this.footerIcon ? html`<span class="icon">${this.footerIcon}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard;
  }
}

registerMCPTool({
  name: 'ds_card',
  title: 'DS Card',
  description: 'Content card with optional image header, title, description, footer, and hover lift animation. Use the "media" slot to replace the image area with custom content. Tag: <ds-card>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-card',
    properties: [
      {name: 'image', type: 'string', description: 'URL of an image shown in the card header. Greyscale by default, colorizes on hover.'},
      {name: 'title', type: 'string', description: 'Card heading.'},
      {name: 'description', type: 'string', description: 'Body text below the title.'},
      {name: 'footerText', type: 'string', description: 'Uppercase text in the footer area.'},
      {name: 'footerIcon', type: 'string', description: 'Material Symbol icon name in the footer (e.g. "arrow_forward").'},
    ],
    slots: [
      {name: 'media', description: 'Replaces the image area with arbitrary content.'},
      {name: '(default)', description: 'Content inserted between description and footer.'},
    ],
    cssParts: ['card'],
    cssVariables: ['--ds-bg-surface', '--ds-border-base', '--ds-color-primary'],
    example: '<ds-card title="Project Alpha" description="A short summary." footer-text="View" footer-icon="arrow_forward"></ds-card>',
  }),
});
