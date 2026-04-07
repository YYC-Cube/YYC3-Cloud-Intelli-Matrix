import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Target, CheckCircle, AlertTriangle, ChevronRight,
  Eye, Keyboard, Monitor, Smartphone, Wifi, WifiOff,
  Globe, Shield, Gauge, Timer, Zap, RefreshCw,
  Accessibility, MousePointerClick, ScanEye, FileCheck,
  Database, HardDrive, ArrowDownUp, Activity, TrendingUp,
  Languages, Palette, Volume2, Sun, Moon, Type
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
}

type TabId = 'framework' | 'accessibility' | 'performance' | 'resilience';

const TRANSLATIONS = {
  zh: {
    title: '「可用性规划方案」',
    subtitle: '「GB/T 28539 + ISO 9241 合规体系」',
    // Tabs
    framework: '「评估体系」',
    accessibility: '「无障碍」',
    performance: '「性能体验」',
    resilience: '「容灾规划」',

    // Framework tab
    isoModel: '「ISO 9241-11 三维可用性模型」',
    effectiveness: '「有效性 (Effectiveness)」',
    effectivenessDesc: '「用户能否准确、完整地完成目标任务」',
    efficiency: '「效率 (Efficiency)」',
    efficiencyDesc: '「完成任务所需的资源与时间投入」',
    satisfaction: '「满意度 (Satisfaction)」',
    satisfactionDesc: '「用户使用过程中的主观感受与态度」',
    gbStandard: '「GB/T 28539 可用性方法」',
    heuristicEval: '「启发式评估」',
    heuristicDesc: '「基于 Nielsen 十大可用性原则的专家评审」',
    userTest: '「用户测试」',
    userTestDesc: '「真实用户任务场景测试与观察」',
    cognitiveWalk: '「认知走查」',
    cognitiveWalkDesc: '「模拟新用户逐步任务完成路径」',
    abTest: '「A/B 测试」',
    abTestDesc: '「多方案对比数据驱动决策」',
    designPrinciples: '「交互设计原则」',
    consistency: '「一致性」',
    consistencyDesc: '「界面元素、操作逻辑保持一致」',
    feedback: '「可见反馈」',
    feedbackDesc: '「每次操作提供及时视觉/听觉反馈」',
    errorPrevention: '「错误预防」',
    errorPreventionDesc: '「通过设计减少用户操作失误」',
    flexibility: '「灵活性」',
    flexibilityDesc: '「适应不同用户的使用习惯与能力」',
    taskMetrics: '「任务可用性指标」',
    taskSuccess: '「任务成功率」',
    taskTime: '「平均任务完成时间」',
    errorRate: '「操作错误率」',
    learnability: '「可学习性评分」',

    // Accessibility tab
    wcagTitle: '「WCAG 2.1 合规评估」',
    perceivable: '「可感知 (Perceivable)」',
    perceivableItems: ['「文本替代方案」', '「时基媒体替代方案」', '「适应性呈现」', '「可区分内容」'],
    operable: '「可操作 (Operable)」',
    operableItems: ['「键盘可访问」', '「充足操作时间」', '「避免闪烁内容」', '「可导航性」'],
    understandable: '「可理解 (Understandable)」',
    understandableItems: ['「可读性」', '「可预测性」', '「输入辅助」'],
    robust: '「健壮性 (Robust)」',
    robustItems: ['「兼容性」', '「解析规范」', '「名称/角色/值」'],
    levelA: '「A 级 (基础)」',
    levelAA: '「AA 级 (推荐)」',
    levelAAA: '「AAA 级 (增强)」',
    a11yChecklist: '「无障碍检查清单」',
    keyboardNav: '「键盘导航」',
    keyboardNavDesc: '「所有功能支持纯键盘操作」',
    screenReader: '「屏幕阅读器」',
    screenReaderDesc: '「ARIA 标签与语义化 HTML」',
    colorContrast: '「颜色对比度」',
    colorContrastDesc: '「前景/背景对比度 ≥ 4.5:1」',
    fontScaling: '「字体缩放」',
    fontScalingDesc: '「支持 200% 字体缩放不丢失内容」',
    focusVisible: '「焦点可见」',
    focusVisibleDesc: '「交互元素聚焦时有明确视觉指示」',
    altText: '「替代文本」',
    altTextDesc: '「非文本内容提供文字说明」',
    motionReduce: '「减少动画」',
    motionReduceDesc: '「尊重 prefers-reduced-motion 偏好」',
    languageSupport: '「多语言支持」',
    languageSupportDesc: '「中英双语完整覆盖」',

    // Performance tab
    coreWebVitals: '「核心 Web 性能指标」',
    fcp: '「FCP (首次内容绘制)」',
    fcpTarget: '「目标 < 1.8s」',
    lcp: '「LCP (最大内容绘制)」',
    lcpTarget: '「目标 < 2.5s」',
    fid: '「FID (首次输入延迟)」',
    fidTarget: '「目标 < 100ms」',
    cls: '「CLS (累积布局偏移)」',
    clsTarget: '「目标 < 0.1」',
    tti: '「TTI (可交互时间)」',
    ttiTarget: '「目标 < 3.5s」',
    responseTargets: '「响应时间目标」',
    uiResponse: '「UI 交互响应」',
    uiResponseTarget: '「< 100ms」',
    pageLoad: '「页面加载」',
    pageLoadTarget: '「< 2s」',
    audioStart: '「音频开始播放」',
    audioStartTarget: '「< 500ms」',
    searchResult: '「搜索结果返回」',
    searchResultTarget: '「< 300ms」',
    crossPlatform: '「跨平台兼容性」',
    desktop: '「桌面端」',
    desktopDesc: '「Chrome/Firefox/Safari/Edge」',
    mobile: '「移动端」',
    mobileDesc: '「iOS Safari / Android Chrome」',
    pwa: '「PWA 支持」',
    pwaDesc: '「离线访问/安装到桌面」',
    responsive: '「响应式布局」',
    responsiveDesc: '「320px ~ 2560px 自适应」',
    resourceOptimize: '「资源优化策略」',
    lazyLoad: '「懒加载」',
    lazyLoadDesc: '「图片与非关键资源延迟加载」',
    codeSlplit: '「代码分割」',
    codeSlplitDesc: '「按路由/功能拆分 JS 包体积」',
    caching: '「缓存策略」',
    cachingDesc: '「Service Worker + HTTP 缓存」',
    compression: '「压缩传输」',
    compressionDesc: '「Gzip/Brotli 压缩 + 图片优化」',

    // Resilience tab
    dataStrategy: '「数据持久化策略」',
    localStorage: '「本地存储」',
    localStorageDesc: '「IndexedDB 存储播放记录与偏好」',
    cloudSync: '「云端同步」',
    cloudSyncDesc: '「Supabase KV Store 数据持久化」',
    autoSave: '「自动保存」',
    autoSaveDesc: '「操作数据实时自动保存」',
    exportImport: '「导入/导出」',
    exportImportDesc: '「支持数据的完整备份与恢复」',
    errorRecovery: '「错误恢复机制」',
    gracefulDegradation: '「优雅降级」',
    gracefulDegradationDesc: '「功能不可用时提供备选方案」',
    errorBoundary: '「错误边界」',
    errorBoundaryDesc: '「React ErrorBoundary 隔离异常」',
    retryMechanism: '「重试机制」',
    retryMechanismDesc: '「网络请求失败自动重试」',
    stateRecovery: '「状态恢复」',
    stateRecoveryDesc: '「异常退出后恢复播放状态」',
    offlinePlan: '「离线可用性方案」',
    swCache: '「Service Worker 缓存」',
    swCacheDesc: '「核心资源预缓存策略」',
    offlinePlay: '「离线播放」',
    offlinePlayDesc: '「已缓存音频的离线播放支持」',
    offlineUI: '「离线 UI」',
    offlineUIDesc: '「网络断开时显示离线状态界面」',
    syncQueue: '「同步队列」',
    syncQueueDesc: '「离线操作上线后自动同步」',
    monitorAlert: '「监控告警体系」',
    perfMonitor: '「性能监控」',
    perfMonitorDesc: '「实时性能数据采集与分析」',
    errorTracking: '「错误追踪」',
    errorTrackingDesc: '「全链路错误捕获与上报」',
    userFeedback: '「用户反馈」',
    userFeedbackDesc: '「内置反馈通道与满意度调查」',
    healthCheck: '「健康检查」',
    healthCheckDesc: '「定期系统自检与告警」',

    // Status
    implemented: '「已实现」',
    planned: '「规划中」',
    inProgress: '「开发中」',
    notStarted: '「未启动」',

    // Scores
    overallScore: '「可用性综合评分」',
    dimension: '「维度」',
    score: '「评分」',
    target: '「目标」',
    effectivenessScore: '「有效性」',
    efficiencyScore: '「效率」',
    satisfactionScore: '「满意度」',
    accessibilityScore: '「无障碍」',
    performanceScore: '「性能」',
    resilienceScore: '「容灾」',
  },
  en: {
    title: 'Usability Plan',
    subtitle: 'GB/T 28539 + ISO 9241 Compliance',
    framework: 'Framework',
    accessibility: 'A11y',
    performance: 'Performance',
    resilience: 'Resilience',

    isoModel: 'ISO 9241-11 Usability Model',
    effectiveness: 'Effectiveness',
    effectivenessDesc: 'Can users achieve goals accurately and completely',
    efficiency: 'Efficiency',
    efficiencyDesc: 'Resources and time invested to complete tasks',
    satisfaction: 'Satisfaction',
    satisfactionDesc: 'Subjective feelings and attitudes during use',
    gbStandard: 'GB/T 28539 Methods',
    heuristicEval: 'Heuristic Evaluation',
    heuristicDesc: 'Expert review based on Nielsen\'s 10 heuristics',
    userTest: 'User Testing',
    userTestDesc: 'Real user task scenario testing & observation',
    cognitiveWalk: 'Cognitive Walkthrough',
    cognitiveWalkDesc: 'Simulating new user task completion paths',
    abTest: 'A/B Testing',
    abTestDesc: 'Data-driven multi-variant comparison decisions',
    designPrinciples: 'Interaction Design Principles',
    consistency: 'Consistency',
    consistencyDesc: 'Consistent UI elements and interaction logic',
    feedback: 'Visible Feedback',
    feedbackDesc: 'Timely visual/audio feedback for every action',
    errorPrevention: 'Error Prevention',
    errorPreventionDesc: 'Design-driven reduction of user errors',
    flexibility: 'Flexibility',
    flexibilityDesc: 'Adapts to diverse user habits and abilities',
    taskMetrics: 'Task Usability Metrics',
    taskSuccess: 'Task Success Rate',
    taskTime: 'Avg Task Completion Time',
    errorRate: 'Operation Error Rate',
    learnability: 'Learnability Score',

    wcagTitle: 'WCAG 2.1 Compliance',
    perceivable: 'Perceivable',
    perceivableItems: ['Text Alternatives', 'Time-based Media', 'Adaptable Presentation', 'Distinguishable Content'],
    operable: 'Operable',
    operableItems: ['Keyboard Accessible', 'Enough Time', 'No Flash Content', 'Navigable'],
    understandable: 'Understandable',
    understandableItems: ['Readable', 'Predictable', 'Input Assistance'],
    robust: 'Robust',
    robustItems: ['Compatible', 'Parsing', 'Name/Role/Value'],
    levelA: 'Level A (Basic)',
    levelAA: 'Level AA (Recommended)',
    levelAAA: 'Level AAA (Enhanced)',
    a11yChecklist: 'Accessibility Checklist',
    keyboardNav: 'Keyboard Navigation',
    keyboardNavDesc: 'All features accessible via keyboard',
    screenReader: 'Screen Reader',
    screenReaderDesc: 'ARIA labels & semantic HTML',
    colorContrast: 'Color Contrast',
    colorContrastDesc: 'Foreground/background ratio >= 4.5:1',
    fontScaling: 'Font Scaling',
    fontScalingDesc: '200% zoom without content loss',
    focusVisible: 'Focus Visible',
    focusVisibleDesc: 'Clear visual indicator on focused elements',
    altText: 'Alt Text',
    altTextDesc: 'Text descriptions for non-text content',
    motionReduce: 'Reduce Motion',
    motionReduceDesc: 'Respects prefers-reduced-motion preference',
    languageSupport: 'Multi-language',
    languageSupportDesc: 'Full Chinese/English coverage',

    coreWebVitals: 'Core Web Vitals',
    fcp: 'FCP (First Contentful Paint)',
    fcpTarget: 'Target < 1.8s',
    lcp: 'LCP (Largest Contentful Paint)',
    lcpTarget: 'Target < 2.5s',
    fid: 'FID (First Input Delay)',
    fidTarget: 'Target < 100ms',
    cls: 'CLS (Cumulative Layout Shift)',
    clsTarget: 'Target < 0.1',
    tti: 'TTI (Time to Interactive)',
    ttiTarget: 'Target < 3.5s',
    responseTargets: 'Response Time Targets',
    uiResponse: 'UI Interaction',
    uiResponseTarget: '< 100ms',
    pageLoad: 'Page Load',
    pageLoadTarget: '< 2s',
    audioStart: 'Audio Playback Start',
    audioStartTarget: '< 500ms',
    searchResult: 'Search Results',
    searchResultTarget: '< 300ms',
    crossPlatform: 'Cross-Platform Compatibility',
    desktop: 'Desktop',
    desktopDesc: 'Chrome/Firefox/Safari/Edge',
    mobile: 'Mobile',
    mobileDesc: 'iOS Safari / Android Chrome',
    pwa: 'PWA Support',
    pwaDesc: 'Offline access / Install to desktop',
    responsive: 'Responsive Layout',
    responsiveDesc: '320px ~ 2560px adaptive',
    resourceOptimize: 'Resource Optimization',
    lazyLoad: 'Lazy Loading',
    lazyLoadDesc: 'Deferred loading for images & non-critical resources',
    codeSlplit: 'Code Splitting',
    codeSlplitDesc: 'Route/feature-based JS bundle splitting',
    caching: 'Caching Strategy',
    cachingDesc: 'Service Worker + HTTP caching',
    compression: 'Compression',
    compressionDesc: 'Gzip/Brotli + Image optimization',

    dataStrategy: 'Data Persistence Strategy',
    localStorage: 'Local Storage',
    localStorageDesc: 'IndexedDB for play records & preferences',
    cloudSync: 'Cloud Sync',
    cloudSyncDesc: 'Supabase KV Store data persistence',
    autoSave: 'Auto Save',
    autoSaveDesc: 'Real-time automatic data saving',
    exportImport: 'Import/Export',
    exportImportDesc: 'Full data backup and restore support',
    errorRecovery: 'Error Recovery Mechanisms',
    gracefulDegradation: 'Graceful Degradation',
    gracefulDegradationDesc: 'Fallback options when features unavailable',
    errorBoundary: 'Error Boundary',
    errorBoundaryDesc: 'React ErrorBoundary for exception isolation',
    retryMechanism: 'Retry Mechanism',
    retryMechanismDesc: 'Auto-retry for failed network requests',
    stateRecovery: 'State Recovery',
    stateRecoveryDesc: 'Restore playback state after crashes',
    offlinePlan: 'Offline Availability Plan',
    swCache: 'Service Worker Cache',
    swCacheDesc: 'Core resource pre-caching strategy',
    offlinePlay: 'Offline Playback',
    offlinePlayDesc: 'Cached audio offline playback support',
    offlineUI: 'Offline UI',
    offlineUIDesc: 'Offline status interface when disconnected',
    syncQueue: 'Sync Queue',
    syncQueueDesc: 'Auto-sync offline operations when online',
    monitorAlert: 'Monitoring & Alerts',
    perfMonitor: 'Perf Monitoring',
    perfMonitorDesc: 'Real-time performance data collection',
    errorTracking: 'Error Tracking',
    errorTrackingDesc: 'Full-chain error capture & reporting',
    userFeedback: 'User Feedback',
    userFeedbackDesc: 'Built-in feedback channel & satisfaction survey',
    healthCheck: 'Health Check',
    healthCheckDesc: 'Periodic system self-check & alerts',

    implemented: 'Done',
    planned: 'Planned',
    inProgress: 'In Progress',
    notStarted: 'Not Started',

    overallScore: 'Overall Usability Score',
    dimension: 'Dimension',
    score: 'Score',
    target: 'Target',
    effectivenessScore: 'Effectiveness',
    efficiencyScore: 'Efficiency',
    satisfactionScore: 'Satisfaction',
    accessibilityScore: 'Accessibility',
    performanceScore: 'Performance',
    resilienceScore: 'Resilience',
  }
};

// Status types for planning items
type PlanStatus = 'implemented' | 'inProgress' | 'planned' | 'notStarted';

function PlanStatusBadge({ status, language }: { status: PlanStatus; language: 'zh' | 'en' }) {
  const t = TRANSLATIONS[language];
  const config: Record<PlanStatus, { color: string; label: string }> = {
    implemented: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: t.implemented },
    inProgress: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: t.inProgress },
    planned: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: t.planned },
    notStarted: { color: 'bg-white/10 text-white/40 border-white/10', label: t.notStarted },
  };
  const { color, label } = config[status];
  const icons: Record<PlanStatus, React.ReactNode> = {
    implemented: <CheckCircle className="w-3 h-3" />,
    inProgress: <RefreshCw className="w-3 h-3" />,
    planned: <Target className="w-3 h-3" />,
    notStarted: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${color}`}>
      {icons[status]}
      {label}
    </span>
  );
}

function PlanItem({ label, desc, status, language }: { label: string; desc: string; status: PlanStatus; language: 'zh' | 'en' }) {
  return (
    <div className="flex items-start justify-between py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors group gap-3 border-b border-white/[0.06] last:border-b-0">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <span className="text-white/80 text-xs font-medium block">{label}</span>
          <span className="text-white/35 text-[10px] block mt-0.5 leading-relaxed">{desc}</span>
        </div>
      </div>
      <PlanStatusBadge status={status} language={language} />
    </div>
  );
}

function ScoreRing({ score, max, color, size = 48 }: { score: number; max: number; color: string; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / max) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={3} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xs font-bold">{score}</span>
      </div>
    </div>
  );
}

function WcagPrincipleCard({ title, items, level, color, icon: Icon }: {
  title: string; items: string[]; level: string; color: string; icon: any;
}) {
  return (
    <div className="bg-white/5 rounded-xl border border-white/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-white text-xs font-semibold">{title}</span>
        </div>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${color.replace('text-', 'bg-')}/15 ${color}`}>{level}</span>
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 py-0.5">
            <CheckCircle className="w-2.5 h-2.5 text-green-400/70 flex-shrink-0" />
            <span className="text-white/50 text-[10px]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PerformanceMetric({ label, target, value, unit, color }: {
  label: string; target: string; value: number; unit: string; color: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex-1">
        <span className="text-white/70 text-xs font-medium block">{label}</span>
        <span className="text-white/30 text-[10px]">{target}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${color}`}>{value}{unit}</span>
        <CheckCircle className="w-3.5 h-3.5 text-green-400/70" />
      </div>
    </div>
  );
}

export function UsabilityPlan({ isOpen, onClose, language }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('framework');
  const t = TRANSLATIONS[language];

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'framework', label: t.framework, icon: Target },
    { id: 'accessibility', label: t.accessibility, icon: Accessibility },
    { id: 'performance', label: t.performance, icon: Gauge },
    { id: 'resilience', label: t.resilience, icon: Shield },
  ];

  // Simulated usability scores
  const scores = [
    { label: t.effectivenessScore, score: 88, target: 90, color: '#a78bfa' },
    { label: t.efficiencyScore, score: 82, target: 85, color: '#60a5fa' },
    { label: t.satisfactionScore, score: 91, target: 90, color: '#f472b6' },
    { label: t.accessibilityScore, score: 72, target: 85, color: '#34d399' },
    { label: t.performanceScore, score: 85, target: 90, color: '#fbbf24' },
    { label: t.resilienceScore, score: 68, target: 80, color: '#fb923c' },
  ];
  const overallScore = Math.round(scores.reduce((s, item) => s + item.score, 0) / scores.length);

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
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '可用性方案' : 'Usability Plan'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Target className="w-5 h-5 text-white" />
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

            {/* Overall Score Summary */}
            <div className="px-4 pt-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-4">
                <ScoreRing score={overallScore} max={100} color="#a78bfa" size={56} />
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold mb-1.5">{t.overallScore}</div>
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1">
                    {scores.map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-white/40 text-[9px] truncate">{s.label}</span>
                        <span className="text-white/70 text-[9px] font-bold ml-auto">{s.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-[11px] font-medium flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-violet-400 border-violet-400'
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
              <AnimatePresence mode="wait">
                {activeTab === 'framework' && (
                  <motion.div
                    key="framework"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* ISO 9241-11 Model */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-violet-400" />
                        <span className="text-white text-sm font-semibold">{t.isoModel}</span>
                      </div>
                      <div className="p-3 space-y-3">
                        {[
                          { label: t.effectiveness, desc: t.effectivenessDesc, score: 88, color: 'from-violet-500 to-purple-500' },
                          { label: t.efficiency, desc: t.efficiencyDesc, score: 82, color: 'from-blue-500 to-cyan-500' },
                          { label: t.satisfaction, desc: t.satisfactionDesc, score: 91, color: 'from-pink-500 to-rose-500' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white/80 text-xs font-medium">{item.label}</span>
                              <span className="text-white text-xs font-bold">{item.score}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.score}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              />
                            </div>
                            <span className="text-white/30 text-[10px]">{item.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* GB/T 28539 Evaluation Methods */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.gbStandard}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.heuristicEval} desc={t.heuristicDesc} status="implemented" language={language} />
                        <PlanItem label={t.userTest} desc={t.userTestDesc} status="planned" language={language} />
                        <PlanItem label={t.cognitiveWalk} desc={t.cognitiveWalkDesc} status="planned" language={language} />
                        <PlanItem label={t.abTest} desc={t.abTestDesc} status="notStarted" language={language} />
                      </div>
                    </div>

                    {/* Design Principles */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <MousePointerClick className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.designPrinciples}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.consistency} desc={t.consistencyDesc} status="implemented" language={language} />
                        <PlanItem label={t.feedback} desc={t.feedbackDesc} status="implemented" language={language} />
                        <PlanItem label={t.errorPrevention} desc={t.errorPreventionDesc} status="inProgress" language={language} />
                        <PlanItem label={t.flexibility} desc={t.flexibilityDesc} status="inProgress" language={language} />
                      </div>
                    </div>

                    {/* Task Metrics */}
                    <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-violet-400" />
                        {t.taskMetrics}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: t.taskSuccess, value: '94.5%', color: 'text-green-400' },
                          { label: t.taskTime, value: '3.2s', color: 'text-blue-400' },
                          { label: t.errorRate, value: '2.1%', color: 'text-amber-400' },
                          { label: t.learnability, value: '87/100', color: 'text-purple-400' },
                        ].map((m) => (
                          <div key={m.label} className="bg-white/5 rounded-lg p-2.5">
                            <div className={`text-sm font-bold ${m.color}`}>{m.value}</div>
                            <div className="text-white/40 text-[9px] mt-0.5">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'accessibility' && (
                  <motion.div
                    key="accessibility"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* WCAG 2.1 Four Principles */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Accessibility className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.wcagTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        <WcagPrincipleCard title={t.perceivable} items={t.perceivableItems} level={t.levelAA} color="text-blue-400" icon={Eye} />
                        <WcagPrincipleCard title={t.operable} items={t.operableItems} level={t.levelAA} color="text-green-400" icon={Keyboard} />
                        <WcagPrincipleCard title={t.understandable} items={t.understandableItems} level={t.levelAA} color="text-amber-400" icon={ScanEye} />
                        <WcagPrincipleCard title={t.robust} items={t.robustItems} level={t.levelA} color="text-purple-400" icon={Shield} />
                      </div>
                    </div>

                    {/* Accessibility Checklist */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm font-semibold">{t.a11yChecklist}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.keyboardNav} desc={t.keyboardNavDesc} status="inProgress" language={language} />
                        <PlanItem label={t.screenReader} desc={t.screenReaderDesc} status="planned" language={language} />
                        <PlanItem label={t.colorContrast} desc={t.colorContrastDesc} status="implemented" language={language} />
                        <PlanItem label={t.fontScaling} desc={t.fontScalingDesc} status="planned" language={language} />
                        <PlanItem label={t.focusVisible} desc={t.focusVisibleDesc} status="inProgress" language={language} />
                        <PlanItem label={t.altText} desc={t.altTextDesc} status="implemented" language={language} />
                        <PlanItem label={t.motionReduce} desc={t.motionReduceDesc} status="planned" language={language} />
                        <PlanItem label={t.languageSupport} desc={t.languageSupportDesc} status="implemented" language={language} />
                      </div>
                    </div>

                    {/* Compliance Levels */}
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3">WCAG 2.1 {language === 'zh' ? '合规级别' : 'Compliance Levels'}</h4>
                      <div className="space-y-2.5">
                        {[
                          { level: t.levelA, progress: 85, color: 'from-green-500 to-emerald-500' },
                          { level: t.levelAA, progress: 62, color: 'from-blue-500 to-cyan-500' },
                          { level: t.levelAAA, progress: 35, color: 'from-purple-500 to-violet-500' },
                        ].map((l) => (
                          <div key={l.level}>
                            <div className="flex justify-between mb-1">
                              <span className="text-white/60 text-[10px] font-medium">{l.level}</span>
                              <span className="text-white/80 text-[10px] font-bold">{l.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${l.progress}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full bg-gradient-to-r ${l.color}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'performance' && (
                  <motion.div
                    key="performance"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Core Web Vitals */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.coreWebVitals}</span>
                      </div>
                      <div className="p-3">
                        <PerformanceMetric label={t.fcp} target={t.fcpTarget} value={1.2} unit="s" color="text-green-400" />
                        <PerformanceMetric label={t.lcp} target={t.lcpTarget} value={1.8} unit="s" color="text-green-400" />
                        <PerformanceMetric label={t.fid} target={t.fidTarget} value={45} unit="ms" color="text-green-400" />
                        <PerformanceMetric label={t.cls} target={t.clsTarget} value={0.05} unit="" color="text-green-400" />
                        <PerformanceMetric label={t.tti} target={t.ttiTarget} value={2.8} unit="s" color="text-green-400" />
                      </div>
                    </div>

                    {/* Response Time Targets */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Timer className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.responseTargets}</span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        {[
                          { label: t.uiResponse, target: t.uiResponseTarget, icon: Zap, color: 'text-purple-400' },
                          { label: t.pageLoad, target: t.pageLoadTarget, icon: Monitor, color: 'text-blue-400' },
                          { label: t.audioStart, target: t.audioStartTarget, icon: Volume2, color: 'text-green-400' },
                          { label: t.searchResult, target: t.searchResultTarget, icon: ScanEye, color: 'text-amber-400' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-3 py-1">
                            <item.icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0`} />
                            <span className="text-white/70 text-xs flex-1">{item.label}</span>
                            <span className={`text-xs font-bold ${item.color}`}>{item.target}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cross-Platform */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.crossPlatform}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.desktop} desc={t.desktopDesc} status="implemented" language={language} />
                        <PlanItem label={t.mobile} desc={t.mobileDesc} status="inProgress" language={language} />
                        <PlanItem label={t.pwa} desc={t.pwaDesc} status="implemented" language={language} />
                        <PlanItem label={t.responsive} desc={t.responsiveDesc} status="planned" language={language} />
                      </div>
                    </div>

                    {/* Resource Optimization */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm font-semibold">{t.resourceOptimize}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.lazyLoad} desc={t.lazyLoadDesc} status="planned" language={language} />
                        <PlanItem label={t.codeSlplit} desc={t.codeSlplitDesc} status="planned" language={language} />
                        <PlanItem label={t.caching} desc={t.cachingDesc} status="implemented" language={language} />
                        <PlanItem label={t.compression} desc={t.compressionDesc} status="planned" language={language} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resilience' && (
                  <motion.div
                    key="resilience"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Data Persistence */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Database className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.dataStrategy}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.localStorage} desc={t.localStorageDesc} status="planned" language={language} />
                        <PlanItem label={t.cloudSync} desc={t.cloudSyncDesc} status="planned" language={language} />
                        <PlanItem label={t.autoSave} desc={t.autoSaveDesc} status="inProgress" language={language} />
                        <PlanItem label={t.exportImport} desc={t.exportImportDesc} status="notStarted" language={language} />
                      </div>
                    </div>

                    {/* Error Recovery */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.errorRecovery}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.gracefulDegradation} desc={t.gracefulDegradationDesc} status="implemented" language={language} />
                        <PlanItem label={t.errorBoundary} desc={t.errorBoundaryDesc} status="planned" language={language} />
                        <PlanItem label={t.retryMechanism} desc={t.retryMechanismDesc} status="planned" language={language} />
                        <PlanItem label={t.stateRecovery} desc={t.stateRecoveryDesc} status="notStarted" language={language} />
                      </div>
                    </div>

                    {/* Offline Plan */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <WifiOff className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.offlinePlan}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.swCache} desc={t.swCacheDesc} status="implemented" language={language} />
                        <PlanItem label={t.offlinePlay} desc={t.offlinePlayDesc} status="inProgress" language={language} />
                        <PlanItem label={t.offlineUI} desc={t.offlineUIDesc} status="planned" language={language} />
                        <PlanItem label={t.syncQueue} desc={t.syncQueueDesc} status="notStarted" language={language} />
                      </div>
                    </div>

                    {/* Monitoring */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">{t.monitorAlert}</span>
                      </div>
                      <div className="p-3">
                        <PlanItem label={t.perfMonitor} desc={t.perfMonitorDesc} status="implemented" language={language} />
                        <PlanItem label={t.errorTracking} desc={t.errorTrackingDesc} status="inProgress" language={language} />
                        <PlanItem label={t.userFeedback} desc={t.userFeedbackDesc} status="planned" language={language} />
                        <PlanItem label={t.healthCheck} desc={t.healthCheckDesc} status="planned" language={language} />
                      </div>
                    </div>

                    {/* Roadmap summary */}
                    <div className="bg-gradient-to-br from-violet-500/10 to-blue-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-violet-400" />
                        {language === 'zh' ? '实施路线图' : 'Implementation Roadmap'}
                      </h4>
                      <div className="space-y-2">
                        {[
                          { phase: language === 'zh' ? 'P1 基础层' : 'P1 Foundation', items: language === 'zh' ? 'PWA缓存 + 优雅降级 + 性能监控' : 'PWA cache + Graceful degradation + Perf monitoring', color: 'text-green-400' },
                          { phase: language === 'zh' ? 'P2 增强层' : 'P2 Enhancement', items: language === 'zh' ? 'IndexedDB持久化 + 错误边界 + 无障碍基础' : 'IndexedDB persistence + Error boundary + A11y basics', color: 'text-blue-400' },
                          { phase: language === 'zh' ? 'P3 完善层' : 'P3 Completion', items: language === 'zh' ? '云端同步 + 离线播放 + WCAG AA合规' : 'Cloud sync + Offline play + WCAG AA compliance', color: 'text-purple-400' },
                          { phase: language === 'zh' ? 'P4 卓越层' : 'P4 Excellence', items: language === 'zh' ? '导入导出 + 状态恢复 + 满意度调查' : 'Import/Export + State recovery + Satisfaction survey', color: 'text-amber-400' },
                        ].map((p, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10`}>
                              <span className={`text-[9px] font-bold ${p.color}`}>{idx + 1}</span>
                            </div>
                            <div>
                              <span className={`text-xs font-semibold ${p.color}`}>{p.phase}</span>
                              <p className="text-white/40 text-[10px] leading-relaxed mt-0.5">{p.items}</p>
                            </div>
                          </div>
                        ))}
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