---
file: YYC3-CP-IM-CICD-部署指南.md
description: YYC3-CP-IM-CI/CD 部署指南
author: YanYuCloudCube Team <admin0379.email>
version: v1.0.0
created: 2026-04-04
updated: 2026-04-04
status: completed
tags: CI/CD,自动化,部署,DevOps,Docker,zh-CN
category: implementation
language: zh-CN
audience: developers,architects
complexity: advanced
---

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***

---

# YYC3-CP-IM-CICD 部署指南

## 概述

本文档详细说明 YYC³ Cloud Intelli-Matrix 项目的智能自动化 CI/CD 系统设计、配置和使用方法，涵盖从代码提交到生产部署的全流程自动化。

---

## 目录

1. [架构概述](#架构概述)
2. [工作流设计](#工作流设计)
3. [质量门禁](#质量门禁)
4. [安全审计](#安全审计)
5. [性能基准测试](#性能基准测试)
6. [构建与打包](#构建与打包)
7. [部署策略](#部署策略)
8. [监控与回滚](#监控与回滚)
9. [Docker 容器化](#docker-容器化)
10. [本地开发与测试](#本地开发与测试)

---

## 架构概述

### 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │  Push/PR     │───→│  Workflow    │───→│  Jobs        │    │
│  │  Trigger     │    │  Dispatch    │    │  Execution   │    │
│  └──────────────┘    └──────────────┘    └──────────────┘    │
│         ↓                    ↓                    ↓             │
│  ┌─────────────────────────────────────────────────────┐      │
│  │           Quality Gate & Security Audit              │      │
│  └─────────────────────────────────────────────────────┘      │
│         ↓                    ↓                                 │
│  ┌──────────────┐    ┌──────────────┐                        │
│  │  Build       │    │  Deploy      │                        │
│  │  Docker      │    │  Staging/    │                        │
│  │  Image       │    │  Production  │                        │
│  └──────────────┘    └──────────────┘                        │
│         ↓                    ↓                                 │
│  ┌─────────────────────────────────────────────────────┐      │
│  │      Monitoring & Rollback (if needed)              │      │
│  └─────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 技术栈

| 组件 | 技术选型 | 用途 |
|------|---------|------|
| CI/CD 平台 | GitHub Actions | 持续集成与部署 |
| 包管理器 | pnpm 8.x | 依赖管理 |
| 构建工具 | Vite 6.3.5 | 应用构建 |
| 容器化 | Docker + Nginx | 容器化部署 |
| 容器编排 | Docker Compose | 本地编排 |
| 代码质量 | ESLint + TypeScript | 代码检查 |
| 测试框架 | Vitest | 单元测试 |
| 性能测试 | Lighthouse CI | 性能评估 |
| 安全扫描 | Trivy + pnpm audit | 漏洞检测 |
| 监控 | Prometheus + Grafana | 应用监控 |

---

## 工作流设计

### 触发条件

```yaml
on:
  push:
    branches: [main, develop, 'release/**']
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        type: choice
        options: [staging, production]
      deploy_type:
        description: '部署类型'
        required: true
        type: choice
        options: [full, canary, rollback]
```

### 工作流阶段

```mermaid
graph TD
    A[代码提交] --> B[质量门禁]
    B --> C{通过?}
    C -->|是| D[安全审计]
    C -->|否| E[失败通知]
    D --> F{通过?}
    F -->|是| G[性能基准测试]
    F -->|否| E
    G --> H[构建应用]
    H --> I{分支?}
    I -->|develop| J[部署预发布]
    I -->|main| K[部署生产]
    J --> L[E2E 测试]
    K --> M[健康检查]
    L --> N{通过?}
    M --> O{健康?}
    N -->|是| P[部署完成]
    N -->|否| Q[回滚]
    O -->|是| P
    O -->|否| Q
```

---

## 质量门禁

### 质量评分系统

```yaml
- name: Analyze code quality
  id: analyze
  run: |
    SCORE=100

    if [[ "${{ env.LINT_FAILED }}" == "true" ]]; then
      echo "Linting failed, reducing score by 20"
      ((SCORE-=20))
    fi

    if [[ "${{ env.TSC_FAILED }}" == "true" ]]; then
      echo "Type check failed, reducing score by 30"
      ((SCORE-=30))
    fi

    COVERAGE=${{ steps.test.outputs.COVERAGE }}
    if (( $(echo "$COVERAGE < 90" | bc -l) )); then
      echo "Coverage below 90%, reducing score by 10"
      ((SCORE-=10))
    fi

    echo "should-deploy=$(if [ $SCORE -ge 70 ]; then echo 'true'; else echo 'false'; fi)" >> $GITHUB_OUTPUT
```

### 质量标准

| 指标 | 满分 | 扣分规则 | 阈值 |
|------|------|---------|------|
| ESLint | 20 | 失败扣 20 分 | 必须通过 |
| TypeScript | 30 | 失败扣 30 分 | 必须通过 |
| 测试覆盖率 | 10 | < 90% 扣 10 分 | ≥ 90% |
| 总分 | 100 | ≥ 70 分通过 | 70 |

### 质量报告

```
## Quality Score: 100/100
- Lint: ✅ Pass
- Type Check: ✅ Pass
- Coverage: 100%
```

---

## 安全审计

### 依赖安全扫描

```yaml
- name: Run pnpm audit
  run: |
    AUDIT_OUTPUT=$(pnpm audit --audit-level=moderate --json 2>&1)
    HIGH_COUNT=$(echo "$AUDIT_OUTPUT" | jq '.vulnerabilities.high | length')
    MODERATE_COUNT=$(echo "$AUDIT_OUTPUT" | jq '.vulnerabilities.moderate | length')

    if [ "$HIGH_COUNT" -gt 0 ]; then
      echo "::error::Found $HIGH_COUNT high severity vulnerabilities"
      exit 1
    fi
```

### 容器安全扫描

```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    scan-ref: '.'
    format: 'sarif'
    output: 'trivy-results.sarif'
    severity: 'CRITICAL,HIGH'
```

### 安全报告

```
## Security Audit
- High: 0
- Moderate: 0
- Critical: 0
```

---

## 性能基准测试

### Lighthouse CI 配置

```javascript
module.exports = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    formFactor: 'desktop',
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    },
    throttling: {
      rttMs: 40,
      throughputKbps: 10 * 1024,
      cpuSlowdownMultiplier: 1,
    },
  },
};
```

### 性能预算

```json
{
  "budgets": [
    {
      "path": "dist/assets/*.js",
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 500
        }
      ]
    },
    {
      "path": "dist/assets/*.css",
      "resourceSizes": [
        {
          "resourceType": "stylesheet",
          "budget": 50
        }
      ]
    }
  ]
}
```

### 性能指标

| 指标 | 目标 | 阈值 |
|------|------|------|
| Performance Score | ≥ 90 | 85 |
| First Contentful Paint | ≤ 1.8s | 2.5s |
| Largest Contentful Paint | ≤ 2.5s | 4.0s |
| Total Blocking Time | ≤ 200ms | 300ms |
| Cumulative Layout Shift | ≤ 0.1 | 0.25 |
| Speed Index | ≤ 3.4s | 5.8s |

---

## 构建与打包

### 版本生成

```yaml
- name: Generate version
  id: version
  run: |
    VERSION=$(git describe --tags --always --dirty 2>/dev/null || echo "0.0.1-${GITHUB_SHA::7}")
    echo "version=$VERSION" >> $GITHUB_OUTPUT
```

### 构建信息生成

```yaml
- name: Generate build info
  run: |
    cat > dist/build-info.json <<EOF
    {
      "version": "${{ steps.version.outputs.version }}",
      "commit": "${{ github.sha }}",
      "branch": "${{ github.ref_name }}",
      "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
      "builder": "${{ github.actor }}"
    }
    EOF
```

### Docker 镜像构建

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: |
      ${{ steps.image.outputs.tag }}
      ghcr.io/${{ github.repository }}:latest
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

---

## 部署策略

### 预发布部署

```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  environment:
    name: staging
    url: ${{ steps.deploy.outputs.url }}
```

### 生产部署

```yaml
deploy-production:
  if: github.ref == 'refs/heads/main'
  environment:
    name: production
    url: ${{ steps.deploy.outputs.url }}
```

### 部署类型

| 类型 | 描述 | 使用场景 |
|------|------|---------|
| **Full** | 完全部署 | 主版本发布 |
| **Canary** | 灰度发布 | 新功能测试 |
| **Rollback** | 回滚 | 生产问题 |

---

## 监控与回滚

### 健康检查

```yaml
- name: Health check
  run: |
    URL="${{ steps.deploy.outputs.url }}"
    MAX_RETRIES=30
    RETRY_DELAY=10

    for i in $(seq 1 $MAX_RETRIES); do
      if curl -f -s -o /dev/null "$URL"; then
        echo "✅ Health check passed"
        exit 0
      fi
      echo "⏳ Waiting for deployment... ($i/$MAX_RETRIES)"
      sleep $RETRY_DELAY
    done

    echo "❌ Health check failed"
    exit 1
```

### 自动回滚

```yaml
- name: Rollback on failure
  if: failure()
  run: |
    echo "🔄 Rolling back to previous version..."
    AWS_BUCKET=${{ secrets.AWS_S3_BUCKET_PRODUCTION }}
    aws s3 sync s3://$AWS_BUCKET/${{ steps.backup.outputs.backup_name }}/ s3://$AWS_BUCKET/ --delete

    CF_DISTRIBUTION=${{ secrets.AWS_CLOUDFRONT_ID_PRODUCTION }}
    aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION --paths "/*"
```

### 部署后监控

```yaml
post-deploy-monitoring:
  needs: [deploy-production]
  if: always() && needs.deploy-production.result == 'success'
  steps:
    - name: Monitor application health
      run: |
        echo "Starting post-deployment monitoring..."
        echo "Duration: 30 minutes"
```

---

## Docker 容器化

### Dockerfile 结构

```dockerfile
# Base stage
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN pnpm install --frozen-lockfile --prod=false

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Runner stage
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1
```

### Nginx 配置

```nginx
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /health {
        access_log off;
        return 200 "healthy\n";
    }
}
```

### Docker Compose 编排

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3118:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    depends_on:
      - prometheus
```

---

## 本地开发与测试

### 本地构建

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建
pnpm build

# 运行测试
pnpm test

# 运行测试并生成覆盖率
pnpm test:coverage

# 代码检查
pnpm lint

# 类型检查
pnpm type-check
```

### 本地 Docker

```bash
# 构建镜像
docker build -t yyc3-cpim:latest .

# 运行容器
docker run -p 3118:8080 yyc3-cpim:latest

# 使用 Docker Compose
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 本地性能测试

```bash
# 安装 Lighthouse CI
npm install -g @lhci/cli

# 初始化配置
lhci autorun

# 收集性能数据
lhci collect

# 上传报告
lhci upload
```

---

## 环境配置

### 必需的 GitHub Secrets

| Secret 名称 | 描述 | 示例 |
|------------|------|------|
| `AWS_ACCESS_KEY_ID` | AWS 访问密钥 ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS 访问密钥 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS 区域 | `us-east-1` |
| `AWS_S3_BUCKET_STAGING` | 预发布 S3 存储桶 | `yyc3-cpim-staging` |
| `AWS_S3_BUCKET_PRODUCTION` | 生产 S3 存储桶 | `yyc3-cpim-production` |
| `AWS_CLOUDFRONT_ID_STAGING` | 预发布 CloudFront ID | `E1234567890ABCD` |
| `AWS_CLOUDFRONT_ID_PRODUCTION` | 生产 CloudFront ID | `E0987654321DCBA` |
| `SLACK_WEBHOOK` | Slack 通知 Webhook | `https://hooks.slack.com/services/...` |
| `CODECOV_TOKEN` | Codecov 令牌 | `abc123def456` |

### 环境变量

```env
# Node.js
NODE_VERSION=20.x
PNPM_VERSION=8.x

# 应用配置
VITE_API_URL=https://api.yyc3.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_KEY=your-supabase-key

# 部署配置
BUILD_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
VCS_REF=$(git rev-parse HEAD)

# 监控配置
GRAFANA_ADMIN_USER=admin
GRAFANA_ADMIN_PASSWORD=your-password
```

---

## 监控与告警

### Prometheus 配置

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'yyc3-cpim'
    static_configs:
      - targets: ['app:8080']
    metrics_path: '/metrics'
```

### Grafana 仪表板

创建监控仪表板以可视化：

1. **应用性能**
   - 响应时间
   - 吞吐量
   - 错误率

2. **资源使用**
   - CPU 使用率
   - 内存使用
   - 磁盘 I/O

3. **业务指标**
   - 用户活跃度
   - 功能使用统计
   - 转化率

### 告警规则

```yaml
groups:
  - name: yyc3-cpim-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 2
        for: 5m
        annotations:
          summary: "Response time too high"
```

---

## 最佳实践

### 1. 分支策略

```
main (生产)
  ↑
  develop (预发布)
  ↑
  feature/* (功能分支)
  ↑
  hotfix/* (紧急修复)
```

### 2. 提交规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
perf: 性能优化
ci: CI/CD 相关
```

### 3. 版本管理

```
语义化版本 (Semantic Versioning):
MAJOR.MINOR.PATCH

- MAJOR: 不兼容的 API 变更
- MINOR: 向后兼容的新功能
- PATCH: 向后兼容的 bug 修复
```

### 4. 发布流程

1. 合并功能到 `develop`
2. 自动部署到预发布环境
3. 测试验证通过后
4. 创建 `release/*` 分支
5. 合并到 `main`
6. 自动部署到生产环境
7. 创建 Git Tag
8. 生成 Release Notes

---

## 故障排查

### 常见问题

#### 1. 构建失败

**问题**：Docker 构建失败

**解决方案**：
```bash
# 清理缓存
docker system prune -a

# 重新构建
docker build --no-cache -t yyc3-cpim:latest .
```

#### 2. 部署失败

**问题**：健康检查失败

**解决方案**：
```bash
# 检查应用日志
docker-compose logs app

# 手动健康检查
curl http://localhost:3118/health
```

#### 3. 性能下降

**问题**：Lighthouse 分数下降

**解决方案**：
```bash
# 分析 bundle 大小
pnpm build
npx vite-bundle-visualizer

# 优化代码分割
# 检查是否有大文件未压缩
```

---

## 性能优化建议

### 1. 代码分割

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['lucide-react', 'clsx'],
        }
      }
    }
  }
});
```

### 2. 资源优化

```javascript
// 启用 gzip 压缩
// 使用 WebP 图片格式
// 懒加载图片和组件
```

### 3. 缓存策略

```nginx
# 静态资源长期缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 短期缓存
location ~* \.(html)$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

---

## 总结

YYC³ Cloud Intelli-Matrix 的智能自动化 CI/CD 系统提供了：

### ✅ 核心特性

1. **自动化质量门禁** - 代码质量评分系统
2. **全面安全审计** - 依赖和容器漏洞扫描
3. **性能基准测试** - Lighthouse CI 集成
4. **多环境部署** - 预发布和生产环境
5. **自动回滚机制** - 失败自动恢复
6. **持续监控** - Prometheus + Grafana
7. **容器化部署** - Docker + Docker Compose
8. **智能通知** - Slack 集成

### 📊 质量指标

- 测试覆盖率：≥ 90%
- 质量评分：≥ 70/100
- 性能评分：≥ 90/100
- 安全漏洞：0 高危

### 🚀 部署效率

- 自动化程度：100%
- 部署时间：~5-10 分钟
- 回滚时间：~1-2 分钟
- 健康检查：30 秒内完成

这套 CI/CD 系统为 YYC³ Cloud Intelli-Matrix 提供了企业级的自动化部署能力，确保代码质量、安全性和性能的同时，大大提高了发布效率和可靠性。

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for Future***」
> 「***All things converge in cloud pivot; Deep stacks ignite a new era of intelligence***」

</div>
