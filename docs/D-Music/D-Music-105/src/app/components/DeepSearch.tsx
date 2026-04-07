import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Search, Music, SlidersHorizontal, ArrowUpDown,
  Play, Clock, Album, Disc3, Mic, Sparkles,
  ChevronDown, Star, Hash, BarChart3,
  ListFilter, RotateCcw, CheckCircle2
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  url: string;
  albumId: string | null;
  isVideo?: boolean;
}

interface AlbumInfo {
  id: string;
  name: string;
  trackIds: number[];
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
  albums: AlbumInfo[];
  playRecords: PlayRecord[];
  onPlayTrack: (id: number) => void;
  onOpenVoice?: () => void;
}

type SortMode = 'relevance' | 'name' | 'plays' | 'recent' | 'completion' | 'wilson';

// ═══════════════════════════════════════════════════════
// WILSON SCORE CALCULATOR — fair relevance ranking
// ═══════════════════════════════════════════════════════
function wilsonScoreLower(positive: number, total: number, z = 1.96): number {
  if (total === 0) return 0;
  const p = positive / total;
  const n = total;
  const numerator = p + (z * z) / (2 * n) -
    z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n));
  const denominator = 1 + (z * z) / n;
  return Math.max(0, numerator / denominator);
}

// Fuzzy match scoring
function fuzzyMatch(query: string, target: string): number {
  if (!query || !target) return 0;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  // Exact match
  if (t === q) return 100;
  // Includes full query
  if (t.includes(q)) return 90 + Math.min(9, (q.length / t.length) * 10);
  // Starts with query
  if (t.startsWith(q)) return 95;

  // Character-level fuzzy
  let qi = 0;
  let consecutive = 0;
  let maxConsecutive = 0;
  let matchCount = 0;

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      matchCount++;
      consecutive++;
      maxConsecutive = Math.max(maxConsecutive, consecutive);
    } else {
      consecutive = 0;
    }
  }

  if (qi < q.length) {
    // Not all characters matched in order — try unordered
    const qChars = new Set(q.split(''));
    let unorderedMatch = 0;
    for (const c of t) {
      if (qChars.has(c)) {
        unorderedMatch++;
        qChars.delete(c);
      }
    }
    return Math.min(40, Math.floor((unorderedMatch / q.length) * 40));
  }

  const orderScore = (matchCount / q.length) * 50;
  const consecutiveBonus = (maxConsecutive / q.length) * 30;
  const lengthPenalty = Math.max(0, 1 - (t.length - q.length) / 20) * 10;

  return Math.min(89, Math.floor(orderScore + consecutiveBonus + lengthPenalty));
}

const T = {
  zh: {
    title: '「深度检索」',
    subtitle: '「智能多维搜索引擎」',
    placeholder: '「搜索歌名、关键词...」',
    allAlbums: '「全部」',
    noResults: '「未找到匹配结果」',
    tryDifferent: '「尝试不同关键词或清除过滤器」',
    sortBy: '「排序」',
    filterAlbum: '「筛选专辑」',
    relevance: '「相关度」',
    name: '「名称」',
    plays: '「播放次数」',
    recent: '「最近播放」',
    completion: '「完成度」',
    wilson: '「威尔逊评分」',
    results: '「搜索结果」',
    tracks: '「首」',
    matchScore: '「匹配度」',
    playCount: '「次播放」',
    wilsonScore: '「W评分」',
    lastPlayed: '「最近播放」',
    neverPlayed: '「未播放」',
    voiceSearch: '「语音搜索」',
    clearAll: '「清除」',
    hot: '「热门」',
    quickFilter: '「快速筛选」',
    audioOnly: '「仅音频」',
    videoOnly: '「仅视频」',
    hasPlayed: '「已播放」',
    highCompletion: '「高完成度」',
    total: '「共」',
    items: '「项」',
  },
  en: {
    title: 'Deep Search',
    subtitle: 'Smart Multi-dimensional Engine',
    placeholder: 'Search by title, keywords...',
    allAlbums: 'All',
    noResults: 'No matching results',
    tryDifferent: 'Try different keywords or clear filters',
    sortBy: 'Sort',
    filterAlbum: 'Album Filter',
    relevance: 'Relevance',
    name: 'Name',
    plays: 'Play Count',
    recent: 'Recent',
    completion: 'Completion',
    wilson: 'Wilson Score',
    results: 'Results',
    tracks: 'tracks',
    matchScore: 'Match',
    playCount: 'plays',
    wilsonScore: 'W-Score',
    lastPlayed: 'Last Played',
    neverPlayed: 'Never played',
    voiceSearch: 'Voice Search',
    clearAll: 'Clear',
    hot: 'Hot',
    quickFilter: 'Quick Filters',
    audioOnly: 'Audio Only',
    videoOnly: 'Video Only',
    hasPlayed: 'Played',
    highCompletion: 'High Completion',
    total: 'Total',
    items: 'items',
  }
};

export function DeepSearch({ isOpen, onClose, language, tracks, albums, playRecords, onPlayTrack, onOpenVoice }: Props) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('relevance');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [quickFilters, setQuickFilters] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const t = T[language];

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery('');
      setShowFilters(false);
      setShowSortMenu(false);
    }
  }, [isOpen]);

  // Build play record lookup
  const recordMap = useMemo(() => {
    const m = new Map<number, PlayRecord>();
    playRecords.forEach(r => m.set(r.trackId, r));
    return m;
  }, [playRecords]);

  // Total plays for Wilson normalization
  const maxPlays = useMemo(() => {
    return Math.max(1, ...playRecords.map(r => r.playCount));
  }, [playRecords]);

  // Compute results
  const results = useMemo(() => {
    let filtered = [...tracks];

    // Album filter
    if (selectedAlbumId) {
      const album = albums.find(a => a.id === selectedAlbumId);
      if (album) {
        const trackSet = new Set(album.trackIds);
        filtered = filtered.filter(t => trackSet.has(t.id));
      }
    }

    // Quick filters
    if (quickFilters.has('audio')) {
      filtered = filtered.filter(t => !t.isVideo);
    }
    if (quickFilters.has('video')) {
      filtered = filtered.filter(t => t.isVideo);
    }
    if (quickFilters.has('played')) {
      filtered = filtered.filter(t => {
        const r = recordMap.get(t.id);
        return r && r.playCount > 0;
      });
    }
    if (quickFilters.has('highCompletion')) {
      filtered = filtered.filter(t => {
        const r = recordMap.get(t.id);
        return r && r.completionRate >= 0.8;
      });
    }

    // Search scoring
    const scored = filtered.map(track => {
      const record = recordMap.get(track.id);
      const matchScore = query ? fuzzyMatch(query, track.title) : 50;

      // Wilson Score: treat plays as "positive", max-possible as "total"
      const plays = record?.playCount || 0;
      const totalSample = Math.max(plays, maxPlays);
      const wScore = wilsonScoreLower(plays, totalSample);

      return {
        ...track,
        matchScore,
        record,
        wilsonScore: wScore,
        plays: record?.playCount || 0,
        lastPlayed: record?.lastPlayed || 0,
        completionRate: record?.completionRate || 0,
        totalDuration: record?.totalDuration || 0,
      };
    });

    // Filter out non-matching when searching
    const matching = query
      ? scored.filter(s => s.matchScore > 15)
      : scored;

    // Sort
    switch (sortMode) {
      case 'relevance':
        matching.sort((a, b) => {
          const scoreA = a.matchScore * 0.5 + a.wilsonScore * 30 + Math.min(a.plays, 20);
          const scoreB = b.matchScore * 0.5 + b.wilsonScore * 30 + Math.min(b.plays, 20);
          return scoreB - scoreA;
        });
        break;
      case 'name':
        matching.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'plays':
        matching.sort((a, b) => b.plays - a.plays);
        break;
      case 'recent':
        matching.sort((a, b) => b.lastPlayed - a.lastPlayed);
        break;
      case 'completion':
        matching.sort((a, b) => b.completionRate - a.completionRate);
        break;
      case 'wilson':
        matching.sort((a, b) => b.wilsonScore - a.wilsonScore);
        break;
    }

    return matching;
  }, [tracks, albums, playRecords, query, sortMode, selectedAlbumId, quickFilters, recordMap, maxPlays]);

  const toggleQuickFilter = useCallback((f: string) => {
    setQuickFilters(prev => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      // audio and video are mutually exclusive
      if (f === 'audio' && next.has('video')) next.delete('video');
      if (f === 'video' && next.has('audio')) next.delete('audio');
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setQuery('');
    setSelectedAlbumId(null);
    setQuickFilters(new Set());
    setSortMode('relevance');
  }, []);

  const formatTimeAgo = (timestamp: number): string => {
    if (!timestamp) return t.neverPlayed;
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return language === 'zh' ? '「刚刚」' : 'Just now';
    if (mins < 60) return `${mins}${language === 'zh' ? '「分钟前」' : 'm ago'}`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}${language === 'zh' ? '「小时前」' : 'h ago'}`;
    const days = Math.floor(hours / 24);
    return `${days}${language === 'zh' ? '「天前」' : 'd ago'}`;
  };

  const sortOptions: { id: SortMode; label: string; icon: any }[] = [
    { id: 'relevance', label: t.relevance, icon: Sparkles },
    { id: 'wilson', label: t.wilson, icon: Star },
    { id: 'plays', label: t.plays, icon: BarChart3 },
    { id: 'recent', label: t.recent, icon: Clock },
    { id: 'name', label: t.name, icon: Hash },
    { id: 'completion', label: t.completion, icon: CheckCircle2 },
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
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-full md:w-[480px] bg-purple-950/30 backdrop-blur-2xl border-r border-white/10 z-50 flex flex-col shadow-2xl md:rounded-l-3xl overflow-hidden"
            role="search"
            aria-label={language === 'zh' ? '深度搜索' : 'Deep Search'}
          >
            {/* Animated grid overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{ x: [0, 20], y: [0, 20] }}
                transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
                className="absolute inset-[-20px] opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* Header */}
            <div className="p-4 border-b border-white/10 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <Search className="w-[18px] h-[18px] text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">{t.title}</h3>
                    <p className="text-white/30 text-[10px]">{t.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {onOpenVoice && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { onOpenVoice(); onClose(); }}
                      className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-violet-400 transition-colors"
                      title={t.voiceSearch}
                    >
                      <Mic className="w-4 h-4" />
                    </motion.button>
                  )}
                  <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t.placeholder}
                  className="w-full pl-10 pr-20 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {(query || selectedAlbumId || quickFilters.size > 0) && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearAll}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-white/30 hover:text-white/60'}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-2.5">
                      {/* Album Filter */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Album className="w-3 h-3 text-white/30" />
                          <span className="text-white/40 text-[10px] font-semibold">{t.filterAlbum}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <button
                            onClick={() => setSelectedAlbumId(null)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                              selectedAlbumId === null
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : 'bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08]'
                            }`}
                          >
                            {t.allAlbums}
                          </button>
                          {albums.map(album => (
                            <button
                              key={album.id}
                              onClick={() => setSelectedAlbumId(album.id === selectedAlbumId ? null : album.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border truncate max-w-[120px] ${
                                selectedAlbumId === album.id
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  : 'bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08]'
                              }`}
                            >
                              {album.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Filters */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ListFilter className="w-3 h-3 text-white/30" />
                          <span className="text-white/40 text-[10px] font-semibold">{t.quickFilter}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: 'audio', label: t.audioOnly, icon: Music },
                            { id: 'video', label: t.videoOnly, icon: Disc3 },
                            { id: 'played', label: t.hasPlayed, icon: Play },
                            { id: 'highCompletion', label: t.highCompletion, icon: CheckCircle2 },
                          ].map(f => (
                            <button
                              key={f.id}
                              onClick={() => toggleQuickFilter(f.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border flex items-center gap-1 ${
                                quickFilters.has(f.id)
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                  : 'bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08]'
                              }`}
                            >
                              <f.icon className="w-3 h-3" />
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort Mode */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <ArrowUpDown className="w-3 h-3 text-white/30" />
                          <span className="text-white/40 text-[10px] font-semibold">{t.sortBy}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {sortOptions.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setSortMode(opt.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border flex items-center gap-1 ${
                                sortMode === opt.id
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                  : 'bg-white/[0.04] text-white/40 border-white/[0.06] hover:bg-white/[0.08]'
                              }`}
                            >
                              <opt.icon className="w-3 h-3" />
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Results summary bar */}
            <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-[10px] font-semibold">
                  {t.total} {results.length} {t.items}
                </span>
                {query && (
                  <span className="text-purple-400/60 text-[10px] font-mono">
                    &quot;{query}&quot;
                  </span>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1 text-white/30 text-[10px] font-semibold hover:text-white/50 transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {sortOptions.find(o => o.id === sortMode)?.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showSortMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 bg-purple-950/90 backdrop-blur-xl border border-white/15 rounded-xl shadow-2xl z-20 min-w-[140px] overflow-hidden"
                    >
                      {sortOptions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => { setSortMode(opt.id); setShowSortMenu(false); }}
                          className={`w-full px-3 py-2 text-[10px] font-semibold flex items-center gap-2 transition-colors ${
                            sortMode === opt.id
                              ? 'bg-purple-500/20 text-purple-300'
                              : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
                          }`}
                        >
                          <opt.icon className="w-3 h-3" />
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto relative z-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb]:rounded-full">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <Search className="w-12 h-12 text-white/10 mb-4" />
                  </motion.div>
                  <p className="text-white/30 text-sm font-semibold">{t.noResults}</p>
                  <p className="text-white/15 text-[10px] mt-1">{t.tryDifferent}</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={clearAll}
                    className="mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300/60 text-[10px] font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t.clearAll}
                  </motion.button>
                </div>
              ) : (
                <div className="p-2 space-y-[2px]">
                  {results.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.02, 0.5) }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { onPlayTrack(item.id); onClose(); }}
                      className="w-full p-2.5 rounded-xl hover:bg-white/[0.05] transition-all text-left group relative overflow-hidden border border-transparent hover:border-white/[0.06]"
                    >
                      {/* Shimmer on hover */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '200%' }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none"
                      />

                      <div className="flex items-center gap-3 relative z-10">
                        {/* Rank / Icon */}
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          index < 3 && !query
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20'
                            : 'bg-white/[0.04] border border-white/[0.06]'
                        }`}>
                          {!query && index < 3 ? (
                            <span className={`text-xs font-black ${
                              index === 0 ? 'text-amber-400' : index === 1 ? 'text-gray-300' : 'text-amber-600'
                            }`}>
                              {index + 1}
                            </span>
                          ) : item.isVideo ? (
                            <Disc3 className="w-4 h-4 text-indigo-400/70" />
                          ) : (
                            <Music className="w-4 h-4 text-white/40 group-hover:text-purple-400 transition-colors" />
                          )}
                        </div>

                        {/* Title & meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white/80 text-xs font-medium truncate group-hover:text-white transition-colors">
                              {item.title}
                            </span>
                            {item.isVideo && (
                              <span className="flex-shrink-0 px-1 py-0.5 bg-indigo-500/20 text-indigo-300 text-[7px] font-bold rounded border border-indigo-500/25">MV</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            {item.plays > 0 && (
                              <span className="text-white/25 text-[9px] flex items-center gap-0.5">
                                <Play className="w-2.5 h-2.5" />
                                {item.plays} {t.playCount}
                              </span>
                            )}
                            {item.lastPlayed > 0 && (
                              <span className="text-white/20 text-[9px] flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {formatTimeAgo(item.lastPlayed)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Score badges */}
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          {query && item.matchScore > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="h-1 w-10 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                  style={{ width: `${item.matchScore}%` }}
                                />
                              </div>
                              <span className="text-green-400 text-[8px] font-bold w-7 text-right">{item.matchScore}%</span>
                            </div>
                          )}
                          {(sortMode === 'wilson' || !query) && item.wilsonScore > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 text-amber-400/60" />
                              <span className="text-amber-400/60 text-[8px] font-bold">
                                {(item.wilsonScore * 100).toFixed(1)}
                              </span>
                            </div>
                          )}
                          {item.completionRate > 0 && sortMode === 'completion' && (
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400/60" />
                              <span className="text-cyan-400/60 text-[8px] font-bold">
                                {Math.round(item.completionRate * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/20 text-[9px] font-mono">
                  {language === 'zh' ? '「Wilson Score 95% CI」' : 'Wilson Score 95% CI'}
                </span>
              </div>
              <span className="text-white/15 text-[9px] font-mono">
                D-Music · {language === 'zh' ? '「深度检索引擎」' : 'Deep Search Engine'}
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}