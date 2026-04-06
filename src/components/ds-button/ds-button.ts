import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_BUTTON_STYLES, ButtonVariant } from './ds-button-base.js';

@customElement('ds-button')
export class DsButton extends LitElement {
  // Mark as form-associated so it participates in forms
  static readonly formAssociated = true;
  static override styles = DS_BUTTON_STYLES;

  // ElementInternals for ARIA delegation and form association
  private _internals: ElementInternals;

  constructor() {
    super();
    this._internals = this.attachInternals();
    // Tell screen readers this is a button even though it's a custom element
    this._internals.role = 'button';
  }

  @property() label = '';
  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) tiny = false;
  @property({ attribute: 'icon-prefix' }) iconPrefix = '';
  @property({ attribute: 'icon-suffix' }) iconSuffix = '';

  override connectedCallback() {
    super.connectedCallback();
    // Keyboard support — custom elements don't get this automatically
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    this.addEventListener('keydown', this._handleKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._handleKeydown);
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.shadowRoot?.querySelector('button')?.click();
    }
  };

  // Sync disabled state to internals for form
  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('disabled')) {
      this._internals.ariaDisabled = String(this.disabled);
    }
  }

  override render() {
    return html`
      <button
        class="${this.variant}${this.tiny ? ' tiny' : ''}"
        ?disabled=${this.disabled}
        aria-label=${this.label || undefined}
        part="button"
        tabindex="-1"
      >
        ${this.iconPrefix
          ? html`<i class="icon-element" part="icon-prefix" aria-hidden="true">${this.iconPrefix}</i>`
          : ''}
        ${this.label ? html`<span part="label">${this.label}</span>` : ''}
        <slot></slot>
        ${this.iconSuffix
          ? html`<i class="icon-element" part="icon-suffix" aria-hidden="true">${this.iconSuffix}</i>`
          : ''}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
