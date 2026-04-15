/**
 * @file: useWebSocketData.ts
 * @description: WebSocket 实时数据推送 Hook · 管理连接、消息路由、断线降级
 * @author: YanYuCloudCube Team
 * @version: v2.0.0
 * @created: 2026-02-26
 * @updated: 2026-04-15
 * @status: active
 * @tags: [hook],[websocket],[realtime]
 *
 * @brief: WebSocket 实时数据推送管理（已接入 DataBus 统一数据层）
 *
 * @details:
 * - WebSocket 连接管理（生命周期、自动重连、心跳）
 * - 消息类型路由（qps_update / latency_update / node_status / alert）
 * - ★ 节点数据通过 DataBus.mergeNodeData() 合并后写入 useNodeSlice
 * - ★ 用户编辑的字段在 WS 推送时不会被覆盖（smartMerge 策略）
 * - 断线降级：自动切换本地模拟数据
 *
 * @dependencies: React, WebSocket API, DataBus, useNodeSlice
 * @exports: useWebSocketData, WebSocketContext
 */

import { useState, useEffect, useRef, useCallback } from "react";

import type {
  ConnectionState,
  NodeData,
  AlertData,
  ThroughputPoint,
  WSMessage,
  WebSocketDataState,
} from "../types";

import { getAPIConfig } from "../lib/api-config";
import { useNodeSlice } from "../store/slices/node-slice";
import { dataBus } from "../lib/data-bus";

// ============================================================
// Simulated Data Generator — 从 useNodeSlice 读取初始数据
// ============================================================

function jitter(base: number, range: number): number {
  return Math.max(0, base + (Math.random() - 0.5) * range * 2);
}

function generateSimulatedNodes(baseNodes: NodeData[]): NodeData[] {
  return baseNodes.map((n) => ({
    ...n,
    gpu: n.status === "inactive" ? 0 : Math.min(100, Math.round(jitter(n.gpu, 5))),
    mem: n.status === "inactive" ? n.mem : Math.min(100, Math.round(jitter(n.mem, 3))),
    temp: n.status === "inactive" ? n.temp : Math.round(jitter(n.temp, 2)),
    tasks: n.status === "inactive" ? 0 : Math.max(0, Math.round(jitter(n.tasks, 10))),
  }));
}

let throughputCounter = 0;

function generateThroughputPoint(): ThroughputPoint {
  const now = new Date();
  const hms = now.toLocaleTimeString("zh-CN", { hour12: false });
  throughputCounter += 1;
  return {
    time: `${hms}.${String(throughputCounter % 1000).padStart(3, "0")}`,
    qps: Math.round(jitter(3800, 400)),
    latency: Math.round(jitter(48, 8)),
    tokens: Math.round(jitter(138000, 15000)),
  };
}

// ============================================================
// Hook
// ============================================================

const MAX_THROUGHPUT_HISTORY = 60;
const SIMULATE_INTERVAL_MS = 2000;
const RECONNECT_DELAY_MS = 5000;

export function useWebSocketData(): WebSocketDataState {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [reconnectCount, setReconnectCount] = useState(0);
  const [liveQPS, setLiveQPS] = useState(3842);
  const [qpsTrend, setQpsTrend] = useState("+12.3%");
  const [liveLatency, setLiveLatency] = useState(48);
  const [latencyTrend, setLatencyTrend] = useState("-5.2%");
  const [activeNodes, setActiveNodes] = useState("7/8");
  const [gpuUtil, setGpuUtil] = useState("82.4%");
  const [tokenThroughput, setTokenThroughput] = useState("138K/s");
  const [storageUsed] = useState("12.8TB");
  const [throughputHistory, setThroughputHistory] = useState<ThroughputPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState(
    new Date().toLocaleString("zh-CN", { hour12: false })
  );

  // ★ 核心：接入统一节点 Store — 节点数据从此处获取
  const { nodes: sliceNodes, mergeFromWS } = useNodeSlice();

  const wsRef = useRef<WebSocket | null>(null);
  const simulateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectWSRef = useRef<(() => void) | null>(null);

  // ----- simulated data updater -----
  const runSimulation = useCallback(() => {
    const baseNodes = useNodeSlice.getState().nodes;
    const newNodes = generateSimulatedNodes(baseNodes);

    // ★ 关键改动：模拟数据也通过 DataBus 合并，保留用户编辑
    mergeFromWS(newNodes);

    const active = newNodes.filter((n) => n.status !== "inactive");
    setActiveNodes(`${active.length}/${newNodes.length}`);

    const avgGpu = active.reduce((s, n) => s + n.gpu, 0) / (active.length || 1);
    setGpuUtil(`${avgGpu.toFixed(1)}%`);

    const newQps = Math.round(jitter(3800, 400));
    setLiveQPS(newQps);
    setQpsTrend(newQps > 3800 ? `+${((newQps / 3800 - 1) * 100).toFixed(1)}%` : `-${((1 - newQps / 3800) * 100).toFixed(1)}%`);

    const newLatency = Math.round(jitter(48, 8));
    setLiveLatency(newLatency);
    setLatencyTrend(newLatency < 48 ? `-${((1 - newLatency / 48) * 100).toFixed(1)}%` : `+${((newLatency / 48 - 1) * 100).toFixed(1)}%`);

    const tp = Math.round(jitter(138, 15));
    setTokenThroughput(`${tp}K/s`);

    const point = generateThroughputPoint();
    setThroughputHistory((prev) => {
      const next = [...prev, point];
      return next.length > MAX_THROUGHPUT_HISTORY ? next.slice(-MAX_THROUGHPUT_HISTORY) : next;
    });

    setLastSyncTime(new Date().toLocaleString("zh-CN", { hour12: false }));
  }, [mergeFromWS]);

  // ----- WebSocket connection -----
  const connectWS = useCallback(() => {
    const wsUrl = getAPIConfig().wsEndpoint;
    setConnectionState("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState("connected");
        setReconnectCount(0);
        dataBus.registerWSSender((msg) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
            return true;
          }
          return false;
        });
        if (simulateTimerRef.current) {
          clearInterval(simulateTimerRef.current);
          simulateTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);
          dataBus.ingestWSMessage(msg);
          switch (msg.type) {
            case "qps_update":
              setLiveQPS(msg.payload.qps);
              setQpsTrend(msg.payload.trend);
              break;
            case "latency_update":
              setLiveLatency(msg.payload.latency);
              setLatencyTrend(msg.payload.trend);
              break;

            // ★★★ 核心修复：节点数据走 DataBus 合并而非直接覆盖 ★★★
            case "node_status":
              mergeFromWS(msg.payload as NodeData[]);
              break;

            case "alert":
              setAlerts((prev) => [msg.payload, ...prev].slice(0, 100));
              break;
            case "throughput_history":
              setThroughputHistory(msg.payload.slice(-MAX_THROUGHPUT_HISTORY));
              break;
            case "system_stats":
              setActiveNodes(msg.payload.activeNodes);
              setGpuUtil(msg.payload.gpuUtil);
              setTokenThroughput(msg.payload.tokenThroughput);
              break;
            case "heartbeat_ack":
              break;
          }
          setLastSyncTime(new Date().toLocaleString("zh-CN", { hour12: false }));
        } catch {
          // silently ignore parse errors for non-critical messages
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        dataBus.unregisterWSSender();
        setConnectionState("simulated");
        if (!simulateTimerRef.current) {
          simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
        }
        reconnectTimerRef.current = setTimeout(() => {
          setReconnectCount((c) => c + 1);
          connectWSRef.current?.();
        }, RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      setConnectionState("simulated");
      if (!simulateTimerRef.current) {
        simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
      }
    }
  }, [runSimulation, mergeFromWS]);

  useEffect(() => {
    connectWSRef.current = connectWS;
  }, [connectWS]);

  // ----- lifecycle -----
  useEffect(() => {
    const timer = setTimeout(() => {
      connectWS();
    }, 0);

    simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);

    return () => {
      clearTimeout(timer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (simulateTimerRef.current) {
        clearInterval(simulateTimerRef.current);
        simulateTimerRef.current = null;
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };
  }, [connectWS, runSimulation]);

  // ----- public API -----
  const manualReconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    setConnectionState("reconnecting");
    connectWS();
  }, [connectWS]);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return {
    connectionState,
    reconnectCount,
    lastSyncTime,
    liveQPS,
    qpsTrend,
    liveLatency,
    latencyTrend,
    activeNodes,
    gpuUtil,
    tokenThroughput,
    storageUsed,

    // ★ 节点数据从统一 Slice 返回 — 所有消费者拿到同一份
    nodes: sliceNodes,

    throughputHistory,
    alerts,
    manualReconnect,
    clearAlerts,
  };
}
