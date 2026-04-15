/**
 * @file: HotelDashboard.tsx
 * @description: YYC3智慧酒店 - AI Family管理控制台
 * @author: YanYuCloudCube Team (导师指导)
 * @version: v1.0.0
 * @created: 2026-04-09
 * @updated: 2026-04-16
 * @status: active
 * @tags: [hotel, dashboard, ui, management]
 *
 * @brief: 真正的酒店人 - 可视化管理界面
 * - 实时员工状态监控
 * - 多模型对话管理
 * - 性能数据分析
 * - 语音交互控制
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AIFamilyHotelManager } from '../lib/ai-family-hotel-manager';
import { HotelVoiceService, getHotelVoiceService } from '../lib/hotel-voice-service';
import { getHotelKnowledgeBase } from '../lib/hotel-knowledge-base';
import { getAILearningEngine } from '../lib/ai-learning-engine';
import { HOTEL_ROLES, HotelStaffMember, MultiModelConversation, ConversationParticipant } from '../lib/ai-family-hotel.types';

// ============================================================
// 类型定义
// ============================================================

interface DashboardState {
  activeTab: 'overview' | 'staff' | 'conversations' | 'analytics' | 'voice' | 'knowledge' | 'learning';
  selectedStaffId: string | null;
  isListening: boolean;
  isSpeaking: boolean;
  currentTranscript: string;
  notification: string | null;
}

interface StaffCardData {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: string;
  model: string;
  satisfaction: number;
  interactions: number;
}

// ============================================================
// 主组件
// ============================================================

export const HotelDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    activeTab: 'overview',
    selectedStaffId: null,
    isListening: false,
    isSpeaking: false,
    currentTranscript: '',
    notification: null,
  });

  const [manager] = useState(() => new AIFamilyHotelManager());
  const [voiceService] = useState(() => getHotelVoiceService());
  const [knowledgeBase] = useState(() => getHotelKnowledgeBase());
  const [learningEngine] = useState(() => getAILearningEngine());

  // 数据状态
  const [staffList, setStaffList] = useState<StaffCardData[]>([]);
  const [conversations, setConversations] = useState<MultiModelConversation[]>([]);
  const [stats, setStats] = useState({
    totalInteractions: 0,
    avgSatisfaction: 85,
    activeStaff: 8,
    modelUsage: {} as Record<string, number>,
  });

  // 初始化数据
  useEffect(() => {
    loadInitialData();
    
    // 监听语音事件
    const unsubscribe = voiceService.on('result', (event) => {
      if (event.data && typeof event.data === 'object' && 'transcript' in event.data) {
        const voiceResult = event.data as { transcript: string; confidence?: number };
        setState(prev => ({
          ...prev,
          currentTranscript: voiceResult.transcript,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const loadInitialData = useCallback(() => {
    // 加载员工数据
    const allStaff = manager.getAllStaffMembers();
    const staffCards: StaffCardData[] = allStaff.map(staff => {
      const roleInfo = HOTEL_ROLES[staff.role];
      return {
        id: staff.id,
        name: staff.name,
        role: roleInfo.label,
        emoji: roleInfo.emoji,
        status: staff.status,
        model: staff.primaryModel.modelName,
        satisfaction: staff.performanceMetrics.satisfactionScore,
        interactions: staff.performanceMetrics.totalInteractions,
      };
    });
    setStaffList(staffCards);

    // 加载对话数据
    setConversations(manager.getAllConversations());

    // 加载统计数据
    setStats({
      totalInteractions: staffCards.reduce((sum, s) => sum + s.interactions, 0),
      avgSatisfaction: Math.round(
        staffCards.reduce((sum, s) => sum + s.satisfaction, 0) / staffCards.length
      ),
      activeStaff: staffCards.filter(s => s.status === 'available').length,
      modelUsage: calculateModelUsage(allStaff),
    });
  }, [manager]);

  const calculateModelUsage = (staff: HotelStaffMember[]): Record<string, number> => {
    const usage: Record<string, number> = {};
    staff.forEach(s => {
      usage[s.primaryModel.modelId] = (usage[s.primaryModel.modelId] || 0) + 1;
    });
    return usage;
  };

  // ========== 事件处理函数 ==========

  const handleTabChange = (tab: DashboardState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const handleStaffSelect = (staffId: string) => {
    setState(prev => ({ ...prev, selectedStaffId: staffId }));
  };

  const handleVoiceToggle = async () => {
    if (state.isListening) {
      await voiceService.stopListening();
      setState(prev => ({ ...prev, isListening: false }));
    } else {
      await voiceService.startListening();
      setState(prev => ({ ...prev, isListening: true }));
    }
  };

  const handleSpeak = async (text: string) => {
    setState(prev => ({ ...prev, isSpeaking: true }));
    try {
      await voiceService.speak(text);
    } catch (error) {
      console.error('语音合成错误:', error);
      showNotification('语音合成失败，请检查浏览器支持');
    } finally {
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  };

  const showNotification = (message: string) => {
    setState(prev => ({ ...prev, notification: message }));
    setTimeout(() => {
      setState(prev => ({ ...prev, notification: null }));
    }, 3000);
  };

  // ========== 渲染函数 ==========

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* 通知栏 */}
      {state.notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#e94560',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(233, 69, 96, 0.3)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
        }}>
          {state.notification}
        </div>
      )}

      {/* 头部 */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #00d9ff, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🏨 YYC3 智慧酒店 - AI Family 控制台
          </h1>
          <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: '14px' }}>
            多模型协作 · 实时监控 · 智能优化
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {/* 语音控制按钮 */}
          <button
            onClick={handleVoiceToggle}
            style={{
              padding: '12px 24px',
              background: state.isListening ? '#e94560' : '#00d9ff',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🎤 {state.isListening ? '停止监听' : '开始语音'}
          </button>

          {/* 当前时间 */}
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            fontSize: '14px',
          }}>
            🕐 {new Date().toLocaleString('zh-CN')}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
        {/* 侧边栏导航 */}
        <nav style={{
          width: '240px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '20px 0',
        }}>
          {[
            { id: 'overview', label: '📊 总览面板', icon: '📊' },
            { id: 'staff', label: '👥 团队成员', icon: '👥' },
            { id: 'conversations', label: '💬 对话中心', icon: '💬' },
            { id: 'analytics', label: '📈 数据分析', icon: '📈' },
            { id: 'voice', label: '🎤 语音交互', icon: '🎤' },
            { id: 'knowledge', label: '📚 知识库', icon: '📚' },
            { id: 'learning', label: '🧠 AI学习', icon: '🧠' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as DashboardState['activeTab'])}
              style={{
                width: '100%',
                padding: '16px 24px',
                background: state.activeTab === tab.id ? 'rgba(0, 217, 255, 0.2)' : 'transparent',
                border: 'none',
                borderLeft: state.activeTab === tab.id ? '3px solid #00d9ff' : '3px solid transparent',
                color: state.activeTab === tab.id ? '#00d9ff' : 'rgba(255, 255, 255, 0.7)',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '15px',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* 主内容区 */}
        <main style={{ flex: 1, overflow: 'auto', padding: '30px' }}>
          {renderActiveTab()}
        </main>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 217, 255, 0.2);
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(0, 255, 136, 0.1));
          border: 1px solid rgba(0, 217, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .staff-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
        }

        .status-available { background: #00ff88; box-shadow: 0 0 8px #00ff88; }
        .status-busy { background: #ffa500; box-shadow: 0 0 8px #ffa500; }
        .status-offline { background: #666; }
      `}</style>
    </div>
  );

  function renderActiveTab() {
    switch (state.activeTab) {
      case 'overview':
        return renderOverview();
      case 'staff':
        return renderStaffManagement();
      case 'conversations':
        return renderConversations();
      case 'analytics':
        return renderAnalytics();
      case 'voice':
        return renderVoiceControl();
      case 'knowledge':
        return renderKnowledgeBase();
      case 'learning':
        return renderLearningPanel();
      default:
        return renderOverview();
    }
  }

  function renderOverview() {
    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>📊 总览面板</h2>
        
        {/* 核心指标卡片 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '20px', 
          marginBottom: '40px' 
        }}>
          <div className="stat-card">
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d9ff' }}>
              {stats.totalInteractions}
            </div>
            <div style={{ marginTop: '8px', opacity: 0.7 }}>总交互次数</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#00ff88' }}>
              {stats.avgSatisfaction}%
            </div>
            <div style={{ marginTop: '8px', opacity: 0.7 }}>平均满意度</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ffd700' }}>
              {stats.activeStaff}/{staffList.length}
            </div>
            <div style={{ marginTop: '8px', opacity: 0.7 }}>在线员工</div>
          </div>

          <div className="stat-card">
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ff6b9d' }}>
              {conversations.length}
            </div>
            <div style={{ marginTop: '8px', opacity: 0.7 }}>活跃对话</div>
          </div>
        </div>

        {/* 模型使用情况 */}
        <div className="glass-card" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>🤖 模型使用分布</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {Object.entries(stats.modelUsage).map(([model, count]) => (
              <div key={model} style={{
                flex: 1,
                minWidth: '150px',
                padding: '16px',
                background: 'rgba(0, 217, 255, 0.1)',
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{model}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#00d9ff', margin: '8px 0' }}>
                  {count}
                </div>
                <div style={{ opacity: 0.6 }}>位员工使用</div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速操作 */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>⚡ 快速操作</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <button style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              🔄 刷新数据
            </button>

            <button style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #f093fb, #f5576c)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            >
              📊 生成报告
            </button>

            <button style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            >
              ⚙️ 系统设置
            </button>

            <button style={{
              padding: '20px',
              background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            >
              📥 导出数据
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderStaffManagement() {
    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>👥 团队成员管理</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {staffList.map(staff => (
            <div
              key={staff.id}
              className="glass-card"
              onClick={() => handleStaffSelect(staff.id)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div className="staff-avatar">{staff.emoji}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{staff.name}</h3>
                  <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: '14px' }}>{staff.role}</p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <span>
                  <span className={`status-dot status-${staff.status}`} />
                  {staff.status === 'available' ? '空闲' : staff.status === 'busy' ? '忙碌' : '离线'}
                </span>
                <span style={{ opacity: 0.6, fontSize: '13px' }}>🤖 {staff.model}</span>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                fontSize: '14px'
              }}>
                <div>
                  <span style={{ opacity: 0.6 }}>满意度</span>
                  <div style={{ fontWeight: 'bold', color: '#00ff88', fontSize: '18px' }}>
                    {staff.satisfaction}%
                  </div>
                </div>
                <div>
                  <span style={{ opacity: 0.6 }}>交互数</span>
                  <div style={{ fontWeight: 'bold', color: '#00d9ff', fontSize: '18px' }}>
                    {staff.interactions}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderConversations() {
    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>💬 对话中心</h2>
        
        {conversations.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ marginBottom: '8px' }}>暂无活跃对话</h3>
            <p style={{ opacity: 0.6 }}>当AI Family成员之间有通信时，对话会显示在这里</p>
          </div>
        ) : (
          conversations.map(conv => (
            <div key={conv.conversationId} className="glass-card" style={{ marginBottom: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: 0 }}>对话 ID: {conv.conversationId.substring(0, 20)}...</h4>
                <span style={{
                  padding: '4px 12px',
                  background: conv.status === 'active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 165, 0, 0.2)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}>
                  {conv.status}
                </span>
              </div>
              
              <div style={{ opacity: 0.7, fontSize: '14px' }}>
                参与者: {conv.participants.map((p: ConversationParticipant) => p.memberName).join(', ')}
              </div>
              
              <div style={{ marginTop: '12px', fontSize: '14px' }}>
                消息数: {conv.messages?.length || 0} | 
                任务数: {conv.activeTasks?.length || 0} |
                决策记录: {conv.decisionLog?.length || 0}
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  function renderAnalytics() {
    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>📈 数据分析</h2>
        
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>性能趋势图</h3>
          <div style={{ 
            height: '300px', 
            background: 'rgba(0, 0, 0, 0.2)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.5,
          }}>
            📊 图表区域（可接入 ECharts 或 Chart.js）
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginTop: '24px' 
        }}>
          {['模型响应时间', '客户满意度', '问题解决率', '升级处理'].map(title => (
            <div key={title} className="glass-card">
              <h4 style={{ marginBottom: '12px' }}>{title}</h4>
              <div style={{ 
                height: '120px', 
                background: 'rgba(0, 0, 0, 0.2)', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.5,
              }}>
                📈 迷你图表
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderVoiceControl() {
    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>🎤 语音交互控制</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 语音识别 */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>🎤 语音识别</h3>
            
            <div style={{ 
              padding: '24px',
              background: state.isListening ? 'rgba(233, 69, 96, 0.1)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              minHeight: '120px',
              marginBottom: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {state.isListening && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(233, 69, 96, 0.4), transparent)',
                  animation: 'pulse 1.5s infinite',
                }} />
              )}
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                {state.currentTranscript || (state.isListening ? '正在聆听...' : '点击下方按钮开始说话')}
              </div>
            </div>

            <button
              onClick={handleVoiceToggle}
              style={{
                width: '100%',
                padding: '16px',
                background: state.isListening ? '#e94560' : '#00d9ff',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              {state.isListening ? '⏹️ 停止监听' : '🎙️ 开始识别'}
            </button>
          </div>

          {/* 语音合成 */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '20px' }}>🔊 语音合成</h3>
            
            <textarea
              placeholder="输入要合成的文本..."
              style={{
                width: '100%',
                padding: '16px',
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'white',
                resize: 'vertical',
                minHeight: '80px',
                marginBottom: '16px',
                fontSize: '14px',
              }}
            />

            <button
              disabled={state.isSpeaking}
              onClick={() => {
                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                if (textarea?.value) {handleSpeak(textarea.value);}
              }}
              style={{
                width: '100%',
                padding: '16px',
                background: state.isSpeaking ? '#666' : '#00ff88',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: state.isSpeaking ? 'not-allowed' : 'pointer',
              }}
            >
              {state.isSpeaking ? '⏳ 正在播放...' : '▶️ 开始播放'}
            </button>
          </div>
        </div>

        {/* 浏览器支持检测 */}
        <div className="glass-card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>🌐 浏览器支持检测</h3>
          {(() => {
            const support = HotelVoiceService.checkBrowserSupport();
            return (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>语音识别:</strong> 
                  <span style={{ color: support.recognition ? '#00ff88' : '#e94560' }}>
                    {support.recognition ? '✅ 支持' : '❌ 不支持'}
                  </span>
                </div>
                <div>
                  <strong>语音合成:</strong> 
                  <span style={{ color: support.synthesis ? '#00ff88' : '#e94560' }}>
                    {support.synthesis ? '✅ 支持' : '❌ 不支持'}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  function renderKnowledgeBase() {
    const categories = knowledgeBase.getCategories();

    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>📚 酒店知识库</h2>
        
        {/* 统计信息 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px',
          marginBottom: '30px'
        }}>
          {(() => {
            const stats = knowledgeBase.getStats();
            return [
              { label: '总文章数', value: stats.totalArticles, icon: '📄' },
              { label: '分类数量', value: stats.categories, icon: '📁' },
              { label: '平均版本', value: stats.averageVersion.toFixed(1), icon: '🔄' },
              { label: '最后更新', value: stats.lastUpdate, icon: '📅' },
            ].map(item => (
              <div key={item.label} className="stat-card">
                <div style={{ fontSize: '24px' }}>{item.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{item.value}</div>
                <div style={{ opacity: 0.6 }}>{item.label}</div>
              </div>
            ));
          })()}
        </div>

        {/* 分类列表 */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>📂 知识分类</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{
                padding: '16px',
                background: 'rgba(0, 217, 255, 0.05)',
                border: '1px solid rgba(0, 217, 255, 0.1)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 217, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 217, 255, 0.05)'}
              >
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ opacity: 0.6, fontSize: '13px' }}>{cat.count} 篇文章</div>
              </div>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="glass-card" style={{ marginTop: '24px' }}>
          <h3 style={{ marginBottom: '16px' }}>🔍 知识搜索</h3>
          <input
            type="text"
            placeholder="输入关键词搜索知识库..."
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '15px',
            }}
          />
        </div>
      </div>
    );
  }

  function renderLearningPanel() {
    const summary = learningEngine.getLearningSummary();
    const insights = learningEngine.getInsights({ limit: 5 });

    return (
      <div>
        <h2 style={{ marginBottom: '30px', fontSize: '24px' }}>🧠 AI 学习与优化</h2>
        
        {/* 学习统计 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '16px',
          marginBottom: '30px'
        }}>
          {[
            { label: '反馈记录总数', value: summary.totalFeedbackRecords, icon: '📝' },
            { label: '追踪员工数', value: summary.totalStaffTracked, icon: '👥' },
            { label: '生成洞察数', value: summary.totalInsightsGenerated, icon: '💡' },
            { label: '平均满意度', value: `${summary.averageSatisfactionAcrossAllStaff}%`, icon: '⭐' },
          ].map(item => (
            <div key={item.label} className="stat-card">
              <div style={{ fontSize: '24px' }}>{item.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0' }}>{item.value}</div>
              <div style={{ opacity: 0.6 }}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* 表现排名 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', color: '#00ff88' }}>🏆 表现优秀</h3>
            {summary.topPerformers.map(staffId => {
              const staff = staffList.find(s => s.id === staffId);
              return (
                <div key={staffId} style={{ 
                  padding: '12px',
                  background: 'rgba(0, 255, 136, 0.05)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}>
                  {staff?.emoji} {staff?.name || staffId}
                </div>
              );
            })}
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', color: '#ffa500' }}>⚠️ 需要关注</h3>
            {summary.needsAttention.map(staffId => {
              const staff = staffList.find(s => s.id === staffId);
              return (
                <div key={staffId} style={{ 
                  padding: '12px',
                  background: 'rgba(255, 165, 0, 0.05)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                }}>
                  {staff?.emoji} {staff?.name || staffId}
                </div>
              );
            })}
          </div>
        </div>

        {/* 最新洞察 */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '20px' }}>💡 最新学习洞察</h3>
          
          {insights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
              暂无洞察，系统正在收集数据...
            </div>
          ) : (
            insights.map(insight => (
              <div key={insight.id} style={{
                padding: '20px',
                background: insight.type === 'strength' ? 'rgba(0, 255, 136, 0.05)' :
                           insight.type === 'weakness' ? 'rgba(233, 69, 96, 0.05)' :
                           'rgba(0, 217, 255, 0.05)',
                borderLeft: `4px solid ${
                  insight.type === 'strength' ? '#00ff88' :
                  insight.type === 'weakness' ? '#e94560' :
                  '#00d9ff'
                }`,
                borderRadius: '8px',
                marginBottom: '16px',
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'start',
                  marginBottom: '8px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{insight.title}</h4>
                  <span style={{
                    padding: '4px 8px',
                    background: insight.impact === 'high' ? 'rgba(233, 69, 96, 0.2)' :
                               insight.impact === 'medium' ? 'rgba(255, 165, 0, 0.2)' :
                               'rgba(0, 255, 136, 0.2)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}>
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                
                <p style={{ margin: '0 0 12px', opacity: 0.8, fontSize: '14px' }}>
                  {insight.description}
                </p>
                
                <div style={{ fontSize: '13px', opacity: 0.6 }}>
                  置信度: {insight.confidence}% | 建议: {insight.actionableRecommendations.length} 条
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
};

export default HotelDashboard;
