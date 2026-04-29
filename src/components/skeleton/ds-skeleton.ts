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
