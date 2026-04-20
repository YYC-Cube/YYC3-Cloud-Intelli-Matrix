/**
 * @file: API-REFERENCE.ts
 * @description: YYC3 Core Library API Reference — navigable in-code documentation
 * @author: YanYuCloudCube Team
 * @version: v1.1.0
 * @created: 2026-04-08
 * @updated: 2026-04-19
 * @status: active
 * @tags: [docs]
 */

// ═══════════════════════════════════════════════════════════════
//  1. env-config — Type-Safe Environment Configuration
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/env-config.ts
// Priority: import.meta.env (VITE_YYC3_*) > localStorage > DEFAULTS

/**
 * Retrieve a single typed config value by key.
 *
 * @template K - Key of {@link EnvConfig}
 * @param key - The config key (e.g. "API_BASE_URL", "ENABLE_MOCK_MODE")
 * @returns The resolved value with correct type
 *
 * @example
 * ```ts
 * import { env } from "@/app/lib/env-config";
 * const apiUrl: string = env("API_BASE_URL");       // "http://localhost:3113/api"
 * const mock: boolean = env("ENABLE_MOCK_MODE");     // true
 * ```
 *
 * export function env<K extends keyof EnvConfig>(key: K): EnvConfig[K]
 */

/**
 * Return a frozen shallow copy of the full config object.
 *
 * export function getEnvConfig(): Readonly<EnvConfig>
 */

/**
 * Merge partial updates into the running config and persist to localStorage.
 *
 * export function setEnvConfig(updates: Partial<EnvConfig>): EnvConfig
 */

/**
 * Remove stored overrides; next call resolves from env + defaults only.
 *
 * export function resetEnvConfig(): EnvConfig
 */

/**
 * Serialize the full config to a tagged JSON string for export.
 *
 * export function exportEnvConfig(): string
 */

/**
 * Parse a previously exported JSON blob and apply it via setEnvConfig.
 *
 * export function importEnvConfig(json: string): boolean
 */

/**
 * Full config shape. 40+ keys covering system identity, network endpoints,
 * AI defaults, security, feature flags, DB pool, SQL safety, and WebGPU inference.
 *
 * interface EnvConfig {
 *   SYSTEM_NAME: string;               // "YYC3 Cloud Intelli-Matrix"
 *   SYSTEM_VERSION: string;            // "3.3.0"
 *   API_BASE_URL: string;              // "http://localhost:3113/api"
 *   WS_ENDPOINT: string;               // "ws://localhost:3113/ws"
 *   OLLAMA_BASE_URL: string;           // "http://localhost:11434"
 *   STORAGE_PREFIX: string;            // "yyc3_"
 *   IDB_NAME: string;                  // "yyc3_matrix"
 *   IDB_VERSION: number;               // 3
 *   DEFAULT_AI_MODEL: string;          // "codegeex4:latest"
 *   DEFAULT_AI_TEMPERATURE: number;    // 0.7
 *   SESSION_TIMEOUT_MIN: number;       // 30
 *   ENABLE_MOCK_MODE: boolean;         // true
 *   ENABLE_DEBUG: boolean;             // false
 *   ENABLE_PWA: boolean;               // true
 *   INFERENCE_DEFAULT_BACKEND: "ollama" | "webgpu";
 *   ... (see source for complete list)
 * }
 */

// ═══════════════════════════════════════════════════════════════
//  2. network-utils — Network Configuration & Connectivity
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/network-utils.ts

/**
 * Default server: localhost:3113, ws://localhost:3113/ws, mode: "auto".
 *
 * export const DEFAULT_NETWORK_CONFIG: NetworkConfig
 */

/**
 * Load saved network config from localStorage, falling back to defaults.
 *
 * export function loadNetworkConfig(): NetworkConfig
 */

/**
 * Persist a NetworkConfig to localStorage.
 *
 * export function saveNetworkConfig(config: NetworkConfig): void
 */

/**
 * Remove stored config and return a fresh copy of defaults.
 *
 * export function resetNetworkConfig(): NetworkConfig
 */

/**
 * Derive a WebSocket URL from host and port.
 *
 * export function generateWsUrl(address: string, port: string): string
 */

/**
 * Resolve the local machine IP via WebRTC ICE candidates (browser only).
 * Falls back to "127.0.0.1".
 *
 * export async function getLocalIP(): Promise<string>
 */

/**
 * Detect active network interfaces. Returns at least one entry
 * (WiFi or wired) plus loopback when a non-loopback IP is found.
 *
 * export async function getNetworkInterfaces(): Promise<NetworkInterface[]>
 */

/**
 * Open a short-lived WebSocket to test connectivity.
 *
 * export function testWebSocketConnection(
 *   url: string,
 *   timeoutMs?: number  // default 5000
 * ): Promise<ConnectionTestResult>
 */

/**
 * Send a HEAD request with AbortController timeout to test HTTP reachability.
 *
 * export async function testHTTPConnection(
 *   url: string,
 *   timeoutMs?: number  // default 5000
 * ): Promise<ConnectionTestResult>
 */

// ═══════════════════════════════════════════════════════════════
//  3. data-bus — Event Hub & Smart Merge + WebSocket Sync
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/data-bus.ts
// Exported singleton: `dataBus`
// Convenience wrappers: mergeNodes(), editNode(), connectDataSync(), disconnectDataSync()

/**
 * Subscribe to entity change events. Returns an unsubscribe function.
 *
 * dataBus.subscribe(entity: string, listener: DataChangeListener): () => void
 */

/**
 * Emit a typed change event to all subscribers of `event.entity`.
 *
 * dataBus.publish<T>(event: DataChangeEvent<T>): void
 */

/**
 * Smart-merge node arrays using a chosen strategy.
 * Strategies: "ws_priority" | "user_priority" | "timestamp_win" | "shallow_replace".
 *
 * dataBus.mergeNodeData(
 *   currentNodes: NodeData[],
 *   incomingNodes: NodeData[],
 *   source?: DataSource,           // default "websocket"
 *   strategy?: MergeStrategy       // default "ws_priority"
 * ): NodeData[]
 */

/**
 * Apply user edits to a specific node and track which fields were user-touched.
 *
 * dataBus.updateUserEditNode(
 *   currentNodes: NodeData[],
 *   nodeId: string,
 *   updates: Partial<NodeData>
 * ): NodeData[]
 */

/**
 * Reset user-edit tracking for a node (optionally only specific fields).
 *
 * dataBus.clearUserEdits(nodeId: string, fields?: string[]): void
 */

/**
 * Bulk replace the entire node array (used during initialization).
 *
 * dataBus.replaceNodes(nodes: NodeData[], source?: DataSource): NodeData[]
 */

/**
 * Generic merge for any { id: string }[] entity.
 *
 * dataBus.mergeArrayData<T extends { id: string }>(
 *   current: T[], incoming: T[], entity: string, source?: DataSource
 * ): T[]
 */

/**
 * Connect to the backend WebSocket with auto-reconnect, heartbeat, and offline queue.
 *
 * dataBus.connectWS(config: WSSyncConfig): Promise<boolean>
 */

/**
 * Gracefully close the WebSocket connection.
 *
 * dataBus.disconnectWS(): void
 */

/**
 * Send a typed WS message. Queues offline if no connection.
 *
 * dataBus.sendWS(message: Omit<WSMessage, "timestamp" | "id">): boolean
 */

/**
 * Bridge: inject an external WS sender (set by useWebSocketData).
 *
 * dataBus.registerWSSender(sender: (msg) => boolean): void
 * dataBus.unregisterWSSender(): void
 */

/**
 * Bridge: push an incoming WS message into the DataBus pipeline.
 *
 * dataBus.ingestWSMessage(message: Record<string, unknown>): void
 */

/**
 * Query APIs — getEventHistory, getEntityHistory, getUserEditedFields,
 * getAllUserEditedNodeIds, getMergeLog, getOfflineQueueSize.
 */

// ═══════════════════════════════════════════════════════════════
//  4. yyc3-storage — Unified Dual-Layer Storage
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/yyc3-storage.ts
// Strategy: localStorage (< 5 KB config) + IndexedDB (large data) + BroadcastChannel sync

/**
 * Canonical list of all 22 IndexedDB object store names.
 *
 * export const ALL_STORES: StoreName[]
 *   "alertRules" | "alertEvents" | "patrolHistory" | "loopHistory" |
 *   "operationTemplates" | "operationLogs" | "diagnosisHistory" | "reports" |
 *   "errorLog" | "dashboardSnapshots" | "fileVersions" | "dbConnections" |
 *   "queryHistory" | "committedChanges" | "agent_memories" | "agent_tasks" |
 *   "mcp_contexts" | "inference_cache" | "family_messages" |
 *   "family_activities" | "family_memories" | "family_broadcasts"
 */

/**
 * Write a single record (upsert by id).
 *
 * export async function idbPut<T extends { id: string }>(store: StoreName, item: T): Promise<void>
 */

/**
 * Batch-write multiple records in a single transaction.
 *
 * export async function idbPutMany<T extends { id: string }>(store: StoreName, items: T[]): Promise<void>
 */

/**
 * Read one record by id. Returns undefined if not found.
 *
 * export async function idbGet<T>(store: StoreName, id: string): Promise<T | undefined>
 */

/**
 * Return all records from a store.
 *
 * export async function idbGetAll<T>(store: StoreName): Promise<T[]>
 */

/**
 * Delete a single record by id.
 *
 * export async function idbDelete(store: StoreName, id: string): Promise<void>
 */

/**
 * Wipe all records in a store.
 *
 * export async function idbClear(store: StoreName): Promise<void>
 */

/**
 * Count records in a store.
 *
 * export async function idbCount(store: StoreName): Promise<number>
 */

/**
 * Listen for cross-tab storage changes via BroadcastChannel.
 *
 * export function onStorageChange(listener: (event: StorageChangeEvent) => void): () => void
 */

/**
 * Export every IndexedDB store as a Record<StoreName, unknown[]> JSON blob.
 *
 * export async function exportAllData(): Promise<Record<StoreName, unknown[]>>
 */

/**
 * Import a previously exported data blob.
 *
 * export async function importAllData(
 *   data: Partial<Record<StoreName, { id: string }[]>>
 * ): Promise<{ imported: number; stores: string[] }>
 */

/**
 * Per-store record counts and grand total.
 *
 * export async function getStorageStats(): Promise<{
 *   stores: { name: StoreName; count: number }[];
 *   totalRecords: number;
 * }>
 */

/**
 * Complete registry of all localStorage keys used by YYC3.
 *
 * export const LOCALSTORAGE_KEYS: { [category: string]: string }
 */

/**
 * Wipe every yyc3-prefixed key from localStorage.
 *
 * export function clearAllLocalStorage(): void
 */

/**
 * Full reset: clear localStorage + wipe every IndexedDB store.
 *
 * export async function clearAllStorage(): Promise<void>
 */

// ═══════════════════════════════════════════════════════════════
//  5. xss-protection — Input Sanitization & Safe DOM Helpers
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/xss-protection.ts
// Singleton: `xssProtection` (XSSProtection.getInstance())

/**
 * Initialize the DOMPurify sanitizer (lazy-loaded).
 *
 * xssProtection.initialize(): Promise<void>
 */

/**
 * Sanitize HTML, keeping only safe tags (b, i, em, strong, a, p, br, span)
 * and safe attributes (href, target, rel, class).
 * Falls back to entity-encoding when DOMPurify is unavailable.
 *
 * xssProtection.sanitize(input: string): string
 */

/**
 * Encode all HTML-special characters (<, >, &, ", ', /, `, =) to entities.
 *
 * xssProtection.escapeHtml(input: string): string
 */

/**
 * Escape a string for safe embedding inside JS string literals.
 *
 * xssProtection.escapeJsString(input: string): string
 */

/**
 * Hex-encode non-word characters for safe CSS insertion.
 *
 * xssProtection.escapeCss(input: string): string
 */

/**
 * Validate a URL; only http:, https:, mailto:, tel: protocols pass.
 * Returns empty string for dangerous schemes.
 *
 * xssProtection.escapeUrl(input: string): string
 */

/**
 * Validate and sanitize a free-text input with configurable constraints.
 *
 * xssProtection.validateInput(input: string, options?: {
 *   maxLength?: number;        // default 1000
 *   allowedChars?: RegExp;     // default: Unicode letters, numbers, spaces, basic punctuation
 *   pattern?: RegExp;
 * }): { valid: boolean; sanitized: string; error?: string }
 */

/**
 * Create a DOM element with escaped textContent and attribute safety checks.
 *
 * xssProtection.createSafeElement(
 *   tagName: string, textContent: string, attributes?: Record<string, string>
 * ): HTMLElement
 */

/**
 * Set innerHTML safely via DOMPurify, or fall back to textContent.
 *
 * xssProtection.setSafeInnerHTML(element: Element, html: string): void
 */

// ═══════════════════════════════════════════════════════════════
//  6. crypto-vault — AES-256-GCM Local Encryption
// ═══════════════════════════════════════════════════════════════
// Source: src/app/lib/crypto-vault.ts
// Security model: key derived from device fingerprint + app salt per session.
// Same device + same browser can decrypt; cross-device migration requires re-encryption.

/**
 * Encrypt plaintext using AES-256-GCM. Output is Base64 (iv[12 bytes] + ciphertext).
 *
 * export async function encrypt(plaintext: string): Promise<string>
 */

/**
 * Decrypt a Base64 ciphertext produced by encrypt().
 *
 * export async function decrypt(encoded: string): Promise<string>
 */

/**
 * Check whether the Web Crypto API is available in this environment.
 *
 * export function isCryptoAvailable(): boolean
 */

/**
 * Convenience wrapper: encrypt + store to localStorage under `vault:${key}` prefix.
 * Falls back to plain storage if encryption fails.
 *
 * export const secureStorage: {
 *   setItem(key: string, value: string): Promise<void>;
 *   getItem(key: string): Promise<string | null>;
 *   removeItem(key: string): void;
 * }
 */

// This file is navigable documentation only — no runtime exports.
export {};
