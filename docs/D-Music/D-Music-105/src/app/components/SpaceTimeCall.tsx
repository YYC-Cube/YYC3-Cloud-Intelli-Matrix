import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { get as idbGet, set as idbSet } from 'idb-keyval';
import {
  Send, Clock, MapPin, Mic, MicOff, X, Radio, Lock, Unlock,
  Globe, Users, User, Eye, EyeOff, Shield, MessageSquare,
  Package, Sparkles, ChevronRight, Heart, Flag, Check,
  CheckCheck, AlertCircle, Timer, Plus, Hash, Wifi, WifiOff,
  Volume2, Zap, Activity, Gift, ArrowLeft
} from 'lucide-react';
import { getValidationMessage } from './content-audit';

// ═══════════════════════════════════════════════════════
// D-MUSIC 「时空喊话系统」 v2.0
// 三 Tab 架构：时空喊话 / 时空胶囊 / 留言墙
// 完整落地 SpaceTime.md 规范
// 参考 config/dmusic_variables.json · config/dmusic_types.ts
// ═══════════════════════════════════════════════════════

// ─── IDB 持久化 KEY ─────────────────────────────────────
const IDB_WALL_KEY = 'dmusic_spacetime_wall';
const IDB_CAPSULES_KEY = 'dmusic_spacetime_capsules';
const IDB_SENT_KEY = 'dmusic_spacetime_sent'; // 已发送的时空喊话

// ─── WebSocket 模拟配置（对齐 dmusic_variables.json.websocket）───
const WS_SIM = {
  heartbeat: 30000,       // 心跳间隔 30s
  pushInterval: 12000,    // 模拟推送间隔 12s
  reconnectDelay: 5000,   // 模拟重连延迟
  maxRetries: 3,
} as const;

type TabId = 'call' | 'capsule' | 'wall';
type MsgType = 'text' | 'voice';
type Privacy = 'public' | 'private' | 'friends';
type MsgStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed' | 'expired';
type TriggerType = 'time' | 'location' | 'event' | 'manual';
type SendStep = 'input' | 'sending' | 'sent';
type WsState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface SpaceTimeMessage {
  id: string;
  type: MsgType;
  content: string;
  audioDuration?: number;
  privacy: Privacy;
  encrypted: boolean;
  status: MsgStatus;
  location?: LocationData;
  triggerType: TriggerType;
  triggerValue: string;
  createdAt: number;
  senderName: string;
  senderAvatar: string;
  likes: number;
  isAnonymous: boolean;
  isLiked?: boolean;         // 当前用户是否已点赞
  mheartLevel?: number;      // 发送者 M❤️ 等级 (来自 dmusic_types.ts)
  isPushed?: boolean;        // 是否是 WS 推送消息
}

interface TimeCapsule {
  id: string;
  title: string;
  description: string;
  content?: string;             // 胶囊封存的内容（开启后可见）
  messageCount: number;
  openCondition: { type: TriggerType; value: string };
  createdAt: number;
  isOpened: boolean;
  openedAt?: number;
  tags: string[];
  contributors: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language?: 'zh' | 'en';
}

// ─── MHeart 等级配色 (对齐 dmusic_variables.json.mheart.levels) ───
const MHEART_COLORS: Record<number, string> = {
  1: '#9E9E9E', 2: '#8BC34A', 3: '#03A9F4', 4: '#2196F3', 5: '#673AB7',
  6: '#9C27B0', 7: '#E91E63', 8: '#FF5722', 9: '#FF9800', 10: '#FFD700',
};
const MHEART_NAMES_ZH: Record<number, string> = {
  1: '初心者', 2: '探索者', 3: '追随者', 4: '热爱者', 5: '守护者',
  6: '星光者', 7: '星辰者', 8: '银河者', 9: '宇宙者', 10: '永恒者',
};

// ═══════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════

const T = {
  zh: {
    tabCall: '「时空喊话」', tabCapsule: '「时空胶囊」', tabWall: '「留言墙」',
    title: '「时空喊话系统」', subtitle: '「跨越时空的互动中继」',
    labelMsg: '「消息内容」', placeholder: '「你想对未来说什么？」',
    labelTime: '「投送时间」', labelLoc: '「位置信息」',
    locating: '「正在定位...」', locFailed: '「定位失败」', locGrant: '「授权定位」', locRetry: '「重新定位」',
    btnSend: '「传输至未来」', transmitting: '「正在传输...」',
    encrypting: '「正在为时空旅行加密消息」', complete: '「传输完成」',
    completeDesc: '「你的消息已在未来等候。」',
    times: { '1m': '「1 分钟后」', '1h': '「1 小时后」', '1d': '「明天」', '1w': '「下周」', '1y': '「明年」' } as Record<string, string>,
    typeText: '「文字」', typeVoice: '「语音」',
    privacyLabel: '「可见范围」', privPublic: '「公开」', privPrivate: '「私密」', privFriends: '「好友」',
    encrypted: '「端到端加密」', unencrypted: '「未加密」',
    statusPending: '「等待发送」', statusSent: '「已发送」', statusDelivered: '「已送达」',
    statusRead: '「已读」', statusFailed: '「发送失败」', statusExpired: '「已过期」',
    recording: '「录音中...」', tapToRecord: '「点击录制语音消息」', recorded: '「已录制」',
    capsuleTitle: '「胶囊标题」', capsuleTitlePh: '「给胶囊取个名字」',
    capsuleDesc: '「胶囊描述」', capsuleDescPh: '「描述这个胶囊的意义」',
    capsuleTrigger: '「开启条件」',
    trigTime: '「定时开启」', trigLocation: '「到达位置」', trigEvent: '「事件触发」', trigManual: '「手动开启」',
    capsuleTags: '「标签」', capsuleTagPh: '「添加标签」', createCapsule: '「封存胶囊」',
    myCapsules: '「我的胶囊」', unopened: '「未开启」', opened: '「已开启」', noCapsules: '「暂无胶囊」',
    capsuleCreated: '「胶囊已封存」', capsuleCreatedDesc: '「等待未来某天开启。」',
    messages: '「条消息」', contributors: '「位参与者」',
    wallTitle: '「D-Music 留言墙」', wallSubtitle: '「星辰旋律，心之所向」',
    wallInput: '「写下你的留言...」', wallAnonymous: '「匿名」', wallPost: '「发布」',
    wallAutoMod: '「AI 审核」', wallEmpty: '「还没有留言，成为第一个吧！」',
    wallLike: '「赞」', wallReport: '「举报」', sec: '「秒」',
    wsConnecting: '「正在连接...」', wsConnected: '「实时连接」',
    wsDisconnected: '「离线」', wsReconnecting: '「重新连接中...」',
    wsNewMsg: '「新消息」', wallDelete: '「删除」',
    sentHistory: '「已发送」', sentCount: '「条」',
    capsuleOpen: '「开启」', capsuleForceOpen: '「提前开启」',
    capsuleOpening: '「正在开启时空胶囊...」',
    capsuleRevealed: '「胶囊已开启」',
    capsuleRevealedDesc: '「来自过去的一段记忆」',
    capsuleBack: '「返回」',
    capsuleCanOpen: '「条件已满足」',
    capsuleNotReady: '「未到开启时间」',
    capsuleOpenDate: '「开启日期」',
    capsuleContent: '「胶囊内容」',
    capsuleCreatedDate: '「封存于」',
    capsuleOpenedDate: '「开启于」',
  },
  en: {
    tabCall: 'Space-Time Call', tabCapsule: 'Time Capsule', tabWall: 'Message Wall',
    title: 'Space-Time System', subtitle: 'Cross-dimensional Interaction Relay',
    labelMsg: 'Message', placeholder: 'What do you want to say to the future?',
    labelTime: 'Delivery Time', labelLoc: 'Location',
    locating: 'Locating...', locFailed: 'Location failed', locGrant: 'Grant Location', locRetry: 'Retry',
    btnSend: 'Transmit to Future', transmitting: 'Transmitting...',
    encrypting: 'Encrypting message for time travel', complete: 'Transmission Complete',
    completeDesc: 'Your message waits in the future.',
    times: { '1m': 'In 1 Minute', '1h': 'In 1 Hour', '1d': 'Tomorrow', '1w': 'Next Week', '1y': 'Next Year' } as Record<string, string>,
    typeText: 'Text', typeVoice: 'Voice',
    privacyLabel: 'Visibility', privPublic: 'Public', privPrivate: 'Private', privFriends: 'Friends',
    encrypted: 'End-to-End Encrypted', unencrypted: 'Unencrypted',
    statusPending: 'Pending', statusSent: 'Sent', statusDelivered: 'Delivered',
    statusRead: 'Read', statusFailed: 'Failed', statusExpired: 'Expired',
    recording: 'Recording...', tapToRecord: 'Tap to record voice message', recorded: 'Recorded',
    capsuleTitle: 'Capsule Title', capsuleTitlePh: 'Name your capsule',
    capsuleDesc: 'Description', capsuleDescPh: 'Describe what this capsule means',
    capsuleTrigger: 'Open Condition',
    trigTime: 'Timed Open', trigLocation: 'At Location', trigEvent: 'Event Trigger', trigManual: 'Manual Open',
    capsuleTags: 'Tags', capsuleTagPh: 'Add a tag', createCapsule: 'Seal Capsule',
    myCapsules: 'My Capsules', unopened: 'Sealed', opened: 'Opened', noCapsules: 'No capsules yet',
    capsuleCreated: 'Capsule Sealed', capsuleCreatedDesc: 'Waiting for the future to unlock.',
    messages: 'messages', contributors: 'contributors',
    wallTitle: 'D-Music Message Wall', wallSubtitle: 'Melodies of Stars, Echoes of Heart',
    wallInput: 'Write your message...', wallAnonymous: 'Anonymous', wallPost: 'Post',
    wallAutoMod: 'AI Moderated', wallEmpty: 'No messages yet, be the first!',
    wallLike: 'Like', wallReport: 'Report', sec: 's',
    wsConnecting: 'Connecting...', wsConnected: 'Live',
    wsDisconnected: 'Offline', wsReconnecting: 'Reconnecting...',
    wsNewMsg: 'New', wallDelete: 'Delete',
    sentHistory: 'Sent', sentCount: '',
    capsuleOpen: 'Open', capsuleForceOpen: 'Open Early',
    capsuleOpening: 'Opening Time Capsule...',
    capsuleRevealed: 'Capsule Opened',
    capsuleRevealedDesc: 'A memory from the past',
    capsuleBack: 'Back',
    capsuleCanOpen: 'Ready to open',
    capsuleNotReady: 'Not yet time',
    capsuleOpenDate: 'Open Date',
    capsuleContent: 'Capsule Content',
    capsuleCreatedDate: 'Sealed on',
    capsuleOpenedDate: 'Opened on',
  }
};

// ═══════════════════════════════════════════════════════
// SEED DATA（仅当 IDB 无数据时使用）
// ═══════════════════════════════════════════════════════

const SEED_WALL: SpaceTimeMessage[] = [
  { id: 'w1', type: 'text', content: '愿每一首歌都能穿越时空，抵达最需要它的人心中。', privacy: 'public', encrypted: false, status: 'read', triggerType: 'manual', triggerValue: '', createdAt: Date.now() - 3600000, senderName: '星辰旅人', senderAvatar: '🌟', likes: 42, isAnonymous: false, mheartLevel: 5 },
  { id: 'w2', type: 'text', content: 'Music is the universal language that needs no translation.', privacy: 'public', encrypted: false, status: 'read', triggerType: 'manual', triggerValue: '', createdAt: Date.now() - 7200000, senderName: 'MelodyDreamer', senderAvatar: '🎵', likes: 28, isAnonymous: false, mheartLevel: 3 },
  { id: 'w3', type: 'voice', content: '', audioDuration: 12, privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'manual', triggerValue: '', createdAt: Date.now() - 14400000, senderName: '匿名用户', senderAvatar: '🎧', likes: 15, isAnonymous: true },
  { id: 'w4', type: 'text', content: '三年后的自己，希望你依然在听这首歌的时候会微笑。', privacy: 'public', encrypted: false, status: 'read', triggerType: 'time', triggerValue: '1y', createdAt: Date.now() - 86400000, senderName: '时光信使', senderAvatar: '💫', likes: 67, isAnonymous: false, mheartLevel: 7 },
  { id: 'w5', type: 'text', content: 'Left a melody here for someone special. You know who you are.', privacy: 'public', encrypted: true, status: 'read', triggerType: 'manual', triggerValue: '', createdAt: Date.now() - 172800000, senderName: 'NightOwl', senderAvatar: '🦉', likes: 33, isAnonymous: false, mheartLevel: 4 },
];

const SEED_CAPSULES: TimeCapsule[] = [
  { id: 'c0', title: '「初心之声」', description: '第一次使用 D-Music 时的感动', content: '记得第一次打开 D-Music 时，被那个紫色的星空界面深深吸引。选了一首最爱的歌，戴上耳机，闭上眼睛——那一刻感觉整个宇宙都在为我演奏。把这份感动封存在这里，随时可以重温。', messageCount: 3, openCondition: { type: 'manual', value: '' }, createdAt: Date.now() - 604800000, isOpened: false, tags: ['初心', 'D-Music'], contributors: ['我'] },
  { id: 'c1', title: '「2026 年度歌单」', description: '收录今年最打动我的 10 首歌', content: '这一年听了无数首歌，但最打动我的始终是那些在深夜独自循环的旋律。从春天到冬天，每首歌都是一段时光的锚点。希望明年再打开这个胶囊时，我依然记得每首歌背后的故事。', messageCount: 10, openCondition: { type: 'time', value: '2027-01-01' }, createdAt: Date.now() - 2592000000, isOpened: false, tags: ['年度', '歌单', '回忆'], contributors: ['我'] },
  { id: 'c2', title: '「毕业季的声音」', description: '给四年后的我们', content: '四年后的我们会在哪里？是否还会一起听歌、一起疯？把这些歌留在这里，等到那天再一起打开。不管未来如何，音乐会替我们记住这些日子。', messageCount: 5, openCondition: { type: 'time', value: '2030-06-01' }, createdAt: Date.now() - 5184000000, isOpened: false, tags: ['毕业', '青春', '友谊'], contributors: ['我', '小明', '小红'] },
];

// ─── WS 模拟推送消息池 ───
const WS_PUSH_POOL: Omit<SpaceTimeMessage, 'id' | 'createdAt'>[] = [
  { type: 'text', content: '在未来的某个路口，这首歌会再次响起。', privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'manual', triggerValue: '', senderName: '量子信使', senderAvatar: '⚡', likes: 0, isAnonymous: false, mheartLevel: 6, isPushed: true },
  { type: 'text', content: 'Every song is a time machine if you listen closely enough.', privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'manual', triggerValue: '', senderName: 'Stargazer', senderAvatar: '🔭', likes: 0, isAnonymous: false, mheartLevel: 8, isPushed: true },
  { type: 'text', content: '把心情封存在旋律里，等风来的时候一起释放。', privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'time', triggerValue: '1d', senderName: '风语者', senderAvatar: '🌊', likes: 0, isAnonymous: false, mheartLevel: 4, isPushed: true },
  { type: 'voice', content: '', audioDuration: 8, privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'manual', triggerValue: '', senderName: 'EchoWalker', senderAvatar: '🎤', likes: 0, isAnonymous: false, mheartLevel: 5, isPushed: true },
  { type: 'text', content: '致敬所有用音乐治愈世界的灵魂。', privacy: 'public', encrypted: false, status: 'delivered', triggerType: 'manual', triggerValue: '', senderName: '银河编织者', senderAvatar: '✨', likes: 0, isAnonymous: false, mheartLevel: 9, isPushed: true },
  { type: 'text', content: 'Sending this from 2026 — future me, I hope you still dance.', privacy: 'public', encrypted: true, status: 'sent', triggerType: 'time', triggerValue: '1y', senderName: 'TimeDancer', senderAvatar: '💃', likes: 0, isAnonymous: false, mheartLevel: 3, isPushed: true },
];

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

function StatusIcon({ status }: { status: MsgStatus }) {
  switch (status) {
    case 'pending': return <Clock className="w-3 h-3 text-white/30" />;
    case 'sent': return <Check className="w-3 h-3 text-blue-400/70" />;
    case 'delivered': return <CheckCheck className="w-3 h-3 text-blue-400" />;
    case 'read': return <CheckCheck className="w-3 h-3 text-green-400" />;
    case 'failed': return <AlertCircle className="w-3 h-3 text-red-400" />;
    case 'expired': return <Timer className="w-3 h-3 text-white/20" />;
    default: return null;
  }
}

function timeAgo(ts: number, lang: 'zh' | 'en'): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (lang === 'zh') {
    if (m < 1) return '「刚刚」';
    if (m < 60) return `「${m} 分钟前」`;
    if (h < 24) return `「${h} 小时前」`;
    return `「${d} 天前」`;
  }
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

function MHeartBadge({ level, lang }: { level?: number; lang: 'zh' | 'en' }) {
  if (!level || level < 2) return null;
  const color = MHEART_COLORS[level] || '#9E9E9E';
  const name = lang === 'zh' ? MHEART_NAMES_ZH[level] : `Lv.${level}`;
  return (
    <span
      className="text-[7px] font-bold px-1 py-px rounded-sm border"
      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}12` }}
      title={`M❤️ ${name}`}
    >
      {name}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export function SpaceTimeCall({ isOpen, onClose, language = 'zh' }: Props) {
  const t = T[language];
  const [activeTab, setActiveTab] = useState<TabId>('call');

  // ─── Call tab state ───
  const [step, setStep] = useState<SendStep>('input');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('1h');
  const [msgType, setMsgType] = useState<MsgType>('text');
  const [privacy, setPrivacy] = useState<Privacy>('public');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locError, setLocError] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ─── Capsule tab state ───
  const [capsuleTitle, setCapsuleTitle] = useState('');
  const [capsuleDesc, setCapsuleDesc] = useState('');
  const [capsuleTrigger, setCapsuleTrigger] = useState<TriggerType>('time');
  const [capsuleTags, setCapsuleTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [capsuleStep, setCapsuleStep] = useState<'form' | 'creating' | 'done' | 'opening' | 'revealed'>('form');
  const [openingCapsuleId, setOpeningCapsuleId] = useState<string | null>(null);

  // ─── Wall tab state ───
  const [wallMessages, setWallMessages] = useState<SpaceTimeMessage[]>([]);
  const [wallInput, setWallInput] = useState('');
  const [wallAnonymous, setWallAnonymous] = useState(false);
  const [idbLoaded, setIdbLoaded] = useState(false);

  // ─── WebSocket 模拟状态 ───
  const [wsState, setWsState] = useState<WsState>('disconnected');
  const [newPushCount, setNewPushCount] = useState(0);
  const wsPushIndexRef = useRef(0);
  const wsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wsHeartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ═══════════════════════════════════════════════════════
  // IDB-KEYVAL 持久化 — 加载
  // ═══════════════════════════════════════════════════════

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [savedWall, savedCapsules, savedSent] = await Promise.all([
          idbGet<SpaceTimeMessage[]>(IDB_WALL_KEY),
          idbGet<TimeCapsule[]>(IDB_CAPSULES_KEY),
          idbGet<number>(IDB_SENT_KEY),
        ]);
        if (cancelled) return;
        setWallMessages(savedWall && savedWall.length > 0 ? savedWall : SEED_WALL);
        setCapsules(savedCapsules && savedCapsules.length > 0 ? savedCapsules : SEED_CAPSULES);
        setSentCount(savedSent || 0);
      } catch {
        setWallMessages(SEED_WALL);
        setCapsules(SEED_CAPSULES);
      }
      if (!cancelled) setIdbLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── IDB 写回（wall 变化时持久化） ───
  useEffect(() => {
    if (idbLoaded) idbSet(IDB_WALL_KEY, wallMessages).catch(() => {});
  }, [wallMessages, idbLoaded]);

  useEffect(() => {
    if (idbLoaded) idbSet(IDB_CAPSULES_KEY, capsules).catch(() => {});
  }, [capsules, idbLoaded]);

  // ═══════════════════════════════════════════════════════
  // WEBSOCKET 模拟（setInterval 推送 + 心跳）
  // ═══════════════════════════════════════════════════════

  const startWsSimulation = useCallback(() => {
    // 阶段 1: connecting
    setWsState('connecting');
    const connectDelay = setTimeout(() => {
      setWsState('connected');

      // 心跳
      wsHeartbeatRef.current = setInterval(() => {
        // 模拟偶尔断连 + 重连（5% 概率）
        if (Math.random() < 0.05) {
          setWsState('reconnecting');
          setTimeout(() => setWsState('connected'), WS_SIM.reconnectDelay);
        }
      }, WS_SIM.heartbeat);

      // 消息推送
      wsTimerRef.current = setInterval(() => {
        const poolMsg = WS_PUSH_POOL[wsPushIndexRef.current % WS_PUSH_POOL.length];
        wsPushIndexRef.current++;
        const pushed: SpaceTimeMessage = {
          ...poolMsg,
          id: 'ws_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          createdAt: Date.now(),
        };
        setWallMessages(prev => [pushed, ...prev]);
        setNewPushCount(c => c + 1);
      }, WS_SIM.pushInterval);
    }, 1500);

    return () => {
      clearTimeout(connectDelay);
      if (wsTimerRef.current) clearInterval(wsTimerRef.current);
      if (wsHeartbeatRef.current) clearInterval(wsHeartbeatRef.current);
    };
  }, []);

  // 面板打开时启动 WS 模拟，关闭时清理
  useEffect(() => {
    if (!isOpen) {
      setWsState('disconnected');
      setNewPushCount(0);
      if (wsTimerRef.current) { clearInterval(wsTimerRef.current); wsTimerRef.current = null; }
      if (wsHeartbeatRef.current) { clearInterval(wsHeartbeatRef.current); wsHeartbeatRef.current = null; }
      return;
    }
    const cleanup = startWsSimulation();
    return cleanup;
  }, [isOpen, startWsSimulation]);

  // 切到 wall tab 时重置新消息计数
  useEffect(() => {
    if (activeTab === 'wall') setNewPushCount(0);
  }, [activeTab]);

  // ═══════════════════════════════════════════════════════
  // GEOLOCATION
  // ═══════════════════════════════════════════════════════

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocError(true); return; }
    setIsLocating(true);
    setLocError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: Math.round(pos.coords.latitude * 10000) / 10000,
          longitude: Math.round(pos.coords.longitude * 10000) / 10000,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
      },
      () => { setLocError(true); setIsLocating(false); },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'call' && !location && !locError) {
      requestLocation();
    }
  }, [isOpen, activeTab]);

  // ═══════════════════════════════════════════════════════
  // VOICE RECORDING
  // ═══════════════════════════════════════════════════════

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(tr => tr.stop());
        setHasRecording(audioChunksRef.current.length > 0);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000);
    } catch {
      // Permission denied or not available
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordTimerRef.current) { clearInterval(recordTimerRef.current); recordTimerRef.current = null; }
    setIsRecording(false);
  }, []);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setStep('input');
      setMessage('');
      setHasRecording(false);
      setRecordDuration(0);
      setCapsuleStep('form');
      setOpeningCapsuleId(null);
    }
  }, [isOpen, stopRecording]);

  // ═══════════════════════════════════════════════════════
  // SEND HANDLERS
  // ═══════════════════════════════════════════════════════

  const handleSend = () => {
    if (msgType === 'text' && !message.trim()) return;
    if (msgType === 'voice' && !hasRecording) return;
    setStep('sending');
    setTimeout(() => {
      // 也把发送的消息写入留言墙（如果 privacy == public）
      if (privacy === 'public') {
        const sentMsg: SpaceTimeMessage = {
          id: 'sent_' + Date.now(),
          type: msgType,
          content: msgType === 'text' ? message : '',
          audioDuration: msgType === 'voice' ? recordDuration : undefined,
          privacy, encrypted: isEncrypted, status: 'sent',
          location: location || undefined,
          triggerType: 'time', triggerValue: time,
          createdAt: Date.now(),
          senderName: language === 'zh' ? '我' : 'Me',
          senderAvatar: '🎵', likes: 0, isAnonymous: false,
        };
        setWallMessages(prev => [sentMsg, ...prev]);
      }
      const newCount = sentCount + 1;
      setSentCount(newCount);
      idbSet(IDB_SENT_KEY, newCount).catch(() => {});
      setStep('sent');
      setTimeout(() => {
        onClose();
        setTimeout(() => { setStep('input'); setMessage(''); setHasRecording(false); setRecordDuration(0); }, 500);
      }, 2000);
    }, 2200);
  };

  const handleCreateCapsule = () => {
    if (!capsuleTitle.trim()) return;
    setCapsuleStep('creating');
    setTimeout(() => {
      const newCapsule: TimeCapsule = {
        id: 'c_' + Date.now(),
        title: capsuleTitle,
        description: capsuleDesc,
        content: capsuleDesc || (language === 'zh' ? '这是一段封存的记忆，等待未来的你来开启。' : 'A sealed memory, waiting for the future you to unlock.'),
        messageCount: 1,
        openCondition: { type: capsuleTrigger, value: capsuleTrigger === 'time' ? '2027-01-01' : '' },
        createdAt: Date.now(),
        isOpened: false,
        tags: capsuleTags,
        contributors: [language === 'zh' ? '我' : 'Me'],
      };
      setCapsules(prev => [newCapsule, ...prev]);
      setCapsuleStep('done');
      setTimeout(() => {
        setCapsuleStep('form');
        setCapsuleTitle('');
        setCapsuleDesc('');
        setCapsuleTags([]);
      }, 2500);
    }, 1800);
  };

  const canOpenCapsule = (cap: TimeCapsule): boolean => {
    if (cap.isOpened) return false;
    switch (cap.openCondition.type) {
      case 'time': return true;          // 时间胶囊始终可开启（未到时间显示「提前开启」）
      case 'manual': return true;
      case 'location': return !!location; // 有位置信息就可以开启
      case 'event': return true;          // 模拟：事件触发直接可开启
      default: return false;
    }
  };

  const isTimeReady = (cap: TimeCapsule): boolean => {
    if (cap.openCondition.type !== 'time' || !cap.openCondition.value) return true;
    return new Date(cap.openCondition.value).getTime() <= Date.now();
  };

  const handleOpenCapsule = (capsuleId: string) => {
    const cap = capsules.find(c => c.id === capsuleId);
    if (!cap || cap.isOpened) return;
    setOpeningCapsuleId(capsuleId);
    setCapsuleStep('opening');
    setTimeout(() => {
      setCapsules(prev => prev.map(c =>
        c.id === capsuleId ? { ...c, isOpened: true, openedAt: Date.now() } : c
      ));
      setCapsuleStep('revealed');
    }, 2200);
  };

  const handleCapsuleBack = () => {
    setCapsuleStep('form');
    setOpeningCapsuleId(null);
  };

  const wallValidation = useMemo(() => getValidationMessage(wallInput, language, 500), [wallInput, language]);

  const handleWallPost = () => {
    if (!wallInput.trim() || wallValidation) return;
    const newMsg: SpaceTimeMessage = {
      id: 'wn_' + Date.now(),
      type: 'text',
      content: wallInput,
      privacy: 'public',
      encrypted: false,
      status: 'delivered',
      triggerType: 'manual',
      triggerValue: '',
      createdAt: Date.now(),
      senderName: wallAnonymous ? (language === 'zh' ? '匿名用户' : 'Anonymous') : (language === 'zh' ? '我' : 'Me'),
      senderAvatar: wallAnonymous ? '🎭' : '🎵',
      likes: 0,
      isAnonymous: wallAnonymous,
    };
    setWallMessages(prev => [newMsg, ...prev]);
    setWallInput('');
  };

  const handleWallLike = (id: string) => {
    setWallMessages(prev => prev.map(m =>
      m.id === id ? { ...m, likes: m.isLiked ? m.likes - 1 : m.likes + 1, isLiked: !m.isLiked } : m
    ));
  };

  const handleWallDelete = (id: string) => {
    setWallMessages(prev => prev.filter(m => m.id !== id));
  };

  const addTag = () => {
    if (tagInput.trim() && capsuleTags.length < 5) {
      setCapsuleTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const canSend = msgType === 'text' ? message.trim().length > 0 : hasRecording;

  // ─── WS 状态指示器 UI ───
  const wsIndicator = useMemo(() => {
    const cfg: Record<WsState, { icon: typeof Wifi; color: string; pulse: boolean; label: string }> = {
      connecting:    { icon: Activity, color: 'text-amber-400', pulse: true, label: t.wsConnecting },
      connected:     { icon: Wifi, color: 'text-green-400', pulse: false, label: t.wsConnected },
      disconnected:  { icon: WifiOff, color: 'text-white/20', pulse: false, label: t.wsDisconnected },
      reconnecting:  { icon: Activity, color: 'text-amber-400', pulse: true, label: t.wsReconnecting },
    };
    return cfg[wsState];
  }, [wsState, t]);

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  const tabs: { id: TabId; icon: typeof Radio; label: string; badge?: number }[] = [
    { id: 'call', icon: Radio, label: t.tabCall },
    { id: 'capsule', icon: Package, label: t.tabCapsule },
    { id: 'wall', icon: MessageSquare, label: t.tabWall, badge: activeTab !== 'wall' ? newPushCount : 0 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-label={t.title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-purple-900/30 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] bg-[#0c0a1a]/95 backdrop-blur-2xl rounded-none sm:rounded-2xl border-0 sm:border border-purple-500/15 shadow-[0_24px_80px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col"
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/8 rounded-full blur-[50px] pointer-events-none" />

            {/* Header */}
            <div className="relative px-5 pt-4 pb-3 border-b border-white/[0.06] flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Radio className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white/90 font-bold text-sm tracking-wide">{t.title}</h2>
                  <p className="text-white/25 text-[10px] font-mono mt-0.5">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* WS 状态指示器 */}
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold ${wsIndicator.color} ${wsIndicator.pulse ? 'animate-pulse' : ''}`}
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <wsIndicator.icon className="w-2.5 h-2.5" />
                  {wsIndicator.label}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  aria-label={language === 'zh' ? '关闭' : 'Close'}
                  className="p-2 rounded-xl hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.06]" role="tablist" aria-label={language === 'zh' ? '时空喊话标签页' : 'SpaceTime tabs'}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex-1 py-2.5 px-2 text-center transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-purple-400 bg-white/[0.03]'
                      : 'border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <tab.icon className={`w-3.5 h-3.5 mx-auto mb-0.5 ${activeTab === tab.id ? 'text-purple-400' : 'text-white/30'}`} />
                  <div className={`text-[10px] font-bold ${activeTab === tab.id ? 'text-white/80' : 'text-white/30'}`}>
                    {tab.label}
                  </div>
                  {/* 新消息 badge */}
                  {tab.badge && tab.badge > 0 ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 right-1/4 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center shadow-lg shadow-red-500/40"
                    >
                      {tab.badge > 9 ? '9+' : tab.badge}
                    </motion.span>
                  ) : null}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence mode="wait">
                {/* ═══════ TAB 1: CALL ═══════ */}
                {activeTab === 'call' && (
                  <motion.div key="call" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-5">
                    <AnimatePresence mode="wait">
                      {step === 'input' && (
                        <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                          {/* 已发送统计 */}
                          {sentCount > 0 && (
                            <div className="flex items-center gap-2 text-[9px] text-white/25">
                              <Zap className="w-3 h-3 text-purple-400/50" />
                              <span>{t.sentHistory}: {sentCount} {t.sentCount}</span>
                            </div>
                          )}

                          {/* Message Type Selector */}
                          <div className="flex gap-2">
                            {([
                              { id: 'text' as MsgType, icon: MessageSquare, label: t.typeText },
                              { id: 'voice' as MsgType, icon: Mic, label: t.typeVoice },
                            ]).map(mt => (
                              <button
                                key={mt.id}
                                onClick={() => setMsgType(mt.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                                  msgType === mt.id
                                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                    : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60'
                                }`}
                              >
                                <mt.icon className="w-3 h-3" />
                                {mt.label}
                              </button>
                            ))}
                          </div>

                          {/* Text Input or Voice Recorder */}
                          {msgType === 'text' ? (
                            <div className="space-y-1.5">
                              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1">{t.labelMsg}</label>
                              <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={t.placeholder}
                                className="w-full h-28 bg-white/[0.04] border border-white/10 rounded-xl p-3.5 text-white text-sm resize-none focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all placeholder:text-white/15"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 space-y-3">
                              <div className="relative">
                                {isRecording && (
                                  <>
                                    <motion.div animate={{ scale: [1, 1.6], opacity: [0.4, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="absolute inset-0 rounded-full border-2 border-red-400/50" />
                                    <motion.div animate={{ scale: [1, 2.0], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }} className="absolute inset-0 rounded-full border-2 border-red-400/30" />
                                  </>
                                )}
                                <motion.button
                                  whileHover={{ scale: 1.06 }}
                                  whileTap={{ scale: 0.94 }}
                                  onClick={isRecording ? stopRecording : startRecording}
                                  className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                                    isRecording
                                      ? 'bg-gradient-to-tr from-red-500 to-pink-500 shadow-red-500/40'
                                      : hasRecording
                                        ? 'bg-gradient-to-tr from-green-500 to-emerald-500 shadow-green-500/30'
                                        : 'bg-gradient-to-tr from-purple-600 to-blue-500 shadow-purple-500/30'
                                  }`}
                                >
                                  {isRecording ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                                </motion.button>
                              </div>
                              <p className={`text-[11px] font-medium ${isRecording ? 'text-red-300' : hasRecording ? 'text-green-300' : 'text-white/40'}`}>
                                {isRecording ? `${t.recording} ${recordDuration}${t.sec}` : hasRecording ? `${t.recorded} (${recordDuration}${t.sec})` : t.tapToRecord}
                              </p>
                              {hasRecording && (
                                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-1.5">
                                  <Volume2 className="w-3 h-3 text-green-400" />
                                  <div className="flex gap-px">
                                    {Array.from({ length: 20 }).map((_, i) => (
                                      <div key={i} className="w-1 bg-green-400/60 rounded-full" style={{ height: `${4 + Math.sin(i * 0.8) * 6 + 4}px` }} />
                                    ))}
                                  </div>
                                  <span className="text-green-300 text-[9px] font-mono">{recordDuration}{t.sec}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Time + Location */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> {t.labelTime}
                              </label>
                              <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-purple-500/40 appearance-none"
                              >
                                {Object.entries(t.times).map(([k, v]) => (
                                  <option key={k} value={k}>{v}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <MapPin className="w-3 h-3" /> {t.labelLoc}
                              </label>
                              {location ? (
                                <div className="bg-white/[0.04] border border-green-500/20 rounded-xl p-2.5">
                                  <div className="text-green-300 text-[10px] font-mono">{location.latitude}, {location.longitude}</div>
                                  <div className="text-white/20 text-[8px] mt-0.5">±{location.accuracy}m</div>
                                </div>
                              ) : (
                                <button
                                  onClick={requestLocation}
                                  disabled={isLocating}
                                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-2.5 text-white/40 text-[10px] text-left hover:border-purple-500/30 transition-colors disabled:animate-pulse"
                                >
                                  {isLocating ? t.locating : locError ? t.locRetry : t.locGrant}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Privacy + Encryption */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="text-white/30 text-[9px] font-semibold shrink-0">{t.privacyLabel}</label>
                            {([
                              { id: 'public' as Privacy, icon: Globe, label: t.privPublic },
                              { id: 'friends' as Privacy, icon: Users, label: t.privFriends },
                              { id: 'private' as Privacy, icon: Lock, label: t.privPrivate },
                            ]).map(p => (
                              <button
                                key={p.id}
                                onClick={() => setPrivacy(p.id)}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-semibold border transition-all ${
                                  privacy === p.id
                                    ? 'bg-purple-500/15 border-purple-500/25 text-purple-300'
                                    : 'border-white/[0.06] text-white/25 hover:text-white/40'
                                }`}
                              >
                                <p.icon className="w-2.5 h-2.5" />
                                {p.label}
                              </button>
                            ))}
                            <button
                              onClick={() => setIsEncrypted(e => !e)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-semibold border transition-all ml-auto ${
                                isEncrypted
                                  ? 'bg-green-500/10 border-green-500/20 text-green-300'
                                  : 'bg-white/[0.03] border-white/[0.06] text-white/25'
                              }`}
                            >
                              {isEncrypted ? <Shield className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                              {isEncrypted ? t.encrypted : t.unencrypted}
                            </button>
                          </div>

                          {/* Send */}
                          <motion.button
                            whileHover={canSend ? { scale: 1.02 } : {}}
                            whileTap={canSend ? { scale: 0.98 } : {}}
                            onClick={handleSend}
                            disabled={!canSend}
                            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                          >
                            <Send className="w-4 h-4" />
                            {t.btnSend}
                          </motion.button>
                        </motion.div>
                      )}

                      {step === 'sending' && (
                        <motion.div key="sending" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center text-center py-12 space-y-5">
                          <div className="relative">
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 rounded-full border-t-2 border-r-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
                            <motion.div animate={{ rotate: -360 }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500" />
                            {isEncrypted ? <Shield className="absolute inset-0 m-auto w-7 h-7 text-green-400 animate-pulse" /> : <Radio className="absolute inset-0 m-auto w-7 h-7 text-white animate-pulse" />}
                          </div>
                          <div>
                            <h4 className="text-white text-lg font-bold mb-1.5">{t.transmitting}</h4>
                            <p className="text-purple-300/50 text-xs">{t.encrypting}</p>
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-mono">
                            {(['pending', 'sent', 'delivered'] as MsgStatus[]).map((s, i) => (
                              <motion.div key={s} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.7 }} className="flex items-center gap-1 text-white/40">
                                <StatusIcon status={s} />
                                <span>{s === 'pending' ? t.statusPending : s === 'sent' ? t.statusSent : t.statusDelivered}</span>
                                {i < 2 && <ChevronRight className="w-2.5 h-2.5 text-white/15 mx-1" />}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {step === 'sent' && (
                        <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-12 space-y-5">
                          <div className="w-20 h-20 bg-green-500/15 rounded-full flex items-center justify-center border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <CheckCheck className="w-9 h-9 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white text-lg font-bold mb-1.5">{t.complete}</h4>
                            <p className="text-white/40 text-xs">{t.completeDesc}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ═══════ TAB 2: CAPSULE ═══════ */}
                {activeTab === 'capsule' && (
                  <motion.div key="capsule" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-5">
                    <AnimatePresence mode="wait">
                      {capsuleStep === 'form' && (
                        <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1">{t.capsuleTitle}</label>
                            <input
                              value={capsuleTitle}
                              onChange={(e) => setCapsuleTitle(e.target.value)}
                              placeholder={t.capsuleTitlePh}
                              className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-white/15"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1">{t.capsuleDesc}</label>
                            <textarea
                              value={capsuleDesc}
                              onChange={(e) => setCapsuleDesc(e.target.value)}
                              placeholder={t.capsuleDescPh}
                              className="w-full h-20 bg-white/[0.04] border border-white/10 rounded-xl p-3 text-white text-sm resize-none focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-white/15"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1">{t.capsuleTrigger}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {([
                                { id: 'time' as TriggerType, icon: Clock, label: t.trigTime },
                                { id: 'location' as TriggerType, icon: MapPin, label: t.trigLocation },
                                { id: 'event' as TriggerType, icon: Sparkles, label: t.trigEvent },
                                { id: 'manual' as TriggerType, icon: User, label: t.trigManual },
                              ]).map(tr => (
                                <button
                                  key={tr.id}
                                  onClick={() => setCapsuleTrigger(tr.id)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-semibold border transition-all ${
                                    capsuleTrigger === tr.id
                                      ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                                      : 'bg-white/[0.03] border-white/10 text-white/40 hover:text-white/60'
                                  }`}
                                >
                                  <tr.icon className="w-3 h-3" />
                                  {tr.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-white/50 text-[10px] font-semibold uppercase tracking-wider ml-1">{t.capsuleTags}</label>
                            <div className="flex gap-2">
                              <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                placeholder={t.capsuleTagPh}
                                className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500/40 transition-all placeholder:text-white/15"
                              />
                              <button onClick={addTag} className="px-3 py-1.5 bg-white/[0.06] border border-white/10 rounded-lg text-white/40 hover:text-white/60 transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {capsuleTags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {capsuleTags.map((tag, i) => (
                                  <span key={i} className="flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 rounded-md px-2 py-0.5 text-purple-300 text-[10px] font-medium">
                                    <Hash className="w-2.5 h-2.5" />{tag}
                                    <button onClick={() => setCapsuleTags(prev => prev.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-white/50 ml-0.5">
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <motion.button
                            whileHover={capsuleTitle.trim() ? { scale: 1.02 } : {}}
                            whileTap={capsuleTitle.trim() ? { scale: 0.98 } : {}}
                            onClick={handleCreateCapsule}
                            disabled={!capsuleTitle.trim()}
                            className="w-full py-3 bg-gradient-to-r from-amber-500/80 to-orange-500/80 rounded-xl text-white font-bold text-sm shadow-lg shadow-amber-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                          >
                            <Package className="w-4 h-4" />
                            {t.createCapsule}
                          </motion.button>
                          {/* My Capsules */}
                          <div className="pt-2">
                            <h4 className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.15em] mb-2">{t.myCapsules}</h4>
                            {capsules.length === 0 ? (
                              <p className="text-white/15 text-xs text-center py-4">{t.noCapsules}</p>
                            ) : (
                              <div className="space-y-2">
                                {capsules.map((cap, i) => (
                                  <motion.div key={cap.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 hover:bg-white/[0.05] transition-colors">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${cap.isOpened ? 'bg-green-500/10' : 'bg-amber-500/10'}`}>
                                          <Package className={`w-3 h-3 ${cap.isOpened ? 'text-green-400' : 'text-amber-400'}`} />
                                        </div>
                                        <div>
                                          <div className="text-white/80 text-xs font-semibold">{cap.title}</div>
                                          <div className="text-white/25 text-[9px] mt-0.5">{cap.description}</div>
                                        </div>
                                      </div>
                                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${cap.isOpened ? 'bg-green-500/15 text-green-400' : 'bg-amber-500/15 text-amber-400'}`}>
                                        {cap.isOpened ? t.opened : t.unopened}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-[9px] text-white/25">
                                      <span>{cap.messageCount} {t.messages}</span>
                                      <span>{cap.contributors.length} {t.contributors}</span>
                                      {cap.tags.map((tag, ti) => (
                                        <span key={ti} className="text-purple-400/40">#{tag}</span>
                                      ))}
                                    </div>
                                    {/* Open / View Button */}
                                    {cap.isOpened ? (
                                      <button
                                        onClick={() => { setOpeningCapsuleId(cap.id); setCapsuleStep('revealed'); }}
                                        className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-[9px] font-bold hover:bg-green-500/15 transition-all"
                                      >
                                        <Gift className="w-3 h-3" />
                                        {t.capsuleContent}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleOpenCapsule(cap.id)}
                                        className={`mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[9px] font-bold transition-all ${
                                          canOpenCapsule(cap)
                                            ? 'bg-amber-500/15 border border-amber-500/25 text-amber-300 hover:bg-amber-500/25'
                                            : 'bg-white/[0.04] border border-white/[0.06] text-white/20 cursor-not-allowed'
                                        }`}
                                        disabled={!canOpenCapsule(cap)}
                                      >
                                        {canOpenCapsule(cap) ? (
                                          <>
                                            <Package className="w-3 h-3" />
                                            {!isTimeReady(cap) ? t.capsuleForceOpen : t.capsuleOpen}
                                          </>
                                        ) : (
                                          <>
                                            <Lock className="w-3 h-3" />
                                            {t.capsuleNotReady}
                                            {cap.openCondition.type === 'time' && cap.openCondition.value && (
                                              <span className="text-white/15 ml-1">({cap.openCondition.value})</span>
                                            )}
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {capsuleStep === 'creating' && (
                        <motion.div key="creating" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center py-16 space-y-5">
                          <motion.div
                            animate={{ rotateY: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-20 h-20 bg-amber-500/15 rounded-2xl flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                          >
                            <Package className="w-10 h-10 text-amber-400" />
                          </motion.div>
                          <p className="text-amber-300/60 text-xs animate-pulse">{t.encrypting}</p>
                        </motion.div>
                      )}

                      {capsuleStep === 'done' && (
                        <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center py-16 space-y-5">
                          <div className="w-20 h-20 bg-green-500/15 rounded-2xl flex items-center justify-center border border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                            <Check className="w-10 h-10 text-green-400" />
                          </div>
                          <div>
                            <h4 className="text-white text-lg font-bold mb-1">{t.capsuleCreated}</h4>
                            <p className="text-white/40 text-xs">{t.capsuleCreatedDesc}</p>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Capsule Opening Animation ── */}
                      {capsuleStep === 'opening' && (() => {
                        const cap = capsules.find(c => c.id === openingCapsuleId);
                        return (
                          <motion.div key="opening" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center py-12 space-y-5">
                            <div className="relative">
                              <motion.div
                                animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-24 h-24 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)]"
                              >
                                <Package className="w-12 h-12 text-amber-400" />
                              </motion.div>
                              {/* Particle burst effect */}
                              {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0, opacity: 1 }}
                                  animate={{
                                    scale: [0, 1],
                                    opacity: [1, 0],
                                    x: [0, Math.cos(i * Math.PI / 4) * 50],
                                    y: [0, Math.sin(i * Math.PI / 4) * 50],
                                  }}
                                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-amber-400/60"
                                />
                              ))}
                            </div>
                            <div>
                              <h4 className="text-white text-lg font-bold mb-1">{t.capsuleOpening}</h4>
                              {cap && <p className="text-amber-300/50 text-xs">{cap.title}</p>}
                            </div>
                          </motion.div>
                        );
                      })()}

                      {/* ── Capsule Revealed Content ── */}
                      {capsuleStep === 'revealed' && (() => {
                        const cap = capsules.find(c => c.id === openingCapsuleId);
                        if (!cap) return null;
                        return (
                          <motion.div key="revealed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                            {/* Back button */}
                            <button
                              onClick={handleCapsuleBack}
                              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-[10px] font-semibold transition-colors"
                            >
                              <ArrowLeft className="w-3 h-3" /> {t.capsuleBack}
                            </button>

                            {/* Capsule header card */}
                            <div className="relative bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl border border-amber-500/20 p-5 overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none" />
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-xl bg-green-500/15 border border-green-500/30">
                                  <Gift className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-white font-bold text-sm">{cap.title}</h3>
                                  <p className="text-white/30 text-[10px] mt-0.5">{cap.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-[9px] text-white/30">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {t.capsuleCreatedDate} {new Date(cap.createdAt).toLocaleDateString()}
                                </span>
                                {cap.openedAt && (
                                  <span className="flex items-center gap-1 text-green-400/60">
                                    <Check className="w-3 h-3" />
                                    {t.capsuleOpenedDate} {new Date(cap.openedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {cap.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {cap.tags.map((tag, i) => (
                                    <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300/60 border border-purple-500/15">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Revealed content */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="bg-white/[0.04] border border-white/10 rounded-xl p-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">{t.capsuleContent}</span>
                              </div>
                              {cap.content ? (
                                <p className="text-white/70 text-xs leading-relaxed">{cap.content}</p>
                              ) : (
                                <p className="text-white/40 text-xs italic">
                                  {language === 'zh'
                                    ? `「这个胶囊封存了 ${cap.messageCount} 条珍贵的记忆，由 ${cap.contributors.join('、')} 共同创造。」`
                                    : `This capsule holds ${cap.messageCount} precious memories, created by ${cap.contributors.join(', ')}.`}
                                </p>
                              )}
                              {/* Visual flourish */}
                              <div className="flex items-center justify-center gap-1.5 mt-4 pt-3 border-t border-white/[0.06]">
                                {cap.contributors.map((c, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/15 text-purple-300/60 text-[8px] font-medium">
                                    {c}
                                  </span>
                                ))}
                                <span className="text-white/15 text-[8px] ml-1">{cap.messageCount} {t.messages}</span>
                              </div>
                            </motion.div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* ═══════ TAB 3: MESSAGE WALL ═══════ */}
                {activeTab === 'wall' && (
                  <motion.div key="wall" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="p-5 space-y-4">
                    {/* Wall Header */}
                    <div className="text-center pb-1">
                      <h3 className="text-white/70 text-xs font-bold">{t.wallTitle}</h3>
                      <p className="text-white/20 text-[9px] font-mono">{t.wallSubtitle}</p>
                      <div className="flex items-center justify-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-[8px] text-green-400/60 bg-green-500/10 px-2 py-0.5 rounded-full">
                          <Shield className="w-2.5 h-2.5" />{t.wallAutoMod}
                        </span>
                        <span className="text-[8px] text-white/15">{wallMessages.length} {t.messages}</span>
                      </div>
                    </div>

                    {/* Post Input */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3 space-y-2">
                      <textarea
                        value={wallInput}
                        onChange={(e) => setWallInput(e.target.value.slice(0, 500))}
                        placeholder={t.wallInput}
                        rows={2}
                        maxLength={500}
                        aria-label={t.wallInput}
                        className="w-full bg-transparent text-white text-xs resize-none focus:outline-none placeholder:text-white/15"
                      />
                      {/* UGC Validation hint + char counter */}
                      <div className="flex items-center justify-between">
                        {wallValidation ? (
                          <span className="text-amber-400/70 text-[8px] font-medium flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" />{wallValidation}
                          </span>
                        ) : wallInput.length > 0 ? (
                          <span className="text-white/15 text-[8px] font-mono">{wallInput.length}/500</span>
                        ) : <span />}
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setWallAnonymous(a => !a)}
                          aria-label={t.wallAnonymous}
                          aria-pressed={wallAnonymous}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-semibold border transition-all ${
                            wallAnonymous
                              ? 'bg-purple-500/15 border-purple-500/25 text-purple-300'
                              : 'border-white/[0.06] text-white/25 hover:text-white/40'
                          }`}
                        >
                          {wallAnonymous ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                          {t.wallAnonymous}
                        </button>
                        <motion.button
                          whileHover={wallInput.trim() && !wallValidation ? { scale: 1.05 } : {}}
                          whileTap={wallInput.trim() && !wallValidation ? { scale: 0.95 } : {}}
                          onClick={handleWallPost}
                          disabled={!wallInput.trim() || !!wallValidation}
                          aria-label={t.wallPost}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white text-[10px] font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <Send className="w-3 h-3" />{t.wallPost}
                        </motion.button>
                      </div>
                    </div>

                    {/* Wall Messages */}
                    {wallMessages.length === 0 ? (
                      <p className="text-white/15 text-xs text-center py-8">{t.wallEmpty}</p>
                    ) : (
                      <div className="space-y-2.5">
                        {wallMessages.map((msg, i) => (
                          <motion.div
                            key={msg.id}
                            initial={msg.isPushed ? { opacity: 0, y: -20, scale: 0.95 } : { opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: msg.isPushed ? 0 : i * 0.03 }}
                            layout
                            className={`bg-white/[0.03] border rounded-xl p-3 hover:bg-white/[0.05] transition-colors group ${
                              msg.isPushed ? 'border-purple-500/20' : 'border-white/[0.06]'
                            }`}
                          >
                            {/* WS 推送标记 */}
                            {msg.isPushed && (
                              <div className="flex items-center gap-1 mb-1.5">
                                <Zap className="w-2.5 h-2.5 text-purple-400" />
                                <span className="text-[7px] text-purple-400/60 font-bold uppercase">{t.wsNewMsg}</span>
                              </div>
                            )}
                            <div className="flex items-start gap-2.5">
                              <div className="text-lg flex-shrink-0 mt-0.5">{msg.senderAvatar}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                  <span className="text-white/60 text-[10px] font-semibold">{msg.senderName}</span>
                                  <MHeartBadge level={msg.mheartLevel} lang={language} />
                                  <span className="text-white/15 text-[8px]">{timeAgo(msg.createdAt, language)}</span>
                                  {msg.encrypted && <Lock className="w-2.5 h-2.5 text-green-400/50" />}
                                  <StatusIcon status={msg.status} />
                                  {msg.isAnonymous && <span className="text-[7px] text-purple-400/40 bg-purple-500/10 px-1 py-px rounded">{t.wallAnonymous}</span>}
                                </div>
                                {msg.type === 'text' ? (
                                  <p className="text-white/70 text-xs leading-relaxed">{msg.content}</p>
                                ) : msg.type === 'voice' ? (
                                  <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-2.5 py-1.5 w-fit">
                                    <Volume2 className="w-3 h-3 text-purple-400" />
                                    <div className="flex gap-px">
                                      {Array.from({ length: 16 }).map((_, j) => (
                                        <div key={j} className="w-0.5 bg-purple-400/50 rounded-full" style={{ height: `${3 + Math.sin(j * 0.7) * 5 + 3}px` }} />
                                      ))}
                                    </div>
                                    <span className="text-white/30 text-[9px] font-mono">{msg.audioDuration}{t.sec}</span>
                                  </div>
                                ) : null}
                                {/* Actions */}
                                <div className="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleWallLike(msg.id)} className={`flex items-center gap-1 text-[9px] transition-colors ${msg.isLiked ? 'text-pink-400' : 'text-white/25 hover:text-pink-400'}`}>
                                    <Heart className={`w-3 h-3 ${msg.isLiked ? 'fill-current' : ''}`} />{msg.likes > 0 && msg.likes}
                                  </button>
                                  {(msg.senderName === '我' || msg.senderName === 'Me') && (
                                    <button onClick={() => handleWallDelete(msg.id)} className="flex items-center gap-1 text-[9px] text-white/25 hover:text-red-400 transition-colors">
                                      <X className="w-3 h-3" />{t.wallDelete}
                                    </button>
                                  )}
                                  <button className="flex items-center gap-1 text-[9px] text-white/25 hover:text-yellow-400 transition-colors">
                                    <Flag className="w-3 h-3" />{t.wallReport}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
