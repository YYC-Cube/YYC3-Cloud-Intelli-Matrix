import { useState, useRef, useMemo } from 'react';
import {
  X, User, Camera, Pencil, Check, Music, Heart, Clock,
  Headphones, Globe, Palette, Bell, Shield, Zap, Star,
  Award, TrendingUp, ChevronRight, FileMusic, BadgeCheck,
  Send, Upload, Share2, ExternalLink, Play, Trophy,
  Disc3, Sparkles, BarChart3, Crown, Flame,
  CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import dmLogoDi from "figma:asset/1d776e4d931e39ab6811569ef7332bc442b04dee.png";

// ─── 类型引入（对齐 config/dmusic_types.ts）───
import type {
  UserStarPower, UserPreferences as DmPreferences,
} from '../../../config/dmusic_types';

// ─── MHeart 等级系统（对齐 dmusic_variables.json.mheart.levels）───
const MHEART_LEVELS: { level: number; min: number; max: number | null; name: string; nameEn: string; color: string }[] = [
  { level: 1, min: 0, max: 99, name: '初心者', nameEn: 'Newcomer', color: '#9E9E9E' },
  { level: 2, min: 100, max: 299, name: '探索者', nameEn: 'Explorer', color: '#8BC34A' },
  { level: 3, min: 300, max: 599, name: '追随者', nameEn: 'Follower', color: '#03A9F4' },
  { level: 4, min: 600, max: 999, name: '热爱者', nameEn: 'Devotee', color: '#2196F3' },
  { level: 5, min: 1000, max: 1999, name: '守护者', nameEn: 'Guardian', color: '#673AB7' },
  { level: 6, min: 2000, max: 3999, name: '星光者', nameEn: 'Starlight', color: '#9C27B0' },
  { level: 7, min: 4000, max: 7999, name: '星辰者', nameEn: 'Stellar', color: '#E91E63' },
  { level: 8, min: 8000, max: 15999, name: '银河者', nameEn: 'Galactic', color: '#FF5722' },
  { level: 9, min: 16000, max: 31999, name: '宇宙者', nameEn: 'Cosmic', color: '#FF9800' },
  { level: 10, min: 32000, max: null, name: '永恒者', nameEn: 'Eternal', color: '#FFD700' },
];

// ─── VIP 等级系统（对齐 dmusic_variables.json.vip.levels）───
const VIP_LEVELS: { level: number; name: string; nameEn: string; color: string; expRequired: number }[] = [
  { level: 1, name: '普通会员', nameEn: 'Basic', color: '#9E9E9E', expRequired: 0 },
  { level: 2, name: '青铜会员', nameEn: 'Bronze', color: '#CD7F32', expRequired: 1000 },
  { level: 3, name: '白银会员', nameEn: 'Silver', color: '#C0C0C0', expRequired: 2500 },
  { level: 4, name: '黄金会员', nameEn: 'Gold', color: '#FFD700', expRequired: 5500 },
  { level: 5, name: '铂金会员', nameEn: 'Platinum', color: '#E5E4E2', expRequired: 10000 },
  { level: 6, name: '钻石会员', nameEn: 'Diamond', color: '#B9F2FF', expRequired: 17500 },
  { level: 7, name: '星耀会员', nameEn: 'Astral', color: '#9C27B0', expRequired: 28000 },
  { level: 8, name: '王者会员', nameEn: 'Royal', color: '#FF5722', expRequired: 42000 },
  { level: 9, name: '传奇会员', nameEn: 'Legendary', color: '#E91E63', expRequired: 60000 },
  { level: 10, name: '至尊会员', nameEn: 'Supreme', color: '#FFD700', expRequired: 100000 },
];

function getMHeartLevel(value: number) {
  return MHEART_LEVELS.find(l => value >= l.min && (l.max === null || value <= l.max)) || MHEART_LEVELS[0];
}

function getVipLevel(exp: number) {
  let result = VIP_LEVELS[0];
  for (const l of VIP_LEVELS) {
    if (exp >= l.expRequired) result = l;
  }
  return result;
}

function getNextVipLevel(exp: number) {
  for (const l of VIP_LEVELS) {
    if (exp < l.expRequired) return l;
  }
  return null;
}

// ─── 类型桥接：UserProfile ↔ dmusic_types.ts ───
/** 从本地 UserProfile 提取 UserStarPower 兼容数据（用于跨面板通信） */
export function toStarPowerData(p: { starPower: number; mheartValue: number; vipExp: number; dailyCheckinStreak: number }): Pick<UserStarPower, 'totalStarPower' | 'availableStarPower' | 'mheartValue' | 'mheartLevel' | 'vipExp' | 'vipLevel' | 'dailyCheckinStreak'> {
  const mh = getMHeartLevel(p.mheartValue);
  const vip = getVipLevel(p.vipExp);
  return {
    totalStarPower: p.starPower,
    availableStarPower: p.starPower,
    mheartValue: p.mheartValue,
    mheartLevel: mh.level,
    vipExp: p.vipExp,
    vipLevel: vip.level,
    dailyCheckinStreak: p.dailyCheckinStreak,
  };
}

/** 从 DmPreferences 映射到本地 UserProfile 偏好字段 */
export function fromDmPreferences(prefs: Partial<DmPreferences>, current: { quality: string; notifications: boolean }): { quality: string; notifications: boolean } {
  return {
    quality: prefs.defaultQuality === 'low' || prefs.defaultQuality === 'medium' ? 'standard' : prefs.defaultQuality === 'lossless' ? 'lossless' : current.quality,
    notifications: prefs.notificationEnabled ?? current.notifications,
  };
}

interface TrackInfo {
  id: number;
  title: string;
  albumId: string | null;
  isVideo?: boolean;
}

interface PlayRecordInfo {
  trackId: number;
  playCount: number;
  totalDuration: number;
  lastPlayed: number;
  completionRate: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  totalTracks: number;
  totalPlays: number;
  totalMinutes: number;
  onLanguageToggle: () => void;
  tracks?: TrackInfo[];
  playRecords?: PlayRecordInfo[];
  onOpenPanel?: (panel: string) => void;
}

interface UserProfile {
  name: string;
  status: string;
  avatar: string | null;
  theme: 'purple' | 'blue' | 'emerald' | 'rose' | 'amber';
  quality: 'standard' | 'high' | 'lossless';
  notifications: boolean;
  favoriteGenre: string;
  // ── 对齐 dmusic_types.ts UserStarPower ──
  starPower: number;
  mheartValue: number;
  vipExp: number;
  dailyCheckinStreak: number;
}

const STORAGE_KEY = 'dmusic_user_profile';

function loadProfile(): UserProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultProfile();
  } catch (_e) { return defaultProfile(); }
}

function saveProfile(p: UserProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function defaultProfile(): UserProfile {
  return {
    name: 'D-Music User',
    status: '正在享受音乐中...',
    avatar: null,
    theme: 'purple',
    quality: 'high',
    notifications: true,
    favoriteGenre: 'Pop',
    starPower: 360,
    mheartValue: 420,
    vipExp: 2800,
    dailyCheckinStreak: 7,
  };
}

type ProfileTab = 'overview' | 'works' | 'certification' | 'distribution';

const T = {
  zh: {
    title: '「个人资料」',
    editProfile: '「编辑资料」',
    name: '「昵称」',
    status: '「个性签名」',
    stats: '「数据概览」',
    tracks: '「曲库」',
    plays: '「播放」',
    minutes: '「分钟」',
    level: '「等级」',
    settings: '「偏好设置」',
    language: '「语言」',
    theme: '「主题色」',
    quality: '「音质」',
    notifications: '「通知」',
    qualityOpts: { standard: '标准', high: '高品质', lossless: '无损' } as Record<string, string>,
    themeOpts: { purple: '紫罗兰', blue: '深海蓝', emerald: '翡翠绿', rose: '玫瑰红', amber: '琥珀金' } as Record<string, string>,
    favoriteGenre: '「偏好曲风」',
    genres: ['Pop', 'Rock', 'Jazz', 'Electronic', 'Folk', 'Hip-Hop', 'Classical', 'R&B'],
    achievements: '「成就」',
    saved: '「已保存」',
    save: '「保存更改」',
    memberSince: '「加入时间」',
    listeningRank: '「听歌段位」',
    ranks: ['入门新手', '音乐学徒', '节拍达人', '旋律大师', '音乐之神'],
    // Star Power / MHeart / VIP
    starPowerLabel: '「星力值」',
    mheartLabel: '「M❤️值」',
    vipLabel: '「VIP 等级」',
    checkinStreak: '「连续签到」',
    checkinDays: '「天」',
    starPowerGrowth: '「星力成长」',
    // Tabs
    tabOverview: '「概览」',
    tabWorks: '「作品」',
    tabCert: '「认证」',
    tabDistrib: '「分发」',
    // Works
    worksTitle: '「作品管理」',
    worksEmpty: '「暂无作品，上传音乐开始创作之旅」',
    sortByPlays: '「按播放量」',
    sortByRecent: '「按最近」',
    sortByName: '「按名称」',
    totalDuration: '「时长」',
    completionRate: '「完成度」',
    // Certification
    certTitle: '「原创认证」',
    certDesc: '「通过原创认证，获得专属标识和推荐加权」',
    certStatus: '「认证状态」',
    certPending: '「审核中」',
    certApproved: '「已认证」',
    certNone: '「未认证」',
    certApply: '「申请认证」',
    certRequirements: '「认证条件」',
    certReq1: '「至少上传 3 首原创作品」',
    certReq2: '「累计播放量 ≥ 50 次」',
    certReq3: '「作品完成度 ≥ 80%」',
    certBenefits: '「认证权益」',
    certBen1: '「专属原创认证徽章」',
    certBen2: '「搜索和推荐权重 +30%」',
    certBen3: '「星力值每日加成 ×1.5」',
    certBen4: '「优先进入编辑精选池」',
    // Distribution
    distribTitle: '「音乐分发」',
    distribDesc: '「将作品分发到多个平台，扩大影响力」',
    distribSteps: '「分发流程」',
    distribStep1: '「选择作品」',
    distribStep2: '「填写元数据」',
    distribStep3: '「质量检测」',
    distribStep4: '「提交审核」',
    distribStep5: '「全网分发」',
    distribPlatforms: '「目标平台」',
    distribStart: '「开始分发」',
    distribNoTracks: '「请先上传作品后再进行分发」',
    distribSelected: '「已选作品」',
  },
  en: {
    title: 'Profile',
    editProfile: 'Edit Profile',
    name: 'Name',
    status: 'Status',
    stats: 'Overview',
    tracks: 'Tracks',
    plays: 'Plays',
    minutes: 'Minutes',
    level: 'Level',
    settings: 'Preferences',
    language: 'Language',
    theme: 'Theme',
    quality: 'Quality',
    notifications: 'Notifications',
    qualityOpts: { standard: 'Standard', high: 'High', lossless: 'Lossless' } as Record<string, string>,
    themeOpts: { purple: 'Violet', blue: 'Ocean', emerald: 'Emerald', rose: 'Rose', amber: 'Amber' } as Record<string, string>,
    favoriteGenre: 'Favorite Genre',
    genres: ['Pop', 'Rock', 'Jazz', 'Electronic', 'Folk', 'Hip-Hop', 'Classical', 'R&B'],
    achievements: 'Achievements',
    saved: 'Saved!',
    save: 'Save Changes',
    memberSince: 'Member Since',
    listeningRank: 'Rank',
    ranks: ['Newcomer', 'Apprentice', 'Beat Master', 'Melody Sage', 'Music God'],
    starPowerLabel: 'Star Power',
    mheartLabel: 'M❤️ Value',
    vipLabel: 'VIP Level',
    checkinStreak: 'Check-in Streak',
    checkinDays: 'days',
    starPowerGrowth: 'Star Power Growth',
    // Tabs
    tabOverview: 'Overview',
    tabWorks: 'Works',
    tabCert: 'Verify',
    tabDistrib: 'Distribute',
    // Works
    worksTitle: 'Works Management',
    worksEmpty: 'No works yet. Upload music to start your journey.',
    sortByPlays: 'By Plays',
    sortByRecent: 'By Recent',
    sortByName: 'By Name',
    totalDuration: 'Duration',
    completionRate: 'Completion',
    // Certification
    certTitle: 'Original Certification',
    certDesc: 'Get certified as an original creator for badges and boost.',
    certStatus: 'Status',
    certPending: 'Pending',
    certApproved: 'Certified',
    certNone: 'Not Certified',
    certApply: 'Apply for Certification',
    certRequirements: 'Requirements',
    certReq1: 'Upload at least 3 original works',
    certReq2: 'Total plays ≥ 50',
    certReq3: 'Completion rate ≥ 80%',
    certBenefits: 'Benefits',
    certBen1: 'Exclusive original creator badge',
    certBen2: 'Search & recommendation +30% weight',
    certBen3: 'Star Power daily bonus ×1.5',
    certBen4: "Priority for editor's pick pool",
    // Distribution
    distribTitle: 'Music Distribution',
    distribDesc: 'Distribute your works across platforms to grow your audience.',
    distribSteps: 'Distribution Flow',
    distribStep1: 'Select Works',
    distribStep2: 'Metadata',
    distribStep3: 'Quality Check',
    distribStep4: 'Submit Review',
    distribStep5: 'Global Release',
    distribPlatforms: 'Target Platforms',
    distribStart: 'Start Distribution',
    distribNoTracks: 'Please upload works before distributing.',
    distribSelected: 'Selected',
  },
};

export function ProfilePanel({ isOpen, onClose, language, totalTracks, totalPlays, totalMinutes, onLanguageToggle, tracks = [], playRecords = [], onOpenPanel }: Props) {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editStatus, setEditStatus] = useState(profile.status);
  const [saveFlash, setSaveFlash] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [worksSortBy, setWorksSortBy] = useState<'plays' | 'recent' | 'name'>('plays');
  const [certStatus, setCertStatus] = useState<'none' | 'pending' | 'approved'>(() => {
    try { return (localStorage.getItem('dmusic_cert_status') as any) || 'none'; } catch { return 'none'; }
  });
  const [distribStep, setDistribStep] = useState(0);
  const [distribSelectedIds, setDistribSelectedIds] = useState<Set<number>>(new Set());
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const t = T[language];

  const rankIndex = Math.min(Math.floor(totalPlays / 20), 4);
  const levelProgress = Math.min((totalPlays % 20) / 20, 1);

  // Sort tracks for works management
  const sortedTracks = useMemo(() => {
    const recordMap = new Map<number, PlayRecordInfo>();
    playRecords.forEach(r => recordMap.set(r.trackId, r));
    const enriched = tracks.map(t => ({
      ...t,
      record: recordMap.get(t.id),
    }));
    switch (worksSortBy) {
      case 'plays':
        return enriched.sort((a, b) => (b.record?.playCount || 0) - (a.record?.playCount || 0));
      case 'recent':
        return enriched.sort((a, b) => (b.record?.lastPlayed || 0) - (a.record?.lastPlayed || 0));
      case 'name':
        return enriched.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return enriched;
    }
  }, [tracks, playRecords, worksSortBy]);

  // Certification check
  const avgCompletion = playRecords.length > 0
    ? playRecords.reduce((s, r) => s + r.completionRate, 0) / playRecords.length
    : 0;
  const certReqs = [
    { met: totalTracks >= 3, label: t.certReq1 },
    { met: totalPlays >= 50, label: t.certReq2 },
    { met: avgCompletion >= 0.8, label: t.certReq3 },
  ];
  const allReqsMet = certReqs.every(r => r.met);

  const handleApplyCert = () => {
    if (!allReqsMet) return;
    setCertStatus('pending');
    localStorage.setItem('dmusic_cert_status', 'pending');
    // Simulate approval after 3 seconds
    setTimeout(() => {
      setCertStatus('approved');
      localStorage.setItem('dmusic_cert_status', 'approved');
    }, 3000);
  };

  const toggleDistribTrack = (id: number) => {
    setDistribSelectedIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSave = () => {
    const updated = { ...profile, name: editName, status: editStatus };
    setProfile(updated);
    saveProfile(updated);
    setEditing(false);
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 1500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const updated = { ...profile, avatar: reader.result as string };
        setProfile(updated);
        saveProfile(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const updatePref = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    saveProfile(updated);
  };

  const themeColors: Record<string, string> = {
    purple: 'bg-purple-500', blue: 'bg-blue-500', emerald: 'bg-emerald-500', rose: 'bg-rose-500', amber: 'bg-amber-500',
  };

  const stats = [
    { icon: Music, label: t.tracks, value: totalTracks, color: 'text-purple-400', bg: 'from-purple-500/15 to-purple-600/5' },
    { icon: Heart, label: t.plays, value: totalPlays, color: 'text-pink-400', bg: 'from-pink-500/15 to-pink-600/5' },
    { icon: Clock, label: t.minutes, value: totalMinutes, color: 'text-cyan-400', bg: 'from-cyan-500/15 to-cyan-600/5' },
    { icon: Star, label: t.level, value: rankIndex + 1, color: 'text-amber-400', bg: 'from-amber-500/15 to-amber-600/5' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-purple-900/30 backdrop-blur-md z-40 rounded-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute inset-0 sm:inset-4 md:inset-8 bg-purple-950/30 backdrop-blur-2xl sm:rounded-2xl border-0 sm:border border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={language === 'zh' ? '个人中心' : 'Profile Panel'}
          >
            {/* Header banner with brand watermark */}
            <div className="relative h-28 bg-gradient-to-br from-purple-600/40 via-blue-600/30 to-pink-600/20 overflow-hidden flex-shrink-0">
              {/* D-Music watermark */}
              <img
                src={dmLogoDi}
                alt=""
                className="absolute right-4 top-1/2 -translate-y-1/2 h-16 object-contain opacity-[0.08]"
                style={{ filter: 'brightness(3)' }}
              />
              {/* Animated grid lines */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
              <motion.div
                animate={{ x: [0, 40], y: [0, 40] }}
                transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                className="absolute inset-[-40px] opacity-15"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
              <div className="absolute top-3 right-3">
                <button onClick={onClose} className="p-2 hover:bg-white/15 rounded-full text-white/70 hover:text-white transition-all" aria-label={language === 'zh' ? '关闭' : 'Close'}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Avatar */}
              <div className="absolute -bottom-8 left-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-purple-950/60 backdrop-blur-xl border-2 border-white/20 overflow-hidden shadow-xl">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0c1020] to-[#0a0816]">
                        <img src={dmLogoDi} alt="D-Music" className="w-16 h-16 object-contain" style={{ filter: 'brightness(1.3) drop-shadow(0 2px 8px rgba(59,130,246,0.2))' }} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex border-b border-white/[0.06] px-1 pt-10 bg-[#0a0816]/50 relative z-10">
              {([
                { id: 'overview' as ProfileTab, label: t.tabOverview, icon: User },
                { id: 'works' as ProfileTab, label: t.tabWorks, icon: FileMusic },
                { id: 'certification' as ProfileTab, label: t.tabCert, icon: BadgeCheck },
                { id: 'distribution' as ProfileTab, label: t.tabDistrib, icon: Send },
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-purple-400'
                      : 'text-white/40 border-transparent hover:text-white/60'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full">

            <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 pt-2">
              {/* Name & Status */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  {editing ? (
                    <div className="space-y-2">
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-purple-500/50"
                        placeholder={t.name}
                      />
                      <input
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                        className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-1.5 text-white/70 text-xs focus:outline-none focus:border-purple-500/50"
                        placeholder={t.status}
                      />
                      <button
                        onClick={handleSave}
                        className="px-4 py-1.5 rounded-lg bg-purple-500/25 text-purple-300 text-xs font-semibold border border-purple-500/30 hover:bg-purple-500/35 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3 h-3" /> {t.save}
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-white font-bold text-lg truncate">{profile.name}</h3>
                      <p className="text-white/40 text-xs mt-0.5 truncate">{profile.status}</p>
                    </>
                  )}
                </div>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setEditName(profile.name); setEditStatus(profile.status); }}
                    className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white/70 transition-all flex-shrink-0 ml-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Rank bar */}
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span className="text-white/70 text-xs font-medium">{t.listeningRank}</span>
                  </div>
                  <span className="text-amber-300 text-xs font-bold">{t.ranks[rankIndex]}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelProgress * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-white/25 text-[9px]">Lv.{rankIndex + 1}</span>
                  <span className="text-white/25 text-[9px]">Lv.{Math.min(rankIndex + 2, 5)}</span>
                </div>
              </div>

              {/* Stats grid */}
              <div>
                <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" /> {t.stats}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {stats.map(s => (
                    <motion.div
                      key={s.label}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`bg-gradient-to-b ${s.bg} border border-white/[0.06] rounded-xl p-2.5 text-center`}
                    >
                      <s.icon className={`w-4 h-4 ${s.color} mx-auto mb-1`} />
                      <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                      <div className="text-white/30 text-[8px] font-medium mt-0.5">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ━━━ Star Power / MHeart / VIP Dashboard ━━━ */}
              <div>
                <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> {t.starPowerGrowth}
                </div>
                {(() => {
                  const mh = getMHeartLevel(profile.mheartValue);
                  const vip = getVipLevel(profile.vipExp);
                  const nextVip = getNextVipLevel(profile.vipExp);
                  const vipProgress = nextVip ? ((profile.vipExp - vip.expRequired) / (nextVip.expRequired - vip.expRequired)) : 1;
                  const mhProgress = mh.max !== null ? ((profile.mheartValue - mh.min) / (mh.max - mh.min + 1)) : 1;
                  return (
                    <div className="space-y-2">
                      {/* Star Power + Check-in streak row */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-purple-500/15 to-blue-500/10 border border-purple-500/15 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Star className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-white/50 text-[9px] font-semibold">{t.starPowerLabel}</span>
                          </div>
                          <div className="text-purple-300 text-lg font-bold">{profile.starPower.toLocaleString()}</div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/15 rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Flame className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-white/50 text-[9px] font-semibold">{t.checkinStreak}</span>
                          </div>
                          <div className="text-amber-300 text-lg font-bold">{profile.dailyCheckinStreak} <span className="text-[10px] text-white/30 font-normal">{t.checkinDays}</span></div>
                        </motion.div>
                      </div>

                      {/* MHeart progress */}
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5" style={{ color: mh.color }} />
                            <span className="text-white/50 text-[9px] font-semibold">{t.mheartLabel}</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: mh.color, background: `${mh.color}18`, borderColor: `${mh.color}30`, borderWidth: 1, borderStyle: 'solid' }}>
                            Lv.{mh.level} {language === 'zh' ? mh.name : mh.nameEn}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${mhProgress * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, ${mh.color}80, ${mh.color})` }}
                          />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-white/20 text-[8px]">{profile.mheartValue}</span>
                          <span className="text-white/20 text-[8px]">{mh.max !== null ? mh.max + 1 : '∞'}</span>
                        </div>
                      </div>

                      {/* VIP progress */}
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5" style={{ color: vip.color }} />
                            <span className="text-white/50 text-[9px] font-semibold">{t.vipLabel}</span>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: vip.color, background: `${vip.color}18`, borderColor: `${vip.color}30`, borderWidth: 1, borderStyle: 'solid' }}>
                            Lv.{vip.level} {language === 'zh' ? vip.name : vip.nameEn}
                          </span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${vipProgress * 100}%` }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(to right, ${vip.color}80, ${vip.color})` }}
                          />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-white/20 text-[8px]">{profile.vipExp} EXP</span>
                          <span className="text-white/20 text-[8px]">{nextVip ? `${nextVip.expRequired} EXP` : 'MAX'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Settings */}
              <div>
                <div className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> {t.settings}
                </div>
                <div className="space-y-1.5">
                  {/* Language */}
                  <button
                    onClick={onLanguageToggle}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-white/70 text-xs font-medium">{t.language}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/40 text-xs">
                      <span>{language === 'zh' ? '中文' : 'English'}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* Theme */}
                  <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span className="text-white/70 text-xs font-medium">{t.theme}</span>
                    </div>
                    <div className="flex gap-2">
                      {Object.entries(themeColors).map(([key, cls]) => (
                        <button
                          key={key}
                          onClick={() => updatePref('theme', key as any)}
                          className={`w-7 h-7 rounded-lg ${cls} transition-all ${
                            profile.theme === key ? 'ring-2 ring-white/50 scale-110' : 'ring-1 ring-white/10 opacity-60 hover:opacity-100'
                          }`}
                          title={t.themeOpts[key]}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Headphones className="w-4 h-4 text-cyan-400" />
                      <span className="text-white/70 text-xs font-medium">{t.quality}</span>
                    </div>
                    <div className="flex gap-1.5">
                      {(['standard', 'high', 'lossless'] as const).map(q => (
                        <button
                          key={q}
                          onClick={() => updatePref('quality', q)}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                            profile.quality === q
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                              : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          {t.qualityOpts[q]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <Music className="w-4 h-4 text-pink-400" />
                      <span className="text-white/70 text-xs font-medium">{t.favoriteGenre}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {t.genres.map(g => (
                        <button
                          key={g}
                          onClick={() => updatePref('favoriteGenre', g)}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all border ${
                            profile.favoriteGenre === g
                              ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                              : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <button
                    onClick={() => updatePref('notifications', !profile.notifications)}
                    className="w-full flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-amber-400" />
                      <span className="text-white/70 text-xs font-medium">{t.notifications}</span>
                    </div>
                    <div className={`w-9 h-5 rounded-full relative transition-all ${
                      profile.notifications ? 'bg-purple-500/50' : 'bg-white/10'
                    }`}>
                      <motion.div
                        animate={{ x: profile.notifications ? 16 : 2 }}
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md"
                      />
                    </div>
                  </button>

                  {/* Security placeholder */}
                  <div className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span className="text-white/70 text-xs font-medium">{language === 'zh' ? '安全与隐私' : 'Security & Privacy'}</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">{language === 'zh' ? '已保护' : 'Protected'}</span>
                  </div>
                </div>
              </div>

            </motion.div>
            )}

            {/* ━━━ WORKS TAB ━━━ */}
            {activeTab === 'works' && (
            <motion.div key="works" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileMusic className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-semibold">{t.worksTitle}</span>
                  <span className="text-white/30 text-[10px] font-mono">{tracks.length}</span>
                </div>
                <div className="flex gap-1">
                  {([
                    { key: 'plays' as const, label: t.sortByPlays },
                    { key: 'recent' as const, label: t.sortByRecent },
                    { key: 'name' as const, label: t.sortByName },
                  ]).map(s => (
                    <button
                      key={s.key}
                      onClick={() => setWorksSortBy(s.key)}
                      className={`px-2 py-1 rounded-md text-[9px] font-semibold transition-all ${
                        worksSortBy === s.key
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/25'
                          : 'bg-white/[0.04] text-white/30 border border-transparent hover:bg-white/[0.06]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {sortedTracks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Disc3 className="w-12 h-12 text-white/10 mb-3" />
                  <p className="text-white/30 text-xs">{t.worksEmpty}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {sortedTracks.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                        {item.isVideo ? (
                          <Play className="w-4 h-4 text-indigo-400/70" />
                        ) : (
                          <Music className="w-4 h-4 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/80 text-xs font-medium truncate">{item.title}</span>
                          {item.isVideo && (
                            <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-300 text-[7px] font-bold rounded border border-indigo-500/25 flex-shrink-0">MV</span>
                          )}
                          {certStatus === 'approved' && (
                            <BadgeCheck className="w-3 h-3 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-white/25 text-[9px] flex items-center gap-0.5">
                            <Play className="w-2.5 h-2.5" />{item.record?.playCount || 0}
                          </span>
                          {item.record && item.record.completionRate > 0 && (
                            <span className="text-cyan-400/40 text-[9px]">
                              {Math.round(item.record.completionRate * 100)}%
                            </span>
                          )}
                          {item.record && item.record.totalDuration > 0 && (
                            <span className="text-white/20 text-[9px]">
                              {Math.floor(item.record.totalDuration / 60)}m
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors" title={language === 'zh' ? '「分享」' : 'Share'}>
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors" title={language === 'zh' ? '「统计」' : 'Stats'}>
                          <BarChart3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              {onOpenPanel && (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { onClose(); onOpenPanel('starpower'); }}
                    className="px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-500/15 transition-all">
                    <Trophy className="w-3.5 h-3.5" />{language === 'zh' ? '「星力排行榜」' : 'Star Rankings'}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { onClose(); onOpenPanel('incentive'); }}
                    className="px-3 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-semibold flex items-center justify-center gap-1.5 hover:bg-pink-500/15 transition-all">
                    <Heart className="w-3.5 h-3.5" />{language === 'zh' ? '「M❤️激励」' : 'M❤️ Incentive'}
                  </motion.button>
                </div>
              )}
            </motion.div>
            )}

            {/* ━━━ CERTIFICATION TAB ━━━ */}
            {activeTab === 'certification' && (
            <motion.div key="certification" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 pt-2">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/15 p-4 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <BadgeCheck className={`w-14 h-14 mx-auto mb-3 ${
                  certStatus === 'approved' ? 'text-blue-400' :
                  certStatus === 'pending' ? 'text-amber-400' : 'text-white/20'
                }`} />
                <h3 className="text-white font-bold text-base mb-1">{t.certTitle}</h3>
                <p className="text-white/40 text-[10px] mb-3">{t.certDesc}</p>

                {/* Status Badge */}
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  certStatus === 'approved' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/25' :
                  certStatus === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/25' :
                  'bg-white/10 text-white/40 border border-white/10'
                }`}>
                  {certStatus === 'approved' ? <CheckCircle className="w-3.5 h-3.5" /> :
                   certStatus === 'pending' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                   <AlertCircle className="w-3.5 h-3.5" />}
                  {t.certStatus}: {certStatus === 'approved' ? t.certApproved : certStatus === 'pending' ? t.certPending : t.certNone}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{t.certRequirements}</span>
                </div>
                <div className="p-3 space-y-2">
                  {certReqs.map((req, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      {req.met ? (
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-white/20 flex-shrink-0" />
                      )}
                      <span className={`text-[11px] font-medium ${req.met ? 'text-white/70' : 'text-white/35'}`}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-white text-sm font-semibold">{t.certBenefits}</span>
                </div>
                <div className="p-3 space-y-1.5">
                  {[t.certBen1, t.certBen2, t.certBen3, t.certBen4].map((ben, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1.5 px-3">
                      <Star className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span className="text-white/50 text-[10px] font-medium">{ben}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              {certStatus === 'none' && (
                <motion.button
                  whileHover={allReqsMet ? { scale: 1.01 } : {}}
                  whileTap={allReqsMet ? { scale: 0.98 } : {}}
                  onClick={handleApplyCert}
                  disabled={!allReqsMet}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                    allReqsMet
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <BadgeCheck className="w-4 h-4" />
                    {t.certApply}
                  </span>
                </motion.button>
              )}
            </motion.div>
            )}

            {/* ━━━ DISTRIBUTION TAB ━━━ */}
            {activeTab === 'distribution' && (
            <motion.div key="distribution" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3 pt-2">
              <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/15 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span className="text-white text-sm font-semibold">{t.distribTitle}</span>
                </div>
                <p className="text-white/40 text-[10px]">{t.distribDesc}</p>
              </div>

              {/* Distribution Steps */}
              <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-white text-sm font-semibold">{t.distribSteps}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1">
                    {[t.distribStep1, t.distribStep2, t.distribStep3, t.distribStep4, t.distribStep5].map((step, i) => (
                      <div key={i} className="flex items-center gap-1 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
                          i <= distribStep
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                            : 'bg-white/10 text-white/30'
                        }`}>
                          {i + 1}
                        </div>
                        {i < 4 && <div className={`flex-1 h-0.5 rounded-full ${i < distribStep ? 'bg-emerald-500/50' : 'bg-white/10'}`} />}
                      </div>
                    ))}
                  </div>
                  <div className="flex mt-1.5">
                    {[t.distribStep1, t.distribStep2, t.distribStep3, t.distribStep4, t.distribStep5].map((step, i) => (
                      <span key={i} className={`flex-1 text-center text-[7px] font-medium ${i <= distribStep ? 'text-emerald-400/60' : 'text-white/20'}`}>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Select Works for Distribution */}
              {tracks.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Upload className="w-10 h-10 text-white/10 mb-2" />
                  <p className="text-white/30 text-xs">{t.distribNoTracks}</p>
                </div>
              ) : (
                <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm font-semibold">{t.distribSelected}</span>
                    </div>
                    <span className="text-purple-400 text-[10px] font-bold">{distribSelectedIds.size}/{tracks.length}</span>
                  </div>
                  <div className="max-h-[180px] overflow-y-auto p-2 space-y-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {tracks.map(item => (
                      <button
                        key={item.id}
                        onClick={() => toggleDistribTrack(item.id)}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-all ${
                          distribSelectedIds.has(item.id)
                            ? 'bg-emerald-500/10 border border-emerald-500/20'
                            : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                          distribSelectedIds.has(item.id)
                            ? 'bg-emerald-500/30 border-emerald-500/40'
                            : 'bg-white/5 border-white/15'
                        }`}>
                          {distribSelectedIds.has(item.id) && <Check className="w-3 h-3 text-emerald-300" />}
                        </div>
                        <span className="text-white/70 text-xs font-medium truncate flex-1">{item.title}</span>
                        {item.isVideo && <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-300 text-[7px] font-bold rounded">MV</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Platforms */}
              <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-semibold">{t.distribPlatforms}</span>
                </div>
                <div className="p-3 grid grid-cols-3 gap-2">
                  {[
                    { name: 'D-Music', color: 'from-purple-500/15 to-violet-500/15', border: 'border-purple-500/20', text: 'text-purple-300' },
                    { name: 'Spotify', color: 'from-green-500/15 to-emerald-500/15', border: 'border-green-500/20', text: 'text-green-300' },
                    { name: 'Apple Music', color: 'from-pink-500/15 to-rose-500/15', border: 'border-pink-500/20', text: 'text-pink-300' },
                    { name: 'YouTube Music', color: 'from-red-500/15 to-orange-500/15', border: 'border-red-500/20', text: 'text-red-300' },
                    { name: 'QQ 音乐', color: 'from-blue-500/15 to-cyan-500/15', border: 'border-blue-500/20', text: 'text-blue-300' },
                    { name: 'NetEase', color: 'from-rose-500/15 to-red-500/15', border: 'border-rose-500/20', text: 'text-rose-300' },
                  ].map(p => (
                    <div key={p.name} className={`bg-gradient-to-br ${p.color} rounded-xl border ${p.border} p-2.5 text-center`}>
                      <ExternalLink className={`w-4 h-4 ${p.text} mx-auto mb-1`} />
                      <span className={`text-[9px] font-semibold ${p.text}`}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Distribution */}
              <motion.button
                whileHover={distribSelectedIds.size > 0 ? { scale: 1.01 } : {}}
                whileTap={distribSelectedIds.size > 0 ? { scale: 0.98 } : {}}
                onClick={() => {
                  if (distribSelectedIds.size > 0 && distribStep < 4) {
                    setDistribStep(prev => prev + 1);
                  }
                }}
                disabled={distribSelectedIds.size === 0}
                className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                  distribSelectedIds.size > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50'
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  {distribStep >= 4
                    ? (language === 'zh' ? '「分发完成」' : 'Distribution Complete')
                    : `${t.distribStart} (${distribSelectedIds.size})`}
                </span>
              </motion.button>
            </motion.div>
            )}

            </AnimatePresence>

              {/* Save flash */}
              <AnimatePresence>
                {saveFlash && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-full text-green-300 text-xs font-semibold flex items-center gap-1.5 z-50"
                  >
                    <Check className="w-3.5 h-3.5" /> {t.saved}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}