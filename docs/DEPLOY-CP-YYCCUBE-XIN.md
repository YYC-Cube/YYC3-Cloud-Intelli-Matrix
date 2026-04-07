# cp.yyccube.xin 部署指南

**项目**: YYC³ Cloud Intelli-Matrix
**目标域名**: cp.yyccube.xin
**文档版本**: 1.0.0
**更新日期**: 2026-04-01

---

## 📋 概述

本文档说明如何将 YYC³ Cloud Intelli-Matrix 项目部署到 cp.yyccube.xin 域名。

---

## 🚀 部署方式

### 方式一: 手动部署（推荐用于生产环境）

#### 1. 本地构建

```bash
# 1. 克隆仓库（如果还没有）
git clone https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix.git
cd YYC3-Cloud-Intelli-Matrix

# 2. 安装依赖
pnpm install

# 3. 构建生产版本
pnpm build
```

#### 2. 配置环境变量

在构建前，创建 `.env.production` 文件：

```bash
# .env.production
VITE_BASE_URL=/
VITE_API_URL=https://cp.yyccube.xin/api
VITE_WS_URL=wss://cp.yyccube.xin/ws
```

#### 3. 部署到服务器

```bash
# 方式 A: 使用 SCP 上传
scp -r dist/* user@cp.yyccube.xin:/var/www/yyc3-cloudpivot/

# 方式 B: 使用 Rsync 同步
rsync -avz --delete dist/ user@cp.yyccube.xin:/var/www/yyc3-cloudpivot/

# 方式 C: 使用 Git 部署
ssh user@cp.yyccube.xin
cd /var/www/yyc3-cloudpivot
git pull origin main
pnpm install --prod
pnpm build
```

---

### 方式二: 自动部署（推荐用于开发/测试环境）

#### 1. 配置 GitHub Actions

在 `.github/workflows/deploy-cp.yml` 中创建部署 workflow：

```yaml
name: Deploy to cp.yyccube.xin

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.x

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: 20.x
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build project
        run: pnpm build
        env:
          VITE_BASE_URL: /

      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: cp.yyccube.xin
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/yyc3-cloudpivot
          SOURCE: dist/
          ARGS: "-rlgoDzvc -i --delete"
```

#### 2. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|-------------|------|--------|
| `SSH_PRIVATE_KEY` | SSH 私钥 | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `REMOTE_USER` | 服务器用户名 | `deploy` |

#### 3. 生成 SSH 密钥对

```bash
# 在本地生成 SSH 密钥对
ssh-keygen -t ed25519 -C "github-actions@yyc3" -f ~/.ssh/github_actions

# 将公钥添加到服务器
ssh-copy-id -i ~/.ssh/github_actions.pub user@cp.yyccube.xin

# 将私钥添加到 GitHub Secrets
cat ~/.ssh/github_actions
```

---

## 🔧 服务器配置

### Nginx 配置

在服务器上创建 Nginx 配置文件 `/etc/nginx/sites-available/yyc3-cloudpivot`：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name cp.yyccube.xin;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cp.yyccube.xin;

    # SSL 证书配置
    ssl_certificate /etc/letsencrypt/live/cp.yyccube.xin/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cp.yyccube.xin/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志配置
    access_log /var/log/nginx/yyc3-cloudpivot-access.log;
    error_log /var/log/nginx/yyc3-cloudpivot-error.log;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 静态文件根目录
    root /var/www/yyc3-cloudpivot;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理（如果需要）
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket 代理（如果需要）
    location /ws/ {
        proxy_pass http://localhost:3000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 启用 Nginx 配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/yyc3-cloudpivot /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 配置 SSL 证书（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d cp.yyccube.xin

# 自动续期
sudo certbot renew --dry-run
```

---

## 📦 目录结构

服务器上的目录结构：

```
/var/www/yyc3-cloudpivot/
├── index.html
├── assets/
│   ├── index-xxxxx.css
│   ├── index-xxxxx.js
│   ├── react-vendor-xxxxx.js
│   └── ...
├── favicon.ico
└── robots.txt
```

---

## 🔄 部署流程

### 完整部署流程

```bash
# 1. 本地构建
pnpm build

# 2. 备份当前版本
ssh user@cp.yyccube.xin
cd /var/www
sudo cp -r yyc3-cloudpivot yyc3-cloudpivot.backup.$(date +%Y%m%d_%H%M%S)
exit

# 3. 部署新版本
rsync -avz --delete dist/ user@cp.yyccube.xin:/var/www/yyc3-cloudpivot/

# 4. 验证部署
curl -I https://cp.yyccube.xin

# 5. 清理旧备份（保留最近 5 个）
ssh user@cp.yyccube.xin
cd /var/www
ls -dt yyc3-cloudpivot.backup.* | tail -n +6 | xargs sudo rm -rf
```

---

## 🔍 验证部署

### 检查清单

- [ ] 网站可以正常访问
- [ ] HTTPS 证书有效
- [ ] 所有路由正常工作
- [ ] 静态资源加载正常
- [ ] API 代理正常（如果配置）
- [ ] WebSocket 连接正常（如果配置）
- [ ] 控制台无错误
- [ ] 性能指标正常

### 性能测试

```bash
# 使用 Lighthouse 测试
npx lighthouse https://cp.yyccube.xin --view

# 使用 WebPageTest
# 访问 https://www.webpagetest.org/ 并输入 URL
```

---

## 🐛 故障排查

### 常见问题

#### 1. 404 错误

**症状**: 访问某些路由返回 404

**解决方案**: 确保 Nginx 配置中包含 `try_files $uri $uri/ /index.html;`

#### 2. 静态资源加载失败

**症状**: CSS/JS 文件返回 404

**解决方案**:
- 检查 `dist/` 目录是否正确上传
- 检查文件权限
- 检查 Nginx 配置中的 `root` 路径

#### 3. HTTPS 证书问题

**症状**: 浏览器显示证书错误

**解决方案**:
```bash
# 检查证书状态
sudo certbot certificates

# 重新获取证书
sudo certbot --nginx -d cp.yyccube.xin --force-renewal
```

#### 4. WebSocket 连接失败

**症状**: WebSocket 连接被拒绝

**解决方案**:
- 检查 Nginx WebSocket 代理配置
- 确保后端服务正在运行
- 检查防火墙规则

---

## 📊 监控与日志

### 查看日志

```bash
# Nginx 访问日志
sudo tail -f /var/log/nginx/yyc3-cloudpivot-access.log

# Nginx 错误日志
sudo tail -f /var/log/nginx/yyc3-cloudpivot-error.log

# 系统日志
sudo journalctl -u nginx -f
```

### 监控指标

- 响应时间
- 错误率
- 流量
- CPU/内存使用率

---

## 🔐 安全建议

1. **定期更新**
   - 定期更新系统和依赖
   - 定期更新 SSL 证书

2. **访问控制**
   - 限制 SSH 访问
   - 使用防火墙规则

3. **备份**
   - 定期备份数据
   - 测试恢复流程

4. **监控**
   - 设置告警
   - 定期检查日志

---

## 📞 支持

如有问题，请联系：

- **技术支持**: support@yyc3.com
- **GitHub Issues**: https://github.com/YYC-Cube/YYC3-Cloud-Intelli-Matrix/issues

---

**文档版本**: 1.0.0
**最后更新**: 2026-04-01
