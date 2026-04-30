/**
 * @file MCP 客户端入口
 * @description 导出 MCP 客户端和传输层实现
 * @module @family-pai/core/mcp
 * @author YYC
 */

export { MCPClient } from './client.js'
export { StdioTransport, HTTPTransport } from './transport.js'
export type { MCPTransport, MCPMessage, MCPTool, MCPResource } from './types.js'
