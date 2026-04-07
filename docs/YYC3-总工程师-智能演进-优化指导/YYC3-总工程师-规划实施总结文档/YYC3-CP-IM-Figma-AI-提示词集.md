---
file: YYC3-CP-IM-Figma-AI-提示词集.md
description: YYC³ Cloud Intelli-Matrix Figma AI 设计提示词集
author: YanYuCloudCube Team <admin@0379.email>
version: v1.0.0
created: 2026-04-03
updated: 2026-04-03
status: active
tags: [figma],[ai-prompts],[ui-design],[ux-design]
category: design
language: zh-CN
audience: designers,developers
complexity: intermediate
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC³ Figma AI 设计提示词集

## 使用说明

本文档包含 YYC³ Cloud Intelli-Matrix 项目各阶段所需的 Figma AI 设计提示词。每个提示词针对特定的 UI/UX 需求，可直接用于 Figma AI 或其他 AI 设计工具。

**设计风格参考：**
- 主题：赛博朋克风格
- 主色调：深蓝色 `#060e1f` + 青色 `#00d4ff`
- 辅助色：紫色 `#7c3aed`、绿色 `#10b981`
- 字体：Inter / SF Pro
- 圆角：8px - 16px
- 阴影：玻璃拟态效果

---

## Phase 2: AI 能力增强

### 2.1 AI 对话面板优化

**提示词：**

```
Design a modern AI chat panel for a cyberpunk-themed monitoring application with the following requirements:

**Layout:**
- Full-height sidebar panel (320px width)
- Header with AI family member avatar, name, and status indicator
- Message area with alternating user/AI message bubbles
- Input area with text field and send button
- Quick action buttons for common prompts

**Visual Style:**
- Dark theme with deep blue background (#060e1f)
- Glass morphism effect for message bubbles
- Cyan accent color (#00d4ff) for AI responses
- Purple accent color (#7c3aed) for user messages
- Subtle glow effects on active elements
- Smooth animations for message appearance

**Components:**
- Avatar: Circular with gradient border, 40px diameter
- Message bubbles: Rounded corners (16px), max-width 80%
- Typing indicator: Animated dots with pulse effect
- Input field: Glass morphism style with focus glow
- Send button: Icon button with hover animation

**Interactions:**
- Messages fade in from bottom
- Typing indicator shows when AI is responding
- Input field expands on focus
- Quick actions slide in from right

**Responsive:**
- Collapsible sidebar for mobile view
- Full-screen mode option
- Touch-friendly button sizes (min 44px)

Please create a high-fidelity design with all states (default, hover, active, disabled).
```

### 2.2 代码补全悬浮提示

**提示词：**

```
Design a code completion tooltip for an AI-powered code editor with the following requirements:

**Layout:**
- Floating panel below cursor position
- Maximum width: 400px
- Maximum height: 300px (scrollable)
- Header with AI provider icon and confidence score
- List of completion suggestions
- Footer with keyboard shortcuts

**Visual Style:**
- Dark theme matching the application
- Glass morphism background with blur
- Cyan highlight for selected suggestion
- Code syntax highlighting in suggestions
- Confidence indicator as progress bar

**Components:**
- Suggestion item: Icon + code preview + confidence badge
- Selected state: Cyan border + subtle glow
- Scrollbar: Minimal, semi-transparent
- Keyboard hint: Small pill-shaped badges

**Interactions:**
- Smooth fade-in animation
- Keyboard navigation (up/down arrows)
- Tab to accept suggestion
- Esc to dismiss

Please create designs for:
1. Single suggestion state
2. Multiple suggestions state
3. Loading state
4. Error state
```

---

## Phase 3: 数据可视化提升

### 3.1 统一图表组件库

**提示词：**

```
Design a unified chart component library for a cyberpunk-themed monitoring dashboard with the following chart types:

**Chart Types:**
1. Line Chart - For time series data
2. Area Chart - For cumulative metrics
3. Bar Chart - For comparisons
4. Pie Chart - For distributions
5. Radar Chart - For multi-dimensional analysis
6. Gauge Chart - For KPIs

**Visual Style:**
- Dark theme with deep blue background
- Gradient fills using cyan (#00d4ff) to purple (#7c3aed)
- Grid lines: Semi-transparent (#1e293b)
- Axis labels: Light gray (#94a3b8)
- Data points: Glowing dots with pulse animation
- Tooltips: Glass morphism with blur effect

**Common Components:**
- Chart container: Rounded corners (12px), subtle border
- Legend: Horizontal layout with color indicators
- Axis: Minimal style with tick marks
- Grid: Dashed lines, low opacity
- Tooltip: Floating card with shadow

**Interactions:**
- Hover: Highlight data point + show tooltip
- Click: Drill-down animation
- Zoom: Smooth scale transition
- Pan: Smooth scroll for large datasets

**Responsive:**
- Charts resize proportionally
- Legend collapses to dropdown on mobile
- Touch-friendly interactions

Please create a design system with:
1. All chart types in default state
2. Hover states with tooltips
3. Selected/highlighted states
4. Empty state
5. Loading state
6. Error state
```

### 3.2 AI 诊断面板

**提示词：**

```
Design an AI diagnostics panel for a monitoring application with the following requirements:

**Layout:**
- Full-width panel with three sections
- Left: Anomaly detection results
- Center: Root cause analysis
- Right: Suggested actions

**Visual Style:**
- Dark theme with glass morphism cards
- Severity indicators: Red (critical), Orange (warning), Green (info)
- Animated pulse for active issues
- Progress indicators for analysis status
- Iconography: Line icons, 24px

**Components:**
- Anomaly card: Icon + title + severity + timestamp
- Root cause diagram: Flowchart style with connecting lines
- Action button: Primary/secondary styles
- Status badge: Pill-shaped with icon
- Confidence meter: Circular progress indicator

**Interactions:**
- Cards expand on click for details
- Actions have hover and pressed states
- Analysis progress shows animated steps
- Smooth transitions between states

**States:**
1. Idle - Waiting for data
2. Analyzing - Progress animation
3. Results - Show findings
4. Action taken - Confirmation feedback

Please create a comprehensive design with all states and interactions.
```

### 3.3 实时数据仪表板

**提示词：**

```
Design a real-time data dashboard for a cloud monitoring application with the following requirements:

**Layout:**
- Grid-based layout (12 columns)
- Top row: KPI cards (4 cards)
- Middle row: Main charts (2 large charts)
- Bottom row: Activity feed and alerts

**KPI Cards:**
- Large number with trend indicator
- Sparkline mini chart
- Status icon
- Comparison to previous period

**Main Charts:**
- Real-time line chart with live updates
- Animated data points
- Time range selector
- Full-screen toggle

**Activity Feed:**
- List of recent events
- Severity indicators
- Timestamps
- Expandable details

**Visual Style:**
- Cyberpunk theme with dark background
- Glowing accents for active elements
- Glass morphism for cards
- Subtle animations for data updates

**Interactions:**
- Auto-refresh with smooth transitions
- Hover to highlight related data
- Click to drill down
- Drag to rearrange widgets

Please create a responsive design that works on desktop and tablet views.
```

---

## Phase 4: 多 Agent 协作

### 4.1 协作引擎 UI

**提示词：**

```
Design a multi-agent collaboration interface for an AI family system with the following requirements:

**Layout:**
- Main canvas showing collaboration flow
- Left sidebar: Family member selection
- Right sidebar: Task details and results
- Bottom panel: Activity log

**Family Member Cards:**
- Avatar with status indicator
- Name and role
- Current task badge
- Capability tags
- Workload indicator

**Collaboration Flow:**
- Visual workflow diagram
- Task nodes with status
- Connection lines between agents
- Progress indicators
- Result aggregation node

**Task Panel:**
- Task description
- Assigned members
- Individual results
- Integrated result
- Confidence score

**Visual Style:**
- Dark theme with neon accents
- Glowing connections between agents
- Animated particles for data flow
- Glass morphism for panels

**Interactions:**
- Drag and drop to assign tasks
- Click to view member details
- Real-time status updates
- Animated task completion

Please create designs for:
1. Empty state - No active collaboration
2. Planning state - Task assignment
3. Active state - Agents working
4. Complete state - Results shown
```

### 4.2 任务分配器界面

**提示词：**

```
Design a task assignment interface for multi-agent collaboration with the following requirements:

**Layout:**
- Central task card
- Surrounding agent cards
- Connection lines showing assignments
- Priority and deadline indicators

**Task Card:**
- Title and description
- Required capabilities
- Priority level (high/medium/low)
- Deadline countdown
- Estimated effort

**Agent Cards:**
- Avatar and name
- Capability match score
- Current workload bar
- Availability status
- Accept/decline buttons

**Assignment Flow:**
- Drag task to agent
- Visual feedback on hover
- Confirmation animation
- Status update

**Visual Style:**
- Cyberpunk theme
- Glowing connections
- Color-coded priorities
- Smooth animations

**Interactions:**
- Drag and drop assignment
- Hover to preview match
- Click for detailed view
- Keyboard shortcuts

Please create all states and interactions.
```

---

## Phase 5: 开发工具升级

### 5.1 智能调试助手面板

**提示词：**

```
Design an intelligent debugging assistant panel for a developer IDE with the following requirements:

**Layout:**
- Split panel layout
- Left: Error analysis
- Right: Suggested fixes
- Bottom: Action buttons

**Error Analysis Section:**
- Error message with syntax highlighting
- Stack trace viewer (collapsible)
- Code context preview
- Root cause explanation
- Related errors list

**Suggested Fixes Section:**
- Fix cards with confidence score
- Code diff preview
- Apply button
- Explanation toggle

**Action Buttons:**
- Apply fix (primary)
- View documentation
- Report false positive
- Get more suggestions

**Visual Style:**
- Dark theme matching IDE
- Red accent for errors
- Green accent for fixes
- Code syntax highlighting
- Glass morphism panels

**Interactions:**
- Expandable sections
- Hover to preview fix
- Click to apply
- Smooth transitions

**States:**
1. Analyzing - Loading animation
2. Results - Show analysis
3. Applying - Progress indicator
4. Applied - Success feedback

Please create comprehensive designs for all states.
```

### 5.2 代码审查助手界面

**提示词：**

```
Design a code review assistant interface for an AI-powered IDE with the following requirements:

**Layout:**
- Inline review comments in code editor
- Summary panel on the right
- Action bar at the bottom

**Review Comments:**
- Inline marker in gutter
- Expandable comment card
- Severity indicator (error/warning/suggestion)
- Code snippet highlight
- Suggested improvement

**Summary Panel:**
- Overall score (0-100)
- Category breakdown
- Critical issues count
- Quick actions

**Quick Actions:**
- Fix all auto-fixable
- Generate report
- Configure rules
- Dismiss all

**Visual Style:**
- Dark theme
- Color-coded severity
- Subtle animations
- Clean typography

**Interactions:**
- Hover to preview
- Click to expand
- Accept/dismiss suggestions
- Navigate between issues

Please create designs for:
1. Single issue view
2. Multiple issues view
3. Summary panel
4. Configuration modal
```

### 5.3 断点推荐器界面

**提示词：**

```
Design a breakpoint recommendation interface for an intelligent debugger with the following requirements:

**Layout:**
- Inline markers in code editor
- Recommendation panel
- Quick actions

**Breakpoint Markers:**
- Gutter icon with glow effect
- Hover tooltip with reason
- Confidence indicator
- One-click toggle

**Recommendation Panel:**
- List of suggested breakpoints
- Reason for each suggestion
- Confidence score
- Add/remove buttons

**Quick Actions:**
- Add all recommended
- Clear all breakpoints
- Export breakpoints
- Import breakpoints

**Visual Style:**
- Dark theme
- Cyan accent for breakpoints
- Animated pulse for active breakpoints
- Glass morphism panels

**Interactions:**
- Hover to see reasoning
- Click to toggle breakpoint
- Drag to reorder
- Keyboard shortcuts

Please create designs for all states and interactions.
```

---

## Phase 6: 生产级落地

### 6.1 性能监控仪表板

**提示词：**

```
Design a performance monitoring dashboard for production deployment with the following requirements:

**Layout:**
- Header with system status
- KPI row (4 metrics)
- Main charts area
- Alerts and recommendations

**System Status:**
- Overall health indicator
- Uptime counter
- Active users count
- Response time gauge

**KPI Metrics:**
- CPU usage
- Memory usage
- Network I/O
- Error rate
- Each with trend and threshold

**Charts:**
- Response time distribution
- Request volume over time
- Error breakdown by type
- Resource utilization

**Alerts Panel:**
- Active alerts list
- Severity indicators
- Acknowledge button
- Escalation status

**Visual Style:**
- Dark theme
- Green/Yellow/Red status colors
- Smooth animations
- Real-time updates

**Interactions:**
- Click to drill down
- Hover for details
- Configure thresholds
- Export reports

Please create a comprehensive dashboard design.
```

### 6.2 安全审计面板

**提示词：**

```
Design a security audit panel for a production application with the following requirements:

**Layout:**
- Summary cards at top
- Vulnerability list
- Remediation panel
- Compliance score

**Summary Cards:**
- Critical vulnerabilities
- High/Medium/Low counts
- Last scan timestamp
- Compliance score gauge

**Vulnerability List:**
- Severity badge
- CVE ID
- Affected component
- Description preview
- Status indicator

**Remediation Panel:**
- Detailed description
- Affected code location
- Suggested fix
- References
- Apply fix button

**Visual Style:**
- Dark theme
- Red/Orange/Yellow/Green severity
- Clean typography
- Subtle animations

**Interactions:**
- Filter by severity
- Search vulnerabilities
- View details
- Apply fixes
- Generate report

Please create designs for all states and interactions.
```

---

## 通用组件

### G.1 玻璃拟态卡片

**提示词：**

```
Design a glass morphism card component for a cyberpunk-themed application with the following requirements:

**Visual Properties:**
- Semi-transparent background (rgba(15, 23, 42, 0.8))
- Backdrop blur (16px)
- Subtle border (1px, rgba(255, 255, 255, 0.1))
- Soft shadow
- Rounded corners (12px)

**States:**
- Default: Base glass effect
- Hover: Subtle glow, slight lift
- Active: Cyan border glow
- Disabled: Reduced opacity

**Variants:**
- Basic: Just the glass effect
- With header: Title bar with optional actions
- With footer: Action buttons at bottom
- Collapsible: Expandable content

**Sizes:**
- Small: Padding 12px
- Medium: Padding 16px
- Large: Padding 24px

Please create a component library with all variants and states.
```

### G.2 霓虹按钮

**提示词：**

```
Design a neon button component for a cyberpunk-themed application with the following requirements:

**Visual Style:**
- Glass morphism background
- Neon glow effect on hover
- Gradient border
- Smooth animations

**Variants:**
- Primary: Cyan glow (#00d4ff)
- Secondary: Purple glow (#7c3aed)
- Success: Green glow (#10b981)
- Danger: Red glow (#ef4444)
- Ghost: No background, just glow

**Sizes:**
- Small: 32px height, 12px padding
- Medium: 40px height, 16px padding
- Large: 48px height, 24px padding

**States:**
- Default: Base style
- Hover: Glow animation
- Active: Pressed effect
- Disabled: Reduced opacity, no glow
- Loading: Spinner animation

**Icon Support:**
- Left icon
- Right icon
- Icon only (square)

Please create a comprehensive button component library.
```

### G.3 数据输入组件

**提示词：**

```
Design data input components for a cyberpunk-themed application with the following requirements:

**Components:**
1. Text Input
2. Textarea
3. Select/Dropdown
4. Checkbox
5. Radio
6. Toggle Switch
7. Slider
8. Date Picker

**Visual Style:**
- Glass morphism background
- Cyan focus glow
- Subtle border
- Smooth transitions

**Text Input:**
- Label above
- Placeholder text
- Helper text below
- Error state with red border
- Icon support (left/right)

**Select:**
- Custom dropdown
- Search functionality
- Multi-select option
- Grouped options

**Checkbox/Radio:**
- Custom styled
- Animated check
- Indeterminate state

**Toggle:**
- Smooth slide animation
- Glow when on
- Label support

**Slider:**
- Custom track
- Glowing thumb
- Value display
- Range option

Please create a complete form component library with all states.
```

---

## 使用指南

### 如何使用这些提示词

1. **复制提示词** - 选择需要的提示词，完整复制
2. **粘贴到 Figma AI** - 在 Figma 的 AI 功能中粘贴
3. **调整参数** - 根据具体需求调整颜色、尺寸等
4. **生成设计** - 让 AI 生成初步设计
5. **迭代优化** - 根据反馈继续优化

### 设计一致性检查清单

- [ ] 颜色使用符合主题色板
- [ ] 圆角大小一致（8px/12px/16px）
- [ ] 间距遵循 4px 基准网格
- [ ] 字体大小符合层级规范
- [ ] 动画时长一致（150ms/300ms）
- [ ] 交互状态完整
- [ ] 响应式布局考虑

---

## 变更历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-04-03 | 初始版本，完整提示词集 | YanYuCloudCube Team |

---

*文档生成时间: 2026-04-03*
*YYC³ 团队 · 言启象限 | 语枢未来*
