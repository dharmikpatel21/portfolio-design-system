import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsAvatar component
 * Part of the Portfolio Design System
 */
@customElement('ds-avatar')
export class DsAvatar extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      vertical-align: middle;
    }

    .avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: visible;
      background-color: var(--ds-button-secondary-bg, #f1f5f9);
      color: var(--ds-text-muted, #64748b);
      font-family: var(--ds-font-family-sans, 'Space Grotesk', sans-serif);
      font-weight: 700;
      transition: all 0.2s ease-in-out;
    }

    .avatar.small { width: 32px; height: 32px; font-size: 12px; }
    .avatar.medium { width: 48px; height: 48px; font-size: 16px; }
    .avatar.large { width: 64px; height: 64px; font-size: 20px; }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }

    .status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 25%;
      height: 25%;
      min-width: 8px;
      min-height: 8px;
      border-radius: 50%;
      border: 2px solid var(--ds-bg-surface, #ffffff);
    }

    .status.online { background-color: #22c55e; }
    .status.away { background-color: #f59e0b; }
    .status.offline { background-color: #94a3b8; }
  `;

  @property()
  src = '';

  @property()
  alt = '';

  @property()
  initials = '';

  @property()
  size: 'small' | 'medium' | 'large' = 'medium';

  @property()
  status?: 'online' | 'away' | 'offline';

  override render() {
    return html`
      <div class="avatar ${this.size}" part="avatar">
        ${this.src 
          ? html`<img src="${this.src}" alt="${this.alt || this.initials}" />`
          : html`<span>${this.initials}</span>`
        }
        ${this.status ? html`<div class="status ${this.status}" part="status"></div>` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-avatar': DsAvatar;
  }
}

registerMCPTool({
  name: 'ds_avatar',
  title: 'DS Avatar',
  description: 'Circular avatar component. Shows an image or falls back to initials text. Optional colored status dot (online/away/offline). Tag: <ds-avatar>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-avatar',
    properties: [
      {name: 'src', type: 'string', description: 'Image URL. If empty, shows initials.'},
      {name: 'alt', type: 'string', description: 'Alt text for the image.'},
      {name: 'initials', type: 'string', description: 'Text shown when no src (e.g. "JD").'},
      {name: 'size', type: "'small' | 'medium' | 'large'", default: 'medium', description: '32px / 48px / 64px.'},
      {name: 'status', type: "'online' | 'away' | 'offline' | undefined", description: 'Colored status dot. Omit to hide.'},
    ],
    cssParts: ['avatar', 'status'],
    examples: [
      '<ds-avatar src="/photo.jpg" alt="Jane Doe" size="medium" status="online"></ds-avatar>',
      '<ds-avatar initials="JD" size="large" status="away"></ds-avatar>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_avatar_read',
  title: 'Read DS Avatars',
  description: 'List all ds-avatar elements on the page with their current initials, src, size, status, and selector.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const avatars = Array.from(document.querySelectorAll('ds-avatar'));
    return avatars.map((a, i) => ({
      index: i,
      selector: a.id ? `#${a.id}` : `ds-avatar:nth-of-type(${i + 1})`,
      initials: a.getAttribute('initials') ?? '',
      src: a.getAttribute('src') ?? '',
      alt: a.getAttribute('alt') ?? '',
      size: a.getAttribute('size') ?? 'medium',
      status: a.getAttribute('status') ?? null,
    }));
  },
});

registerMCPTool({
  name: 'ds_avatar_update',
  title: 'Update DS Avatar',
  description: 'Update properties (initials, src, size, status) of a ds-avatar element on the page.',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'CSS selector targeting the ds-avatar. Defaults to the first one found.'},
      initials: {type: 'string', description: 'New initials text (e.g. "JD").'},
      src: {type: 'string', description: 'New image URL. Set to empty string to clear.'},
      alt: {type: 'string', description: 'New alt text for the image.'},
      size: {type: 'string', enum: ['small', 'medium', 'large'], description: 'New size.'},
      status: {type: 'string', enum: ['online', 'away', 'offline', 'none'], description: 'New status dot color. Pass "none" to remove the dot.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let target: Element | null = null;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try { target = document.querySelector(input['selector']); } catch { /* invalid */ }
    }
    if (!target) target = document.querySelector('ds-avatar');
    if (!target) return {success: false, error: 'No ds-avatar found on the page.'};

    const props: Record<string, string | null> = {
      initials: typeof input['initials'] === 'string' ? input['initials'] : null,
      src: typeof input['src'] === 'string' ? input['src'] : null,
      alt: typeof input['alt'] === 'string' ? input['alt'] : null,
      size: typeof input['size'] === 'string' ? input['size'] : null,
      status: typeof input['status'] === 'string' ? (input['status'] || null) : null,
    };

    for (const [key, val] of Object.entries(props)) {
      if (val !== null) {
        if (val === 'none' && key === 'status') target.removeAttribute(key);
        else (target as any)[key] = val;
      }
    }
    return {success: true};
  },
});
