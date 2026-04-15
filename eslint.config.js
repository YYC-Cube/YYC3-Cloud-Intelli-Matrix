/**
 * @file: eslint.config.js
 * @description: ESLint 配置文件 · 代码质量检查规则
 * @author: YanYuCloudCube Team
 * @version: v1.0.0
 * @created: 2026-02-26
 * @updated: 2026-04-09
 * @status: active
 * @tags: [config],[eslint],[linting]
 *
 * @brief: ESLint 代码检查配置
 *
 * @details:
 * - TypeScript 严格模式检查
 * - React Hooks 规则
 * - 未使用导入清理
 * - YYC³ 自定义规则
 *
 * @dependencies: ESLint, TypeScript ESLint, React Plugin
 * @exports: default config
 * @notes: 配合 Prettier 使用，避免规则冲突
 */

import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  {
    ignores: [
      "dist",
      "dist-electron",
      "electron/dist-electron",
      "node_modules",
      "coverage",
      "*.config.ts",
      "*.config.js",
      "*.config.mjs",
      "docs",
      "scripts",
      "src/types/*.d.ts",
      "src/types/vite-plugin-react-fix.d.ts",
      "electron",
      "eslint.config.js",
      "postcss.config.mjs",
      "vite.config.ts",
      "vitest.config.ts",
      "tsconfig*.json",
      "pnpm-lock.yaml",
      "package*.json",
      "*.md",
      "*.log",
      "*.tmp",
      ".DS_Store",
      "e2e",
      "playwright-report",
      "test-results",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "hotel-quick-verify.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.base.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly",
        NodeJS: "readonly",
        BufferEncoding: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          args: "after-used",
          vars: "all",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-undef": "warn",
      "preserve-caught-error": "off",
      "no-useless-assignment": "warn",
    },
  },
  {
    files: ["src/types/*.d.ts", "*.d.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
];
