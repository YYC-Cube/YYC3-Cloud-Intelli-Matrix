import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, TrendingUp, Clock, Music, Play,
  Calendar, Headphones, Award, Activity, ChartPie
} from 'lucide-react';

export interface Track {
  id: number;
  title: string;
  file?: File;
  url: string;
  albumId: string | null;
  isVideo?: boolean;
  videoUrl?: string;
  isPersistent?: boolean;
}

export interface PlayRecord {
  trackId: number;
  playCount: number;
  totalDuration: number;
  lastPlayed: number;
  completionRate: number;
}

export interface PlayEvent {
  trackId: number;
  timestamp: number;
  duration: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  tracks: Track[];
  playRecords: PlayRecord[];
  playEvents: PlayEvent[];
}

const TRANSLATIONS = {
  zh: {
    title: '智能数据分析',
    subtitle: '用户行为与内容洞察',
    overview: '概览',
    behavior: '行为分析',
    content: '内容效果',
    trends: '趋势预测',
    totalPlays: '总播放次数',
    totalListenTime: '累计聆听',
    uniqueTracks: '播放曲目数',
    avgPerSession: '场均播放',
    topTracks: '热门曲目 Top 5',
    plays: '次播放',
    listeningDistribution: '聆听时段分布',
    morning: '早晨',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜晚',
    completionAnalysis: '完播率分析',
    high: '高完播率 (>80%)',
    medium: '中完播率 (50-80%)',
    low: '低完播率 (<50%)',
    tracks: '首',
    activityTimeline: '播放活跃度',
    today: '今日',
    thisWeek: '本周',
    trendInsight: '趋势洞察',
    trendUp: '播放量呈上升趋势',
    trendStable: '播放量保持稳定',
    trendDown: '播放量有所下降',
    recommendation: '基于数据的建议',
    recExplore: '推荐探索更多不同风格的音乐',
    recDeepen: '可以深入探索您最喜爱的曲目类型',
    recMore: '增加播放时长以获得更精准的推荐',
    noData: '暂无分析数据',
    noDataHint: '开始播放音乐后，数据将自动采集',
    minutes: '分钟',
    hours: '小时',
    contentEffectTitle: '内容效果评估',
    popularityScore: '受欢迎度',
    engagementScore: '参与度',
    retentionScore: '留存度',
    predictionTitle: '流行趋势预测',
    risingTracks: '上升趋势曲目',
    steadyTracks: '稳定播放曲目',
  },
  en: {
    title: 'Smart Analytics',
    subtitle: 'User Behavior & Content Insights',
    overview: 'Overview',
    behavior: 'Behavior',
    content: 'Content',
    trends: 'Trends',
    totalPlays: 'Total Plays',
    totalListenTime: 'Listen Time',
    uniqueTracks: 'Unique Tracks',
    avgPerSession: 'Avg / Session',
    topTracks: 'Top 5 Tracks',
    plays: 'plays',
    listeningDistribution: 'Listening Distribution',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
    completionAnalysis: 'Completion Analysis',
    high: 'High (>80%)',
    medium: 'Medium (50-80%)',
    low: 'Low (<50%)',
    tracks: 'tracks',
    activityTimeline: 'Activity Timeline',
    today: 'Today',
    thisWeek: 'This Week',
    trendInsight: 'Trend Insight',
    trendUp: 'Play count is trending up',
    trendStable: 'Play count is stable',
    trendDown: 'Play count is declining',
    recommendation: 'Data-Driven Suggestions',
    recExplore: 'Explore more diverse music genres',
    recDeepen: 'Dive deeper into your favorite track styles',
    recMore: 'Increase listening time for better recommendations',
    noData: 'No analytics data yet',
    noDataHint: 'Data collection starts when you play music',
    minutes: 'min',
    hours: 'hrs',
    contentEffectTitle: 'Content Effectiveness',
    popularityScore: 'Popularity',
    engagementScore: 'Engagement',
    retentionScore: 'Retention',
    predictionTitle: 'Trend Prediction',
    risingTracks: 'Rising Tracks',
    steadyTracks: 'Steady Tracks',
  }
};

type TabId = 'overview' | 'behavior' | 'content' | 'trends';

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const width = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex-1">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

function StatCard({ value, label, icon: Icon, color }: { value: string | number; label: string; icon: any; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 rounded-xl p-3 border border-white/5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-white/40 text-[10px] font-medium">{label}</span>
      </div>
      <div className="text-white text-xl font-bold">{value}</div>
    </motion.div>
  );
}

function TimeDistributionBar({ label, value, max, color, icon: Icon }: { 
  label: string; value: number; max: number; color: string; icon: any 
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
        <Icon className={`w-3 h-3 ${color}`} />
        <span className="text-white/50 text-[10px]">{label}</span>
      </div>
      <MiniBar value={value} max={max} color={color.replace('text-', 'bg-')} />
      <span className="text-white/60 text-[10px] font-mono w-8 text-right">{value}</span>
    </div>
  );
}

export function SmartAnalytics({ isOpen, onClose, language, tracks, playRecords, playEvents }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const t = TRANSLATIONS[language];

  const analytics = useMemo(() => {
    const totalPlays = playRecords.reduce((s, r) => s + r.playCount, 0);
    const totalDuration = playRecords.reduce((s, r) => s + r.totalDuration, 0);
    const uniqueTracksPlayed = playRecords.filter(r => r.playCount > 0).length;

    // Top tracks
    const topTracks = [...playRecords]
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 5)
      .map(r => ({
        track: tracks.find(t => t.id === r.trackId),
        ...r
      }))
      .filter(r => r.track);

    const maxPlays = topTracks.length > 0 ? topTracks[0].playCount : 1;

    // Time distribution from events
    const timeDistribution = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    playEvents.forEach(e => {
      const hour = new Date(e.timestamp).getHours();
      if (hour >= 5 && hour < 12) timeDistribution.morning++;
      else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
      else if (hour >= 17 && hour < 21) timeDistribution.evening++;
      else timeDistribution.night++;
    });
    const maxTimeDist = Math.max(...Object.values(timeDistribution), 1);

    // Completion analysis
    const highCompletion = playRecords.filter(r => r.completionRate > 0.8).length;
    const medCompletion = playRecords.filter(r => r.completionRate >= 0.5 && r.completionRate <= 0.8).length;
    const lowCompletion = playRecords.filter(r => r.completionRate < 0.5 && r.playCount > 0).length;

    // Content effectiveness scores
    const popularityScore = Math.min(100, Math.round((totalPlays / Math.max(tracks.length, 1)) * 10));
    const engagementScore = Math.min(100, Math.round((playRecords.filter(r => r.completionRate > 0.7).length / Math.max(playRecords.length, 1)) * 100));
    const retentionScore = Math.min(100, Math.round(uniqueTracksPlayed / Math.max(tracks.length, 1) * 100));

    // Trend detection
    const recentEvents = playEvents.filter(e => e.timestamp > Date.now() - 24 * 60 * 60 * 1000).length;
    const olderEvents = playEvents.filter(e => e.timestamp > Date.now() - 48 * 60 * 60 * 1000 && e.timestamp <= Date.now() - 24 * 60 * 60 * 1000).length;
    const trend = recentEvents > olderEvents * 1.2 ? 'up' : recentEvents < olderEvents * 0.8 ? 'down' : 'stable';

    // Rising tracks (recently gaining plays)
    const risingTracks = [...playRecords]
      .filter(r => r.lastPlayed > Date.now() - 24 * 60 * 60 * 1000)
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 3)
      .map(r => ({ track: tracks.find(t => t.id === r.trackId), ...r }))
      .filter(r => r.track);

    return {
      totalPlays, totalDuration, uniqueTracksPlayed, topTracks, maxPlays,
      timeDistribution, maxTimeDist,
      highCompletion, medCompletion, lowCompletion,
      popularityScore, engagementScore, retentionScore,
      trend, risingTracks, recentEvents
    };
  }, [tracks, playRecords, playEvents]);

  const hasData = playRecords.length > 0;

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'overview', label: t.overview, icon: TrendingUp },
    { id: 'behavior', label: t.behavior, icon: Activity },
    { id: 'content', label: t.content, icon: ChartPie },
    { id: 'trends', label: t.trends, icon: TrendingUp },
  ];

  const formatDuration = (seconds: number) => {
    if (seconds < 3600) return `${Math.round(seconds / 60)} ${t.minutes}`;
    return `${(seconds / 3600).toFixed(1)} ${t.hours}`;
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
            className="absolute right-0 top-0 bottom-0 w-full md:w-[420px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '智能分析' : 'Smart Analytics'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">{t.title}</h3>
                  <p className="text-white/40 text-[11px] font-medium">{t.subtitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-[11px] font-medium flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-cyan-400 border-cyan-400'
                      : 'text-white/50 border-transparent hover:text-white/70'
                  }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {!hasData ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10">
                    <TrendingUp className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/60 text-sm font-medium mb-1">{t.noData}</p>
                  <p className="text-white/30 text-xs">{t.noDataHint}</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <StatCard value={analytics.totalPlays} label={t.totalPlays} icon={Play} color="text-purple-400" />
                        <StatCard value={formatDuration(analytics.totalDuration)} label={t.totalListenTime} icon={Clock} color="text-blue-400" />
                        <StatCard value={analytics.uniqueTracksPlayed} label={t.uniqueTracks} icon={Music} color="text-green-400" />
                        <StatCard value={(analytics.totalPlays / Math.max(analytics.uniqueTracksPlayed, 1)).toFixed(1)} label={t.avgPerSession} icon={Headphones} color="text-amber-400" />
                      </div>

                      {/* Top Tracks */}
                      <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-white text-sm font-semibold">{t.topTracks}</span>
                        </div>
                        <div className="p-3 space-y-3">
                          {analytics.topTracks.map((item, idx) => (
                            <div key={item.trackId} className="flex items-center gap-3">
                              <span className={`text-xs font-bold w-5 text-center ${
                                idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-amber-600' : 'text-white/40'
                              }`}>
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-white/80 text-xs font-medium truncate mb-1">{item.track!.title}</div>
                                <MiniBar value={item.playCount} max={analytics.maxPlays} color={
                                  idx === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                                  idx === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/20'
                                } />
                              </div>
                              <span className="text-white/40 text-[10px] font-mono flex-shrink-0">
                                {item.playCount} {t.plays}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'behavior' && (
                    <motion.div
                      key="behavior"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Listening Distribution */}
                      <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                        <h4 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {t.listeningDistribution}
                        </h4>
                        <div className="space-y-3">
                          <TimeDistributionBar label={t.morning} value={analytics.timeDistribution.morning} max={analytics.maxTimeDist} color="text-amber-400" icon={Calendar} />
                          <TimeDistributionBar label={t.afternoon} value={analytics.timeDistribution.afternoon} max={analytics.maxTimeDist} color="text-orange-400" icon={Calendar} />
                          <TimeDistributionBar label={t.evening} value={analytics.timeDistribution.evening} max={analytics.maxTimeDist} color="text-purple-400" icon={Calendar} />
                          <TimeDistributionBar label={t.night} value={analytics.timeDistribution.night} max={analytics.maxTimeDist} color="text-indigo-400" icon={Calendar} />
                        </div>
                      </div>

                      {/* Completion Analysis */}
                      <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                        <h4 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-400" />
                          {t.completionAnalysis}
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                              <span className="text-white/60 text-xs">{t.high}</span>
                            </div>
                            <span className="text-white text-xs font-bold">{analytics.highCompletion} {t.tracks}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                              <span className="text-white/60 text-xs">{t.medium}</span>
                            </div>
                            <span className="text-white text-xs font-bold">{analytics.medCompletion} {t.tracks}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                              <span className="text-white/60 text-xs">{t.low}</span>
                            </div>
                            <span className="text-white text-xs font-bold">{analytics.lowCompletion} {t.tracks}</span>
                          </div>
                          {/* Visual pie representation */}
                          <div className="flex gap-1 h-3 rounded-full overflow-hidden mt-2">
                            {analytics.highCompletion > 0 && (
                              <div className="bg-green-400 h-full rounded-full" style={{ flex: analytics.highCompletion }} />
                            )}
                            {analytics.medCompletion > 0 && (
                              <div className="bg-yellow-400 h-full rounded-full" style={{ flex: analytics.medCompletion }} />
                            )}
                            {analytics.lowCompletion > 0 && (
                              <div className="bg-red-400 h-full rounded-full" style={{ flex: analytics.lowCompletion }} />
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'content' && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                        <h4 className="text-white text-sm font-semibold mb-4 flex items-center gap-2">
                          <ChartPie className="w-4 h-4 text-cyan-400" />
                          {t.contentEffectTitle}
                        </h4>
                        <div className="space-y-4">
                          {[
                            { label: t.popularityScore, value: analytics.popularityScore, color: 'from-purple-500 to-pink-500', textColor: 'text-purple-400' },
                            { label: t.engagementScore, value: analytics.engagementScore, color: 'from-cyan-500 to-blue-500', textColor: 'text-cyan-400' },
                            { label: t.retentionScore, value: analytics.retentionScore, color: 'from-green-500 to-emerald-500', textColor: 'text-green-400' },
                          ].map(metric => (
                            <div key={metric.label}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-white/60 text-xs">{metric.label}</span>
                                <span className={`text-sm font-bold ${metric.textColor}`}>{metric.value}%</span>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${metric.value}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                  className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'trends' && (
                    <motion.div
                      key="trends"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Trend Insight */}
                      <div className={`rounded-xl p-4 border ${
                        analytics.trend === 'up' ? 'bg-green-500/10 border-green-500/20' :
                        analytics.trend === 'down' ? 'bg-red-500/10 border-red-500/20' :
                        'bg-blue-500/10 border-blue-500/20'
                      }`}>
                        <div className="flex items-center gap-3 mb-2">
                          <TrendingUp className={`w-5 h-5 ${
                            analytics.trend === 'up' ? 'text-green-400' :
                            analytics.trend === 'down' ? 'text-red-400 rotate-180' : 'text-blue-400'
                          }`} />
                          <h4 className="text-white text-sm font-semibold">{t.trendInsight}</h4>
                        </div>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {analytics.trend === 'up' ? t.trendUp : analytics.trend === 'down' ? t.trendDown : t.trendStable}
                        </p>
                      </div>

                      {/* Activity */}
                      <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                        <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-cyan-400" />
                          {t.activityTimeline}
                        </h4>
                        <div className="flex items-end gap-1 h-16">
                          {Array.from({ length: 7 }).map((_, i) => {
                            const dayStart = Date.now() - (6 - i) * 24 * 60 * 60 * 1000;
                            const dayEnd = dayStart + 24 * 60 * 60 * 1000;
                            const count = playEvents.filter(e => e.timestamp >= dayStart && e.timestamp < dayEnd).length;
                            const maxCount = Math.max(...Array.from({ length: 7 }).map((_, j) => {
                              const ds = Date.now() - (6 - j) * 24 * 60 * 60 * 1000;
                              const de = ds + 24 * 60 * 60 * 1000;
                              return playEvents.filter(e => e.timestamp >= ds && e.timestamp < de).length;
                            }), 1);
                            const height = (count / maxCount) * 100;
                            return (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(height, 8)}%` }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className={`flex-1 rounded-t-sm ${i === 6 ? 'bg-gradient-to-t from-cyan-500 to-blue-500' : 'bg-white/15'}`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className="text-white/30 text-[9px]">-6d</span>
                          <span className="text-cyan-400 text-[9px] font-medium">{t.today}</span>
                        </div>
                      </div>

                      {/* Rising Tracks */}
                      {analytics.risingTracks.length > 0 && (
                        <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-white text-sm font-semibold">{t.risingTracks}</span>
                          </div>
                          <div className="p-3 space-y-2">
                            {analytics.risingTracks.map((item, idx) => (
                              <div key={item.trackId} className="flex items-center gap-3 py-1">
                                <span className="text-green-400 text-xs font-bold">↑</span>
                                <span className="text-white/80 text-xs font-medium truncate flex-1">{item.track!.title}</span>
                                <span className="text-white/40 text-[10px] font-mono">{item.playCount} {t.plays}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/10 p-4">
                        <h4 className="text-white text-sm font-semibold mb-3">{t.recommendation}</h4>
                        <div className="space-y-2">
                          {[t.recExplore, t.recDeepen, t.recMore].map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-purple-400 text-xs mt-0.5">•</span>
                              <span className="text-white/60 text-xs leading-relaxed">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}