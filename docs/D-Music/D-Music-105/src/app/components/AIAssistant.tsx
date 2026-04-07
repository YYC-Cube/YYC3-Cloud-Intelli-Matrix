import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Send, Sparkles, X, User, Bot, WandSparkles, 
  Music, Zap, PenTool, Lightbulb,
  Copy, Check, Save, Download, FileText,
  RotateCcw, Play, Square, ChevronRight,
  Library, Trash2, Pencil, Volume2, ListMusic,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  onPlayTrack: (trackId: number) => void;
  onCreatePlaylist: (name: string, trackIds: number[]) => void;
  language: 'zh' | 'en';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'action' | 'lyrics' | 'analysis';
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface SavedLyrics {
  id: string;
  title: string;
  theme: string;
  style: LyricStyle;
  mood: LyricMood;
  content: string;
  sections: LyricSection[];
  createdAt: number;
  updatedAt: number;
}

interface LyricSection {
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
  label: string;
  lines: string[];
}

type AIMode = 'chat' | 'workshop' | 'analysis';
type WorkshopStep = 'inspire' | 'create' | 'edit' | 'compose' | 'save';
type LyricStyle = 'pop' | 'rock' | 'jazz' | 'electronic' | 'folk' | 'hiphop';
type LyricMood = 'happy' | 'sad' | 'romantic' | 'energetic' | 'dreamy' | 'rebellious';

const TRANSLATIONS = {
  zh: {
    title: 'Muse AI',
    subtitle: '「智能音乐创作助手」',
    chatMode: '「对话」',
    workshopMode: '「词曲工坊」',
    analysisMode: '「分析」',
    placeholder: '「告诉 Muse 你想做什么...」',
    analysisPlaceholder: '「输入歌词或文本进行分析...」',
    generate: '「生成歌词」',
    analyze: '「情感分析」',
    style: '「风格」',
    mood: '「情绪」',
    theme: '「主题」',
    styles: { pop: '「流行」', rock: '「摇滚」', jazz: '「爵士」', electronic: '「电子」', folk: '「民谣」', hiphop: '「说唱」' } as Record<LyricStyle, string>,
    moods: { happy: '「欢快」', sad: '「伤感」', romantic: '「浪漫」', energetic: '「激昂」', dreamy: '「梦幻」', rebellious: '「叛逆」' } as Record<LyricMood, string>,
    rhymeCheck: '「押韵检查」',
    sentimentResult: '「情感倾向」',
    positive: '「积极」',
    negative: '「消极」',
    neutral: '「中性」',
    copied: '「已复制」',
    copy: '「复制」',
    inspirations: '「灵感推荐」',
    inspirationHints: ['「城市夜景与霓虹」', '「海边日落的思念」', '「雨天咖啡馆独白」', '「星际穿越的旅程」', '「春日樱花物语」', '「午夜梦回」'],
    welcomeMsg: '「你好！我是 Muse AI 智能核心。你可以通过关键词指令直接控制系统，或在此进行对话与分析。」\n\n💡 **「常用关键词」**：\n- 「创作工坊」：AI 写歌与 MV 制作\n- 「时空喊话」：定时定点音频留言\n- 「统计分析」：数据可视化洞察\n- 「五标五高」：系统质量监控\n- 「沉浸模式」：切换全屏视觉\n\n「试试对我输入这些词吧！」',
    editAssist: '「编辑辅助」',
    rhymeScheme: '「韵律方案」',
    wordCount: '「字数」',
    lines: '「行」',
    // Workshop specific
    stepInspire: '「灵感」',
    stepCreate: '「创作」',
    stepEdit: '「编辑」',
    stepCompose: '「谱曲」',
    stepSave: '「保存」',
    themePlaceholder: '「输入歌曲主题，如「星空下的旅行」...」',
    nextStep: '「下一步」',
    prevStep: '「上一步」',
    generating: '「正在创作中...」',
    generatingDesc: '「Muse AI 正在为你编织词句」',
    regenerate: '「重新生成」',
    regenerateSection: '「重新生成此段」',
    editLyrics: '「编辑歌词」',
    sectionVerse: '「主歌」',
    sectionChorus: '「副歌」',
    sectionBridge: '「桥段」',
    sectionIntro: '「前奏提示」',
    sectionOutro: '「尾声」',
    melodyPreview: '「旋律预览」',
    playMelody: '「播放旋律」',
    stopMelody: '「停止」',
    bpm: '「速度」',
    chordProgression: '「和弦进行」',
    key: '「调性」',
    saveToLibrary: '「保存到创作库」',
    exportTxt: '「导出 .txt」',
    exportLrc: '「导出 .lrc」',
    savedWorks: '「创作库」',
    noSavedWorks: '「暂无保存的作品」',
    loadWork: '「加载」',
    deleteWork: '「删除」',
    songTitle: '「歌曲标题」',
    titlePlaceholder: '「输入歌曲标题...」',
    saved: '「已保存！」',
    exported: '「已导出！」',
    confirmDelete: '「确定删除这首作品吗？」',
    totalWorks: '「首作品」',
    lyricsStats: '「歌词统计」',
    chars: '「字符」',
    sections: '「段落」',
    rhymeScore: '「押韵评分」',
    sentimentTrend: '「情感基调」',
    startCreating: '「开始创作」',
    back: '「返回」',
  },
  en: {
    title: 'Muse AI',
    subtitle: 'Smart Music Creative Assistant',
    chatMode: 'Chat',
    workshopMode: 'Workshop',
    analysisMode: 'Analyze',
    placeholder: 'Tell Muse what you want to do...',
    analysisPlaceholder: 'Enter lyrics or text for analysis...',
    generate: 'Generate Lyrics',
    analyze: 'Analyze Sentiment',
    style: 'Style',
    mood: 'Mood',
    theme: 'Theme',
    styles: { pop: 'Pop', rock: 'Rock', jazz: 'Jazz', electronic: 'Electronic', folk: 'Folk', hiphop: 'Hip-Hop' } as Record<LyricStyle, string>,
    moods: { happy: 'Happy', sad: 'Sad', romantic: 'Romantic', energetic: 'Energetic', dreamy: 'Dreamy', rebellious: 'Rebellious' } as Record<LyricMood, string>,
    rhymeCheck: 'Rhyme Check',
    sentimentResult: 'Sentiment',
    positive: 'Positive',
    negative: 'Negative',
    neutral: 'Neutral',
    copied: 'Copied',
    copy: 'Copy',
    inspirations: 'Inspiration',
    inspirationHints: ['City lights & neon glow', 'Sunset by the ocean', 'Rainy day cafe monologue', 'Interstellar journey', 'Spring cherry blossoms', 'Midnight memories'],
    welcomeMsg: "Hi! I'm Muse AI, your smart music assistant. You can:\n\n🎵 Ask me to play songs or create playlists\n✍️ Use the Workshop for full song creation\n🔍 Use Analyze mode for sentiment analysis\n\nTry switching the mode tabs above!",
    editAssist: 'Edit Assist',
    rhymeScheme: 'Rhyme Scheme',
    wordCount: 'Words',
    lines: 'Lines',
    stepInspire: 'Inspire',
    stepCreate: 'Create',
    stepEdit: 'Edit',
    stepCompose: 'Compose',
    stepSave: 'Save',
    themePlaceholder: 'Enter a song theme like "journey under the stars"...',
    nextStep: 'Next',
    prevStep: 'Back',
    generating: 'Creating...',
    generatingDesc: 'Muse AI is crafting your lyrics',
    regenerate: 'Regenerate',
    regenerateSection: 'Regenerate section',
    editLyrics: 'Edit Lyrics',
    sectionVerse: 'Verse',
    sectionChorus: 'Chorus',
    sectionBridge: 'Bridge',
    sectionIntro: 'Intro Note',
    sectionOutro: 'Outro',
    melodyPreview: 'Melody Preview',
    playMelody: 'Play Melody',
    stopMelody: 'Stop',
    bpm: 'BPM',
    chordProgression: 'Chords',
    key: 'Key',
    saveToLibrary: 'Save to Library',
    exportTxt: 'Export .txt',
    exportLrc: 'Export .lrc',
    savedWorks: 'Library',
    noSavedWorks: 'No saved works yet',
    loadWork: 'Load',
    deleteWork: 'Delete',
    songTitle: 'Song Title',
    titlePlaceholder: 'Enter song title...',
    saved: 'Saved!',
    exported: 'Exported!',
    confirmDelete: 'Delete this work?',
    totalWorks: 'works',
    lyricsStats: 'Lyrics Stats',
    chars: 'chars',
    sections: 'sections',
    rhymeScore: 'Rhyme Score',
    sentimentTrend: 'Sentiment',
    startCreating: 'Start Creating',
    back: 'Back',
  }
};

// ═══════════════════════════════════════════════
// LYRICS GENERATION ENGINE (Enhanced with full song structure)
// ═══════════════════════════════════════════════

function generateFullLyrics(theme: string, style: LyricStyle, mood: LyricMood, lang: 'zh' | 'en'): LyricSection[] {
  if (lang === 'zh') return generateZhLyrics(theme, style, mood);
  return generateEnLyrics(theme, style, mood);
}

function generateZhLyrics(theme: string, style: LyricStyle, mood: LyricMood): LyricSection[] {
  const moodMap: Record<LyricMood, { verse1: string[]; chorus: string[]; verse2: string[]; bridge: string[]; }> = {
    happy: {
      verse1: [`${theme}的「晨曦拨开了迷雾」`, `「繁花在风中踏着轻盈脚步」`, `「指尖滑过琴弦的温度」`, `「世界在这一刻变得纯粹而满足」`],
      chorus: [`「让我们迎着风奔跑」`, `「在那名为自由的旷野尽情破晓」`, `${theme}是「永恒的韵律在燃烧」`, `「每一个跳动的音符都是骄傲」`, `「唱出心中的那份欢笑」`, `「让全世界都为我们的闪耀停靠」`],
      verse2: [`「清晨的第一缕阳光洒向窗棂」`, `「唤醒了沉睡已久的坚定梦想」`, `${theme}在「耳畔温柔地低语」`, `「仿佛所有的星辰都在发光」`],
      bridge: [`「不需要繁琐的理由 不需要确定的方向」`, `「只要心中有节奏 灵魂就有归乡」`, `${theme}将「此刻的我们紧紧连结」`, `「这场青春的盛宴 永不散场」`],
    },
    sad: {
      verse1: [`${theme}的「残影渐渐模糊在冷雨中」`, `「过往的繁华终究抵不过一阵寒风」`, `「寂寞的空城只剩下落寞的残梦」`, `「心碎的声音 在深夜里无声翻涌」`],
      chorus: [`「谁在喧嚣的街头 独自唱着那首告别」`, `${theme}化作了「无法触及的凋零季节」`, `「那些再也回不去的纯真岁月」`, `「如同风中散落的枯叶 带着不甘凋谢」`, `「只剩下我 在记忆的荒原里盘旋」`, `「听着遗憾 慢慢凝结成冰雪」`],
      verse2: [`「翻开那些泛黄的信笺 每一字都是凌迟」`, `「那些名为诺言的讽刺 在时光里静止」`, `${theme}像「一把生锈的钥匙」`, `「试图开启 那扇早已锁死的往事」`],
      bridge: [`「也许终有一天 我会学着释怀」`, `「把所有的执着 都交还给那片深海」`, `${theme}是「最后的无奈告别」`, `「在心底最深处 永远苍白地徘徊」`],
    },
    romantic: {
      verse1: [`${theme}是「我亲手为你写下的诗篇」`, `「每一个韵脚都藏着对你的眷恋」`, `「夕阳余晖 映照着你微垂的眼帘」`, `「世界在这一刻 只剩下彼此的呼吸连成线」`],
      chorus: [`「想对你诉说一万次 那些未曾开口的温柔」`, `「所有的千言万语 最终都化作眼眸里的星斗」`, `${theme}是「我们之间独有的暗号与密谋」`, `「只有你能听懂 这份跨越时光的等候」`, `「在命运的尽头 我愿为你停留」`, `「用这一生的旋律 为爱白头」`],
      verse2: [`「清晨醒来 第一眼看见你的笑颜」`, `「那是比任何乐章都要动听的初见」`, `${theme}「编织成永恒的桂冠」`, `「轻轻为你 戴上这世间最美的华年」`],
      bridge: [`「不管未来的路 还要走过多少坎坷崎岖」`, `「你永远是我 唯一的终点与归宿的奇迹」`, `${theme}是「铭刻在灵魂深处的契约」`, `「永不磨灭 生生不息」`],
    },
    energetic: {
      verse1: [`${theme}「点燃了胸膛里最后的一丝火焰」`, `「不再做任何妥协 向着未知的明天开战」`, `「没有什么能阻挡 我们沸腾的热血」`, `「全世界都将见证 这一刻的狂欢」`],
      chorus: [`「燃烧吧 就在这一秒 彻底爆发」`, `${theme}「化作 撕裂苍穹的怒吼与音浪」`, `「冲破黑暗的桎梏 击碎所有的假象」`, `「我们就是这片战场上 唯一的王」`, `「呐喊吧 别停下 释放所有的疯狂」`, `「让整个宇宙 都为我们的节奏震颤」`],
      verse2: [`「汗水浸透了沉重的衣衫 每一拍都是洗礼」`, `「在名为命运的格斗场上 我们从未放弃」`, `${theme}是「永不熄灭的战意」`, `「照亮前方 所有的迷茫与荆棘」`],
      bridge: [`「失败算什么 跌倒又算什么」`, `「擦干血迹 站起来继续唱响生命之歌」`, `${theme}「赐予我最锋利的武器」`, `「今夜注定 要写下不朽的传说」`],
    },
    dreamy: {
      verse1: [`${theme}「静静地漂浮在紫色云端之上」`, `「璀璨的星河倒映在 每一个透明的心房」`, `「梦境与现实的边界 正在无声扩张」`, `「一切都显得如此 虚幻而又如此美丽悠扬」`],
      chorus: [`闭上双眼 随我一同飞向那未知的远方`, `${theme}化作 细碎的银色星尘在指尖流淌`, `穿过那道 跨越维度的深蓝极光`, `在时间的尽头 寻找那一处秘密花园`, `在那里 你会看见 所有的梦想`, `都如同繁花 灿烂地绽放`],
      verse2: [`月光在古老的窗台上 翩然起舞`, `影子在斑驳的墙壁上 勾勒着迷途`, `${theme}是一首 永恒的安眠曲`, `轻轻地 哄着整个夜晚入驻`],
      bridge: [`也许这只是一场 永不苏醒的幻觉`, `但梦里��那份真实 却让我如此地眷恋`, `${theme}连接着 两个平行的世界`, `请让我 在这个梦里 多停留一会`],
    },
    rebellious: {
      verse1: [`${theme}要打破这世间 所有的既定规则`, `我拒绝再做 任何人的劣质复制品或影子`, `我的灵魂我做主 哪怕是孤独的叛徒`, `向这个 虚伪而平庸的世界 彻底宣战`],
      chorus: [`撕碎那些 贴在身上的卑微标签`, `${theme}是反叛者 吹响的最响亮号角与利箭`, `我不需要 任何廉价的认可与同情`, `我就是我自己的神 在这一刻苏醒`, `打破牢笼 冲出那道高耸的围墙`, `用这不安分的音乐 颠覆一切陈腐的过往`],
      verse2: [`他们口中那些 绝对不可能实现的荒诞`, `恰恰就是我 穷尽一生也要追求的灿烂`, `${theme}是深埋在 心底最炽热的熔岩`, `终将烧掉 一切伪装与谎言`],
      bridge: [`世界需要 不同的杂音来惊醒沉睡`, `别再沉默 挺起胸膛 别让自己感到卑微`, `${theme}是最锋利 且带有温度的利刃`, `真实的力量 比虚伪的和平 更有尊严`],
    },
  };

  const data = moodMap[mood];
  const sectionLabel: Record<string, string> = {
    intro: '前奏提示', verse: '主歌', chorus: '副歌', bridge: '桥段', outro: '尾声'
  };

  return [
    { type: 'intro', label: sectionLabel.intro, lines: [`[${theme} - 渐入式开场，营造氛围]`] },
    { type: 'verse', label: `${sectionLabel.verse} A`, lines: data.verse1 },
    { type: 'chorus', label: sectionLabel.chorus, lines: data.chorus },
    { type: 'verse', label: `${sectionLabel.verse} B`, lines: data.verse2 },
    { type: 'bridge', label: sectionLabel.bridge, lines: data.bridge },
    { type: 'chorus', label: `${sectionLabel.chorus} (重复)`, lines: data.chorus },
    { type: 'outro', label: sectionLabel.outro, lines: [`[渐弱结束，回响余韵]`] },
  ];
}

function generateEnLyrics(theme: string, style: LyricStyle, mood: LyricMood): LyricSection[] {
  const moodMap: Record<LyricMood, { verse1: string[]; chorus: string[]; verse2: string[]; bridge: string[]; }> = {
    happy: {
      verse1: [`${theme} shining bright ahead`, `Every step in rhythm, joy widespread`, `The breeze is playing with my hair`, `The world is beautiful and fair`],
      chorus: [`Let's run together now`, `Chase the brightest star somehow`, `${theme} is an eternal song`, `Beating in our hearts so strong`, `Sing out all the happiness`, `Let the world hear nothing less`],
      verse2: [`Morning sun, the very first ray`, `Awakens dreams of a brand new day`, `${theme} whispers in my ear`, `Every note shines bright and clear`],
      bridge: [`No reason needed, no path defined`, `With music playing, we'll be just fine`, `${theme} connects us all tonight`, `This joy will never fade from sight`],
    },
    sad: {
      verse1: [`${theme} fading in the rain`, `Memories wrapped in endless pain`, `An empty sky, a hollow sound`, `Tears falling without making ground`],
      chorus: [`Who's singing alone in the night`, `${theme} turns to silent light`, `Those days we can never retrieve`, `Scattered petals in the breeze`, `Only I remain, standing still`, `Watching memories freeze and chill`],
      verse2: [`Opening letters turned to gold`, `Every line a story told`, `${theme} like a broken guitar string`, `Silent notes that still can sing`],
      bridge: [`Perhaps one day I'll let it go`, `Give all regrets to the river's flow`, `${theme} is the last goodbye`, `A faint light that will never die`],
    },
    romantic: {
      verse1: [`${theme} is a poem for you`, `Every word whispers what's true`, `Moonlight catches your gentle smile`, `Making everything worthwhile`],
      chorus: [`A thousand love words on my tongue`, `Yet only sighs come out unsung`, `${theme} is our secret code`, `Only you can decrypt this road`, `At the edge of time I'll wait`, `A lifetime proving love is fate`],
      verse2: [`Waking up to see your face`, `More beautiful than any grace`, `${theme} woven into a crown`, `Placed gently as the sun goes down`],
      bridge: [`No matter where the road may lead`, `You're the home that I will need`, `${theme} is an eternal vow`, `Carved deep within my heart right now`],
    },
    energetic: {
      verse1: [`${theme} ignites the fire inside`, `Follow the beat, let's turn the tide`, `Nothing can ever hold us down`, `Our voices shake the entire town`],
      chorus: [`Burn it up, this very moment`, `${theme} becomes the strongest torrent`, `Tear through darkness, break the chain`, `We are the kings of our domain`, `Scream it out, don't ever stop`, `Make the universe shake and drop`],
      verse2: [`Sweat and tears upon the stage`, `Every beat writes a new page`, `${theme} is a fire that won't die`, `Lighting up the darkest sky`],
      bridge: [`What's failure, what's falling down`, `Get back up, reclaim the crown`, `${theme} gives me all the strength`, `Tonight we go to any length`],
    },
    dreamy: {
      verse1: [`${theme} floating above the clouds`, `Starlight reflected, soft and loud`, `Dreams and reality intertwine`, `Everything feels so divine`],
      chorus: [`Close your eyes and fly with me`, `${theme} turns to silver debris`, `Through the purple nebula's gate`, `To the edge of time and fate`, `There you'll see a garden bloom`, `Where dreams push away the gloom`],
      verse2: [`Moonlight dances on the sill`, `Shadows paint the night so still`, `${theme} is a lullaby`, `Gently rocking the darkened sky`],
      bridge: [`Maybe this is just a dream`, `But feelings here are what they seem`, `${theme} bridges worlds apart`, `Let me linger, heart to heart`],
    },
    rebellious: {
      verse1: [`${theme} breaks every single rule`, `No more playing someone's fool`, `My voice, my choice, I set the pace`, `War declared on every fake face`],
      chorus: [`Rip apart those labels now`, `${theme} is the rebel's vow`, `I don't need your validation`, `I'm the god of my own nation`, `Break the cage, tear down the wall`, `Music will overturn it all`],
      verse2: [`They said impossible, can't be done`, `That's exactly why I've begun`, `${theme} is the fire within`, `Burning through every false skin`],
      bridge: [`The world needs a different sound`, `Stand up from the underground`, `${theme} is the sharpest blade`, `Truth cuts deeper than charade`],
    },
  };

  const data = moodMap[mood];

  return [
    { type: 'intro', label: 'Intro Note', lines: [`[${theme} - Gradual fade-in, building atmosphere]`] },
    { type: 'verse', label: 'Verse 1', lines: data.verse1 },
    { type: 'chorus', label: 'Chorus', lines: data.chorus },
    { type: 'verse', label: 'Verse 2', lines: data.verse2 },
    { type: 'bridge', label: 'Bridge', lines: data.bridge },
    { type: 'chorus', label: 'Chorus (Reprise)', lines: data.chorus },
    { type: 'outro', label: 'Outro', lines: [`[Fade out, echoing resonance]`] },
  ];
}

// ═══════════════════════════════════════════════
// ANALYSIS HELPERS
// ═══════════════════════════════════════════════

function analyzeSentiment(text: string): { sentiment: 'positive' | 'negative' | 'neutral'; score: number; keywords: string[] } {
  const positiveWords = ['love', 'happy', 'joy', 'beautiful', 'bright', 'shine', 'dream', 'hope', 'smile', 'sweet', 'warm',
    '爱', '快乐', '幸福', '美丽', '光明', '闪耀', '梦想', '希望', '微笑', '温暖', '甜蜜', '阳光', '美好', '自由', '欢乐',
    '奔跑', '歌唱', '力量', '燃烧', '飞', '花', '星'];
  const negativeWords = ['sad', 'pain', 'dark', 'cry', 'tears', 'lonely', 'broken', 'lost', 'cold', 'empty', 'sorrow',
    '悲伤', '痛苦', '黑暗', '哭泣', '眼泪', '孤独', '破碎', '迷失', '冰冷', '空洞', '忧伤', '离别', '伤心',
    '泪', '雨', '散', '凉', '碎', '痛'];

  const lowerText = text.toLowerCase();
  const foundPositive = positiveWords.filter(w => lowerText.includes(w));
  const foundNegative = negativeWords.filter(w => lowerText.includes(w));

  const positiveScore = foundPositive.length;
  const negativeScore = foundNegative.length;
  const total = positiveScore + negativeScore;

  if (total === 0) return { sentiment: 'neutral', score: 0.5, keywords: [] };
  
  const score = positiveScore / total;
  const sentiment = score > 0.6 ? 'positive' : score < 0.4 ? 'negative' : 'neutral';
  
  return { 
    sentiment, 
    score, 
    keywords: [...foundPositive.slice(0, 4), ...foundNegative.slice(0, 4)]
  };
}

function checkRhymes(text: string): { total: number; matched: number; details: string[] } {
  const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('['));
  const details: string[] = [];
  let matched = 0;
  
  for (let i = 0; i < lines.length - 1; i += 2) {
    const line1 = lines[i].trim();
    const line2 = lines[i + 1]?.trim();
    if (!line2) continue;
    
    const ending1 = line1.slice(-2);
    const ending2 = line2.slice(-2);
    
    if (ending1 === ending2 || ending1.slice(-1) === ending2.slice(-1)) {
      details.push(`L${i + 1}-L${i + 2}: "${ending1}" ↔ "${ending2}" ✓`);
      matched++;
    } else {
      details.push(`L${i + 1}-L${i + 2}: "${ending1}" ↔ "${ending2}" ✗`);
    }
  }
  
  const total = details.length;
  return { total, matched, details };
}

// ═══════════════════════════════════════════════
// MELODY GENERATOR (Web Audio API)
// ═══════════════════════════════════════════════

interface MelodyConfig {
  key: string;
  chords: string[];
  bpm: number;
  scale: number[];
}

function getMelodyConfig(style: LyricStyle, mood: LyricMood): MelodyConfig {
  const configs: Record<LyricMood, MelodyConfig> = {
    happy: { key: 'C', chords: ['C', 'F', 'G', 'F'], bpm: 120, scale: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88] },
    sad: { key: 'Am', chords: ['Am', 'F', 'C', 'G'], bpm: 78, scale: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00] },
    romantic: { key: 'G', chords: ['G', 'Em', 'C', 'D'], bpm: 88, scale: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23] },
    energetic: { key: 'E', chords: ['E', 'B', 'C#m', 'A'], bpm: 138, scale: [329.63, 369.99, 392.00, 440.00, 493.88, 523.25, 587.33] },
    dreamy: { key: 'D', chords: ['Dmaj7', 'F#m', 'Bm7', 'Gmaj7'], bpm: 68, scale: [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25] },
    rebellious: { key: 'Am', chords: ['Am', 'G', 'F', 'E'], bpm: 155, scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25] },
  };
  return configs[mood];
}

// Chord frequency maps for triads
const chordFreqs: Record<string, number[]> = {
  'C': [261.63, 329.63, 392.00],
  'D': [293.66, 369.99, 440.00],
  'E': [329.63, 415.30, 493.88],
  'F': [349.23, 440.00, 523.25],
  'G': [392.00, 493.88, 587.33],
  'A': [440.00, 554.37, 659.25],
  'B': [493.88, 622.25, 739.99],
  'Am': [220.00, 261.63, 329.63],
  'Bm': [246.94, 293.66, 369.99],
  'Bm7': [246.94, 293.66, 369.99],
  'C#m': [277.18, 329.63, 415.30],
  'Dm': [293.66, 349.23, 440.00],
  'Em': [329.63, 392.00, 493.88],
  'F#m': [369.99, 440.00, 554.37],
  'Dmaj7': [293.66, 369.99, 440.00],
  'Gmaj7': [392.00, 493.88, 587.33],
};

// ═══════════════════════════════════════════════
// SAVED WORKS (localStorage)
// ═══════════════════════════════════════════════

const STORAGE_KEY = 'dmusic_lyrics_library';

function loadSavedWorks(): SavedLyrics[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (_e) { return []; }
}

function saveLyricsToStorage(works: SavedLyrics[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

// ─── Ollama Integration ──────────────────────────────

async function generateLyricsWithOllama(theme: string, style: LyricStyle, mood: LyricMood, lang: 'zh' | 'en'): Promise<LyricSection[] | null> {
  const prompt = lang === 'zh' 
    ? `你是一个专业的词曲创作人。请为主题为「${theme}」的歌曲创作歌词。风格是${style}，情绪是${mood}。
       请返回JSON格式的数组，每个元素包含 { type, label, lines }。
       type 可选值: intro, verse, chorus, bridge, outro。
       label 是段落名称（如「主歌 A」）。
       lines 是一个字符串数组，每行歌词一个元素。
       不要返回任何其他文字，只返回 JSON 数组。`
    : `You are a professional songwriter. Please write lyrics for a song themed "${theme}". Style: ${style}, Mood: ${mood}.
       Return a JSON array where each element contains { type, label, lines }.
       Types: intro, verse, chorus, bridge, outro.
       Label is the section name (e.g., "Verse 1").
       Lines is an array of strings, one for each line of the lyrics.
       Return ONLY the JSON array, no other text.`;

  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        model: 'llama3', // or 'qwen2', 'mistral', etc.
        prompt: prompt,
        stream: false,
        format: 'json'
      }),
    });
    
    if (!response.ok) throw new Error('Ollama not available');
    
    const data = await response.json();
    const result = JSON.parse(data.response);
    if (Array.isArray(result)) return result;
    return null;
  } catch (e) {
    console.log('Ollama generation failed, falling back to built-in generator:', e);
    return null;
  }
}

// ═══════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
// GLOBAL CONTROL CORE DICTIONARY
// ═══════════════════════════════════════════════

const FUNCTION_MAP: Record<string, { label: string, desc: string, action: string }> = {
  '时空喊话': { label: '「时空喊话」', desc: '「跨越时空的音频留言系统，支持在特定位置或时间触发。」', action: 'open-spacetime' },
  '五标五高': { label: '「五标五高」', desc: '「系统核心质量监控中心，涵盖高性能、高可用等五个维度。」', action: 'open-standards' },
  '智能推荐': { label: '「智能推荐」', desc: '「基于深度学习的个性化发现引擎，精准推送曲目。」', action: 'open-recommend' },
  '创作工坊': { label: '「AI 创作工坊」', desc: '「集写歌、作词、作曲、MV 制作于一体的创作空间。」', action: 'open-creator' },
  '统计分析': { label: '「统计分析」', desc: '「全方位的听歌行为洞察，可视化展示音乐生活。」', action: 'open-analytics' },
  '练个房': { label: '「练个房」', desc: '「3D 虚拟练习室，提供音准纠正与在线对飙功能。」', action: 'open-practice' },
  '主题定制': { label: '「主题中心」', desc: '「全动态主题自定义引擎，支持 OKLch 色彩空间调节。」', action: 'open-theme' },
  '沉浸模式': { label: '「沉浸模式」', desc: '「大屏视觉同步与动态歌词，强调极致听觉体验。」', action: 'mode-immersive' },
  '迷你模式': { label: '「迷你模式」', desc: '「极简胶囊播放器，适合后台驻留。」', action: 'mode-mini' },
};

export function AIAssistant({ isOpen, onClose, tracks, onPlayTrack, onCreatePlaylist, language = 'zh' }: Props) {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIMode>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: t.welcomeMsg }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Workshop state
  const [workshopStep, setWorkshopStep] = useState<WorkshopStep>('inspire');
  const [lyricStyle, setLyricStyle] = useState<LyricStyle>('pop');
  const [lyricMood, setLyricMood] = useState<LyricMood>('romantic');
  const [themeInput, setThemeInput] = useState('');
  const [generatedSections, setGeneratedSections] = useState<LyricSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingLyrics, setEditingLyrics] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [showSavedWorks, setShowSavedWorks] = useState(false);
  const [savedWorks, setSavedWorks] = useState<SavedLyrics[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Melody state
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const melodyTimeoutsRef = useRef<number[]>([]);

  // Load saved works
  useEffect(() => {
    setSavedWorks(loadSavedWorks());
  }, []);

  // Update welcome message
  useEffect(() => {
    setMessages([{ id: '1', role: 'assistant', content: TRANSLATIONS[language].welcomeMsg }]);
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Cleanup melody on close
  useEffect(() => {
    if (!isOpen) {
      stopMelody();
    }
  }, [isOpen]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Chat & Analysis handlers ──

  const handleSend = async () => {
    if (!input.trim()) return;
    if (mode === 'analysis') {
      handleSentimentAnalysis();
    } else {
      handleChatMessage();
    }
  };

  const handleSentimentAnalysis = () => {
    const text = input.trim();
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: `🔍 ${text}` };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const result = analyzeSentiment(text);
      const rhymes = checkRhymes(text);
      
      let content = `📊 **${t.sentimentResult}**\n\n`;
      content += `${result.sentiment === 'positive' ? '🟢' : result.sentiment === 'negative' ? '🔴' : '🟡'} `;
      content += `${result.sentiment === 'positive' ? t.positive : result.sentiment === 'negative' ? t.negative : t.neutral}`;
      content += ` (${(result.score * 100).toFixed(0)}%)\n\n`;
      
      if (result.keywords.length > 0) {
        content += `🔑 ${language === 'zh' ? '关键词' : 'Keywords'}: ${result.keywords.join(', ')}\n\n`;
      }
      
      if (rhymes.details.length > 0) {
        content += `🎼 ${t.rhymeCheck}:\n${rhymes.details.join('\n')}`;
      }

      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        type: 'analysis',
        sentiment: result.sentiment
      }]);
    }, 1000);
  };

  const handleChatMessage = () => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      processAIResponse(userMsg.content);
    }, 1000);
  };

  const processAIResponse = (text: string) => {
    setIsTyping(false);
    const lowerText = text.toLowerCase();
    
    // Check functional dictionary first
    for (const [key, info] of Object.entries(FUNCTION_MAP)) {
      if (lowerText.includes(key)) {
        const responseMsg: Message = {
          id: Date.now().toString(), role: 'assistant',
          content: `「已为您找到功能：」**${info.label}**\n\n> ${info.desc}\n\n「正在为您开启该模块... 🚀」`,
          type: 'action'
        };
        window.dispatchEvent(new CustomEvent('dm-command', { detail: { action: info.action } }));
        setIsTyping(false);
        setMessages(prev => [...prev, responseMsg]);
        return;
      }
    }

    // Default chat response
    let responseText = '';
    if (lowerText.includes('播放') || lowerText.includes('play')) {
      const track = tracks.find(t => lowerText.includes(t.title.toLowerCase()));
      if (track) {
        onPlayTrack(track.id);
        responseText = `「好的，正在为您播放」 **「${track.title}」**... 🎵`;
      } else {
        responseText = `「想听哪首歌？可以告诉我具体的歌名哦。也可以试试「随机播放」。」`;
      }
    } else if (lowerText.includes('你好') || lowerText.includes('hello')) {
      responseText = `「你好！我是 Muse AI，很高兴为你服务。今天想听点什么，或者我们可以一起创作一首新歌？」`;
    } else {
      responseText = `「抱歉，我还在学习中。你可以尝试输入「创作工坊」、「时空喊话」或「沉浸模式」等关键词来控制我。」`;
    }

    const assistantMsg: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: responseText
    };
    setMessages(prev => [...prev, assistantMsg]);
  };

  // ── Workshop handlers ──

  const handleGenerate = useCallback(async () => {
    if (!themeInput.trim()) return;
    setIsGenerating(true);
    setWorkshopStep('create');

    // Try Ollama first
    const ollamaLyrics = await generateLyricsWithOllama(themeInput.trim(), lyricStyle, lyricMood, language);
    
    if (ollamaLyrics) {
      setGeneratedSections(ollamaLyrics);
      setEditingLyrics(sectionsToText(ollamaLyrics));
    } else {
      // Fallback
      const sections = generateFullLyrics(themeInput.trim(), lyricStyle, lyricMood, language);
      setGeneratedSections(sections);
      setEditingLyrics(sectionsToText(sections));
    }
    
    if (!songTitle) {
      setSongTitle(themeInput.trim());
    }
    setIsGenerating(false);
  }, [themeInput, lyricStyle, lyricMood, language, songTitle]);

  const handleRegenerateSection = (index: number) => {
    const sections = generateFullLyrics(themeInput.trim(), lyricStyle, lyricMood, language);
    setGeneratedSections(prev => prev.map((s, i) => i === index ? sections[index] : s));
    setEditingLyrics(sectionsToText(generatedSections.map((s, i) => i === index ? sections[index] : s)));
  };

  const sectionsToText = (sections: LyricSection[]): string => {
    return sections.map(s => `[${s.label}]\n${s.lines.join('\n')}`).join('\n\n');
  };

  const handleSaveWork = () => {
    const work: SavedLyrics = {
      id: Date.now().toString(),
      title: songTitle || themeInput,
      theme: themeInput,
      style: lyricStyle,
      mood: lyricMood,
      content: editingLyrics,
      sections: generatedSections,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updated = [work, ...savedWorks.filter(w => w.id !== work.id)];
    setSavedWorks(updated);
    saveLyricsToStorage(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLoadWork = (work: SavedLyrics) => {
    setSongTitle(work.title);
    setThemeInput(work.theme);
    setLyricStyle(work.style);
    setLyricMood(work.mood);
    setGeneratedSections(work.sections);
    setEditingLyrics(work.content);
    setShowSavedWorks(false);
    setWorkshopStep('edit');
  };

  const handleDeleteWork = (id: string) => {
    const updated = savedWorks.filter(w => w.id !== id);
    setSavedWorks(updated);
    saveLyricsToStorage(updated);
  };

  const handleExportTxt = () => {
    const text = `${songTitle || themeInput}\n${'='.repeat(30)}\n${language === 'zh' ? '风格' : 'Style'}: ${t.styles[lyricStyle]} | ${language === 'zh' ? '情绪' : 'Mood'}: ${t.moods[lyricMood]}\n\n${editingLyrics}\n\n---\nCreated with D-Music Muse AI`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle || 'lyrics'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportLrc = () => {
    const lines = editingLyrics.split('\n').filter(l => l.trim());
    let time = 0;
    const lrcLines = lines.map(line => {
      const min = Math.floor(time / 60).toString().padStart(2, '0');
      const sec = (time % 60).toFixed(2).padStart(5, '0');
      time += 3.5;
      return `[${min}:${sec}]${line}`;
    });
    const header = `[ti:${songTitle || themeInput}]\n[ar:D-Music AI]\n[by:Muse AI]\n\n`;
    const blob = new Blob([header + lrcLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${songTitle || 'lyrics'}.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Melody Playback (Web Audio API) ──

  const playMelody = useCallback(() => {
    if (isPlayingMelody) {
      stopMelody();
      return;
    }

    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AC();
    audioCtxRef.current = ctx;
    setIsPlayingMelody(true);

    const config = getMelodyConfig(lyricStyle, lyricMood);
    const beatDuration = 60 / config.bpm;
    const chordDuration = beatDuration * 4; // 4 beats per chord
    const totalDuration = chordDuration * config.chords.length * 2; // play progression twice

    const timeouts: number[] = [];

    // Play chord progression
    for (let repeat = 0; repeat < 2; repeat++) {
      config.chords.forEach((chord, ci) => {
        const startTime = ctx.currentTime + (repeat * config.chords.length + ci) * chordDuration;
        const freqs = chordFreqs[chord] || chordFreqs['C'];

        // Chord pad (sustained)
        freqs.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = lyricMood === 'dreamy' ? 'sine' : lyricMood === 'energetic' || lyricMood === 'rebellious' ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.06, startTime + 0.1);
          gain.gain.setValueAtTime(0.06, startTime + chordDuration - 0.15);
          gain.gain.linearRampToValueAtTime(0, startTime + chordDuration);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + chordDuration + 0.1);
        });

        // Melody notes (random from scale, 2 notes per beat)
        for (let beat = 0; beat < 4; beat++) {
          const noteTime = startTime + beat * beatDuration;
          for (let sub = 0; sub < 2; sub++) {
            const nt = noteTime + sub * (beatDuration / 2);
            const freq = config.scale[Math.floor(Math.random() * config.scale.length)];
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * 2, nt); // octave up for melody
            const noteDur = beatDuration / 2 * 0.8;
            gain.gain.setValueAtTime(0, nt);
            gain.gain.linearRampToValueAtTime(0.1, nt + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, nt + noteDur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(nt);
            osc.stop(nt + noteDur + 0.1);
          }
        }
      });
    }

    // Auto stop
    const stopTimeout = window.setTimeout(() => {
      stopMelody();
    }, totalDuration * 1000 + 500);
    timeouts.push(stopTimeout);
    melodyTimeoutsRef.current = timeouts;
  }, [isPlayingMelody, lyricStyle, lyricMood]);

  const stopMelody = useCallback(() => {
    setIsPlayingMelody(false);
    melodyTimeoutsRef.current.forEach(t => clearTimeout(t));
    melodyTimeoutsRef.current = [];
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  // ── Computed values ──

  const lyricsText = editingLyrics || sectionsToText(generatedSections);
  const lyricsLines = lyricsText.split('\n').filter(l => l.trim() && !l.startsWith('['));
  const lyricsChars = lyricsText.replace(/[\s\[\]]/g, '').length;
  const rhymeResult = lyricsText ? checkRhymes(lyricsText) : { total: 0, matched: 0, details: [] };
  const rhymePercent = rhymeResult.total > 0 ? Math.round((rhymeResult.matched / rhymeResult.total) * 100) : 0;
  const sentimentResult = lyricsText ? analyzeSentiment(lyricsText) : { sentiment: 'neutral' as const, score: 0.5, keywords: [] };
  const melodyConfig = getMelodyConfig(lyricStyle, lyricMood);

  const modes: { id: AIMode; label: string; icon: any }[] = [
    { id: 'chat', label: t.chatMode, icon: Sparkles },
    { id: 'workshop', label: t.workshopMode, icon: PenTool },
    { id: 'analysis', label: t.analysisMode, icon: Zap },
  ];

  const workshopSteps: { id: WorkshopStep; label: string; num: number }[] = [
    { id: 'inspire', label: t.stepInspire, num: 1 },
    { id: 'create', label: t.stepCreate, num: 2 },
    { id: 'edit', label: t.stepEdit, num: 3 },
    { id: 'compose', label: t.stepCompose, num: 4 },
    { id: 'save', label: t.stepSave, num: 5 },
  ];

  const stepIndex = workshopSteps.findIndex(s => s.id === workshopStep);

  const styleKeys = Object.keys(t.styles) as LyricStyle[];
  const moodKeys = Object.keys(t.moods) as LyricMood[];

  const [showKnowledge, setShowKnowledge] = useState(false);

  const KnowledgeBase = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 bg-gray-950/90 backdrop-blur-2xl z-50 p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-white font-bold text-xl">{language === 'zh' ? 'Muse 指令中心' : 'Muse Command Hub'}</h3>
          <p className="text-white/40 text-xs mt-1">{language === 'zh' ? '输入以下关键词即可直接唤醒功能' : 'Type these keywords to trigger features'}</p>
        </div>
        <button onClick={() => setShowKnowledge(false)} className="p-2 hover:bg-white/10 rounded-full text-white/40">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10">
        {Object.entries(FUNCTION_MAP).map(([key, info]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.02, x: 4 }}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('dm-command', { detail: { action: info.action } }));
              setShowKnowledge(false);
              onClose();
            }}
            className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-purple-500/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 font-bold text-sm tracking-tight">「{key}」</span>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-white/80 font-bold text-sm">{info.label}</p>
            <p className="text-white/40 text-xs mt-1 leading-relaxed">{info.desc}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
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
            className="absolute inset-0 bg-purple-900/30 backdrop-blur-md z-40 rounded-3xl"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[440px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl"
            role="complementary"
            aria-label={language === 'zh' ? 'AI 助手' : 'AI Assistant'}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-base">{t.title}</h3>
                  <p className="text-white/40 text-[11px] font-medium">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowKnowledge(true)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/40 transition-colors"
                  title={language === 'zh' ? '指令中心' : 'Command Hub'}
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showKnowledge && <KnowledgeBase />}
            </AnimatePresence>

            {/* Mode Tabs */}
            <div className="flex border-b border-white/5 px-2">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                    mode === m.id
                      ? 'text-purple-400 border-purple-400'
                      : 'text-white/50 border-transparent hover:text-white/70'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  {m.label}
                </button>
              ))}
            </div>

            {/* ═══ WORKSHOP MODE ═══ */}
            {mode === 'workshop' && (
              <>
                {/* Step Indicator */}
                <div className="px-3 py-2.5 border-b border-white/5 flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:h-0">
                  {workshopSteps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          if (step.id === 'inspire' || generatedSections.length > 0) {
                            setWorkshopStep(step.id);
                          }
                        }}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          workshopStep === step.id
                            ? 'bg-purple-500/25 text-purple-300 border border-purple-500/30'
                            : i <= stepIndex
                            ? 'text-white/60 hover:bg-white/5'
                            : 'text-white/25'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full text-[8px] flex items-center justify-center ${
                          workshopStep === step.id ? 'bg-purple-500 text-white' : i < stepIndex ? 'bg-white/20 text-white/70' : 'bg-white/10 text-white/30'
                        }`}>
                          {step.num}
                        </span>
                        {step.label}
                      </button>
                      {i < workshopSteps.length - 1 && (
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 ${i < stepIndex ? 'text-white/30' : 'text-white/10'}`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Saved Works Toggle */}
                <div className="px-3 pt-2 flex justify-end">
                  <button
                    onClick={() => setShowSavedWorks(!showSavedWorks)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border ${
                      showSavedWorks
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <Library className="w-3 h-3" />
                    {t.savedWorks} ({savedWorks.length})
                  </button>
                </div>

                {/* Saved Works Panel */}
                <AnimatePresence>
                  {showSavedWorks && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-b border-white/5"
                    >
                      <div className="px-3 py-2 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full space-y-1.5">
                        {savedWorks.length === 0 ? (
                          <p className="text-white/30 text-[10px] text-center py-4">{t.noSavedWorks}</p>
                        ) : (
                          savedWorks.map(work => (
                            <div key={work.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group">
                              <div className="flex-1 min-w-0">
                                <div className="text-white/80 text-[11px] font-medium truncate">{work.title}</div>
                                <div className="text-white/30 text-[9px]">
                                  {t.styles[work.style]} · {t.moods[work.mood]} · {new Date(work.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <button
                                onClick={() => handleLoadWork(work)}
                                className="p-1.5 rounded-md bg-purple-500/15 text-purple-300 hover:bg-purple-500/30 transition-all text-[9px] font-semibold"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteWork(work.id)}
                                className="p-1.5 rounded-md bg-red-500/15 text-red-300 hover:bg-red-500/30 transition-all opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Workshop Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  
                  {/* ── STEP 1: INSPIRE ── */}
                  {workshopStep === 'inspire' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {/* Song Title */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">{t.songTitle}</label>
                        <input
                          type="text"
                          value={songTitle}
                          onChange={e => setSongTitle(e.target.value)}
                          placeholder={t.titlePlaceholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/25"
                        />
                      </div>

                      {/* Theme */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">{t.theme}</label>
                        <input
                          type="text"
                          value={themeInput}
                          onChange={e => setThemeInput(e.target.value)}
                          placeholder={t.themePlaceholder}
                          onKeyDown={e => { if (e.key === 'Enter' && themeInput.trim()) handleGenerate(); }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/25"
                        />
                      </div>

                      {/* Style */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">{t.style}</label>
                        <div className="flex flex-wrap gap-1">
                          {styleKeys.map(s => (
                            <button
                              key={s}
                              onClick={() => setLyricStyle(s)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                                lyricStyle === s
                                  ? 'bg-purple-500/25 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-500/10'
                                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'
                              }`}
                            >
                              {t.styles[s]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Mood */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">{t.mood}</label>
                        <div className="flex flex-wrap gap-1">
                          {moodKeys.map(m => (
                            <button
                              key={m}
                              onClick={() => setLyricMood(m)}
                              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                                lyricMood === m
                                  ? 'bg-pink-500/25 text-pink-300 border-pink-500/30 shadow-sm shadow-pink-500/10'
                                  : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'
                              }`}
                            >
                              {t.moods[m]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Inspirations */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {t.inspirations}
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {t.inspirationHints.map((hint, i) => (
                            <button
                              key={i}
                              onClick={() => setThemeInput(hint)}
                              className="px-2 py-1 rounded-md text-[10px] bg-white/5 text-white/40 border border-white/5 hover:bg-white/10 hover:text-white/70 transition-all"
                            >
                              {hint}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGenerate}
                        disabled={!themeInput.trim()}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg shadow-purple-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      >
                        <WandSparkles className="w-4 h-4" />
                        {t.startCreating}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── STEP 2: CREATE (Generation + Preview) ── */}
                  {workshopStep === 'create' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {isGenerating ? (
                        <div className="flex flex-col items-center py-12">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                            className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-400 mb-4"
                          />
                          <p className="text-white/80 text-sm font-semibold">{t.generating}</p>
                          <p className="text-white/30 text-[10px] mt-1">{t.generatingDesc}</p>
                        </div>
                      ) : (
                        <>
                          {/* Section-by-section display */}
                          {generatedSections.map((section, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              className={`rounded-xl border overflow-hidden ${
                                section.type === 'chorus' ? 'border-pink-500/20 bg-pink-500/[0.04]' :
                                section.type === 'bridge' ? 'border-amber-500/20 bg-amber-500/[0.04]' :
                                section.type === 'intro' || section.type === 'outro' ? 'border-white/[0.06] bg-white/[0.02]' :
                                'border-white/10 bg-white/[0.03]'
                              }`}
                            >
                              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
                                <span className={`text-[10px] font-bold tracking-wide ${
                                  section.type === 'chorus' ? 'text-pink-400' :
                                  section.type === 'bridge' ? 'text-amber-400' :
                                  'text-white/50'
                                }`}>
                                  {section.label}
                                </span>
                                {section.type !== 'intro' && section.type !== 'outro' && (
                                  <button
                                    onClick={() => handleRegenerateSection(idx)}
                                    className="p-1 rounded text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                                    title={t.regenerateSection}
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <div className="px-3 py-2">
                                {section.lines.map((line, li) => (
                                  <p key={li} className={`text-[11px] leading-[1.8] ${
                                    section.type === 'intro' || section.type === 'outro' ? 'text-white/30 italic' : 'text-white/80'
                                  }`}>
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </motion.div>
                          ))}

                          {/* Stats bar */}
                          {generatedSections.length > 0 && (
                            <div className="grid grid-cols-4 gap-1.5">
                              {[
                                { label: t.chars, value: lyricsChars, color: 'text-blue-400' },
                                { label: t.lines, value: lyricsLines.length, color: 'text-green-400' },
                                { label: t.rhymeScore, value: `${rhymePercent}%`, color: 'text-amber-400' },
                                { label: t.sentimentTrend, value: sentimentResult.sentiment === 'positive' ? '🟢' : sentimentResult.sentiment === 'negative' ? '🔴' : '🟡', color: 'text-white/60' },
                              ].map(stat => (
                                <div key={stat.label} className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2 text-center">
                                  <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                                  <div className="text-white/30 text-[8px] font-medium">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleGenerate}
                              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {t.regenerate}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setWorkshopStep('edit')}
                              className="flex-1 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-purple-500/30 transition-all"
                            >
                              {t.editLyrics}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* ── STEP 3: EDIT ── */}
                  {workshopStep === 'edit' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <textarea
                        value={editingLyrics}
                        onChange={e => setEditingLyrics(e.target.value)}
                        className="w-full h-[300px] bg-white/[0.04] border border-white/10 rounded-xl px-3 py-3 text-white/85 text-[11px] leading-[2] font-mono focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.06] transition-all resize-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full"
                        spellCheck={false}
                      />

                      {/* Live stats */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2 text-center">
                          <div className="text-blue-400 text-xs font-bold">{lyricsChars}</div>
                          <div className="text-white/30 text-[8px]">{t.chars}</div>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2 text-center">
                          <div className="text-green-400 text-xs font-bold">{lyricsLines.length}</div>
                          <div className="text-white/30 text-[8px]">{t.lines}</div>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-2 text-center">
                          <div className="text-amber-400 text-xs font-bold">{rhymePercent}%</div>
                          <div className="text-white/30 text-[8px]">{t.rhymeScore}</div>
                        </div>
                      </div>

                      {/* Rhyme details (collapsible) */}
                      {rhymeResult.details.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2.5">
                          <div className="text-white/40 text-[10px] font-semibold mb-1.5 flex items-center gap-1">
                            <Music className="w-3 h-3" />
                            {t.rhymeCheck}
                          </div>
                          <div className="space-y-0.5">
                            {rhymeResult.details.map((d, i) => (
                              <div key={i} className={`text-[9px] font-mono ${d.includes('✓') ? 'text-green-400/70' : 'text-red-400/50'}`}>
                                {d}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Copy + Next */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCopy(editingLyrics, 'edit-lyrics')}
                          className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                        >
                          {copiedId === 'edit-lyrics' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                          {copiedId === 'edit-lyrics' ? t.copied : t.copy}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setWorkshopStep('compose')}
                          className="flex-1 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-purple-500/30 transition-all"
                        >
                          {t.stepCompose}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── STEP 4: COMPOSE (Melody Preview) ── */}
                  {workshopStep === 'compose' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      <div className="text-center py-2">
                        <h4 className="text-white/80 text-sm font-bold flex items-center justify-center gap-2">
                          <Volume2 className="w-4 h-4 text-purple-400" />
                          {t.melodyPreview}
                        </h4>
                        <p className="text-white/30 text-[10px] mt-0.5">
                          {language === 'zh' ? '基于风格和情绪自动生成旋律' : 'Auto-generated melody based on style & mood'}
                        </p>
                      </div>

                      {/* Melody info cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/15 rounded-xl p-3 text-center">
                          <div className="text-purple-300 text-lg font-bold">{melodyConfig.key}</div>
                          <div className="text-white/30 text-[9px] font-medium">{t.key}</div>
                        </div>
                        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/15 rounded-xl p-3 text-center">
                          <div className="text-pink-300 text-lg font-bold">{melodyConfig.bpm}</div>
                          <div className="text-white/30 text-[9px] font-medium">{t.bpm}</div>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/15 rounded-xl p-3 text-center">
                          <div className="text-amber-300 text-sm font-bold">{t.styles[lyricStyle]}</div>
                          <div className="text-white/30 text-[9px] font-medium">{t.style}</div>
                        </div>
                      </div>

                      {/* Chord progression display */}
                      <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3">
                        <div className="text-white/40 text-[10px] font-semibold mb-2 flex items-center gap-1">
                          <ListMusic className="w-3 h-3" />
                          {t.chordProgression}
                        </div>
                        <div className="flex gap-2 justify-center">
                          {melodyConfig.chords.map((chord, i) => (
                            <motion.div
                              key={i}
                              animate={isPlayingMelody ? { scale: [1, 1.1, 1], y: [0, -2, 0] } : {}}
                              transition={{ repeat: isPlayingMelody ? Infinity : 0, duration: 60 / melodyConfig.bpm * 4, delay: i * (60 / melodyConfig.bpm * 4) }}
                              className={`px-4 py-2.5 rounded-lg border text-sm font-bold ${
                                isPlayingMelody
                                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                  : 'bg-white/5 border-white/10 text-white/60'
                              } transition-all`}
                            >
                              {chord}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Play/Stop button */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={playMelody}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${
                          isPlayingMelody
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-red-600/20'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-600/20'
                        }`}
                      >
                        {isPlayingMelody ? (
                          <>
                            <Square className="w-4 h-4" />
                            {t.stopMelody}
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            {t.playMelody}
                          </>
                        )}
                      </motion.button>

                      {/* Waveform animation */}
                      {isPlayingMelody && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-0.5 h-8"
                        >
                          {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [4, 8 + Math.random() * 20, 4] }}
                              transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.5, delay: i * 0.05 }}
                              className="w-1 bg-gradient-to-t from-purple-500 to-blue-400 rounded-full"
                            />
                          ))}
                        </motion.div>
                      )}

                      {/* Next step */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { stopMelody(); setWorkshopStep('save'); }}
                        className="w-full py-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-purple-500/30 transition-all"
                      >
                        {t.stepSave}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── STEP 5: SAVE & EXPORT ── */}
                  {workshopStep === 'save' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                      {/* Title edit */}
                      <div>
                        <label className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">{t.songTitle}</label>
                        <input
                          type="text"
                          value={songTitle}
                          onChange={e => setSongTitle(e.target.value)}
                          placeholder={t.titlePlaceholder}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/25"
                        />
                      </div>

                      {/* Preview */}
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                        <pre className="text-white/60 text-[10px] leading-[1.8] whitespace-pre-wrap font-sans">{editingLyrics}</pre>
                      </div>

                      {/* Summary stats */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/15 rounded-xl p-3">
                          <div className="text-white/50 text-[9px] font-semibold mb-1">{t.lyricsStats}</div>
                          <div className="text-white/80 text-[10px] space-y-0.5">
                            <div>{lyricsChars} {t.chars} · {lyricsLines.length} {t.lines}</div>
                            <div>{generatedSections.length} {t.sections}</div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/15 rounded-xl p-3">
                          <div className="text-white/50 text-[9px] font-semibold mb-1">{t.melodyPreview}</div>
                          <div className="text-white/80 text-[10px] space-y-0.5">
                            <div>{t.key}: {melodyConfig.key} · {melodyConfig.bpm} BPM</div>
                            <div>{t.styles[lyricStyle]} · {t.moods[lyricMood]}</div>
                          </div>
                        </div>
                      </div>

                      {/* Save to library */}
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveWork}
                        className={`w-full py-3 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transition-all ${
                          saveSuccess
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-green-600/20'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-600/20'
                        }`}
                      >
                        {saveSuccess ? (
                          <><Check className="w-4 h-4" />{t.saved}</>
                        ) : (
                          <><Save className="w-4 h-4" />{t.saveToLibrary}</>
                        )}
                      </motion.button>

                      {/* Export buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExportTxt}
                          className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {t.exportTxt}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleExportLrc}
                          className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t.exportLrc}
                        </motion.button>
                      </div>

                      {/* Copy all */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCopy(editingLyrics, 'save-copy')}
                        className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all"
                      >
                        {copiedId === 'save-copy' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === 'save-copy' ? t.copied : t.copy}
                      </motion.button>

                      {/* Back to start */}
                      <button
                        onClick={() => {
                          setWorkshopStep('inspire');
                          setGeneratedSections([]);
                          setEditingLyrics('');
                          setThemeInput('');
                          setSongTitle('');
                        }}
                        className="w-full text-center text-white/30 text-[10px] font-medium hover:text-white/50 transition-colors py-1"
                      >
                        {language === 'zh' ? '开始新的创作 →' : 'Start a new creation →'}
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Workshop bottom nav */}
                {workshopStep !== 'inspire' && (
                  <div className="p-3 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => {
                        const prev = workshopSteps[stepIndex - 1];
                        if (prev) setWorkshopStep(prev.id);
                      }}
                      disabled={stepIndex <= 0}
                      className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 text-xs font-medium flex items-center justify-center gap-1 hover:bg-white/10 transition-all disabled:opacity-30"
                    >
                      {t.prevStep}
                    </button>
                    {stepIndex < workshopSteps.length - 1 && (
                      <button
                        onClick={() => {
                          const next = workshopSteps[stepIndex + 1];
                          if (next) setWorkshopStep(next.id);
                        }}
                        className="flex-1 py-2 rounded-xl bg-purple-500/15 border border-purple-500/25 text-purple-300 text-xs font-medium flex items-center justify-center gap-1 hover:bg-purple-500/25 transition-all"
                      >
                        {t.nextStep}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ═══ CHAT & ANALYSIS MODES ═══ */}
            {(mode === 'chat' || mode === 'analysis') && (
              <>
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-white/20' : 'bg-purple-500/20'
                      }`}>
                        {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <div className={`max-w-[80%] relative group ${
                        msg.role === 'user' 
                          ? 'bg-white text-purple-900 rounded-2xl rounded-tr-none shadow-lg p-3' 
                          : 'bg-white/10 text-white rounded-2xl rounded-tl-none border border-white/5 p-3'
                      }`}>
                        {msg.role === 'assistant' && msg.sentiment && (
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                            msg.sentiment === 'positive' ? 'bg-green-400' : 
                            msg.sentiment === 'negative' ? 'bg-red-400' : 'bg-yellow-400'
                          }`} />
                        )}
                        <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        {msg.role === 'assistant' && (msg.type === 'lyrics' || msg.type === 'analysis') && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="absolute top-2 right-2 p-1 rounded bg-white/10 hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3 text-white/60" />
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-purple-400" />
                      </div>
                      <div className="bg-white/10 p-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center h-10">
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-white/10 bg-purple-900/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={mode === 'analysis' ? t.analysisPlaceholder : t.placeholder}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all placeholder:text-white/30"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className={`p-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg ${
                        mode === 'analysis' 
                        ? 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/20'
                        : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/20'
                      } text-white`}
                    >
                      {mode === 'analysis' ? <Zap className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
