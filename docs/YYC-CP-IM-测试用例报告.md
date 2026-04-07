# 测试用例报告  执行时间：2026-04-06  12：35


 ✓ src/app/__tests__/lib/disaster-recovery.test.ts (21 tests) 2783ms
       ✓ should run all drills and generate report  943ms
 ✓ src/app/__tests__/lib/performance-benchmark.test.ts (35 tests) 1810ms
 ✓ src/app/__tests__/Login.test.tsx (13 tests) 1410ms
     ✓ should call onGhostLogin when ghost mode is activated  620ms
     ✓ should prevent multiple ghost login activations  616ms
 ✓ src/app/__tests__/usePatrol.test.tsx (16 tests) 1639ms
       ✓ 运行巡查后应产生结果  406ms
       ✓ 巡查结果应包含检查项  406ms
       ✓ 巡查结果应正确统计各状态数  406ms
       ✓ auto 触发类型应正确记录  404ms
 ✓ src/app/__tests__/FamilyUISettings.test.tsx (23 tests) 1319ms
 ✓ src/app/__tests__/FollowUpDrawer.test.tsx (18 tests) 1400ms
       ✓ 切换到 AI 建议 tab 应加载建议  1215ms
 ✓ src/app/__tests__/InlineEditableTable.test.tsx (45 tests) 841ms
 ✓ src/app/__tests__/performance-optimizer.test.ts (18 tests) 1209ms
       ✓ 应该在查询时间过长时提供建议  1102ms
 ✓ src/app/__tests__/rf-phase2.test.ts (29 tests) 1368ms
     ✓ routes.ts 导出 router 对象  1277ms
 ✓ src/app/__tests__/CreateRuleModal.test.tsx (49 tests) 1242ms
 ✓ src/app/__tests__/lib/deployment-manager.test.ts (22 tests) 1446ms
       ✓ should rollback to previous version  303ms
 ✓ src/app/__tests__/usePersistedState.test.ts (12 tests) 591ms
 ✓ src/app/__tests__/FamilyVoiceSystem.test.tsx (10 tests) 507ms
 ✓ src/app/__tests__/AIAssistant.test.tsx (29 tests) 454ms
 ✓ src/app/__tests__/useTerminal.test.ts (69 tests) 455ms
       ✓ should execute ai command and auto-execute suggestion  410ms
 ✓ src/app/__tests__/FamilyModelSettings.test.tsx (14 tests) 488ms
stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > getSyncQueue > should return stored queue
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > addToSyncQueue > should add item with generated id and timestamp
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > addToSyncQueue > should persist to localStorage
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > processSyncQueue > should process all items successfully
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

 ✓ src/app/__tests__/useBigModelSDK.test.ts (22 tests) 13249ms
       ✓ 应该在 Mock 模式下返回模拟响应  509ms
       ✓ 应该根据输入内容返回不同的模拟响应  1350ms
       ✓ 应该更新使用统计  310ms
       ✓ 应该流式返回模拟响应  4362ms
       ✓ 应该逐字符更新流式内容  4414ms
       ✓ 应该处理空消息  807ms
       ✓ 应该处理没有活跃会话的情况  995ms
       ✓ 应该计算平均延迟  482ms
stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > processSyncQueue > should retry items that fail sync
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > processSyncQueue > should not retry items after max retries
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > registerBackgroundSync > should return false when serviceWorker is not available
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > registerBackgroundSync > should return false when SyncManager is not available
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > clearSyncQueue > should remove all items from queue
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

stdout | src/app/__tests__/backgroundSync.test.ts > backgroundSync > getSyncQueueStats > should return correct stats for populated queue
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步
[BackgroundSync] 浏览器不支持后台同步，将使用在线时主动同步

 ✓ src/app/__tests__/backgroundSync.test.ts (14 tests) 409ms
stderr | src/app/__tests__/ColorPicker.test.tsx > ColorPicker > Canvas交互 > should handle mouse down on SV canvas
Received NaN for the `value` attribute. If this is expected, cast the value to a string.

 ✓ src/app/__tests__/ColorPicker.test.tsx (30 tests) 339ms
 ✓ src/app/__tests__/EnvConfigEditor.test.tsx (11 tests) 345ms
 ✓ src/app/__tests__/FileExplorer.test.tsx (12 tests) 354ms
 ✓ src/app/__tests__/AlertRulesPanel.test.tsx (29 tests) 397ms
 ✓ src/app/__tests__/TopBar.test.tsx (22 tests) 317ms
 ✓ src/app/__tests__/IntegratedTerminal.test.tsx (18 tests) 322ms
stdout | src/app/__tests__/utils/test-utils.test.ts > Performance Test Helpers > measurePerformance > should measure synchronous function performance
[Performance] sync-test: 0.00ms

stdout | src/app/__tests__/utils/test-utils.test.ts > Performance Test Helpers > measurePerformance > should measure async function performance
[Performance] async-test: 11.39ms

stdout | src/app/__tests__/utils/test-utils.test.ts > Performance Test Helpers > createPerformanceBenchmark > should run benchmark and return statistics
[Benchmark] test-benchmark (10 iterations):
  Total: 0.06ms
  Average: 0.01ms
  Min: 0.00ms
  Max: 0.05ms

 ✓ src/app/__tests__/SDKChatPanel.test.tsx (16 tests) 267ms
 ✓ src/app/__tests__/data-flow-pipeline.test.ts (31 tests) 307ms
 ✓ src/app/__tests__/utils/test-utils.test.ts (44 tests) 324ms
 ✓ src/app/__tests__/PatrolHistory.test.tsx (9 tests) 249ms
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
 ✓ src/app/__tests__/VinylPhotoPlayer.test.tsx (14 tests) 246ms
 ✓ src/app/__tests__/CommandPalette.test.tsx (11 tests) 256ms
 ✓ src/app/__tests__/TabBar.test.tsx (10 tests) 212ms
 ✓ src/app/__tests__/ThemeCustomizer.test.tsx (8 tests) 205ms
 ✓ src/app/__tests__/RefactoringReport.test.tsx (6 tests) 207ms
Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render performance monitor page
The tag <stop> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <linearGradient> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
The tag <defs> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

Not implemented: HTMLCanvasElement's getContext() method: without installing the canvas npm package
stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render web vitals section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

 ✓ src/app/__tests__/a11y-audit.test.tsx (5 tests) 220ms
stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render memory section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render fps section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render resources section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render storage section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render alerts section
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render refresh button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render export button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/PerformanceMonitor.test.tsx > PerformanceMonitor > should render alert toggle
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

 ✓ src/app/__tests__/PerformanceMonitor.test.tsx (10 tests) 179ms
 ✓ src/app/__tests__/FollowUpCard.test.tsx (17 tests) 186ms
 ✓ src/app/__tests__/ComponentShowcase.test.tsx (13 tests) 126ms
 ✓ src/app/__tests__/PatrolReport.test.tsx (15 tests) 116ms
 ✓ src/app/__tests__/CreationStudio.test.tsx (12 tests) 144ms
 ✓ src/app/__tests__/PWAStatusPanel.test.tsx (11 tests) 116ms
stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render operation audit page
The tag <stop> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <linearGradient> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
The tag <defs> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.

stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render search input
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render filter buttons
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render audit logs table
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render export button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/OperationAudit.test.tsx > OperationAudit > should render summary cards
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

 ✓ src/app/__tests__/OperationAudit.test.tsx (6 tests) 144ms
 ✓ src/app/__tests__/IDELayout.test.tsx (16 tests) 149ms
 ✓ src/app/__tests__/QueryCache.test.ts (18 tests) 155ms
 ✓ src/app/__tests__/PanelToolbar.test.tsx (25 tests) 148ms
 ✓ src/app/__tests__/NotFound.test.tsx (11 tests) 126ms
 ✓ src/app/__tests__/EmotionVisualizer.test.tsx (8 tests) 127ms
 ✓ src/app/__tests__/PWAInstallPrompt.test.tsx (6 tests) 98ms
 ✓ src/app/__tests__/BottomNav.test.tsx (9 tests) 118ms
 ✓ src/app/__tests__/DataEditorPanel.test.tsx (8 tests) 105ms
stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render dashboard page
The tag <stop> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <linearGradient> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <defs> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.

stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render chart tabs on mobile
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render refresh button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render panorama button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

 ✓ src/app/__tests__/Dashboard.test.tsx (4 tests) 78ms
 ✓ src/app/__tests__/ArchitectureAudit.test.tsx (6 tests) 95ms
 ✓ src/app/__tests__/ErrorBoundary.test.tsx (14 tests) 127ms
 ✓ src/app/__tests__/useLocalDatabase.test.ts (33 tests) 17152ms
       ✓ enableBackend=false 时不发起真实网络请求  2002ms
       ✓ enableBackend=true 时尝试发起 fetch 请求  3612ms
       ✓ enableBackend=true 但后端不可达时回退 Mock  3859ms
       ✓ enableBackend=true + maxRetries=0 时只请求一次  2003ms
       ✓ enableBackend=true + maxRetries=2 且持续失败时最多重试 3 次  3647ms
       ✓ enableBackend=true + 4xx 错误不重试  2004ms
 ✓ src/app/__tests__/SystemSettings.test.tsx (6 tests) 107ms
 ✓ src/app/__tests__/ColorSwatch.test.tsx (9 tests) 120ms
 ✓ src/app/__tests__/StageReview.test.tsx (14 tests) 96ms
 ✓ src/app/__tests__/AddModelModal.test.tsx (12 tests) 101ms
 ✓ src/app/__tests__/YYC3Logo.test.tsx (16 tests) 105ms
 ✓ src/app/__tests__/Panel.test.tsx (13 tests) 97ms
 ✓ src/app/__tests__/DevGuidePage.test.tsx (6 tests) 96ms
 ✓ src/app/__tests__/DesignSystemPage.test.tsx (6 tests) 100ms
 ✓ src/app/__tests__/ServiceConnectionTest.test.tsx (4 tests) 81ms
 ✓ src/app/__tests__/DataFlowDiagram.test.tsx (10 tests) 106ms
 ✓ src/app/__tests__/Layout.test.tsx (17 tests) 113ms
stderr | src/app/__tests__/usePerformanceMonitor.test.ts > usePerformanceMonitor > long tasks > should handle PerformanceObserver errors gracefully
[vitest] The PerformanceObserver mock did not use 'function' or 'class' in its implementation, see https://vitest.dev/api/vi#vi-spyon for examples.

 ✓ src/app/__tests__/NodeDetailModal.test.tsx (16 tests) 96ms
 ✓ src/app/__tests__/LogViewer.test.tsx (11 tests) 93ms
 ✓ src/app/__tests__/usePerformanceMonitor.test.ts (23 tests) 94ms
 ✓ src/app/__tests__/DesignTokens.test.tsx (16 tests) 89ms
 ✓ src/app/__tests__/ReportExporter.test.tsx (5 tests) 81ms
 ✓ src/app/__tests__/ReportGenerator.test.tsx (13 tests) 112ms
 ✓ src/app/__tests__/UserManagement.test.tsx (5 tests) 81ms
 ✓ src/app/__tests__/CLITerminal.test.tsx (14 tests) 66ms
 ✓ src/app/__tests__/AIDiagnostics.test.tsx (8 tests) 89ms
 ✓ src/app/__tests__/OperationChain.test.tsx (8 tests) 78ms
 ✓ src/app/__tests__/ModelProviderPanel.test.tsx (7 tests) 83ms
 ✓ src/app/__tests__/IDEStatusBar.test.tsx (14 tests) 82ms
 ✓ src/app/__tests__/PatternAnalyzer.test.tsx (10 tests) 82ms
Warning: A vi.mock("../hooks/useAISuggestion") call in "/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/AISuggestionPanel.test.tsx" is not at the top level of the module. Although it appears nested, it will be hoisted and executed before any tests run. Move it to the top level to reflect its actual execution order. This will become an error in a future version.
See: https://vitest.dev/guide/mocking/modules#how-it-works
 ✓ src/app/__tests__/ServiceLoopPanel.test.tsx (6 tests) 58ms
 ✓ src/app/__tests__/PatrolScheduler.test.tsx (12 tests) 66ms
 ✓ src/app/__tests__/AISuggestionPanel.test.tsx (8 tests) 68ms
 ✓ src/app/__tests__/FileBrowser.test.tsx (15 tests) 67ms
 ✓ src/app/__tests__/OperationLogStream.test.tsx (10 tests) 80ms
 ✓ src/app/__tests__/HostFileManager.test.tsx (6 tests) 65ms
 ✓ src/app/__tests__/PatrolDashboard.test.tsx (5 tests) 59ms
 ✓ src/app/__tests__/ActionRecommender.test.tsx (12 tests) 67ms
 ✓ src/app/__tests__/OperationCenter.test.tsx (5 tests) 66ms
 ✓ src/app/__tests__/LoopStageCard.test.tsx (11 tests) 57ms
 ✓ src/app/__tests__/PanelContainer.test.tsx (15 tests) 65ms
 ✓ src/app/__tests__/DatabaseManager.test.tsx (4 tests) 69ms
 ✓ src/app/__tests__/SecurityMonitor.test.tsx (6 tests) 66ms
 ✓ src/app/__tests__/QuickActionGrid.test.tsx (8 tests) 64ms
 ✓ src/app/__tests__/i18n-packs.test.ts (10 tests) 42ms
 ✓ src/app/__tests__/DatabaseConnectionPanel.test.tsx (6 tests) 53ms
 ✓ src/app/__tests__/useKeyboardShortcuts.test.tsx (13 tests) 17ms
 ✓ src/app/__tests__/OperationTemplate.test.tsx (9 tests) 68ms
 ✓ src/app/__tests__/useWebSocketData.test.tsx (50 tests) 59ms
 ✓ src/app/__tests__/ConfigExportCenter.test.tsx (5 tests) 59ms
 ✓ src/app/__tests__/yyc3-storage.test.ts (16 tests) 10ms
 ✓ src/app/__tests__/AlertBanner.test.tsx (11 tests) 50ms
 ✓ src/app/__tests__/e2e-integration.test.ts (18 tests) 38ms
 ✓ src/app/__tests__/ConnectionStatus.test.tsx (13 tests) 59ms
 ✓ src/app/__tests__/Workspace.test.tsx (5 tests) 47ms
 ✓ src/app/__tests__/LanguageSwitcher.test.tsx (9 tests) 47ms
 ✓ src/app/__tests__/IDEPanel.test.tsx (10 tests) 45ms
 ✓ src/app/__tests__/types.test.ts (35 tests) 31ms
 ✓ src/app/__tests__/OfflineIndicator.test.tsx (5 tests) 45ms
 ✓ src/app/__tests__/LocalFileManager.test.tsx (5 tests) 41ms
 ✓ src/app/__tests__/performance-monitor.test.ts (25 tests) 35ms
 ✓ src/app/__tests__/PanelContent.test.tsx (8 tests) 37ms
 ✓ src/app/__tests__/NetworkConfig.test.tsx (6 tests) 49ms
stderr | src/app/__tests__/VinylPhotoPlayer.integration.test.tsx > VinylPhotoPlayer Integration Tests > 播放控制集成 > should have volume control
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

 ✓ src/app/__tests__/useYYC3Head.test.ts (9 tests) 35ms
 ✓ src/app/__tests__/VinylPhotoPlayer.integration.test.tsx (22 tests) 47ms
 ✓ src/app/__tests__/useAIDiagnostics.test.ts (15 tests) 22ms
 ✓ src/app/__tests__/core-integration.test.tsx (33 tests) 28ms
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
 ✓ src/app/__tests__/useAudioEngine.test.tsx (20 tests) 30ms
 ✓ src/app/__tests__/useSecurityMonitor.test.tsx (13 tests) 21ms
 ✓ src/app/__tests__/usePatrol.test.ts (14 tests) 24ms
 ✓ src/app/__tests__/useTerminal.test.tsx (24 tests) 21ms
 ✓ src/app/__tests__/useFollowUp.test.tsx (17 tests) 19ms
 ✓ src/app/__tests__/OperationCategory.test.tsx (7 tests) 38ms
 ✓ src/app/__tests__/network-utils.test.ts (19 tests) 20ms
 ✓ src/app/__tests__/useMusicPlayer.test.ts (35 tests) 28ms
 ✓ src/app/__tests__/CreationStudio.integration.test.tsx (19 tests) 35ms
stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should initialize with default state
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should connect to WebSocket
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should handle manual reconnect
[WebSocket] 连接成功
[WebSocket] 连接关闭: 0 
[WebSocket] 925.113686437791ms 后尝试第 1 次重连

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should handle manual reconnect
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should clear alerts
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have nodes data
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have last sync time
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have QPS trend
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have latency trend
[WebSocket] 连接成功

 ✓ src/app/__tests__/useWebSocketDataEnhanced.test.ts (9 tests) 29ms
 ✓ src/app/__tests__/i18n-loop-devguide.test.ts (12 tests) 28ms
 ✓ src/app/__tests__/useReportExporter.test.ts (15 tests) 32ms
 ✓ src/app/__tests__/useInstallPrompt.test.ts (10 tests) 23ms
 ✓ src/app/__tests__/useLocalFileSystem.test.tsx (37 tests) 27ms
 ✓ src/app/__tests__/CodeEditor.test.tsx (74 tests) 32ms
 ✓ src/app/__tests__/rf001-ws-url-unification.test.ts (5 tests) 25ms
 ✓ src/app/__tests__/usePWAManager.test.ts (15 tests) 20ms
 ✓ src/app/__tests__/DataMonitoring.test.tsx (2 tests) 14ms
Not implemented: HTMLMediaElement's load() method
 ✓ src/app/__tests__/useAudioEngine.test.ts (19 tests) 28ms
 ✓ src/app/__tests__/useAlertRules.test.ts (21 tests) 23ms
 ✓ src/app/__tests__/FamilyMusic.integration.test.tsx (14 tests) 27ms
 ✓ src/app/__tests__/websocket-manager.test.ts (16 tests) 12ms
 ✓ src/app/__tests__/useServiceLoop.test.ts (16 tests) 21ms
 ✓ src/app/__tests__/useAISuggestion.test.ts (12 tests) 28ms
 ✓ src/app/__tests__/GlassCard.test.tsx (9 tests) 27ms
 ✓ src/app/__tests__/useKeyboardShortcuts.test.ts (19 tests) 20ms
 ✓ src/app/__tests__/useModelProvider.test.ts (19 tests) 21ms
stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该正确检测非 Electron 环境
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该在非 Electron 环境中提供降级方案
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该在非 Electron 环境中提供降级方案
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/integration.test.ts (12 tests) 16ms
 ✓ src/app/__tests__/useI18n.test.tsx (13 tests) 17ms
(node:67903) MaxListenersExceededWarning: Possible EventTarget memory leak detected. 11 message listeners added to BroadcastChannel. MaxListeners is 10. Use events.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/app/__tests__/useSettingsStore.test.tsx (13 tests) 17ms
 ✓ src/app/__tests__/useMobileView.test.ts (13 tests) 24ms
 ✓ src/app/__tests__/useOfflineMode.test.ts (16 tests) 23ms
 ✓ src/app/__tests__/security-audit.test.ts (21 tests) 20ms
 ✓ src/app/__tests__/usePushNotifications.test.ts (19 tests) 20ms
 ✓ src/app/__tests__/settings-model-unified-dataflow.test.ts (24 tests) 12ms
 ✓ src/app/__tests__/useSecurityMonitor.test.ts (10 tests) 20ms
 ✓ src/app/__tests__/useFollowUp.test.ts (11 tests) 17ms
 ✓ src/app/__tests__/integration/integration.test.ts (18 tests) 15ms
 ✓ src/app/__tests__/useSettingsStore.test.ts (12 tests) 18ms
 ✓ src/app/__tests__/useEmotionMusic.test.ts (11 tests) 15ms
 ✓ src/app/__tests__/useValidation.test.ts (52 tests) 15ms
 ✓ src/app/__tests__/useI18n.test.ts (12 tests) 18ms
 ✓ src/app/__tests__/useNetworkConfig.test.ts (9 tests) 16ms
 ✓ src/app/__tests__/useResponsive.test.ts (12 tests) 18ms
 ✓ src/app/__tests__/useMobileView.test.tsx (8 tests) 12ms
 ✓ src/app/__tests__/useValidation.test.tsx (19 tests) 18ms
 ✓ src/app/__tests__/useModelProvider.test.tsx (14 tests) 18ms
stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture Error instance
[YYC³ UNKNOWN] Test error message Error: Test error message
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:154:19
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture string error
[YYC³ UNKNOWN] String error 

stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture object with message
[YYC³ UNKNOWN] Object error 

stderr | src/app/__tests__/error-handler.test.ts > captureError > should use provided category and severity
[YYC³ AUTH] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:177:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should include source when provided
[YYC³ UNKNOWN] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:187:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should include detail when provided
[YYC³ UNKNOWN] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:195:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureValidationError > should capture validation errors
[YYC³ VALIDATION] [email] Invalid email; [name] Required

stderr | src/app/__tests__/error-handler.test.ts > captureNetworkError > should capture network error
[YYC³ NETWORK] Network failed

stderr | src/app/__tests__/error-handler.test.ts > captureWSError > should capture WebSocket error
[YYC³ NETWORK] WS failed

stderr | src/app/__tests__/error-handler.test.ts > captureAuthError > should capture auth error
[YYC³ AUTH] Auth failed Error: Auth failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:255:39
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureParseError > should capture parse error
[YYC³ PARSE] Parse failed

stderr | src/app/__tests__/error-handler.test.ts > trySafe > should return error on failure
[YYC³ UNKNOWN] Failed Error: Failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:283:64
    at Module.trySafe (/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/error-handler.ts:380:26)
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:283:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)

stderr | src/app/__tests__/error-handler.test.ts > trySafeSync > should return error on failure
[YYC³ UNKNOWN] Failed Error: Failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:301:13
    at Module.trySafeSync (/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/error-handler.ts:393:20)
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:300:29
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)

stdout | src/app/__tests__/error-handler.test.ts > installGlobalErrorListeners > should install listeners only once
[YYC³] 全局错误监听器已安装

 ✓ src/app/__tests__/error-handler.test.ts (33 tests) 9ms
 ✓ src/app/__tests__/useHostFileSystem.test.ts (15 tests) 17ms
 ✓ src/app/__tests__/lib/alerting-manager.test.ts (19 tests) 5ms
stdout | src/app/__tests__/MusicEventBus.test.ts > MusicEventBus > 调试模式 > should enable debug mode
[MusicEventBus] Emitting: {
  type: 'music:command',
  payload: {
    command: 'play',
    params: undefined,
    source: 'ui',
    timestamp: 1775450028336
  }
}

 ✓ src/app/__tests__/MusicEventBus.test.ts (41 tests) 9ms
stderr | src/app/__tests__/lib/api-config-enhanced.test.ts > API Configuration > setAPIConfig > should validate config before saving
[api-config] 配置验证失败: 配置验证失败:
❌ [fsBase] Invalid input
   💡 建议: 示例: /api/fs 或 http://localhost:3000/api/fs
[YYC³ VALIDATION] 配置验证失败:
❌ [fsBase] Invalid input
   💡 建议: 示例: /api/fs 或 http://localhost:3000/api/fs

 ✓ src/app/__tests__/lib/api-config-enhanced.test.ts (24 tests) 10ms
 ✓ src/app/__tests__/broadcast-channel.test.ts (13 tests) 7ms
 ✓ src/app/__tests__/DatabaseAdapter.integration.test.ts (12 tests) 8ms
 ✓ src/app/__tests__/color-utils.test.ts (29 tests) 5ms
stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > getBridgeAPI > should return null in web environment
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > readFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > writeFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > deleteFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > exists > should return false when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > listDirectory > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > listDirectory > should support recursive option
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > getFileInfo > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > createDirectory > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > copyFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > moveFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > execute > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > query > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > query > should accept generic type parameter
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > backup > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > restore > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > migrate > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getCPUInfo > should return default CPU info when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getMemoryInfo > should return default memory info when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getDiskInfo > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getNetworkInfo > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getProcesses > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getVersion > should return web version when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getPath > should return empty string when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getConfig > should return default config when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > restart > should reload page when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > quit > should try to close window when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showOpenDialog > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showSaveDialog > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showMessage > should use alert and return 0 when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > openExternal > should use window.open when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > openPath > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > execute > should throw error when not in Electron
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/lib/bridge-client-enhanced.test.ts (34 tests) 9ms
 ✓ src/app/__tests__/ide-mock-data.test.ts (54 tests) 5ms
 ✓ src/app/__tests__/dmusic-resources.test.ts (23 tests) 9ms
stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 环境检测 > 应该在没有桥接 API 时返回 null
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中抛出写入错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中返回 false
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中返回空数组
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出查询错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出备份错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回默认 CPU 信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回默认内存信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空磁盘信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空网络信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空进程信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回 web 版本
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回空路径
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回默认配置
[Bridge] Not running in Electron environment

Not implemented: navigation to another Document
stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中重新加载页面
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中关闭窗口
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中抛出保存错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中使用 alert
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中打开新窗口
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中抛出路径错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中抛出执行错误
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/bridge-client.test.ts (25 tests) 8ms
 ✓ src/app/__tests__/ConnectionManager.test.ts (14 tests) 7ms
 ✓ src/app/__tests__/state-sync-manager.test.ts (21 tests) 8ms
 ✓ src/app/__tests__/api-config.test.ts (20 tests) 8ms
 ✓ src/app/__tests__/i18n-consistency.test.ts (52 tests) 6ms
 ✓ src/app/__tests__/create-local-store.test.ts (32 tests) 5ms
 ✓ src/app/__tests__/env-config.test.ts (38 tests) 6ms
 ✓ src/app/__tests__/config-validator.test.ts (17 tests) 7ms
 ✓ src/app/__tests__/test-infrastructure.test.ts (11 tests) 5ms
 ✓ src/app/__tests__/storageManager.test.ts (18 tests) 6ms
 ✓ src/app/__tests__/rf002-error-log-dual-write.test.ts (8 tests) 6ms
 ✓ src/app/__tests__/rf003-figma-error-dedup.test.ts (7 tests) 5ms
 ✓ src/app/__tests__/lib/docs-generator.test.ts (19 tests) 4ms
 ✓ src/app/__tests__/dependency-scanner.test.ts (18 tests) 5ms
 ✓ src/app/__tests__/supabaseClient.test.ts (26 tests) 5ms
 ✓ src/app/__tests__/types-audit.test.ts (38 tests) 5ms
 ✓ src/app/__tests__/theme-presets.test.ts (30 tests) 5ms
 ✓ src/app/__tests__/db-queries.test.ts (38 tests) 5ms
 ✓ src/app/__tests__/MultimodalEmotionEngine.test.ts (19 tests) 4ms
 ✓ src/app/__tests__/dashboard-stores.test.ts (22 tests) 5ms
 ✓ src/app/__tests__/followUpStore.test.ts (25 tests) 5ms
 ✓ src/app/__tests__/lib/api-docs-generator.test.ts (18 tests) 5ms
 ✓ src/app/__tests__/yyc3-icons.test.ts (20 tests) 5ms
 ✓ src/app/__tests__/bridge.test.ts (20 tests) 4ms
 ✓ src/app/__tests__/lib/penetration-tester.test.ts (19 tests) 5ms
 ✓ src/app/__tests__/figma-error-filter.test.ts (44 tests) 4ms
 ✓ src/app/__tests__/security-i18n.test.ts (17 tests) 4ms
 ✓ src/app/__tests__/ollama-url.test.ts (20 tests) 4ms
 ✓ src/app/__tests__/security-types.test.ts (15 tests) 3ms
 ✓ src/app/__tests__/SmartPlaylistGenerator.test.ts (13 tests) 4ms
 ✓ src/app/__tests__/network-utils-core.test.ts (14 tests) 3ms
stdout | src/app/__tests__/supabaseClientReal.test.ts
[Supabase] 认证模式: mock

stderr | src/app/__tests__/supabaseClientReal.test.ts
[Supabase] 使用 Mock 模式 - 请配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY

 ✓ src/app/__tests__/supabaseClientReal.test.ts (15 tests) 4ms
 ✓ src/app/__tests__/storage.test.ts (11 tests) 3ms
 ✓ src/app/__tests__/followup-types.test.ts (8 tests) 2ms
 ✓ src/app/__tests__/operation-types.test.ts (11 tests) 2ms
 ✓ src/app/__tests__/filesystem-types.test.ts (10 tests) 2ms
 ✓ src/app/__tests__/ai-types.test.ts (7 tests) 2ms
 ✓ src/app/__tests__/service-loop-types.test.ts (6 tests) 2ms
 ✓ src/app/__tests__/pwa-i18n-types.test.ts (5 tests) 2ms
 ✓ src/app/__tests__/useServiceLoop.test.tsx (21 tests) 50080ms
       ✓ 完整闭环后 history 应有 1 条记录  7550ms
       ✓ 完整闭环后 6 个阶段均为 completed  8056ms
       ✓ 每个阶段应有 summary 和 details  9579ms
       ✓ trigger 应记录触发方式  9292ms
       ✓ 运行后 totalRuns 应增加  7751ms
       ✓ 清空后 history 应为空  7835ms

 Test Files  221 passed (221)
      Tests  3797 passed (3797)
   Start at  12:33:22
   Duration  51.02s (transform 2.72s, setup 8.42s, import 13.94s, tests 148.99s, environment 59.00s)

 PASS  Waiting for file changes...
       press h to show help, press q to quit


## 测试用例执行结果

 ✓ src/app/__tests__/PanelToolbar.test.tsx (25 tests) 177ms
 ✓ src/app/__tests__/OperationAudit.test.tsx (6 tests) 178ms
 ✓ src/app/__tests__/CreationStudio.test.tsx (12 tests) 152ms
 ✓ src/app/__tests__/ErrorBoundary.test.tsx (14 tests) 134ms
 ✓ src/app/__tests__/EmotionVisualizer.test.tsx (8 tests) 140ms
 ✓ src/app/__tests__/NotFound.test.tsx (11 tests) 138ms
 ✓ src/app/__tests__/ComponentShowcase.test.tsx (13 tests) 153ms
 ✓ src/app/__tests__/ColorSwatch.test.tsx (9 tests) 134ms
 ✓ src/app/__tests__/BottomNav.test.tsx (9 tests) 138ms
 ✓ src/app/__tests__/PWAStatusPanel.test.tsx (11 tests) 138ms
 ✓ src/app/__tests__/PatrolReport.test.tsx (15 tests) 132ms
 ✓ src/app/__tests__/Layout.test.tsx (17 tests) 115ms
 ✓ src/app/__tests__/ReportGenerator.test.tsx (13 tests) 109ms
 ✓ src/app/__tests__/SystemSettings.test.tsx (6 tests) 130ms
 ✓ src/app/__tests__/DataFlowDiagram.test.tsx (10 tests) 121ms
 ✓ src/app/__tests__/AddModelModal.test.tsx (12 tests) 114ms
 ✓ src/app/__tests__/DataEditorPanel.test.tsx (8 tests) 136ms
 ✓ src/app/__tests__/YYC3Logo.test.tsx (16 tests) 119ms
 ✓ src/app/__tests__/DesignSystemPage.test.tsx (6 tests) 139ms
 ✓ src/app/__tests__/PWAInstallPrompt.test.tsx (6 tests) 157ms
 ✓ src/app/__tests__/Panel.test.tsx (13 tests) 154ms
stderr | src/app/__tests__/usePerformanceMonitor.test.ts > usePerformanceMonitor > long tasks > should handle PerformanceObserver errors gracefully
[vitest] The PerformanceObserver mock did not use 'function' or 'class' in its implementation, see https://vitest.dev/api/vi#vi-spyon for examples.

 ✓ src/app/__tests__/NodeDetailModal.test.tsx (16 tests) 125ms
 ✓ src/app/__tests__/StageReview.test.tsx (14 tests) 122ms
 ✓ src/app/__tests__/DevGuidePage.test.tsx (6 tests) 124ms
 ✓ src/app/__tests__/usePerformanceMonitor.test.ts (23 tests) 103ms
 ✓ src/app/__tests__/ArchitectureAudit.test.tsx (6 tests) 118ms
 ✓ src/app/__tests__/LogViewer.test.tsx (11 tests) 100ms
 ✓ src/app/__tests__/AIDiagnostics.test.tsx (8 tests) 108ms
 ✓ src/app/__tests__/DesignTokens.test.tsx (16 tests) 109ms
 ✓ src/app/__tests__/ModelProviderPanel.test.tsx (7 tests) 101ms
 ✓ src/app/__tests__/IDEStatusBar.test.tsx (14 tests) 90ms
 ✓ src/app/__tests__/PatternAnalyzer.test.tsx (10 tests) 92ms
 ✓ src/app/__tests__/UserManagement.test.tsx (5 tests) 102ms
 ✓ src/app/__tests__/ReportExporter.test.tsx (5 tests) 89ms
 ✓ src/app/__tests__/ServiceConnectionTest.test.tsx (4 tests) 95ms
Warning: A vi.mock("../hooks/useAISuggestion") call in "/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/AISuggestionPanel.test.tsx" is not at the top level of the module. Although it appears nested, it will be hoisted and executed before any tests run. Move it to the top level to reflect its actual execution order. This will become an error in a future version.
See: https://vitest.dev/guide/mocking/modules#how-it-works
 ✓ src/app/__tests__/OperationLogStream.test.tsx (10 tests) 96ms
 ✓ src/app/__tests__/AISuggestionPanel.test.tsx (8 tests) 80ms
 ✓ src/app/__tests__/OperationChain.test.tsx (8 tests) 89ms
stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render dashboard page
The tag <stop> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <linearGradient> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
The tag <defs> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.

 ✓ src/app/__tests__/DatabaseManager.test.tsx (4 tests) 84ms
stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render chart tabs on mobile
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render refresh button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

stderr | src/app/__tests__/Dashboard.test.tsx > Dashboard > should render panorama button
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.
<linearGradient /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.

 ✓ src/app/__tests__/OperationTemplate.test.tsx (9 tests) 74ms
 ✓ src/app/__tests__/Dashboard.test.tsx (4 tests) 93ms
 ✓ src/app/__tests__/ActionRecommender.test.tsx (12 tests) 75ms
 ✓ src/app/__tests__/FileBrowser.test.tsx (15 tests) 75ms
 ✓ src/app/__tests__/OperationCenter.test.tsx (5 tests) 79ms
 ✓ src/app/__tests__/SecurityMonitor.test.tsx (6 tests) 73ms
 ✓ src/app/__tests__/PatrolScheduler.test.tsx (12 tests) 73ms
 ✓ src/app/__tests__/PanelContainer.test.tsx (15 tests) 69ms
 ✓ src/app/__tests__/CLITerminal.test.tsx (14 tests) 73ms
 ✓ src/app/__tests__/HostFileManager.test.tsx (6 tests) 76ms
 ✓ src/app/__tests__/QuickActionGrid.test.tsx (8 tests) 75ms
 ✓ src/app/__tests__/useWebSocketData.test.tsx (50 tests) 61ms
 ✓ src/app/__tests__/ConnectionStatus.test.tsx (13 tests) 58ms
 ✓ src/app/__tests__/ConfigExportCenter.test.tsx (5 tests) 68ms
 ✓ src/app/__tests__/ServiceLoopPanel.test.tsx (6 tests) 69ms
 ✓ src/app/__tests__/PatrolDashboard.test.tsx (5 tests) 66ms
 ✓ src/app/__tests__/LoopStageCard.test.tsx (11 tests) 56ms
 ✓ src/app/__tests__/DatabaseConnectionPanel.test.tsx (6 tests) 68ms
 ✓ src/app/__tests__/AlertBanner.test.tsx (11 tests) 56ms
stderr | src/app/__tests__/VinylPhotoPlayer.integration.test.tsx > VinylPhotoPlayer Integration Tests > 播放控制集成 > should have volume control
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.

 ✓ src/app/__tests__/Workspace.test.tsx (5 tests) 46ms
 ✓ src/app/__tests__/VinylPhotoPlayer.integration.test.tsx (22 tests) 46ms
 ✓ src/app/__tests__/IDEPanel.test.tsx (10 tests) 45ms
 ✓ src/app/__tests__/NetworkConfig.test.tsx (6 tests) 57ms
 ✓ src/app/__tests__/LanguageSwitcher.test.tsx (9 tests) 42ms
 ✓ src/app/__tests__/i18n-packs.test.ts (10 tests) 47ms
 ✓ src/app/__tests__/OfflineIndicator.test.tsx (5 tests) 50ms
 ✓ src/app/__tests__/e2e-integration.test.ts (18 tests) 41ms
 ✓ src/app/__tests__/PanelContent.test.tsx (8 tests) 37ms
 ✓ src/app/__tests__/useYYC3Head.test.ts (9 tests) 38ms
 ✓ src/app/__tests__/LocalFileManager.test.tsx (5 tests) 48ms
 ✓ src/app/__tests__/OperationCategory.test.tsx (7 tests) 46ms
 ✓ src/app/__tests__/performance-monitor.test.ts (25 tests) 42ms
 ✓ src/app/__tests__/CreationStudio.integration.test.tsx (19 tests) 38ms
 ✓ src/app/__tests__/useReportExporter.test.ts (15 tests) 33ms
 ✓ src/app/__tests__/types.test.ts (35 tests) 34ms
Not implemented: HTMLMediaElement's pause() method
 ✓ src/app/__tests__/CodeEditor.test.tsx (74 tests) 34ms
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
Not implemented: HTMLMediaElement's load() method
Not implemented: HTMLMediaElement's pause() method
stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should initialize with default state
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should connect to WebSocket
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should handle manual reconnect
[WebSocket] 连接成功
[WebSocket] 连接关闭: 0 
[WebSocket] 908.5327967655959ms 后尝试第 1 次重连

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should handle manual reconnect
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should clear alerts
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have nodes data
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have last sync time
[WebSocket] 连接成功

stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have QPS trend
[WebSocket] 连接成功

 ✓ src/app/__tests__/useAudioEngine.test.tsx (20 tests) 30ms
stdout | src/app/__tests__/useWebSocketDataEnhanced.test.ts > useWebSocketDataEnhanced > should have latency trend
[WebSocket] 连接成功

 ✓ src/app/__tests__/useWebSocketDataEnhanced.test.ts (9 tests) 28ms
 ✓ src/app/__tests__/useAISuggestion.test.ts (12 tests) 16ms
 ✓ src/app/__tests__/core-integration.test.tsx (33 tests) 32ms
Not implemented: HTMLMediaElement's load() method
 ✓ src/app/__tests__/useAudioEngine.test.ts (19 tests) 26ms
 ✓ src/app/__tests__/i18n-loop-devguide.test.ts (12 tests) 34ms
 ✓ src/app/__tests__/useMusicPlayer.test.ts (35 tests) 31ms
 ✓ src/app/__tests__/GlassCard.test.tsx (9 tests) 24ms
 ✓ src/app/__tests__/FamilyMusic.integration.test.tsx (14 tests) 24ms
 ✓ src/app/__tests__/rf001-ws-url-unification.test.ts (5 tests) 25ms
 ✓ src/app/__tests__/useLocalFileSystem.test.tsx (37 tests) 26ms
 ✓ src/app/__tests__/useMobileView.test.ts (13 tests) 25ms
 ✓ src/app/__tests__/useOfflineMode.test.ts (16 tests) 20ms
 ✓ src/app/__tests__/usePatrol.test.ts (14 tests) 25ms
 ✓ src/app/__tests__/useInstallPrompt.test.ts (10 tests) 21ms
 ✓ src/app/__tests__/useAlertRules.test.ts (21 tests) 23ms
 ✓ src/app/__tests__/useAIDiagnostics.test.ts (15 tests) 21ms
 ✓ src/app/__tests__/useServiceLoop.test.ts (16 tests) 17ms
 ✓ src/app/__tests__/useModelProvider.test.ts (19 tests) 26ms
 ✓ src/app/__tests__/useSecurityMonitor.test.tsx (13 tests) 20ms
 ✓ src/app/__tests__/useTerminal.test.tsx (24 tests) 28ms
 ✓ src/app/__tests__/usePWAManager.test.ts (15 tests) 21ms
 ✓ src/app/__tests__/useSecurityMonitor.test.ts (10 tests) 18ms
 ✓ src/app/__tests__/useKeyboardShortcuts.test.ts (19 tests) 19ms
 ✓ src/app/__tests__/network-utils.test.ts (19 tests) 21ms
 ✓ src/app/__tests__/security-audit.test.ts (21 tests) 20ms
 ✓ src/app/__tests__/usePushNotifications.test.ts (19 tests) 20ms
 ✓ src/app/__tests__/useFollowUp.test.tsx (17 tests) 18ms
 ✓ src/app/__tests__/useResponsive.test.ts (12 tests) 18ms
 ✓ src/app/__tests__/useValidation.test.tsx (19 tests) 19ms
 ✓ src/app/__tests__/useI18n.test.ts (12 tests) 14ms
 ✓ src/app/__tests__/useSettingsStore.test.ts (12 tests) 18ms
 ✓ src/app/__tests__/useModelProvider.test.tsx (14 tests) 16ms
 ✓ src/app/__tests__/useFollowUp.test.ts (11 tests) 15ms
 ✓ src/app/__tests__/useKeyboardShortcuts.test.tsx (13 tests) 17ms
(node:70701) MaxListenersExceededWarning: Possible EventTarget memory leak detected. 11 message listeners added to BroadcastChannel. MaxListeners is 10. Use events.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/app/__tests__/useSettingsStore.test.tsx (13 tests) 15ms
 ✓ src/app/__tests__/useHostFileSystem.test.ts (15 tests) 15ms
 ✓ src/app/__tests__/useI18n.test.tsx (13 tests) 14ms
 ✓ src/app/__tests__/useNetworkConfig.test.ts (9 tests) 15ms
stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该正确检测非 Electron 环境
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该在非 Electron 环境中提供降级方案
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/integration.test.ts > 集成测试 > 桥接客户端与环境检测集成 > 应该在非 Electron 环境中提供降级方案
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/integration.test.ts (12 tests) 14ms
 ✓ src/app/__tests__/useValidation.test.ts (52 tests) 15ms
 ✓ src/app/__tests__/useEmotionMusic.test.ts (11 tests) 14ms
 ✓ src/app/__tests__/integration/integration.test.ts (18 tests) 15ms
 ✓ src/app/__tests__/DataMonitoring.test.tsx (2 tests) 15ms
 ✓ src/app/__tests__/websocket-manager.test.ts (16 tests) 9ms
 ✓ src/app/__tests__/settings-model-unified-dataflow.test.ts (24 tests) 12ms
 ✓ src/app/__tests__/useMobileView.test.tsx (8 tests) 11ms
stderr | src/app/__tests__/lib/api-config-enhanced.test.ts > API Configuration > setAPIConfig > should validate config before saving
[api-config] 配置验证失败: 配置验证失败:
❌ [fsBase] Invalid input
   💡 建议: 示例: /api/fs 或 http://localhost:3000/api/fs
[YYC³ VALIDATION] 配置验证失败:
❌ [fsBase] Invalid input
   💡 建议: 示例: /api/fs 或 http://localhost:3000/api/fs

 ✓ src/app/__tests__/yyc3-storage.test.ts (16 tests) 10ms
 ✓ src/app/__tests__/lib/api-config-enhanced.test.ts (24 tests) 12ms
stdout | src/app/__tests__/MusicEventBus.test.ts > MusicEventBus > 调试模式 > should enable debug mode
[MusicEventBus] Emitting: {
  type: 'music:command',
  payload: {
    command: 'play',
    params: undefined,
    source: 'ui',
    timestamp: 1775450323723
  }
}

 ✓ src/app/__tests__/MusicEventBus.test.ts (41 tests) 10ms
stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture Error instance
[YYC³ UNKNOWN] Test error message Error: Test error message
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:154:19
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture string error
[YYC³ UNKNOWN] String error 

stderr | src/app/__tests__/error-handler.test.ts > captureError > should capture object with message
[YYC³ UNKNOWN] Object error 

stderr | src/app/__tests__/error-handler.test.ts > captureError > should use provided category and severity
[YYC³ AUTH] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:177:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should include source when provided
[YYC³ UNKNOWN] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:187:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureError > should include detail when provided
[YYC³ UNKNOWN] Test Error: Test
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:195:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureValidationError > should capture validation errors
[YYC³ VALIDATION] [email] Invalid email; [name] Required

stderr | src/app/__tests__/error-handler.test.ts > captureNetworkError > should capture network error
[YYC³ NETWORK] Network failed

stderr | src/app/__tests__/error-handler.test.ts > captureWSError > should capture WebSocket error
[YYC³ NETWORK] WS failed

stderr | src/app/__tests__/error-handler.test.ts > captureAuthError > should capture auth error
[YYC³ AUTH] Auth failed Error: Auth failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:255:39
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)
    at runWithTimeout (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2262:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2945:64

stderr | src/app/__tests__/error-handler.test.ts > captureParseError > should capture parse error
[YYC³ PARSE] Parse failed

stderr | src/app/__tests__/error-handler.test.ts > trySafe > should return error on failure
[YYC³ UNKNOWN] Failed Error: Failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:283:64
    at Module.trySafe (/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/error-handler.ts:380:26)
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:283:35
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)

stderr | src/app/__tests__/error-handler.test.ts > trySafeSync > should return error on failure
[YYC³ UNKNOWN] Failed Error: Failed
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:301:13
    at Module.trySafeSync (/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/error-handler.ts:393:20)
    at /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/__tests__/error-handler.test.ts:300:29
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:302:11
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:1893:26
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2316:20
    at new Promise (<anonymous>)
    at runWithCancel (file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2313:10)
    at file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/node_modules/.pnpm/@vitest+runner@4.1.2/node_modules/@vitest/runner/dist/chunk-artifact.js:2295:20
    at new Promise (<anonymous>)

stdout | src/app/__tests__/error-handler.test.ts > installGlobalErrorListeners > should install listeners only once
[YYC³] 全局错误监听器已安装

 ✓ src/app/__tests__/error-handler.test.ts (33 tests) 9ms
stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > getBridgeAPI > should return null in web environment
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > readFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > writeFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > deleteFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > exists > should return false when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > listDirectory > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > listDirectory > should support recursive option
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > getFileInfo > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > createDirectory > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > copyFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > fileSystemClient > moveFile > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > execute > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > query > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > query > should accept generic type parameter
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > backup > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > restore > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > databaseClient > migrate > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getCPUInfo > should return default CPU info when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getMemoryInfo > should return default memory info when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getDiskInfo > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getNetworkInfo > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > systemMonitorClient > getProcesses > should return empty array when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getVersion > should return web version when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getPath > should return empty string when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > getConfig > should return default config when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > restart > should reload page when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > appControlClient > quit > should try to close window when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showOpenDialog > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showSaveDialog > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > dialogClient > showMessage > should use alert and return 0 when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > openExternal > should use window.open when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > openPath > should throw error when not in Electron
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/lib/bridge-client-enhanced.test.ts > Bridge Client > shellClient > execute > should throw error when not in Electron
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/dmusic-resources.test.ts (23 tests) 9ms
 ✓ src/app/__tests__/lib/bridge-client-enhanced.test.ts (34 tests) 9ms
 ✓ src/app/__tests__/state-sync-manager.test.ts (21 tests) 8ms
 ✓ src/app/__tests__/DatabaseAdapter.integration.test.ts (12 tests) 9ms
stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 环境检测 > 应该在没有桥接 API 时返回 null
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中抛出写入错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中返回 false
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 文件系统客户端 > 应该在非 Electron 环境中返回空数组
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出查询错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 数据库客户端 > 应该在非 Electron 环境中抛出备份错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回默认 CPU 信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回默认内存信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空磁盘信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空网络信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 系统监控客户端 > 应该在非 Electron 环境中返回空进程信息
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回 web 版本
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回空路径
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中返回默认配置
[Bridge] Not running in Electron environment

Not implemented: navigation to another Document
stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中重新加载页面
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 应用控制客户端 > 应该在非 Electron 环境中关闭窗口
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中抛出错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中抛出保存错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > 对话框客户端 > 应该在非 Electron 环境中使用 alert
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中打开新窗口
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中抛出路径错误
[Bridge] Not running in Electron environment

stderr | src/app/__tests__/bridge-client.test.ts > 桥接客户端测试 > Shell 客户端 > 应该在非 Electron 环境中抛出执行错误
[Bridge] Not running in Electron environment

 ✓ src/app/__tests__/bridge-client.test.ts (25 tests) 9ms
 ✓ src/app/__tests__/api-config.test.ts (20 tests) 8ms
 ✓ src/app/__tests__/ConnectionManager.test.ts (14 tests) 7ms
 ✓ src/app/__tests__/broadcast-channel.test.ts (13 tests) 6ms
 ✓ src/app/__tests__/config-validator.test.ts (17 tests) 6ms
 ✓ src/app/__tests__/i18n-consistency.test.ts (52 tests) 7ms
 ✓ src/app/__tests__/storageManager.test.ts (18 tests) 7ms
 ✓ src/app/__tests__/rf002-error-log-dual-write.test.ts (8 tests) 6ms
 ✓ src/app/__tests__/env-config.test.ts (38 tests) 7ms
 ✓ src/app/__tests__/db-queries.test.ts (38 tests) 6ms
 ✓ src/app/__tests__/yyc3-icons.test.ts (20 tests) 5ms
 ✓ src/app/__tests__/supabaseClient.test.ts (26 tests) 6ms
 ✓ src/app/__tests__/ide-mock-data.test.ts (54 tests) 6ms
 ✓ src/app/__tests__/followUpStore.test.ts (25 tests) 5ms
 ✓ src/app/__tests__/create-local-store.test.ts (32 tests) 6ms
 ✓ src/app/__tests__/dashboard-stores.test.ts (22 tests) 5ms
 ✓ src/app/__tests__/theme-presets.test.ts (30 tests) 5ms
 ✓ src/app/__tests__/types-audit.test.ts (38 tests) 5ms
 ✓ src/app/__tests__/test-infrastructure.test.ts (11 tests) 6ms
 ✓ src/app/__tests__/lib/api-docs-generator.test.ts (18 tests) 5ms
 ✓ src/app/__tests__/lib/penetration-tester.test.ts (19 tests) 4ms
 ✓ src/app/__tests__/lib/alerting-manager.test.ts (19 tests) 5ms
 ✓ src/app/__tests__/color-utils.test.ts (29 tests) 5ms
 ✓ src/app/__tests__/dependency-scanner.test.ts (18 tests) 4ms
 ✓ src/app/__tests__/rf003-figma-error-dedup.test.ts (7 tests) 4ms
 ✓ src/app/__tests__/MultimodalEmotionEngine.test.ts (19 tests) 4ms
 ✓ src/app/__tests__/lib/docs-generator.test.ts (19 tests) 4ms
 ✓ src/app/__tests__/bridge.test.ts (20 tests) 4ms
 ✓ src/app/__tests__/SmartPlaylistGenerator.test.ts (13 tests) 3ms
stdout | src/app/__tests__/supabaseClientReal.test.ts
[Supabase] 认证模式: mock

stderr | src/app/__tests__/supabaseClientReal.test.ts
[Supabase] 使用 Mock 模式 - 请配置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY

 ✓ src/app/__tests__/supabaseClientReal.test.ts (15 tests) 4ms
 ✓ src/app/__tests__/security-i18n.test.ts (17 tests) 3ms
 ✓ src/app/__tests__/ollama-url.test.ts (20 tests) 4ms
 ✓ src/app/__tests__/figma-error-filter.test.ts (44 tests) 4ms
 ✓ src/app/__tests__/security-types.test.ts (15 tests) 3ms
 ✓ src/app/__tests__/network-utils-core.test.ts (14 tests) 3ms
 ✓ src/app/__tests__/storage.test.ts (11 tests) 2ms
 ✓ src/app/__tests__/filesystem-types.test.ts (10 tests) 2ms
 ✓ src/app/__tests__/operation-types.test.ts (11 tests) 2ms
 ✓ src/app/__tests__/followup-types.test.ts (8 tests) 2ms
 ✓ src/app/__tests__/ai-types.test.ts (7 tests) 2ms
 ✓ src/app/__tests__/pwa-i18n-types.test.ts (5 tests) 2ms
 ✓ src/app/__tests__/service-loop-types.test.ts (6 tests) 2ms
 ✓ src/app/__tests__/useServiceLoop.test.tsx (21 tests) 51347ms
       ✓ 完整闭环后 history 应有 1 条记录  8580ms
       ✓ 完整闭环后 6 个阶段均为 completed  9175ms
       ✓ 每个阶段应有 summary 和 details  8704ms
       ✓ trigger 应记录触发方式  7078ms
       ✓ 运行后 totalRuns 应增加  9461ms
       ✓ 清空后 history 应为空  8333ms

 Test Files  221 passed (221)
      Tests  3797 passed (3797)
   Start at  12:38:15
   Duration  53.66s (transform 2.43s, setup 9.31s, import 13.93s, tests 160.18s, environment 58.68s)

 % Coverage report from v8
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------|---------|----------|---------|---------|-------------------
All files               |   50.49 |    41.32 |   43.08 |   52.75 |                   
 components             |   39.98 |    41.17 |   30.34 |   44.28 |                   
  AIAssistant.tsx       |   70.63 |    69.56 |   67.34 |   74.77 | ...44,546,649-710 
  AIDiagnostics.tsx     |   53.06 |    57.28 |      70 |   61.53 | ...89,463,485-510 
  AIFamilyPage.tsx      |    2.17 |        0 |       0 |    2.38 | 156-179,186-812   
  AISuggestionPanel.tsx |      68 |    67.39 |   42.85 |   69.56 | ...65,100,132-241 
  ActionRecommender.tsx |     100 |      100 |     100 |     100 |                   
  AddModelModal.tsx     |   54.11 |       47 |   39.28 |   53.24 | ...23,133,228-427 
  AlertBanner.tsx       |     100 |    66.66 |     100 |     100 | 32-52,59-61       
  AlertRulesPanel.tsx   |   68.65 |     67.7 |   70.96 |   70.17 | ...95,501-502,518 
  ArchitectureAudit.tsx |   55.35 |    26.19 |      50 |   52.94 | ...50,397,513-708 
  BottomNav.tsx         |   57.14 |    80.55 |   44.44 |   56.25 | ...52,172-229,302 
  CLITerminal.tsx       |   83.33 |    59.09 |   58.33 |   83.33 | ...05-119,163-165 
  CodeEditor.tsx        |   75.51 |    74.07 |   66.66 |   73.91 | ...18,229,290-298 
  CommandPalette.tsx    |   66.66 |    54.54 |   58.82 |   68.75 | ...25,166-185,216 
  ConfigCenter.tsx      |       0 |        0 |       0 |       0 | 30-300            
  ...igExportCenter.tsx |   18.54 |    16.66 |    9.52 |    21.1 | ...51-284,322-372 
  ...onMonitorPanel.tsx |       0 |        0 |       0 |       0 | 38-196            
  ConnectionStatus.tsx  |     100 |      100 |     100 |     100 |                   
  CreateRuleModal.tsx   |   84.92 |    86.58 |   71.15 |   87.93 | ...18,443,484-508 
  Dashboard.tsx         |   64.28 |    59.65 |   38.46 |   66.17 | ...81,352-436,501 
  DataEditorPanel.tsx   |   10.24 |     7.79 |    2.33 |   18.15 | ...5-441,469-1200 
  DataEditorTables.tsx  |   32.25 |    68.15 |   18.27 |    46.8 | ...19,329,347-370 
  DataFlowDiagram.tsx   |    92.3 |    78.57 |     100 |     100 | 35-37,74          
  DataMonitoring.tsx    |     100 |      100 |     100 |     100 |                   
  ...onnectionPanel.tsx |   23.22 |     8.78 |    6.49 |   27.32 | ...85-587,592-695 
  DatabaseManager.tsx   |   19.64 |    11.03 |       5 |   22.68 | ...-89,93,155-754 
  ...gnSystemEditor.tsx |       0 |        0 |       0 |       0 | 31-233            
  DevGuidePage.tsx      |      50 |    72.72 |      25 |   51.85 | 339,401-579       
  EnvConfigEditor.tsx   |   31.46 |    34.21 |      32 |   32.87 | ...55-258,286,319 
  ErrorBoundary.tsx     |   78.04 |    56.92 |      70 |      80 | 71,82,112-130     
  FileBrowser.tsx       |      95 |      100 |   85.71 |   94.11 | 50                
  FollowUpCard.tsx      |      64 |    75.75 |    62.5 |   68.18 | 213-215,244-247   
  FollowUpDrawer.tsx    |   76.78 |    87.71 |      52 |      76 | ...51,283,413-443 
  ...owUpEditDialog.tsx |       0 |        0 |       0 |       0 | 29-252            
  FollowUpManager.tsx   |       0 |        0 |       0 |       0 | 22-457            
  FollowUpPanel.tsx     |       0 |        0 |       0 |       0 | 23-193            
  GlassCard.tsx         |     100 |      100 |     100 |     100 |                   
  HostFileManager.tsx   |    26.6 |    18.75 |   10.63 |   31.52 | ...10-248,257-643 
  IDEPanel.tsx          |     100 |      100 |     100 |     100 |                   
  ...eEditableTable.tsx |   83.02 |    72.22 |   85.07 |    88.2 | ...47,654,763-769 
  ...gratedTerminal.tsx |    53.6 |    48.05 |      50 |   54.31 | ...38,344,419-468 
  LanguageSwitcher.tsx  |     100 |    88.23 |     100 |     100 | 23,44             
  Layout.tsx            |    42.3 |    94.11 |    7.14 |      50 | 34,62-67,108-155  
  LocalFileManager.tsx  |   30.76 |     37.5 |   22.22 |      32 | 68-280            
  LogViewer.tsx         |     100 |    93.33 |     100 |     100 | 115               
  Login.tsx             |   91.17 |       70 |   77.77 |   93.93 | 220-221           
  LoopStageCard.tsx     |     100 |    92.59 |     100 |     100 | 36,69             
  ...lProviderPanel.tsx |   24.13 |    28.57 |    4.76 |   28.57 | ...,93-98,132-490 
  NetworkConfig.tsx     |   21.78 |    15.12 |    11.9 |   21.11 | ...68-269,401-802 
  NodeDetailModal.tsx   |    42.1 |    55.55 |   23.07 |    42.1 | ...03-108,198-270 
  NotFound.tsx          |     100 |      100 |     100 |     100 |                   
  OfflineIndicator.tsx  |     100 |    92.85 |     100 |     100 | 51                
  OperationAudit.tsx    |   45.19 |    41.37 |   38.88 |   48.88 | ...40-366,375-434 
  OperationCategory.tsx |     100 |    91.66 |     100 |     100 | 42                
  OperationCenter.tsx   |     100 |       50 |     100 |     100 | 23                
  OperationChain.tsx    |     100 |      100 |     100 |     100 |                   
  ...ationLogStream.tsx |     100 |    86.66 |     100 |     100 | 102,121           
  OperationTemplate.tsx |   74.41 |    58.33 |    64.7 |   78.37 | ...07-115,178,202 
  PWAInstallPrompt.tsx  |     100 |      100 |     100 |     100 |                   
  PWAStatusPanel.tsx    |     100 |    55.88 |     100 |     100 | ...52-159,188-217 
  PageConfigEditor.tsx  |       0 |        0 |       0 |       0 | 30-353            
  PatrolDashboard.tsx   |      70 |    47.82 |      40 |      70 | 63-174            
  PatrolHistory.tsx     |   90.62 |    71.42 |     100 |   92.59 | 41-43             
  PatrolReport.tsx      |   96.77 |    87.09 |     100 |     100 | 49-50,192         
  PatrolScheduler.tsx   |     100 |      100 |     100 |     100 |                   
  PatternAnalyzer.tsx   |     100 |      100 |     100 |     100 |                   
  ...ormanceMonitor.tsx |   52.84 |    40.14 |   36.95 |    62.4 | ...98,418-462,569 
  ...derEditorModal.tsx |   41.02 |    20.93 |    12.5 |   44.28 | ...24-146,151-343 
  QuickActionGrid.tsx   |   94.73 |    88.46 |     100 |     100 | 47,62,98          
  QuickActionGroup.tsx  |     100 |       76 |      50 |     100 | 57-61,93          
  RefactoringReport.tsx |   73.33 |    52.08 |      64 |   78.84 | ...90,699,733-734 
  ReportExporter.tsx    |   29.03 |       40 |      20 |      36 | ...81,107,130-334 
  ReportGenerator.tsx   |   92.85 |     90.9 |   85.71 |    92.3 | 154-164           
  SDKChatPanel.tsx      |    80.7 |    77.22 |      75 |   86.53 | 157-158,217-285   
  SecurityMonitor.tsx   |   12.67 |    17.64 |    9.67 |   14.51 | 28-58,104-605,688 
  ...ConnectionTest.tsx |   11.16 |     8.19 |    8.97 |   12.97 | ...1141,1209-1246 
  ServiceLoopPanel.tsx  |   47.05 |    36.11 |   22.22 |      50 | ...77-102,227-247 
  Sidebar.tsx           |   81.63 |    87.75 |   77.77 |   85.71 | ...04,238-239,290 
  ...ageConfigPanel.tsx |       0 |        0 |       0 |       0 | 36-93             
  StorageManager.tsx    |       0 |        0 |       0 |       0 | 17-42             
  StorageSyncStatus.tsx |       0 |        0 |       0 |       0 | 25-268            
  SystemSettings.tsx    |   44.21 |    60.33 |   22.58 |   43.11 | ...1193,1215-1274 
  ThemeCustomizer.tsx   |   28.96 |    42.64 |   17.72 |   35.96 | ...47-479,511,670 
  TopBar.tsx            |   73.91 |    62.39 |   64.28 |   78.18 | ...63,423-434,605 
  UserManagement.tsx    |   75.24 |    73.41 |   81.08 |   76.92 | ...71,429-437,489 
  VariableCenter.tsx    |    1.57 |        0 |       0 |    1.66 | 75-468            
  YYC3Logo.tsx          |     100 |      100 |     100 |     100 |                   
  YYC3LogoSvg.tsx       |   60.71 |    48.78 |     100 |      70 | 25-30             
 components/ai-family   |   10.99 |    13.99 |    8.58 |   11.53 |                   
  ...milyCenterPage.tsx |       0 |        0 |       0 |       0 | 32-291            
  AIFamilyDesignDoc.tsx |       0 |        0 |       0 |       0 | 48-1212           
  AIFamilyRouter.tsx    |    4.76 |        0 |       0 |    6.97 | ...40-112,119-142 
  AchievementPanel.tsx  |       0 |        0 |       0 |       0 | 35-230            
  AudioVisualizer.tsx   |       0 |        0 |       0 |       0 | 28-224            
  CoverFlow.tsx         |       0 |        0 |       0 |       0 | 44-437            
  CreationStudio.tsx    |    30.8 |    42.12 |   17.64 |   33.66 | ...9,829,860-1034 
  EmotionRipple.tsx     |       0 |        0 |       0 |       0 | 32-343            
  EmotionVisualizer.tsx |      85 |    74.07 |   78.57 |   84.61 | 81-86,119         
  FadeIn.tsx            |     100 |      100 |     100 |     100 |                   
  ...ActivityCenter.tsx |       0 |        0 |       0 |       0 | 30-776            
  FamilyAnnouncer.tsx   |       0 |        0 |       0 |       0 | 52-448            
  FamilyChat.tsx        |       0 |        0 |       0 |       0 | 28-254            
  FamilyCommCenter.tsx  |       0 |        0 |       0 |       0 | 32-551            
  FamilyDataHub.tsx     |       0 |        0 |       0 |       0 | 30-335            
  ...yEntertainment.tsx |       0 |        0 |       0 |       0 | 24-390            
  FamilyGrowth.tsx      |       0 |        0 |       0 |       0 | 21-194            
  FamilyHome.tsx        |       0 |        0 |       0 |       0 | 24-251            
  FamilyLearn.tsx       |       0 |        0 |       0 |       0 | 20-217            
  ...yModelSettings.tsx |   30.12 |    24.44 |      25 |   30.71 | ...69,635,681-763 
  FamilyMusic.tsx       |       0 |        0 |       0 |       0 | 39-641            
  FamilyPageHeader.tsx  |       0 |        0 |       0 |       0 | 31-37             
  FamilyPhone.tsx       |       0 |        0 |       0 |       0 | 30-402            
  FamilyShare.tsx       |       0 |        0 |       0 |       0 | 34-189            
  FamilyUISettings.tsx  |    29.6 |    27.65 |   23.33 |   31.25 | ...94-595,654-845 
  FamilyVoiceSystem.tsx |   17.17 |    19.85 |   11.29 |   19.18 | ...84-687,704-707 
  LazyWrap.tsx          |       0 |      100 |       0 |       0 | 11-23             
  ...GeneratorPanel.tsx |       0 |        0 |       0 |       0 | 22-259            
  ThemeSwitcher.tsx     |       0 |        0 |       0 |       0 | 37-291            
  VinylPhotoPlayer.tsx  |   76.92 |    92.98 |      50 |   76.47 | ...02,284,356-357 
  ...icControlPanel.tsx |       0 |        0 |       0 |       0 | 22-174            
 ...nents/design-system |     100 |    92.85 |     100 |     100 |                   
  ComponentShowcase.tsx |     100 |      100 |     100 |     100 |                   
  DesignSystemPage.tsx  |     100 |    88.88 |     100 |     100 | 28-56             
  DesignTokens.tsx      |     100 |    92.85 |     100 |     100 | 246               
  StageReview.tsx       |     100 |    83.33 |     100 |     100 | 374-380           
 components/ide         |   24.77 |    26.25 |   18.11 |   25.31 |                   
  AIChatPanel.tsx       |    6.15 |        0 |       0 |    6.55 | ...7,52-53,57-296 
  CodePreviewPanel.tsx  |       0 |        0 |       0 |       0 | 29-109            
  DeployDialog.tsx      |       0 |        0 |       0 |       0 | 20-187            
  FileExplorer.tsx      |   40.47 |    47.78 |   27.45 |   40.74 | ...62-464,483-541 
  GPUNodeCard.tsx       |       0 |        0 |       0 |       0 | 25-204            
  GitPanel.tsx          |    3.57 |        0 |       0 |    4.54 | 39-371            
  IDELayout.tsx         |   57.29 |    53.95 |   34.69 |   59.52 | ...63-466,476-525 
  IDESettingsPanel.tsx  |       0 |        0 |       0 |       0 | 22-475            
  IDEStatusBar.tsx      |     100 |    95.65 |     100 |     100 | 27                
  IDETerminal.tsx       |     2.3 |        0 |       0 |    2.56 | 38,49-216,247-466 
  IDETopBar.tsx         |       0 |        0 |       0 |       0 | 38-163            
  IDEViewSwitcher.tsx   |       0 |        0 |       0 |       0 | 27-92             
  LayoutContext.tsx     |     1.3 |        0 |       0 |    1.37 | 131-465,498-622   
  NotificationPanel.tsx |       0 |        0 |       0 |       0 | 22-131            
  Panel.tsx             |     100 |    71.42 |     100 |     100 | 30-48             
  PanelContainer.tsx    |   88.23 |      100 |   69.23 |   88.23 | 49,54,141-145     
  PanelContent.tsx      |     100 |      100 |     100 |     100 |                   
  PanelHeader.tsx       |     100 |      100 |     100 |     100 |                   
  PanelResizeHandle.tsx |       0 |        0 |       0 |       0 | 21-143            
  PanelToolbar.tsx      |   97.14 |    77.77 |     100 |     100 | 63,148-206        
  ShareDialog.tsx       |       0 |        0 |       0 |       0 | 20-123            
  TabBar.tsx            |   73.33 |      100 |      75 |   73.33 | 106-111           
  Workspace.tsx         |     100 |       75 |     100 |     100 | 28                
  XtermTerminal.tsx     |       0 |        0 |       0 |       0 | 41-241            
 components/theme       |    92.9 |       70 |   89.18 |   96.92 |                   
  ColorPicker.tsx       |    92.9 |    63.63 |   90.32 |   97.45 | 229-231           
  ColorSwatch.tsx       |   92.85 |     87.5 |   83.33 |   91.66 | 56                
 hooks                  |   72.96 |    57.63 |   77.94 |   73.98 |                   
  useAIDiagnostics.ts   |   94.66 |    88.67 |    91.3 |    97.1 | 94,180            
  useAISuggestion.ts    |     100 |      100 |     100 |     100 |                   
  useAlertRules.ts      |   96.47 |    77.96 |     100 |     100 | ...99-327,339-366 
  useAudioEngine.ts     |   87.03 |     55.9 |   75.75 |      87 | ...76-577,625,631 
  useBigModelSDK.ts     |   65.88 |    46.97 |   78.72 |   67.02 | ...78,781,784,787 
  useDesignSystem.ts    |       0 |        0 |       0 |       0 | 40-76             
  useEmotionMusic.ts    |      72 |    58.82 |   72.72 |   71.42 | ...00-108,115-116 
  useFollowUp.ts        |    97.5 |      100 |   94.44 |     100 |                   
  useHostFileSystem.ts  |   21.05 |     18.3 |   32.65 |   20.46 | ...78,687,693-695 
  useI18n.ts            |   91.89 |    72.22 |   83.33 |   93.75 | 72-73             
  useInstallPrompt.ts   |     100 |      100 |     100 |     100 |                   
  ...yboardShortcuts.ts |   98.36 |    88.09 |     100 |     100 | 37-38,68,86,130   
  useLocalDatabase.ts   |   41.66 |    21.47 |   43.58 |    44.2 | ...14-726,745-746 
  useLocalFileSystem.ts |   78.11 |    61.01 |   78.26 |    79.9 | ...08-510,525-527 
  useMobileView.ts      |     100 |     87.5 |     100 |     100 | 35-41             
  useModelProvider.ts   |   87.35 |       60 |   84.61 |   91.21 | ...93,302-305,406 
  useMusicPlayer.ts     |   61.26 |    43.13 |   77.19 |   64.92 | ...57-458,480-564 
  useNetworkConfig.ts   |   94.28 |     87.5 |   93.33 |   96.55 | 55                
  useOfflineMode.ts     |   96.49 |    78.57 |     100 |   96.36 | 27,79             
  useOperationCenter.ts |   95.94 |    83.33 |     100 |   98.38 | 197               
  usePWAManager.ts      |     100 |       90 |     100 |     100 | 42                
  usePageConfig.ts      |       0 |        0 |       0 |       0 | 30-83             
  usePatrol.ts          |    98.9 |    86.79 |   96.66 |   98.75 | 302               
  ...formanceMonitor.ts |   98.94 |     87.5 |   96.77 |   98.68 | 164               
  usePersistedState.ts  |   95.65 |    81.81 |   93.75 |   95.12 | 58-59             
  ...shNotifications.ts |     100 |      100 |     100 |     100 |                   
  useReportExporter.ts  |   98.52 |    78.12 |     100 |     100 | 61,72-140,258     
  useResponsive.ts      |     100 |      100 |     100 |     100 |                   
  useSecurityMonitor.ts |   93.05 |    66.07 |     100 |     100 | ...48,160-274,299 
  useServiceLoop.ts     |   88.75 |    60.86 |     100 |   87.83 | 274,342-350       
  useSettingsStore.ts   |   95.16 |       50 |   94.11 |   96.66 | 213-214           
  useTerminal.ts        |   79.51 |    60.88 |      92 |   80.95 | ...91,699-702,714 
  useValidation.ts      |     100 |    98.98 |     100 |     100 | 125               
  useVariables.ts       |       0 |        0 |       0 |       0 | 42-194            
  useWebSocketData.ts   |   99.23 |    79.48 |     100 |   99.19 | 212               
  ...ketDataEnhanced.ts |   52.94 |       25 |   48.27 |   54.26 | ...02,354,357,360 
  useYYC3Head.ts        |   86.36 |    66.66 |   66.66 |    92.5 | 109,111,113       
 lib                    |   69.32 |    54.48 |   71.51 |    69.9 |                   
  AchievementSystem.ts  |       0 |        0 |       0 |       0 | 80-646            
  EmotionMusicBridge.ts |   46.66 |    33.76 |   46.66 |   47.11 | ...42,267,295-394 
  FamilyMusicThemes.ts  |       0 |        0 |       0 |       0 | 64-547            
  ...izedRecommender.ts |       0 |        0 |       0 |       0 | 62-541            
  LyricsGenerator.ts    |       0 |        0 |       0 |       0 | 90-490            
  ...rnDialogManager.ts |       0 |        0 |       0 |       0 | 105-546           
  ...alEmotionEngine.ts |   80.68 |     61.9 |   94.73 |   80.55 | ...59,279-280,316 
  MusicEventBus.ts      |      96 |    77.77 |     100 |   95.91 | 160,166           
  ...aylistGenerator.ts |   77.41 |    63.44 |      64 |   77.55 | ...11,243,313-378 
  VoiceCommandParser.ts |    6.66 |        0 |       0 |    7.14 | ...60-187,197-325 
  ...eProfileManager.ts |       0 |        0 |       0 |       0 | 63-497            
  ai-service-manager.ts |   79.66 |    56.41 |   84.09 |   81.73 | ...61,570,623-627 
  alerting-manager.ts   |   79.27 |    65.85 |   68.75 |   81.81 | ...40-352,407-435 
  api-config.ts         |   69.87 |    64.51 |      70 |   69.87 | ...78,213,230-233 
  api-docs-generator.ts |     100 |     87.5 |     100 |     100 | 148,155-157,196   
  authContext.ts        |     100 |      100 |       0 |     100 |                   
  backgroundSync.ts     |   76.74 |    73.33 |     100 |    75.6 | 28-34,86-90       
  bridge-client.ts      |   77.03 |    53.03 |     100 |   77.03 | ...78,395,406,417 
  broadcast-channel.ts  |     100 |      100 |     100 |     100 |                   
  canvasPerfRegistry.ts |       0 |        0 |       0 |       0 | 21-40             
  config-validator.ts   |   96.29 |       80 |     100 |   96.22 | 49,60             
  create-local-store.ts |   98.48 |    94.11 |     100 |     100 | 65                
  data-flow-pipeline.ts |   91.95 |    87.21 |      90 |    94.7 | ...46-354,476,489 
  db-queries.ts         |   92.51 |    82.92 |   97.91 |   95.45 | 73-79             
  dependency-scanner.ts |   94.53 |    68.65 |     100 |   94.78 | ...25-329,356,371 
  deployment-manager.ts |   88.05 |       72 |   95.23 |   86.88 | 198-210,318,330   
  disaster-recovery.ts  |    91.3 |    60.97 |     100 |   90.29 | ...66,524,529,534 
  dmusic-resources.ts   |   68.42 |        0 |   58.33 |   70.58 | 741,753-759       
  docs-generator.ts     |    67.1 |    29.16 |   55.81 |   68.05 | ...39,551-554,577 
  env-config.ts         |   83.33 |    65.62 |     100 |     100 | 135-145           
  error-handler.ts      |    75.9 |    63.03 |   89.28 |      75 | ...45-450,459-467 
  figma-error-filter.ts |     100 |      100 |     100 |     100 |                   
  network-utils.ts      |   70.66 |    51.21 |   92.85 |   70.27 | ...39-142,148-162 
  ollama-url.ts         |     100 |      100 |     100 |     100 |                   
  penetration-tester.ts |   92.57 |       60 |   88.63 |   95.29 | ...61,364,367,370 
  ...mance-benchmark.ts |   89.61 |    54.28 |   97.91 |   90.11 | ...60,575-576,633 
  ...ormance-monitor.ts |   80.97 |    58.94 |   88.37 |   83.75 | ...74,578,582-583 
  ...mance-optimizer.ts |   88.69 |       75 |     100 |   88.18 | ...25,329,333,337 
  security-audit.ts     |   85.98 |    60.21 |   94.59 |    86.3 | ...76,480,488,492 
  state-sync-manager.ts |   93.18 |    76.47 |   97.05 |   96.74 | 235-236,349,391   
  supabaseClient.ts     |     100 |      100 |   93.33 |     100 |                   
  supabaseClientReal.ts |   26.96 |    32.72 |   29.16 |    27.9 | ...78,231-287,299 
  view-context.ts       |     100 |      100 |     100 |     100 |                   
  websocket-manager.ts  |   82.94 |    66.66 |    90.9 |   83.03 | ...18,441,457-472 
  yyc3-icons.ts         |     100 |      100 |     100 |     100 |                   
  yyc3-storage.ts       |   83.97 |    66.66 |      75 |   88.73 | ...00,251,272-274 
 types                  |     100 |      100 |     100 |     100 |                   
  index.ts              |     100 |      100 |     100 |     100 |                   
  storage.ts            |       0 |        0 |       0 |       0 |                   
------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 50.49% ( 9449/18711 )
Branches     : 41.32% ( 5095/12329 )
Functions    : 43.08% ( 2382/5529 )
Lines        : 52.75% ( 8765/16613 )
================================================================================
 PASS  Waiting for file changes...
       press h to show help, press q to quit

## pnpm type-check

> yyc3-cloudpivot-intelli-matrix@1.0.0 type-check /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix
> tsc --noEmit

## pnpm lint

> yyc3-cloudpivot-intelli-matrix@1.0.0 lint /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix
> eslint . --ext .ts,.tsx,.js,.jsx

(node:75172) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/eslint.config.js?mtime=1775223947149 is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
Warning: React version not specified in eslint-plugin-react settings. See https://github.com/jsx-eslint/eslint-plugin-react#configuration .

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ConfigCenter.tsx
   72:13  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console
  291:25  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/CreateRuleModal.tsx
  138:91  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  157:78  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/DataEditorPanel.tsx
   894:108  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   895:127  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  1001:209  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  1002:272  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  1155:105  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  1156:128  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/DataEditorTables.tsx
  27:22  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  28:22  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/DesignSystemEditor.tsx
  27:5  warning  'setColor' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/FollowUpEditDialog.tsx
  84:12  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/FollowUpManager.tsx
  247:66  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  259:68  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  286:60  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/NetworkConfig.tsx
  375:43  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  397:59  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  398:62  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  399:61  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/PageConfigEditor.tsx
   29:36  warning  'pageId' is defined but never used. Allowed unused args must match /^_/u                 unused-imports/no-unused-vars
   33:10  warning  'allPages' is assigned a value but never used. Allowed unused vars must match /^_/u      unused-imports/no-unused-vars
  353:31  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/SecurityMonitor.tsx
  290:138  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  333:52   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  426:46   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ServiceConnectionTest.tsx
  112:17   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  222:43   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  226:135  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  497:19   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/StorageConfigPanel.tsx
  114:57  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  177:66  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/SystemSettings.tsx
  366:74   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  565:39   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  565:106  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  588:24   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  593:24   warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/VariableCenter.tsx
   13:3   error    'VARIABLE_GROUPS' is defined but never used                                              unused-imports/no-unused-imports
   35:10  error    'Tabs' is defined but never used                                                         unused-imports/no-unused-imports
   35:16  error    'TabsContent' is defined but never used                                                  unused-imports/no-unused-imports
   35:29  error    'TabsList' is defined but never used                                                     unused-imports/no-unused-imports
   35:39  error    'TabsTrigger' is defined but never used                                                  unused-imports/no-unused-imports
  216:11  warning  'isPassword' is assigned a value but never used. Allowed unused vars must match /^_/u    unused-imports/no-unused-vars
  424:29  warning  'currentValue' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/EmotionVisualizer.tsx
  69:5  warning  'suggestAction' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyCommCenter.tsx
  478:91  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyEntertainment.tsx
  206:78  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyHome.tsx
  65:49  warning  React Hook useMemo has an unnecessary dependency: 'greetingMinute'. Either exclude it or remove the dependency array  react-hooks/exhaustive-deps

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyMusic.tsx
   65:46  warning  'duration' is defined but never used. Allowed unused args must match /^_/u                     unused-imports/no-unused-vars
  111:5   warning  'frequencyData' is assigned a value but never used. Allowed unused vars must match /^_/u       unused-imports/no-unused-vars
  113:5   warning  'bassEnergy' is assigned a value but never used. Allowed unused vars must match /^_/u          unused-imports/no-unused-vars
  114:5   warning  'audioMode' is assigned a value but never used. Allowed unused vars must match /^_/u           unused-imports/no-unused-vars
  149:9   warning  'currentEmotionType' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyUISettings.tsx
  377:9   warning  The 'ALL_STORAGE_KEYS' array makes the dependencies of useCallback Hook (at line 426) change on every render. To fix this, wrap the initialization of 'ALL_STORAGE_KEYS' in its own useMemo() Hook  react-hooks/exhaustive-deps
  402:6   warning  React Hook useMemo has an unnecessary dependency: 'config'. Either exclude it or remove the dependency array                                                                                        react-hooks/exhaustive-deps
  432:26  warning  Unexpected any. Specify a different type                                                                                                                                                            @typescript-eslint/no-explicit-any
  458:6   warning  React Hook useCallback has a missing dependency: 'ALL_STORAGE_KEYS'. Either include it or remove the dependency array                                                                               react-hooks/exhaustive-deps
  467:6   warning  React Hook useCallback has a missing dependency: 'ALL_STORAGE_KEYS'. Either include it or remove the dependency array                                                                               react-hooks/exhaustive-deps

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/FamilyVoiceSystem.tsx
  270:33  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  276:42  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  276:79  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  287:36  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  316:13  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info                       no-console
  328:35  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  337:6   warning  React Hook useEffect has a missing dependency: 'member.id'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
  596:18  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any
  596:57  warning  Unexpected any. Specify a different type                                                                      @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ai-family/VinylPhotoPlayer.tsx
  28:10  warning  'imageLoaded' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ide/AIChatPanel.tsx
  73:9  warning  The 'handleSend' function makes the dependencies of useCallback Hook (at line 102) change on every render. To fix this, wrap the definition of 'handleSend' in its own useCallback() Hook  react-hooks/exhaustive-deps

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/components/ide/PanelContainer.tsx
  83:40  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/hooks/useEmotionMusic.ts
  111:96  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  112:93  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/hooks/useMusicPlayer.ts
  266:13  warning  'total' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars
  483:33  warning  Unexpected any. Specify a different type                                          @typescript-eslint/no-explicit-any
  486:42  warning  Unexpected any. Specify a different type                                          @typescript-eslint/no-explicit-any
  486:79  warning  Unexpected any. Specify a different type                                          @typescript-eslint/no-explicit-any
  498:36  warning  Unexpected any. Specify a different type                                          @typescript-eslint/no-explicit-any
  528:36  warning  Unexpected any. Specify a different type                                          @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/hooks/useVariables.ts
  186:9  warning  'setVariable' is assigned a value but never used. Allowed unused vars must match /^_/u  unused-imports/no-unused-vars

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/MusicEventBus.ts
  160:7  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console
  166:9  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console
  198:7  warning  Unexpected console statement. Only these console methods are allowed: warn, error, info  no-console

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/SmartPlaylistGenerator.ts
  281:45  warning  'index' is defined but never used. Allowed unused args must match /^_/u  unused-imports/no-unused-vars
  353:37  warning  Unexpected any. Specify a different type                                 @typescript-eslint/no-explicit-any
  354:42  warning  Unexpected any. Specify a different type                                 @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/bridge-client.ts
   92:65  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  103:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/app/lib/performance-optimizer.ts
  259:70  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  260:50  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/database/ConnectionManager.ts
  106:55  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  107:20  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  107:56  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  108:20  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/database/DatabaseAdapter.ts
  390:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/database/IndexManager.ts
  283:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  316:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  345:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  422:34  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/database/QueryAnalyzer.ts
   35:23  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   38:27  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
   48:75  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  102:57  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  116:62  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  145:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  196:21  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  243:39  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  260:66  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  269:63  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  278:65  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  288:45  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  300:43  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  312:43  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  324:44  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  334:42  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  344:47  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  429:48  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

/Volumes/Knowledge/YYC3-Cloud-Intelli-Matrix/src/database/QueryCache.ts
  117:13  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any
  149:38  warning  Unexpected any. Specify a different type  @typescript-eslint/no-explicit-any

✖ 119 problems (5 errors, 114 warnings)
  5 errors and 0 warnings potentially fixable with the `--fix` option.

 ELIFECYCLE  Command failed with exit code 1.
---

