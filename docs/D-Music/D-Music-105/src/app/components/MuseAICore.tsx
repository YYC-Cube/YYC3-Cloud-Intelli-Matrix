import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, X, Send, Bot, Wand2, Music2, Mic2, FileMusic, 
  MonitorPlay, Zap, LayoutGrid, Search, ChevronRight,
  MessageSquare, Brain, Terminal, Command, Maximize2,
  Mic, Headset, History, Star, Power, Settings, Cpu,
  Activity, ShieldCheck, Globe, Volume2, PlayCircle,
  PauseCircle, SkipForward, SkipBack, ListMusic, Layers,
  HelpCircle, Info
} from 'lucide-react';
import dmLogoChrome from "figma:asset/f2b2841ba62d4df9e84f3d8b59fa48efd0972022.png";

interface MuseAICoreProps {
  language?: 'zh' | 'en';
}

const COMMAND_DICTIONARY: Record<string, { label: string, action: string, icon: any, desc?: string }> = {
  '「创作工坊」': { label: '「AI 创作」', action: 'open-creator', icon: Sparkles, desc: '「激发无限音乐灵感」' },
  '「时空喊话」': { label: '「时空喊话」', action: 'open-spacetime', icon: MessageSquare, desc: '「跨越时空的音频留言」' },
  '「统计分析」': { label: '「统计分析」', action: 'open-analytics', icon: Brain, desc: '「数据可视化洞察」' },
  '「规范中心」': { label: '「规范中心」', action: 'open-standards', icon: Terminal, desc: '「系统质量监控」' },
  '「沉浸模式」': { label: '「沉浸模式」', action: 'mode-immersive', icon: Maximize2, desc: '「极致视觉享受」' },
  '「迷你模式」': { label: '「迷你模式」', action: 'mode-mini', icon: Command, desc: '「极简胶囊形态」' },
  '「管理模式」': { label: '「管理模式」', action: 'mode-full', icon: LayoutGrid, desc: '「全面管理控制」' },
  '「主题定制」': { label: '「主题定制」', action: 'open-theme', icon: Layers, desc: '「个性化皮肤切换」' },
  '「播放」': { label: '「播放音乐」', action: 'player-play', icon: PlayCircle, desc: '「开始播放当前曲目」' },
  '「暂停」': { label: '「暂停」', action: 'player-pause', icon: PauseCircle, desc: '「停止当前播放」' },
  '「切歌」': { label: '「下一首」', action: 'player-next', icon: SkipForward, desc: '「切换至下一首曲目」' },
  '「上首」': { label: '「上一首」', action: 'player-prev', icon: SkipBack, desc: '「返回上一首曲目」' },
  '「帮助」': { label: '「帮助中心」', action: 'open-help', icon: HelpCircle, desc: '「获取系统操作指南」' },
  '「关于」': { label: '「关于系统」', action: 'open-about', icon: Info, desc: '「软件版本与开发信息」' },
  '「搜索」': { label: '「深度检索」', action: 'open-deepsearch', icon: Search, desc: '「智能多维深度搜索」' },
  '「星力」': { label: '「星力排行榜」', action: 'open-starpower', icon: Star, desc: '「威尔逊评分排行榜」' },
  '「快捷键」': { label: '「快捷键」', action: 'open-hotkeys', icon: Command, desc: '「查看键盘快捷键」' },
};

export function MuseAICore({ language = 'zh' }: MuseAICoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'commands' | 'system'>('chat');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = {
    zh: {
      placeholder: '「输入指令或关键词控制系统...」',
      welcome: '「『Muse AI』控制核心已就绪，请输入关键词指令。」',
      thinkPrompt: '「Muse 正在深度思考中...」',
      hotKeys: '「热门指令」',
      tabs: { chat: '「控制台」', commands: '「指令集」', system: '「核心」' }
    },
    en: {
      placeholder: 'Enter command or keyword...',
      welcome: '「Muse AI」Control Core ready. Please enter commands.',
      thinkPrompt: 'Muse is thinking deeply...',
      hotKeys: 'Hot Commands',
      tabs: { chat: 'Console', commands: 'Commands', system: 'Core' }
    }
  }[language];

  // Handle global shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    setIsThinking(true);
    setChatHistory(prev => [...prev, { role: 'user', content: cmd }]);
    
    // Simulate thinking
    setTimeout(() => {
      let foundAction = false;
      for (const [key, info] of Object.entries(COMMAND_DICTIONARY)) {
        const cleanKey = key.replace(/[「」]/g, '');
        if (cmd.includes(cleanKey)) {
          window.dispatchEvent(new CustomEvent('dm-command', { detail: { action: info.action } }));
          setChatHistory(prev => [...prev, { 
            role: 'bot', 
            content: `「已成功执行『${info.label.replace(/[「」]/g, '')}』控制指令。🚀」`,
            action: info.action 
          }]);
          foundAction = true;
          break;
        }
      }

      if (!foundAction) {
        if (cmd.includes('帮助') || cmd.includes('指令')) {
            setActiveTab('commands');
            setChatHistory(prev => [...prev, { role: 'bot', content: '「已为您打开『指令集』面板，您可以查看所有可用的全局控制指令。」' }]);
        } else {
            setChatHistory(prev => [...prev, { 
              role: 'bot', 
              content: '「未找到匹配的精确指令。您可以尝试输入『创作工坊』、『沉浸模式』或『切歌』。」' 
            }]);
        }
      }
      
      setIsThinking(false);
      setInputValue('');
    }, 600);
  };

  const SystemStatus = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: '「神经网络」', value: 'ACTIVE', color: 'text-emerald-400', icon: Cpu },
          { label: '「系统延迟」', value: '14ms', color: 'text-blue-400', icon: Activity },
          { label: '「同步状态」', value: 'SECURE', color: 'text-purple-400', icon: ShieldCheck },
          { label: '「云端链路」', value: 'GLOBAL', color: 'text-amber-400', icon: Globe },
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <item.icon size={14} className="text-white/20" />
              <div className={`text-[10px] font-bold ${item.color}`}>{item.value}</div>
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">{item.label}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-4">
        <div className="flex items-center gap-3 mb-3">
            <Settings size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-white/80">「核心参数调节」</span>
        </div>
        <div className="space-y-4">
            {[
                { label: '「思维深度」', value: 85 },
                { label: '「响应频率」', value: 92 },
            ].map((s, i) => (
                <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/40">
                        <span>{s.label}</span>
                        <span>{s.value}%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${s.value}%` }}
                            className="h-full bg-purple-500" 
                        />
                    </div>
                </div>
            ))}
        </div>
      </div>

      <button className="w-full h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all">
        <Power size={14} /> 「重置控制核心」
      </button>
    </div>
  );

  return (
    <>
      {/* Top-Level Floating Core Trigger */}
      <motion.button
        layoutId="muse-core"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="Muse AI (⌘K)"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed top-5 right-5 z-[999] w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/90 via-violet-600/80 to-indigo-700/90 shadow-[0_0_30px_rgba(139,92,246,0.25)] flex items-center justify-center border border-white/15 overflow-hidden group backdrop-blur-md"
      >
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <Sparkles className="text-white w-5 h-5" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-[-6px] border border-white/[0.08] rounded-xl border-dashed"
          />
        </div>
        
        <div className="absolute -bottom-0.5 -right-0.5 bg-[#0a0816]/90 backdrop-blur-md px-1 py-0.5 rounded text-[7px] text-white/50 font-mono opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
          ⌘K
        </div>
      </motion.button>

      {/* Expanded Control Core */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[990]"
            />
            <motion.div
              layoutId="muse-core"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="fixed top-4 md:top-24 left-3 right-3 md:left-auto md:right-6 md:w-[400px] max-h-[85vh] md:max-h-[80vh] bg-[#0c0c14]/95 backdrop-blur-3xl border border-white/10 rounded-[28px] md:rounded-[40px] z-[1000] flex flex-col shadow-[0_40px_80px_rgba(0,0,0,0.8)] overflow-hidden safe-top"
              role="dialog" aria-modal="true" aria-label="Muse AI"
            >
              {/* Header */}
              <div className="p-8 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-purple-500/20">
                    <img src={dmLogoChrome} alt="Muse AI" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-xl leading-tight tracking-tight">Muse AI</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Control Core v4.8</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex px-8 pt-4 gap-8 border-b border-white/5">
                {(['chat', 'commands', 'system'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/50'}`}
                  >
                    {t.tabs[tab]}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto min-h-[400px] max-h-[550px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                {activeTab === 'chat' && (
                  <div className="p-8 space-y-8">
                    {/* Welcome Bubble */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Star className="text-amber-400 w-5 h-5" />
                      </div>
                      <div className="bg-white/5 border border-white/5 rounded-3xl rounded-tl-none p-5 text-white/80 text-sm leading-relaxed shadow-sm">
                        {t.welcome}
                      </div>
                    </div>

                    {/* History */}
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-500/20 border border-indigo-500/30' : 'bg-white/5 border border-white/10'}`}>
                          {msg.role === 'user' ? <Command size={16} className="text-indigo-400" /> : <Bot size={16} className="text-purple-400" />}
                        </div>
                        <div className={`max-w-[80%] p-5 text-sm leading-relaxed rounded-3xl ${msg.role === 'user' ? 'bg-indigo-600/20 border border-indigo-500/20 text-indigo-50 text-right rounded-tr-none' : 'bg-white/5 border border-white/5 text-white/90 rounded-tl-none shadow-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {isThinking && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-spin">
                          <Sparkles size={16} className="text-purple-400" />
                        </div>
                        <div className="text-white/30 text-xs italic flex items-center gap-2">
                          {t.thinkPrompt}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'commands' && (
                  <div className="p-6 space-y-8">
                    <section>
                        <h4 className="px-2 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">「创作模块指令」</h4>
                        <div className="grid grid-cols-4 gap-4 px-2">
                          {[
                            { id: 'minimalist', name: '「写歌」', icon: Wand2, color: 'text-blue-400' },
                            { id: 'master', name: '「大师」', icon: Sparkles, color: 'text-purple-400' },
                            { id: 'cover', name: '「翻唱」', icon: Mic2, color: 'text-orange-400' },
                            { id: 'remix', name: '「改编」', icon: FileMusic, color: 'text-pink-400' },
                          ].map(item => (
                            <button
                              key={item.id}
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('dm-command', { detail: { action: 'open-creator' } }));
                                setIsOpen(false);
                              }}
                              className="flex flex-col items-center gap-2 group p-3 rounded-2xl hover:bg-white/5 transition-all"
                            >
                              <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:bg-white/10 transition-all`}>
                                <item.icon size={24} />
                              </div>
                              <span className="text-[10px] text-white/40 group-hover:text-white transition-colors font-bold tracking-widest">{item.name}</span>
                            </button>
                          ))}
                        </div>
                    </section>
                    
                    <section>
                        <h4 className="px-2 text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-4">「系统控制中心」</h4>
                        <div className="space-y-3 px-2">
                          {Object.entries(COMMAND_DICTIONARY).map(([key, info]) => (
                            <button
                              key={key}
                              onClick={() => handleCommand(key)}
                              className="w-full flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-purple-500/20 transition-all">
                                  <info.icon size={20} />
                                </div>
                                <div className="text-left">
                                  <div className="text-sm font-black text-white/80 group-hover:text-white transition-colors tracking-tight">「{key}」</div>
                                  <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">{info.desc}</div>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-white/10 group-hover:text-white/40 transition-all group-hover:translate-x-1" />
                            </button>
                          ))}
                        </div>
                    </section>
                  </div>
                )}

                {activeTab === 'system' && <SystemStatus />}
              </div>

              {/* Bottom Input Console */}
              <div className="p-8 border-t border-white/5 bg-black/40">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleCommand(inputValue); }}
                  className="relative group"
                >
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-purple-400 transition-colors" size={20} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] pl-14 pr-16 text-white text-sm font-medium focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.1] transition-all placeholder:text-white/20"
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isThinking}
                    className="absolute right-3 top-3 w-10 h-10 rounded-[14px] bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                  >
                    <Send size={18} />
                  </button>
                </form>
                <div className="mt-5 flex items-center justify-between px-2 text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    Neural Link Active
                  </div>
                  <div className="flex gap-4">
                    <span>Latency: 12ms</span>
                    <span>Node: Local-Core-X</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}