# D-Music Figma AI 提示词库

> 基于 Figma进度.md 生成的开发提示词

---

## 📘 一、AI 音乐创作全闭环工作流 (100% ✅)

### 1.1 数据洞察模块

```
提示词：创建 SmartAnalytics.tsx 数据洞察组件

需求：
- 展示30天播放/收藏/点赞/受众分析
- 使用 echarts 或 recharts 绘制趋势图
- 支持时间范围选择（7天/30天/90天）
- 受众画像包含年龄、地区、设备分布
- 数据卡片展示关键指标（总播放、新增粉丝、互动率）

技术栈：
- React + TypeScript
- Tailwind CSS
- ECharts / Recharts
```

### 1.2 AI创作中心

```
提示词：创建 AICreator.tsx AI创作中心组件

需求：
- 8步可视化创作流程引导
- 6种创作模式切换：
  1. 极简写歌 (minimalist)
  2. 大师写歌 (master)
  3. 翻唱 (cover)
  4. 改编 (remix)
  5. AI MV (mv)
  6. 串烧 (medley)
- 灵感锚定：大数据推荐创作方向
- 歌词编辑器 + AI续写
- 旋律生成 + 风格选择
- 实时预览播放

交互：
- 步骤进度条
- 模式切换动画
- 生成进度反馈
- 一键导出
```

### 1.3 作品管理

```
提示词：创建 ProfilePanel.tsx 作品管理面板

需求：
- 作品管理 Tab：
  - 列表/网格视图切换
  - 分类筛选（原创/翻唱/改编）
  - 隐私设置（公开/私密/好友可见）
  - 批量操作（删除/移动/分享）
  
- 原创认证 Tab：
  - 认证申请表单
  - 审核状态追踪
  - 证书下载
  
- 音乐分发 Tab：
  - 多平台一键分发
  - 数字唱片上架
  - 收益统计
```

---

## 📗 二、星力值排行榜系统 (100% ✅)

### 2.1 威尔逊区间算法

```
提示词：实现 WilsonScoreCalculator 威尔逊区间算法

需求：
```typescript
class WilsonScoreCalculator {
  // 计算威尔逊区间下限
  calculateLowerBound(positive: number, total: number, confidence: number = 0.95): number
  
  // 计算置信区间
  calculateInterval(positive: number, total: number, confidence: number): [number, number]
  
  // z-score 查表 (95% = 1.96, 99% = 2.576)
  getZValue(confidence: number): number
}
```

应用场景：
- 解决小样本排名不公平问题
- 新作品与热门作品的公平竞争
- 置信度可配置（默认95%）
```

### 2.2 星力服务

```
提示词：实现 StarPowerService 星力服务

需求：
```typescript
interface StarPowerState {
  balance: number           // 当前余额
  totalEarned: number       // 累计获得
  totalSpent: number        // 累计消耗
  vipLevel: number          // VIP等级
  vipExp: number            // VIP经验
  dailyStreak: number       // 连续签到天数
  transactions: Transaction[] // 交易记录
}

class StarPowerService {
  // 星力操作
  add(userId: string, amount: number, reason: string): void
  consume(userId: string, amount: number, reason: string): boolean
  
  // VIP系统
  getVipLevel(exp: number): number
  getVipBenefits(level: number): string[]
  
  // 签到系统
  dailyCheckIn(userId: string): { starPower: number, mheart: number }
  getCheckInStreak(userId: string): number
}
```
```

### 2.3 排行榜服务

```
提示词：实现 RankingService 排行榜服务

需求：
- 多时间维度：日榜/周榜/月榜/总榜
- 多分类维度：热门/飙升/原创/完播
- Wilson 重排算法
- 星力助推机制
- 缓存策略（5分钟更新）

```typescript
class RankingService {
  getRanking(type: 'daily' | 'weekly' | 'monthly', category: string): RankingItem[]
  boostWithStarPower(contentId: string, amount: number): void
  recalculateWilsonScore(): void
}
```
```

### 2.4 星力面板 UI

```
提示词：创建 StarPowerBoard.tsx 星力面板组件

需求：
- 4-tab 架构：
  1. 排行榜 (ranking)
  2. 星力值 (starpower)
  3. VIP等级 (vip)
  4. 签到 (checkin)
  
- 排行榜 Tab：
  - 时间范围切换
  - 分类筛选
  - 排名变化指示（↑↓）
  - Wilson 分可视化
  - 助推按钮
  
- 星力值 Tab：
  - 仪表盘可视化
  - 等级进度（新星→明星→巨星→超星→传奇）
  - 交易记录列表
  
- VIP Tab：
  - 等级展示
  - 特权说明
  - 经验进度条
  
- 签到 Tab：
  - 日历视图
  - 连续签到奖励
  - 一键签到
```

### 2.5 M❤️值系统互联

```
提示词：实现 M❤️值与星力系统互联

需求：
- 共享 computeMHeartValue 公式
- 双向回调桥接
- IncentiveSystem ↔ StarPowerBoard 数据同步

```typescript
// M❤️值计算公式
function computeMHeartValue(params: {
  playCount: number
  likeCount: number
  shareCount: number
  commentCount: number
  starPowerBoost: number
}): number

// 跨面板通信
interface Bridge {
  onMHeartUpdate: (value: number) => void
  onStarPowerUpdate: (value: number) => void
}
```
```

---

## 📙 三、时空喊话系统和 IP 矩阵 (61%)

### 3.1 时空消息类型 ✅

```
提示词：定义时空消息类型系统

```typescript
interface SpaceTimeMessage {
  id: string
  type: 'text' | 'voice' | 'capsule'
  content: string | AudioContent
  location?: LocationData
  trigger: TriggerCondition
  privacy: PrivacySettings
  status: MessageStatus
  createdAt: Date
  expiresAt?: Date
}

interface AudioContent {
  url: string
  duration: number
  waveform: number[]
}

interface LocationData {
  latitude: number
  longitude: number
  name?: string
  radius?: number // 地理围栏半径(米)
}

interface TriggerCondition {
  type: 'time' | 'location' | 'event'
  value: Date | LocationData | string
}

interface PrivacySettings {
  visibility: 'public' | 'friends' | 'private'
  encrypt: boolean
  selfDestruct?: boolean
}
```
```

### 3.2 文字消息发送 ✅

```
提示词：实现文字消息发送状态机

需求：
- 状态机：input → sending → sent → delivered → read
- 输入验证（长度、敏感词）
- 发送进度反馈
- 失败重试机制

```typescript
type MessageState = 'input' | 'sending' | 'sent' | 'delivered' | 'read' | 'failed'

function useMessageSender() {
  const [state, setState] = useState<MessageState>('input')
  
  const send = async (content: string) => {
    setState('sending')
    try {
      await api.sendMessage(content)
      setState('sent')
    } catch {
      setState('failed')
    }
  }
  
  return { state, send, retry }
}
```
```

### 3.3 时空胶囊 ✅

```
提示词：实现时空胶囊功能

需求：
- 时间选择器：1分钟/1小时/明天/明年
- 开启条件设置
- 倒计时显示
- 开启动画效果

```typescript
interface Capsule {
  id: string
  content: string
  openAt: Date
  createdAt: Date
  status: 'sealed' | 'opening' | 'opened'
  recipient?: string
}

function createCapsule(content: string, openAt: Date): Capsule
function openCapsule(id: string): Promise<string>
```
```

### 3.4 语音录制 ✅

```
提示词：创建 VoiceInput.tsx 语音输入组件

需求：
- WebRTC 录音
- Web Audio API 波形可视化
- 录音时长限制（60秒）
- 播放/重录功能
- 音频格式转换

```typescript
function VoiceInput({ onRecord, maxDuration = 60 }: Props) {
  // 录音状态
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  // 波形数据
  const [waveform, setWaveform] = useState<number[]>([])
  
  // 录音控制
  const startRecording = () => { /* ... */ }
  const stopRecording = () => { /* ... */ }
  const playRecording = () => { /* ... */ }
  
  return (
    <div>
      {/* 波形可视化 */}
      {/* 录音按钮 */}
      {/* 时长显示 */}
    </div>
  )
}
```
```

### 3.5 消息墙 ⚠️ 部分

```
提示词：实现独立消息墙面板

需求：
- 消息瀑布流展示
- 内容审核状态
- 墙主设置（主题、背景、权限）
- 互动功能（点赞、回复）

```typescript
interface MessageWall {
  id: string
  theme: string
  background: string
  messages: WallMessage[]
  settings: WallSettings
  moderationEnabled: boolean
}

function MessageWallPanel({ wallId }: Props) {
  // 消息列表
  // 发布入口
  // 审核队列（墙主）
  // 设置面板
}
```
```

### 3.6 位置服务 ⚠️ 部分

```
提示词：集成真实 Geolocation API

需求：
- 获取用户当前位置
- 地理围栏检测
- 位置锁定功能
- 附近消息发现

```typescript
function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }),
      (err) => setError(err.message)
    )
  }
  
  const watchPosition = () => { /* 实时监听 */ }
  const checkGeofence = (center: LocationData, radius: number) => { /* 围栏检测 */ }
  
  return { location, error, getCurrentPosition, watchPosition, checkGeofence }
}
```
```

### 3.7 消息加密 ⚠️ 部分

```
提示词：实现端到端加密

需求：
- AES 加密算法
- 密钥交换机制
- 加密状态指示
- 解密验证

```typescript
class EncryptionService {
  // 生成密钥对
  generateKeyPair(): Promise<KeyPair>
  
  // 加密消息
  encrypt(content: string, publicKey: string): Promise<string>
  
  // 解密消息
  decrypt(encrypted: string, privateKey: string): Promise<string>
  
  // 验证完整性
  verify(content: string, signature: string): boolean
}
```
```

### 3.8 实时连接 ❌ 未实现

```
提示词：实现 WebSocket 实时通信

需求：
- WebSocket 连接管理
- 心跳保活机制
- 断线重连策略
- 消息队列缓存

```typescript
class RealtimeService {
  private ws: WebSocket | null = null
  private heartbeatInterval: number = 30000
  private reconnectAttempts: number = 0
  private maxReconnectAttempts: number = 5
  
  connect(url: string): void
  disconnect(): void
  send(message: SpaceTimeMessage): void
  onMessage(callback: (msg: SpaceTimeMessage) => void): void
  onConnectionChange(callback: (connected: boolean) => void): void
}
```
```

---

## 🔧 通用组件提示词

### 热键提示浮层

```
提示词：创建 HotkeyOverlay.tsx 热键提示组件

需求：
- 首次使用延迟2.5秒自动弹出
- ? 键随时唤出/关闭
- 覆盖快捷键：
  - 播放控制：Space/←→
  - 音量控制：↑↓/M
  - 面板导航：Ctrl+K/Ctrl+F
  - 系统操作：Esc/?
- 中英双语支持
- macOS 自动检测 ⌘ 键
- 「不再提示」持久化

```typescript
function HotkeyOverlay({ onClose }: Props) {
  const hotkeys = [
    { category: '播放控制', keys: [
      { key: 'Space', desc: '播放/暂停' },
      { key: '← →', desc: '上一首/下一首' }
    ]},
    { category: '音量控制', keys: [
      { key: '↑ ↓', desc: '音量增减' },
      { key: 'M', desc: '静音' }
    ]},
    // ...
  ]
  
  return (
    <div className="hotkey-overlay">
      {hotkeys.map(group => (
        <div key={group.category}>
          <h3>{group.category}</h3>
          {group.keys.map(k => (
            <div key={k.key}>
              <kbd>{k.key}</kbd>
              <span>{k.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
```
```

---

## 📋 下一步建议

### 验证清单

```
1. 浏览器验证：
   - [ ] 热键浮层首次弹出时机
   - [ ] ? 键 toggle 行为
   - [ ] 「不再提示」持久化

2. 功能补全：
   - [ ] 消息墙独立面板
   - [ ] 真实 Geolocation API
   - [ ] 端到端加密实现
   - [ ] WebSocket 实时通信

3. 移动端验证：
   - [ ] MobileNavBar 底部导航
   - [ ] 沉浸模式手势下拉退出
   - [ ] 触控交互优化
```

---

<div align="center">

> YYC³ Team | D-Music Figma AI 提示词库

</div>
