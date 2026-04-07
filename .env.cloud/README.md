# YYC³ CloudPivot Intelli-Matrix 环境变量配置文件使用指南
# Environment Variables Configuration Guide
# @file: README.md
# @description: CloudPivot Intelli-Matrix 环境变量配置文件使用指南
# @author: YanYuCloudCube Team <admin@0379.email>
# @version: v1.0.0
# @created: 2026-03-22

---

## 📋 目录

1. [配置文件列表](#配置文件列表)
2. [使用方法](#使用方法)
3. [配置文件说明](#配置文件说明)
4. [需要填写的配置项](#需要填写的配置项)
5. [最佳实践](#最佳实践)

---

## 📁 配置文件列表

本目录包含以下环境变量配置文件：

| 文件名 | 用途 | 环境 | 说明 |
|-------|------|------|------|
| `.env.development` | 开发环境 | 开发和调试使用，详细日志，热重载 |
| `.env.production` | 生产环境 | 生产部署使用，性能优化，安全加固 |
| `.env.test` | 测试环境 | 自动化测试使用，独立数据库 |
| `.env.local` | 本地开发 | 本地开发使用，IDE 调试支持 |
| `.env.example` | 配置模板 | 环境变量示例，供参考使用 |

---

## 🚀 使用方法

### 方法 1: 直接使用

```bash
# 复制对应的配置文件
cp .env-CloudPivot-Matrix/.env.development .env

# 或
cp .env-CloudPivot-Matrix/.env.production .env
```

### 方法 2: 符号链接

```bash
# 创建符号链接
ln -sf .env-CloudPivot-Matrix/.env.development .env

# 切换环境
ln -sf .env-CloudPivot-Matrix/.env.production .env
```

### 方法 3: 环境变量指定

```bash
# 在启动时指定环境变量
export ENVIRONMENT=development
docker-compose --env-file .env-CloudPivot-Matrix/.env.${ENVIRONMENT} up -d
```

---

## 📝 配置文件说明

### 1. .env.development（开发环境）

**用途**: 日常开发和调试

**特点**:
- ✅ 详细的调试日志（LOG_LEVEL=debug）
- ✅ 热重载支持（HOT_RELOAD=true）
- ✅ 自动重启（AUTO_RESTART=true）
- ✅ 开发数据库（DB_NAME=yyc3_gpt_dev）
- ✅ 监控启用（PROMETHEUS_ENABLED=true）
- ✅ 缓存启用（CACHE_ENABLED=true）
- ✅ 速率限制启用（RATE_LIMIT_ENABLED=true）

**适用场景**:
- 本地开发
- 功能测试
- 调试问题
- 性能分析

**使用方法**:
```bash
cp .env-CloudPivot-Matrix/.env.development .env
docker-compose up -d
```

---

### 2. .env.production（生产环境）

**用途**: 生产部署

**特点**:
- ✅ 生产日志级别（LOG_LEVEL=info）
- ✅ 性能优化（API_WORKERS=4）
- ✅ 安全加固（SSL_ENABLED=true）
- ✅ 备份启用（BACKUP_ENABLED=true）
- ✅ 健康检查（HEALTH_CHECK_ENABLED=true）
- ✅ CORS 配置（CORS_ENABLED=true）
- ✅ 监控和告警（ALERTMANAGER_ENABLED=true）

**适用场景**:
- 生产部署
- 公网访问
- 长期运行
- 高可用性

**使用方法**:
```bash
cp .env-CloudPivot-Matrix/.env.production .env
docker-compose -f docker-compose.stable.yml up -d
```

---

### 3. .env.test（测试环境）

**用途**: 自动化测试

**特点**:
- ✅ 测试数据库（DB_NAME=yyc3_gpt_test）
- ✅ 缓存禁用（CACHE_ENABLED=false）
- ✅ 速率限制禁用（RATE_LIMIT_ENABLED=false）
- ✅ 监控禁用（PROMETHEUS_ENABLED=false）
- ✅ 测试模式（TEST_MODE=true）
- ✅ 独立端口（API_PORT=8001）

**适用场景**:
- 单元测试
- 集成测试
- CI/CD 流水线
- 自动化测试

**使用方法**:
```bash
cp .env-CloudPivot-Matrix/.env.test .env
docker-compose -f docker-compose.test.yml up -d
pytest tests/
```

---

### 4. .env.local（本地开发）

**用途**: 本地开发，IDE 调试

**特点**:
- ✅ 本地数据库（DB_HOST=localhost）
- ✅ 本地 Redis（REDIS_HOST=localhost）
- ✅ 本地 Ollama（OLLAMA_HOST=localhost）
- ✅ IDE 调试支持（IDE_TYPE=vscode）
- ✅ 详细日志（VERBOSE_LOGGING=true）
- ✅ 性能分析（PROFILING_ENABLED=true）

**适用场景**:
- 本地开发
- IDE 调试
- 代码分析
- 性能优化

**使用方法**:
```bash
cp .env-CloudPivot-Matrix/.env.local .env
docker-compose up -d
# 在 VS Code 中使用 F5 启动调试
```

---

### 5. .env.example（配置模板）

**用途**: 环境变量参考模板

**特点**:
- ✅ 完整的配置项说明
- ✅ 示例值和注释
- ✅ 配置项分类清晰
- ✅ 最佳实践建议

**适用场景**:
- 新项目初始化
- 配置参考
- 文档查阅
- 团队协作

**使用方法**:
```bash
# 复制模板
cp .env-CloudPivot-Matrix/.env.example .env

# 编辑配置
vi .env

# 填写实际值
POSTGRES_PASSWORD=your_password
ZHIPU_API_KEY=your_api_key
```

---

## ⚠️ 需要填写的配置项

### 生产环境（.env.production）需要填写的配置

#### 1. 数据库配置
```bash
# ⚠️ 需要填写
POSTGRES_PASSWORD=your_production_password
DB_PASSWORD=your_production_password
```

#### 2. Redis 配置
```bash
# ⚠️ 需要填写
REDIS_PASSWORD=your_redis_password
```

#### 3. API 密钥配置
```bash
# ⚠️ 需要填写
OPENAI_API_KEY=your_openai_api_key
ZHIPU_API_KEY=your_zhipu_api_key
```

#### 4. NFS 挂载配置
```bash
# ⚠️ 需要填写（根据实际情况）
NFS_PATH=/Volume2/yyc3-33
NFS_MOUNT_POINT=/Users/yanyu/nfs_vpn_mount
```

#### 5. MCP 配置
```bash
# ⚠️ 需要填写
BRAVE_API_KEY=your_brave_api_key
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
```

#### 6. SSL/TLS 配置
```bash
# ⚠️ 需要填写
SSL_CERT_PATH=/etc/ssl/certs/api.0379.world.crt
SSL_KEY_PATH=/etc/ssl/private/api.0379.world.key
```

#### 7. CloudPivot Intelli-Matrix 专用配置
```bash
# ⚠️ 需要填写（根据实际部署环境）
CLOUDPIVOT_MATRIX_HOST=api.0379.world
```

### 配置项填写优先级

| 优先级 | 配置项 | 说明 |
|-------|---------|------|
| 🔴 **高优先级** | POSTGRES_PASSWORD | 数据库密码，必须填写 |
| 🔴 **高优先级** | ZHIPU_API_KEY | 智谱 API 密钥，必须填写 |
| 🔴 **高优先级** | CLOUDPIVOT_MATRIX_HOST | CloudPivot Matrix 主机地址，必须填写 |
| 🟡 **中优先级** | REDIS_PASSWORD | Redis 密码，生产环境建议填写 |
| 🟡 **中优先级** | BRAVE_API_KEY | Brave Search API 密钥，需要 MCP 功能时填写 |
| 🟡 **中优先级** | GITHUB_PERSONAL_ACCESS_TOKEN | GitHub 访问令牌，需要 MCP 功能时填写 |
| 🟢 **低优先级** | OPENAI_API_KEY | OpenAI API 密钥，可选 |
| 🟢 **低优先级** | SSL_CERT_PATH | SSL 证书路径，生产环境建议填写 |
| 🟢 **低优先级** | SSL_KEY_PATH | SSL 私钥路径，生产环境建议填写 |

---

## 💡 最佳实践

### 1. 配置文件管理

**✅ 推荐做法**:
- 使用版本控制管理 `.env.example`
- 不提交实际配置文件到 Git
- 使用 `.gitignore` 排除 `.env` 文件
- 为不同环境创建独立配置文件

**❌ 避免做法**:
- 在代码中硬编码配置
- 提交敏感信息到版本控制
- 使用单一配置文件管理所有环境
- 忽略配置文件的安全

### 2. 环境切换

**开发环境**:
```bash
cp .env-CloudPivot-Matrix/.env.development .env
docker-compose up -d
```

**生产环境**:
```bash
cp .env-CloudPivot-Matrix/.env.production .env
docker-compose -f docker-compose.stable.yml up -d
```

**测试环境**:
```bash
cp .env-CloudPivot-Matrix/.env.test .env
docker-compose -f docker-compose.test.yml up -d
pytest tests/
```

### 3. 配置验证

**启动前验证**:
```bash
# 检查配置文件
cat .env

# 验证必需的环境变量
env | grep POSTGRES_PASSWORD
env | grep ZHIPU_API_KEY

# 测试数据库连接
docker exec -it 0379-world-postgres-1 psql -U postgres -d yyc3_gpt -c "SELECT 1;"
```

### 4. 安全建议

**敏感信息保护**:
- ✅ 使用环境变量存储密钥
- ✅ 定期轮换 API 密钥
- ✅ 使用强密码
- ✅ 启用 SSL/TLS
- ✅ 配置 CORS 白名单

**日志管理**:
- ✅ 生产环境使用 info 级别
- ✅ 定期清理日志文件
- ✅ 配置日志轮转
- ✅ 避免记录敏感信息

---

## 📊 配置文件对比

| 配置项 | Development | Production | Test | Local |
|-------|-------------|------------|-------|-------|
| **数据库名称** | yyc3_gpt_dev | yyc3_gpt | yyc3_gpt_test | yyc3_gpt_local |
| **数据库主机** | postgres | postgres | postgres | localhost |
| **日志级别** | debug | info | debug | debug |
| **API 工作进程** | 2 | 4 | 1 | 1 |
| **API 调试** | true | false | true | true |
| **缓存启用** | true | true | false | true |
| **速率限制** | true | true | false | false |
| **监控启用** | true | true | false | false |
| **热重载** | true | false | false | true |
| **自动重启** | true | false | false | true |
| **SSL/TLS** | false | true | false | false |
| **备份启用** | false | true | false | false |
| **CORS** | false | true | false | false |
| **IDE 调试** | false | false | false | true |
| **CloudPivot 端口** | 3118 | 3118 | 3119 | 3118 |
| **CloudPivot WS 端口** | 3113 | 3113 | 3114 | 3113 |
| **CloudPivot 主机** | 192.168.3.22 | api.0379.world | 192.168.3.22 | localhost |

---

## 🚀 快速开始

### 开发环境快速开始

```bash
# 1. 复制开发环境配置
cp .env-CloudPivot-Matrix/.env.development .env

# 2. 启动服务
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

### 生产环境快速开始

```bash
# 1. 复制生产环境配置
cp .env-CloudPivot-Matrix/.env.production .env

# 2. 填写必需的配置项
vi .env
# 填写：POSTGRES_PASSWORD, ZHIPU_API_KEY, CLOUDPIVOT_MATRIX_HOST

# 3. 启动服务
docker-compose -f docker-compose.stable.yml up -d

# 4. 验证服务
curl http://localhost:8000/v1/ping
```

---

## 📚 相关文档

- [环境变量完整参考](../../VARIABLES.md)
- [服务介绍文档](../../SERVICES_GUIDE.md)
- [部署指南](../../DEPLOYMENT_REPORT.md)
- [稳定化部署](../../STABLE.md)

---

**@file**: README.md
**@description**: CloudPivot Intelli-Matrix 环境变量配置文件使用指南
**@author**: YanYuCloudCube Team <admin@0379.email>
**@version**: v1.0.0
**@created**: 2026-03-22
**@status**: stable
**@license**: MIT
**@copyright**: Copyright (c) 2026 YanYuCloudCube Team