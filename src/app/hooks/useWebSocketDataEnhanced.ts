/**
 * useWebSocketDataEnhanced.ts
 * ============================
 * 增强版 WebSocket Hook
 * 
 * 新增功能：
 * - 心跳检测机制（30秒间隔）
 * - 指数退避重连（最大重试 10 次）
 * - 连接状态可视化
 * - 自动降级到模拟模式
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
import { nodeStore } from "../stores/dashboard-stores";

// ============================================================
// 配置常量
// ============================================================

const HEARTBEAT_INTERVAL_MS = 30000; // 心跳间隔 30 秒
const HEARTBEAT_TIMEOUT_MS = 5000; // 心跳超时 5 秒
const MAX_RECONNECT_ATTEMPTS = 10; // 最大重连次数
const INITIAL_RECONNECT_DELAY_MS = 1000; // 初始重连延迟 1 秒
const MAX_RECONNECT_DELAY_MS = 30000; // 最大重连延迟 30 秒
const SIMULATE_INTERVAL_MS = 2000; // 模拟数据更新间隔
const MAX_THROUGHPUT_HISTORY = 60; // 最大历史记录数

// ============================================================
// 模拟数据生成器
// ============================================================

function jitter(base: number, range: number): number {
  return Math.max(0, base + (Math.random() - 0.5) * range * 2);
}

function generateSimulatedNodes(): NodeData[] {
  const storedNodes = nodeStore.getAll();
  return storedNodes.map((n) => ({
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
// Hook 实现
// ============================================================

export function useWebSocketDataEnhanced(): WebSocketDataState {
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
  const [nodes, setNodes] = useState<NodeData[]>(() => nodeStore.getAll());
  const [throughputHistory, setThroughputHistory] = useState<ThroughputPoint[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState(
    new Date().toLocaleString("zh-CN", { hour12: false })
  );

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const simulateTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectWSRef = useRef<(() => void) | null>(null);

  // ============================================================
  // 心跳机制
  // ============================================================

  const startHeartbeat = useCallback(() => {
    // 清理旧的心跳定时器
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
    }

    // 启动新的心跳
    heartbeatTimerRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        // 发送心跳消息
        wsRef.current.send(JSON.stringify({ type: "heartbeat" }));

        // 设置心跳超时检测
        heartbeatTimeoutRef.current = setTimeout(() => {
          console.warn("[WebSocket] 心跳超时，关闭连接");
          wsRef.current?.close();
        }, HEARTBEAT_TIMEOUT_MS);
      }
    }, HEARTBEAT_INTERVAL_MS);
  }, []);

  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  // ============================================================
  // 指数退避重连
  // ============================================================

  const calculateReconnectDelay = useCallback((attempt: number): number => {
    // 指数退避算法：delay = min(initialDelay * 2^attempt, maxDelay)
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY_MS * Math.pow(2, attempt),
      MAX_RECONNECT_DELAY_MS
    );
    // 添加随机抖动（±20%）避免雷群效应
    return delay * (0.8 + Math.random() * 0.4);
  }, []);

  // ============================================================
  // 模拟数据更新
  // ============================================================

  const runSimulation = useCallback(() => {
    const newNodes = generateSimulatedNodes();
    setNodes(newNodes);

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
  }, []);

  // ============================================================
  // WebSocket 连接管理
  // ============================================================

  const connectWS = useCallback(() => {
    // 检查是否超过最大重连次数
    if (reconnectCount >= MAX_RECONNECT_ATTEMPTS) {
      console.error("[WebSocket] 达到最大重连次数，切换到模拟模式");
      setConnectionState("simulated");
      if (!simulateTimerRef.current) {
        simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
      }
      return;
    }

    const wsUrl = getAPIConfig().wsEndpoint;
    setConnectionState("connecting");

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.info("[WebSocket] 连接成功");
        setConnectionState("connected");
        setReconnectCount(0);
        
        // 启动心跳
        startHeartbeat();
        
        // 停止模拟
        if (simulateTimerRef.current) {
          clearInterval(simulateTimerRef.current);
          simulateTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        // 收到消息，清除心跳超时
        if (heartbeatTimeoutRef.current) {
          clearTimeout(heartbeatTimeoutRef.current);
        }

        try {
          const msg: WSMessage = JSON.parse(event.data);
          
          // 处理心跳响应
          if (msg.type === "heartbeat_ack") {
            return;
          }

          switch (msg.type) {
            case "qps_update":
              setLiveQPS(msg.payload.qps);
              setQpsTrend(msg.payload.trend);
              break;
            case "latency_update":
              setLiveLatency(msg.payload.latency);
              setLatencyTrend(msg.payload.trend);
              break;
            case "node_status":
              setNodes(msg.payload);
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
          }
          setLastSyncTime(new Date().toLocaleString("zh-CN", { hour12: false }));
        } catch (error) {
          console.error("[WebSocket] 消息解析错误:", error);
        }
      };

      ws.onclose = (event) => {
        console.info("[WebSocket] 连接关闭:", event.code, event.reason);
        wsRef.current = null;
        
        // 停止心跳
        clearHeartbeat();
        
        // 计算重连延迟
        const delay = calculateReconnectDelay(reconnectCount);
        console.info(`[WebSocket] ${delay}ms 后尝试第 ${reconnectCount + 1} 次重连`);
        
        // 切换到模拟模式
        setConnectionState("simulated");
        if (!simulateTimerRef.current) {
          simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
        }
        
        // 安排重连
        reconnectTimerRef.current = setTimeout(() => {
          setReconnectCount((c) => c + 1);
          connectWSRef.current?.();
        }, delay);
      };

      ws.onerror = (error) => {
        console.error("[WebSocket] 连接错误:", error);
      };

    } catch (error) {
      console.error("[WebSocket] 创建连接失败:", error);
      setConnectionState("disconnected");
      
      // 切换到模拟模式
      if (!simulateTimerRef.current) {
        simulateTimerRef.current = setInterval(runSimulation, SIMULATE_INTERVAL_MS);
      }
    }
  }, [reconnectCount, startHeartbeat, clearHeartbeat, calculateReconnectDelay, runSimulation]);

  // 保存 connectWS 到 ref
  useEffect(() => {
    connectWSRef.current = connectWS;
  }, [connectWS]);

  // ============================================================
  // 手动重连
  // ============================================================

  const manualReconnect = useCallback(() => {
    // 重置重连计数
    setReconnectCount(0);
    
    // 清理现有连接
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    
    // 重新连接
    connectWS();
  }, [connectWS]);

  // ============================================================
  // 清除告警
  // ============================================================

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // ============================================================
  // 生命周期管理
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      connectWS();
    }, 0);

    return () => {
      clearTimeout(timer);
      // 清理所有定时器
      clearHeartbeat();
      if (simulateTimerRef.current) {
        clearInterval(simulateTimerRef.current);
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWS, clearHeartbeat]);

  // ============================================================
  // 返回状态
  // ============================================================

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
    nodes,
    throughputHistory,
    alerts,
    manualReconnect,
    clearAlerts,
  };
}
