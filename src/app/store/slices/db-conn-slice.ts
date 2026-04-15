/**
 * @file: db-conn-slice.ts
 * @description: db-conn-slice.ts description
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-15
 * @updated: 2026-04-15
 * @status: active
 * @tags: [type]
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DBConnection } from '../../types';
import { bridgeConnectionsToGlobal } from '../../stores/global-store';

const DEFAULT_CONNECTIONS: DBConnection[] = [
  {
    id: "db-pg-main",
    name: "主数据库 (PostgreSQL)",
    type: "postgresql",
    host: "localhost",
    port: 5433,
    database: "yyc3_matrix",
    username: "admin",
    password: "",
    status: "disconnected",
    options: "sslmode=disable",
  },
];

export interface DbConnSlice {
  connections: DBConnection[];
  addConnection: (conn: Omit<DBConnection, 'id'>) => void;
  updateConnection: (id: string, updates: Partial<DBConnection>) => void;
  removeConnection: (id: string) => void;
  setConnectionStatus: (id: string, status: DBConnection['status']) => void;
}

/** 将当前连接状态同步到 GlobalStore (SSOT 桥接) */
function syncToGlobal(connections: DBConnection[]) {
  try { bridgeConnectionsToGlobal(connections); } catch { /* ignore */ }
}

export const useDbConnSlice = create<DbConnSlice>()(
  persist(
    (set) => ({
      connections: DEFAULT_CONNECTIONS,
      addConnection: (conn) => set((s) => {
        const connections = [...s.connections, { ...conn, id: `db-${Date.now()}` }];
        syncToGlobal(connections);
        return { connections };
      }),
      updateConnection: (id, updates) => set((s) => {
        const connections = s.connections.map((c) => c.id === id ? { ...c, ...updates } : c);
        syncToGlobal(connections);
        return { connections };
      }),
      removeConnection: (id) => set((s) => {
        const connections = s.connections.filter((c) => c.id !== id);
        syncToGlobal(connections);
        return { connections };
      }),
      setConnectionStatus: (id, status) => set((s) => {
        const connections = s.connections.map((c) => c.id === id ? { ...c, status } : c);
        syncToGlobal(connections);
        return { connections };
      }),
    }),
    {
      name: 'yyc3-db-conn-slice',
      partialize: (state) => ({
        connections: state.connections.map(({ password: _password, ...rest }) => rest),
      }),
    }
  )
);
