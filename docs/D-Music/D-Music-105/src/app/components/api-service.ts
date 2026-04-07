/**
 * @file D-Music 前端 API 服务层
 * @description 对接本地 API 服务器 (yyc3_music/server)
 * @see config/API_Local.md
 * @see config/dmusic_variables.json
 * @author YYC³ Team
 * @version 1.0.0
 */

// ─── 环境配置（对齐 config/API_Local.md · config/dmusic_variables.json）───
const ENV = {
  /** 本地 API 基址：http://localhost:3250/api/v1 */
  API_BASE: 'http://localhost:3250/api/v1',
  /** WebSocket 地址：ws://localhost:3251/ws */
  WS_URL: 'ws://localhost:3251/ws',
  /** 静态资源基址 */
  STATIC_BASE: 'http://localhost:3250/static',
  /** 是否启用本地 API（false 时回退到 mock） */
  USE_LOCAL_API: false,
} as const;

// ─── 通用响应类型（对齐 config/dmusic_types.ts · ApiResponse）───
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; limit?: number; total?: number };
}

// ─── STT 接口类型（对齐 API_Local.md §1.1）───
export interface STTResult {
  text: string;
  confidence: number;
  duration: number;
}

// ─── 时空消息附近查询（对齐 API_Local.md §1.2）───
export interface NearbyMessage {
  id: string;
  distance: number;
  content: string;
  senderName?: string;
  createdAt?: number;
}

// ─── 协作版本树（对齐 API_Local.md §1.3）───
export interface VersionTreeNode {
  id: string;
  children: VersionTreeNode[];
  label?: string;
  createdAt?: string;
}

export interface CollaborationTree {
  root: VersionTreeNode;
  branches: string[];
  currentVersion: string;
}

// ─── 星力值接口类型（对齐 dmusic_types.ts · UserStarPower）───
export interface StarPowerBalance {
  totalStarPower: number;
  availableStarPower: number;
  frozenStarPower: number;
  vipLevel: number;
  vipExp: number;
  mheartValue: number;
  mheartLevel: number;
  dailyCheckinStreak: number;
}

export interface CheckinResult {
  starPowerEarned: number;
  mheartEarned: number;
  streakDays: number;
  bonusMultiplier: number;
}

// ═══════════════════════════════════════════════════════════
// 基础请求工具
// ═══════════════════════════════════════════════════════════

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  if (!ENV.USE_LOCAL_API) {
    console.log(`[D-Music API] Mock mode — skipping: ${path}`);
    return { success: false, error: { code: 'MOCK_MODE', message: '本地 API 未启用' } };
  }

  try {
    const url = `${ENV.API_BASE}${path}`;
    const resp = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    if (!resp.ok) {
      const errorBody = await resp.text().catch(() => '');
      console.error(`[D-Music API] ${resp.status} ${path}: ${errorBody}`);
      return {
        success: false,
        error: { code: `HTTP_${resp.status}`, message: errorBody || resp.statusText },
      };
    }

    return await resp.json();
  } catch (err) {
    console.error(`[D-Music API] Network error on ${path}:`, err);
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: err instanceof Error ? err.message : '网络连接失败' },
    };
  }
}

// ═══════════════════════════════════════════════════════════
// API 方法：语音转文字（STT）
// 对齐 API_Local.md §1.1 · routes/stt.ts
// ═══════════════════════════════════════════════════════════

export async function transcribeAudio(
  audioBlob: Blob,
  language: 'zh' | 'en' | 'ja' | 'ko' = 'zh'
): Promise<ApiResponse<STTResult>> {
  if (!ENV.USE_LOCAL_API) {
    // Mock: 返回模拟识别结果
    return {
      success: true,
      data: {
        text: language === 'zh' ? '这是一段模拟的语音识别文字。' : 'This is a simulated transcription.',
        confidence: 0.92,
        duration: 3.5,
      },
    };
  }

  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('language', language);

  try {
    const resp = await fetch(`${ENV.API_BASE}/stt/transcribe`, {
      method: 'POST',
      body: formData,
    });
    return await resp.json();
  } catch (err) {
    console.error('[D-Music API] STT error:', err);
    return { success: false, error: { code: 'STT_ERROR', message: '语音识别失败' } };
  }
}

// ═══════════════════════════════════════════════════════════
// API 方法：时空消息位置触发
// 对齐 API_Local.md §1.2 · routes/spacetime.ts
// ═══════════════════════════════════════════════════════════

export async function getNearbyMessages(
  lat: number,
  lng: number,
  radius: number = 1000
): Promise<ApiResponse<{ messages: NearbyMessage[] }>> {
  return request<{ messages: NearbyMessage[] }>(
    `/spacetime/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
  );
}

export async function sendSpaceTimeMessage(payload: {
  content: string;
  type: 'text' | 'voice';
  triggerType: string;
  triggerValue: string;
  lat?: number;
  lng?: number;
  privacy: string;
  encrypted: boolean;
}): Promise<ApiResponse<{ id: string }>> {
  return request<{ id: string }>('/spacetime/messages', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ═══════════════════════════════════════════════════════════
// API 方法：创作协作版本树
// 对齐 API_Local.md §1.3 · routes/collaboration.ts
// ═══════════════════════════════════════════════════════════

export async function getCollaborationTree(
  creationId: string
): Promise<ApiResponse<CollaborationTree>> {
  return request<CollaborationTree>(`/collaboration/tree/${creationId}`);
}

// ═══════════════════════════════════════════════════════════
// API 方法：星力值系统
// 对齐 dmusic_variables.json.starPower · routes/starpower.ts
// ═══════════════════════════════════════════════════════════

export async function getStarPowerBalance(
  userId?: string
): Promise<ApiResponse<StarPowerBalance>> {
  const path = userId ? `/starpower/balance?userId=${userId}` : '/starpower/balance';
  return request<StarPowerBalance>(path);
}

export async function dailyCheckin(): Promise<ApiResponse<CheckinResult>> {
  return request<CheckinResult>('/starpower/checkin', { method: 'POST' });
}

export async function boostContent(
  contentId: string,
  amount: number
): Promise<ApiResponse<{ remaining: number }>> {
  return request<{ remaining: number }>('/starpower/boost', {
    method: 'POST',
    body: JSON.stringify({ contentId, amount }),
  });
}

// ═══════════════════════════════════════════════════════════
// WebSocket 管理器
// 对齐 config/dmusic_variables.json.websocket · services/websocket.ts
// ═══════════════════════════════════════════════════════════

export type WsConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

export class DMusicWebSocket {
  private ws: WebSocket | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval = 30000; // 对齐 dmusic_variables.json.websocket.heartbeat
  private messageCallbacks: ((msg: unknown) => void)[] = [];
  private stateCallbacks: ((state: WsConnectionState) => void)[] = [];
  private _state: WsConnectionState = 'disconnected';

  get state(): WsConnectionState { return this._state; }

  private setState(s: WsConnectionState) {
    this._state = s;
    this.stateCallbacks.forEach(cb => cb(s));
  }

  connect(url: string = ENV.WS_URL): void {
    if (!ENV.USE_LOCAL_API) {
      console.log('[D-Music WS] Mock mode — using simulated WebSocket');
      return;
    }

    this.setState('connecting');
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.setState('connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'pong') return; // heartbeat response
          this.messageCallbacks.forEach(cb => cb(data));
        } catch {
          console.warn('[D-Music WS] Invalid message:', event.data);
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.setState('reconnecting');
          this.scheduleReconnect(url);
        } else {
          this.setState('disconnected');
        }
      };

      this.ws.onerror = (err) => {
        console.error('[D-Music WS] Error:', err);
      };
    } catch (err) {
      console.error('[D-Music WS] Connection failed:', err);
      this.setState('disconnected');
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.ws) { this.ws.close(); this.ws = null; }
    this.setState('disconnected');
    this.reconnectAttempts = 0;
  }

  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(cb: (msg: unknown) => void): () => void {
    this.messageCallbacks.push(cb);
    return () => { this.messageCallbacks = this.messageCallbacks.filter(c => c !== cb); };
  }

  onStateChange(cb: (state: WsConnectionState) => void): () => void {
    this.stateCallbacks.push(cb);
    return () => { this.stateCallbacks = this.stateCallbacks.filter(c => c !== cb); };
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'ping', timestamp: Date.now() });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
  }

  private scheduleReconnect(url: string): void {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // 指数退避
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(url), delay);
  }
}

/** 全局 WebSocket 单例 */
export const dmWebSocket = new DMusicWebSocket();

// ═══════════════════════════════════════════════════════════
// 环境检测 & 切换
// ═══════════════════════════════════════════════════════════

/** 检测本地 API 是否可用 */
export async function checkLocalAPIHealth(): Promise<boolean> {
  try {
    const resp = await fetch(`${ENV.API_BASE.replace('/api/v1', '')}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return resp.ok;
  } catch {
    return false;
  }
}

/** 获取当前 API 配置 */
export function getAPIConfig() {
  return { ...ENV };
}
