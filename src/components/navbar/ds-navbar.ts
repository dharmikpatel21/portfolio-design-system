import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsNavbar component
 * Part of the Portfolio Design System
 */
@customElement('ds-navbar')
export class DsNavbar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
    }

    nav {
      background-color: var(--ds-bg-app-glass, rgba(249, 248, 246, 0.8));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--ds-border-base, rgba(19, 91, 236, 0.1));
      padding: var(--ds-spacing-4, 16px) var(--ds-spacing-6, 24px);
      transition: all 0.3s ease-in-out;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: var(--ds-text-main, #0f172a);
      transition: opacity 0.2s ease-in-out;
    }

    .logo:hover {
      opacity: 0.8;
    }

    .logo-icon {
      font-family: 'Material Symbols Outlined';
      font-size: 28px;
      color: var(--ds-color-primary, #135bec);
    }

    ds-avatar {
      --ds-avatar-size: 32px;
    }

    .logo-text {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }

    .logo-version {
      color: var(--ds-color-primary, #135bec);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .menu-button {
      display: none;
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      color: var(--ds-text-main, #0f172a);
      font-family: 'Material Symbols Outlined';
      font-size: 24px;
    }

    .mobile-nav-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      padding-top: 12px;
    }

    .mobile-nav-content ::slotted(a),
    .mobile-nav-content a {
      font-size: 18px;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .menu-button {
        display: flex;
      }
    }

    ::slotted(a), a {
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-size: 14px;
      font-weight: 500;
      color: var(--ds-text-main, #0f172a);
      text-decoration: none;
      transition: color 0.2s ease-in-out;
    }

    ::slotted(a:hover), a:hover {
      color: var(--ds-color-primary, #135bec);
    }
  `;

  @property()
  logoText = 'DevSystem';

  @property()
  logoIcon = 'token';

  @property({ type: Object })
  logoImage: string | { src: string; alt?: string } = '';

  @property()
  version = '';

  @property({type: Boolean, reflect: true})
  isMenuOpen = false;

  private _toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  private _closeMenu() {
    this.isMenuOpen = false;
  }

  override render() {
    return html`
      <nav part="nav">
        <div class="container">
          <a href="/" class="logo">
            ${this.logoImage 
              ? html`
                <ds-avatar 
                  src="${typeof this.logoImage === 'string' ? this.logoImage : this.logoImage.src}" 
                  alt="${typeof this.logoImage === 'object' ? (this.logoImage.alt || this.logoText) : this.logoText}"
                  size="small"
                ></ds-avatar>`
              : html`<span class="logo-icon">${this.logoIcon}</span>`
            }
            <span class="logo-text">${this.logoText} ${this.version ? html`<span class="logo-version">${this.version}</span>` : ''}</span>
          </a>
          
          <div class="nav-links">
            <slot></slot>
          </div>

          <button 
            class="menu-button" 
            @click="${this._toggleMenu}"
            aria-label="Toggle menu"
          >
            <slot name="menu-icon">menu</slot>
          </button>
        </div>
      </nav>

      <ds-sheet ?open="${this.isMenuOpen}" @close="${this._closeMenu}" title="Menu">
          <slot name="close-icon" slot="close-icon"></slot>
          <div class="mobile-nav-content" @click="${(e: Event) => {
            if ((e.target as HTMLElement).tagName === 'A') this._closeMenu();
          }}">
            <slot name="mobile"></slot>
            <!-- Fallback if no mobile slot provided, we encourage using mobile slot for cleaner control -->
            <slot></slot> 
          </div>
        </ds-sheet>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-navbar': DsNavbar;
  }
}

registerMCPTool({
  name: 'ds_navbar',
  title: 'DS Navbar',
  description: 'Sticky top navigation bar with glassmorphism backdrop. Shows a logo (icon or image) with optional version tag, desktop nav-link slot, and a hamburger menu that opens a ds-sheet on mobile. Tag: <ds-navbar>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-navbar',
    properties: [
      {name: 'logoText', type: 'string', default: 'DevSystem', description: 'Text next to the logo icon.'},
      {name: 'logoIcon', type: 'string', default: 'token', description: 'Material Symbol icon name for the logo. Ignored when logoImage is set.'},
      {name: 'logoImage', type: 'string | {src: string, alt?: string}', description: 'URL or object for a logo image; renders a ds-avatar instead of the icon.'},
      {name: 'version', type: 'string', description: 'Optional version label rendered in primary color next to the logo text.'},
      {name: 'isMenuOpen', type: 'boolean', default: false, reflected: true, description: 'Controls the mobile sheet menu open state.'},
    ],
    slots: [
      {name: '(default)', description: 'Desktop nav links (shown in the header). Also mirrored into the mobile sheet as a fallback.'},
      {name: 'mobile', description: 'Dedicated mobile nav links inside the sheet — preferred over relying on the default slot fallback.'},
      {name: 'menu-icon', description: 'Custom hamburger icon (defaults to "menu").'},
      {name: 'close-icon', description: 'Custom close icon for the mobile sheet.'},
    ],
    cssParts: ['nav'],
    example: '<ds-navbar logo-text="MyApp" logo-icon="rocket_launch" version="1.0"><a href="/">Home</a><a href="/about">About</a></ds-navbar>',
  }),
});

registerMCPTool({
  name: 'ds_navbar_read',
  title: 'Read DS Navbars',
  description: 'List all ds-navbar elements on the page with their logoText, logoIcon, version, and mobile menu open state.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const navbars = Array.from(document.querySelectorAll('ds-navbar'));
    return navbars.map((n, i) => ({
      index: i,
      selector: n.id ? `#${n.id}` : `ds-navbar:nth-of-type(${i + 1})`,
      logoText: n.getAttribute('logoText') ?? n.getAttribute('logo-text') ?? '',
      logoIcon: n.getAttribute('logoIcon') ?? n.getAttribute('logo-icon') ?? '',
      version: n.getAttribute('version') ?? '',
      isMenuOpen: n.hasAttribute('isMenuOpen') || n.getAttribute('isMenuOpen') === 'true',
    }));
  },
});

registerMCPTool({
  name: 'ds_navbar_toggle_menu',
  title: 'Toggle DS Navbar Mobile Menu',
  description: 'Open or close the mobile menu sheet of a ds-navbar on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-navbar. Defaults to the first one found.'},
      open: {type: 'boolean', description: 'true to open, false to close. Omit to toggle current state.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try { target = document.querySelector(input['selector']); } catch { /* invalid */ }
    }
    if (!target) target = document.querySelector('ds-navbar');
    if (!target) return {success: false, error: 'No ds-navbar found on the page.'};

    const navbar = target as HTMLElement & {isMenuOpen: boolean};
    const next = typeof input['open'] === 'boolean' ? input['open'] : !navbar.isMenuOpen;
    navbar.isMenuOpen = next;
    return {success: true, isMenuOpen: next};
  },
});
