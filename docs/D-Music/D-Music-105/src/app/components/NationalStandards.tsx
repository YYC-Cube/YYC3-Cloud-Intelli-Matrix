import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Globe, Shield, Award, CheckCircle, ChevronRight,
  FileCheck, Scale, Building2, Landmark, TrendingUp,
  Target, Layers, Database, Server, Cpu,
  Users, Headphones, Code, BookOpen, AlertTriangle,
  Clock, ArrowRight, Zap, ChartPie, RefreshCw
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: 'zh' | 'en';
}

type TabId = 'national' | 'industry' | 'international' | 'integration' | 'assessment';

const TRANSLATIONS = {
  zh: {
    title: '「国标化建设」',
    subtitle: '「标准合规与六化一体整合」',
    national: '「国家标准」',
    industry: '「行业标准」',
    international: '「国际标准」',
    integration: '「六化整合」',
    assessment: '「效果评估」',

    // National Standards
    nationalTitle: '「国家标准遵循」',
    gbSoftware: '「GB/T 8566」',
    gbSoftwareName: '「信息技术 软件工程 软件开发规范」',
    gbSoftwareDesc: '「规范软件开发流程，确保开发过程可控、可追溯」',
    gbSecurity: '「GB/T 22239」',
    gbSecurityName: '「信息安全技术 网络安全等级保护」',
    gbSecurityDesc: '「保障系统安全，实施等级保护基本要求」',
    gbAudio: '「GB/T 17975.3」',
    gbAudioName: '「信息技术 MPEG-4音频编码标准」',
    gbAudioDesc: '「音频编码标准，保障多媒体内容质量」',
    gbUsability: '「GB/T 28539」',
    gbUsabilityName: '「信息技术 用户界面设计可用性方法」',
    gbUsabilityDesc: '「用户界面设计标准，提升产品可用性」',
    complianceStatus: '「合规状态」',
    standardCode: '「标准编号」',
    standardName: '「标准名称」',
    coverage: '「覆盖率」',

    // Industry Standards
    industryTitle: '「行业标准遵循」',
    musicFormat: '「数字音乐内容格式规范」',
    musicFormatDesc: '「数字音乐内容格式标准，规范音频文件编码与元数据」',
    musicService: '「网络音乐服务规范」',
    musicServiceDesc: '「网络音乐服务质量标准，保障用户服务体验」',
    privacyGuide: '「互联网个人信息安全保护指南」',
    privacyGuideDesc: '「个人信息保护标准，规范用户数据收集与处理」',

    // International Standards
    internationalTitle: '「国际标准对接」',
    iso27001: '「ISO/IEC 27001」',
    iso27001Name: '「信息安全管理体系」',
    iso27001Desc: '「建立信息安全管理体系，保障数据安全」',
    iso9126: '「ISO/IEC 9126」',
    iso9126Name: '「软件质量模型」',
    iso9126Desc: '「软件质量评价标准，提升系统质量」',
    wcag21: '「WCAG 2.1」',
    wcag21Name: '「Web内容可访问性指南」',
    wcag21Desc: '「网站可访问性标准，确保无障碍访问」',
    iso9241: '「ISO 9241」',
    iso9241Name: '「人机交互工效学」',
    iso9241Desc: '「人机交互设计标准，优化用户体验」',

    // Integration
    integrationTitle: '「六化一体架构」',
    standardization: '「标准化」',
    standardizationItems: ['「技术标准」', '「内容标准」', '「体验标准」'],
    processization: '「流程化」',
    processizationItems: ['「业务流程」', '「服务流程」', '「管理流程」'],
    technologization: '「科技化」',
    technologizationItems: ['「音频技术」', '「前端技术」', '「后端技术」'],
    normalization: '「规范化」',
    normalizationItems: ['「管理制度」', '「内容管理」', '「服务质量」'],
    intelligentization: '「智能化」',
    intelligentizationItems: ['「智能推荐」', '「智能创作」', '「智能交互」'],
    nationalization: '「国标化」',
    nationalizationItems: ['「国家标准」', '「行业标准」', '「国际标准」'],
    platformTitle: '「六化一体协同平台」',
    dataMiddle: '「数据中台」',
    dataMiddleItems: ['「数据采集」', '「数据处理」', '「数据分析」'],
    bizMiddle: '「业务中台」',
    bizMiddleItems: ['「用户服务」', '「内容服务」', '「运营服务」'],
    techMiddle: '「技术中台」',
    techMiddleItems: ['「开发框架」', '「组件库」', '「中间件」'],
    roadmapTitle: '「实施路径规划」',
    phase1: '「P1 基础建设」',
    phase1Time: '「1-3个月」',
    phase1Items: '「建立标准化体系框架 / 设计核心业务流程 / 搭建基础技术平台」',
    phase2: '「P2 系统建设」',
    phase2Time: '「4-6个月」',
    phase2Items: '「完善规范化管理制度 / 开发智能化功能模块 / 对接国标化标准体系」',
    phase3: '「P3 整合优化」',
    phase3Time: '「7-9个月」',
    phase3Items: '「六化体系整合 / 系统联调测试 / 性能优化调整」',
    phase4: '「P4 运营提升」',
    phase4Time: '「10-12个月」',
    phase4Items: '「全面上线运营 / 持续优化迭代 / 评估改进提升」',
    safeguardTitle: '「保障措施」',
    orgGuarantee: '「组织保障」',
    orgGuaranteeDesc: '「成立六化一体建设领导小组，明确责任分工」',
    techGuarantee: '「技术保障」',
    techGuaranteeDesc: '「建立技术评审机制，确保技术方案可行性」',
    resGuarantee: '「资源保障」',
    resGuaranteeDesc: '「合理配置人力、物力、财力资源」',
    qualGuarantee: '「质量保障」',
    qualGuaranteeDesc: '「建立质量管理体系，确保建设质量」',
    riskGuarantee: '「风险保障」',
    riskGuaranteeDesc: '「建立风险评估和应对机制，防范项目风险」',

    // Assessment
    assessmentTitle: '「预期效果评估」',
    techEffect: '「技术效果」',
    stability: '「系统稳定性」',
    loadSpeed: '「页面加载速度」',
    audioQuality: '「音频质量」',
    systemSecurity: '「系统安全性」',
    bizEffect: '「业务效果」',
    userActivity: '「用户活跃度」',
    createEfficiency: '「内容创作效率」',
    userSatisfaction: '「用户满意度」',
    opsEfficiency: '「运营效率」',
    mgmtEffect: '「管理效果」',
    devEfficiency: '「开发效率」',
    opsCost: '「运维成本」',
    decisionEfficiency: '「决策效率」',
    compliance: '「合规性」',
    improve: '「提升」',
    reduce: '「降低」',

    // Status
    compliant: '「已合规」',
    partial: '「部分合规」',
    planned: '「规划中」',
    implemented: '「已实现」',
    inProgress: '「开发中」',
  },
  en: {
    title: 'National Standards',
    subtitle: 'Standards Compliance & Six-in-One Integration',
    national: 'National',
    industry: 'Industry',
    international: 'Intl',
    integration: 'Integration',
    assessment: 'Assessment',

    nationalTitle: 'National Standards Compliance',
    gbSoftware: 'GB/T 8566',
    gbSoftwareName: 'IT Software Engineering Development',
    gbSoftwareDesc: 'Standardize dev process for traceability',
    gbSecurity: 'GB/T 22239',
    gbSecurityName: 'Cybersecurity Protection Requirements',
    gbSecurityDesc: 'System security with classified protection',
    gbAudio: 'GB/T 17975.3',
    gbAudioName: 'IT MPEG-4 Audio Encoding Standard',
    gbAudioDesc: 'Audio encoding to ensure content quality',
    gbUsability: 'GB/T 28539',
    gbUsabilityName: 'IT UI Design Usability Methods',
    gbUsabilityDesc: 'UI design standards for better usability',
    complianceStatus: 'Compliance Status',
    standardCode: 'Standard Code',
    standardName: 'Standard Name',
    coverage: 'Coverage',

    industryTitle: 'Industry Standards Compliance',
    musicFormat: 'Digital Music Content Format',
    musicFormatDesc: 'Audio file encoding & metadata standards',
    musicService: 'Online Music Service Standards',
    musicServiceDesc: 'Service quality standards for music platforms',
    privacyGuide: 'Internet Personal Info Protection Guide',
    privacyGuideDesc: 'Standards for user data collection & processing',

    internationalTitle: 'International Standards',
    iso27001: 'ISO/IEC 27001',
    iso27001Name: 'Information Security Management',
    iso27001Desc: 'ISMS for comprehensive data security',
    iso9126: 'ISO/IEC 9126',
    iso9126Name: 'Software Quality Model',
    iso9126Desc: 'Software quality evaluation framework',
    wcag21: 'WCAG 2.1',
    wcag21Name: 'Web Content Accessibility Guidelines',
    wcag21Desc: 'Ensure accessible web content for all users',
    iso9241: 'ISO 9241',
    iso9241Name: 'Ergonomics of HCI',
    iso9241Desc: 'Human-computer interaction design standards',

    integrationTitle: 'Six-in-One Architecture',
    standardization: 'Standardization',
    standardizationItems: ['Tech Standards', 'Content Standards', 'UX Standards'],
    processization: 'Processization',
    processizationItems: ['Biz Processes', 'Service Processes', 'Mgmt Processes'],
    technologization: 'Technologization',
    technologizationItems: ['Audio Tech', 'Frontend Tech', 'Backend Tech'],
    normalization: 'Normalization',
    normalizationItems: ['Mgmt System', 'Content Mgmt', 'Service Quality'],
    intelligentization: 'Intelligentization',
    intelligentizationItems: ['Smart Rec', 'Smart Create', 'Smart Interact'],
    nationalization: 'Nationalization',
    nationalizationItems: ['National Std', 'Industry Std', 'Intl Std'],
    platformTitle: 'Collaborative Platform',
    dataMiddle: 'Data Hub',
    dataMiddleItems: ['Collection', 'Processing', 'Analytics'],
    bizMiddle: 'Biz Hub',
    bizMiddleItems: ['User Svc', 'Content Svc', 'Ops Svc'],
    techMiddle: 'Tech Hub',
    techMiddleItems: ['Dev Framework', 'Components', 'Middleware'],
    roadmapTitle: 'Implementation Roadmap',
    phase1: 'P1 Foundation',
    phase1Time: 'Month 1-3',
    phase1Items: 'Standards framework / Core biz processes / Base tech platform',
    phase2: 'P2 System Build',
    phase2Time: 'Month 4-6',
    phase2Items: 'Normalization / Smart features / Standards compliance',
    phase3: 'P3 Integration',
    phase3Time: 'Month 7-9',
    phase3Items: 'Six-in-one integration / System testing / Performance tuning',
    phase4: 'P4 Operations',
    phase4Time: 'Month 10-12',
    phase4Items: 'Full launch / Continuous iteration / Evaluation & improvement',
    safeguardTitle: 'Safeguard Measures',
    orgGuarantee: 'Organization',
    orgGuaranteeDesc: 'Leadership team with clear responsibilities',
    techGuarantee: 'Technology',
    techGuaranteeDesc: 'Tech review to ensure feasibility',
    resGuarantee: 'Resources',
    resGuaranteeDesc: 'Proper allocation of HR & finances',
    qualGuarantee: 'Quality',
    qualGuaranteeDesc: 'Quality management system in place',
    riskGuarantee: 'Risk Mgmt',
    riskGuaranteeDesc: 'Risk assessment & mitigation mechanisms',

    assessmentTitle: 'Expected Effect Assessment',
    techEffect: 'Technical Effects',
    stability: 'System Stability',
    loadSpeed: 'Page Load Speed',
    audioQuality: 'Audio Quality',
    systemSecurity: 'System Security',
    bizEffect: 'Business Effects',
    userActivity: 'User Activity',
    createEfficiency: 'Content Creation',
    userSatisfaction: 'User Satisfaction',
    opsEfficiency: 'Ops Efficiency',
    mgmtEffect: 'Management Effects',
    devEfficiency: 'Dev Efficiency',
    opsCost: 'Ops Cost',
    decisionEfficiency: 'Decision Making',
    compliance: 'Compliance',
    improve: 'Improve',
    reduce: 'Reduce',

    compliant: 'Compliant',
    partial: 'Partial',
    planned: 'Planned',
    implemented: 'Done',
    inProgress: 'In Progress',
  }
};

type ComplianceStatus = 'compliant' | 'partial' | 'planned';

function ComplianceBadge({ status, language }: { status: ComplianceStatus; language: 'zh' | 'en' }) {
  const t = TRANSLATIONS[language];
  const config: Record<ComplianceStatus, { color: string; label: string; icon: React.ReactNode }> = {
    compliant: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: t.compliant, icon: <CheckCircle className="w-3 h-3" /> },
    partial: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: t.partial, icon: <AlertTriangle className="w-3 h-3" /> },
    planned: { color: 'bg-white/10 text-white/50 border-white/10', label: t.planned, icon: <Clock className="w-3 h-3" /> },
  };
  const { color, label, icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${color}`}>
      {icon}
      {label}
    </span>
  );
}

function StandardCard({ code, name, desc, status, coverage, color, language }: {
  code: string; name: string; desc: string; status: ComplianceStatus; coverage: number; color: string; language: 'zh' | 'en';
}) {
  return (
    <div className="bg-white/[0.04] rounded-xl border border-white/10 p-3.5 hover:bg-white/[0.06] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${color} bg-white/5`}>{code}</span>
          <ComplianceBadge status={status} language={language} />
        </div>
      </div>
      <h4 className="text-white/90 text-xs font-semibold mb-1">{name}</h4>
      <p className="text-white/35 text-[10px] leading-relaxed mb-2.5">{desc}</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${coverage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full bg-gradient-to-r ${
              status === 'compliant' ? 'from-green-500 to-emerald-500' :
              status === 'partial' ? 'from-amber-500 to-orange-500' :
              'from-white/20 to-white/10'
            }`}
          />
        </div>
        <span className="text-white/50 text-[10px] font-bold">{coverage}%</span>
      </div>
    </div>
  );
}

function PillarCard({ label, items, color, icon: Icon, status }: {
  label: string; items: string[]; color: string; icon: any; status: 'implemented' | 'inProgress' | 'planned';
}) {
  const statusDot = status === 'implemented' ? 'bg-green-400' : status === 'inProgress' ? 'bg-amber-400' : 'bg-white/30';
  return (
    <div className="bg-white/[0.04] rounded-xl border border-white/10 p-3 hover:bg-white/[0.06] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-3.5 h-3.5 ${color}`} />
          <span className="text-white text-[11px] font-semibold">{label}</span>
        </div>
        <div className={`w-2 h-2 rounded-full ${statusDot}`} />
      </div>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-2.5 h-2.5 text-white/25 flex-shrink-0" />
            <span className="text-white/45 text-[10px]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EffectMetric({ label, value, isReduce, color }: {
  label: string; value: string; isReduce?: boolean; color: string;
}) {
  const numValue = parseInt(value);
  return (
    <div className="bg-white/[0.04] rounded-lg border border-white/10 p-2.5 hover:bg-white/[0.06] transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-white/60 text-[10px] font-medium">{label}</span>
        <div className={`flex items-center gap-0.5 ${isReduce ? 'text-green-400' : color}`}>
          <TrendingUp className={`w-2.5 h-2.5 ${isReduce ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className={`text-lg font-bold ${color}`}>{value}</span>
      </div>
      <div className="mt-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${numValue}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isReduce ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            `bg-gradient-to-r ${color.includes('purple') ? 'from-purple-500 to-violet-500' :
              color.includes('blue') ? 'from-blue-500 to-cyan-500' :
              color.includes('green') ? 'from-green-500 to-emerald-500' :
              color.includes('amber') ? 'from-amber-500 to-orange-500' :
              color.includes('pink') ? 'from-pink-500 to-rose-500' :
              'from-violet-500 to-purple-500'}`
          }`}
        />
      </div>
    </div>
  );
}

function ScoreRing({ score, max, color, size = 52 }: { score: number; max: number; color: string; size?: number }) {
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

export function NationalStandards({ isOpen, onClose, language }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('national');
  const t = TRANSLATIONS[language];

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: 'national', label: t.national, icon: Landmark },
    { id: 'industry', label: t.industry, icon: Building2 },
    { id: 'international', label: t.international, icon: Globe },
    { id: 'integration', label: t.integration, icon: Layers },
    { id: 'assessment', label: t.assessment, icon: ChartPie },
  ];

  // Overall compliance scores
  const complianceScores = [
    { label: t.national, score: 78, color: '#ef4444' },
    { label: t.industry, score: 65, color: '#f59e0b' },
    { label: t.international, score: 58, color: '#3b82f6' },
  ];
  const overallScore = Math.round(complianceScores.reduce((s, item) => s + item.score, 0) / complianceScores.length);

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
            role="dialog" aria-modal="true" aria-label={language === 'zh' ? '国标化规范' : 'National Standards'}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Scale className="w-5 h-5 text-white" />
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

            {/* Overall Compliance Score */}
            <div className="px-4 pt-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-4">
                <ScoreRing score={overallScore} max={100} color="#f59e0b" size={56} />
                <div className="flex-1">
                  <div className="text-white text-sm font-semibold mb-1.5">
                    {language === 'zh' ? '综合合规评分' : 'Overall Compliance Score'}
                  </div>
                  <div className="space-y-1">
                    {complianceScores.map((s) => (
                      <div key={s.label} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="text-white/40 text-[9px] flex-1">{s.label}</span>
                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.score}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                        </div>
                        <span className="text-white/70 text-[9px] font-bold w-7 text-right">{s.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 px-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-[10px] font-medium flex items-center justify-center gap-1 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'text-amber-400 border-amber-400'
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

                {/* National Standards Tab */}
                {activeTab === 'national' && (
                  <motion.div
                    key="national"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-red-400" />
                        <span className="text-white text-sm font-semibold">{t.nationalTitle}</span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        <StandardCard
                          code={t.gbSoftware} name={t.gbSoftwareName} desc={t.gbSoftwareDesc}
                          status="compliant" coverage={85} color="text-red-400" language={language}
                        />
                        <StandardCard
                          code={t.gbSecurity} name={t.gbSecurityName} desc={t.gbSecurityDesc}
                          status="partial" coverage={72} color="text-amber-400" language={language}
                        />
                        <StandardCard
                          code={t.gbAudio} name={t.gbAudioName} desc={t.gbAudioDesc}
                          status="compliant" coverage={90} color="text-green-400" language={language}
                        />
                        <StandardCard
                          code={t.gbUsability} name={t.gbUsabilityName} desc={t.gbUsabilityDesc}
                          status="partial" coverage={68} color="text-blue-400" language={language}
                        />
                      </div>
                    </div>

                    {/* Compliance Summary */}
                    <div className="bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        {language === 'zh' ? '合规概览' : 'Compliance Overview'}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: language === 'zh' ? '已合规' : 'Compliant', value: '2', color: 'text-green-400' },
                          { label: language === 'zh' ? '部分合规' : 'Partial', value: '2', color: 'text-amber-400' },
                          { label: language === 'zh' ? '待实施' : 'Pending', value: '0', color: 'text-white/40' },
                        ].map((item) => (
                          <div key={item.label} className="bg-white/5 rounded-lg p-2.5 text-center">
                            <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                            <div className="text-white/40 text-[9px] mt-0.5">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Industry Standards Tab */}
                {activeTab === 'industry' && (
                  <motion.div
                    key="industry"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-orange-400" />
                        <span className="text-white text-sm font-semibold">{t.industryTitle}</span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        <StandardCard
                          code={language === 'zh' ? '行标-01' : 'IND-01'}
                          name={t.musicFormat} desc={t.musicFormatDesc}
                          status="partial" coverage={70} color="text-orange-400" language={language}
                        />
                        <StandardCard
                          code={language === 'zh' ? '行标-02' : 'IND-02'}
                          name={t.musicService} desc={t.musicServiceDesc}
                          status="partial" coverage={55} color="text-cyan-400" language={language}
                        />
                        <StandardCard
                          code={language === 'zh' ? '行标-03' : 'IND-03'}
                          name={t.privacyGuide} desc={t.privacyGuideDesc}
                          status="compliant" coverage={82} color="text-green-400" language={language}
                        />
                      </div>
                    </div>

                    {/* Industry Compliance Radar */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-cyan-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-orange-400" />
                        {language === 'zh' ? '行业标准合规矩阵' : 'Industry Compliance Matrix'}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          { label: language === 'zh' ? '内容格式合规' : 'Content Format', progress: 70, color: 'from-orange-500 to-amber-500' },
                          { label: language === 'zh' ? '服务质量合规' : 'Service Quality', progress: 55, color: 'from-cyan-500 to-blue-500' },
                          { label: language === 'zh' ? '信息安全合规' : 'Info Security', progress: 82, color: 'from-green-500 to-emerald-500' },
                        ].map((l) => (
                          <div key={l.label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-white/60 text-[10px] font-medium">{l.label}</span>
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

                {/* International Standards Tab */}
                {activeTab === 'international' && (
                  <motion.div
                    key="international"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.internationalTitle}</span>
                      </div>
                      <div className="p-3 space-y-2.5">
                        <StandardCard
                          code={t.iso27001} name={t.iso27001Name} desc={t.iso27001Desc}
                          status="partial" coverage={60} color="text-blue-400" language={language}
                        />
                        <StandardCard
                          code={t.iso9126} name={t.iso9126Name} desc={t.iso9126Desc}
                          status="partial" coverage={55} color="text-purple-400" language={language}
                        />
                        <StandardCard
                          code={t.wcag21} name={t.wcag21Name} desc={t.wcag21Desc}
                          status="partial" coverage={52} color="text-green-400" language={language}
                        />
                        <StandardCard
                          code={t.iso9241} name={t.iso9241Name} desc={t.iso9241Desc}
                          status="planned" coverage={40} color="text-amber-400" language={language}
                        />
                      </div>
                    </div>

                    {/* International Standards Mapping */}
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        {language === 'zh' ? '国际标准对接路径' : 'Intl Standards Alignment Path'}
                      </h4>
                      <div className="space-y-2">
                        {[
                          { from: 'GB/T 22239', to: 'ISO 27001', status: language === 'zh' ? '已映射' : 'Mapped', color: 'text-green-400' },
                          { from: 'GB/T 8566', to: 'ISO 9126', status: language === 'zh' ? '对接中' : 'Aligning', color: 'text-amber-400' },
                          { from: 'GB/T 28539', to: 'ISO 9241', status: language === 'zh' ? '对接中' : 'Aligning', color: 'text-amber-400' },
                          { from: language === 'zh' ? '无障碍规范' : 'A11y Spec', to: 'WCAG 2.1', status: language === 'zh' ? '规划中' : 'Planned', color: 'text-white/40' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors">
                            <span className="text-white/60 text-[10px] font-mono w-20 truncate">{item.from}</span>
                            <ArrowRight className="w-3 h-3 text-white/25 flex-shrink-0" />
                            <span className="text-white/60 text-[10px] font-mono w-16 truncate">{item.to}</span>
                            <span className={`text-[9px] font-bold ml-auto ${item.color}`}>{item.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Integration Tab */}
                {activeTab === 'integration' && (
                  <motion.div
                    key="integration"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Six Pillars */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-violet-400" />
                        <span className="text-white text-sm font-semibold">{t.integrationTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        <PillarCard label={t.standardization} items={t.standardizationItems} color="text-red-400" icon={Target} status="implemented" />
                        <PillarCard label={t.processization} items={t.processizationItems} color="text-blue-400" icon={RefreshCw} status="implemented" />
                        <PillarCard label={t.technologization} items={t.technologizationItems} color="text-cyan-400" icon={Cpu} status="implemented" />
                        <PillarCard label={t.normalization} items={t.normalizationItems} color="text-emerald-400" icon={Shield} status="implemented" />
                        <PillarCard label={t.intelligentization} items={t.intelligentizationItems} color="text-purple-400" icon={Zap} status="implemented" />
                        <PillarCard label={t.nationalization} items={t.nationalizationItems} color="text-amber-400" icon={Scale} status="inProgress" />
                      </div>
                    </div>

                    {/* Collaborative Platform */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Server className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm font-semibold">{t.platformTitle}</span>
                      </div>
                      <div className="p-3 grid grid-cols-3 gap-2">
                        <PillarCard label={t.dataMiddle} items={t.dataMiddleItems} color="text-blue-400" icon={Database} status="inProgress" />
                        <PillarCard label={t.bizMiddle} items={t.bizMiddleItems} color="text-green-400" icon={Users} status="inProgress" />
                        <PillarCard label={t.techMiddle} items={t.techMiddleItems} color="text-purple-400" icon={Code} status="implemented" />
                      </div>
                    </div>

                    {/* Implementation Roadmap */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-amber-400" />
                        <span className="text-white text-sm font-semibold">{t.roadmapTitle}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { phase: t.phase1, time: t.phase1Time, items: t.phase1Items, color: 'text-green-400', bg: 'from-green-500', progress: 100 },
                          { phase: t.phase2, time: t.phase2Time, items: t.phase2Items, color: 'text-blue-400', bg: 'from-blue-500', progress: 75 },
                          { phase: t.phase3, time: t.phase3Time, items: t.phase3Items, color: 'text-purple-400', bg: 'from-purple-500', progress: 30 },
                          { phase: t.phase4, time: t.phase4Time, items: t.phase4Items, color: 'text-amber-400', bg: 'from-amber-500', progress: 0 },
                        ].map((p, idx) => (
                          <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-white/[0.06] last:border-b-0">
                            <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                              <div className={`w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10`}>
                                <span className={`text-[9px] font-bold ${p.color}`}>{idx + 1}</span>
                              </div>
                              {idx < 3 && <div className="w-px h-full bg-white/10 mt-1" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-xs font-semibold ${p.color}`}>{p.phase}</span>
                                <span className="text-white/30 text-[9px]">{p.time}</span>
                              </div>
                              <p className="text-white/40 text-[10px] leading-relaxed">{p.items}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${p.progress}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${p.bg} to-transparent`}
                                  />
                                </div>
                                <span className="text-white/40 text-[9px] font-bold">{p.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safeguard Measures */}
                    <div className="bg-gradient-to-br from-violet-500/10 to-amber-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-violet-400" />
                        {t.safeguardTitle}
                      </h4>
                      <div className="space-y-1.5">
                        {[
                          { label: t.orgGuarantee, desc: t.orgGuaranteeDesc, icon: Users, color: 'text-blue-400' },
                          { label: t.techGuarantee, desc: t.techGuaranteeDesc, icon: Cpu, color: 'text-cyan-400' },
                          { label: t.resGuarantee, desc: t.resGuaranteeDesc, icon: Database, color: 'text-green-400' },
                          { label: t.qualGuarantee, desc: t.qualGuaranteeDesc, icon: Award, color: 'text-purple-400' },
                          { label: t.riskGuarantee, desc: t.riskGuaranteeDesc, icon: Shield, color: 'text-amber-400' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 py-1.5 border-b border-white/[0.06] last:border-b-0">
                            <item.icon className={`w-3.5 h-3.5 ${item.color} flex-shrink-0 mt-0.5`} />
                            <div className="min-w-0">
                              <span className="text-white/80 text-xs font-medium block">{item.label}</span>
                              <span className="text-white/35 text-[10px] block mt-0.5 leading-relaxed">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Assessment Tab */}
                {activeTab === 'assessment' && (
                  <motion.div
                    key="assessment"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {/* Technical Effects */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span className="text-white text-sm font-semibold">{t.techEffect}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        <EffectMetric label={t.stability} value="30%" color="text-blue-400" />
                        <EffectMetric label={t.loadSpeed} value="50%" color="text-cyan-400" />
                        <EffectMetric label={t.audioQuality} value="40%" color="text-green-400" />
                        <EffectMetric label={t.systemSecurity} value="60%" color="text-purple-400" />
                      </div>
                    </div>

                    {/* Business Effects */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <Headphones className="w-4 h-4 text-pink-400" />
                        <span className="text-white text-sm font-semibold">{t.bizEffect}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        <EffectMetric label={t.userActivity} value="35%" color="text-pink-400" />
                        <EffectMetric label={t.createEfficiency} value="45%" color="text-amber-400" />
                        <EffectMetric label={t.userSatisfaction} value="40%" color="text-green-400" />
                        <EffectMetric label={t.opsEfficiency} value="50%" color="text-violet-400" />
                      </div>
                    </div>

                    {/* Management Effects */}
                    <div className="bg-white/[0.04] rounded-xl border border-white/10 overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm font-semibold">{t.mgmtEffect}</span>
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-2">
                        <EffectMetric label={t.devEfficiency} value="40%" color="text-blue-400" />
                        <EffectMetric label={t.opsCost} value="30%" isReduce color="text-green-400" />
                        <EffectMetric label={t.decisionEfficiency} value="45%" color="text-purple-400" />
                        <EffectMetric label={t.compliance} value="60%" color="text-amber-400" />
                      </div>
                    </div>

                    {/* Vision Statement */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-xl border border-white/10 p-4">
                      <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        {language === 'zh' ? '项目愿景' : 'Project Vision'}
                      </h4>
                      <p className="text-white/50 text-[11px] leading-relaxed">
                        {language === 'zh'
                          ? '通过六化一体的全面建设，D-Music 项目将成为一个技术先进、流程高效、管理规范、体验优质的现代化音乐平台，为用户提供卓越的音乐体验，为行业发展树立标杆。'
                          : 'Through comprehensive six-in-one construction, D-Music will become a modern music platform with advanced technology, efficient processes, standardized management, and excellent user experience, setting industry benchmarks.'}
                      </p>
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