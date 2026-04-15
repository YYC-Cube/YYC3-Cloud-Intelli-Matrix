/**
 * @file: useModelProvider.ts
 * @description: useModelProvider.ts
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-04-08
 * @updated: 2026-04-08
 * @status: active
 * @tags: [hook]
 */

import { useState, useCallback, useMemo, useEffect } from "react";
import type {
  ModelProviderId,
  ModelProviderDef,
  ConfiguredModel,
  OllamaModel,
  OllamaTagsResponse,
} from "../types";
import { getOllamaTagsUrl } from "../lib/ollama-url";
import { testAIConnection, type AIConnectionConfig } from "../lib/connection-test-engine";
import { encrypt, decrypt, isCryptoAvailable } from "../lib/crypto-vault";

// ============================================================
// 内置服务商默认值 (仅首次初始化时写入 localStorage)
// 导出供外部测试和类型检查使用
// ============================================================

export const BUILTIN_PROVIDERS: ModelProviderDef[] = [
  {
    id: "zhipu",
    label: "Z.ai",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    authType: "api-key",
    models: ["glm-4-flash", "glm-4-plus", "glm-4-air", "glm-4-airx", "glm-4-long", "glm-4v-plus"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "zhipu-plan",
    label: "Z.ai-plan",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    authType: "api-key",
    models: ["glm-4-plan", "glm-4-plan-plus"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "kimi-cn",
    label: "Kimi-CN",
    baseUrl: "https://api.moonshot.cn/v1",
    authType: "bearer",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "kimi-global",
    label: "Kimi-Global",
    baseUrl: "https://api.moonshot.ai/v1",
    authType: "bearer",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    authType: "bearer",
    models: ["deepseek-chat", "deepseek-coder", "deepseek-reasoner"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "volcengine",
    label: "火山引擎",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    authType: "bearer",
    models: ["doubao-pro-32k", "doubao-pro-128k", "doubao-lite-32k"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "volcengine-plan",
    label: "火山引擎 Plan",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    authType: "bearer",
    models: ["doubao-plan-pro", "doubao-plan-lite"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "openai",
    label: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    authType: "bearer",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo", "o1-preview", "o1-mini"],
    requiresApiKey: true,
    isLocal: false,
    isBuiltin: true,
  },
  {
    id: "ollama",
    label: "Ollama (本地)",
    baseUrl: "http://localhost:11434",
    authType: "none",
    models: [],  // 运行时从 /api/tags 自动获取
    requiresApiKey: false,
    isLocal: true,
    isBuiltin: true,
  },
];

// ============================================================
// Storage Keys (导出供外部使用)
// ============================================================

export const PROVIDERS_KEY = "yyc3_model_providers";
export const MODELS_KEY = "yyc3_configured_models";

// ============================================================
// 持久化工具函数 (导出供外部测试)
// ============================================================

export function loadProviders(): ModelProviderDef[] {
  try {
    const raw = localStorage.getItem(PROVIDERS_KEY);
    if (raw) {
      const saved: ModelProviderDef[] = JSON.parse(raw);
      // 合并策略: 以 localStorage 为准, 但确保新增内置服务商被补入
      // 注意: 已删除的模型不会自动恢复，只有新增的内置服务商会被补入
      const savedIds = new Set(saved.map((p) => p.id));
      const missing = BUILTIN_PROVIDERS.filter((bp) => !savedIds.has(bp.id)).map((bp) => ({ ...bp }));
      return [...saved, ...missing];
    }
    // 首次启动: 写入默认值
    return BUILTIN_PROVIDERS.map((p) => ({ ...p }));
  } catch {
    return BUILTIN_PROVIDERS.map((p) => ({ ...p }));
  }
}

export function saveProviders(providers: ModelProviderDef[]) {
  try {
    localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
  } catch { /* Storage unavailable */ }
  // SSOT 桥接: 同步到 GlobalStore
  try {
    const { bridgeProvidersToGlobal } = require("../stores/global-store");
    bridgeProvidersToGlobal(providers);
  } catch { /* GlobalStore not available */ }
}

export function loadModels(): ConfiguredModel[] {
  try {
    const raw = localStorage.getItem(MODELS_KEY);
    if (!raw) return [];
    const models: ConfiguredModel[] = JSON.parse(raw);
    return models;
    // Note: apiKey fields starting with "vault:" are encrypted
    // Use getDecryptedApiKey() for async decryption
  } catch {
    return [];
  }
}

/**
 * 异步解密模型 API Key
 * 如果 key 以 "vault:" 开头，则解密；否则原样返回
 */
export async function getDecryptedApiKey(model: ConfiguredModel): Promise<string> {
  const key = model.apiKey || "";
  if (key.startsWith("vault:") && isCryptoAvailable()) {
    try {
      return await decrypt(key.slice(6)); // Remove "vault:" prefix
    } catch {
      return ""; // Decryption failed (device change etc.)
    }
  }
  return key;
}

export async function saveModels(models: ConfiguredModel[]) {
  try {
    const serializable = await Promise.all(
      models.map(async (m) => {
        let encryptedKey = m.apiKey || "";
        // Encrypt apiKey if crypto available and key is non-empty plaintext
        if (isCryptoAvailable() && encryptedKey && !encryptedKey.startsWith("vault:")) {
          try {
            encryptedKey = "vault:" + await encrypt(encryptedKey);
          } catch { /* Fall back to plaintext */ }
        }
        return { ...m, apiKey: encryptedKey };
      })
    );
    localStorage.setItem(MODELS_KEY, JSON.stringify(serializable));
  } catch { /* Storage unavailable */ }
  // SSOT 桥接: 同步到 GlobalStore
  try {
    const { bridgeModelsToGlobal } = require("../stores/global-store");
    bridgeModelsToGlobal(models);
  } catch { /* GlobalStore not available */ }
}

// ============================================================
// 兼容性导出 — MODEL_PROVIDERS (动态快照)
// ============================================================

/** @deprecated 请使用 useModelProvider().providers 获取动态列表 */
export const MODEL_PROVIDERS: ModelProviderDef[] = loadProviders();

// ============================================================
// Hook
// ============================================================

export function useModelProvider() {
  const [providers, setProviders] = useState<ModelProviderDef[]>(loadProviders);
  const [configuredModels, setConfiguredModels] = useState<ConfiguredModel[]>(loadModels);
  const [ollamaModels, setOllamaModels] = useState<OllamaModel[]>([]);
  const [ollamaLoading, setOllamaLoading] = useState(false);
  const [ollamaError, setOllamaError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 持久化 providers
  useEffect(() => {
    saveProviders(providers);
  }, [providers]);

  // 持久化 configuredModels (async for apiKey encryption)
  useEffect(() => {
    saveModels(configuredModels);
  }, [configuredModels]);

  // ========== 服务商 CRUD ==========

  const addProvider = useCallback((provider: Omit<ModelProviderDef, "id" | "isBuiltin" | "isCustom" | "createdAt">) => {
    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newProvider: ModelProviderDef = {
      ...provider,
      id,
      isBuiltin: false,
      isCustom: true,
      createdAt: Date.now(),
    };
    setProviders((prev) => [...prev, newProvider]);
    return newProvider;
  }, []);

  const updateProvider = useCallback((id: ModelProviderId, updates: Partial<ModelProviderDef>) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: Date.now() } : p
      )
    );
    // 同步更新已配置模型中的 providerLabel / baseUrl
    if (updates.label || updates.baseUrl) {
      setConfiguredModels((prev) =>
        prev.map((m) =>
          m.providerId === id
            ? {
                ...m,
                providerLabel: updates.label ?? m.providerLabel,
                baseUrl: updates.baseUrl ?? m.baseUrl,
              }
            : m
        )
      );
    }
  }, []);

  const removeProvider = useCallback((id: ModelProviderId) => {
    setProviders((prev) => {
      // 所有服务商都可以删除（包括内置的）
      // 删除后不会自动恢复，想恢复需要手动添加
      return prev.filter((p) => p.id !== id);
    });
    // 同步删除该服务商下的已配置模型
    setConfiguredModels((prev) => prev.filter((m) => m.providerId !== id));
  }, []);

  /** 重置内置服务商到默认配置 */
  const resetProvider = useCallback((id: ModelProviderId) => {
    const builtin = BUILTIN_PROVIDERS.find((p) => p.id === id);
    if (!builtin) {return;}
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...builtin, updatedAt: Date.now() } : p))
    );
  }, []);

  /** 向服务商添加自定义模型名 */
  const addModelToProvider = useCallback((providerId: ModelProviderId, modelName: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId && !p.models.includes(modelName)
          ? { ...p, models: [...p.models, modelName], updatedAt: Date.now() }
          : p
      )
    );
  }, []);

  /** 从服务商移除模型名 */
  const removeModelFromProvider = useCallback((providerId: ModelProviderId, modelName: string) => {
    setProviders((prev) =>
      prev.map((p) =>
        p.id === providerId
          ? { ...p, models: p.models.filter((m) => m !== modelName), updatedAt: Date.now() }
          : p
      )
    );
  }, []);

  // ========== Ollama 自动识别 ==========
  const fetchOllamaModels = useCallback(async (baseUrl?: string) => {
    // 使用 getProviders() 获取最新状态，避免依赖 providers 导致无限循环
    const currentProviders = loadProviders();
    const ollamaProvider = currentProviders.find((p) => p.id === "ollama");
    const url = baseUrl || ollamaProvider?.baseUrl || "http://localhost:11434";
    setOllamaLoading(true);
    setOllamaError(null);

    try {
      // 如果传入了自定义 baseUrl 则直连, 否则走同源代理
      const tagsUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/tags` : getOllamaTagsUrl();
      const res = await fetch(tagsUrl, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: OllamaTagsResponse = await res.json();
      const models = data.models || [];
      setOllamaModels(models);

      // 自动同步 Ollama provider 的 models 列表
      if (models.length > 0) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === "ollama"
              ? { ...p, models: models.map((m) => m.name), baseUrl: url }
              : p
          )
        );
      }

      return models;
    } catch (err: unknown) {
      // Ollama 不可达时 fallback 到默认模型 (自动检测在 Ollama 启动后会刷新)
      const mockModels: OllamaModel[] = [
        {
          name: "codegeex4:latest",
          model: "codegeex4:latest",
          modified_at: "2026-02-22T00:55:15.920502035+08:00",
          size: 5455323291,
          digest: "867b8e81d03898ac2289d809edb718d67a6d706d6a644bb1a922ee1607c7e5ed",
          details: { parent_model: "", format: "gguf", family: "chatglm", parameter_size: "9.4B", quantization_level: "Q4_0" },
        },
      ];
      setOllamaError(`连接失败 (Mock 模式): ${(err as Error).message}`);

      // Mock 模式也同步
      setProviders((prev) =>
        prev.map((p) =>
          p.id === "ollama"
            ? { ...p, models: mockModels.map((m) => m.name) }
            : p
        )
      );

      return mockModels;
    } finally {
      setOllamaLoading(false);
    }
  }, []); // 移除 providers 依赖，使用 loadProviders() 获取最新状态

  // ========== 初始化时自动获取 Ollama 模型 ==========
  useEffect(() => {
    fetchOllamaModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========== 合并可用模型列表（供 AI 浮窗等消费） ==========
  const availableModels = useMemo(() => {
    const models: Array<{ id: string; name: string; provider: string; isLocal: boolean }> = [];

    // 已配置的云端/API 模型
    configuredModels.forEach((cm) => {
      models.push({
        id: cm.id,
        name: `${cm.model} (${cm.providerLabel})`,
        provider: cm.providerLabel,
        isLocal: cm.providerId === "ollama",
      });
    });

    // Ollama 本地模型（去重：如果已在 configuredModels 中则跳过）
    const configuredOllamaNames = new Set(
      configuredModels
        .filter((cm) => cm.providerId === "ollama")
        .map((cm) => cm.model)
    );
    ollamaModels.forEach((om) => {
      if (!configuredOllamaNames.has(om.name)) {
        models.push({
          id: `ollama-live-${om.name}`,
          name: om.name,
          provider: "Ollama (本地)",
          isLocal: true,
        });
      }
    });

    return models;
  }, [configuredModels, ollamaModels]);

  // ========== 添加已配置模型 ==========
  const addModel = useCallback((
    providerId: ModelProviderId,
    model: string,
    apiKey: string,
    customBaseUrl?: string,
    proxyUrl?: string,
  ) => {
    // 使用 loadProviders() 获取最新状态，避免依赖 providers
    const currentProviders = loadProviders();
    const provider = currentProviders.find((p) => p.id === providerId);
    if (!provider) {return;}

    const newModel: ConfiguredModel = {
      id: `${providerId}-${model}-${Date.now()}`,
      providerId,
      providerLabel: provider.label,
      model,
      apiKey,
      baseUrl: customBaseUrl || provider.baseUrl,
      proxyUrl: proxyUrl || undefined,
      createdAt: Date.now(),
      lastUsed: null,
      status: "unchecked",
    };

    setConfiguredModels((prev) => [...prev, newModel]);
    return newModel;
  }, []); // 移除 providers 依赖，使用 loadProviders() 获取最新状态

  // ========== 更新已配置模型 ==========
  const updateModel = useCallback((id: string, updates: Partial<ConfiguredModel>) => {
    setConfiguredModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  // ========== 删除已配置模型 ==========
  const removeModel = useCallback((id: string) => {
    setConfiguredModels((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ========== 测试连接 (真实调用引擎) ==========
  const testConnection = useCallback(async (id: string) => {
    const model = configuredModels.find((m) => m.id === id);
    if (!model) { return; }

    const isLocal = model.providerId === "ollama" || model.providerLabel.toLowerCase().includes("ollama");
    const baseUrl = model.baseUrl || (isLocal ? (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:11434`
      : "http://localhost:11434") : "");

    try {
      const config: AIConnectionConfig = {
        providerId: model.providerId,
        providerLabel: model.providerLabel,
        baseUrl,
        authType: "bearer",
        apiKey: model.apiKey || "",
        modelId: model.id,
        modelName: model.model,
        isLocal,
        proxyUrl: model.proxyUrl,
      };

      const result = await testAIConnection(config);

      setConfiguredModels((prev) =>
        prev.map((m) => {
          if (m.id !== id) { return m; }
          return {
            ...m,
            status: result.overallStatus === "pass" ? "active" as const :
                   result.overallStatus === "warn" ? "active" as const :
                   "error" as const,
            lastUsed: Date.now(),
          };
        })
      );
    } catch (err: unknown) {
      console.error("[useModelProvider] testConnection error:", err);
      setConfiguredModels((prev) =>
        prev.map((m) => {
          if (m.id !== id) { return m; }
          return { ...m, status: "error" as const, lastUsed: Date.now() };
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuredModels]);

  // ========== 导出/导入配置 ==========
  const exportConfig = useCallback(() => {
    return JSON.stringify({
      version: 2,
      exportedAt: Date.now(),
      providers: providers.filter((p) => !p.isBuiltin || p.updatedAt),
      configuredModels,
    }, null, 2);
  }, [providers, configuredModels]);

  const importConfig = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.providers) {
        setProviders((prev) => {
          const currentIds = new Set(prev.map((p) => p.id));
          const imported = data.providers.filter((p: ModelProviderDef) => !currentIds.has(p.id));
          // 更新已有的自定义服务商
          const updated = prev.map((p) => {
            const match = data.providers.find((dp: ModelProviderDef) => dp.id === p.id && !p.isBuiltin);
            return match ? { ...p, ...match } : p;
          });
          return [...updated, ...imported];
        });
      }
      if (data.configuredModels) {
        setConfiguredModels((prev) => {
          const currentIds = new Set(prev.map((m) => m.id));
          const imported = data.configuredModels.filter((m: ConfiguredModel) => !currentIds.has(m.id));
          return [...prev, ...imported];
        });
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  // ========== 统计 ==========
  const stats = useMemo(() => ({
    total: configuredModels.length,
    active: configuredModels.filter((m) => m.status === "active").length,
    ollamaCount: ollamaModels.length,
    providers: new Set(configuredModels.map((m) => m.providerId)).size,
    customProviders: providers.filter((p) => p.isCustom).length,
    totalProviders: providers.length,
  }), [configuredModels, ollamaModels, providers]);

  return {
    // 数据
    providers,
    configuredModels,
    ollamaModels,
    ollamaLoading,
    ollamaError,
    stats,
    availableModels,

    // 模态框
    modalOpen,
    openModal: () => setModalOpen(true),
    closeModal: () => setModalOpen(false),

    // 服务商 CRUD
    addProvider,
    updateProvider,
    removeProvider,
    resetProvider,
    addModelToProvider,
    removeModelFromProvider,

    // 已配置模型 CRUD
    addModel,
    updateModel,
    removeModel,
    testConnection,

    // Ollama
    fetchOllamaModels,

    // 导入/导出
    exportConfig,
    importConfig,
  };
}