import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Wand2, Music2, Mic2, FileMusic, 
  ChevronLeft, Plus, CheckCircle2, LayoutGrid,
  Zap, Volume2, ChevronRight, Play, Clock, MonitorPlay,
  Upload, Palette, SlidersHorizontal, Image,
  RefreshCw, Save, Eye, BookOpen
} from 'lucide-react';
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";
import dmLogoGold from "figma:asset/f48b90018686a90dc84317ba5c2d07bb6da83e88.png";
import dmLogoRed from "figma:asset/cdb6898d69cc4e5ec95856624e6740a30b4ed169.png";
import dmInstruments from "figma:asset/10ceee193d619cac941326ab121b0a7478b60f38.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
}

type CreatorMode = 'hub' | 'minimalist' | 'master' | 'cover' | 'remix' | 'mv' | 'album_mv' | 'quick_mv' | 'medley';

// ═══════════════════════════════════════════════════════
// BILINGUAL TRANSLATIONS — Full closed-loop workflow
// ═══════════════════════════════════════════════════════
const TRANSLATIONS = {
  zh: {
    hub: '「AI 创作」',
    minimalist: '「极简写歌」',
    minimalistDesc: '一句话生成一首歌',
    master: '「大师写歌」',
    masterDesc: '风格旋律任你选择',
    remix: '「热歌改编」',
    remixDesc: '热门歌曲任意改词',
    cover: '「AI 翻唱」',
    coverDesc: '一键换声',
    medley: '「歌曲串烧」',
    medleyDesc: '多段音频一键成歌',
    mv: '「AI MV」',
    mvDesc: '为你的歌曲制作 MV',
    quick_mv: '「速配 MV」',
    quick_mvDesc: '热门精选 MV 模板',
    album_mv: '「相册 MV」',
    album_mvDesc: '上传照片制作 MV',

    inspirationLabel: '「灵感描述」',
    instrumentalOnly: '「纯音乐」',
    placeholder: '在此输入您的灵感，Muse-4.8 将为您深度思考。',
    hotThemes: '「热门灵感主题」',
    themes: ['「Pop 风格：关于分手的歌曲」', '「#浪漫蓝调恋曲」', '「热血沸腾」', '「#恋爱进行曲」', '「City Pop 风格」'],
    generate: '「立即生成」',
    generatePrice: '「立即生成 ✦ 10」',
    back: '「返回」',

    // Master mode
    songName: '「歌曲名称」',
    songNamePlaceholder: '「为你的作品取一个名字」',
    lyricsIdea: '「歌词/创作构想」',
    lyricsIdeaPlaceholder: '「描述你的创作构想，包括主题、情感、故事线...」',
    styleCombo: '「音乐风格组合」',
    primaryStyle: '「主风格」',
    secondStyle: '「副风格」',
    styleDimension: '「风格维度」',
    creationMode: '「创作模式」',
    vocalTone: '「声音音色」',
    vocalBase: '「基础选项」',
    vocalDetail: '「详细描述」',
    vocalDetailPlaceholder: '「描述你想要的声音特质，如：清冷女声、沙哑男声...」',
    audioRef: '「音频参考」',
    audioRefUpload: '「上传参考音频」',
    audioRefNote: '「参考说明」',
    audioRefNotePlaceholder: '「说明参考音频的用途，如：保留旋律走向作为副歌基底」',
    autoSave: '「生成后自动保存至草稿箱」',
    preciseSpc: '「精准指定」',
    freeExplore: '「自由探索」',
    moodGenre: '「情绪+流派」',
    eraScene: '「年代+场景」',
    
    // MV mode
    mvType: '「MV 类型」',
    targetWork: '「目标作品」',
    targetWorkPlaceholder: '「选择或输入歌曲名称」',
    mvRequirements: '「创作要求」',
    mvReqPlaceholder: '「描述 MV 风格、视觉元素、色调、氛围...」',
    mvAutoSave: '「生成后自动保存至公开作品（MV 分类）」',
    aiMV: '「AI MV」',
    templateMV: '「模板 MV」',
    albumMV: '「相册 MV」',

    // Medley mode
    medleyTitle: '「歌曲串烧」',
    medleyUploadPrompt: '「上传多段音频文件」',
    medleyUploadDesc: '「支持拖拽排序，一键合成串烧」',
    medleyAutoMix: '「智能混合」',
    medleyManualMix: '「手动编排」',

    // Closed-loop
    closedLoopHint: '「创作完成后，前往「我的」管理作品、申请原创认证、发行分销」',
    footerLabel: 'MUSE NEURAL LINK ACTIVE · AI 创作内容',

    // Styles
    styles: {
      wanderingFolk: '「流浪民谣」',
      jiangnanElegance: '「江南雅韵」',
      cityPop: '「City Pop」',
      electronicDance: '「电子舞曲」',
      chineseWind: '「国风」',
      rockAnthems: '「摇滚颂歌」',
      rnbSoul: '「R&B 灵魂」',
      jazzFusion: '「爵士融合」',
    },
    vocals: {
      female: '「女声」',
      male: '「男声」',
      duet: '「对唱」',
      choir: '「合唱」',
    },
    // Upload songs
    uploadSong: '「上传改词歌曲」',
    uploadSongSub: '「好歌改不停，创作无限可能」',
    recommended: '「推荐」',
    ancientStyle: '「古风」',
    popStyle: '「流行」',
    otherStyle: '「其他」',
    use: '「使用」',
    duration: '「时长」',
    // Cover
    selectCoverSong: '「选择翻唱歌曲」',
    voiceCards: '「音色卡片」',
    more: '「更多」',
    optimize: '「优化」',
    deepMature: '「沉稳醇厚」',
    funnyEffects: '「搞怪音效」',
    clearBright: '「清亮灵动」',
    cheerful: '「爽朗阳光」',
    // Banner
    bannerTitle1: '「听，AI 音乐」',
    bannerTitle2: '「精选串烧」',
    bannerSub: '「聆听 AI 创作的精彩串烧，感受音乐的无限可能」',
    startCreate: '「开始创作」',
  },
  en: {
    hub: 'AI Creation',
    minimalist: 'Quick Song',
    minimalistDesc: 'Generate a song from one line',
    master: 'Master Song',
    masterDesc: 'Deep customization of style & melody',
    remix: 'Hot Remix',
    remixDesc: 'Remix trending songs freely',
    cover: 'AI Cover',
    coverDesc: 'One-click voice swap',
    medley: 'Medley',
    medleyDesc: 'Merge multiple tracks into one',
    mv: 'AI MV',
    mvDesc: 'Create a music video for your song',
    quick_mv: 'Quick MV',
    quick_mvDesc: 'Popular MV templates',
    album_mv: 'Album MV',
    album_mvDesc: 'Upload photos to create MV',

    inspirationLabel: 'Inspiration',
    instrumentalOnly: 'Instrumental',
    placeholder: 'Enter your inspiration here, Muse-4.8 will think deeply for you.',
    hotThemes: 'Trending Themes',
    themes: ['Pop: breakup song', '#Romantic Blues', 'Energetic anthem', '#Love ballad', 'City Pop style'],
    generate: 'Generate Now',
    generatePrice: 'Generate Now ✦ 10',
    back: 'Back',

    // Master mode
    songName: 'Song Name',
    songNamePlaceholder: 'Give your creation a name',
    lyricsIdea: 'Lyrics / Creative Concept',
    lyricsIdeaPlaceholder: 'Describe your creative vision: theme, emotion, storyline...',
    styleCombo: 'Music Style Combination',
    primaryStyle: 'Primary Style',
    secondStyle: 'Secondary Style',
    styleDimension: 'Style Dimension',
    creationMode: 'Creation Mode',
    vocalTone: 'Vocal Tone',
    vocalBase: 'Base Option',
    vocalDetail: 'Detail Description',
    vocalDetailPlaceholder: 'Describe the voice quality: cool female, husky male...',
    audioRef: 'Audio Reference',
    audioRefUpload: 'Upload Reference Audio',
    audioRefNote: 'Reference Note',
    audioRefNotePlaceholder: 'Describe how to use the reference, e.g. retain melody as verse foundation',
    autoSave: 'Auto-save to draft box after generation',
    preciseSpc: 'Precise Spec',
    freeExplore: 'Free Explore',
    moodGenre: 'Mood + Genre',
    eraScene: 'Era + Scene',

    // MV mode
    mvType: 'MV Type',
    targetWork: 'Target Work',
    targetWorkPlaceholder: 'Select or enter song name',
    mvRequirements: 'Creative Requirements',
    mvReqPlaceholder: 'Describe MV style, visual elements, color palette, atmosphere...',
    mvAutoSave: 'Auto-save to public works (MV category) after generation',
    aiMV: 'AI MV',
    templateMV: 'Template MV',
    albumMV: 'Album MV',

    // Medley mode
    medleyTitle: 'Song Medley',
    medleyUploadPrompt: 'Upload multiple audio files',
    medleyUploadDesc: 'Drag to reorder, one-click merge',
    medleyAutoMix: 'Auto Mix',
    medleyManualMix: 'Manual Arrange',

    // Closed-loop
    closedLoopHint: 'After creation, go to "My" to manage works, apply for certification, and distribute',
    footerLabel: 'MUSE NEURAL LINK ACTIVE · AI GENERATED CONTENT',

    // Styles
    styles: {
      wanderingFolk: 'Wandering Folk',
      jiangnanElegance: 'Jiangnan Elegance',
      cityPop: 'City Pop',
      electronicDance: 'Electronic Dance',
      chineseWind: 'Chinese Wind',
      rockAnthems: 'Rock Anthems',
      rnbSoul: 'R&B Soul',
      jazzFusion: 'Jazz Fusion',
    },
    vocals: {
      female: 'Female',
      male: 'Male',
      duet: 'Duet',
      choir: 'Choir',
    },
    // Upload songs
    uploadSong: 'Upload Song to Remix',
    uploadSongSub: 'Endless remixing possibilities',
    recommended: 'Recommended',
    ancientStyle: 'Ancient',
    popStyle: 'Pop',
    otherStyle: 'Other',
    use: 'Use',
    duration: 'Duration',
    // Cover
    selectCoverSong: 'Select Cover Song',
    voiceCards: 'Voice Cards',
    more: 'More',
    optimize: 'Optimize',
    deepMature: 'Deep Mature',
    funnyEffects: 'Fun Effects',
    clearBright: 'Clear Bright',
    cheerful: 'Cheerful',
    // Banner
    bannerTitle1: 'Listen, AI Music',
    bannerTitle2: 'Curated Medley',
    bannerSub: 'Experience the infinite possibilities of AI-crafted music medleys',
    startCreate: 'Start Creating',
  }
};

// ═══════════════════════════════════════════════════════
// Style chips data
// ═══════════════════════════════════════════════════════
const STYLE_KEYS = ['wanderingFolk', 'jiangnanElegance', 'cityPop', 'electronicDance', 'chineseWind', 'rockAnthems', 'rnbSoul', 'jazzFusion'] as const;
const VOCAL_KEYS = ['female', 'male', 'duet', 'choir'] as const;

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function AICreator({ isOpen, onClose, language }: Props) {
  const [mode, setMode] = useState<CreatorMode>('hub');
  const [inspiration, setInspiration] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationDone, setGenerationDone] = useState(false);

  // Master mode form state
  const [masterSongName, setMasterSongName] = useState('');
  const [masterLyrics, setMasterLyrics] = useState('');
  const [masterPrimaryStyle, setMasterPrimaryStyle] = useState('wanderingFolk');
  const [masterSecondStyle, setMasterSecondStyle] = useState('jiangnanElegance');
  const [masterDimension, setMasterDimension] = useState('moodGenre');
  const [masterCreationMode, setMasterCreationMode] = useState('preciseSpc');
  const [masterVocalBase, setMasterVocalBase] = useState('female');
  const [masterVocalDetail, setMasterVocalDetail] = useState('');
  const [masterRefNote, setMasterRefNote] = useState('');
  const [masterAutoSave, setMasterAutoSave] = useState(true);

  // MV mode form state
  const [mvSubType, setMvSubType] = useState<'ai' | 'template' | 'album'>('ai');
  const [mvTargetWork, setMvTargetWork] = useState('');
  const [mvRequirements, setMvRequirements] = useState('');
  const [mvAutoSave, setMvAutoSave] = useState(true);

  // Medley mode state
  const [medleyMixMode, setMedleyMixMode] = useState<'auto' | 'manual'>('auto');

  const t = TRANSLATIONS[language];

  // Reset generation state on mode change
  useEffect(() => {
    setGenerationDone(false);
    setProgress(0);
    setIsGenerating(false);
  }, [mode]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    setGenerationDone(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setGenerationDone(true);
          }, 500);
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  const HubCard = ({ id, title, desc, icon, color }: { id: CreatorMode, title: string, desc: string, icon: any, color: string }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setMode(id)}
      className={`relative group aspect-square md:aspect-auto md:h-40 rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/10 flex flex-col items-center justify-center text-center p-4 transition-all shadow-xl`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-40 transition-opacity`} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-3 text-white transition-transform group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-white font-black text-xs md:text-sm tracking-tight uppercase">{title}</h3>
        <p className="hidden md:block text-white/40 text-[9px] mt-1 font-bold">{desc}</p>
      </div>
    </motion.button>
  );

  // Reusable style chip
  const StyleChip = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all border ${
        active 
          ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
          : 'bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/60'
      }`}
    >
      {label}
    </button>
  );

  // Section label
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">{children}</div>
  );

  // Generate button (shared)
  const GenerateButton = ({ disabled, label }: { disabled?: boolean; label?: string }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGenerate}
      disabled={isGenerating || disabled}
      className="w-full h-16 bg-white text-black font-black text-xl rounded-2xl flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.2)] disabled:opacity-50 transition-all"
    >
      {isGenerating ? (
        <div className="flex items-center gap-4">
          <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
          <span>{progress}%</span>
        </div>
      ) : generationDone ? (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <span>{language === 'zh' ? '「生成完成 · 已保存至草稿箱」' : 'Done · Saved to Drafts'}</span>
        </div>
      ) : (
        label || t.generate
      )}
    </motion.button>
  );

  // Closed-loop hint (shown after generation)
  const ClosedLoopHint = () => (
    <AnimatePresence>
      {generationDone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 px-5 py-3.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl"
        >
          <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="text-purple-300/80 text-xs font-bold leading-relaxed">{t.closedLoopHint}</span>
          <ChevronRight className="w-4 h-4 text-purple-400/40 flex-shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[900]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="fixed inset-0 sm:inset-4 md:inset-20 bg-[#0a0a0f]/95 backdrop-blur-3xl sm:rounded-[40px] md:rounded-[56px] border-0 sm:border border-white/10 z-[1000] flex flex-col overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)]"
            role="dialog"
            aria-modal="true"
            aria-label={language === 'zh' ? 'AI 创作工坊' : 'AI Creator Studio'}
          >
            {/* Header */}
            <div className="px-6 py-5 md:px-12 md:py-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4 md:gap-6">
                {mode !== 'hub' && (
                  <button onClick={() => setMode('hub')} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all">
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                )}
                <div>
                  <h2 className="text-white font-black text-xl md:text-4xl tracking-tighter flex items-center gap-4 uppercase">
                    {mode === 'hub' ? t.hub : t[mode as keyof typeof t] as string}
                  </h2>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:rotate-90 rounded-2xl text-white/40 hover:text-white transition-all">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-12 pb-12 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">

              {/* ═══════════════ HUB ═══════════════ */}
              {mode === 'hub' && (
                <div className="space-y-12 mt-8">
                  {/* Banner */}
                  <div className="relative w-full h-52 md:h-80 rounded-[32px] md:rounded-[40px] overflow-hidden group cursor-pointer shadow-2xl" onClick={() => setMode('master')}>
                     <div className="absolute inset-0 bg-gradient-to-r from-[#7a1b0c] via-[#b91c1c] to-[#991b1b]" />
                     <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
                     <div className="absolute top-6 left-6 md:top-10 md:left-16 z-10 space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-white/40 font-mono text-[10px] md:text-xs tracking-[0.4em]">MUSE NEURAL LINK</span>
                            <div className="h-0.5 w-8 md:w-12 bg-white/20" />
                        </div>
                        <h1 className="text-white font-black text-2xl md:text-7xl tracking-tighter leading-[0.9]">{t.bannerTitle1}<br/>{t.bannerTitle2}</h1>
                        <p className="text-white/60 text-xs md:text-lg max-w-md font-bold italic tracking-wide">{t.bannerSub}</p>
                     </div>
                     <div className="absolute right-4 bottom-4 md:right-16 md:bottom-16 z-20">
                        <button className="px-6 py-2.5 md:px-12 md:py-4 bg-white text-black font-black text-sm md:text-xl rounded-2xl shadow-2xl transform transition-transform group-hover:scale-105 active:scale-95">{t.startCreate}</button>
                     </div>
                     {/* Decorative CD */}
                     <div className="absolute right-[-5%] top-[-10%] w-[50%] aspect-square opacity-40 pointer-events-none hidden md:block">
                         <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                            className="w-full h-full rounded-full border-[20px] border-white/5 flex items-center justify-center"
                         >
                             <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-white/10 via-transparent to-transparent flex items-center justify-center">
                                 <div className="w-24 h-24 rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
                                     <img src={dmLogoChrome} alt="" className="w-full h-full object-cover opacity-60" />
                                 </div>
                             </div>
                         </motion.div>
                     </div>
                  </div>

                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
                    <HubCard id="minimalist" title={language === 'zh' ? '「写歌」' : 'Song'} desc={t.minimalistDesc} icon={<Wand2 size={28} />} color="from-blue-500 to-cyan-500" />
                    <HubCard id="master" title={language === 'zh' ? '「大师」' : 'Master'} desc={t.masterDesc} icon={<Sparkles size={28} />} color="from-purple-500 to-indigo-500" />
                    <HubCard id="cover" title={language === 'zh' ? '「翻唱」' : 'Cover'} desc={t.coverDesc} icon={<Mic2 size={28} />} color="from-orange-500 to-red-500" />
                    <HubCard id="remix" title={language === 'zh' ? '「改编」' : 'Remix'} desc={t.remixDesc} icon={<FileMusic size={28} />} color="from-pink-500 to-rose-500" />
                    <HubCard id="mv" title={language === 'zh' ? '「AI MV」' : 'AI MV'} desc={t.mvDesc} icon={<MonitorPlay size={28} />} color="from-indigo-500 to-violet-500" />
                    <HubCard id="medley" title={language === 'zh' ? '「串烧」' : 'Medley'} desc={t.medleyDesc} icon={<Zap size={28} />} color="from-red-500 to-orange-500" />
                    <HubCard id="album_mv" title={language === 'zh' ? '「相册」' : 'Album'} desc={t.album_mvDesc} icon={<LayoutGrid size={28} />} color="from-rose-500 to-fuchsia-500" />
                    <HubCard id="quick_mv" title={language === 'zh' ? '「模板」' : 'Template'} desc={t.quick_mvDesc} icon={<Play size={28} />} color="from-emerald-500 to-teal-500" />
                  </div>

                  {/* Closed-loop workflow guide */}
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-white/60 text-xs font-black uppercase tracking-[0.2em]">
                        {language === 'zh' ? '「AI 创作全闭环工作流」' : 'Full Closed-Loop Workflow'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {(language === 'zh' 
                        ? ['「数据洞察」', '「灵感锚定」', '「作品生成」', '「作品管理」', '「二次创作」', '「版权保护」', '「商业变现」', '「数据复盘」']
                        : ['Data Insight', 'Inspiration', 'Generation', 'Management', 'Re-creation', 'Copyright', 'Monetization', 'Review']
                      ).map((step, i, arr) => (
                        <div key={step} className="flex items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider ${
                            i === 2 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-white/40 border border-white/[0.06]'
                          }`}>{step}</span>
                          {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-white/15" />}
                        </div>
                      ))}
                      <div className="flex items-center gap-2 ml-1">
                        <RefreshCw className="w-3 h-3 text-purple-400/40" />
                        <span className="text-purple-400/30 text-[9px] font-mono">{language === 'zh' ? '循环迭代' : 'Loop'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══════════════ MINIMALIST ═══════════════ */}
              {mode === 'minimalist' && (
                <div className="max-w-4xl mx-auto space-y-10 py-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-black text-2xl tracking-tight">{t.inspirationLabel}</h4>
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                      <input type="checkbox" className="w-4 h-4 rounded-md accent-purple-500" id="inst_min" />
                      <label htmlFor="inst_min" className="text-white/60 text-xs font-black uppercase tracking-widest cursor-pointer">{t.instrumentalOnly}</label>
                    </div>
                  </div>

                  <div className="relative group">
                    <textarea
                      value={inspiration}
                      onChange={(e) => setInspiration(e.target.value)}
                      placeholder={t.placeholder}
                      className="w-full h-72 bg-white/[0.03] border border-white/10 rounded-[32px] p-8 text-white text-lg md:text-xl font-medium placeholder:text-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all resize-none"
                    />
                    <div className="absolute bottom-6 right-8 text-white/20 font-black text-xs tracking-widest uppercase">
                      {inspiration.length} / 500
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h5 className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] px-2">{t.hotThemes}</h5>
                    <div className="flex flex-wrap gap-3 px-2">
                      {t.themes.map(theme => (
                        <button
                          key={theme}
                          onClick={() => setInspiration(theme)}
                          className="px-5 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-white/70 text-sm font-bold transition-all whitespace-nowrap hover:text-white"
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <GenerateButton />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ MASTER SONGWRITING ═══════════════ */}
              {/* Guidelines §2.2: Deep customization with song name, lyrics, style combo, vocal tone, audio reference */}
              {mode === 'master' && (
                <div className="max-w-4xl mx-auto space-y-8 py-8">
                  {/* Song Name */}
                  <div className="space-y-3">
                    <SectionLabel>{t.songName}</SectionLabel>
                    <input
                      value={masterSongName}
                      onChange={(e) => setMasterSongName(e.target.value)}
                      placeholder={t.songNamePlaceholder}
                      className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-white text-lg font-semibold placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                    />
                  </div>

                  {/* Lyrics / Creative Idea */}
                  <div className="space-y-3">
                    <SectionLabel>{t.lyricsIdea}</SectionLabel>
                    <textarea
                      value={masterLyrics}
                      onChange={(e) => setMasterLyrics(e.target.value)}
                      placeholder={t.lyricsIdeaPlaceholder}
                      className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-[24px] p-6 text-white text-base font-medium placeholder:text-white/10 focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                    />
                  </div>

                  {/* Music Style Combination */}
                  <div className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-6">
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span className="text-white/70 text-sm font-black uppercase tracking-wider">{t.styleCombo}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Primary Style */}
                      <div className="space-y-3">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.primaryStyle}</span>
                        <div className="flex flex-wrap gap-2">
                          {STYLE_KEYS.map(key => (
                            <StyleChip 
                              key={key} 
                              label={t.styles[key]} 
                              active={masterPrimaryStyle === key} 
                              onClick={() => setMasterPrimaryStyle(key)} 
                            />
                          ))}
                        </div>
                      </div>

                      {/* Secondary Style */}
                      <div className="space-y-3">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.secondStyle}</span>
                        <div className="flex flex-wrap gap-2">
                          {STYLE_KEYS.map(key => (
                            <StyleChip 
                              key={key} 
                              label={t.styles[key]} 
                              active={masterSecondStyle === key} 
                              onClick={() => setMasterSecondStyle(key)} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Style Dimension & Creation Mode */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-3">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.styleDimension}</span>
                        <div className="flex gap-2">
                          <StyleChip label={t.moodGenre} active={masterDimension === 'moodGenre'} onClick={() => setMasterDimension('moodGenre')} />
                          <StyleChip label={t.eraScene} active={masterDimension === 'eraScene'} onClick={() => setMasterDimension('eraScene')} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.creationMode}</span>
                        <div className="flex gap-2">
                          <StyleChip label={t.preciseSpc} active={masterCreationMode === 'preciseSpc'} onClick={() => setMasterCreationMode('preciseSpc')} />
                          <StyleChip label={t.freeExplore} active={masterCreationMode === 'freeExplore'} onClick={() => setMasterCreationMode('freeExplore')} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vocal Tone */}
                  <div className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-6">
                    <div className="flex items-center gap-3">
                      <Mic2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-white/70 text-sm font-black uppercase tracking-wider">{t.vocalTone}</span>
                    </div>
                    <div className="space-y-3">
                      <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.vocalBase}</span>
                      <div className="flex gap-2">
                        {VOCAL_KEYS.map(key => (
                          <StyleChip 
                            key={key} 
                            label={t.vocals[key]} 
                            active={masterVocalBase === key} 
                            onClick={() => setMasterVocalBase(key)} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.vocalDetail}</span>
                      <input
                        value={masterVocalDetail}
                        onChange={(e) => setMasterVocalDetail(e.target.value)}
                        placeholder={t.vocalDetailPlaceholder}
                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Audio Reference */}
                  <div className="space-y-5 bg-white/[0.02] border border-white/[0.06] rounded-[28px] p-6">
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-white/70 text-sm font-black uppercase tracking-wider">{t.audioRef}</span>
                    </div>
                    <button 
                      onClick={() => window.dispatchEvent(new CustomEvent('dm-add-track-trigger'))}
                      className="w-full h-24 bg-white/[0.03] border border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/[0.06] hover:border-purple-500/30 transition-all group"
                    >
                      <Upload className="w-6 h-6 text-white/20 group-hover:text-purple-400 transition-colors" />
                      <span className="text-white/30 text-xs font-bold group-hover:text-white/50 transition-colors">{t.audioRefUpload}</span>
                    </button>
                    <div className="space-y-2">
                      <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{t.audioRefNote}</span>
                      <input
                        value={masterRefNote}
                        onChange={(e) => setMasterRefNote(e.target.value)}
                        placeholder={t.audioRefNotePlaceholder}
                        className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-white text-sm placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Auto-save toggle */}
                  <label className="flex items-center gap-3 cursor-pointer px-2">
                    <input 
                      type="checkbox" 
                      checked={masterAutoSave} 
                      onChange={(e) => setMasterAutoSave(e.target.checked)} 
                      className="w-4 h-4 rounded accent-purple-500" 
                    />
                    <span className="text-white/50 text-xs font-bold">{t.autoSave}</span>
                    <Save className="w-3.5 h-3.5 text-white/20" />
                  </label>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ AI MV ═══════════════ */}
              {/* Guidelines §2.3: MV creation with type selection, target work, creative requirements */}
              {mode === 'mv' && (
                <div className="max-w-4xl mx-auto space-y-8 py-8">
                  {/* MV Sub-type selector */}
                  <div className="space-y-3">
                    <SectionLabel>{t.mvType}</SectionLabel>
                    <div className="grid grid-cols-3 gap-3">
                      {([
                        { key: 'ai' as const, label: t.aiMV, icon: <Sparkles size={20} />, color: 'from-violet-500 to-purple-600' },
                        { key: 'template' as const, label: t.templateMV, icon: <Play size={20} />, color: 'from-emerald-500 to-teal-500' },
                        { key: 'album' as const, label: t.albumMV, icon: <Image size={20} />, color: 'from-rose-500 to-fuchsia-500' },
                      ]).map(item => (
                        <motion.button
                          key={item.key}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setMvSubType(item.key)}
                          className={`relative h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all overflow-hidden ${
                            mvSubType === item.key 
                              ? 'border-purple-500/40 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                              : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                          }`}
                        >
                          <div className={`${mvSubType === item.key ? 'text-white' : 'text-white/30'} transition-colors`}>{item.icon}</div>
                          <span className={`text-xs font-black tracking-wider ${mvSubType === item.key ? 'text-white' : 'text-white/40'} transition-colors`}>{item.label}</span>
                          {mvSubType === item.key && (
                            <motion.div layoutId="mv-type-glow" className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`} />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Target Work */}
                  <div className="space-y-3">
                    <SectionLabel>{t.targetWork}</SectionLabel>
                    <div className="relative">
                      <Music2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        value={mvTargetWork}
                        onChange={(e) => setMvTargetWork(e.target.value)}
                        placeholder={t.targetWorkPlaceholder}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 text-white text-lg font-semibold placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                      />
                    </div>
                  </div>

                  {/* Creative Requirements */}
                  <div className="space-y-3">
                    <SectionLabel>{t.mvRequirements}</SectionLabel>
                    <textarea
                      value={mvRequirements}
                      onChange={(e) => setMvRequirements(e.target.value)}
                      placeholder={t.mvReqPlaceholder}
                      className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-[24px] p-6 text-white text-base font-medium placeholder:text-white/10 focus:outline-none focus:border-purple-500/40 transition-all resize-none"
                    />
                  </div>

                  {/* Album MV: photo upload area */}
                  {mvSubType === 'album' && (
                    <div className="space-y-3">
                      <SectionLabel>{language === 'zh' ? '「上传照片」' : 'Upload Photos'}</SectionLabel>
                      <div className="grid grid-cols-4 gap-3">
                        {[1,2,3].map(i => (
                          <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                            <Image className="w-6 h-6 text-white/15" />
                          </div>
                        ))}
                        <button className="aspect-square rounded-2xl bg-white/[0.02] border border-dashed border-white/15 flex items-center justify-center hover:bg-white/[0.06] hover:border-purple-500/30 transition-all group">
                          <Plus className="w-6 h-6 text-white/15 group-hover:text-purple-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Template MV: template gallery */}
                  {mvSubType === 'template' && (
                    <div className="space-y-3">
                      <SectionLabel>{language === 'zh' ? '「模板精选」' : 'Template Gallery'}</SectionLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {(language === 'zh' 
                          ? ['「城市夜景」', '「自然风光」', '「复古胶片」', '「霓虹赛博」', '「水墨丹青」', '「极简抽象」']
                          : ['City Night', 'Nature', 'Retro Film', 'Neon Cyber', 'Ink Wash', 'Minimal']
                        ).map((tpl, i) => (
                          <button key={tpl} className={`h-20 rounded-2xl border flex items-center justify-center text-xs font-black tracking-wider transition-all ${
                            i === 3 ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' : 'bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.06]'
                          }`}>
                            {tpl}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Auto-save toggle */}
                  <label className="flex items-center gap-3 cursor-pointer px-2">
                    <input 
                      type="checkbox" 
                      checked={mvAutoSave} 
                      onChange={(e) => setMvAutoSave(e.target.checked)} 
                      className="w-4 h-4 rounded accent-purple-500" 
                    />
                    <span className="text-white/50 text-xs font-bold">{t.mvAutoSave}</span>
                    <Eye className="w-3.5 h-3.5 text-white/20" />
                  </label>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ MEDLEY ═══════════════ */}
              {mode === 'medley' && (
                <div className="max-w-4xl mx-auto space-y-8 py-8">
                  {/* Mix mode */}
                  <div className="grid grid-cols-2 gap-4">
                    {([
                      { key: 'auto' as const, label: t.medleyAutoMix, icon: <Sparkles size={18} /> },
                      { key: 'manual' as const, label: t.medleyManualMix, icon: <SlidersHorizontal size={18} /> },
                    ]).map(item => (
                      <button
                        key={item.key}
                        onClick={() => setMedleyMixMode(item.key)}
                        className={`h-16 rounded-2xl border flex items-center justify-center gap-3 transition-all ${
                          medleyMixMode === item.key 
                            ? 'bg-purple-500/15 border-purple-500/30 text-purple-300' 
                            : 'bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.06]'
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-black tracking-wider">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Upload area */}
                  <div 
                    className="border-2 border-dashed border-white/15 rounded-[32px] h-64 flex flex-col items-center justify-center gap-5 hover:border-purple-500/30 hover:bg-white/[0.02] transition-all cursor-pointer group"
                    onClick={() => window.dispatchEvent(new CustomEvent('dm-add-track-trigger'))}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/10 transition-all">
                      <Upload className="w-7 h-7 text-white/30 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <div className="text-center space-y-2">
                      <h4 className="text-white/50 font-black text-lg tracking-tight">{t.medleyUploadPrompt}</h4>
                      <p className="text-white/20 text-xs font-bold">{t.medleyUploadDesc}</p>
                    </div>
                  </div>

                  {/* Placeholder tracks */}
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex items-center gap-4 px-5 py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
                        <div className="w-5 text-white/15 text-xs font-mono">{i}</div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <Music2 className="w-4 h-4 text-white/15" />
                        </div>
                        <div className="flex-1">
                          <div className="h-3 w-32 bg-white/5 rounded" />
                          <div className="h-2 w-20 bg-white/[0.03] rounded mt-2" />
                        </div>
                        <span className="text-white/10 text-[10px] font-mono">--:--</span>
                      </div>
                    ))}
                  </div>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ ALBUM MV ═══════════════ */}
              {mode === 'album_mv' && (
                <div className="max-w-4xl mx-auto space-y-8 py-8">
                  <div className="space-y-3">
                    <SectionLabel>{language === 'zh' ? '「选择歌曲」' : 'Select Song'}</SectionLabel>
                    <div className="relative">
                      <Music2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        placeholder={language === 'zh' ? '「输入歌曲名称」' : 'Enter song name'}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 text-white text-lg font-semibold placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SectionLabel>{language === 'zh' ? '「上传照片（最多 20 张）」' : 'Upload Photos (max 20)'}</SectionLabel>
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                          <Image className="w-6 h-6 text-white/15" />
                        </div>
                      ))}
                      <button className="aspect-square rounded-2xl bg-white/[0.02] border border-dashed border-white/15 flex items-center justify-center hover:bg-white/[0.06] hover:border-purple-500/30 transition-all group">
                        <Plus className="w-6 h-6 text-white/15 group-hover:text-purple-400 transition-colors" />
                      </button>
                    </div>
                  </div>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ QUICK MV (Template) ═══════════════ */}
              {mode === 'quick_mv' && (
                <div className="max-w-4xl mx-auto space-y-8 py-8">
                  <div className="space-y-3">
                    <SectionLabel>{language === 'zh' ? '「选择歌曲」' : 'Select Song'}</SectionLabel>
                    <div className="relative">
                      <Music2 className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        placeholder={language === 'zh' ? '「输入歌曲名称」' : 'Enter song name'}
                        className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 text-white text-lg font-semibold placeholder:text-white/15 focus:outline-none focus:border-purple-500/40 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SectionLabel>{language === 'zh' ? '「MV 模板精选」' : 'MV Template Gallery'}</SectionLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {(language === 'zh' 
                        ? [
                          { name: '「城市夜景」', desc: '「霓虹灯光 · 车水马龙」' },
                          { name: '「自然风光」', desc: '「山水之间 · 清新治愈」' },
                          { name: '「复古胶片」', desc: '「怀旧色调 · 光影流转」' },
                          { name: '「霓虹赛博」', desc: '「未来科技 · 光电交织」' },
                          { name: '「水墨丹青」', desc: '「东方美学 · 意境悠远」' },
                          { name: '「极简抽象」', desc: '「几何构成 · 视觉冲击」' },
                        ]
                        : [
                          { name: 'City Night', desc: 'Neon lights · Urban flow' },
                          { name: 'Nature', desc: 'Mountains · Healing vibes' },
                          { name: 'Retro Film', desc: 'Vintage tones · Light & shadow' },
                          { name: 'Neon Cyber', desc: 'Futuristic · Electric glow' },
                          { name: 'Ink Wash', desc: 'Eastern aesthetics · Serene' },
                          { name: 'Minimal', desc: 'Geometric · Visual impact' },
                        ]
                      ).map((tpl, i) => (
                        <button key={tpl.name} className={`h-28 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          i === 0 ? 'bg-purple-500/15 border-purple-500/30' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                        }`}>
                          <span className={`text-sm font-black tracking-wider ${i === 0 ? 'text-purple-300' : 'text-white/50'}`}>{tpl.name}</span>
                          <span className={`text-[10px] font-bold ${i === 0 ? 'text-purple-400/60' : 'text-white/20'}`}>{tpl.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ REMIX ═══════════════ */}
              {mode === 'remix' && (
                <div className="max-w-5xl mx-auto space-y-12 mt-8">
                  <div className="bg-[#12121a] border border-white/10 rounded-[32px] md:rounded-[40px] p-8 md:p-12 flex flex-col items-center text-center gap-6 group hover:bg-[#181825] transition-all cursor-pointer shadow-2xl" onClick={() => window.dispatchEvent(new CustomEvent('dm-add-track-trigger'))}>
                     <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-white/5 rounded-[24px] rotate-6 group-hover:rotate-12 transition-transform" />
                        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-[20px] flex items-center justify-center shadow-xl">
                           <Plus className="text-black w-8 h-8 md:w-10 md:h-10" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-white font-black text-xl md:text-2xl tracking-tight">{t.uploadSong}</h3>
                        <p className="text-white/30 text-xs md:text-sm font-bold uppercase tracking-widest tracking-[0.2em]">{t.uploadSongSub}</p>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="flex items-center gap-6 md:gap-10 border-b border-white/5 overflow-x-auto">
                        {[t.recommended, t.ancientStyle, t.popStyle, t.otherStyle].map((tab, i) => (
                           <button key={tab} className={`text-base md:text-lg font-black pb-4 transition-colors relative whitespace-nowrap ${i === 0 ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
                              {tab}
                              {i === 0 && <motion.div layoutId="remix-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />}
                           </button>
                        ))}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {[
                           { title: '常回家看看', time: '04:39', artist: '马年行大运', brandImg: dmLogoChrome },
                           { title: '康定情歌', time: '03:34', artist: '半个乐评人', brandImg: dmLogoGold },
                           { title: '在那遥远的地方', time: '03:21', artist: '微醺爵士乐', brandImg: dmLogoRed },
                           { title: '恭喜发财', time: '02:54', artist: '混音台上的猫', brandImg: dmInstruments },
                        ].map((song, i) => (
                           <div key={i} className="flex items-center gap-4 md:gap-5 p-4 md:p-5 bg-white/[0.03] rounded-[24px] md:rounded-[28px] border border-white/5 hover:bg-white/[0.08] transition-all group cursor-pointer">
                              <div className="w-16 h-16 md:w-20 md:h-20 rounded-[16px] md:rounded-[20px] overflow-hidden flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform bg-[#0c0c14]">
                                 <img src={song.brandImg} alt="" className="w-full h-full object-contain" style={{ filter: 'brightness(1.2)' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="text-white font-black text-base md:text-lg truncate tracking-tight">{song.title}</div>
                                 <div className="text-white/30 text-[10px] md:text-xs mt-1 flex items-center gap-2 font-bold uppercase tracking-widest"><Clock size={12}/> {t.duration}{language === 'zh' ? '：' : ': '}{song.time}</div>
                                 <div className="flex items-center gap-2 mt-1.5 md:mt-2">
                                    <img src={dmLogoChrome} alt="" className="w-4 h-4 rounded-full object-cover" />
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{song.artist}</span>
                                 </div>
                              </div>
                              <button className="px-4 md:px-6 py-2 md:py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 rounded-xl md:rounded-2xl text-white text-xs font-black transition-all border border-white/10">{t.use}</button>
                           </div>
                        ))}
                     </div>
                  </div>
                  <ClosedLoopHint />
                </div>
              )}

              {/* ═══════════════ COVER ═══════════════ */}
              {mode === 'cover' && (
                <div className="max-w-5xl mx-auto space-y-10 md:space-y-12 mt-8">
                  <div className="bg-white/5 border border-white/10 rounded-[32px] md:rounded-[40px] h-44 md:h-56 flex flex-col items-center justify-center gap-4 md:gap-5 group hover:bg-white/[0.08] transition-all cursor-pointer shadow-xl" onClick={() => window.dispatchEvent(new CustomEvent('dm-add-track-trigger'))}>
                     <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-lg">
                        <Plus className="text-white/60 w-6 h-6 md:w-7 md:h-7" />
                     </div>
                     <span className="text-white/30 font-black text-base md:text-lg tracking-[0.3em] md:tracking-[0.4em] uppercase">{t.selectCoverSong}</span>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                     <div className="flex items-center justify-between px-2">
                        <h4 className="text-white font-black text-xl md:text-2xl tracking-tight">{t.voiceCards}</h4>
                        <button className="text-white/20 text-xs font-black flex items-center gap-2 hover:text-white transition-colors uppercase tracking-widest">
                            {t.more} <ChevronRight size={14} />
                        </button>
                     </div>
                     <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 px-2">
                        {[
                          { name: language === 'zh' ? '清冷女声' : 'Cool Female', time: '09:23', label: 'NEW', color: 'bg-emerald-400' },
                          { name: language === 'zh' ? '磁性男声' : 'Husky Male', time: '08:36', label: 'HOT', color: 'bg-amber-400' },
                          { name: language === 'zh' ? '电子音色' : 'Electronic', time: '07:21', label: 'PRO', color: 'bg-purple-500' },
                        ].map(card => (
                          <div key={card.name} className="relative aspect-[3/4] rounded-[24px] md:rounded-[28px] overflow-hidden group shadow-2xl border border-white/5">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                             <div className="absolute inset-0 bg-purple-500/10 group-hover:scale-110 transition-transform duration-700" />
                             <div className={`absolute top-3 left-3 md:top-4 md:left-4 ${card.color} text-black font-black text-[8px] md:text-[9px] px-1.5 py-0.5 rounded-md z-20 shadow-lg`}>{card.label}</div>
                             <div className="absolute top-8 md:top-10 left-3 md:left-4 text-white/40 font-black text-[9px] md:text-[10px] z-20 tracking-widest uppercase flex items-center gap-1.5">{t.duration} {card.time}</div>
                             <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 z-20 space-y-2 md:space-y-3">
                                <div className="text-white font-black text-sm md:text-base tracking-tight">{card.name}</div>
                                <button className="w-full py-2 md:py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">{t.optimize}</button>
                             </div>
                          </div>
                        ))}
                        <button className="aspect-[3/4] rounded-[24px] md:rounded-[28px] bg-white/[0.02] border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-all group">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/10 group-hover:text-white/30 group-hover:scale-110 transition-all">
                                <Plus size={24} />
                           </div>
                        </button>
                     </div>
                  </div>

                  <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-6 md:gap-10 overflow-x-auto pb-4 scrollbar-hide px-2">
                       {[t.deepMature, t.funnyEffects, t.clearBright, t.cheerful].map((style, i) => (
                          <button key={style} className={`text-base md:text-lg font-black whitespace-nowrap transition-all relative ${i === 0 ? 'text-white' : 'text-white/20 hover:text-white/40'}`}>
                             {style}
                             {i === 0 && <motion.div layoutId="cover-style" className="absolute -bottom-2 left-0 right-0 h-1 bg-purple-500 rounded-full" />}
                          </button>
                       ))}
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-8 px-2">
                       {[
                         { name: language === 'zh' ? '梦琪' : 'Dreamy' },
                         { name: language === 'zh' ? '雨桐' : 'Rainy' },
                         { name: language === 'zh' ? '婉宁' : 'Gentle' },
                         { name: language === 'zh' ? '赞恩' : 'Zane' },
                         { name: language === 'zh' ? '小雅' : 'Aria' },
                       ].map(char => (
                         <div key={char.name} className="flex flex-col items-center gap-3 md:gap-4 group cursor-pointer">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[20px] md:rounded-[28px] bg-[#12121a] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 transition-all shadow-lg overflow-hidden">
                               <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                            </div>
                            <span className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">{char.name}</span>
                         </div>
                       ))}
                    </div>
                  </div>

                  <GenerateButton label={t.generatePrice} />
                  <ClosedLoopHint />
                </div>
              )}
            </div>

            {/* AI Bottom Footer */}
            <div className="px-6 py-4 md:p-8 border-t border-white/5 bg-black/20 flex flex-col items-center gap-4">
               <div className="flex items-center gap-3 text-white/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-center">
                 <Sparkles className="w-3 h-3 text-purple-500 flex-shrink-0" />
                 {t.footerLabel}
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
