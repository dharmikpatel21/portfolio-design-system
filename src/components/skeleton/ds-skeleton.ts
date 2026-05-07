import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {registerMCPTool} from '../../webmcp/index.js';

/**
 * DsSkeleton component
 * Part of the Portfolio Design System
 */
@customElement('ds-skeleton')
export class DsSkeleton extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .skeleton {
      background-color: var(--ds-bg-app, #f1f5f9);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .skeleton::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        var(--ds-button-ghost-hover, rgba(255, 255, 255, 0.05)) 20%,
        var(--ds-button-ghost-hover, rgba(255, 255, 255, 0.1)) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 2s infinite;
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `;

  @property()
  width = '100%';

  @property()
  height = '16px';

  @property()
  borderRadius = '8px';

  @property({type: Boolean})
  pulse = true;

  override render() {
    return html`
      <div 
        class="skeleton ${this.pulse ? 'animate-pulse' : ''}" 
        style="width: ${this.width}; height: ${this.height}; border-radius: ${this.borderRadius}"
        part="skeleton"
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-skeleton': DsSkeleton;
  }
}

registerMCPTool({
  name: 'ds_skeleton',
  title: 'DS Skeleton',
  description: 'Animated loading placeholder with shimmer sweep effect. Configurable dimensions and border-radius. Use pulse=false to switch from shimmer to a simple pulse animation. Tag: <ds-skeleton>.',
  annotations: {readOnlyHint: true},
  execute: async () => ({
    tag: 'ds-skeleton',
    properties: [
      {name: 'width', type: 'string', default: '100%', description: 'CSS width value (e.g. "200px", "100%").'},
      {name: 'height', type: 'string', default: '16px', description: 'CSS height value (e.g. "16px", "1rem").'},
      {name: 'borderRadius', type: 'string', default: '8px', description: 'CSS border-radius value.'},
      {name: 'pulse', type: 'boolean', default: true, description: 'When true uses shimmer + pulse animation. Set false for shimmer only.'},
    ],
    cssParts: ['skeleton'],
    examples: [
      '<ds-skeleton width="100%" height="20px"></ds-skeleton>',
      '<ds-skeleton width="48px" height="48px" border-radius="50%"></ds-skeleton>',
    ],
  }),
});

registerMCPTool({
  name: 'ds_skeleton_read',
  title: 'Read DS Skeletons',
  description: 'List all ds-skeleton elements on the page with their width, height, borderRadius, and pulse state.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const skeletons = Array.from(document.querySelectorAll('ds-skeleton'));
    return skeletons.map((s, i) => ({
      index: i,
      selector: s.id ? `#${s.id}` : `ds-skeleton:nth-of-type(${i + 1})`,
      width: s.getAttribute('width') ?? '100%',
      height: s.getAttribute('height') ?? '16px',
      borderRadius: s.getAttribute('borderRadius') ?? s.getAttribute('border-radius') ?? '8px',
      pulse: !s.hasAttribute('pulse') || s.getAttribute('pulse') !== 'false',
    }));
  },
});

registerMCPTool({
  name: 'ds_skeleton_add',
  title: 'Add DS Skeleton',
  description: 'Inject a new ds-skeleton loading placeholder into a target container on the page.',
  inputSchema: {
    type: 'object',
    required: ['targetSelector'],
    properties: {
      targetSelector: {type: 'string', description: 'CSS selector for the container element to append the skeleton into.'},
      width: {type: 'string', description: 'CSS width (e.g. "100%", "200px"). Defaults to "100%".'},
      height: {type: 'string', description: 'CSS height (e.g. "20px", "1rem"). Defaults to "16px".'},
      borderRadius: {type: 'string', description: 'CSS border-radius. Defaults to "8px". Use "50%" for circular.'},
      pulse: {type: 'boolean', description: 'Enable shimmer animation. Defaults to true.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    if (typeof input['targetSelector'] !== 'string') return {success: false, error: 'targetSelector is required.'};
    const container = document.querySelector(input['targetSelector']);
    if (!container) return {success: false, error: `No element found for selector: ${input['targetSelector']}`};

    const skeleton = document.createElement('ds-skeleton');
    if (typeof input['width'] === 'string') skeleton.setAttribute('width', input['width']);
    if (typeof input['height'] === 'string') skeleton.setAttribute('height', input['height']);
    if (typeof input['borderRadius'] === 'string') skeleton.setAttribute('border-radius', input['borderRadius']);
    if (input['pulse'] === false) skeleton.setAttribute('pulse', 'false');
    container.appendChild(skeleton);
    return {success: true};
  },
});

registerMCPTool({
  name: 'ds_skeleton_remove_all',
  title: 'Remove All DS Skeletons',
  description: 'Remove all ds-skeleton elements from the page (useful when loading is complete).',
  inputSchema: {
    type: 'object',
    properties: {
      selector: {type: 'string', description: 'Optional scope selector to only remove skeletons inside a specific container.'},
    },
  },
  execute: async (input: Record<string, unknown>) => {
    let scope: Element | Document = document;
    if (typeof input['selector'] === 'string' && input['selector']) {
      try {
        const el = document.querySelector(input['selector']);
        if (el) scope = el;
      } catch { /* invalid selector */ }
    }
    const skeletons = Array.from(scope.querySelectorAll('ds-skeleton'));
    skeletons.forEach(s => s.remove());
    return {success: true, removed: skeletons.length};
  },
});
