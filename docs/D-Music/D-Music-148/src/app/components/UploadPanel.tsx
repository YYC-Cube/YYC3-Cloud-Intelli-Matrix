/**
 * D-Music $27 -- Media Upload Panel (batch upload, chunked progress, lyrics editor)
 *
 * Features:
 *   - Batch upload: select/drop multiple files at once
 *   - Per-file metadata editing (title, artist, album, genre, tags)
 *   - Chunked upload with real percentage progress per file
 *   - Drag-to-reorder batch queue items
 *   - Post-upload inline lyrics editor with timestamp sync
 *   - Lyrics sync back to main player via onLyricsUpdate callback
 *   - My uploads list with preview, delete, lyrics editing
 *   - i18n (zh/en)
 *
 * Supported formats:
 *   Audio: MP3, WAV, FLAC, OGG, M4A, WebM, AAC
 *   Video: MP4, WebM, MOV
 * Max file size: 10MB per file
 *
 * Edge Function body limit safety:
 *   - Single upload: files <= 500KB only (~700KB base64 + metadata < 1MB)
 *   - Chunk size: 256KB (~350KB base64 per request)
 *   - Cover: max 500KB, sent in complete step (not init)
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import {
  Upload, X, Music, Video, FileAudio, FileVideo, Trash2,
  Play, Pause, Check, Plus, Disc3, GripVertical,
  Image as ImageIcon, ChevronDown, ChevronUp, PenLine, Save,
  ListMusic, Layers, CheckCircle2, XCircle, Loader2,
} from 'lucide-react';
import { apiFetch } from '../lib/supabase';

// ==========================================
// Types
// ==========================================

interface UploadedMedia {
  id: string;
  userId: string;
  userName: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  description: string;
  mimeType: string;
  mediaType: 'audio' | 'video';
  filePath: string;
  fileSize: number;
  coverPath: string | null;
  isPublic: boolean;
  tags: string[];
  plays: number;
  likes: number;
  createdAt: number;
  signedUrl: string | null;
  coverSignedUrl: string | null;
}

interface LyricLine {
  time: number;
  text: string;
  translation: string;
  emotion: 'happy' | 'sad' | 'energetic' | 'calm' | 'neutral';
}

/** Single file in the batch queue */
interface BatchFileItem {
  id: string;
  file: File;
  title: string;
  artist: string;
  album: string;
  genre: string;
  tags: string;
  description: string;
  isPublic: boolean;
  coverFile: File | null;
  coverPreview: string | null;
  duration: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number; // 0-100
  error: string;
  result: UploadedMedia | null;
  expanded: boolean; // metadata form expanded
}

interface UploadPanelProps {
  onClose: () => void;
  userId: string;
  userName: string;
  lang: 'zh' | 'en';
  onUploadComplete?: (media: UploadedMedia) => void;
  /** Called when lyrics are saved in the editor — allows main player to sync */
  onLyricsUpdate?: (mediaId: string, lyrics: LyricLine[]) => void;
}

// ==========================================
// Constants (Edge Function body-limit safe)
// ==========================================

const ACCEPT_AUDIO = '.mp3,.wav,.flac,.ogg,.m4a,.webm,.aac';
const ACCEPT_VIDEO = '.mp4,.webm,.mov';
const ACCEPT_ALL = `${ACCEPT_AUDIO},${ACCEPT_VIDEO}`;
const ACCEPT_IMAGE = '.jpg,.jpeg,.png,.webp';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_COVER_SIZE = 500 * 1024; // 500KB (must stay small for body limits)
const CHUNK_SIZE_BYTES = 256 * 1024; // 256KB per chunk (~350KB base64, safe for Edge Functions)
const SINGLE_UPLOAD_THRESHOLD = 500 * 1024; // Files <= 500KB use single upload, rest use chunked
const MAX_BATCH = 20;

const GENRES = [
  'Electronic', 'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical',
  'Folk', 'Metal', 'Indie', 'Ambient', 'Lo-Fi', 'Synthwave', 'Other',
];

const EMOTIONS: Array<{ value: LyricLine['emotion']; label: { zh: string; en: string } }> = [
  { value: 'happy', label: { zh: '\u5FEB\u4E50', en: 'Happy' } },
  { value: 'sad', label: { zh: '\u60B2\u4F24', en: 'Sad' } },
  { value: 'energetic', label: { zh: '\u6FC0\u60C5', en: 'Energetic' } },
  { value: 'calm', label: { zh: '\u5E73\u9759', en: 'Calm' } },
  { value: 'neutral', label: { zh: '\u4E2D\u6027', en: 'Neutral' } },
];

// ==========================================
// i18n
// ==========================================

const T = {
  'upload.title': { zh: '\u4E0A\u4F20\u97F3\u4E50/\u89C6\u9891', en: 'Upload Music / Video' },
  'upload.dragDrop': { zh: '\u5C06\u6587\u4EF6\u62D6\u62FD\u5230\u8FD9\u91CC\uFF08\u652F\u6301\u6279\u91CF\uFF09', en: 'Drag & drop files here (batch supported)' },
  'upload.or': { zh: '\u6216', en: 'or' },
  'upload.browse': { zh: '\u6D4F\u89C8\u6587\u4EF6', en: 'Browse Files' },
  'upload.formats': { zh: '\u652F\u6301 MP3\u3001WAV\u3001FLAC\u3001OGG\u3001M4A\u3001MP4\u3001WebM', en: 'MP3, WAV, FLAC, OGG, M4A, MP4, WebM' },
  'upload.maxSize': { zh: '\u5355\u6587\u4EF6\u6700\u5927 10MB\uFF0C\u6279\u91CF\u6700\u591A 20 \u4E2A', en: 'Max 10MB/file, up to 20 files' },
  'upload.songTitle': { zh: '\u6807\u9898', en: 'Title' },
  'upload.artist': { zh: '\u827A\u672F\u5BB6', en: 'Artist' },
  'upload.album': { zh: '\u4E13\u8F91', en: 'Album' },
  'upload.genre': { zh: '\u6D41\u6D3E', en: 'Genre' },
  'upload.description': { zh: '\u63CF\u8FF0', en: 'Description' },
  'upload.tags': { zh: '\u6807\u7B7E\uFF08\u9017\u53F7\u5206\u9694\uFF09', en: 'Tags (comma sep.)' },
  'upload.cover': { zh: '\u5C01\u9762', en: 'Cover' },
  'upload.public': { zh: '\u516C\u5F00', en: 'Public' },
  'upload.private': { zh: '\u79C1\u5BC6', en: 'Private' },
  'upload.submit': { zh: '\u5F00\u59CB\u4E0A\u4F20', en: 'Start Upload' },
  'upload.uploading': { zh: '\u4E0A\u4F20\u4E2D', en: 'Uploading' },
  'upload.success': { zh: '\u4E0A\u4F20\u6210\u529F', en: 'Upload successful' },
  'upload.error': { zh: '\u4E0A\u4F20\u5931\u8D25', en: 'Upload failed' },
  'upload.myUploads': { zh: '\u6211\u7684\u4E0A\u4F20', en: 'My Uploads' },
  'upload.noUploads': { zh: '\u6682\u65E0\u4E0A\u4F20', en: 'No uploads yet' },
  'upload.delete': { zh: '\u5220\u9664', en: 'Delete' },
  'upload.fileTooLarge': { zh: '\u6587\u4EF6\u8FC7\u5927\uFF08\u6700\u5927 10MB\uFF09', en: 'File too large (max 10MB)' },
  'upload.invalidType': { zh: '\u4E0D\u652F\u6301\u7684\u683C\u5F0F', en: 'Unsupported format' },
  'upload.selectCover': { zh: '\u9009\u62E9\u5C01\u9762', en: 'Select Cover' },
  'upload.loading': { zh: '\u52A0\u8F7D\u4E2D...', en: 'Loading...' },
  'upload.batchQueue': { zh: '\u4E0A\u4F20\u961F\u5217', en: 'Upload Queue' },
  'upload.clearQueue': { zh: '\u6E05\u7A7A\u961F\u5217', en: 'Clear Queue' },
  'upload.removeFile': { zh: '\u79FB\u9664', en: 'Remove' },
  'upload.editMeta': { zh: '\u7F16\u8F91\u4FE1\u606F', en: 'Edit Info' },
  'upload.filesReady': { zh: '\u4E2A\u6587\u4EF6\u5C31\u7EEA', en: 'file(s) ready' },
  'upload.allDone': { zh: '\u5168\u90E8\u5B8C\u6210', en: 'All done' },
  'upload.lyrics': { zh: '\u6B4C\u8BCD\u7F16\u8F91', en: 'Lyrics Editor' },
  'upload.lyricsTab': { zh: '\u6B4C\u8BCD', en: 'Lyrics' },
  'upload.addLine': { zh: '\u6DFB\u52A0\u4E00\u884C', en: 'Add Line' },
  'upload.saveLyrics': { zh: '\u4FDD\u5B58\u6B4C\u8BCD', en: 'Save Lyrics' },
  'upload.lyricsSaved': { zh: '\u6B4C\u8BCD\u5DF2\u4FDD\u5B58', en: 'Lyrics saved' },
  'upload.lyricsTime': { zh: '\u65F6\u95F4(\u79D2)', en: 'Time(s)' },
  'upload.lyricsText': { zh: '\u6B4C\u8BCD\u6587\u672C', en: 'Lyric text' },
  'upload.lyricsTranslation': { zh: '\u7FFB\u8BD1', en: 'Translation' },
  'upload.lyricsEmotion': { zh: '\u60C5\u611F', en: 'Emotion' },
  'upload.parseLrc': { zh: '\u5BFC\u5165LRC', en: 'Import LRC' },
  'upload.noLyrics': { zh: '\u6682\u65E0\u6B4C\u8BCD\uFF0C\u70B9\u51FB\u6DFB\u52A0', en: 'No lyrics yet, click to add' },
  'upload.uploadAll': { zh: '\u5168\u90E8\u4E0A\u4F20', en: 'Upload All' },
} as const;

// ==========================================
// Utility
// ==========================================

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 100);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Read a slice of a file as base64 */
function fileSliceToBase64(file: File, start: number, end: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const blob = file.slice(start, end);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const el = file.type.startsWith('video/')
      ? document.createElement('video')
      : document.createElement('audio');
    el.preload = 'metadata';
    el.onloadedmetadata = () => {
      resolve(el.duration || 0);
      URL.revokeObjectURL(url);
    };
    el.onerror = () => {
      resolve(0);
      URL.revokeObjectURL(url);
    };
    el.src = url;
  });
}

function isValidMediaFile(file: File): boolean {
  const validTypes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/flac',
    'audio/ogg', 'audio/m4a', 'audio/webm', 'audio/aac',
    'audio/x-m4a', 'audio/mp4',
    'video/mp4', 'video/webm', 'video/quicktime',
  ];
  return validTypes.includes(file.type) || /\.(mp3|wav|flac|ogg|m4a|webm|aac|mp4|mov)$/i.test(file.name);
}

/** Parse LRC format lyrics into structured lines */
function parseLRC(lrcText: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  for (const line of lrcText.split('\n')) {
    const match = line.trim().match(regex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const ms = parseInt(match[3], 10);
      const time = minutes * 60 + seconds + ms / (match[3].length === 3 ? 1000 : 100);
      const text = match[4].trim();
      if (text) {
        lines.push({ time, text, translation: '', emotion: 'neutral' });
      }
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

// ==========================================
// Sub-component: Lyrics Editor
// ==========================================

const LyricsEditor: React.FC<{
  mediaId: string;
  mediaDuration: number;
  lang: 'zh' | 'en';
  signedUrl: string | null;
  onLyricsUpdate?: (mediaId: string, lyrics: LyricLine[]) => void;
}> = ({ mediaId, mediaDuration, lang, signedUrl, onLyricsUpdate }) => {
  const t = (key: keyof typeof T) => T[key][lang];
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingLyrics, setLoadingLyrics] = useState(true);
  const [lrcInput, setLrcInput] = useState('');
  const [showLrcImport, setShowLrcImport] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load existing lyrics
  useEffect(() => {
    (async () => {
      setLoadingLyrics(true);
      try {
        const res = await apiFetch<{ lyrics: LyricLine[] }>(`/upload/media/${mediaId}/lyrics`);
        if (res?.lyrics?.length) setLines(res.lyrics);
      } catch { /* no lyrics yet */ }
      setLoadingLyrics(false);
    })();
  }, [mediaId]);

  const addLine = () => {
    setLines(prev => [...prev, { time: currentTime, text: '', translation: '', emotion: 'neutral' }]);
    setSaved(false);
  };

  const updateLine = (index: number, field: keyof LyricLine, value: any) => {
    setLines(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setSaved(false);
  };

  const removeLine = (index: number) => {
    setLines(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const sortLines = () => {
    setLines(prev => [...prev].sort((a, b) => a.time - b.time));
  };

  const importLrc = () => {
    const parsed = parseLRC(lrcInput);
    if (parsed.length > 0) {
      setLines(prev => [...prev, ...parsed].sort((a, b) => a.time - b.time));
      setLrcInput('');
      setShowLrcImport(false);
      setSaved(false);
    }
  };

  const saveLyrics = async () => {
    setSaving(true);
    try {
      const sorted = [...lines].sort((a, b) => a.time - b.time);
      const res = await apiFetch<{ success: boolean; lyrics?: LyricLine[] }>(`/upload/media/${mediaId}/lyrics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lyrics: sorted }),
      });
      setLines(sorted);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      // Sync lyrics back to main player
      if (res?.success) {
        onLyricsUpdate?.(mediaId, sorted);
      }
    } catch (err) {
      console.error('[Lyrics] Save error:', err);
    }
    setSaving(false);
  };

  // Audio preview for time sync
  const togglePlay = () => {
    if (!audioRef.current && signedUrl) {
      audioRef.current = new Audio(signedUrl);
      audioRef.current.ontimeupdate = () => setCurrentTime(audioRef.current!.currentTime);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const stampCurrentTime = (index: number) => {
    updateLine(index, 'time', parseFloat(currentTime.toFixed(2)));
  };

  if (loadingLyrics) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Audio player bar for time sync */}
      {signedUrl && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center hover:bg-violet-500/30 transition-colors flex-shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-violet-300" /> : <Play className="w-3.5 h-3.5 text-violet-300" />}
          </button>
          <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seekTo(pct * mediaDuration);
          }}>
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-200"
              style={{ width: `${mediaDuration > 0 ? (currentTime / mediaDuration) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-white/40 font-mono w-16 text-right">{formatTime(currentTime)}</span>
        </div>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={addLine}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-500/15 text-violet-300 text-xs hover:bg-violet-500/25 transition-colors"
        >
          <Plus className="w-3 h-3" /> {t('upload.addLine')}
        </button>
        <button
          onClick={sortLines}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white/60 transition-colors"
        >
          <ListMusic className="w-3 h-3" /> {lang === 'zh' ? '\u6309\u65F6\u95F4\u6392\u5E8F' : 'Sort by time'}
        </button>
        <button
          onClick={() => setShowLrcImport(!showLrcImport)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white/60 transition-colors"
        >
          <PenLine className="w-3 h-3" /> {t('upload.parseLrc')}
        </button>
        <div className="ml-auto">
          <button
            onClick={saveLyrics}
            disabled={saving || lines.length === 0}
            className={clsx(
              'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              saved
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-500 hover:to-pink-500 disabled:opacity-30'
            )}
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saved ? t('upload.lyricsSaved') : t('upload.saveLyrics')}
          </button>
        </div>
      </div>

      {/* LRC Import */}
      <AnimatePresence>
        {showLrcImport && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
              <textarea
                value={lrcInput}
                onChange={e => setLrcInput(e.target.value)}
                rows={4}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 resize-none font-mono"
                placeholder="[00:12.34]First line of lyrics\n[00:18.56]Second line..."
              />
              <button
                onClick={importLrc}
                disabled={!lrcInput.trim()}
                className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-xs hover:bg-violet-500/30 transition-colors disabled:opacity-30"
              >
                {lang === 'zh' ? '\u5BFC\u5165' : 'Import'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lyrics Lines */}
      {lines.length === 0 ? (
        <div className="text-center py-8">
          <ListMusic className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-xs text-white/30">{t('upload.noLyrics')}</p>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              layout
              className="flex items-start gap-1.5 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] group transition-colors"
            >
              {/* Time stamp button */}
              <button
                onClick={() => stampCurrentTime(i)}
                title={lang === 'zh' ? '\u6807\u8BB0\u5F53\u524D\u65F6\u95F4' : 'Stamp current time'}
                className="flex-shrink-0 mt-0.5 w-[60px] text-[10px] font-mono text-violet-400/60 hover:text-violet-400 bg-white/[0.04] hover:bg-violet-500/10 rounded px-1 py-1 text-center transition-colors"
              >
                {formatTime(line.time)}
              </button>

              {/* Text + Translation */}
              <div className="flex-1 min-w-0 space-y-1">
                <input
                  type="text"
                  value={line.text}
                  onChange={e => updateLine(i, 'text', e.target.value)}
                  placeholder={t('upload.lyricsText')}
                  className="w-full bg-transparent text-xs text-white/80 placeholder-white/15 focus:outline-none"
                />
                <input
                  type="text"
                  value={line.translation}
                  onChange={e => updateLine(i, 'translation', e.target.value)}
                  placeholder={t('upload.lyricsTranslation')}
                  className="w-full bg-transparent text-[10px] text-white/40 placeholder-white/10 focus:outline-none"
                />
              </div>

              {/* Emotion select */}
              <select
                value={line.emotion}
                onChange={e => updateLine(i, 'emotion', e.target.value)}
                className="flex-shrink-0 w-14 bg-white/[0.04] border-none rounded text-[9px] text-white/30 focus:outline-none appearance-none px-1 py-0.5"
              >
                {EMOTIONS.map(em => (
                  <option key={em.value} value={em.value} className="bg-[#0D1235]">
                    {em.label[lang]}
                  </option>
                ))}
              </select>

              {/* Delete */}
              <button
                onClick={() => removeLine(i)}
                className="flex-shrink-0 mt-0.5 w-5 h-5 rounded text-white/10 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-white/15 text-center">
        {lines.length} {lang === 'zh' ? '\u884C\u6B4C\u8BCD' : 'line(s)'}
        {signedUrl && (lang === 'zh' ? ' | \u70B9\u51FB\u65F6\u95F4\u6233\u6807\u8BB0\u64AD\u653E\u4F4D\u7F6E' : ' | Click timestamp to stamp playback position')}
      </p>
    </div>
  );
};

// ==========================================
// Main Component
// ==========================================

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onClose,
  userId,
  userName,
  lang,
  onUploadComplete,
  onLyricsUpdate,
}) => {
  const t = (key: keyof typeof T) => T[key][lang];

  // Batch queue
  const [batchFiles, setBatchFiles] = useState<BatchFileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'list' | 'lyrics'>('upload');

  // My uploads
  const [myUploads, setMyUploads] = useState<UploadedMedia[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);

  // Lyrics editor target
  const [lyricsTarget, setLyricsTarget] = useState<UploadedMedia | null>(null);

  // Playing preview
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Abort controller for cancellation
  const abortRef = useRef(false);

  // Drag-to-reorder state (native HTML5 DnD)
  const dragItemRef = useRef<string | null>(null);
  const dragOverItemRef = useRef<string | null>(null);

  // Load user uploads on mount
  useEffect(() => {
    loadMyUploads();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMyUploads = async () => {
    setLoadingUploads(true);
    try {
      const data = await apiFetch<{ media: UploadedMedia[] }>(`/upload/media?userId=${userId}`);
      if (data?.media) {
        setMyUploads(data.media);
      }
    } catch (err) {
      console.error('[Upload] Failed to load uploads:', err);
    } finally {
      setLoadingUploads(false);
    }
  };

  // ============================================
  // Drag-to-Reorder Handlers
  // ============================================

  const handleDragStartItem = (itemId: string) => {
    dragItemRef.current = itemId;
  };

  const handleDragOverItem = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverItemRef.current = itemId;
  };

  const handleDropItem = () => {
    const fromId = dragItemRef.current;
    const toId = dragOverItemRef.current;
    dragItemRef.current = null;
    dragOverItemRef.current = null;

    if (!fromId || !toId || fromId === toId) return;

    setBatchFiles(prev => {
      const copy = [...prev];
      const fromIdx = copy.findIndex(f => f.id === fromId);
      const toIdx = copy.findIndex(f => f.id === toId);
      if (fromIdx < 0 || toIdx < 0) return prev;
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      return copy;
    });
  };

  const handleDragEndItem = () => {
    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };

  // ============================================
  // File Selection (batch)
  // ============================================

  const addFilesToQueue = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    const newItems: BatchFileItem[] = [];

    for (const file of arr) {
      if (batchFiles.length + newItems.length >= MAX_BATCH) break;
      if (file.size > MAX_FILE_SIZE) continue;
      if (!isValidMediaFile(file)) continue;

      const dur = await getAudioDuration(file);
      const name = file.name.replace(/\.[^/.]+$/, '');

      newItems.push({
        id: `batch-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        title: name,
        artist: userName || 'Unknown Artist',
        album: 'My Collection',
        genre: 'Other',
        tags: '',
        description: '',
        isPublic: true,
        coverFile: null,
        coverPreview: null,
        duration: dur,
        status: 'pending',
        progress: 0,
        error: '',
        result: null,
        expanded: arr.length === 1, // auto-expand if single file
      });
    }

    setBatchFiles(prev => [...prev, ...newItems]);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) addFilesToQueue(e.dataTransfer.files);
  };

  const removeFromQueue = (id: string) => {
    setBatchFiles(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.coverPreview) URL.revokeObjectURL(item.coverPreview);
      return prev.filter(f => f.id !== id);
    });
  };

  const updateBatchItem = (id: string, updates: Partial<BatchFileItem>) => {
    setBatchFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const clearQueue = () => {
    batchFiles.forEach(f => { if (f.coverPreview) URL.revokeObjectURL(f.coverPreview); });
    setBatchFiles([]);
  };

  // ============================================
  // Chunked Upload with Progress
  // ============================================

  /** Upload a single file using chunked upload with real progress */
  const uploadSingleFile = async (item: BatchFileItem): Promise<UploadedMedia | null> => {
    const { file } = item;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE_BYTES);

    // Prepare cover
    let coverBase64: string | undefined;
    let coverMimeType: string | undefined;
    if (item.coverFile) {
      try {
        coverBase64 = await fileToBase64(item.coverFile);
        coverMimeType = item.coverFile.type;
      } catch { /* skip cover */ }
    }

    const tags = item.tags
      .split(/[,\uFF0C]/)
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .slice(0, 10);

    // For small files (<= SINGLE_UPLOAD_THRESHOLD), use single upload for simplicity
    if (file.size <= SINGLE_UPLOAD_THRESHOLD) {
      updateBatchItem(item.id, { progress: 10, status: 'uploading' });

      const fileBase64 = await fileToBase64(file);
      updateBatchItem(item.id, { progress: 40 });

      const result = await apiFetch<{ success: boolean; media: UploadedMedia }>('/upload/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileBase64,
          mimeType: file.type || 'audio/mpeg',
          title: item.title.trim() || file.name,
          artist: item.artist.trim() || 'Unknown Artist',
          album: item.album.trim() || 'Unknown Album',
          genre: item.genre,
          duration: item.duration,
          description: item.description.trim(),
          isPublic: item.isPublic,
          tags,
          coverBase64,
          coverMimeType,
          userId,
          userName,
        }),
      });

      updateBatchItem(item.id, { progress: 100 });

      if (result?.success && result.media) {
        return result.media;
      }
      throw new Error('Upload returned no data');
    }

    // Chunked upload for larger files
    // Step 1: Initialize session (NO cover here — sent in complete step to keep body small)
    updateBatchItem(item.id, { progress: 2, status: 'uploading' });

    const initResult = await apiFetch<{ success: boolean; sessionId: string; totalChunks: number }>('/upload/chunk/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || 'audio/mpeg',
        totalChunks,
        totalSize: file.size,
        title: item.title.trim() || file.name,
        artist: item.artist.trim() || 'Unknown Artist',
        album: item.album.trim() || 'Unknown Album',
        genre: item.genre,
        duration: item.duration,
        description: item.description.trim(),
        isPublic: item.isPublic,
        tags,
        // coverBase64 intentionally NOT included here (Edge Function body limit)
        userId,
        userName,
      }),
    });

    if (!initResult?.success || !initResult.sessionId) {
      throw new Error('Failed to initialize chunked upload session');
    }

    const sessionId = initResult.sessionId;

    // Step 2: Upload chunks sequentially with progress
    for (let i = 0; i < totalChunks; i++) {
      if (abortRef.current) throw new Error('Upload cancelled');

      const start = i * CHUNK_SIZE_BYTES;
      const end = Math.min(start + CHUNK_SIZE_BYTES, file.size);
      const chunkBase64 = await fileSliceToBase64(file, start, end);

      const chunkResult = await apiFetch<{ success: boolean; progress: number }>(`/upload/chunk/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunkIndex: i, chunkBase64 }),
      });

      if (!chunkResult?.success) {
        throw new Error(`Chunk ${i + 1}/${totalChunks} upload failed`);
      }

      // Progress: 5% init + 85% chunks + 10% finalization
      const chunkProgress = 5 + Math.round(((i + 1) / totalChunks) * 85);
      updateBatchItem(item.id, { progress: chunkProgress });
    }

    // Step 3: Finalize (send cover here, deferred from init)
    updateBatchItem(item.id, { progress: 92 });

    const completeResult = await apiFetch<{ success: boolean; media: UploadedMedia }>(`/upload/chunk/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverBase64,
        coverMimeType,
      }),
    });

    updateBatchItem(item.id, { progress: 100 });

    if (completeResult?.success && completeResult.media) {
      return completeResult.media;
    }
    throw new Error('Chunked upload finalization failed');
  };

  // ============================================
  // Batch Upload Orchestrator
  // ============================================

  const startBatchUpload = async () => {
    const pending = batchFiles.filter(f => f.status === 'pending');
    if (pending.length === 0) return;

    setIsUploading(true);
    abortRef.current = false;

    for (const item of pending) {
      if (abortRef.current) break;

      updateBatchItem(item.id, { status: 'uploading', progress: 0, error: '' });

      try {
        const result = await uploadSingleFile(item);
        if (result) {
          updateBatchItem(item.id, { status: 'success', progress: 100, result });
          setMyUploads(prev => [result, ...prev]);
          onUploadComplete?.(result);
        } else {
          updateBatchItem(item.id, { status: 'error', error: 'No result returned' });
        }
      } catch (err: any) {
        console.error(`[Upload] Batch file error:`, err);
        updateBatchItem(item.id, { status: 'error', error: err?.message || 'Upload failed' });
      }
    }

    setIsUploading(false);
  };

  // ============================================
  // Delete & Preview
  // ============================================

  const handleDelete = async (mediaId: string) => {
    try {
      const result = await apiFetch<{ success: boolean }>(`/upload/media/${mediaId}`, { method: 'DELETE' });
      if (result?.success) {
        setMyUploads(prev => prev.filter(m => m.id !== mediaId));
        if (lyricsTarget?.id === mediaId) setLyricsTarget(null);
      }
    } catch (err) {
      console.error('[Upload] Delete error:', err);
    }
  };

  const togglePreview = (media: UploadedMedia) => {
    if (playingId === media.id) {
      audioPreviewRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioPreviewRef.current) audioPreviewRef.current.pause();
      if (media.signedUrl) {
        const audio = new Audio(media.signedUrl);
        audioPreviewRef.current = audio;
        audio.play().catch(() => {});
        audio.onended = () => setPlayingId(null);
        setPlayingId(media.id);
      }
    }
  };

  const openLyricsEditor = (media: UploadedMedia) => {
    setLyricsTarget(media);
    setActiveTab('lyrics');
  };

  // ============================================
  // Computed
  // ============================================

  const pendingCount = batchFiles.filter(f => f.status === 'pending').length;
  const successCount = batchFiles.filter(f => f.status === 'success').length;
  const errorCount = batchFiles.filter(f => f.status === 'error').length;
  const totalProgress = batchFiles.length > 0
    ? Math.round(batchFiles.reduce((sum, f) => sum + f.progress, 0) / batchFiles.length)
    : 0;

  // ==========================================
  // Render
  // ==========================================

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#0D1235]/95 backdrop-blur-xl border-l border-white/[0.08] z-50 flex flex-col shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <Upload className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-bold text-white">{t('upload.title')}</h2>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06]">
        {(['upload', 'list', 'lyrics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'flex-1 py-3 text-xs font-medium transition-colors relative',
              activeTab === tab ? 'text-violet-400' : 'text-white/40 hover:text-white/60'
            )}
          >
            {tab === 'upload' && <><Layers className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />{t('upload.title')}</>}
            {tab === 'list' && <><Disc3 className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />{t('upload.myUploads')} ({myUploads.length})</>}
            {tab === 'lyrics' && <><PenLine className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />{t('upload.lyricsTab')}</>}
            {activeTab === tab && (
              <motion.div layoutId="upload-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* =================== UPLOAD TAB =================== */}
        {activeTab === 'upload' && (
          <div className="p-4 space-y-3">
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200',
                isDragging
                  ? 'border-violet-400 bg-violet-500/10 scale-[1.02]'
                  : 'border-white/[0.12] hover:border-white/[0.2] bg-white/[0.02] hover:bg-white/[0.04]'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPT_ALL}
                multiple
                onChange={e => e.target.files && addFilesToQueue(e.target.files)}
                className="hidden"
              />
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-white/[0.04] flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white/30" />
                </div>
                <p className="text-sm text-white/60">{t('upload.dragDrop')}</p>
                <p className="text-xs text-white/30">
                  {t('upload.or')} <span className="text-violet-400 underline">{t('upload.browse')}</span>
                </p>
                <p className="text-[10px] text-white/20">{t('upload.formats')}</p>
                <p className="text-[10px] text-white/20">{t('upload.maxSize')}</p>
              </div>
            </div>

            {/* Batch Queue */}
            {batchFiles.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                {/* Queue header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    {batchFiles.length} {t('upload.filesReady')}
                    {successCount > 0 && <span className="text-emerald-400 ml-2">{successCount} <Check className="w-3 h-3 inline -mt-0.5" /></span>}
                    {errorCount > 0 && <span className="text-red-400 ml-2">{errorCount} <XCircle className="w-3 h-3 inline -mt-0.5" /></span>}
                  </span>
                  <button
                    onClick={clearQueue}
                    disabled={isUploading}
                    className="text-[10px] text-white/30 hover:text-red-400 transition-colors disabled:opacity-30"
                  >
                    {t('upload.clearQueue')}
                  </button>
                </div>

                {/* Overall progress */}
                {isUploading && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/40">{t('upload.uploading')}...</span>
                      <span className="text-violet-400 font-mono">{totalProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
                        animate={{ width: `${totalProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                {/* File items (draggable) */}
                <div className="space-y-1.5 max-h-[40vh] overflow-y-auto pr-1">
                  {batchFiles.map(item => (
                    <BatchFileCard
                      key={item.id}
                      item={item}
                      lang={lang}
                      isUploading={isUploading}
                      onRemove={() => removeFromQueue(item.id)}
                      onUpdate={(updates) => updateBatchItem(item.id, updates)}
                      onOpenLyrics={() => {
                        if (item.result) openLyricsEditor(item.result);
                      }}
                      onDragStart={() => handleDragStartItem(item.id)}
                      onDragOver={(e) => handleDragOverItem(e, item.id)}
                      onDrop={handleDropItem}
                      onDragEnd={handleDragEndItem}
                      canDrag={item.status === 'pending' && !isUploading}
                    />
                  ))}
                </div>

                {/* Upload All button */}
                <button
                  onClick={startBatchUpload}
                  disabled={pendingCount === 0 || isUploading}
                  className={clsx(
                    'w-full py-3 rounded-xl text-sm font-bold transition-all',
                    isUploading
                      ? 'bg-white/[0.06] text-white/30 cursor-wait'
                      : pendingCount === 0
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-500 hover:to-pink-500 active:scale-[0.98]'
                  )}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('upload.uploading')} ({totalProgress}%)
                    </span>
                  ) : pendingCount === 0 && batchFiles.length > 0 ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      {t('upload.allDone')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" />
                      {t('upload.uploadAll')} ({pendingCount})
                    </span>
                  )}
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* =================== LIST TAB =================== */}
        {activeTab === 'list' && (
          <div className="p-4">
            {loadingUploads ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                <span className="ml-3 text-sm text-white/40">{t('upload.loading')}</span>
              </div>
            ) : myUploads.length === 0 ? (
              <div className="text-center py-12">
                <Music className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">{t('upload.noUploads')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myUploads.map(media => (
                  <motion.div
                    key={media.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="group flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all"
                  >
                    {/* Cover / Type Icon */}
                    <div className="w-11 h-11 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                      {media.coverSignedUrl ? (
                        <img src={media.coverSignedUrl} alt="" className="w-full h-full object-cover" />
                      ) : media.mediaType === 'video' ? (
                        <Video className="w-4 h-4 text-violet-400/40" />
                      ) : (
                        <Music className="w-4 h-4 text-violet-400/40" />
                      )}
                      {media.signedUrl && media.mediaType === 'audio' && (
                        <button
                          onClick={() => togglePreview(media)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        >
                          {playingId === media.id ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                        </button>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/90 font-medium truncate">{media.title}</p>
                      <p className="text-xs text-white/40 truncate">{media.artist}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-white/20">
                        <span>{formatFileSize(media.fileSize)}</span>
                        {media.duration > 0 && <span>{formatDuration(media.duration)}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {media.mediaType === 'audio' && (
                        <button
                          onClick={() => openLyricsEditor(media)}
                          className="w-7 h-7 rounded-full bg-white/[0.04] text-white/30 hover:bg-violet-500/10 hover:text-violet-400 flex items-center justify-center transition-all"
                          title={t('upload.lyrics')}
                        >
                          <PenLine className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(media.id)}
                        className="w-7 h-7 rounded-full bg-white/[0.04] text-white/20 hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center transition-all"
                        title={t('upload.delete')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================== LYRICS TAB =================== */}
        {activeTab === 'lyrics' && (
          <div className="p-4">
            {lyricsTarget ? (
              <div className="space-y-3">
                {/* Target info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/90 font-medium truncate">{lyricsTarget.title}</p>
                    <p className="text-xs text-white/40">{lyricsTarget.artist} &middot; {formatDuration(lyricsTarget.duration)}</p>
                  </div>
                  <button
                    onClick={() => setLyricsTarget(null)}
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <LyricsEditor
                  mediaId={lyricsTarget.id}
                  mediaDuration={lyricsTarget.duration}
                  lang={lang}
                  signedUrl={lyricsTarget.signedUrl}
                  onLyricsUpdate={onLyricsUpdate}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <PenLine className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-sm text-white/30">
                  {lang === 'zh' ? '\u4ECE"\u6211\u7684\u4E0A\u4F20"\u4E2D\u9009\u62E9\u4E00\u9996\u6B4C\u6765\u7F16\u8F91\u6B4C\u8BCD' : 'Select a song from "My Uploads" to edit lyrics'}
                </p>
                <button
                  onClick={() => setActiveTab('list')}
                  className="mt-3 text-xs text-violet-400 hover:text-violet-300 underline transition-colors"
                >
                  {t('upload.myUploads')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ==========================================
// Sub-component: Batch File Card (draggable)
// ==========================================

const BatchFileCard: React.FC<{
  item: BatchFileItem;
  lang: 'zh' | 'en';
  isUploading: boolean;
  onRemove: () => void;
  onUpdate: (updates: Partial<BatchFileItem>) => void;
  onOpenLyrics: () => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  canDrag: boolean;
}> = ({ item, lang, isUploading, onRemove, onUpdate, onOpenLyrics, onDragStart, onDragOver, onDrop, onDragEnd, canDrag }) => {
  const t = (key: keyof typeof T) => T[key][lang];
  const coverInputRef = useRef<HTMLInputElement>(null);

  const isAudio = !item.file.type.startsWith('video/');
  const statusIcon = item.status === 'success'
    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    : item.status === 'error'
      ? <XCircle className="w-4 h-4 text-red-400" />
      : item.status === 'uploading'
        ? <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
        : isAudio
          ? <FileAudio className="w-4 h-4 text-white/30" />
          : <FileVideo className="w-4 h-4 text-white/30" />;

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.size > MAX_COVER_SIZE) return;
    onUpdate({ coverFile: f, coverPreview: URL.createObjectURL(f) });
  };

  return (
    <motion.div
      layout
      draggable={canDrag}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={clsx(
        'rounded-xl bg-white/[0.02] border border-white/[0.05] overflow-hidden',
        canDrag && 'cursor-grab active:cursor-grabbing'
      )}
    >
      {/* Summary row */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        {/* Drag handle */}
        {canDrag && (
          <div className="flex-shrink-0 text-white/15 hover:text-white/30 transition-colors">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Status icon */}
        <div className="flex-shrink-0">{statusIcon}</div>

        {/* File name + size */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 font-medium truncate">{item.title || item.file.name}</p>
          <div className="flex items-center gap-2 text-[10px] text-white/30">
            <span>{formatFileSize(item.file.size)}</span>
            {item.duration > 0 && <span>{formatDuration(item.duration)}</span>}
            {item.status === 'uploading' && <span className="text-violet-400 font-mono">{item.progress}%</span>}
          </div>
        </div>

        {/* Actions */}
        {item.status === 'pending' && !isUploading && (
          <>
            <button
              onClick={() => onUpdate({ expanded: !item.expanded })}
              className="w-6 h-6 rounded text-white/20 hover:text-white/50 flex items-center justify-center transition-colors"
            >
              {item.expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onRemove}
              className="w-6 h-6 rounded text-white/20 hover:text-red-400 flex items-center justify-center transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {item.status === 'success' && isAudio && (
          <button
            onClick={onOpenLyrics}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-violet-400/60 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
            title={lang === 'zh' ? '\u7F16\u8F91\u6B4C\u8BCD' : 'Edit lyrics'}
          >
            <PenLine className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      {item.status === 'uploading' && (
        <div className="px-3 pb-2">
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"
              animate={{ width: `${item.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Error message */}
      {item.status === 'error' && item.error && (
        <div className="px-3 pb-2">
          <p className="text-[10px] text-red-400/70 truncate">{item.error}</p>
        </div>
      )}

      {/* Expanded metadata form */}
      <AnimatePresence>
        {item.expanded && item.status === 'pending' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04] pt-2">
              {/* Title */}
              <input
                type="text"
                value={item.title}
                onChange={e => onUpdate({ title: e.target.value })}
                maxLength={200}
                placeholder={t('upload.songTitle')}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 transition-colors"
              />

              {/* Artist + Album */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.artist}
                  onChange={e => onUpdate({ artist: e.target.value })}
                  maxLength={100}
                  placeholder={t('upload.artist')}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 transition-colors"
                />
                <input
                  type="text"
                  value={item.album}
                  onChange={e => onUpdate({ album: e.target.value })}
                  maxLength={200}
                  placeholder={t('upload.album')}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 transition-colors"
                />
              </div>

              {/* Genre + Tags */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={item.genre}
                  onChange={e => onUpdate({ genre: e.target.value })}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-violet-400/40 transition-colors appearance-none"
                >
                  {GENRES.map(g => (
                    <option key={g} value={g} className="bg-[#0D1235] text-white">{g}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={item.tags}
                  onChange={e => onUpdate({ tags: e.target.value })}
                  placeholder={t('upload.tags')}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-violet-400/40 transition-colors"
                />
              </div>

              {/* Cover + Public toggle */}
              <div className="flex items-center gap-3">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept={ACCEPT_IMAGE}
                  onChange={handleCoverSelect}
                  className="hidden"
                />
                {item.coverPreview ? (
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <img src={item.coverPreview} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        if (item.coverPreview) URL.revokeObjectURL(item.coverPreview);
                        onUpdate({ coverFile: null, coverPreview: null });
                      }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center"
                    >
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    className="w-10 h-10 rounded border border-dashed border-white/[0.12] flex items-center justify-center hover:border-white/[0.2] transition-colors flex-shrink-0"
                  >
                    <ImageIcon className="w-4 h-4 text-white/15" />
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate({ isPublic: true })}
                    className={clsx(
                      'px-2 py-1 rounded-full text-[10px] font-medium transition-all',
                      item.isPublic ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30' : 'bg-white/[0.04] text-white/30'
                    )}
                  >
                    {t('upload.public')}
                  </button>
                  <button
                    onClick={() => onUpdate({ isPublic: false })}
                    className={clsx(
                      'px-2 py-1 rounded-full text-[10px] font-medium transition-all',
                      !item.isPublic ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' : 'bg-white/[0.04] text-white/30'
                    )}
                  >
                    {t('upload.private')}
                  </button>
                </div>

                {item.coverFile && (
                  <span className="text-[9px] text-white/20 ml-auto">
                    {formatFileSize(item.coverFile.size)}
                    {item.coverFile.size > MAX_COVER_SIZE && (
                      <span className="text-red-400 ml-1">({lang === 'zh' ? '\u8FC7\u5927' : 'too big'})</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
