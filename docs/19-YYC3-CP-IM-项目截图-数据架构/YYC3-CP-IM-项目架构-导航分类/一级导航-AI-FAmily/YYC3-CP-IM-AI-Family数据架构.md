# YYC³ AI Family — 数据架构分布图

> **模块**: AI Family (Sidebar: catAIFamily, 分组导航)
> **页面数**: 19 子页面 + 时钟首页
> **生成日期**: 2026-04-26

---

## 模块数据架构总图

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AI Family · 19 子页面 + 时钟首页                       │
│           8 AI 成员 · 14 Family Slices · 8 IDB Stores                    │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │  family-member-slice  │
                    │  8 AI 成员 (SSOT)     │
                    │  persist: yyc3-family │
                    │  -members             │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                     │
    ┌─────▼─────┐      ┌──────▼──────┐      ┌──────▼──────┐
    │family     │      │family       │      │IndexedDB    │
    │settings   │      │业务 Slices  │      │ 8 Stores    │
    │-slice     │      │ (12 个)     │      │             │
    │            │      │             │      │ agent_*     │
    │ providerKeys│    │ chat/message│      │ mcp_contexts│
    │ modelAssign│     │ calllog     │      │ inference   │
    │ voiceProf  │     │ activities  │      │ family_msg  │
    │ uiConfig   │     │ moments     │      │ family_act  │
    │ commMsg    │     │ medals      │      │ family_mem  │
    │            │      │ memories    │      │ family_bcast│
    │ persist:   │      │ milestones  │      │ music_lib   │
    │ yyc3-family│      │ posts/news  │      │             │
    │ -settings  │      │ skills      │      │             │
    └────────────┘      └─────────────┘      └─────────────┘
```

---

## 8 AI 成员档案

| ID | 名字 | 角色 | 颜色 | 默认模型 |
|----|------|------|------|----------|
| navigator | 元启·天枢 | 语义理解与导航 | `#FFD700` | 智谱 glm-4-plus |
| thinker | 万物·语枢 | 深度数据分析 | `#FF69B4` | DeepSeek deepseek-chat |
| prophet | 先知·预见 | 趋势预测与异常 | `#00BFFF` | DeepSeek deepseek-reasoner |
| bolero | 灵韵·玻雷罗 | 用户画像与推荐 | `#FFD700` | 智谱 glm-4-air |
| meta-oracle | 元枢·天机 | 全局调度与决策 | `#00BFFF` | DeepSeek deepseek-chat |
| sentinel | 守护·智云 | 安全分析与威胁 | `#00FF88` | DeepSeek deepseek-reasoner |
| master | 码神·元匠 | 代码审查与架构 | `#FFD700` | Ollama codegeex4:latest |
| creative | 灵犀·创想 | 多模态创意生成 | `#BF00FF` | 智谱 glm-4v-plus |

---

## 19 子页面数据源矩阵

### 🏠 家园 (3 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| home | FamilyHome | `useFamilyMemberSlice` | `yyc3-family-members` | ❌ 只读 |
| center | AIFamilyCenterPage | `useFamilyMemberSlice` | `yyc3-family-members` | ❌ 只读 |
| planning | AIFamilyDesignDoc | `useFamilyMemberSlice` | `yyc3-family-members` | ❌ 只读 |

### 💬 交流 (3 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| chat | FamilyChat | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |
| phone | FamilyPhone | `useFamilyMemberSlice` + MOCK_CALL_LOGS | 内存 (硬编码) | ⚠️ 部分 |
| share | FamilyShare | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |

### 📈 成长 (3 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| learn | FamilyLearn | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |
| growth | FamilyGrowth | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |
| activities | FamilyActivityCenter | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |

### 🎮 娱乐 (2 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| music | FamilyMusic | `MUSIC_LIBRARY` 硬编码 + useState | 内存 | ✅ 上传/删除 |
| fun | FamilyEntertainment | `useFamilyMemberSlice` | `yyc3-family-members` | ✅ |

### ⚙️ 运维 (5 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| models | FamilyModelSettings | `useFamilyMemberSlice` + `useFamilySettingsSlice` | 2 Slices | ✅ CRUD |
| voice | FamilyVoiceSystem | `useFamilyMemberSlice` + `useFamilySettingsSlice` | 2 Slices | ✅ CRUD |
| data | FamilyDataHub | `useFamilyMemberSlice` (×4) | `yyc3-family-members` | ✅ |
| comm | FamilyCommCenter | `useFamilyMemberSlice` + `useFamilySettingsSlice` | 2 Slices | ✅ |
| hotel | FamilyHotel | `useFamilyMemberSlice` | `yyc3-family-members` | ⚠️ 已提升 |

### 🔧 配置 (1 页)

| 子页面 | 组件 | 数据源 | 存储 | 可编辑 |
|--------|------|--------|------|--------|
| settings | FamilyUISettings | `useFamilyMemberSlice` + `useFamilySettingsSlice` | 2 Slices | ✅ 全量 |

### 独立导航 (已提升)

| 页面 | 组件 | 数据源 | 存储 | 可编辑 |
|------|------|--------|------|--------|
| /hotel | HotelDashboard | useState (无持久化) | 内存 | ⚠️ 需改造 |
| /comm-station | CommStationPanel | `usePersistedList("comm_stations")` | IndexedDB | ✅ CRUD |

---

## 14 Family Slices 数据分布

```
family-member-slice     ← 8 成员 SSOT (全员共用)
    ↓ 所有页面读取

family-settings-slice   ← 全局配置 (providerKeys / modelAssignments / voiceProfiles / uiConfig / commMessages)
    ↓ models / voice / settings / comm 页面读写

family-chat-slice       ← 聊天频道
family-message-slice    ← 消息记录
family-calllog-slice    ← 通话记录
family-activities-slice ← 活动数据
family-moments-slice    ← 动态
family-medals-slice     ← 勋章
family-memories-slice   ← 记忆
family-milestones-slice ← 里程碑
family-posts-slice      ← 帖子
family-news-slice       ← 新闻
family-skills-slice     ← 课程/技能
```

---

## 时钟首页架构 (不可改动，可增强)

```
AIFamilyPage.tsx
├── useClock()           → 真实时钟 Hook
├── useFamilyMemberSlice → 8 成员数据
├── CLOCK_SLOTS[8]       → 环形布局坐标
├── activeSpeaker 轮换   → 模拟发言状态
├── selectedMember       → MemberDetailDrawer
│   ├── 角色定位
│   ├── 核心职责
│   ├── 核心能力
│   ├── 运行指标 (伪随机)
│   └── 快速操作
│       ├── "对话" → /ai-family/chat ✅
│       └── "任务分配" → /ai-family/activities ✅
└── FamilyHome 入口链接 → 13 个快捷入口
```

---

*YYC³ 数据架构文档 · AI Family · 2026-04-26*
