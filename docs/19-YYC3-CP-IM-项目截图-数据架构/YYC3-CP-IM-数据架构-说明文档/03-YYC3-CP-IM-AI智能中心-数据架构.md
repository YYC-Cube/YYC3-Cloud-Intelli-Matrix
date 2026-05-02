# YYC³ AI 智能中心 — 数据架构分布图

> **模块**: AI 智能中心 (Sidebar: catAI)
> **页面数**: 4
> **生成日期**: 2026-04-26

---

## 模块数据架构总图

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI 智能中心 · 4 页面                           │
│                  模型管理 · AI决策 · 诊断 · SDK                   │
└─────────────────────────────────────────────────────────────────┘

              ┌──────────────────────────────┐
              │     provider-slice            │
              │     3 内置提供商:              │
              │     智谱 / DeepSeek / Ollama   │
              │     persist: yyc3-provider     │
              └──────┬──────────┬─────────────┘
                     │          │
     ┌───────────────┼──────────┼───────────────┐
     │               │          │               │
┌────▼────┐   ┌─────▼───┐ ┌──▼────────┐ ┌────▼─────┐
│ /ai     │   │/models  │ │/ai-diag   │ │/sdk-chat │
│ AI决策  │   │模型管理 │ │ AI诊断    │ │ SDK对话  │
│         │   │         │ │           │ │          │
│AISugges │   │ModelPro │   │AIDiagnos │   │SDKChat  │
│tionPanel│   │viderPanel│ │tics      │   │Panel    │
└─────────┘   └─────────┘ └───────────┘ └──────────┘
     │               │          │               │
     │          ┌────▼────┐     │          ┌────▼────┐
     │          │model    │     │          │sdk      │
     │          │-slice   │     │          │-session │
     │          │persist  │     │          │-slice   │
     │          └─────────┘     │          │persist  │
     │                          │          └─────────┘
┌────▼────────┐          ┌────▼────┐
│ai-suggestion│          │IDB:     │
│-slice       │          │diagnosis│
│persist      │          │History  │
└─────────────┘          └─────────┘
```

---

## 核心数据: 提供商系统

### provider-slice (BUILTIN_PROVIDERS)

```
┌─────────────────────────────────────────────────┐
│              3 内置 AI 提供商                     │
├──────────────┬──────────────┬───────────────────┤
│ 智谱 Z.ai    │ DeepSeek     │ Ollama (本地)      │
├──────────────┼──────────────┼───────────────────┤
│ glm-4-flash  │ deepseek     │ codegeex4:latest  │
│ glm-4-plus   │ -chat        │ qwen2.5:7b        │
│ glm-4-air    │ deepseek     │ gpt-oss:120b      │
│ glm-4-airx   │ -coder       │ nomic-embed-text  │
│ glm-4-long   │ deepseek     │ deepseek-v3.1:671b│
│ glm-4v-plus  │ -reasoner    │ qwen2.5-coder:1.5b│
├──────────────┼──────────────┼───────────────────┤
│ auth: api-key│ auth: bearer │ auth: none        │
│ 云端         │ 云端         │ localhost:11434   │
└──────────────┴──────────────┴───────────────────┘
```

### DEFAULT_MODEL_ASSIGNMENTS (8 成员)

| 成员 | 提供商 | 模型 | 用途 |
|------|--------|------|------|
| 天枢·元启 (navigator) | 智谱 | glm-4-plus | 语义理解与意图识别 |
| 万物·语枢 (thinker) | DeepSeek | deepseek-chat | 深度数据分析与洞察 |
| 先知·预见 (prophet) | DeepSeek | deepseek-reasoner | 趋势预测与异常检测 |
| 灵韵·玻雷罗 (bolero) | 智谱 | glm-4-air | 用户画像与推荐 |
| 元枢·天机 (meta-oracle) | DeepSeek | deepseek-chat | 全局调度与决策优化 |
| 守护·智云 (sentinel) | DeepSeek | deepseek-reasoner | 安全分析与威胁检测 |
| 码神·元匠 (master) | Ollama | codegeex4:latest | 代码审查与架构分析 |
| 灵犀·创想 (creative) | 智谱 | glm-4v-plus | 多模态创意生成 |

---

## 页面数据源详解

### 1. AI 决策 `/ai` — AISuggestionPanel.tsx
- **Slice**: `ai-suggestion-slice` → `yyc3-ai-suggestion` (persist)
- **Hook**: `useBigModelSDK()` — AI SDK 调用
- **功能**: AI 建议 + 智能推荐

### 2. 模型管理 `/models` — ModelProviderPanel.tsx
- **Slice**: `provider-slice` → `yyc3-provider-slice` (persist)
- **Slice**: `model-slice` → `yyc3-model-slice` (persist)
- **功能**: 提供商管理 + 模型列表 + 连接测试
- **CRUD**: ✅ 完整 (增删改查提供商和模型)

### 3. AI 诊断 `/ai-diagnosis` — AIDiagnostics.tsx
- **Hook**: `usePersistedList("diagnosisHistory")` — 诊断记录
- **IDB**: `diagnosisHistory` — 历史诊断
- **CRUD**: ✅ 完整

### 4. SDK 对话 `/sdk-chat` — SDKChatPanel.tsx
- **Slice**: `sdk-session-slice` → `yyc3-sdk-session` (persist)
- **Hook**: `useBigModelSDK()` — 实际 SDK 调用
- **功能**: 多轮对话 + 上下文管理

---

## AI SDK 调用链

```
UI 按钮/输入
    → useBigModelSDK()
    → provider-slice 获取提供商配置 + API Key
    → fetch(provider.baseUrl + "/chat/completions", { model, messages })
    → 响应 → 渲染
    → 错误 → fallback 模拟响应
```

---

*YYC³ 数据架构文档 · AI 智能中心 · 2026-04-26*
