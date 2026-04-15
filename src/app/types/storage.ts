/**
 * @file: storage.ts
 * @description: storage.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

import type { DatabaseConfig } from "../../database/types";

export type StorageType = "localStorage" | "database";

export interface StorageConfig {
  type: StorageType;
  database?: DatabaseConfig;
  syncInterval: number;
  autoSync: boolean;
  offlineMode: boolean;
  conflictResolution: "local" | "remote" | "merge";
}

export interface StorageStatus {
  connected: boolean;
  syncing: boolean;
  lastSync: number | null;
  pendingChanges: number;
  error?: string;
}

export interface OfflineQueueItem {
  type: string;
  data: unknown;
  timestamp?: number;
}

export interface SyncData {
  models?: unknown[];
  agents?: unknown[];
  nodes?: unknown[];
  [key: string]: unknown;
}

export interface StorageEvent {
  type: "syncStart" | "syncComplete" | "syncError" | "offline" | "online" | "offlineOperationAdded" | "offlineQueueProcessed";
  data?: SyncData | OfflineQueueItem | unknown;
  error?: string;
}
