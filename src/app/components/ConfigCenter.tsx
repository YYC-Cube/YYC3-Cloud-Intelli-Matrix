/**
 * @file: ConfigCenter.tsx
 * @description: ConfigCenter.tsx
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-06
 * @updated: 2026-04-08
 * @status: active
 * @tags: [component]
 */

import { useState } from "react";
import { PageConfigEditor } from "./PageConfigEditor";
import { DesignSystemEditor } from "./DesignSystemEditor";
import { getAllPages, type PageConfig } from "../config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import {
  Settings,
  Palette,
  FileText,
  Database,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

export function ConfigCenter() {
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [pages] = useState(() => getAllPages());
  const [activeTab, setActiveTab] = useState("pages");

  const groupedPages = pages.reduce(
    (acc, page) => {
      const group = page.sidebar.navGroup;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(page);
      return acc;
    },
    {} as Record<string, PageConfig[]>
  );

  const handleExportAll = () => {
    const data = {
      pages: Object.fromEntries(pages.map((p) => [p.id, p])),
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "yyc3-config-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportAll = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            console.info("Imported config:", data);
          } catch {
            console.error("Failed to parse config file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetAll = () => {
    if (confirm("确定要重置所有配置吗？此操作不可撤销。")) {
      localStorage.removeItem("yyc3-page-configs");
      localStorage.removeItem("yyc3-design-system-overrides");
      window.location.reload();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            配置中心
          </h1>
          <p className="text-sm text-muted-foreground">统一管理页面配置和设计系统</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleImportAll}>
            <Upload className="h-4 w-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            <RefreshCw className="h-4 w-4 mr-2" />
            重置全部
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="pages" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                页面配置
              </TabsTrigger>
              <TabsTrigger value="design" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                设计系统
              </TabsTrigger>
              <TabsTrigger value="storage" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                存储管理
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pages" className="flex-1 flex overflow-hidden m-0">
            <div className="w-64 border-r border-border/30 flex flex-col">
              <div className="p-3 border-b border-border/30">
                <h3 className="text-sm font-medium text-muted-foreground">页面列表</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-4">
                  {Object.entries(groupedPages).map(([group, groupPages]) => (
                    <div key={group}>
                      <h4 className="px-2 py-1 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                        {group}
                      </h4>
                      <div className="space-y-1">
                        {groupPages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => setSelectedPageId(page.id)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedPageId === page.id
                                ? "bg-primary/20 text-primary"
                                : "hover:bg-muted/50 text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{page.title}</span>
                              {page.editable && (
                                <Badge variant="outline" className="text-xs">
                                  可编辑
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {page.path}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {selectedPageId ? (
                <PageConfigEditor pageId={selectedPageId} />
              ) : (
                <Card className="bg-card/50 backdrop-blur-md border-border/50">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">选择一个页面</h3>
                    <p className="text-sm text-muted-foreground/60 mt-2">
                      从左侧列表中选择一个页面进行配置
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="design" className="flex-1 overflow-auto p-4 m-0">
            <DesignSystemEditor />
          </TabsContent>

          <TabsContent value="storage" className="flex-1 overflow-auto p-4 m-0">
            <StorageManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StorageManager() {
  const [storageKeys] = useState(() => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("yyc3")) {
        keys.push(key);
      }
    }
    return keys.sort();
  });

  const getStorageSize = (key: string): number => {
    const value = localStorage.getItem(key);
    return value ? new Blob([value]).size : 0;
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {return `${bytes} B`;}
    if (bytes < 1024 * 1024) {return `${(bytes / 1024).toFixed(1)} KB`;}
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleClearKey = (key: string) => {
    if (confirm(`确定要清除 ${key} 吗？`)) {
      localStorage.removeItem(key);
      window.location.reload();
    }
  };

  const handleClearAll = () => {
    if (confirm("确定要清除所有 YYC³ 存储数据吗？此操作不可撤销。")) {
      storageKeys.forEach((key) => localStorage.removeItem(key));
      window.location.reload();
    }
  };

  const totalSize = storageKeys.reduce((sum, key) => sum + getStorageSize(key), 0);

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-foreground">存储管理</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              查看和管理本地存储数据
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {storageKeys.length} 项 · {formatSize(totalSize)}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              清除全部
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {storageKeys.map((key) => {
            const size = getStorageSize(key);
            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <code className="text-sm text-foreground">{key}</code>
                    <p className="text-xs text-muted-foreground">{formatSize(size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const value = localStorage.getItem(key);
                      if (value) {
                        console.info(`${key}:`, JSON.parse(value));
                      }
                    }}
                  >
                    查看
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleClearKey(key)}
                  >
                    清除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ConfigCenter;
