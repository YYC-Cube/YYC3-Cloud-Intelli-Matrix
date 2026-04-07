/**
 * @file D-Music UGC 内容审核工具
 * @description 对齐 Guidelines_Prompts.md §1.3 用户生成内容标准
 * @see guidelines/Guidelines_Prompts.md — ContentAuditor / AuditResult
 * @author YYC³ Team
 * @version 1.0.0
 */

// ─── 审核结果类型（对齐 Guidelines_Prompts.md §1.3 AuditResult）───
export interface AuditResult {
  passed: boolean;
  score: number;           // 安全分数 0-100
  categories: string[];    // 风险类别
  reason?: string;         // 拒绝原因
}

// ─── 验证规则（对齐 Guidelines_Prompts.md §4.2 内容管理规范）───
interface ContentRules {
  minLength: number;
  maxLength: number;
  allowEmoji: boolean;
  allowUrls: boolean;
  maxRepeatedChars: number;
}

const DEFAULT_RULES: ContentRules = {
  minLength: 1,
  maxLength: 500,
  allowEmoji: true,
  allowUrls: false,
  maxRepeatedChars: 6,
};

// ─── 基础敏感词库（本地前端层 — 生产环境应由后端 API 实现完整审核）───
const SENSITIVE_PATTERNS: RegExp[] = [
  // 占位 — 实际词库由后端维护，前端仅做基础预检
  /(.)\1{9,}/g,  // 10+ 连续重复字符
];

// ═══════════════════════════════════════════════════════════
// 核心审核函数
// ═══════════════════════════════════════════════════════════

/**
 * 审核文本内容
 * @param content 待审核文本
 * @param rules 自定义规则（可选）
 * @returns AuditResult
 */
export function auditText(
  content: string,
  rules: Partial<ContentRules> = {}
): AuditResult {
  const r = { ...DEFAULT_RULES, ...rules };
  const categories: string[] = [];
  let score = 100;

  // 1. 空内容检查
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { passed: false, score: 0, categories: ['empty'], reason: '内容不能为空' };
  }

  // 2. 长度检查
  if (trimmed.length < r.minLength) {
    return { passed: false, score: 10, categories: ['too_short'], reason: `内容至少 ${r.minLength} 个字符` };
  }
  if (trimmed.length > r.maxLength) {
    categories.push('too_long');
    score -= 30;
  }

  // 3. URL 检查
  if (!r.allowUrls && /https?:\/\/[^\s]+/i.test(trimmed)) {
    categories.push('contains_url');
    score -= 20;
  }

  // 4. 连续重复字符检查
  const repeatedMatch = trimmed.match(new RegExp(`(.)\\1{${r.maxRepeatedChars},}`, 'g'));
  if (repeatedMatch) {
    categories.push('repeated_chars');
    score -= 15 * repeatedMatch.length;
  }

  // 5. 敏感词模式检查
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(trimmed)) {
      categories.push('sensitive_pattern');
      score -= 25;
      break;
    }
  }

  // 6. 纯符号/无意义内容检查
  const meaningfulChars = trimmed.replace(/[\s\p{P}\p{S}]/gu, '');
  if (meaningfulChars.length === 0 && trimmed.length > 2) {
    categories.push('no_meaningful_content');
    score -= 40;
  }

  score = Math.max(0, Math.min(100, score));
  const passed = score >= 60 && !categories.includes('empty');

  return {
    passed,
    score,
    categories,
    reason: !passed ? categories.join(', ') : undefined,
  };
}

/**
 * 快速验证 — 布尔值返回，用于表单提交前门控
 */
export function isContentValid(
  content: string,
  maxLength: number = 500
): boolean {
  const result = auditText(content, { maxLength });
  return result.passed;
}

/**
 * 获取内容验证的用户提示消息
 */
export function getValidationMessage(
  content: string,
  language: 'zh' | 'en',
  maxLength: number = 500
): string | null {
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    return language === 'zh' ? '「请输入内容」' : 'Please enter content';
  }
  if (trimmed.length > maxLength) {
    return language === 'zh'
      ? `「内容超过 ${maxLength} 字符限制」`
      : `Content exceeds ${maxLength} character limit`;
  }
  
  const repeatedMatch = trimmed.match(/(.)\1{9,}/g);
  if (repeatedMatch) {
    return language === 'zh' ? '「请勿输入大量重复字符」' : 'Please avoid repeated characters';
  }

  return null; // 无问题
}
