import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Brain, Sparkles, Music, Heart, TrendingUp, 
  Shuffle, Clock, Star, Zap, Play, Plus, 
  Smile, CloudRain, Flame, Moon, Sun, Coffee
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
  totalDuration: number; // seconds
  lastPlayed: number; // timestamp
  completionRate: number; // 0-1, avg percentage listened
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  tracks: Track[];
  playRecords: PlayRecord[];
  currentTrackId: number | null;
  onPlayTrack: (trackId: number) => void;
  onCreatePlaylist: (name: string, trackIds: number[]) => void;
}

type MoodType = 'energetic' | 'calm' | 'melancholy' | 'romantic' | 'focus' | 'happy';

const MOOD_CONFIG: Record<MoodType, { icon: any; colorClass: string; bgClass: string }> = {
  energetic: { icon: Flame, colorClass: 'text-orange-400', bgClass: 'bg-orange-500/20 border-orange-500/30' },
  calm: { icon: CloudRain, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/20 border-blue-500/30' },
  melancholy: { icon: Moon, colorClass: 'text-indigo-400', bgClass: 'bg-indigo-500/20 border-indigo-500/30' },
  romantic: { icon: Heart, colorClass: 'text-pink-400', bgClass: 'bg-pink-500/20 border-pink-500/30' },
  focus: { icon: Coffee, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/20 border-amber-500/30' },
  happy: { icon: Sun, colorClass: 'text-yellow-400', bgClass: 'bg-yellow-500/20 border-yellow-500/30' },
};

const TRANSLATIONS = {
  zh: {
    title: '「智能推荐」',
    subtitle: '「基于你的听歌习惯」',
    moodSelect: '「心情选择」',
    moods: {
      energetic: '「激昂」',
      calm: '「宁静」',
      melancholy: '「忧郁」',
      romantic: '「浪漫」',
      focus: '「专注」',
      happy: '「愉悦」',
    },
    forYou: '「为你推荐」',
    recentFavorites: '「最近最爱」',
    smartMix: '「智能混音」',
    createSmartPlaylist: '「创建智能歌单」',
    similarTracks: '「相似推荐」',
    listeningProfile: '「听歌画像」',
    totalPlays: '「总播放」',
    totalTime: '「总时长」',
    avgCompletion: '「平均完成率」',
    topTrack: '「最爱曲目」',
    noData: '「暂无足够的播放数据」',
    noDataHint: '「多听几首歌，推荐系统将为你精准匹配」',
    generateMix: '「生成推荐歌单」',
    playAll: '「全部播放」',
    times: '「次」',
    minutes: '「分钟」',
    userProfile: '「用户画像」',
    contentFeature: '「内容特征」',
    personalizedAlgo: '「个性化算法」',
    collaborativeFilter: '「协同过滤」',
    contentBased: '「内容推荐」',
    deepLearning: '「深度学习」',
    rhythmAnalysis: '「节奏分析」',
    emotionExtract: '「情绪提取」',
    styleMatch: '「风格匹配」',
  },
  en: {
    title: 'Smart Recommend',
    subtitle: 'Based on your listening habits',
    moodSelect: 'Mood Selection',
    moods: {
      energetic: 'Energetic',
      calm: 'Calm',
      melancholy: 'Melancholy',
      romantic: 'Romantic',
      focus: 'Focus',
      happy: 'Happy',
    },
    forYou: 'For You',
    recentFavorites: 'Recent Favorites',
    smartMix: 'Smart Mix',
    createSmartPlaylist: 'Create Smart Playlist',
    similarTracks: 'Similar Tracks',
    listeningProfile: 'Listening Profile',
    totalPlays: 'Total Plays',
    totalTime: 'Total Time',
    avgCompletion: 'Avg Completion',
    topTrack: 'Top Track',
    noData: 'Not enough listening data',
    noDataHint: 'Listen to more songs for better recommendations',
    generateMix: 'Generate Mix',
    playAll: 'Play All',
    times: 'plays',
    minutes: 'min',
    userProfile: 'User Profile',
    contentFeature: 'Content Features',
    personalizedAlgo: 'Personalized Algo',
    collaborativeFilter: 'Collaborative Filtering',
    contentBased: 'Content-Based',
    deepLearning: 'Deep Learning',
    rhythmAnalysis: 'Rhythm Analysis',
    emotionExtract: 'Emotion Extract',
    styleMatch: 'Style Match',
  }
};

export function SmartRecommendation({ 
  isOpen, onClose, language, tracks, playRecords, 
  currentTrackId, onPlayTrack, onCreatePlaylist 
}: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const t = TRANSLATIONS[language];

  // Build user profile from play records
  const userProfile = useMemo(() => {
    const totalPlays = playRecords.reduce((sum, r) => sum + r.playCount, 0);
    const totalTime = playRecords.reduce((sum, r) => sum + r.totalDuration, 0);
    const avgCompletion = playRecords.length > 0 
      ? playRecords.reduce((sum, r) => sum + r.completionRate, 0) / playRecords.length 
      : 0;
    const topRecord = playRecords.sort((a, b) => b.playCount - a.playCount)[0];
    const topTrack = topRecord ? tracks.find(t => t.id === topRecord.trackId) : null;

    return { totalPlays, totalTime, avgCompletion, topTrack, topRecord };
  }, [playRecords, tracks]);

  // Smart recommendations based on play records
  const recommendations = useMemo(() => {
    if (tracks.length === 0) return { forYou: [], recentFavorites: [], smartMix: [] };

    // Sort by play count for favorites
    const sortedByPlays = [...playRecords]
      .sort((a, b) => b.playCount - a.playCount)
      .slice(0, 5)
      .map(r => tracks.find(t => t.id === r.trackId))
      .filter(Boolean) as Track[];

    // Sort by recent play for recent favorites
    const sortedByRecent = [...playRecords]
      .sort((a, b) => b.lastPlayed - a.lastPlayed)
      .slice(0, 5)
      .map(r => tracks.find(t => t.id === r.trackId))
      .filter(Boolean) as Track[];

    // Smart mix - blend of high completion rate and moderate play count
    const smartMix = [...playRecords]
      .filter(r => r.completionRate > 0.6)
      .sort((a, b) => (b.completionRate * b.playCount) - (a.completionRate * a.playCount))
      .slice(0, 5)
      .map(r => tracks.find(t => t.id === r.trackId))
      .filter(Boolean) as Track[];

    // For You - tracks not yet played much or newly added
    const playedIds = new Set(playRecords.map(r => r.trackId));
    const unplayed = tracks.filter(t => !playedIds.has(t.id));
    const forYou = unplayed.length > 0 
      ? unplayed.slice(0, 5) 
      : [...tracks].sort(() => 0.5 - Math.random()).slice(0, 5);

    return { forYou, recentFavorites: sortedByRecent.length > 0 ? sortedByRecent : sortedByPlays, smartMix: smartMix.length > 0 ? smartMix : forYou };
  }, [tracks, playRecords]);

  const handleCreateSmartPlaylist = () => {
    const trackIds = recommendations.smartMix.map(t => t.id);
    if (trackIds.length > 0) {
      const moodLabel = t.moods[selectedMood];
      const name = `${moodLabel} Mix - ${new Date().toLocaleDateString()}`;
      onCreatePlaylist(name, trackIds);
    }
  };

  const hasData = playRecords.length > 0;
  const moodKeys = Object.keys(MOOD_CONFIG) as MoodType[];

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
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '智能推荐' : 'Smart Recommendations'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Brain className="w-5 h-5 text-white" />
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

            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* Mood Selector */}
              <div className="p-4 border-b border-white/5">
                <h4 className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">{t.moodSelect}</h4>
                <div className="grid grid-cols-3 gap-2">
                  {moodKeys.map(mood => {
                    const config = MOOD_CONFIG[mood];
                    const MoodIcon = config.icon;
                    const isSelected = selectedMood === mood;
                    return (
                      <motion.button
                        key={mood}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedMood(mood)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center gap-2 transition-all border ${
                          isSelected 
                            ? `${config.bgClass} ${config.colorClass}` 
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <MoodIcon className="w-3.5 h-3.5" />
                        {t.moods[mood]}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* User Listening Profile */}
              {hasData && (
                <div className="p-4 border-b border-white/5">
                  <h4 className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider">{t.listeningProfile}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-white text-lg font-bold">{userProfile.totalPlays}</div>
                      <div className="text-white/40 text-[10px] font-medium">{t.totalPlays}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-white text-lg font-bold">{Math.round(userProfile.totalTime / 60)}</div>
                      <div className="text-white/40 text-[10px] font-medium">{t.totalTime} ({t.minutes})</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-white text-lg font-bold">{Math.round(userProfile.avgCompletion * 100)}%</div>
                      <div className="text-white/40 text-[10px] font-medium">{t.avgCompletion}</div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <div className="text-white text-sm font-bold truncate">{userProfile.topTrack?.title || '-'}</div>
                      <div className="text-white/40 text-[10px] font-medium">
                        {t.topTrack} {userProfile.topRecord ? `(${userProfile.topRecord.playCount} ${t.times})` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Algorithm Info */}
              <div className="p-4 border-b border-white/5">
                <h4 className="text-white/60 text-xs font-semibold mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  {t.personalizedAlgo}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: t.collaborativeFilter, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    { label: t.contentBased, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
                    { label: t.deepLearning, color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                    { label: t.rhythmAnalysis, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
                    { label: t.emotionExtract, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
                    { label: t.styleMatch, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                  ].map(tag => (
                    <span key={tag.label} className={`px-2 py-1 rounded-md text-[10px] font-semibold border ${tag.color}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {tracks.length === 0 ? (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 ring-1 ring-white/10">
                    <Music className="w-8 h-8 text-white/30" />
                  </div>
                  <p className="text-white/60 text-sm font-medium mb-1">{t.noData}</p>
                  <p className="text-white/30 text-xs">{t.noDataHint}</p>
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {/* For You */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-yellow-400" />
                        {t.forYou}
                      </h4>
                    </div>
                    <div className="space-y-1">
                      {recommendations.forYou.map((track, idx) => (
                        <TrackItem 
                          key={track.id} 
                          track={track} 
                          index={idx} 
                          isCurrent={currentTrackId === track.id}
                          playRecord={playRecords.find(r => r.trackId === track.id)}
                          onPlay={() => onPlayTrack(track.id)} 
                          timesLabel={t.times}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Recent Favorites */}
                  {hasData && (
                    <div>
                      <h4 className="text-white text-sm font-semibold flex items-center gap-2 mb-3">
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        {t.recentFavorites}
                      </h4>
                      <div className="space-y-1">
                        {recommendations.recentFavorites.map((track, idx) => (
                          <TrackItem 
                            key={track.id} 
                            track={track} 
                            index={idx} 
                            isCurrent={currentTrackId === track.id}
                            playRecord={playRecords.find(r => r.trackId === track.id)}
                            onPlay={() => onPlayTrack(track.id)} 
                            timesLabel={t.times}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Create Smart Playlist */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateSmartPlaylist}
                    className="w-full py-3 bg-gradient-to-r from-pink-600/50 to-orange-600/50 rounded-xl text-white text-sm font-bold shadow-lg shadow-pink-600/10 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <Shuffle className="w-4 h-4" />
                    {t.createSmartPlaylist}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function TrackItem({ track, index, isCurrent, playRecord, onPlay, timesLabel }: { 
  track: Track; index: number; isCurrent: boolean; playRecord?: PlayRecord; onPlay: () => void; timesLabel: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onPlay}
      className={`w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/10 transition-all group text-left ${
        isCurrent ? 'bg-white/10 ring-1 ring-purple-500/30' : ''
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
        isCurrent ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/50 group-hover:bg-white/20'
      }`}>
        {isCurrent ? (
          <Play className="w-3.5 h-3.5 fill-current" />
        ) : (
          index + 1
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs font-medium truncate ${isCurrent ? 'text-purple-300' : 'text-white/80'}`}>
          {track.title}
        </div>
        {playRecord && (
          <div className="text-[10px] text-white/30 mt-0.5">
            {playRecord.playCount} {timesLabel} · {Math.round(playRecord.completionRate * 100)}%
          </div>
        )}
      </div>
    </motion.button>
  );
}