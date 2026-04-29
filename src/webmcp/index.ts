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

export function registerMCPTool(tool: MCPToolDefinition): void {
  if (_registered.has(tool.name)) return;
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    try {
      navigator.modelContext.registerTool(tool);
      _registered.add(tool.name);
    } catch {
      // Ignore duplicate-name or other registration errors
    }
  }
}
