// WebMCP (Web Model Context Protocol) utility
// W3C Community Group spec: https://webmachinelearning.github.io/webmcp/
// Shipped in Chrome 146+ as an experimental browser-native API that lets websites
// expose structured tools so AI agents know what actions they can perform.

export interface MCPToolDefinition {
  name: string;
  title?: string;
  description: string;
  inputSchema?: object;
  annotations?: {
    readOnlyHint?: boolean;
    untrustedContentHint?: boolean;
  };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
}

declare global {
  interface Navigator {
    modelContext?: {
      registerTool(tool: MCPToolDefinition): void;
    };
  }
}

const _registered = new Set<string>();

class WebMCPWidgetBridge {
  private static instance: WebMCPWidgetBridge;
  private widget: any = null;
  private pendingTools: MCPToolDefinition[] = [];

  static getInstance(): WebMCPWidgetBridge {
    if (!WebMCPWidgetBridge.instance) {
      WebMCPWidgetBridge.instance = new WebMCPWidgetBridge();
    }
    return WebMCPWidgetBridge.instance;
  }

  private constructor() {
    console.log('[WebMCP] Bridge initialized, checking for meta tag...');
    this.ensureWidgetLoaded();
  }

  registerTool(tool: MCPToolDefinition): void {
    console.log(`[WebMCP] Registering tool: ${tool.name}`);
    if (this.widget) {
      this.widget.registerTool(
        tool.name,
        tool.description,
        tool.inputSchema || {},
        tool.execute
      );
    } else {
      console.log(`[WebMCP] Widget not ready, queuing tool: ${tool.name}`);
      this.pendingTools.push(tool);
    }
  }

  private ensureWidgetLoaded(): void {
    if (typeof window === 'undefined') return;

    // 1. Check if already loaded via a manual <script> tag
    if ((window as any).WebMCP) {
      console.log('[WebMCP] WebMCP detected in window. Initializing...');
      this.initWidget();
      return;
    }

    // 2. Fallback: Discovery via meta tag
    const metaTag = document.querySelector('meta[name="webmcp-server"]');
    if (metaTag) {
      const serverUrl = metaTag.getAttribute('content');
      if (serverUrl) {
        console.log(
          `[WebMCP] Meta tag found: ${serverUrl}. Injecting widget...`
        );
        this.injectScript(`${serverUrl}/webmcp.js`);
        return;
      }
    }

    console.log(
      '[WebMCP] No manual script or meta tag found. Bridge waiting...'
    );
  }

  private injectScript(url: string): void {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      console.log('[WebMCP] Widget script loaded successfully.');
      this.initWidget();
    };
    script.onerror = (e) => {
      console.error('[WebMCP] Failed to load widget script from:', url, e);
    };
    document.head.appendChild(script);
  }

  private initWidget() {
    console.log('[WebMCP] Initializing widget instance...');
    if (!(window as any).WebMCP) {
      console.error('[WebMCP] window.WebMCP is still not defined!');
      return;
    }

    // ESBuild with globalName: 'WebMCP' exports an object containing the module's exports.
    // Since we export class WebMCP, it's located at window.WebMCP.WebMCP
    const WebMCPClass = (window as any).WebMCP.WebMCP || (window as any).WebMCP;

    try {
      this.widget = new WebMCPClass();
      console.log('[WebMCP] Widget instance created successfully.');

      // Flush pending tools
      console.log(
        `[WebMCP] Flushing ${this.pendingTools.length} pending tools...`
      );
      for (const tool of this.pendingTools) {
        this.widget.registerTool(
          tool.name,
          tool.description,
          tool.inputSchema || {},
          tool.execute
        );
      }
      this.pendingTools = [];
    } catch (e) {
      console.error('[WebMCP] Failed to initialize WebMCP widget:', e);
    }
  }
}

export function registerMCPTool(tool: MCPToolDefinition): void {
  // ① Existing path: Chrome native navigator.modelContext
  if (!_registered.has(tool.name)) {
    if (typeof navigator !== 'undefined' && navigator.modelContext) {
      try {
        navigator.modelContext.registerTool(tool);
        _registered.add(tool.name);
      } catch {
        // Ignore duplicate-name or other registration errors
      }
    }
  }

  // ② New path: WebMCP Widget relay (works regardless of browser API)
  WebMCPWidgetBridge.getInstance().registerTool(tool);
}

// ─── Global Page Snapshot ────────────────────────────────────────────────────

registerMCPTool({
  name: 'ds_page_snapshot',
  title: 'DS Page Snapshot',
  description: 'Returns a full snapshot of every Portfolio Design System component currently on the page — their element tags, counts, and key attribute values. Use this before making changes to understand the current page layout.',
  annotations: {readOnlyHint: true},
  execute: async () => {
    const q = (sel: string) => Array.from(document.querySelectorAll(sel));
    const attr = (el: Element, ...names: string[]) => {
      for (const n of names) { const v = el.getAttribute(n); if (v !== null) return v; }
      return '';
    };

    return {
      navbar: q('ds-navbar').map((e, i) => ({index: i, logoText: attr(e, 'logoText', 'logo-text'), version: attr(e, 'version'), isMenuOpen: e.hasAttribute('isMenuOpen')})),
      hero: q('ds-hero').map((e, i) => ({index: i, title: attr(e, 'title'), description: attr(e, 'description'), badgeText: attr(e, 'badgeText', 'badge-text')})),
      buttons: q('ds-button').map((e, i) => ({index: i, label: attr(e, 'label') || e.textContent?.trim(), variant: attr(e, 'variant') || 'primary', disabled: e.hasAttribute('disabled')})),
      buttonNatives: q('button[is="ds-button-native"]').map((e, i) => ({index: i, text: e.textContent?.trim(), variant: attr(e, 'variant') || 'primary'})),
      modals: q('ds-modal').map((e, i) => ({index: i, id: e.id || undefined, title: attr(e, 'title'), open: e.hasAttribute('open'), size: attr(e, 'size') || 'md'})),
      sheets: q('ds-sheet').map((e, i) => ({index: i, id: e.id || undefined, title: attr(e, 'title'), open: e.hasAttribute('open'), side: attr(e, 'side') || 'right'})),
      inputs: q('ds-input').map((e, i) => ({index: i, label: attr(e, 'label'), type: attr(e, 'type') || 'text', value: (e as any).value ?? ''})),
      inputNatives: q('input[is="ds-input-native"]').map((e, i) => ({index: i, name: (e as HTMLInputElement).name, type: (e as HTMLInputElement).type, value: (e as HTMLInputElement).value})),
      dropdowns: q('ds-dropdown').map((e, i) => ({index: i, label: attr(e, 'label'), value: (e as any).value ?? ''})  ),
      dropdownNatives: q('select[is="ds-dropdown-native"]').map((e, i) => ({index: i, name: (e as HTMLSelectElement).name, value: (e as HTMLSelectElement).value})),
      cards: q('ds-card').map((e, i) => ({index: i, title: attr(e, 'title'), description: attr(e, 'description')})),
      avatars: q('ds-avatar').map((e, i) => ({index: i, initials: attr(e, 'initials'), size: attr(e, 'size') || 'medium', status: attr(e, 'status') || null})),
      badges: q('ds-badge').map((e, i) => ({index: i, label: attr(e, 'label'), variant: attr(e, 'variant') || 'primary'})),
      tags: q('ds-tag').map((e, i) => ({index: i, label: attr(e, 'label'), variant: attr(e, 'variant') || 'primary'})),
      banners: q('ds-banner').map((e, i) => ({index: i, title: attr(e, 'title'), variant: attr(e, 'variant') || 'info', dismissible: e.hasAttribute('dismissible')})),
      skeletons: q('ds-skeleton').map((e, i) => ({index: i, width: attr(e, 'width') || '100%', height: attr(e, 'height') || '16px'})),
      tooltips: q('ds-tooltip').map((e, i) => ({index: i, content: attr(e, 'content'), position: attr(e, 'position') || 'top'})),
      tableRows: q('ds-table-row').map((e, i) => ({index: i, rowId: attr(e, 'row-id')})),
      tableRowNatives: q('tr[is="ds-table-row-native"]').map((e, i) => ({index: i, rowId: attr(e, 'data-row-id')})),
    };
  },
});
