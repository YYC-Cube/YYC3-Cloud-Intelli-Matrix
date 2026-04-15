/**
 * @file: routes.ts
 * @description: routes.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [module]
 */

import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { DataMonitoring } from "./components/DataMonitoring";
import { FollowUpPanel } from "./components/FollowUpPanel";
import { PatrolDashboard } from "./components/PatrolDashboard";
import { OperationCenter } from "./components/OperationCenter";
import { LocalFileManager } from "./components/LocalFileManager";
import { AISuggestionPanel } from "./components/AISuggestionPanel";
import { ServiceLoopPanel } from "./components/ServiceLoopPanel";
import { PWAStatusPanel } from "./components/PWAStatusPanel";
import { DesignSystemPage } from "./components/design-system/DesignSystemPage";
import { DevGuidePage } from "./components/DevGuidePage";
import { ModelProviderPanel } from "./components/ModelProviderPanel";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { CLITerminal } from "./components/CLITerminal";
import { IDEPanel } from "./components/IDEPanel";
import { OperationAudit } from "./components/OperationAudit";
import { UserManagement } from "./components/UserManagement";
import { SystemSettings } from "./components/SystemSettings";
import { SecurityMonitor } from "./components/SecurityMonitor";
import { AlertRulesPanel } from "./components/AlertRulesPanel";
import { ReportExporter } from "./components/ReportExporter";
import { AIDiagnostics } from "./components/AIDiagnostics";
import { HostFileManager } from "./components/HostFileManager";
import { DatabaseManager } from "./components/DatabaseManager";
import { RefactoringReport } from "./components/RefactoringReport";
import { DataEditorPanel } from "./components/DataEditorPanel";
import { PerformanceMonitor } from "./components/PerformanceMonitor";
import { EnvConfigEditor } from "./components/EnvConfigEditor";
import { DatabaseConnectionPanel } from "./components/DatabaseConnectionPanel";
import { ConnectionMonitorPanel } from "./components/ConnectionMonitorPanel";
import { StorageManager } from "./components/StorageManager";
import { ArchitectureAudit } from "./components/ArchitectureAudit";
import { AIFamilyPage } from "./components/AIFamilyPage";
import { AIFamilyRouter } from "./components/ai-family/AIFamilyRouter";
import { ServiceConnectionTest } from "./components/ServiceConnectionTest";
import { FollowUpManager } from "./components/FollowUpManager";
import { ConfigCenter } from "./components/ConfigCenter";
import { VariableCenter } from "./components/VariableCenter";
import { NotFound } from "./components/NotFound";
import { UnifiedSettingsPanel } from "./components/UnifiedSettingsPanel";
import { HotelDashboard } from "./components/HotelDashboard";

// ────────────────────────────────────────────
//  路由表
// ────────────────────────────────────────────

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: DataMonitoring },
      { path: "follow-up", Component: FollowUpPanel },
      { path: "follow-up-manager", Component: FollowUpManager },
      { path: "patrol", Component: PatrolDashboard },
      { path: "operations", Component: OperationCenter },
      { path: "files", Component: LocalFileManager },
      { path: "ai", Component: AISuggestionPanel },
      { path: "loop", Component: ServiceLoopPanel },
      { path: "pwa", Component: PWAStatusPanel },
      { path: "design-system", Component: DesignSystemPage },
      { path: "dev-guide", Component: DevGuidePage },
      { path: "models", Component: ModelProviderPanel },
      { path: "theme", Component: ThemeCustomizer },
      { path: "terminal", Component: CLITerminal },
      { path: "ide", Component: IDEPanel },
      { path: "audit", Component: OperationAudit },
      { path: "users", Component: UserManagement },
      { path: "settings", Component: SystemSettings },
      { path: "security", Component: SecurityMonitor },
      { path: "alerts", Component: AlertRulesPanel },
      { path: "reports", Component: ReportExporter },
      { path: "ai-diagnosis", Component: AIDiagnostics },
      { path: "host-files", Component: HostFileManager },
      { path: "database", Component: DatabaseManager },
      { path: "refactoring", Component: RefactoringReport },
      { path: "data-editor", Component: DataEditorPanel },
      { path: "performance", Component: PerformanceMonitor },
      { path: "env-config", Component: EnvConfigEditor },
      { path: "db-connections", Component: DatabaseConnectionPanel },
      { path: "connection-monitor", Component: ConnectionMonitorPanel },
      { path: "architecture", Component: ArchitectureAudit },
      { path: "ai-family", Component: AIFamilyPage },
      { path: "ai-family/:subpage", Component: AIFamilyRouter },
      { path: "connection-test", Component: ServiceConnectionTest },
      { path: "storage", Component: StorageManager },
      { path: "config-center", Component: ConfigCenter },
      { path: "variables", Component: VariableCenter },
      { path: "unified-settings", Component: UnifiedSettingsPanel },
      { path: "hotel-dashboard", Component: HotelDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);