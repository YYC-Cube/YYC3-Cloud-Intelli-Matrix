import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Star, Sparkles, Trophy, Crown, Gem, Flame,
  TrendingUp, ChevronRight, Zap, Clock, Calendar,
  Gift, Shield, Diamond, Rocket, Medal,
  ArrowUp, ArrowDown, Minus, Play, Heart,
  Share2, Bookmark, BarChart3, Timer, Target,
  CheckCircle, Award, Activity
} from 'lucide-react';

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

interface Track {
  id: number;
  title: string;
  url: string;
  albumId: string | null;
  isVideo?: boolean;
}

interface PlayRecord {
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
  tracks: Track[];
  playRecords: PlayRecord[];
  totalPlayCount: number;
  totalListenMinutes: number;
  onPlayTrack: (id: number) => void;
  onOpenIncentive?: () => void;
}

// M❤️ value formula (mirroring IncentiveSystem)
function computeMHeartValue(totalPlayCount: number, totalListenMinutes: number) {
  const baseValue = Math.floor(totalPlayCount * 3.7 + totalListenMinutes * 1.2 + 128);
  return {
    total: baseValue,
    level: baseValue > 1000 ? 5 : baseValue > 500 ? 4 : baseValue > 200 ? 3 : baseValue > 80 ? 2 : 1,
  };
}

type TabId = 'ranking' | 'starpower' | 'vip' | 'checkin';
type TimeRange = 'daily' | 'weekly' | 'monthly';
type RankingType = 'hot' | 'rising' | 'original' | 'completion';

interface RankedTrack {
  id: number;
  title: string;
  plays: number;
  totalDuration: number;
  completionRate: number;
  lastPlayed: number;
  positive: number;
  total: number;
  wilsonScore: number;
  rankChange: number;
  isVideo?: boolean;
}

interface StarPowerState {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  vipLevel: number;
  vipExp: number;
  dailyStreak: number;
  lastCheckIn: string | null;
  transactions: Transaction[];
  boosts: { [trackId: string]: number };
}

interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  source: string;
  timestamp: number;
  detail: string;
}

// ═══════════════════════════════════════════════════════
// WILSON SCORE CALCULATOR
// ═══════════════════════════════════════════════════════

class WilsonScoreCalculator {
  private readonly z: number;

  constructor(confidence: number = 0.95) {
    const zScores: Record<number, number> = { 0.90: 1.645, 0.95: 1.96, 0.99: 2.576 };
    this.z = zScores[confidence] || 1.96;
  }

  calculateLowerBound(positive: number, total: number): number {
    if (total === 0) return 0;
    const p = positive / total;
    const n = total;
    const z = this.z;
    const numerator = p + (z * z) / (2 * n) -
      z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
    const denominator = 1 + (z * z) / n;
    return Math.max(0, numerator / denominator);
  }

  calculateInterval(positive: number, total: number): { lower: number; upper: number } {
    if (total === 0) return { lower: 0, upper: 0 };
    const p = positive / total;
    const n = total;
    const z = this.z;
    const sqrtTerm = z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
    const baseTerm = p + (z * z) / (2 * n);
    const denominator = 1 + (z * z) / n;
    return {
      lower: Math.max(0, (baseTerm - sqrtTerm) / denominator),
      upper: Math.min(1, (baseTerm + sqrtTerm) / denominator)
    };
  }
}

const wilson = new WilsonScoreCalculator(0.95);

// ═══════════════════════════════════════════════════════
// LOCAL STORAGE FOR STAR POWER
// ═══════════════════════════════════════════════════════

const SP_STORAGE_KEY = 'dmusic_star_power';

function loadStarPower(): StarPowerState {
  try {
    const data = localStorage.getItem(SP_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (_e) { /* ignore */ }
  return {
    balance: 500, // Starting bonus
    totalEarned: 500,
    totalSpent: 0,
    vipLevel: 1,
    vipExp: 0,
    dailyStreak: 0,
    lastCheckIn: null,
    transactions: [{
      id: 'init',
      type: 'earn',
      amount: 500,
      source: 'welcome',
      timestamp: Date.now(),
      detail: '新用户欢迎奖励'
    }],
    boosts: {},
  };
}

function saveStarPower(state: StarPowerState) {
  localStorage.setItem(SP_STORAGE_KEY, JSON.stringify(state));
}

// ═══════════════════════════════════════════════════════
// VIP LEVELS
// ═══════════════════════════════════════════════════════

const VIP_LEVELS = [
  { level: 1, name: '星尘', nameEn: 'Stardust', minExp: 0, icon: Star, color: 'from-gray-400 to-gray-500', text: 'text-gray-300', benefits: 3 },
  { level: 2, name: '星芒', nameEn: 'Gleam', minExp: 500, icon: Sparkles, color: 'from-blue-400 to-cyan-500', text: 'text-blue-300', benefits: 5 },
  { level: 3, name: '星云', nameEn: 'Nebula', minExp: 2000, icon: Gem, color: 'from-purple-400 to-violet-500', text: 'text-purple-300', benefits: 7 },
  { level: 4, name: '恒星', nameEn: 'Star', minExp: 8000, icon: Flame, color: 'from-amber-400 to-orange-500', text: 'text-amber-300', benefits: 9 },
  { level: 5, name: '超新星', nameEn: 'Supernova', minExp: 25000, icon: Crown, color: 'from-pink-400 to-rose-500', text: 'text-pink-300', benefits: 12 },
  { level: 6, name: '传奇', nameEn: 'Legend', minExp: 100000, icon: Diamond, color: 'from-yellow-300 to-amber-400', text: 'text-yellow-300', benefits: 15 },
];

function getVIPLevel(exp: number) {
  for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= VIP_LEVELS[i].minExp) return VIP_LEVELS[i];
  }
  return VIP_LEVELS[0];
}

function getNextVIPLevel(exp: number) {
  for (const lvl of VIP_LEVELS) {
    if (exp < lvl.minExp) return lvl;
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════

const T = {
  zh: {
    title: '「星力值排行榜」',
    subtitle: '「威尔逊区间 · 公平排名」',
    ranking: '「排行榜」',
    starpower: '「星力值」',
    vip: '「VIP」',
    checkin: '「签到」',
    daily: '「日榜」',
    weekly: '「周榜」',
    monthly: '「月榜」',
    hot: '「热门榜」',
    rising: '「新锐榜」',
    original: '「原创榜」',
    completion: '「完成度榜」',
    plays: '「播放」',
    wScore: '「W评分」',
    boost: '「助推」',
    boostCost: '「消耗 {n} 星力」',
    boostSuccess: '「助推成功」',
    insufficientSP: '「星力不足」',
    balance: '「星力余额」',
    totalEarned: '「累计获取」',
    totalSpent: '「累计消耗」',
    earnWays: '「获取途径」',
    listenEarn: '「聆听音乐」',
    listenEarnDesc: '「每分钟 +2 星力」',
    playEarn: '「完整播放」',
    playEarnDesc: '「完成度 ≥90% +10 星力」',
    streakEarn: '「连续签到」',
    streakEarnDesc: '「连续 7 天 ×2 加成」',
    boostEarnLabel: '「助推作品」',
    boostEarnDesc: '「消耗星力提升排名」',
    transactions: '「交易记录」',
    noTransactions: '「暂无交易记录」',
    currentLevel: '「当前等级」',
    nextLevel: '「下一等级」',
    expNeeded: '「还需经验」',
    benefits: '「等级权益」',
    vipBenefit1: '「排行榜加权显示」',
    vipBenefit2: '「每日签到加成」',
    vipBenefit3: '「助推折扣」',
    vipBenefit4: '「专属徽章」',
    vipBenefit5: '「优先曝光」',
    checkinTitle: '「每日签到」',
    checkinReward: '「+{n} 星力」',
    checkinDone: '「今日已签到」',
    checkinBtn: '「立即签到」',
    streak: '「连续签到」',
    days: '「天」',
    streakBonus: '「连续奖励 ×{n}」',
    noTracks: '「暂无歌曲排行数据」',
    addMusic: '「添加音乐并播放以生成排行榜」',
    rankUp: '「上升」',
    rankDown: '「下降」',
    rankStable: '「不变」',
    confidenceInterval: '「置信区间」',
  },
  en: {
    title: 'Star Power Rankings',
    subtitle: 'Wilson Interval · Fair Ranking',
    ranking: 'Rankings',
    starpower: 'Star Power',
    vip: 'VIP',
    checkin: 'Check-in',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    hot: 'Hot',
    rising: 'Rising',
    original: 'Original',
    completion: 'Completion',
    plays: 'Plays',
    wScore: 'W-Score',
    boost: 'Boost',
    boostCost: 'Cost: {n} SP',
    boostSuccess: 'Boost Success!',
    insufficientSP: 'Not enough SP',
    balance: 'SP Balance',
    totalEarned: 'Total Earned',
    totalSpent: 'Total Spent',
    earnWays: 'How to Earn',
    listenEarn: 'Listen to Music',
    listenEarnDesc: '+2 SP per minute',
    playEarn: 'Full Playback',
    playEarnDesc: '+10 SP for ≥90% completion',
    streakEarn: 'Daily Streak',
    streakEarnDesc: '7-day streak = ×2 bonus',
    boostEarnLabel: 'Boost Works',
    boostEarnDesc: 'Spend SP to boost rankings',
    transactions: 'Transactions',
    noTransactions: 'No transactions yet',
    currentLevel: 'Current Level',
    nextLevel: 'Next Level',
    expNeeded: 'EXP Needed',
    benefits: 'Level Benefits',
    vipBenefit1: 'Ranking weight boost',
    vipBenefit2: 'Daily check-in bonus',
    vipBenefit3: 'Boost discount',
    vipBenefit4: 'Exclusive badge',
    vipBenefit5: 'Priority exposure',
    checkinTitle: 'Daily Check-in',
    checkinReward: '+{n} SP',
    checkinDone: 'Checked in today',
    checkinBtn: 'Check In Now',
    streak: 'Streak',
    days: 'days',
    streakBonus: 'Streak bonus ×{n}',
    noTracks: 'No ranking data yet',
    addMusic: 'Add music and play to generate rankings',
    rankUp: 'Up',
    rankDown: 'Down',
    rankStable: 'Stable',
    confidenceInterval: 'Confidence Interval',
  }
};

// ═══════════════════════════════════════════════════════
// STAR POWER GAUGE
// ═══════════════════════════════════════════════════════

function StarPowerGauge({ value, size = 80, animated = true }: { value: number; size?: number; animated?: boolean }) {
  const [display, setDisplay] = useState(0);
  const maxLevel = 99999;
  const percentage = Math.min((value / maxLevel) * 100, 100);

  useEffect(() => {
    if (animated && value > 0) {
      const duration = 800;
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) { setDisplay(value); clearInterval(timer); }
        else setDisplay(Math.floor(current));
      }, duration / steps);
      return () => clearInterval(timer);
    } else {
      setDisplay(value);
    }
  }, [value, animated]);

  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const progress = (percentage / 100) * circ;

  const level = getVIPLevel(value);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="url(#starGradient)" strokeWidth={4} strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - progress }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeDasharray={circ}
          />
          <defs>
            <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-amber-400 text-sm font-black mt-0.5">{display.toLocaleString()}</span>
        </div>
      </div>
      <span className={`text-[9px] font-bold mt-1 bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
        {level.name}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════

export function StarPowerBoard({ isOpen, onClose, language, tracks, playRecords, totalPlayCount, totalListenMinutes, onPlayTrack, onOpenIncentive }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('ranking');
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [rankingType, setRankingType] = useState<RankingType>('hot');
  const [starPower, setStarPower] = useState<StarPowerState>(loadStarPower);
  const [boostFeedback, setBoostFeedback] = useState<string | null>(null);
  const prevRankingsRef = useRef<Map<number, number>>(new Map());

  const t = T[language];
  const mheart = computeMHeartValue(totalPlayCount, totalListenMinutes);

  // Save star power whenever it changes
  useEffect(() => {
    saveStarPower(starPower);
  }, [starPower]);

  // Auto-earn from listening (check on open)
  useEffect(() => {
    if (!isOpen) return;
    const earned = Math.floor(totalListenMinutes * 2);
    const alreadyEarned = starPower.transactions
      .filter(tx => tx.source === 'listening')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const toEarn = earned - alreadyEarned;
    if (toEarn > 0) {
      setStarPower(prev => ({
        ...prev,
        balance: prev.balance + toEarn,
        totalEarned: prev.totalEarned + toEarn,
        vipExp: prev.vipExp + toEarn,
        transactions: [{
          id: `listen_${Date.now()}`,
          type: 'earn',
          amount: toEarn,
          source: 'listening',
          timestamp: Date.now(),
          detail: language === 'zh' ? `聆听音乐 ${totalListenMinutes} 分钟` : `Listened ${totalListenMinutes} minutes`
        }, ...prev.transactions].slice(0, 100),
      }));
    }
  }, [isOpen, totalListenMinutes]);

  // Auto-earn from high completion tracks
  useEffect(() => {
    if (!isOpen) return;
    const highCompletionPlays = playRecords.filter(r => r.completionRate >= 0.9).length;
    const earned = highCompletionPlays * 10;
    const alreadyEarned = starPower.transactions
      .filter(tx => tx.source === 'completion')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const toEarn = earned - alreadyEarned;
    if (toEarn > 0) {
      setStarPower(prev => ({
        ...prev,
        balance: prev.balance + toEarn,
        totalEarned: prev.totalEarned + toEarn,
        vipExp: prev.vipExp + toEarn,
        transactions: [{
          id: `comp_${Date.now()}`,
          type: 'earn',
          amount: toEarn,
          source: 'completion',
          timestamp: Date.now(),
          detail: language === 'zh' ? `完整播放奖励 (${highCompletionPlays} 首)` : `Full playback reward (${highCompletionPlays} tracks)`
        }, ...prev.transactions].slice(0, 100),
      }));
    }
  }, [isOpen, playRecords]);

  // Build ranked tracks using Wilson Score
  const rankings = useMemo(() => {
    if (tracks.length === 0) return [];

    const recordMap = new Map<number, PlayRecord>();
    playRecords.forEach(r => recordMap.set(r.trackId, r));

    const maxPlays = Math.max(1, ...playRecords.map(r => r.playCount));

    const ranked: RankedTrack[] = tracks.map(track => {
      const record = recordMap.get(track.id);
      const plays = record?.playCount || 0;
      const completionRate = record?.completionRate || 0;
      const boostAmount = starPower.boosts[track.id.toString()] || 0;

      // Positive signals: plays + completion bonus + boost bonus
      const positive = plays + Math.floor(completionRate * plays * 0.5) + boostAmount;
      const total = Math.max(positive, maxPlays);

      const wScore = wilson.calculateLowerBound(positive, total);

      // Previous rank for change indicator
      const prevRank = prevRankingsRef.current.get(track.id) || 0;

      return {
        id: track.id,
        title: track.title,
        plays,
        totalDuration: record?.totalDuration || 0,
        completionRate,
        lastPlayed: record?.lastPlayed || 0,
        positive,
        total,
        wilsonScore: wScore,
        rankChange: 0, // Computed below
        isVideo: track.isVideo,
      };
    });

    // Sort by ranking type
    switch (rankingType) {
      case 'hot':
        ranked.sort((a, b) => b.wilsonScore - a.wilsonScore);
        break;
      case 'rising':
        ranked.sort((a, b) => {
          const recentA = a.lastPlayed > Date.now() - 86400000 ? a.plays * 2 : a.plays;
          const recentB = b.lastPlayed > Date.now() - 86400000 ? b.plays * 2 : b.plays;
          return recentB - recentA;
        });
        break;
      case 'completion':
        ranked.sort((a, b) => b.completionRate - a.completionRate || b.plays - a.plays);
        break;
      default:
        ranked.sort((a, b) => b.wilsonScore - a.wilsonScore);
    }

    // Time filter (simulated: weight recent plays more)
    // For a local player without server timestamps, we approximate

    // Compute rank changes
    const newRankMap = new Map<number, number>();
    ranked.forEach((item, idx) => {
      newRankMap.set(item.id, idx + 1);
      const prevRank = prevRankingsRef.current.get(item.id);
      if (prevRank) {
        item.rankChange = prevRank - (idx + 1); // positive = moved up
      }
    });
    prevRankingsRef.current = newRankMap;

    return ranked;
  }, [tracks, playRecords, rankingType, starPower.boosts]);

  // Boost a track
  const handleBoost = useCallback((trackId: number) => {
    const boostCost = 50;
    if (starPower.balance < boostCost) {
      setBoostFeedback(t.insufficientSP);
      setTimeout(() => setBoostFeedback(null), 2000);
      return;
    }

    setStarPower(prev => ({
      ...prev,
      balance: prev.balance - boostCost,
      totalSpent: prev.totalSpent + boostCost,
      boosts: {
        ...prev.boosts,
        [trackId.toString()]: (prev.boosts[trackId.toString()] || 0) + 5,
      },
      transactions: [{
        id: `boost_${Date.now()}`,
        type: 'spend',
        amount: boostCost,
        source: 'boost',
        timestamp: Date.now(),
        detail: language === 'zh' ? `助推作品 #${trackId}` : `Boosted track #${trackId}`
      }, ...prev.transactions].slice(0, 100),
    }));
    setBoostFeedback(t.boostSuccess);
    setTimeout(() => setBoostFeedback(null), 2000);
  }, [starPower.balance, language, t]);

  // Daily check-in
  const handleCheckIn = useCallback(() => {
    const today = new Date().toDateString();
    if (starPower.lastCheckIn === today) return;

    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = starPower.lastCheckIn === yesterday ? starPower.dailyStreak + 1 : 1;
    const multiplier = newStreak >= 7 ? 2 : 1;
    const reward = 30 * multiplier;

    setStarPower(prev => ({
      ...prev,
      balance: prev.balance + reward,
      totalEarned: prev.totalEarned + reward,
      vipExp: prev.vipExp + reward,
      dailyStreak: newStreak,
      lastCheckIn: today,
      transactions: [{
        id: `checkin_${Date.now()}`,
        type: 'earn',
        amount: reward,
        source: 'checkin',
        timestamp: Date.now(),
        detail: language === 'zh'
          ? `每日签到 (连续 ${newStreak} 天${multiplier > 1 ? ' ×2 加成' : ''})`
          : `Daily check-in (${newStreak} day streak${multiplier > 1 ? ' ×2 bonus' : ''})`
      }, ...prev.transactions].slice(0, 100),
    }));
  }, [starPower.lastCheckIn, starPower.dailyStreak, language]);

  const isCheckedInToday = starPower.lastCheckIn === new Date().toDateString();
  const currentVIP = getVIPLevel(starPower.vipExp);
  const nextVIP = getNextVIPLevel(starPower.vipExp);

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'ranking', label: t.ranking, icon: Trophy },
    { id: 'starpower', label: t.starpower, icon: Star },
    { id: 'vip', label: t.vip, icon: Crown },
    { id: 'checkin', label: t.checkin, icon: Gift },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-400" />;
    if (rank === 2) return <Medal className="w-4.5 h-4.5 text-gray-300" />;
    if (rank === 3) return <Award className="w-4 h-4 text-amber-600" />;
    return <span className="text-white/40 text-xs font-bold">#{rank}</span>;
  };

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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
          >
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/[0.06] rounded-full blur-[60px]" />
              <div className="absolute bottom-1/4 left-0 w-32 h-32 bg-purple-500/[0.06] rounded-full blur-[50px]" />
            </div>

            {/* Header */}
            <div className="p-4 border-b border-white/10 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{t.title}</h3>
                    <p className="text-white/35 text-[10px] font-medium">{t.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarPowerGauge value={starPower.balance} size={52} />
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors" aria-label={language === 'zh' ? '关闭' : 'Close'}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stat Bar */}
            <div className="px-4 pt-2.5 pb-2 border-b border-white/[0.06] relative z-10">
              <div className="grid grid-cols-4 gap-1.5">
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/15 p-2 text-center">
                  <div className="text-amber-400 text-base font-black">{starPower.balance.toLocaleString()}</div>
                  <div className="text-white/40 text-[8px] font-semibold">{t.balance}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/15 p-2 text-center">
                  <div className="text-green-400 text-base font-black">{starPower.totalEarned.toLocaleString()}</div>
                  <div className="text-white/40 text-[8px] font-semibold">{t.totalEarned}</div>
                </div>
                <div className="bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-xl border border-red-500/15 p-2 text-center">
                  <div className="text-red-400 text-base font-black">{starPower.totalSpent.toLocaleString()}</div>
                  <div className="text-white/40 text-[8px] font-semibold">{t.totalSpent}</div>
                </div>
                <button onClick={() => { if (onOpenIncentive) { onClose(); onOpenIncentive(); } }} className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/15 p-2 text-center hover:from-pink-500/15 hover:to-purple-500/15 transition-all">
                  <div className="text-pink-400 text-base font-black flex items-center justify-center gap-0.5">
                    <Heart className="w-3 h-3 fill-pink-400" />{mheart.total.toLocaleString()}
                  </div>
                  <div className="text-white/40 text-[8px] font-semibold">M❤️</div>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-1 relative z-10" role="tablist" aria-label={language === 'zh' ? '星力面板标签页' : 'Star Power tabs'}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-amber-400 border-amber-400'
                      : 'text-white/40 border-transparent hover:text-white/60'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Boost Feedback */}
            <AnimatePresence>
              {boostFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mx-4 mt-2 px-3 py-2 rounded-lg text-xs font-semibold text-center ${
                    boostFeedback === t.boostSuccess
                      ? 'bg-green-500/20 text-green-300 border border-green-500/20'
                      : 'bg-red-500/20 text-red-300 border border-red-500/20'
                  }`}
                >
                  {boostFeedback}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence mode="wait">

                {/* ━━━ RANKING TAB ━━━ */}
                {activeTab === 'ranking' && (
                  <motion.div key="ranking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 space-y-3">

                    {/* Ranking Type Selector */}
                    <div className="flex gap-1.5">
                      {([
                        { id: 'hot' as RankingType, label: t.hot, icon: Flame },
                        { id: 'rising' as RankingType, label: t.rising, icon: Rocket },
                        { id: 'completion' as RankingType, label: t.completion, icon: Target },
                      ]).map(rt => (
                        <button
                          key={rt.id}
                          onClick={() => setRankingType(rt.id)}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-semibold transition-all border flex items-center justify-center gap-1 ${
                            rankingType === rt.id
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                              : 'bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.06]'
                          }`}
                        >
                          <rt.icon className="w-3 h-3" />
                          {rt.label}
                        </button>
                      ))}
                    </div>

                    {/* Time Range */}
                    <div className="flex gap-1.5">
                      {([
                        { id: 'daily' as TimeRange, label: t.daily },
                        { id: 'weekly' as TimeRange, label: t.weekly },
                        { id: 'monthly' as TimeRange, label: t.monthly },
                      ]).map(tr => (
                        <button
                          key={tr.id}
                          onClick={() => setTimeRange(tr.id)}
                          className={`flex-1 py-1.5 rounded-md text-[9px] font-semibold transition-all ${
                            timeRange === tr.id
                              ? 'bg-purple-500/15 text-purple-300'
                              : 'bg-white/[0.03] text-white/30 hover:bg-white/[0.05]'
                          }`}
                        >
                          {tr.label}
                        </button>
                      ))}
                    </div>

                    {/* Rankings List */}
                    {rankings.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Trophy className="w-12 h-12 text-white/10 mb-3" />
                        <p className="text-white/30 text-sm font-semibold">{t.noTracks}</p>
                        <p className="text-white/15 text-[10px] mt-1">{t.addMusic}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {rankings.map((item, idx) => {
                          const rank = idx + 1;
                          const interval = wilson.calculateInterval(item.positive, item.total);

                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                              className={`relative rounded-xl border transition-all overflow-hidden group ${
                                rank <= 3
                                  ? 'bg-gradient-to-r from-amber-500/[0.06] to-transparent border-amber-500/15'
                                  : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05]'
                              }`}
                            >
                              <div className="p-2.5 flex items-center gap-2.5">
                                {/* Rank */}
                                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/[0.04]">
                                  {getRankIcon(rank)}
                                </div>

                                {/* Info */}
                                <button onClick={() => { onPlayTrack(item.id); onClose(); }} className="flex-1 min-w-0 text-left">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-white/80 text-xs font-medium truncate">{item.title}</span>
                                    {item.isVideo && (
                                      <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-300 text-[7px] font-bold rounded border border-indigo-500/25 flex-shrink-0">MV</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2.5 mt-0.5">
                                    <span className="text-white/25 text-[9px] flex items-center gap-0.5">
                                      <Play className="w-2.5 h-2.5" />{item.plays}
                                    </span>
                                    <span className="text-amber-400/50 text-[9px] flex items-center gap-0.5 font-bold">
                                      <Star className="w-2.5 h-2.5" />{(item.wilsonScore * 100).toFixed(1)}
                                    </span>
                                    {item.completionRate > 0 && (
                                      <span className="text-cyan-400/40 text-[9px]">
                                        {Math.round(item.completionRate * 100)}%
                                      </span>
                                    )}
                                  </div>
                                </button>

                                {/* Rank Change */}
                                <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                                  {item.rankChange > 0 ? (
                                    <div className="flex items-center gap-0.5 text-green-400">
                                      <ArrowUp className="w-3 h-3" />
                                      <span className="text-[9px] font-bold">{item.rankChange}</span>
                                    </div>
                                  ) : item.rankChange < 0 ? (
                                    <div className="flex items-center gap-0.5 text-red-400">
                                      <ArrowDown className="w-3 h-3" />
                                      <span className="text-[9px] font-bold">{Math.abs(item.rankChange)}</span>
                                    </div>
                                  ) : (
                                    <Minus className="w-3 h-3 text-white/15" />
                                  )}
                                </div>

                                {/* Boost Button */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => { e.stopPropagation(); handleBoost(item.id); }}
                                  className="px-2 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-bold hover:from-amber-500/25 hover:to-orange-500/15 transition-all flex items-center gap-1 flex-shrink-0"
                                  title={t.boostCost.replace('{n}', '50')}
                                >
                                  <Zap className="w-3 h-3" />
                                  {t.boost}
                                </motion.button>
                              </div>

                              {/* Wilson Score Bar */}
                              <div className="px-2.5 pb-2">
                                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden relative">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.wilsonScore * 100}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                                    className={`h-full rounded-full ${
                                      rank === 1 ? 'bg-gradient-to-r from-amber-400 to-yellow-300' :
                                      rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                                      rank === 3 ? 'bg-gradient-to-r from-amber-600 to-orange-500' :
                                      'bg-gradient-to-r from-purple-500 to-violet-400'
                                    }`}
                                  />
                                  {/* Confidence interval indicator */}
                                  <div
                                    className="absolute top-0 h-full bg-white/10 rounded-full"
                                    style={{
                                      left: `${interval.lower * 100}%`,
                                      width: `${(interval.upper - interval.lower) * 100}%`,
                                    }}
                                  />
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-white/15 text-[7px] font-mono">
                                    {t.confidenceInterval}: [{(interval.lower * 100).toFixed(1)}, {(interval.upper * 100).toFixed(1)}]
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ━━━ STAR POWER TAB ━━━ */}
                {activeTab === 'starpower' && (
                  <motion.div key="starpower" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 space-y-3">

                    {/* Earn Ways */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.earnWays}</span>
                      </div>
                      <div className="p-2.5 space-y-1">
                        {[
                          { icon: Play, label: t.listenEarn, desc: t.listenEarnDesc, color: 'text-blue-400', value: '+2/min' },
                          { icon: CheckCircle, label: t.playEarn, desc: t.playEarnDesc, color: 'text-purple-400', value: '+10' },
                          { icon: Calendar, label: t.streakEarn, desc: t.streakEarnDesc, color: 'text-amber-400', value: '×2' },
                          { icon: Zap, label: t.boostEarnLabel, desc: t.boostEarnDesc, color: 'text-rose-400', value: '-50' },
                        ].map((rule) => (
                          <div key={rule.label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.04] transition-colors">
                            <rule.icon className={`w-4 h-4 ${rule.color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 text-xs font-medium block">{rule.label}</span>
                              <span className="text-white/30 text-[10px]">{rule.desc}</span>
                            </div>
                            <span className={`text-sm font-black ${rule.color}`}>{rule.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ━━━ M❤️ ↔ Star Power Cross-System Bridge ━━━ */}
                    <div className="bg-gradient-to-br from-pink-500/10 to-amber-500/10 rounded-xl border border-pink-500/15 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                        <span className="text-white text-sm font-semibold">{language === 'zh' ? '「M❤️值 ↔ 星力联通」' : 'M❤️ ↔ Star Power Bridge'}</span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                            <Heart className="w-4 h-4 text-white fill-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-pink-400 text-base font-black">{mheart.total.toLocaleString()}</div>
                            <div className="text-white/30 text-[9px]">{language === 'zh' ? '「当前 M❤️ 值」' : 'Current M❤️'}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white/20 text-[9px]">Lv.{mheart.level}</div>
                            <div className="text-amber-400 text-[10px] font-bold">≈ {Math.floor(mheart.total / 10)} SP</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <span className="text-pink-400 text-[10px] font-bold">10 M❤️</span>
                          <ChevronRight className="w-3 h-3 text-white/20" />
                          <span className="text-amber-400 text-[10px] font-bold">1 ⭐ SP</span>
                          <span className="flex-1" />
                          <span className="text-white/20 text-[9px] font-mono">{language === 'zh' ? '「双向流通协议」' : 'Bidirectional Protocol'}</span>
                        </div>
                        {onOpenIncentive && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { onClose(); onOpenIncentive(); }}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500/15 to-rose-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold hover:from-pink-500/25 hover:to-rose-500/15 transition-all flex items-center justify-center gap-2"
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            {language === 'zh' ? '「前往 M❤️ 激励系统」' : 'Go to M❤️ Incentive System'}
                            <ChevronRight className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.transactions}</span>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                        {starPower.transactions.length === 0 ? (
                          <div className="p-6 text-center text-white/25 text-xs">{t.noTransactions}</div>
                        ) : (
                          <div className="p-2 space-y-0.5">
                            {starPower.transactions.slice(0, 30).map(tx => (
                              <div key={tx.id} className="flex items-center gap-2.5 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  tx.type === 'earn'
                                    ? 'bg-green-500/15 text-green-400'
                                    : 'bg-red-500/15 text-red-400'
                                }`}>
                                  {tx.type === 'earn' ? <TrendingUp className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <span className="text-white/70 text-[11px] font-medium block truncate">{tx.detail}</span>
                                  <span className="text-white/25 text-[9px]">
                                    {new Date(tx.timestamp).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <span className={`text-sm font-black flex-shrink-0 ${tx.type === 'earn' ? 'text-green-400' : 'text-red-400'}`}>
                                  {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ VIP TAB ━━━ */}
                {activeTab === 'vip' && (
                  <motion.div key="vip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 space-y-3">

                    {/* Current Level Card */}
                    <div className={`bg-gradient-to-br ${currentVIP.color.replace('from-', 'from-').replace('to-', 'to-')}/10 rounded-xl border border-white/10 p-4`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${currentVIP.color} flex items-center justify-center shadow-lg`}>
                          <currentVIP.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-lg">{language === 'zh' ? currentVIP.name : currentVIP.nameEn}</span>
                            <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${currentVIP.color} text-white text-[9px] font-bold`}>
                              Lv.{currentVIP.level}
                            </span>
                          </div>
                          <span className="text-white/40 text-[10px]">{t.currentLevel}</span>
                        </div>
                      </div>

                      {/* Progress to next level */}
                      {nextVIP && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-white/40">{t.nextLevel}: {language === 'zh' ? nextVIP.name : nextVIP.nameEn}</span>
                            <span className="text-white/40">{t.expNeeded}: {(nextVIP.minExp - starPower.vipExp).toLocaleString()}</span>
                          </div>
                          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, ((starPower.vipExp - currentVIP.minExp) / (nextVIP.minExp - currentVIP.minExp)) * 100)}%` }}
                              transition={{ duration: 1 }}
                              className={`h-full rounded-full bg-gradient-to-r ${currentVIP.color}`}
                            />
                          </div>
                          <div className="text-center text-white/30 text-[9px] font-mono">
                            {starPower.vipExp.toLocaleString()} / {nextVIP.minExp.toLocaleString()} EXP
                          </div>
                        </div>
                      )}
                    </div>

                    {/* All Levels */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.benefits}</span>
                      </div>
                      <div className="p-2.5 space-y-1.5">
                        {VIP_LEVELS.map(lvl => {
                          const isCurrentOrBelow = starPower.vipExp >= lvl.minExp;
                          return (
                            <div
                              key={lvl.level}
                              className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                                isCurrentOrBelow
                                  ? `bg-gradient-to-r ${lvl.color.replace('from-', 'from-').replace('to-', 'to-')}/5 border-white/10`
                                  : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${lvl.color} flex items-center justify-center flex-shrink-0 ${!isCurrentOrBelow ? 'grayscale opacity-50' : ''}`}>
                                <lvl.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-xs font-bold ${isCurrentOrBelow ? lvl.text : 'text-white/30'}`}>
                                    Lv.{lvl.level} {language === 'zh' ? lvl.name : lvl.nameEn}
                                  </span>
                                  {starPower.vipExp >= lvl.minExp && starPower.vipExp < (VIP_LEVELS[lvl.level]?.minExp || Infinity) && (
                                    <span className="px-1.5 py-0.5 bg-green-500/20 text-green-300 text-[7px] font-bold rounded">CURRENT</span>
                                  )}
                                </div>
                                <span className="text-white/25 text-[9px]">{lvl.minExp.toLocaleString()} EXP · {lvl.benefits} {language === 'zh' ? '项权益' : 'benefits'}</span>
                              </div>
                              {isCurrentOrBelow ? (
                                <CheckCircle className="w-4 h-4 text-green-400/60 flex-shrink-0" />
                              ) : (
                                <Shield className="w-4 h-4 text-white/15 flex-shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ CHECK-IN TAB ━━━ */}
                {activeTab === 'checkin' && (
                  <motion.div key="checkin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-3 space-y-3">

                    {/* Check-in Card */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/15 p-5 text-center">
                      <motion.div
                        animate={isCheckedInToday ? {} : { scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Gift className={`w-16 h-16 mx-auto mb-3 ${isCheckedInToday ? 'text-green-400' : 'text-amber-400'}`} />
                      </motion.div>
                      <h3 className="text-white font-bold text-lg mb-1">{t.checkinTitle}</h3>

                      {/* Streak Info */}
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-400 text-sm font-bold">
                          {t.streak}: {starPower.dailyStreak} {t.days}
                        </span>
                        {starPower.dailyStreak >= 7 && (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[9px] font-bold rounded-full border border-amber-500/25">
                            {t.streakBonus.replace('{n}', '2')}
                          </span>
                        )}
                      </div>

                      <motion.button
                        whileHover={isCheckedInToday ? {} : { scale: 1.03 }}
                        whileTap={isCheckedInToday ? {} : { scale: 0.97 }}
                        onClick={handleCheckIn}
                        disabled={isCheckedInToday}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                          isCheckedInToday
                            ? 'bg-green-500/20 text-green-300 border border-green-500/20 cursor-default'
                            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50'
                        }`}
                      >
                        {isCheckedInToday ? (
                          <span className="flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            {t.checkinDone}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Gift className="w-4 h-4" />
                            {t.checkinBtn} {t.checkinReward.replace('{n}', String(starPower.dailyStreak >= 6 ? 60 : 30))}
                          </span>
                        )}
                      </motion.button>
                    </div>

                    {/* 7-Day Streak Calendar */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">{language === 'zh' ? '「7 日签到历程」' : '7-Day Check-in'}</span>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 7 }).map((_, i) => {
                          const isCompleted = i < starPower.dailyStreak;
                          const isToday = i === starPower.dailyStreak - (isCheckedInToday ? 1 : 0);
                          const dayLabel = language === 'zh'
                            ? `第${i + 1}天`
                            : `Day ${i + 1}`;
                          const reward = i === 6 ? 60 : 30;
                          return (
                            <div
                              key={i}
                              className={`flex flex-col items-center py-2 rounded-lg border transition-all ${
                                isCompleted
                                  ? 'bg-amber-500/15 border-amber-500/25'
                                  : isToday
                                    ? 'bg-purple-500/10 border-purple-500/20'
                                    : 'bg-white/[0.03] border-white/[0.06]'
                              }`}
                            >
                              <span className={`text-[8px] font-semibold ${isCompleted ? 'text-amber-300' : 'text-white/30'}`}>
                                {dayLabel}
                              </span>
                              {isCompleted ? (
                                <CheckCircle className="w-4 h-4 text-amber-400 mt-1" />
                              ) : (
                                <Star className="w-4 h-4 text-white/15 mt-1" />
                              )}
                              <span className={`text-[7px] font-bold mt-0.5 ${isCompleted ? 'text-amber-400' : 'text-white/20'}`}>
                                +{reward}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-white/20 text-[9px] font-mono">
                  Wilson Score 95% CI · z=1.96
                </span>
              </div>
              <span className="text-white/15 text-[9px] font-mono">
                D-Music · {language === 'zh' ? '「星力排行引擎」' : 'Star Ranking Engine'}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
