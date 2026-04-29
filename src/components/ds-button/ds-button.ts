import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { DS_BUTTON_STYLES, ButtonVariant } from './ds-button-base.js';
import { registerMCPTool } from '../../webmcp/index.js';

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

registerMCPTool({
  name: 'ds_button',
  title: 'DS Button',
  description: 'Accessible, form-associated button with four variants (primary/secondary/ghost/danger), optional icon prefix/suffix, tiny size, and full keyboard support. Tag: <ds-button>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-button',
    formAssociated: true,
    properties: [
      {name: 'label', type: 'string', description: 'Button text. Can also use default slot.'},
      {name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: 'primary', reflected: true},
      {name: 'disabled', type: 'boolean', default: false, reflected: true},
      {name: 'tiny', type: 'boolean', default: false, description: 'Smaller compact size.'},
      {name: 'iconPrefix', attribute: 'icon-prefix', type: 'string', description: 'Material Symbol icon name placed before the label.'},
      {name: 'iconSuffix', attribute: 'icon-suffix', type: 'string', description: 'Material Symbol icon name placed after the label.'},
    ],
    slots: [{name: '(default)', description: 'Content inside the button (alternative to label prop).'}],
    cssParts: ['button', 'label', 'icon-prefix', 'icon-suffix'],
    examples: [
      '<ds-button label="Save" variant="primary" icon-suffix="save"></ds-button>',
      '<ds-button label="Cancel" variant="ghost"></ds-button>',
      '<ds-button label="Delete" variant="danger" tiny></ds-button>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_button_click',
  title: 'Click DS Button',
  description: 'Click a ds-button on the page. Identify it by its label text or a CSS selector.',
  inputSchema: {
    type: 'object',
    properties: {
      label: {type: 'string', description: 'The label attribute value of the button to click.'},
      selector: {type: 'string', description: 'CSS selector targeting a specific ds-button element.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    const buttons = Array.from(document.querySelectorAll('ds-button'));
    let target: Element | null = null;

    // Try selector first — only accept if it resolves to a ds-button
    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el?.tagName.toLowerCase() === 'ds-button') target = el;
      } catch {
        // Invalid selector — fall through
      }
    }

    // Fall back to label attribute matching
    if (!target && typeof input['label'] === 'string' && input['label']) {
      target = buttons.find(b => b.getAttribute('label') === input['label']) ?? null;
    }

    if (!target) {
      const available = buttons.map(b => b.getAttribute('label')).filter(Boolean);
      return {success: false, error: 'No matching ds-button found.', availableButtons: available};
    }
    if (target.hasAttribute('disabled')) return {success: false, error: 'Button is disabled.'};
    (target as HTMLElement).click();
    return {success: true, clicked: target.getAttribute('label') ?? target.textContent?.trim()};
  },
});
