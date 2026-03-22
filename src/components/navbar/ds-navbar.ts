import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

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
    }

    .logo-icon {
      font-family: 'Material Symbols Outlined';
      font-size: 30px;
      color: var(--ds-color-primary, #135bec);
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

  @property()
  version = 'v1.0';

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
            <span class="logo-icon">${this.logoIcon}</span>
            <span class="logo-text">${this.logoText} <span class="logo-version">${this.version}</span></span>
          </a>
          
          <div class="nav-links">
            <slot></slot>
          </div>

          <button class="menu-button" @click="${this._toggleMenu}">
            menu
          </button>
        </div>
      </nav>

      <ds-sheet 
        title="Navigation" 
        side="right" 
        .open="${this.isMenuOpen}"
        @close="${this._closeMenu}"
      >
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
