import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Shield, Activity, CheckCircle, AlertTriangle, 
  Clock, Server, Lock, FileCheck, ChartPie, 
  Zap, Eye, RefreshCw, ChevronRight, Languages
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
  systemMetrics: SystemMetrics;
}

export interface SystemMetrics {
  uptime: number; // percentage
  apiResponseTime: number; // ms
  activeErrors: number;
  totalRequests: number;
  cacheHitRate: number;
  memoryUsage: number;
  contentQualityScore: number;
  securityScore: number;
}

const defaultMetrics: SystemMetrics = {
  uptime: 99.95,
  apiResponseTime: 87,
  activeErrors: 0,
  totalRequests: 12847,
  cacheHitRate: 94.2,
  memoryUsage: 62,
  contentQualityScore: 92,
  securityScore: 96
};

type TabId = 'management' | 'content' | 'quality';

const TRANSLATIONS = {
  zh: {
    title: '「规范化管理中心」',
    subtitle: '「系统规范与质量监控」',
    management: '「管理制度」',
    content: '「内容管理」',
    quality: '「服务质量」',
    // Management tab
    devManagement: '「开发管理规范」',
    gitWorkflow: '「Git工作流」',
    codeReview: '「代码审查制度」',
    versionRelease: '「版本发布规范」',
    opsManagement: '「运营管理规范」',
    contentOps: '「内容运营流程」',
    userOps: '「用户运营策略」',
    activityOps: '「活动运营标准」',
    securityManagement: '「安全管理规范」',
    securityDev: '「安全开发规范」',
    dataSecurity: '「数据安全管理」',
    emergencyResponse: '「应急响应预案」',
    // Content tab
    musicContent: '「音乐内容规范」',
    uploadStandard: '「音乐上传标准」',
    copyrightReview: '「版权审核流程」',
    classification: '「内容分类体系」',
    ugcContent: '「用户生成内容规范」',
    messageReview: '「留言审核标准」',
    communityRules: '「社区管理规则」',
    violationProcess: '「违规处理流程」',
    metadataStandard: '「元数据规范」',
    infoFilling: '「信息填写标准」',
    qualityControl: '「数据质量控制」',
    updateMechanism: '「数据更新机制」',
    // Quality tab
    sla: '「服务等级协议 (SLA)」',
    availability: '「系统可用性」',
    responseTime: '「API响应时间」',
    customerService: '「客户服务规范」',
    feedbackProcess: '「反馈处理流程」',
    resolutionTime: '「问题解决时限」',
    qualityAssess: '「服务质量评估」',
    perfMonitor: '「性能监控规范」',
    perfIndicators: '「性能指标」',
    alertMechanism: '「监控告警机制」',
    optimizationFlow: '「优化流程」',
    compliant: '「已达标」',
    warning: '「需关注」',
    critical: '「需处理」',
    target: '「目标」',
    current: '「当前」',
    status: '「状态」',
    systemHealth: '「系统健康度」',
    securityLevel: '「安全等级」',
    contentQuality: '「内容质量分」',
    requests: '「总请求数」',
    cacheHit: '「缓存命中率」',
    memory: '「内存使用率」',
    errors: '「活跃错误」',
    refreshData: '「刷新数据」',
  },
  en: {
    title: 'Standards Center',
    subtitle: 'System Standards & Quality Monitor',
    management: 'Management',
    content: 'Content',
    quality: 'Quality',
    devManagement: 'Development Standards',
    gitWorkflow: 'Git Workflow',
    codeReview: 'Code Review Policy',
    versionRelease: 'Release Standards',
    opsManagement: 'Operations Standards',
    contentOps: 'Content Operations',
    userOps: 'User Operations',
    activityOps: 'Activity Standards',
    securityManagement: 'Security Standards',
    securityDev: 'Secure Development',
    dataSecurity: 'Data Security',
    emergencyResponse: 'Emergency Response',
    musicContent: 'Music Content Standards',
    uploadStandard: 'Upload Standards',
    copyrightReview: 'Copyright Review',
    classification: 'Content Classification',
    ugcContent: 'UGC Standards',
    messageReview: 'Comment Review',
    communityRules: 'Community Rules',
    violationProcess: 'Violation Handling',
    metadataStandard: 'Metadata Standards',
    infoFilling: 'Info Filling Standards',
    qualityControl: 'Quality Control',
    updateMechanism: 'Update Mechanism',
    sla: 'Service Level Agreement',
    availability: 'System Availability',
    responseTime: 'API Response Time',
    customerService: 'Customer Service',
    feedbackProcess: 'Feedback Handling',
    resolutionTime: 'Resolution Time',
    qualityAssess: 'Quality Assessment',
    perfMonitor: 'Performance Monitor',
    perfIndicators: 'Performance Metrics',
    alertMechanism: 'Alert Mechanism',
    optimizationFlow: 'Optimization Flow',
    compliant: 'Compliant',
    warning: 'Attention',
    critical: 'Critical',
    target: 'Target',
    current: 'Current',
    status: 'Status',
    systemHealth: 'System Health',
    securityLevel: 'Security Level',
    contentQuality: 'Content Quality',
    requests: 'Total Requests',
    cacheHit: 'Cache Hit Rate',
    memory: 'Memory Usage',
    errors: 'Active Errors',
    refreshData: 'Refresh Data',
  }
};

function StatusBadge({ status }: { status: 'compliant' | 'warning' | 'critical' }) {
  const colors = {
    compliant: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const icons = {
    compliant: <CheckCircle className="w-3 h-3" />,
    warning: <AlertTriangle className="w-3 h-3" />,
    critical: <AlertTriangle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status]}`}>
      {icons[status]}
    </span>
  );
}

function MetricGauge({ value, max, label, color, icon: Icon }: { 
  value: number; max: number; label: string; color: string; icon: any 
}) {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-white/60 text-[11px] font-medium">{label}</span>
        </div>
        <span className="text-white text-sm font-bold">{typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{max === 100 ? '%' : max === 200 ? 'ms' : ''}</span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${color.replace('text-', 'bg-')}`}
        />
      </div>
    </div>
  );
}

function ComplianceItem({ label, status, detail }: { label: string; status: 'compliant' | 'warning' | 'critical'; detail?: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-white/60 transition-colors flex-shrink-0" />
        <span className="text-white/80 text-xs font-medium truncate">{label}</span>
      </div>
      <StatusBadge status={status} />
    </div>
  );
}

export function StandardsPanel({ isOpen, onClose, language, systemMetrics }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('quality');
  const metrics = { ...defaultMetrics, ...systemMetrics };
  const t = TRANSLATIONS[language];

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'management', label: t.management, icon: FileCheck },
    { id: 'content', label: t.content, icon: Eye },
    { id: 'quality', label: t.quality, icon: Activity },
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
            className="absolute right-0 top-0 bottom-0 w-full md:w-[420px] bg-purple-950/30 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col shadow-2xl md:rounded-r-3xl"
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '标准化规范' : 'Standards'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Shield className="w-5 h-5 text-white" />
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

            {/* Summary Metrics */}
            <div className="p-4 border-b border-white/5">
              <div className="grid grid-cols-2 gap-2">
                <MetricGauge value={metrics.uptime} max={100} label={t.systemHealth} color="text-green-400" icon={Server} />
                <MetricGauge value={metrics.apiResponseTime} max={200} label={t.responseTime} color="text-blue-400" icon={Zap} />
                <MetricGauge value={metrics.securityScore} max={100} label={t.securityLevel} color="text-purple-400" icon={Lock} />
                <MetricGauge value={metrics.contentQualityScore} max={100} label={t.contentQuality} color="text-amber-400" icon={ChartPie} />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-white text-xs font-bold">{metrics.totalRequests.toLocaleString()}</div>
                  <div className="text-white/40 text-[9px] font-medium mt-0.5">{t.requests}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-white text-xs font-bold">{metrics.cacheHitRate}%</div>
                  <div className="text-white/40 text-[9px] font-medium mt-0.5">{t.cacheHit}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className="text-white text-xs font-bold">{metrics.memoryUsage}%</div>
                  <div className="text-white/40 text-[9px] font-medium mt-0.5">{t.memory}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <div className={`text-xs font-bold ${metrics.activeErrors === 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metrics.activeErrors}
                  </div>
                  <div className="text-white/40 text-[9px] font-medium mt-0.5">{t.errors}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-emerald-400 border-emerald-400'
                      : 'text-white/50 border-transparent hover:text-white/70'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
              <AnimatePresence mode="wait">
                {activeTab === 'management' && (
                  <motion.div
                    key="management"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Dev Management */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm font-semibold">{t.devManagement}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.gitWorkflow} status="compliant" />
                        <ComplianceItem label={t.codeReview} status="compliant" />
                        <ComplianceItem label={t.versionRelease} status="compliant" />
                      </div>
                    </div>

                    {/* Ops Management */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.opsManagement}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.contentOps} status="compliant" />
                        <ComplianceItem label={t.userOps} status="warning" />
                        <ComplianceItem label={t.activityOps} status="compliant" />
                      </div>
                    </div>

                    {/* Security Management */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <Lock className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">{t.securityManagement}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.securityDev} status="compliant" />
                        <ComplianceItem label={t.dataSecurity} status="compliant" />
                        <ComplianceItem label={t.emergencyResponse} status="warning" />
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
                    {/* Music Content */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.musicContent}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.uploadStandard} status="compliant" />
                        <ComplianceItem label={t.copyrightReview} status="warning" />
                        <ComplianceItem label={t.classification} status="compliant" />
                      </div>
                    </div>

                    {/* UGC Content */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.ugcContent}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.messageReview} status="compliant" />
                        <ComplianceItem label={t.communityRules} status="compliant" />
                        <ComplianceItem label={t.violationProcess} status="compliant" />
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.metadataStandard}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.infoFilling} status="compliant" />
                        <ComplianceItem label={t.qualityControl} status="compliant" />
                        <ComplianceItem label={t.updateMechanism} status="warning" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'quality' && (
                  <motion.div
                    key="quality"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* SLA */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-green-400" />
                        <span className="text-white text-sm font-semibold">{t.sla}</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-xs">{t.availability}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-[10px]">{t.target}: ≥99.9%</span>
                            <span className={`text-xs font-bold ${metrics.uptime >= 99.9 ? 'text-green-400' : 'text-red-400'}`}>
                              {metrics.uptime}%
                            </span>
                            <StatusBadge status={metrics.uptime >= 99.9 ? 'compliant' : 'critical'} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-xs">{t.responseTime}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/40 text-[10px]">{t.target}: &lt;200ms</span>
                            <span className={`text-xs font-bold ${metrics.apiResponseTime < 200 ? 'text-green-400' : 'text-red-400'}`}>
                              {metrics.apiResponseTime}ms
                            </span>
                            <StatusBadge status={metrics.apiResponseTime < 200 ? 'compliant' : 'critical'} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Service */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.customerService}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.feedbackProcess} status="compliant" />
                        <ComplianceItem label={t.resolutionTime} status="compliant" />
                        <ComplianceItem label={t.qualityAssess} status="compliant" />
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <ChartPie className="w-4 h-4 text-purple-400" />
                        <span className="text-white text-sm font-semibold">{t.perfMonitor}</span>
                      </div>
                      <div className="p-2">
                        <ComplianceItem label={t.perfIndicators} status="compliant" />
                        <ComplianceItem label={t.alertMechanism} status="compliant" />
                        <ComplianceItem label={t.optimizationFlow} status="warning" />
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