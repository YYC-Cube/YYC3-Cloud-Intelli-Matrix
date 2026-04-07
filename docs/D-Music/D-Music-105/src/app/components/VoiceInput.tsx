import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Search, Music, Radio, Waves, AudioLines, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  onSearchResult?: (text: string) => void;
  tracks: { id: number; title: string }[];
  onPlayTrack?: (id: number) => void;
}

type VoiceMode = 'search' | 'recognize';

const TRANSLATIONS = {
  zh: {
    title: '语音助手',
    subtitle: 'AI语音交互中心',
    voiceSearch: '语音搜索',
    voiceSearchDesc: '说出歌名、歌手搜索音乐',
    songRecognize: '听歌识曲',
    songRecognizeDesc: '哼唱或播放音乐自动识别',
    listening: '正在聆听...',
    analyzing: '分析中...',
    tapToSpeak: '点击麦克风开始',
    tapToHum: '点击开始哼唱或播放',
    noResult: '未能识别，请重试',
    searchResults: '搜索结果',
    recognizeResults: '识别结果',
    matchScore: '匹配度',
    speechNotSupported: '浏览器不支持语音识别',
    tryAgain: '再试一次',
    permissionDenied: '麦克风权限被拒绝',
    features: '支持功能',
    feat1: '自然语言搜索',
    feat1Desc: '「播放周杰伦的歌」「来首轻音乐」',
    feat2: '哼唱识别',
    feat2Desc: '哼出旋律自动匹配曲目',
    feat3: '语音命令',
    feat3Desc: '「下一首」「暂停」「音量调大」',
  },
  en: {
    title: 'Voice Assistant',
    subtitle: 'AI Voice Interaction Hub',
    voiceSearch: 'Voice Search',
    voiceSearchDesc: 'Say song name or artist to search',
    songRecognize: 'Song Recognition',
    songRecognizeDesc: 'Hum or play music to identify',
    listening: 'Listening...',
    analyzing: 'Analyzing...',
    tapToSpeak: 'Tap microphone to start',
    tapToHum: 'Tap to start humming or playing',
    noResult: 'Could not recognize, try again',
    searchResults: 'Search Results',
    recognizeResults: 'Recognition Results',
    matchScore: 'Match',
    speechNotSupported: 'Speech recognition not supported',
    tryAgain: 'Try Again',
    permissionDenied: 'Microphone permission denied',
    features: 'Features',
    feat1: 'Natural Language',
    feat1Desc: '"Play songs by Jay Chou" "Play some jazz"',
    feat2: 'Hum Recognition',
    feat2Desc: 'Hum a melody to find the song',
    feat3: 'Voice Commands',
    feat3Desc: '"Next" "Pause" "Volume up"',
  }
};

export function VoiceInput({ isOpen, onClose, language, onSearchResult, tracks, onPlayTrack }: Props) {
  const [mode, setMode] = useState<VoiceMode>('search');
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [matchedTracks, setMatchedTracks] = useState<{ id: number; title: string; score: number }[]>([]);
  const [error, setError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = TRANSLATIONS[language];

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setTranscript('');
      setMatchedTracks([]);
      setError('');
      setIsAnalyzing(false);
    }
  }, [isOpen]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_e) {}
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    cancelAnimationFrame(animRef.current);
  }, []);

  const startVoiceSearch = useCallback(async () => {
    setError('');
    setTranscript('');
    setMatchedTracks([]);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t.speechNotSupported);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      const result = event.results[0];
      const text = result[0].transcript;
      setTranscript(text);

      if (result.isFinal) {
        setIsListening(false);
        setIsAnalyzing(true);

        // Search tracks
        setTimeout(() => {
          const query = text.toLowerCase();
          const matched = tracks
            .map(track => {
              const title = track.title.toLowerCase();
              let score = 0;
              if (title.includes(query)) score = 95;
              else if (query.split('').some((c: string) => title.includes(c))) {
                const matchCount = query.split('').filter((c: string) => title.includes(c)).length;
                score = Math.min(90, Math.floor((matchCount / query.length) * 80));
              }
              return { ...track, score };
            })
            .filter(t => t.score > 20)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

          setMatchedTracks(matched);
          setIsAnalyzing(false);
          onSearchResult?.(text);
        }, 800);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError(t.permissionDenied);
      } else {
        setError(t.noResult);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    startAudioVisualization();
  }, [language, tracks, t, onSearchResult]);

  const startSongRecognition = useCallback(async () => {
    setError('');
    setTranscript('');
    setMatchedTracks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setIsListening(true);

      const AC = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      startAudioVisualization();

      // Simulate recognition after 5 seconds
      setTimeout(() => {
        stopListening();
        setIsAnalyzing(true);
        setTimeout(() => {
          // Simulate matched results from library
          const simulated = tracks.slice(0, Math.min(3, tracks.length)).map((t, i) => ({
            ...t,
            score: Math.max(60, 95 - i * 12 - Math.floor(Math.random() * 8))
          }));
          setMatchedTracks(simulated);
          setIsAnalyzing(false);
        }, 1500);
      }, 5000);
    } catch (_e) {
      setError(t.permissionDenied);
    }
  }, [tracks, t, stopListening]);

  const startAudioVisualization = useCallback(() => {
    const drawLevel = () => {
      if (analyserRef.current) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((s, v) => s + v, 0) / data.length / 255;
        setAudioLevel(avg);
      } else {
        // Simulate level when using SpeechRecognition without analyser
        setAudioLevel(0.3 + Math.random() * 0.4);
      }
      animRef.current = requestAnimationFrame(drawLevel);
    };
    drawLevel();
  }, []);

  // Waveform canvas visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isListening) return;
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
      const cy = h / 2;

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const alpha = 0.15 + audioLevel * 0.3 - layer * 0.08;
        const hue = 270 + layer * 30;
        ctx.strokeStyle = `hsla(${hue}, 80%, 70%, ${Math.max(0.05, alpha)})`;
        ctx.lineWidth = 2 - layer * 0.5;

        for (let x = 0; x < w; x++) {
          const freq = 0.02 + layer * 0.01;
          const amp = (10 + audioLevel * 25) * (1 - layer * 0.25);
          const y = cy + Math.sin(x * freq + t * 0.05 + layer * 1.5) * amp *
            Math.sin(x / w * Math.PI); // Envelope
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center glow
      const glow = ctx.createRadialGradient(w / 2, cy, 0, w / 2, cy, w * 0.3);
      glow.addColorStop(0, `rgba(168, 85, 247, ${audioLevel * 0.15})`);
      glow.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      t++;
      if (isListening) requestAnimationFrame(draw);
    };
    draw();
  }, [isListening, audioLevel]);

  const handleStart = () => {
    if (isListening) {
      stopListening();
      return;
    }
    if (mode === 'search') {
      startVoiceSearch();
    } else {
      startSongRecognition();
    }
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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-1/2 -translate-y-1/2 sm:w-[400px] max-h-[85%] bg-purple-950/30 backdrop-blur-2xl border border-white/15 z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Mic className="w-[18px] h-[18px] text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{t.title}</h3>
                  <p className="text-white/35 text-[10px]">{t.subtitle}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'search' as VoiceMode, icon: Search, label: t.voiceSearch, desc: t.voiceSearchDesc },
                { id: 'recognize' as VoiceMode, icon: Music, label: t.songRecognize, desc: t.songRecognizeDesc },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setMode(tab.id); stopListening(); setMatchedTracks([]); setTranscript(''); setError(''); }}
                  className={`flex-1 py-3 px-3 text-center transition-all border-b-2 ${
                    mode === tab.id
                      ? 'border-violet-400 bg-white/5'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 mx-auto mb-1 ${mode === tab.id ? 'text-violet-400' : 'text-white/40'}`} />
                  <div className={`text-[10px] font-bold ${mode === tab.id ? 'text-white/90' : 'text-white/40'}`}>{tab.label}</div>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">

              {/* Microphone Button */}
              <div className="flex flex-col items-center py-4">
                <div className="relative">
                  {/* Pulse rings */}
                  {isListening && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8, 1.8], opacity: [0.4, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-violet-400/50"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.2, 2.2], opacity: [0.3, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="absolute inset-0 rounded-full border-2 border-blue-400/40"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.6, 2.6], opacity: [0.2, 0, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut', delay: 0.6 }}
                        className="absolute inset-0 rounded-full border-2 border-purple-400/30"
                      />
                    </>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handleStart}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                      isListening
                        ? 'bg-gradient-to-tr from-red-500 to-pink-500 shadow-red-500/40'
                        : 'bg-gradient-to-tr from-violet-600 to-blue-500 shadow-violet-500/30 hover:shadow-violet-500/50'
                    }`}
                    style={{
                      boxShadow: isListening
                        ? `0 0 ${20 + audioLevel * 40}px rgba(239,68,68,${0.3 + audioLevel * 0.4})`
                        : undefined
                    }}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8 text-white" />
                    ) : isAnalyzing ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Mic className="w-8 h-8 text-white" />
                    )}
                  </motion.button>
                </div>

                <div className="mt-3 text-center">
                  <p className={`text-xs font-medium ${isListening ? 'text-violet-300' : isAnalyzing ? 'text-amber-300' : 'text-white/40'}`}>
                    {isListening ? t.listening : isAnalyzing ? t.analyzing : (mode === 'search' ? t.tapToSpeak : t.tapToHum)}
                  </p>
                </div>
              </div>

              {/* Waveform visualization */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 60 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.03]"
                >
                  <canvas ref={canvasRef} className="w-full h-[60px]" />
                </motion.div>
              )}

              {/* Transcript */}
              {transcript && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.05] rounded-xl border border-white/10 p-3"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Waves className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-white/50 text-[10px] font-medium">
                      {mode === 'search' ? t.voiceSearch : t.songRecognize}
                    </span>
                  </div>
                  <p className="text-white/90 text-sm font-medium">{transcript}</p>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-3"
                >
                  <p className="text-red-300/70 text-xs mb-2">{error}</p>
                  <button
                    onClick={handleStart}
                    className="text-violet-400 text-xs font-medium hover:text-violet-300 transition-colors"
                  >
                    {t.tryAgain}
                  </button>
                </motion.div>
              )}

              {/* Results */}
              {matchedTracks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
                    <AudioLines className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-white/70 text-[10px] font-semibold">
                      {mode === 'search' ? t.searchResults : t.recognizeResults}
                    </span>
                  </div>
                  <div className="p-2 space-y-1">
                    {matchedTracks.map((track, i) => (
                      <motion.button
                        key={track.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { onPlayTrack?.(track.id); onClose(); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Music className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/90 text-xs font-medium truncate">{track.title}</div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                style={{ width: `${track.score}%` }}
                              />
                            </div>
                            <span className="text-green-400 text-[9px] font-bold">{track.score}%</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Feature cards - show when idle */}
              {!isListening && !isAnalyzing && matchedTracks.length === 0 && !error && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Radio className="w-3.5 h-3.5 text-violet-400/60" />
                    <span className="text-white/30 text-[10px] font-semibold">{t.features}</span>
                  </div>
                  {[
                    { icon: Search, label: t.feat1, desc: t.feat1Desc, color: 'text-blue-400', bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/15' },
                    { icon: Music, label: t.feat2, desc: t.feat2Desc, color: 'text-purple-400', bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-500/15' },
                    { icon: AudioLines, label: t.feat3, desc: t.feat3Desc, color: 'text-green-400', bg: 'from-green-500/10 to-emerald-500/10', border: 'border-green-500/15' },
                  ].map((feat) => (
                    <motion.div
                      key={feat.label}
                      whileHover={{ scale: 1.01, x: 2 }}
                      className={`bg-gradient-to-r ${feat.bg} rounded-xl border ${feat.border} p-3 flex items-start gap-3 cursor-default`}
                    >
                      <feat.icon className={`w-4 h-4 ${feat.color} mt-0.5 flex-shrink-0`} />
                      <div>
                        <div className="text-white/80 text-[11px] font-semibold">{feat.label}</div>
                        <div className="text-white/30 text-[10px] mt-0.5">{feat.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}