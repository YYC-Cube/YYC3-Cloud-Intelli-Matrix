import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Heart, Star, Sparkles, Trophy, Crown, Gem, Flame,
  Orbit, Eye, Users, Mic2, Music, Headphones, Award,
  TrendingUp, ChevronRight, Zap, Clock, Calendar,
  Gift, Target, Shield, Brain, Diamond, Globe,
  Waypoints, Waves, Activity, Radio, MessageCircle
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  totalTracks: number;
  totalPlayCount: number;
  totalListenMinutes: number;
  playRecords: PlayRecord[];
  onOpenStarPower?: () => void;
}

// Read star power from localStorage for cross-system display
function readStarPowerBalance(): { balance: number; vipExp: number; totalEarned: number } {
  try {
    const data = localStorage.getItem('dmusic_star_power');
    if (data) {
      const sp = JSON.parse(data);
      return { balance: sp.balance || 0, vipExp: sp.vipExp || 0, totalEarned: sp.totalEarned || 0 };
    }
  } catch (_e) { /* ignore */ }
  return { balance: 500, vipExp: 0, totalEarned: 500 };
}

interface PlayRecord {
  trackId: number;
  playCount: number;
  totalDuration: number;
  lastPlayed: number;
  completionRate: number;
}

type TabId = 'mheart' | 'starplan' | 'participate' | 'exposure' | 'recognition';

// M❤️ Value simulation
function useMHeartValue(totalPlayCount: number, totalListenMinutes: number) {
  const baseValue = Math.floor(totalPlayCount * 3.7 + totalListenMinutes * 1.2 + 128);
  return {
    total: baseValue,
    physical: Math.floor(baseValue * 0.3),
    virtual: Math.floor(baseValue * 0.45),
    spiritual: Math.floor(baseValue * 0.25),
    dailyGain: Math.floor(Math.random() * 12 + 5),
    weeklyGain: Math.floor(Math.random() * 60 + 35),
    level: baseValue > 1000 ? 5 : baseValue > 500 ? 4 : baseValue > 200 ? 3 : baseValue > 80 ? 2 : 1,
  };
}

// Animated heart counter
function HeartCounter({ value, color = 'text-pink-400' }: { value: number; color?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / end), 10);
    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / stepTime));
      if (start >= end) { start = end; clearInterval(timer); }
      setDisplay(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span className={`font-bold tabular-nums ${color}`}>{display}</span>;
}

// Pulsing heart animation
function PulsingHeart({ size = 'w-5 h-5', color = 'text-pink-400' }: { size?: string; color?: string }) {
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
    >
      <Heart className={`${size} ${color} fill-current`} />
    </motion.div>
  );
}

// Star particle canvas
function StarField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const stars: { x: number; y: number; r: number; v: number; a: number; hue: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 1.5 + 0.3,
        v: Math.random() * 0.3 + 0.1,
        a: Math.random() * Math.PI * 2,
        hue: Math.random() * 60 + 260,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      stars.forEach(s => {
        s.y -= s.v;
        s.x += Math.sin(s.a) * 0.2;
        s.a += 0.01;
        if (s.y < -2) { s.y = canvas.offsetHeight + 2; s.x = Math.random() * canvas.offsetWidth; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 75%, ${0.4 + Math.sin(Date.now() / 500 + s.a) * 0.3})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, [active]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Level badge
function LevelBadge({ level }: { level: number }) {
  const configs = [
    { bg: 'from-gray-500 to-gray-600', label: '星尘', icon: Star },
    { bg: 'from-blue-500 to-cyan-500', label: '星芒', icon: Sparkles },
    { bg: 'from-purple-500 to-violet-500', label: '星云', icon: Orbit },
    { bg: 'from-amber-500 to-orange-500', label: '恒星', icon: Flame },
    { bg: 'from-pink-500 to-rose-500', label: '超新星', icon: Crown },
  ];
  const cfg = configs[Math.min(level - 1, 4)];
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${cfg.bg} shadow-lg`}>
      <Icon className="w-3 h-3 text-white" />
      <span className="text-white text-[10px] font-bold">{cfg.label}</span>
    </div>
  );
}

// Progress ring
function ProgressRing({ value, max, size = 48, strokeWidth = 3, color }: {
  value: number; max: number; size?: number; strokeWidth?: number; color: string;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const progress = Math.min(value / max, 1) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeDasharray={circ}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-[10px] font-bold">{Math.round((value / max) * 100)}%</span>
      </div>
    </div>
  );
}

const TRANSLATIONS = {
  zh: {
    title: '「多维无扰激励」',
    subtitle: '「M❤️值生态 · 星辰演化」',
    mheart: '「M❤️值」',
    starplan: '「星辰演化」',
    participate: '「参与」',
    exposure: '「曝光」',
    recognition: '「点名」',

    // M❤️ Tab
    mheartTitle: '「M❤️值生态系统」',
    totalValue: '「总M❤️值」',
    physicalUniverse: '「物质宇宙」',
    virtualUniverse: '「虚拟宇宙」',
    spiritUniverse: '「心灵宇宙」',
    physicalDesc: '「实体声卡 · 限量黑胶」',
    virtualDesc: '「动态 NFT · 跨平台通证」',
    spiritDesc: '「脑波认证 · 情感银行」',
    dailyGain: '「今日获取」',
    weeklyGain: '「本周获取」',
    currentLevel: '「当前等级」',
    earnRules: '「M❤️值获取途径」',
    listenEarn: '「聆听音乐」',
    listenEarnDesc: '「每分钟 +1.2 M❤️」',
    createEarn: '「原创创作」',
    createEarnDesc: '「完成作品 +50 M❤️」',
    shareEarn: '「社区分享」',
    shareEarnDesc: '「获赞/评论 +5 M❤️」',
    streakEarn: '「连续登录」',
    streakEarnDesc: '「7 日连续 ×2 加成」',
    entropyTitle: '「负熵生态联盟」',
    entropyDesc: '「跨平台 M❤️值流通协议，Spotify 播放量按 1:100 兑换」',

    // Star Plan Tab
    starTitle: '「星辰演化周期」',
    shortCycle: '「短周期（周）」',
    midCycle: '「中周期（季）」',
    longCycle: '「长周期（年）」',
    starDust: '「星尘收集日」',
    starDustDesc: '「碎片化心愿达成，收集音乐星尘」',
    supernova: '「超新星爆发」',
    supernovaDesc: '「限时创作冲刺，灵感爆发竞赛」',
    constellation: '「星座成形礼」',
    constellationDesc: '「音乐 DNA 图谱解锁，风格基因显现」',
    darkMatter: '「暗物质探险」',
    darkMatterDesc: '「冷门风格挑战，发现未知音域」',
    heatDeath: '「热寂仪式」',
    heatDeathDesc: '「熵减成就殿堂，年度回顾典礼」',
    singularity: '「奇点重生」',
    singularityDesc: '「神经接口升级，创作维度跃迁」',
    neuralMatrix: '「神经接口矩阵」',
    basicLevel: '「基础级」',
    basicInput: '「肌电手势」',
    basicOutput: '「控制音量/混响」',
    advancedLevel: '「进阶级」',
    advancedInput: '「眼动追踪」',
    advancedOutput: '「选择旋律走向」',
    ultimateLevel: '「终极级」',
    ultimateInput: '「脑机接口」',
    ultimateOutput: '「意念生成音色」',

    // Participate Tab
    participateTitle: '「参与激励 · 无感渗透」',
    activeStreak: '「活跃连击」',
    days: '「天」',
    listeningTime: '「聆听时长」',
    minutes: '「分钟」',
    creativeWorks: '「创作积累」',
    works: '「作品」',
    communityActs: '「社区互动」',
    interactions: '「次」',
    perfectBuffer: '「完美主义缓冲」',
    perfectBufferDesc: '「作品保存时自动生成 3 个分支存档」',
    perfectBufferHint: '「87% 用户更爱不完美的真实」',
    frustrationEngine: '「挫折转化引擎」',
    frustrationDesc: '「创作瓶颈时扣除 30% 能量生成「心碎水晶」」',
    frustrationHint: '「镶嵌后作品情感强度 +20%」',
    gestureHint: '「隐藏 95% 功能，上滑唤出歌词云，左滑进入和弦海」',
    timeElastic: '「时间弹性」',
    timeElasticDesc: '「检测灵感状态自动调节界面响应速度」',

    // Exposure Tab
    exposureTitle: '「曝光舞台 · 创作发现」',
    trendingNow: '「正在热门」',
    risingStars: '「新星崛起」',
    editorPick: '「编辑精选」',
    communityVote: '「社区票选」',
    exposureMech: '「曝光机制」',
    algorithmPush: '「算法推送」',
    algorithmPushDesc: '「基于情感匹配的智能推荐」',
    peerReview: '「同行评审」',
    peerReviewDesc: '「创作者互评获得曝光加成」',
    timeCapsule: '「时间胶囊」',
    timeCapsuleDesc: '「年度 TOP 作品编码为量子态存储」',
    crossSpecies: '「跨物种音乐协议」',
    crossSpeciesDesc: '「鲸歌→电子乐，植物电信号→环境音」',

    // Recognition Tab
    recognitionTitle: '「点名殿堂 · 荣耀加冕」',
    achievements: '「成就殿堂」',
    firstCreate: '「初次创作」',
    firstCreateDesc: '「完成第一首原创作品」',
    hundredListens: '「百曲通鉴」',
    hundredListensDesc: '「累计聆听 100 首不同歌曲」',
    weekStreak: '「周连击王」',
    weekStreakDesc: '「连续 7 天活跃参与」',
    emotionMaster: '「情感大师」',
    emotionMasterDesc: '「作品覆盖 5 种以上情感维度」',
    genomeUnlock: '「基因解锁」',
    genomeUnlockDesc: '「解锁个人音乐 DNA 图谱」',
    starForge: '「星辰铸造者」',
    starForgeDesc: '「M❤️值累计突破 1000」',
    memoryInherit: '「记忆遗传系统」',
    memoryInheritDesc: '「旋律通过 DNA 验证解锁为 AI 和声」',
    doomsdayArk: '「末日方舟计划」',
    doomsdayArkDesc: '「当全球灾难预警时 TOP1000 作品发射至月球基地」',
    visionTitle: '「文明级愿景」',
    visionQuote: '「每一次和弦都是对抗虚无的起义，每颗星辰皆是平凡灵魂加冕的王座。」',
  },
  en: {
    title: 'Incentive System',
    subtitle: 'M❤️ Ecosystem · Star Evolution',
    mheart: 'M❤️',
    starplan: 'Stars',
    participate: 'Join',
    exposure: 'Stage',
    recognition: 'Honor',

    mheartTitle: 'M❤️ Value Ecosystem',
    totalValue: 'Total M❤️',
    physicalUniverse: 'Physical',
    virtualUniverse: 'Virtual',
    spiritUniverse: 'Spiritual',
    physicalDesc: 'Sound Cards · Limited Vinyl',
    virtualDesc: 'Dynamic NFT · Cross-platform',
    spiritDesc: 'Neural Cert · Emotion Bank',
    dailyGain: 'Today',
    weeklyGain: 'This Week',
    currentLevel: 'Level',
    earnRules: 'How to Earn M❤️',
    listenEarn: 'Listen to Music',
    listenEarnDesc: '+1.2 M❤️ per minute',
    createEarn: 'Create Original',
    createEarnDesc: '+50 M❤️ per work',
    shareEarn: 'Community Share',
    shareEarnDesc: '+5 M❤️ per like/comment',
    streakEarn: 'Daily Streak',
    streakEarnDesc: '7-day streak = ×2 bonus',
    entropyTitle: 'Negative Entropy Alliance',
    entropyDesc: 'Cross-platform M❤️ protocol: Spotify plays convert 1:100',

    starTitle: 'Star Evolution Cycles',
    shortCycle: 'Short (Weekly)',
    midCycle: 'Medium (Quarterly)',
    longCycle: 'Long (Yearly)',
    starDust: 'Stardust Day',
    starDustDesc: 'Collect music stardust fragments',
    supernova: 'Supernova Burst',
    supernovaDesc: 'Timed creation sprint competition',
    constellation: 'Constellation Rite',
    constellationDesc: 'Unlock your Music DNA genome',
    darkMatter: 'Dark Matter Quest',
    darkMatterDesc: 'Explore obscure genre challenges',
    heatDeath: 'Heat Death Rite',
    heatDeathDesc: 'Annual entropy-reduction ceremony',
    singularity: 'Singularity Rebirth',
    singularityDesc: 'Neural interface dimension leap',
    neuralMatrix: 'Neural Interface Matrix',
    basicLevel: 'Basic',
    basicInput: 'EMG Gestures',
    basicOutput: 'Volume/Reverb Control',
    advancedLevel: 'Advanced',
    advancedInput: 'Eye Tracking',
    advancedOutput: 'Melody Direction',
    ultimateLevel: 'Ultimate',
    ultimateInput: 'BCI Direct',
    ultimateOutput: 'Mind-Generated Timbre',

    participateTitle: 'Participation · Ambient Rewards',
    activeStreak: 'Active Streak',
    days: 'days',
    listeningTime: 'Listen Time',
    minutes: 'min',
    creativeWorks: 'Creations',
    works: 'works',
    communityActs: 'Community',
    interactions: 'acts',
    perfectBuffer: 'Perfectionism Buffer',
    perfectBufferDesc: 'Auto-saves 3 branch archives per work',
    perfectBufferHint: '87% of users prefer authentic imperfection',
    frustrationEngine: 'Frustration Transformer',
    frustrationDesc: 'Creative block → 30% energy → "Heartbreak Crystal"',
    frustrationHint: 'Embed for +20% emotional intensity',
    gestureHint: '95% features hidden. Swipe up=Lyric Cloud, Left=Chord Sea',
    timeElastic: 'Time Elasticity',
    timeElasticDesc: 'Auto-adjusts UI speed based on inspiration state',

    exposureTitle: 'Exposure Stage · Discovery',
    trendingNow: 'Trending',
    risingStars: 'Rising Stars',
    editorPick: 'Editor\'s Pick',
    communityVote: 'Community Vote',
    exposureMech: 'Exposure Mechanisms',
    algorithmPush: 'Smart Push',
    algorithmPushDesc: 'Emotion-matching recommendations',
    peerReview: 'Peer Review',
    peerReviewDesc: 'Creator cross-review for exposure boost',
    timeCapsule: 'Time Capsule',
    timeCapsuleDesc: 'Annual TOP works encoded to quantum state',
    crossSpecies: 'Cross-Species Protocol',
    crossSpeciesDesc: 'Whale songs→electronic, Plant signals→ambient',

    recognitionTitle: 'Recognition Hall · Coronation',
    achievements: 'Achievement Hall',
    firstCreate: 'First Creation',
    firstCreateDesc: 'Complete your first original work',
    hundredListens: 'Century Listener',
    hundredListensDesc: 'Listen to 100 different songs',
    weekStreak: 'Week Warrior',
    weekStreakDesc: '7 consecutive active days',
    emotionMaster: 'Emotion Master',
    emotionMasterDesc: 'Cover 5+ emotional dimensions',
    genomeUnlock: 'Genome Unlock',
    genomeUnlockDesc: 'Reveal your Music DNA profile',
    starForge: 'Star Forger',
    starForgeDesc: 'Accumulate 1000+ M❤️ value',
    memoryInherit: 'Memory Inheritance',
    memoryInheritDesc: 'DNA-verified melody unlocks AI harmonics',
    doomsdayArk: 'Doomsday Ark',
    doomsdayArkDesc: 'Global alert: TOP1000 works launched to lunar base',
    visionTitle: 'Civilization Vision',
    visionQuote: 'Every chord is a rebellion against void, every star a throne for ordinary souls.',
  }
};

export function IncentiveSystem({ isOpen, onClose, language, totalTracks, totalPlayCount, totalListenMinutes, playRecords, onOpenStarPower }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('mheart');
  const t = TRANSLATIONS[language];
  const mheart = useMHeartValue(totalPlayCount, totalListenMinutes);
  const starPowerData = readStarPowerBalance();

  // M❤️ ↔ 星力转化率: 10 M❤️ = 1 星力
  const mheartToStarRate = 10;
  const convertibleSP = Math.floor(mheart.total / mheartToStarRate);

  // Deep PlayRecord analytics for achievement unlocking
  const uniqueTracksPlayed = playRecords.filter(r => r.playCount > 0).length;
  const avgCompletionRate = playRecords.length > 0
    ? playRecords.reduce((sum, r) => sum + r.completionRate, 0) / playRecords.length
    : 0;
  const highCompletionTracks = playRecords.filter(r => r.completionRate >= 0.9).length;
  const totalListenHours = totalListenMinutes / 60;
  const hasRecentActivity = playRecords.some(r => Date.now() - r.lastPlayed < 24 * 60 * 60 * 1000);
  const diverseListening = uniqueTracksPlayed >= 5;
  const devotedListener = playRecords.some(r => r.playCount >= 10);

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'mheart', label: t.mheart, icon: Heart },
    { id: 'starplan', label: t.starplan, icon: Star },
    { id: 'participate', label: t.participate, icon: Zap },
    { id: 'exposure', label: t.exposure, icon: Eye },
    { id: 'recognition', label: t.recognition, icon: Trophy },
  ];

  // Simulated participation data
  const participation = {
    streak: Math.min(Math.floor(totalPlayCount / 3) + 1, 42),
    listenMinutes: totalListenMinutes,
    works: Math.floor(totalPlayCount / 10),
    interactions: Math.floor(totalPlayCount * 2.5 + 12),
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
            className="absolute right-0 top-0 bottom-0 w-full md:w-[440px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl overflow-hidden"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? 'M❤️ 激励体系' : 'M-Heart Incentive System'}
          >
            {/* Starfield background */}
            <StarField active={activeTab === 'starplan'} />

            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30 relative">
                  <PulsingHeart size="w-5 h-5" color="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{t.title}</h3>
                  <p className="text-white/40 text-[11px] font-medium">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LevelBadge level={mheart.level} />
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* M❤️ Quick Stat Bar */}
            <div className="px-4 pt-3 pb-2 border-b border-white/10 relative z-10">
              <div className="flex items-center justify-between bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl px-4 py-2.5 border border-pink-500/20">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                  <span className="text-white/60 text-[11px] font-medium">{t.totalValue}</span>
                </div>
                <div className="text-2xl font-black text-pink-400">
                  <HeartCounter value={mheart.total} color="text-pink-400" />
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-[10px] font-bold">+{mheart.dailyGain} {language === 'zh' ? '今日' : 'today'}</div>
                  <div className="text-white/30 text-[9px]">+{mheart.weeklyGain} {language === 'zh' ? '本周' : 'week'}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-1 relative z-10">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-pink-400 border-pink-400'
                      : 'text-white/40 border-transparent hover:text-white/60'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence mode="wait">

                {/* ━━━ M❤️ VALUE TAB ━━━ */}
                {activeTab === 'mheart' && (
                  <motion.div key="mheart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Three Universe Dimensions */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Orbit className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm font-semibold">{t.mheartTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-3 gap-2">
                        {[
                          { label: t.physicalUniverse, value: mheart.physical, desc: t.physicalDesc, color: 'from-amber-500 to-orange-500', textColor: 'text-amber-400', icon: Gem },
                          { label: t.virtualUniverse, value: mheart.virtual, desc: t.virtualDesc, color: 'from-purple-500 to-violet-500', textColor: 'text-purple-400', icon: Diamond },
                          { label: t.spiritUniverse, value: mheart.spiritual, desc: t.spiritDesc, color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400', icon: Brain },
                        ].map((dim) => (
                          <div key={dim.label} className="bg-white/[0.04] rounded-xl border border-white/[0.06] p-3 text-center hover:bg-white/[0.06] transition-colors">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${dim.color} flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                              <dim.icon className="w-4 h-4 text-white" />
                            </div>
                            <div className={`text-lg font-black ${dim.textColor}`}>{dim.value}</div>
                            <div className="text-white/80 text-[10px] font-semibold mt-0.5">{dim.label}</div>
                            <div className="text-white/25 text-[8px] mt-1 leading-tight">{dim.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Earn Rules */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.earnRules}</span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[
                          { icon: Headphones, label: t.listenEarn, desc: t.listenEarnDesc, color: 'text-blue-400', value: '+1.2' },
                          { icon: Mic2, label: t.createEarn, desc: t.createEarnDesc, color: 'text-purple-400', value: '+50' },
                          { icon: MessageCircle, label: t.shareEarn, desc: t.shareEarnDesc, color: 'text-green-400', value: '+5' },
                          { icon: Flame, label: t.streakEarn, desc: t.streakEarnDesc, color: 'text-amber-400', value: '×2' },
                        ].map((rule) => (
                          <div key={rule.label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
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
                    <div className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-xl border border-amber-500/15 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{language === 'zh' ? '「M❤️ ↔ 星力值联通」' : 'M❤️ ↔ Star Power Bridge'}</span>
                      </div>
                      <div className="p-3 space-y-3">
                        {/* Star Power Balance Display */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Star className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-amber-400 text-lg font-black">{starPowerData.balance.toLocaleString()}</div>
                            <div className="text-white/30 text-[9px] font-medium">{language === 'zh' ? '「当前星力值余额」' : 'Star Power Balance'}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-400 text-[10px] font-bold">+{starPowerData.totalEarned.toLocaleString()}</div>
                            <div className="text-white/25 text-[9px]">{language === 'zh' ? '累计获取' : 'total earned'}</div>
                          </div>
                        </div>

                        {/* Conversion Rate */}
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 flex-shrink-0" />
                          <span className="text-white/50 text-[10px] font-medium flex-1">{language === 'zh' ? '「转化比率」' : 'Conversion'}</span>
                          <span className="text-pink-400 text-[11px] font-bold">{mheartToStarRate} M❤️</span>
                          <ChevronRight className="w-3 h-3 text-white/20" />
                          <span className="text-amber-400 text-[11px] font-bold">1 ⭐</span>
                          <span className="text-white/20 text-[9px] ml-1">≈ {convertibleSP} SP</span>
                        </div>

                        {/* Go to Star Power Button */}
                        {onOpenStarPower && (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { onClose(); onOpenStarPower(); }}
                            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold hover:from-amber-500/25 hover:to-orange-500/15 transition-all flex items-center justify-center gap-2"
                          >
                            <Trophy className="w-3.5 h-3.5" />
                            {language === 'zh' ? '「前往星力排行榜」' : 'Go to Star Power Rankings'}
                            <ChevronRight className="w-3 h-3" />
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Negative Entropy Alliance */}
                    <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Waypoints className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm font-semibold">{t.entropyTitle}</span>
                      </div>
                      <p className="text-white/40 text-[10px] leading-relaxed">{t.entropyDesc}</p>
                      <div className="mt-3 flex items-center gap-2">
                        {['Spotify', 'Apple Music', 'D-Music'].map((name, i) => (
                          <div key={name} className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                              <Globe className="w-3 h-3 text-white/50" />
                            </div>
                            <span className="text-white/40 text-[9px] font-medium">{name}</span>
                            {i < 2 && <ChevronRight className="w-3 h-3 text-white/20" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ STAR PLAN TAB ━━━ */}
                {activeTab === 'starplan' && (
                  <motion.div key="starplan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Star Evolution Timeline */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.starTitle}</span>
                      </div>
                      <div className="p-3 space-y-3">
                        {/* Short Cycle */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-3 h-3 text-blue-400" />
                            <span className="text-blue-400 text-[11px] font-bold uppercase tracking-wider">{t.shortCycle}</span>
                          </div>
                          <div className="space-y-1.5 ml-5">
                            {[
                              { label: t.starDust, desc: t.starDustDesc, energy: 3, icon: Sparkles, color: 'text-cyan-400' },
                              { label: t.supernova, desc: t.supernovaDesc, energy: 5, icon: Flame, color: 'text-orange-400' },
                            ].map((item) => (
                              <div key={item.label} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                                <item.icon className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-white/80 text-xs font-semibold block">{item.label}</span>
                                  <span className="text-white/30 text-[10px]">{item.desc}</span>
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-3 rounded-full ${i < item.energy ? 'bg-amber-400' : 'bg-white/10'}`} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mid Cycle */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span className="text-purple-400 text-[11px] font-bold uppercase tracking-wider">{t.midCycle}</span>
                          </div>
                          <div className="space-y-1.5 ml-5">
                            {[
                              { label: t.constellation, desc: t.constellationDesc, energy: 5, icon: Orbit, color: 'text-violet-400' },
                              { label: t.darkMatter, desc: t.darkMatterDesc, energy: 3, icon: Shield, color: 'text-indigo-400' },
                            ].map((item) => (
                              <div key={item.label} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                                <item.icon className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-white/80 text-xs font-semibold block">{item.label}</span>
                                  <span className="text-white/30 text-[10px]">{item.desc}</span>
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-3 rounded-full ${i < item.energy ? 'bg-purple-400' : 'bg-white/10'}`} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Long Cycle */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-3 h-3 text-rose-400" />
                            <span className="text-rose-400 text-[11px] font-bold uppercase tracking-wider">{t.longCycle}</span>
                          </div>
                          <div className="space-y-1.5 ml-5">
                            {[
                              { label: t.heatDeath, desc: t.heatDeathDesc, energy: 1, icon: Award, color: 'text-rose-400' },
                              { label: t.singularity, desc: t.singularityDesc, energy: 5, icon: Zap, color: 'text-pink-400' },
                            ].map((item) => (
                              <div key={item.label} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors">
                                <item.icon className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                                <div className="flex-1 min-w-0">
                                  <span className="text-white/80 text-xs font-semibold block">{item.label}</span>
                                  <span className="text-white/30 text-[10px]">{item.desc}</span>
                                </div>
                                <div className="flex gap-0.5 mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className={`w-1.5 h-3 rounded-full ${i < item.energy ? 'bg-rose-400' : 'bg-white/10'}`} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Neural Interface Matrix */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.neuralMatrix}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { level: t.basicLevel, input: t.basicInput, output: t.basicOutput, color: 'border-green-500/30 bg-green-500/5', badge: 'bg-green-500/20 text-green-400', progress: 80 },
                          { level: t.advancedLevel, input: t.advancedInput, output: t.advancedOutput, color: 'border-blue-500/30 bg-blue-500/5', badge: 'bg-blue-500/20 text-blue-400', progress: 45 },
                          { level: t.ultimateLevel, input: t.ultimateInput, output: t.ultimateOutput, color: 'border-purple-500/30 bg-purple-500/5', badge: 'bg-purple-500/20 text-purple-400', progress: 15 },
                        ].map((ni) => (
                          <div key={ni.level} className={`rounded-lg border p-3 ${ni.color} hover:bg-white/[0.03] transition-colors`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ni.badge}`}>{ni.level}</span>
                              <span className="text-white/30 text-[9px] font-bold">{ni.progress}%</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-white/50">{ni.input}</span>
                              <ChevronRight className="w-3 h-3 text-white/20" />
                              <span className="text-white/70 font-medium">{ni.output}</span>
                            </div>
                            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${ni.progress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-white/30 to-white/10"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ PARTICIPATION TAB ━━━ */}
                {activeTab === 'participate' && (
                  <motion.div key="participate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Participation Metrics */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.participateTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        {[
                          { label: t.activeStreak, value: participation.streak, unit: t.days, icon: Flame, color: '#f97316', max: 30 },
                          { label: t.listeningTime, value: participation.listenMinutes, unit: t.minutes, icon: Headphones, color: '#3b82f6', max: 300 },
                          { label: t.creativeWorks, value: participation.works, unit: t.works, icon: Music, color: '#a855f7', max: 20 },
                          { label: t.communityActs, value: participation.interactions, unit: t.interactions, icon: Users, color: '#10b981', max: 100 },
                        ].map((metric) => (
                          <div key={metric.label} className="bg-white/[0.04] rounded-xl border border-white/[0.06] p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-colors">
                            <ProgressRing value={metric.value} max={metric.max} color={metric.color} size={44} strokeWidth={3} />
                            <div className="min-w-0">
                              <div className="text-white text-sm font-bold">{metric.value} <span className="text-white/30 text-[9px] font-medium">{metric.unit}</span></div>
                              <div className="text-white/40 text-[9px] font-medium truncate">{metric.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Humanistic Mechanisms */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-violet-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? '人文精神保护' : 'Humanistic Protection'}
                        </span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        {/* Perfectionism Buffer */}
                        <div className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 rounded-lg border border-violet-500/20 p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Shield className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-white/80 text-xs font-semibold">{t.perfectBuffer}</span>
                          </div>
                          <p className="text-white/40 text-[10px] leading-relaxed">{t.perfectBufferDesc}</p>
                          <div className="mt-2 px-2.5 py-1.5 bg-white/5 rounded-md border border-white/[0.06]">
                            <p className="text-pink-300/60 text-[10px] italic flex items-center gap-1.5">
                              <Heart className="w-3 h-3 text-pink-400/60 flex-shrink-0" />
                              {t.perfectBufferHint}
                            </p>
                          </div>
                        </div>

                        {/* Frustration Transformer */}
                        <div className="bg-gradient-to-r from-rose-500/10 to-amber-500/10 rounded-lg border border-rose-500/20 p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Gem className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-white/80 text-xs font-semibold">{t.frustrationEngine}</span>
                          </div>
                          <p className="text-white/40 text-[10px] leading-relaxed">{t.frustrationDesc}</p>
                          <div className="mt-2 px-2.5 py-1.5 bg-white/5 rounded-md border border-white/[0.06]">
                            <p className="text-amber-300/60 text-[10px] italic flex items-center gap-1.5">
                              <Diamond className="w-3 h-3 text-amber-400/60 flex-shrink-0" />
                              {t.frustrationHint}
                            </p>
                          </div>
                        </div>

                        {/* Spatial Folding */}
                        <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Waves className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-white/80 text-xs font-semibold">
                              {language === 'zh' ? '空间折叠原则' : 'Spatial Folding'}
                            </span>
                          </div>
                          <p className="text-white/35 text-[10px] leading-relaxed">{t.gestureHint}</p>
                        </div>

                        {/* Time Elasticity */}
                        <div className="bg-white/[0.03] rounded-lg border border-white/[0.06] p-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Activity className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-white/80 text-xs font-semibold">{t.timeElastic}</span>
                          </div>
                          <p className="text-white/35 text-[10px] leading-relaxed">{t.timeElasticDesc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ EXPOSURE TAB ━━━ */}
                {activeTab === 'exposure' && (
                  <motion.div key="exposure" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Exposure Channels */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.exposureTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        {[
                          { label: t.trendingNow, icon: TrendingUp, color: 'text-rose-400', bg: 'from-rose-500/15 to-pink-500/15', border: 'border-rose-500/20', count: 24 },
                          { label: t.risingStars, icon: Star, color: 'text-amber-400', bg: 'from-amber-500/15 to-orange-500/15', border: 'border-amber-500/20', count: 12 },
                          { label: t.editorPick, icon: Award, color: 'text-purple-400', bg: 'from-purple-500/15 to-violet-500/15', border: 'border-purple-500/20', count: 8 },
                          { label: t.communityVote, icon: Users, color: 'text-green-400', bg: 'from-green-500/15 to-emerald-500/15', border: 'border-green-500/20', count: 36 },
                        ].map((ch) => (
                          <motion.div
                            key={ch.label}
                            whileHover={{ scale: 1.02 }}
                            className={`bg-gradient-to-br ${ch.bg} rounded-xl border ${ch.border} p-3 text-center cursor-pointer hover:shadow-lg transition-all`}
                          >
                            <ch.icon className={`w-6 h-6 ${ch.color} mx-auto mb-1.5`} />
                            <div className="text-white text-[11px] font-semibold">{ch.label}</div>
                            <div className={`text-lg font-black mt-1 ${ch.color}`}>{ch.count}</div>
                            <div className="text-white/25 text-[9px]">{language === 'zh' ? '作品展示中' : 'works featured'}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Exposure Mechanisms */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Target className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm font-semibold">{t.exposureMech}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { icon: Brain, label: t.algorithmPush, desc: t.algorithmPushDesc, color: 'text-cyan-400' },
                          { icon: Users, label: t.peerReview, desc: t.peerReviewDesc, color: 'text-green-400' },
                          { icon: Clock, label: t.timeCapsule, desc: t.timeCapsuleDesc, color: 'text-violet-400' },
                          { icon: Radio, label: t.crossSpecies, desc: t.crossSpeciesDesc, color: 'text-amber-400' },
                        ].map((mech) => (
                          <div key={mech.label} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
                            <mech.icon className={`w-4 h-4 ${mech.color} mt-0.5 flex-shrink-0`} />
                            <div className="min-w-0">
                              <span className="text-white/80 text-xs font-semibold block">{mech.label}</span>
                              <span className="text-white/30 text-[10px]">{mech.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Exposure Boost Indicator */}
                    <div className="bg-gradient-to-br from-cyan-500/10 to-green-500/10 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? '曝光加成因子' : 'Exposure Boost Factors'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: language === 'zh' ? '情感共鸣度' : 'Emotional Resonance', value: 85 },
                          { label: language === 'zh' ? '原创独特性' : 'Originality', value: 72 },
                          { label: language === 'zh' ? '社区互动率' : 'Community Engagement', value: 63 },
                          { label: language === 'zh' ? '创作完成度' : 'Completion Rate', value: 91 },
                        ].map((factor) => (
                          <div key={factor.label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-white/50 text-[10px] font-medium">{factor.label}</span>
                              <span className="text-white/80 text-[10px] font-bold">{factor.value}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.value}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-green-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ RECOGNITION TAB ━━━ */}
                {activeTab === 'recognition' && (
                  <motion.div key="recognition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Achievement Hall */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.achievements}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { icon: Mic2, label: t.firstCreate, desc: t.firstCreateDesc, unlocked: totalTracks > 0, color: 'text-purple-400', bgUnlocked: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', progress: totalTracks > 0 ? 100 : 0 },
                          { icon: Headphones, label: t.hundredListens, desc: t.hundredListensDesc, unlocked: uniqueTracksPlayed >= 100, color: 'text-blue-400', bgUnlocked: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', progress: Math.min(uniqueTracksPlayed, 100) },
                          { icon: Flame, label: t.weekStreak, desc: t.weekStreakDesc, unlocked: participation.streak >= 7 && hasRecentActivity, color: 'text-orange-400', bgUnlocked: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', progress: Math.round(Math.min(participation.streak, 7) * 100 / 7) },
                          { icon: Heart, label: t.emotionMaster, desc: t.emotionMasterDesc, unlocked: diverseListening && avgCompletionRate >= 0.7, color: 'text-pink-400', bgUnlocked: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', progress: Math.round(diverseListening ? (avgCompletionRate >= 0.7 ? 100 : avgCompletionRate * 100) : uniqueTracksPlayed * 20) },
                          { icon: Orbit, label: t.genomeUnlock, desc: t.genomeUnlockDesc, unlocked: uniqueTracksPlayed >= 20 && highCompletionTracks >= 5, color: 'text-cyan-400', bgUnlocked: 'from-cyan-500/20 to-teal-500/20', border: 'border-cyan-500/30', progress: Math.round(Math.min((uniqueTracksPlayed / 20 + highCompletionTracks / 5) * 50, 100)) },
                          { icon: Crown, label: t.starForge, desc: t.starForgeDesc, unlocked: mheart.total >= 1000, color: 'text-amber-400', bgUnlocked: 'from-amber-500/20 to-yellow-500/20', border: 'border-amber-500/30', progress: Math.round(Math.min(mheart.total / 10, 100)) },
                          { icon: Sparkles, label: language === 'zh' ? '忠实听众' : 'Devoted Fan', desc: language === 'zh' ? '单曲循环10次以上' : 'Loop a single track 10+ times', unlocked: devotedListener, color: 'text-violet-400', bgUnlocked: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30', progress: Math.round(devotedListener ? 100 : Math.min((playRecords.length > 0 ? Math.max(...playRecords.map(r => r.playCount)) : 0) * 10, 100)) },
                          { icon: Clock, label: language === 'zh' ? '时间旅人' : 'Time Traveler', desc: language === 'zh' ? '累计聆听超过10小时' : 'Listen for 10+ hours total', unlocked: totalListenHours >= 10, color: 'text-emerald-400', bgUnlocked: 'from-emerald-500/20 to-green-500/20', border: 'border-emerald-500/30', progress: Math.round(Math.min(totalListenHours * 10, 100)) },
                        ].map((ach) => (
                          <motion.div
                            key={ach.label}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                              ach.unlocked
                                ? `bg-gradient-to-r ${ach.bgUnlocked} ${ach.border}`
                                : 'bg-white/[0.02] border-white/[0.06] opacity-50'
                            }`}
                          >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                              ach.unlocked ? `bg-white/10` : 'bg-white/5'
                            }`}>
                              <ach.icon className={`w-[18px] h-[18px] ${ach.unlocked ? ach.color : 'text-white/20'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-semibold ${ach.unlocked ? 'text-white/90' : 'text-white/30'}`}>{ach.label}</span>
                                {ach.unlocked && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-green-400"
                                  >
                                    <Award className="w-3 h-3" />
                                  </motion.span>
                                )}
                              </div>
                              <span className="text-white/25 text-[10px]">{ach.desc}</span>
                              {!ach.unlocked && (
                                <div className="mt-1.5 flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${ach.progress}%` }}
                                      transition={{ duration: 0.8, ease: 'easeOut' }}
                                      className={`h-full rounded-full bg-gradient-to-r from-white/20 to-white/10`}
                                    />
                                  </div>
                                  <span className="text-white/20 text-[8px] font-bold tabular-nums">{ach.progress}%</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Generational Vision */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-rose-400" />
                        <span className="text-white text-sm font-semibold">{t.visionTitle}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <Orbit className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-white/80 text-xs font-semibold block">{t.memoryInherit}</span>
                            <span className="text-white/30 text-[10px]">{t.memoryInheritDesc}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                          <Shield className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-white/80 text-xs font-semibold block">{t.doomsdayArk}</span>
                            <span className="text-white/30 text-[10px]">{t.doomsdayArkDesc}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ultimate Vision */}
                    <div className="bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-blue-500/15 rounded-xl border border-white/10 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <Crown className="w-5 h-5 text-amber-400" />
                          <span className="text-white text-sm font-bold">
                            {language === 'zh' ? '终极宣言' : 'Ultimate Declaration'}
                          </span>
                        </div>
                        <p className="text-white/60 text-[11px] leading-relaxed italic">
                          {t.visionQuote}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                          >
                            <Star className="w-4 h-4 text-amber-400/40" />
                          </motion.div>
                          <div className="h-px flex-1 bg-gradient-to-r from-pink-500/30 via-amber-500/30 to-blue-500/30" />
                          <PulsingHeart size="w-4 h-4" color="text-pink-400/60" />
                        </div>
                      </div>
                    </div>
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