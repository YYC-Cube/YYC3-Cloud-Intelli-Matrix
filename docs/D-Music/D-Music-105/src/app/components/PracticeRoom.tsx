import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mic, Headset, Swords, Crown, Star, Flame, Trophy,
  TrendingUp, Users, Zap, Shield, Lock,
  Diamond, Medal, Timer, Gauge, Eye, ChevronRight,
  Fingerprint, BadgeCheck, Gem,
  Monitor, Palette, Brain, Award, Globe, Layers,
  Activity, Sparkles, Volume2
} from 'lucide-react';

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
  playRecords: PlayRecord[];
  totalTracks: number;
}

type TabId = 'cabin' | 'rankings' | 'starpower' | 'vip' | 'security';

// Lava chart canvas for rankings
function LavaChart({ data, active }: { data: { label: string; value: number; color: string }[]; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const barW = Math.min(32, (w - 20) / data.length - 8);
      const maxVal = Math.max(...data.map(d => d.value), 1);

      data.forEach((d, i) => {
        const x = 10 + i * (barW + 8) + barW / 2;
        const barH = (d.value / maxVal) * (h - 40);
        const waveOffset = Math.sin(t * 0.03 + i) * 3;

        // Lava glow
        const grad = ctx.createLinearGradient(x - barW / 2, h - 24, x - barW / 2, h - 24 - barH);
        grad.addColorStop(0, d.color);
        grad.addColorStop(0.5, d.color + 'cc');
        grad.addColorStop(1, d.color + '44');
        ctx.fillStyle = grad;

        // Rounded bar
        const rx = x - barW / 2;
        const ry = h - 24 - barH + waveOffset;
        const rr = 4;
        ctx.beginPath();
        ctx.moveTo(rx + rr, ry);
        ctx.lineTo(rx + barW - rr, ry);
        ctx.quadraticCurveTo(rx + barW, ry, rx + barW, ry + rr);
        ctx.lineTo(rx + barW, h - 24);
        ctx.lineTo(rx, h - 24);
        ctx.lineTo(rx, ry + rr);
        ctx.quadraticCurveTo(rx, ry, rx + rr, ry);
        ctx.fill();

        // Bubble particles
        for (let b = 0; b < 2; b++) {
          const bx = rx + Math.random() * barW;
          const by = h - 24 - Math.random() * barH * 0.6;
          const br = Math.random() * 1.5 + 0.5;
          ctx.beginPath();
          ctx.arc(bx, by + waveOffset, br, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.fill();
        }

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.label, x, h - 8);

        // Value
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(String(d.value), x, ry + waveOffset - 6);
      });
      t++;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [data, active]);

  return <canvas ref={canvasRef} className="w-full h-32 rounded-lg" />;
}

// DNA Helix visualization
function DNAHelix({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      for (let i = 0; i < 20; i++) {
        const y = (i / 20) * h;
        const offset = Math.sin((t * 0.02) + i * 0.5) * 25;
        const x1 = cx + offset;
        const x2 = cx - offset;
        const alpha = 0.3 + Math.abs(Math.sin(t * 0.02 + i * 0.5)) * 0.5;

        // Strand 1
        ctx.beginPath();
        ctx.arc(x1, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${alpha})`;
        ctx.fill();

        // Strand 2
        ctx.beginPath();
        ctx.arc(x2, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${alpha})`;
        ctx.fill();

        // Connection
        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      t++;
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className="w-16 h-32 mx-auto" />;
}

const TRANSLATIONS = {
  zh: {
    title: '「练个房 · 创作舱」',
    subtitle: '「三维虚拟创作空间」',
    cabin: '「创作舱」',
    rankings: '「排行榜」',
    starpower: '「星力」',
    vip: '「VIP」',
    security: '「安全」',

    // Cabin Tab
    cabinTitle: '「三维虚拟创作舱」',
    soloCabin: '「独练舱」',
    soloDesc: '「AI 实时音准纠正 · 情感分析反馈」',
    soloCost: '「50 星力/小时」',
    battleRoom: '「对飙房」',
    battleDesc: '「双人实时词曲 Battle · AI 裁判评分」',
    battleCost: '「200 星力/场」',
    masterClass: '「大师课」',
    masterDesc: '「签约音乐人直播指导 · 可打赏」',
    masterCost: '「免费观看 · 500 星力提问」',
    voiceMirror: '「AI 声纹镜像」',
    voiceMirrorDesc: '「演唱时生成 3D 音轨可视化模型，实时标注音准偏差」',
    emotionWall: '「情感共鸣墙」',
    emotionWallDesc: '「根据练习表现生成色彩粒子特效」',
    crossRoomPK: '「跨房 PK」',
    crossRoomPKDesc: '「发起挑战后双方作品进入 24 小时星力票选战场」',
    growthTitle: '「成长体系联动」',
    practiceHours: '「累计练习」',
    hours: '「小时」',
    pitchAccuracy: '「音准评分」',
    newStarTitle: '「初啼新星」',
    newStarDesc: '「累计练习 10 小时解锁」',
    directChart: '「直通日榜」',
    directChartDesc: '「音准评分超 90% 作品直通日榜」',

    // Rankings Tab
    rankingsTitle: '「复合维度榜单」',
    heatRank: '「星力·热力榜」',
    heatFormula: '「(星力投入×0.6)+(播放量×0.3)+(分享量×0.1)」',
    diligenceRank: '「练功·勤奋榜」',
    diligenceFormula: '「练习时长×1.5 + AI 认可进步次数×3」',
    gloryRank: '「荣耀·氪金榜」',
    gloryFormula: '「充值金额+星力消费总额」',
    yourRank: '「你的排名」',
    topUsers: '「前 10 用户」',

    // Star Power Tab
    starpowerTitle: '「星力生态规则」',
    earnWays: '「新型获取方式」',
    practiceAchieve: '「练个房成就」',
    practiceAchieveDesc: '「完成 5 次 S 评级练习 +200 星力」',
    starBank: '「星力银行」',
    starBankDesc: '「闲置星力可出借，按 1%/日收取利息」',
    consumeExpand: '「消耗场景扩展」',
    effectSkin: '「特效皮肤」',
    effectSkinDesc: '「赛博霓虹/古风水墨：500-2000 星力」',
    aiVoice: '「AI 陪练声线」',
    aiVoiceDesc: '「高级声线解锁：3000 星力/周」',
    skinShop: '「动态皮肤商店」',
    starlight: '「星光粒子拖尾」',
    starlightCost: '「6 元」',
    rainbow: '「虹彩渐变星轨」',
    rainbowCost: '「30 元」',
    supernovaSkin: '「超新星爆发入场」',
    supernovaCost: '「648 元」',

    // VIP Tab
    vipTitle: '「VIP 特权深化」',
    vipLevel: '「至尊等级」',
    vipMultiplier: '「星力倍增器」',
    vipMultiplierDesc: '「消耗 1 星力 = 普通用户 1.2 星力效果」',
    vipLatency: '「零延迟特权」',
    vipLatencyDesc: '「练个房网络优先保障」',
    vipProtect: '「榜单保护」',
    vipProtectDesc: '「每月 3 次 · 24 小时内排名不下滑」',
    vipExp: '「VIP 经验值」',
    vipExpDesc: '「每消耗 100 星力练习 = +1 经验」',

    // Security Tab
    securityTitle: '「反作弊系统」',
    voiceprintCheck: '「声纹波动检测」',
    voiceprintDesc: '「不同设备练习时比对音色一致性」',
    progressCheck: '「进步合理性评估」',
    progressDesc: '「24 小时内音准提升超 30% 需人工复核」',
    starpowerFirewall: '「星力防火墙」',
    freeLimit: '「免费星力获取」',
    freeLimitDesc: '「每日上限 2000（签到+任务+邀请）」',
    tradeTax: '「星力交易税」',
    tradeTaxDesc: '「用户间转赠收取 20% 手续费」',
    largeVerify: '「大额充值验证」',
    largeVerifyDesc: '「单笔超 500 元需人脸识别」',
    monitorDashboard: '「实时监控看板」',
    inflationRate: '「星力通胀率」',
    inflationThreshold: '「超过 5% 自动触发回收任务」',
    concurrency: '「房间并发量」',
    concurrencyThreshold: '「峰值时启用弹性云服务器」',
    churnAlert: '「VIP 流失预警」',
    churnThreshold: '「连续 3 天未登录触发专属客服介入」',
  },
  en: {
    title: 'Practice Room',
    subtitle: '3D Virtual Creation Space',
    cabin: 'Cabin',
    rankings: 'Ranks',
    starpower: 'Stars',
    vip: 'VIP',
    security: 'Safety',

    cabinTitle: '3D Virtual Creation Cabins',
    soloCabin: 'Solo Cabin',
    soloDesc: 'AI real-time pitch correction · Emotion analysis',
    soloCost: '50 SP/hour',
    battleRoom: 'Battle Room',
    battleDesc: 'Real-time songwriting battle · AI judge scoring',
    battleCost: '200 SP/match',
    masterClass: 'Master Class',
    masterDesc: 'Pro musician live coaching · Tips enabled',
    masterCost: 'Free view · 500 SP to ask',
    voiceMirror: 'AI Voiceprint Mirror',
    voiceMirrorDesc: '3D audio track visualization with real-time pitch annotation',
    emotionWall: 'Emotion Resonance Wall',
    emotionWallDesc: 'Color particle effects based on practice performance',
    crossRoomPK: 'Cross-Room PK',
    crossRoomPKDesc: 'Challenge: 24h star-power voting battlefield',
    growthTitle: 'Growth System',
    practiceHours: 'Total Practice',
    hours: 'hours',
    pitchAccuracy: 'Pitch Score',
    newStarTitle: 'Rising Star',
    newStarDesc: 'Unlock at 10 hours of practice',
    directChart: 'Chart Direct',
    directChartDesc: 'Pitch score >90% → auto-qualify for daily chart',

    rankingsTitle: 'Multi-Dimension Rankings',
    heatRank: 'Heat Rank',
    heatFormula: '(SP input×0.6)+(plays×0.3)+(shares×0.1)',
    diligenceRank: 'Diligence Rank',
    diligenceFormula: 'Practice hours×1.5 + AI-approved progress×3',
    gloryRank: 'Glory Rank',
    gloryFormula: 'Recharge + SP total consumption',
    yourRank: 'Your Rank',
    topUsers: 'Top 10',

    starpowerTitle: 'Star Power Ecosystem',
    earnWays: 'New Earning Methods',
    practiceAchieve: 'Practice Achievement',
    practiceAchieveDesc: '5 S-rated sessions → +200 SP',
    starBank: 'Star Bank',
    starBankDesc: 'Lend idle SP at 1%/day interest',
    consumeExpand: 'Spending Expansion',
    effectSkin: 'Effect Skins',
    effectSkinDesc: 'Cyber Neon/Ink Wash: 500-2000 SP',
    aiVoice: 'AI Coach Voice',
    aiVoiceDesc: 'Premium voice: 3000 SP/week',
    skinShop: 'Dynamic Skin Shop',
    starlight: 'Starlight Trail',
    starlightCost: '$1',
    rainbow: 'Rainbow Orbit',
    rainbowCost: '$5',
    supernovaSkin: 'Supernova Entry',
    supernovaCost: '$99',

    vipTitle: 'VIP Privileges',
    vipLevel: 'Supreme Level',
    vipMultiplier: 'SP Multiplier',
    vipMultiplierDesc: '1 SP spent = 1.2 SP effect for normal users',
    vipLatency: 'Zero Latency',
    vipLatencyDesc: 'Practice room network priority',
    vipProtect: 'Rank Shield',
    vipProtectDesc: '3x/month · 24h rank protection',
    vipExp: 'VIP Experience',
    vipExpDesc: 'Every 100 SP spent = +1 EXP',

    securityTitle: 'Anti-Cheat System',
    voiceprintCheck: 'Voiceprint Detection',
    voiceprintDesc: 'Cross-device voice consistency check',
    progressCheck: 'Progress Validation',
    progressDesc: '30%+ pitch improvement in 24h → manual review',
    starpowerFirewall: 'SP Firewall',
    freeLimit: 'Free SP Limit',
    freeLimitDesc: 'Daily cap: 2000 (check-in+tasks+invites)',
    tradeTax: 'Transfer Tax',
    tradeTaxDesc: '20% fee on user-to-user transfers',
    largeVerify: 'Large Purchase Verify',
    largeVerifyDesc: 'Face ID for purchases over $80',
    monitorDashboard: 'Live Monitor Dashboard',
    inflationRate: 'SP Inflation Rate',
    inflationThreshold: '>5% triggers auto-recall task',
    concurrency: 'Room Concurrency',
    concurrencyThreshold: 'Peak → elastic cloud servers',
    churnAlert: 'VIP Churn Alert',
    churnThreshold: '3 days offline → dedicated support',
  }
};

export function PracticeRoom({ isOpen, onClose, language, playRecords, totalTracks }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('cabin');
  const t = TRANSLATIONS[language];

  // Derived stats from PlayRecord
  const totalPlayCount = playRecords.reduce((s, r) => s + r.playCount, 0);
  const totalDuration = playRecords.reduce((s, r) => s + r.totalDuration, 0);
  const totalHours = Math.round(totalDuration / 3600 * 10) / 10;
  const avgCompletion = playRecords.length > 0
    ? Math.round(playRecords.reduce((s, r) => s + r.completionRate, 0) / playRecords.length * 100)
    : 0;
  const uniqueTracks = playRecords.filter(r => r.playCount > 0).length;
  const starPower = Math.floor(totalPlayCount * 15 + totalHours * 80 + uniqueTracks * 30 + 500);
  const vipLevel = starPower > 8000 ? 9 : starPower > 5000 ? 7 : starPower > 3000 ? 5 : starPower > 1500 ? 3 : 1;
  const vipExp = Math.floor(starPower / 100);
  const pitchScore = Math.min(95, 60 + avgCompletion * 0.35);

  // Mock ranking data
  const rankingData = {
    heat: [
      { name: language === 'zh' ? '星辰少年' : 'StarBoy', score: 12400 },
      { name: language === 'zh' ? '月光诗人' : 'MoonPoet', score: 11200 },
      { name: language === 'zh' ? '你' : 'You', score: Math.floor(starPower * 0.6 + totalPlayCount * 30), isUser: true },
      { name: language === 'zh' ? '风之子' : 'WindKid', score: 8900 },
      { name: language === 'zh' ? '夜莺' : 'Nightingale', score: 7600 },
    ].sort((a, b) => b.score - a.score),
    diligence: [
      { name: language === 'zh' ? '勤奋达人' : 'Grinder', score: 980 },
      { name: language === 'zh' ? '你' : 'You', score: Math.floor(totalHours * 1.5 + totalPlayCount * 3), isUser: true },
      { name: language === 'zh' ? '音律修行者' : 'MelodyMonk', score: 720 },
      { name: language === 'zh' ? '日出歌者' : 'DawnSinger', score: 650 },
    ].sort((a, b) => b.score - a.score),
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'cabin', label: t.cabin, icon: Mic },
    { id: 'rankings', label: t.rankings, icon: Trophy },
    { id: 'starpower', label: t.starpower, icon: Star },
    { id: 'vip', label: t.vip, icon: Crown },
    { id: 'security', label: t.security, icon: Shield },
  ];

  // Lava chart data
  const lavaData = [
    { label: language === 'zh' ? '热力' : 'Heat', value: Math.floor(starPower * 0.6 + totalPlayCount * 30), color: '#ef4444' },
    { label: language === 'zh' ? '勤奋' : 'Dilig', value: Math.floor(totalHours * 100 + totalPlayCount * 20), color: '#a855f7' },
    { label: language === 'zh' ? '荣耀' : 'Glory', value: Math.floor(starPower * 0.4), color: '#f59e0b' },
    { label: language === 'zh' ? '分享' : 'Share', value: Math.floor(totalPlayCount * 8), color: '#3b82f6' },
    { label: language === 'zh' ? '创作' : 'Create', value: Math.floor(uniqueTracks * 45 + 30), color: '#10b981' },
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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[460px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl overflow-hidden"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '练习室' : 'Practice Room'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{t.title}</h3>
                  <p className="text-white/40 text-[11px] font-medium">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/15 rounded-full border border-amber-500/25">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 text-[10px] font-bold">{starPower.toLocaleString()}</span>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-orange-400 border-orange-400'
                      : 'text-white/40 border-transparent hover:text-white/60'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence mode="wait">

                {/* ━━━ CABIN TAB ━━━ */}
                {activeTab === 'cabin' && (
                  <motion.div key="cabin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Room Types */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-semibold">{t.cabinTitle}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { icon: Headset, label: t.soloCabin, desc: t.soloDesc, cost: t.soloCost, color: 'from-blue-500/15 to-cyan-500/15', border: 'border-blue-500/20', textColor: 'text-blue-400', status: true },
                          { icon: Swords, label: t.battleRoom, desc: t.battleDesc, cost: t.battleCost, color: 'from-red-500/15 to-orange-500/15', border: 'border-red-500/20', textColor: 'text-red-400', status: totalPlayCount >= 5 },
                          { icon: Crown, label: t.masterClass, desc: t.masterDesc, cost: t.masterCost, color: 'from-amber-500/15 to-yellow-500/15', border: 'border-amber-500/20', textColor: 'text-amber-400', status: true },
                        ].map((room) => (
                          <motion.div
                            key={room.label}
                            whileHover={{ scale: 1.01 }}
                            className={`bg-gradient-to-r ${room.color} rounded-xl border ${room.border} p-3 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden ${!room.status ? 'opacity-50' : ''}`}
                          >
                            {!room.status && (
                              <div className="absolute inset-0 bg-purple-950/50 flex items-center justify-center z-10">
                                <Lock className="w-5 h-5 text-white/30" />
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0`}>
                                <room.icon className={`w-5 h-5 ${room.textColor}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-white text-xs font-bold">{room.label}</span>
                                  <span className={`text-[9px] font-bold ${room.textColor} bg-white/5 px-2 py-0.5 rounded-full`}>{room.cost}</span>
                                </div>
                                <p className="text-white/35 text-[10px] leading-relaxed">{room.desc}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Special Features */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? '特色功能' : 'Special Features'}
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[
                          { icon: Eye, label: t.voiceMirror, desc: t.voiceMirrorDesc, color: 'text-cyan-400' },
                          { icon: Palette, label: t.emotionWall, desc: t.emotionWallDesc, color: 'text-pink-400' },
                          { icon: Swords, label: t.crossRoomPK, desc: t.crossRoomPKDesc, color: 'text-orange-400' },
                        ].map((feat) => (
                          <div key={feat.label} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
                            <feat.icon className={`w-4 h-4 ${feat.color} mt-0.5 flex-shrink-0`} />
                            <div className="min-w-0">
                              <span className="text-white/80 text-xs font-semibold block">{feat.label}</span>
                              <span className="text-white/30 text-[10px]">{feat.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Emotion Resonance Preview */}
                    <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm font-semibold">{t.emotionWall}</span>
                      </div>
                      <div className="flex gap-2 justify-center">
                        {[
                          { emoji: '🔥', label: language === 'zh' ? '愤怒' : 'Anger', color: 'bg-red-500/20 border-red-500/30' },
                          { emoji: '💧', label: language === 'zh' ? '忧伤' : 'Sorrow', color: 'bg-blue-500/20 border-blue-500/30' },
                          { emoji: '✨', label: language === 'zh' ? '欢乐' : 'Joy', color: 'bg-amber-500/20 border-amber-500/30' },
                          { emoji: '🌙', label: language === 'zh' ? '平静' : 'Calm', color: 'bg-indigo-500/20 border-indigo-500/30' },
                          { emoji: '💜', label: language === 'zh' ? '深情' : 'Deep', color: 'bg-purple-500/20 border-purple-500/30' },
                        ].map((emo) => (
                          <motion.div
                            key={emo.label}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className={`${emo.color} rounded-lg border px-3 py-2 text-center cursor-pointer`}
                          >
                            <div className="text-lg">{emo.emoji}</div>
                            <div className="text-white/40 text-[8px] mt-0.5">{emo.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Growth System */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.growthTitle}</span>
                      </div>
                      <div className="p-3">
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-white/[0.04] rounded-lg border border-white/[0.06] p-3 text-center">
                            <Timer className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                            <div className="text-white font-bold text-lg">{totalHours}</div>
                            <div className="text-white/30 text-[9px]">{t.practiceHours} ({t.hours})</div>
                          </div>
                          <div className="bg-white/[0.04] rounded-lg border border-white/[0.06] p-3 text-center">
                            <Gauge className="w-4 h-4 text-green-400 mx-auto mb-1" />
                            <div className="text-white font-bold text-lg">{pitchScore.toFixed(0)}%</div>
                            <div className="text-white/30 text-[9px]">{t.pitchAccuracy}</div>
                          </div>
                        </div>
                        {/* Achievement Links */}
                        <div className="space-y-1.5">
                          <div className={`flex items-center gap-3 py-2 px-3 rounded-lg border ${totalHours >= 10 ? 'border-green-500/30 bg-green-500/10' : 'border-white/[0.06] bg-white/[0.03] opacity-60'}`}>
                            <Medal className={`w-4 h-4 ${totalHours >= 10 ? 'text-green-400' : 'text-white/20'} flex-shrink-0`} />
                            <div className="flex-1">
                              <span className="text-white/80 text-xs font-semibold">{t.newStarTitle}</span>
                              <span className="text-white/30 text-[10px] block">{t.newStarDesc}</span>
                            </div>
                            {totalHours >= 10 && <BadgeCheck className="w-4 h-4 text-green-400" />}
                          </div>
                          <div className={`flex items-center gap-3 py-2 px-3 rounded-lg border ${pitchScore >= 90 ? 'border-amber-500/30 bg-amber-500/10' : 'border-white/[0.06] bg-white/[0.03] opacity-60'}`}>
                            <Award className={`w-4 h-4 ${pitchScore >= 90 ? 'text-amber-400' : 'text-white/20'} flex-shrink-0`} />
                            <div className="flex-1">
                              <span className="text-white/80 text-xs font-semibold">{t.directChart}</span>
                              <span className="text-white/30 text-[10px] block">{t.directChartDesc}</span>
                            </div>
                            {pitchScore >= 90 && <BadgeCheck className="w-4 h-4 text-amber-400" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ RANKINGS TAB ━━━ */}
                {activeTab === 'rankings' && (
                  <motion.div key="rankings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Lava Chart */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Flame className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm font-semibold">{t.rankingsTitle}</span>
                      </div>
                      <div className="p-3">
                        <LavaChart data={lavaData} active={activeTab === 'rankings'} />
                      </div>
                    </div>

                    {/* Heat Rankings List */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-rose-400" />
                        <span className="text-white text-sm font-semibold">{t.heatRank}</span>
                        <span className="text-white/20 text-[9px] ml-auto">{t.heatFormula}</span>
                      </div>
                      <div className="p-3 space-y-1">
                        {rankingData.heat.map((user, i) => (
                          <div key={user.name} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors border-b border-white/[0.06] last:border-b-0 ${
                            (user as any).isUser ? 'bg-purple-500/10 border-purple-500/20' : 'hover:bg-white/5'
                          }`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                              i === 0 ? 'bg-amber-500/30 text-amber-400' : i === 1 ? 'bg-gray-400/20 text-gray-300' : i === 2 ? 'bg-orange-600/20 text-orange-400' : 'bg-white/5 text-white/30'
                            }`}>
                              {i + 1}
                            </div>
                            <span className={`text-xs font-semibold flex-1 ${(user as any).isUser ? 'text-purple-300' : 'text-white/70'}`}>{user.name}</span>
                            <span className="text-rose-400 text-xs font-bold tabular-nums">{user.score.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Diligence Rankings with DNA Helix */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-violet-400" />
                        <span className="text-white text-sm font-semibold">{t.diligenceRank}</span>
                      </div>
                      <div className="p-3 flex gap-3">
                        <div className="flex-1 space-y-1">
                          {rankingData.diligence.map((user, i) => (
                            <div key={user.name} className={`flex items-center gap-2 py-1.5 px-2 rounded-lg ${(user as any).isUser ? 'bg-purple-500/10' : ''}`}>
                              <span className={`text-[10px] font-black w-4 text-center ${i === 0 ? 'text-amber-400' : 'text-white/30'}`}>{i + 1}</span>
                              <span className={`text-[11px] font-medium flex-1 ${(user as any).isUser ? 'text-purple-300' : 'text-white/60'}`}>{user.name}</span>
                              <span className="text-violet-400 text-[10px] font-bold">{user.score}</span>
                            </div>
                          ))}
                        </div>
                        <DNAHelix active={activeTab === 'rankings'} />
                      </div>
                    </div>

                    {/* Ranking Formula Cards */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: t.heatRank, icon: Flame, color: 'text-red-400', bg: 'from-red-500/10 to-orange-500/10', border: 'border-red-500/20' },
                        { label: t.diligenceRank, icon: Activity, color: 'text-violet-400', bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/20' },
                        { label: t.gloryRank, icon: Crown, color: 'text-amber-400', bg: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-500/20' },
                      ].map((rank) => (
                        <div key={rank.label} className={`bg-gradient-to-b ${rank.bg} rounded-xl border ${rank.border} p-3 text-center`}>
                          <rank.icon className={`w-5 h-5 ${rank.color} mx-auto mb-1`} />
                          <div className="text-white/70 text-[9px] font-bold">{rank.label}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ━━━ STAR POWER TAB ━━━ */}
                {activeTab === 'starpower' && (
                  <motion.div key="starpower" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Star Power Balance */}
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white/50 text-[10px] font-medium mb-1">
                            {language === 'zh' ? '星力余额' : 'Star Power Balance'}
                          </div>
                          <div className="text-amber-400 text-3xl font-black">{starPower.toLocaleString()}</div>
                        </div>
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <Star className="w-10 h-10 text-amber-400/50 fill-amber-400/30" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Earn Ways */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.earnWays}</span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[
                          { icon: Trophy, label: t.practiceAchieve, desc: t.practiceAchieveDesc, value: '+200', color: 'text-green-400' },
                          { icon: Layers, label: t.starBank, desc: t.starBankDesc, value: '1%/d', color: 'text-blue-400' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
                            <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 text-xs font-medium block">{item.label}</span>
                              <span className="text-white/30 text-[10px]">{item.desc}</span>
                            </div>
                            <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Spend Expansion */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Diamond className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">{t.consumeExpand}</span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[
                          { icon: Palette, label: t.effectSkin, desc: t.effectSkinDesc, color: 'text-pink-400' },
                          { icon: Volume2, label: t.aiVoice, desc: t.aiVoiceDesc, color: 'text-cyan-400' },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
                            <item.icon className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                            <div className="min-w-0">
                              <span className="text-white/80 text-xs font-semibold block">{item.label}</span>
                              <span className="text-white/30 text-[10px]">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skin Shop */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Gem className="w-4 h-4 text-rose-400" />
                        <span className="text-white text-sm font-semibold">{t.skinShop}</span>
                      </div>
                      <div className="p-3 grid grid-cols-3 gap-2">
                        {[
                          { label: t.starlight, cost: t.starlightCost, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/25', icon: Sparkles, iconColor: 'text-cyan-400' },
                          { label: t.rainbow, cost: t.rainbowCost, color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/25', icon: Globe, iconColor: 'text-purple-400' },
                          { label: t.supernovaSkin, cost: t.supernovaCost, color: 'from-amber-500/20 to-red-500/20', border: 'border-amber-500/25', icon: Flame, iconColor: 'text-amber-400' },
                        ].map((skin) => (
                          <motion.div
                            key={skin.label}
                            whileHover={{ scale: 1.03, y: -2 }}
                            className={`bg-gradient-to-b ${skin.color} rounded-xl border ${skin.border} p-3 text-center cursor-pointer`}
                          >
                            <skin.icon className={`w-6 h-6 ${skin.iconColor} mx-auto mb-1.5`} />
                            <div className="text-white/80 text-[9px] font-semibold leading-tight">{skin.label}</div>
                            <div className="text-amber-400 text-[10px] font-black mt-1">{skin.cost}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ VIP TAB ━━━ */}
                {activeTab === 'vip' && (
                  <motion.div key="vip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* VIP Level Display */}
                    <div className="bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-orange-500/15 rounded-xl border border-amber-500/25 p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Crown className="w-6 h-6 text-amber-400" />
                            <span className="text-white font-bold text-base">{t.vipTitle}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                            <span className="text-amber-400 text-xs font-black">Lv.{vipLevel}</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-white/40">{t.vipExp}: {vipExp}</span>
                            <span className="text-white/40">{t.vipLevel} {vipLevel} → {vipLevel + 1}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((vipExp % 100), 100)}%` }}
                              transition={{ duration: 1 }}
                              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                            />
                          </div>
                        </div>
                        <p className="text-white/25 text-[9px]">{t.vipExpDesc}</p>
                      </div>
                    </div>

                    {/* VIP Privileges */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? '9级至尊权益' : 'Level 9 Supreme Perks'}
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { icon: Zap, label: t.vipMultiplier, desc: t.vipMultiplierDesc, color: 'text-amber-400', unlocked: vipLevel >= 3, bg: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-500/20' },
                          { icon: Monitor, label: t.vipLatency, desc: t.vipLatencyDesc, color: 'text-green-400', unlocked: vipLevel >= 5, bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/20' },
                          { icon: Shield, label: t.vipProtect, desc: t.vipProtectDesc, color: 'text-blue-400', unlocked: vipLevel >= 7, bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/20' },
                        ].map((priv) => (
                          <div key={priv.label} className={`rounded-xl border p-3 relative overflow-hidden transition-colors ${
                            priv.unlocked ? `bg-gradient-to-r ${priv.bg} ${priv.border}` : 'bg-white/[0.02] border-white/[0.06] opacity-50'
                          }`}>
                            {!priv.unlocked && (
                              <div className="absolute top-2 right-2">
                                <Lock className="w-3.5 h-3.5 text-white/20" />
                              </div>
                            )}
                            <div className="flex items-start gap-3">
                              <priv.icon className={`w-5 h-5 ${priv.unlocked ? priv.color : 'text-white/20'} flex-shrink-0`} />
                              <div className="min-w-0">
                                <span className={`text-xs font-bold block ${priv.unlocked ? 'text-white/90' : 'text-white/30'}`}>{priv.label}</span>
                                <span className="text-white/30 text-[10px]">{priv.desc}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* VIP Level Roadmap */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? 'VIP等级路线图' : 'VIP Level Roadmap'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        {[1, 3, 5, 7, 9].map((lv, i) => (
                          <div key={lv} className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${
                              vipLevel >= lv
                                ? 'bg-amber-500/30 text-amber-400 ring-1 ring-amber-500/50'
                                : 'bg-white/5 text-white/20'
                            }`}>
                              {lv}
                            </div>
                            {i < 4 && <div className={`w-8 h-px ${vipLevel > lv ? 'bg-amber-500/50' : 'bg-white/10'} absolute`} style={{ marginLeft: '1.5rem' }} />}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-2">
                        {[
                          language === 'zh' ? '新手' : 'New',
                          language === 'zh' ? '进阶' : 'Adv',
                          language === 'zh' ? '精英' : 'Elite',
                          language === 'zh' ? '大师' : 'Master',
                          language === 'zh' ? '至尊' : 'Supreme',
                        ].map((label) => (
                          <span key={label} className="text-white/20 text-[8px] font-medium">{label}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ━━━ SECURITY TAB ━━━ */}
                {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

                    {/* Anti-Cheat */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.securityTitle}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { icon: Fingerprint, label: t.voiceprintCheck, desc: t.voiceprintDesc, color: 'text-blue-400', status: 'active' },
                          { icon: Gauge, label: t.progressCheck, desc: t.progressDesc, color: 'text-amber-400', status: 'active' },
                        ].map(item => (
                          <div key={item.label} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <item.icon className={`w-4 h-4 ${item.color} mt-0.5 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-white/80 text-xs font-semibold">{item.label}</span>
                                <span className="text-[8px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full">
                                  {language === 'zh' ? '运行中' : 'Active'}
                                </span>
                              </div>
                              <span className="text-white/30 text-[10px]">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Star Power Firewall */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm font-semibold">{t.starpowerFirewall}</span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        {[
                          { icon: Star, label: t.freeLimit, desc: t.freeLimitDesc, limit: '2000/d', color: 'text-amber-400' },
                          { icon: Users, label: t.tradeTax, desc: t.tradeTaxDesc, limit: '20%', color: 'text-orange-400' },
                          { icon: Fingerprint, label: t.largeVerify, desc: t.largeVerifyDesc, limit: '>$80', color: 'text-red-400' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border-b border-white/[0.06] last:border-b-0">
                            <item.icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 text-xs font-medium block">{item.label}</span>
                              <span className="text-white/30 text-[10px]">{item.desc}</span>
                            </div>
                            <span className={`text-[10px] font-bold ${item.color} bg-white/5 px-2 py-0.5 rounded-full`}>{item.limit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Monitor Dashboard */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.monitorDashboard}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { label: t.inflationRate, threshold: t.inflationThreshold, value: '2.3%', status: 'ok', color: 'text-green-400' },
                          { label: t.concurrency, threshold: t.concurrencyThreshold, value: '847', status: 'ok', color: 'text-green-400' },
                          { label: t.churnAlert, threshold: t.churnThreshold, value: '3', status: 'warn', color: 'text-amber-400' },
                        ].map(item => (
                          <div key={item.label} className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'ok' ? 'bg-green-400' : 'bg-amber-400'}`}>
                              <motion.div
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={`w-2 h-2 rounded-full ${item.status === 'ok' ? 'bg-green-400' : 'bg-amber-400'}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-white/80 text-xs font-semibold block">{item.label}</span>
                              <span className="text-white/25 text-[9px]">{item.threshold}</span>
                            </div>
                            <span className={`text-sm font-black ${item.color}`}>{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Architecture Note */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-white/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">
                          {language === 'zh' ? '技术架构' : 'Tech Architecture'}
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-white/35">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-cyan-400/50 flex-shrink-0" />
                          <span>{language === 'zh' ? '音频传输：Opus编码 + 动态码率（50-256kbps）' : 'Audio: Opus codec + dynamic bitrate (50-256kbps)'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-cyan-400/50 flex-shrink-0" />
                          <span>{language === 'zh' ? '3D渲染：WebGL实例化，支持万人同榜' : '3D: WebGL instancing, 10K+ concurrent board'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-cyan-400/50 flex-shrink-0" />
                          <span>{language === 'zh' ? '实时协作：WebRTC + 边缘节点 + AI分析集群' : 'Realtime: WebRTC + Edge nodes + AI cluster'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-cyan-400/50 flex-shrink-0" />
                          <span>{language === 'zh' ? '存证：区块链星力结算中心' : 'Ledger: Blockchain SP settlement center'}</span>
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