# YYC³ Cloud Intelli-Matrix 部署指南

## 📋 目录

- [环境要求](#环境要求)
- [部署架构](#部署架构)
- [快速部署](#快速部署)
- [生产环境部署](#生产环境部署)
- [数据库配置](#数据库配置)
- [Electron 桌面应用部署](#electron-桌面应用部署)
- [Docker 部署](#docker-部署)
- [性能优化建议](#性能优化建议)
- [监控与日志](#监控与日志)
- [故障排查](#故障排查)

---

## 环境要求

### 基础环境

| 组件 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | ≥ 18.x (推荐 20.x LTS) | JavaScript 运行时 |
| pnpm | ≥ 8.x | 包管理器 |
| Git | 最新版 | 版本控制 |

### 数据库支持（可选）

| 数据库 | 版本要求 | 说明 |
|--------|---------|------|
| PostgreSQL | ≥ 15.x | 推荐使用 |
| MySQL | ≥ 8.0 | 可选 |
| MongoDB | ≥ 6.0 | 可选 |

### 桌面应用构建（可选）

| 平台 | 要求 |
|------|------|
| macOS | Xcode Command Line Tools |
| Windows | Visual Studio Build Tools |
| Linux | build-essential, libsecret-dev |

---

## 部署架构

### Web 应用架构

```
┌─────────────────────────────────────────────────────────────┐
│                      用户浏览器                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   反向代理 (Nginx/Caddy)                     │
│                 - SSL 终止                                   │
│                 - 静态资源服务                                │
│                 - 负载均衡                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              YYC³ Cloud Intelli-Matrix (静态文件)            │
│                 - React 应用                                 │
│                 - PWA Service Worker                         │
│                 - 本地存储                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓ (可选)
┌─────────────────────────────────────────────────────────────┐
│                      数据库服务器                             │
│                 - PostgreSQL/MySQL/MongoDB                   │
│                 - 数据持久化                                  │
│                 - 连接池                                      │
└─────────────────────────────────────────────────────────────┘
```

### Electron 桌面应用架构

```
┌─────────────────────────────────────────────────────────────┐
│                   Electron 应用                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              渲染进程 (React 应用)                      │ │
│  │            - UI 渲染                                    │ │
│  │            - 用户交互                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                         ↕ IPC                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              主进程 (Node.js)                           │ │
│  │            - 文件系统访问                                │ │
│  │            - 系统监控                                    │ │
│  │            - 数据库操作                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 快速部署

### 1. 克隆项目

```bash
git clone https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix.git
cd YYC3-Cloud-Intelli-Matrix
```

### 2. 安装依赖

```bash
# 启用 pnpm（如果尚未启用）
corepack enable pnpm

# 安装依赖
pnpm install --frozen-lockfile
```

### 3. 配置环境变量（可选）

创建 `.env` 文件：

```bash
# 数据库配置（可选）
VITE_DB_TYPE=postgresql
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=yyc3_cloudpivot
VITE_DB_USER=admin
VITE_DB_PASSWORD=your_password

# Supabase 配置（可选）
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# WebSocket 配置（可选）
VITE_WS_URL=ws://localhost:8080
```

### 4. 构建生产版本

```bash
# 构建 Web 应用
pnpm build

# 输出目录：dist/
```

### 5. 本地预览

```bash
# 预览构建结果
pnpm preview

# 访问 http://localhost:4173
```

---

## 生产环境部署

### 方案一：静态文件部署

#### 1. 构建

```bash
pnpm build
```

#### 2. 部署到 Web 服务器

**Nginx 配置示例**：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    root /var/www/yyc3-cloudpivot/dist;
    index index.html;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Service Worker 支持
    location /sw.js {
        add_header Cache-Control "no-cache";
        proxy_cache_bypass $http_pragma;
        proxy_cache_revalidate on;
        expires off;
        access_log off;
    }

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;
}
```

**Caddy 配置示例**：

```caddyfile
your-domain.com {
    root * /var/www/yyc3-cloudpivot/dist
    encode gzip

    # SPA 路由支持
    try_files {path} /index.html

    # 静态资源缓存
    @static {
        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot
    }
    header @static Cache-Control "public, max-age=31536000, immutable"

    # Service Worker
    @sw path /sw.js
    header @sw Cache-Control "no-cache"
}
```

### 方案二：Docker 部署

#### 1. 构建 Docker 镜像

```bash
docker build -t yyc3-cloudpivot:latest .
```

#### 2. 运行容器

```bash
docker run -d \
  --name yyc3-cloudpivot \
  -p 8080:8080 \
  --restart unless-stopped \
  yyc3-cloudpivot:latest
```

#### 3. Docker Compose 部署

```yaml
version: '3.8'

services:
  web:
    image: yyc3-cloudpivot:latest
    container_name: yyc3-cloudpivot
    ports:
      - "8080:8080"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - yyc3-network

  # 可选：PostgreSQL 数据库
  postgres:
    image: postgres:15-alpine
    container_name: yyc3-postgres
    environment:
      POSTGRES_DB: yyc3_cloudpivot
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - yyc3-network

networks:
  yyc3-network:
    driver: bridge

volumes:
  postgres-data:
```

启动服务：

```bash
docker-compose up -d
```

---

## 数据库配置

### PostgreSQL 配置

#### 1. 创建数据库

```sql
CREATE DATABASE yyc3_cloudpivot;
CREATE USER yyc3_admin WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE yyc3_cloudpivot TO yyc3_admin;
```

#### 2. 配置连接池

在应用中配置：

```typescript
import { connectionManager } from './database/ConnectionManager';

await connectionManager.createConnection(
  'main-connection',
  'Main Database',
  {
    type: 'postgresql',
    host: 'localhost',
    port: 5432,
    database: 'yyc3_cloudpivot',
    username: 'yyc3_admin',
    password: 'your_password',
    ssl: true,
    connectionTimeout: 10000,
    maxRetries: 3,
  }
);
```

#### 3. 初始化数据库表

数据库表会在首次连接时自动创建，包括：
- `models` - 模型配置表
- `agents` - Agent 配置表
- `nodes` - 节点监控表
- `alerts` - 告警记录表
- `follow_ups` - 跟进记录表

### MySQL 配置

类似 PostgreSQL，只需将 `type` 改为 `mysql`：

```typescript
{
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  database: 'yyc3_cloudpivot',
  username: 'yyc3_admin',
  password: 'your_password',
}
```

### MongoDB 配置

```typescript
{
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'yyc3_cloudpivot',
  username: 'yyc3_admin',
  password: 'your_password',
}
```

---

## Electron 桌面应用部署

### 1. 构建桌面应用

```bash
# macOS
pnpm build:mac

# Windows
pnpm build:win

# Linux
pnpm build:linux
```

### 2. 构建输出

构建完成后，安装包位于 `releases/` 目录：

- **macOS**: `releases/YYC3-Cloud-Intelli-Matrix-{version}.dmg`
- **Windows**: `releases/YYC3-Cloud-Intelli-Matrix-Setup-{version}.exe`
- **Linux**: `releases/YYC3-Cloud-Intelli-Matrix-{version}.AppImage`

### 3. 自动更新配置

在 `electron-builder.yml` 中配置自动更新：

```yaml
publish:
  provider: github
  owner: YYC-Cube
  repo: YYC3-Cloud-Intelli-Matrix
```

---

## Docker 部署

### Dockerfile 说明

项目使用多阶段构建：

1. **构建阶段**: 使用 Node.js 20 Alpine 镜像构建应用
2. **运行阶段**: 使用 Nginx Alpine 镜像提供静态文件服务

### 构建优化

```bash
# 使用 BuildKit 加速构建
DOCKER_BUILDKIT=1 docker build -t yyc3-cloudpivot:latest .

# 使用缓存加速构建
docker build --cache-from yyc3-cloudpivot:latest -t yyc3-cloudpivot:new .
```

### 镜像大小优化

- 使用 Alpine 基础镜像
- 多阶段构建减小镜像体积
- 最终镜像大小约 25MB

---

## 性能优化建议

### 1. 前端优化

#### 启用 Gzip 压缩

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

#### 启用 HTTP/2

```nginx
listen 443 ssl http2;
```

#### 配置浏览器缓存

```nginx
# 静态资源缓存 1 年
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### 2. 数据库优化

#### 连接池配置

```typescript
{
  minConnections: 5,
  maxConnections: 20,
  acquireTimeout: 30000,
  idleTimeout: 600000,
  maxLifetime: 1800000,
}
```

#### 查询优化

- 使用索引加速查询
- 启用查询缓存
- 批量操作减少数据库往返

### 3. 性能监控

使用内置的性能优化工具：

```typescript
import { performanceOptimizer } from './lib/performance-optimizer';

// 获取性能指标
const metrics = performanceOptimizer.getMetrics();
console.log('查询时间:', metrics.queryTime);
console.log('同步时间:', metrics.syncTime);
console.log('IPC 时间:', metrics.ipcTime);
console.log('内存使用:', metrics.memoryUsage);
console.log('缓存命中率:', metrics.cacheHitRate);

// 性能分析
const analysis = performanceOptimizer.analyzePerformance();
console.log('性能建议:', analysis.recommendations);
```

---

## 监控与日志

### 1. 应用监控

#### 健康检查端点

```typescript
// 在应用中添加健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

#### 性能监控

```typescript
import { performanceOptimizer } from './lib/performance-optimizer';

setInterval(() => {
  const metrics = performanceOptimizer.getMetrics();
  // 发送到监控系统
  sendToMonitoring(metrics);
}, 60000); // 每分钟上报一次
```

### 2. 日志管理

#### 日志级别

- `error`: 错误日志
- `warn`: 警告日志
- `info`: 信息日志
- `debug`: 调试日志（仅开发环境）

#### 日志收集

建议使用日志收集工具：
- **ELK Stack**: Elasticsearch + Logstash + Kibana
- **Grafana Loki**: 轻量级日志聚合
- **Sentry**: 错误追踪

---

## 故障排查

### 常见问题

#### 1. 构建失败

**问题**: `pnpm build` 失败

**解决方案**:
```bash
# 清理缓存
pnpm clean

# 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install

# 重新构建
pnpm build
```

#### 2. 数据库连接失败

**问题**: 无法连接到数据库

**解决方案**:
- 检查数据库服务是否运行
- 验证连接参数（主机、端口、用户名、密码）
- 检查防火墙规则
- 查看数据库日志

#### 3. Electron 应用启动失败

**问题**: Electron 应用无法启动

**解决方案**:
```bash
# 检查依赖
pnpm install

# 开发模式运行
pnpm electron:dev

# 查看错误日志
# macOS: ~/Library/Logs/YYC3-Cloud-Intelli-Matrix/
# Windows: %USERPROFILE%\AppData\Roaming\YYC3-Cloud-Intelli-Matrix\logs\
# Linux: ~/.config/YYC3-Cloud-Intelli-Matrix/logs/
```

#### 4. PWA 离线功能不工作

**问题**: Service Worker 未注册

**解决方案**:
- 确保使用 HTTPS（本地开发除外）
- 检查 Service Worker 文件路径
- 清除浏览器缓存并重新加载

#### 5. 性能问题

**问题**: 应用响应缓慢

**解决方案**:
```typescript
// 检查性能指标
const analysis = performanceOptimizer.analyzePerformance();
console.log('性能建议:', analysis.recommendations);

// 清除缓存
performanceOptimizer.clearCache();

// 调整优化配置
performanceOptimizer.setQueryOptimization({
  cacheResult: true,
  batchSize: 50,
  timeout: 3000,
});
```

---

## 安全建议

### 1. HTTPS 配置

始终使用 HTTPS，配置 SSL 证书：

```bash
# 使用 Let's Encrypt
certbot --nginx -d your-domain.com
```

### 2. 环境变量管理

不要将敏感信息提交到代码仓库：

```bash
# .env 文件添加到 .gitignore
echo ".env" >> .gitignore
```

### 3. 数据库安全

- 使用强密码
- 限制数据库访问 IP
- 启用 SSL 连接
- 定期备份

### 4. 依赖安全

```bash
# 检查依赖漏洞
pnpm audit

# 修复漏洞
pnpm audit fix
```

---

## 更新与维护

### 1. 应用更新

```bash
# 拉取最新代码
git pull origin master

# 安装新依赖
pnpm install

# 重新构建
pnpm build

# 重启服务
docker-compose restart
```

### 2. 数据库迁移

数据库表结构会自动更新，无需手动迁移。

### 3. 备份策略

#### 数据库备份

```bash
# PostgreSQL 备份
pg_dump yyc3_cloudpivot > backup_$(date +%Y%m%d).sql

# 恢复
psql yyc3_cloudpivot < backup_20260402.sql
```

#### 本地存储备份

用户数据存储在 localStorage，建议定期导出：

```javascript
// 导出数据
const data = {
  models: localStorage.getItem('yyc3_db_models'),
  agents: localStorage.getItem('yyc3_db_agents'),
  nodes: localStorage.getItem('yyc3_db_nodes'),
};
console.log(JSON.stringify(data, null, 2));
```

---

## 联系与支持

- **GitHub Issues**: https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix/issues
- **文档**: https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix/tree/master/docs
- **邮箱**: support@yyc3.com

---

**最后更新**: 2026-04-02
**版本**: v1.0
