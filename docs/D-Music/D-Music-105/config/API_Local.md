# D-Music 本地 API 对接方案

> 纯本地方案，无第三方依赖

---

## 一、功能模块 API 设计

### 1.1 语音转文字 (STT)

```
POST /api/v1/stt/transcribe
Content-Type: multipart/form-data

Request:
- audio: File 或 base64
- language: zh/en/ja/ko

Response:
{
  "success": true,
  "data": {
    "text": "识别的文字内容",
    "confidence": 0.95,
    "duration": 3.5
  }
}
```

### 1.2 消息墙位置触发

```
GET /api/v1/spacetime/nearby?lat=34.7528&lng=113.6542&radius=1000

Response:
{
  "success": true,
  "data": {
    "messages": [
      { "id": "msg_1", "distance": 120, "content": "..." }
    ]
  }
}
```

### 1.3 创作协作版本树

```
GET /api/v1/collaboration/tree/{creationId}

Response:
{
  "success": true,
  "data": {
    "root": { "id": "ver_root", "children": [...] },
    "branches": ["main", "feature/vocal"],
    "currentVersion": "ver_xxx"
  }
}
```

---

## 二、本地存储方案

### 2.1 语音文件存储

```
存储路径: /Volume2/dmusic/audio/
URL访问: http://yyc3-45:3250/static/audio/xxx.mp3
```

### 2.2 用户数据存储

```
Redis DB 2: 用户KV存储
MySQL yyc3_music: 结构化数据
```

---

## 三、API 服务配置

```bash
# .env.local
NODE_ENV=development
PORT=3250

# MySQL (NAS)
DB_HOST=yyc3-45
DB_PORT=3306
DB_NAME=yyc3_music
DB_USER=yyc3_music
DB_PASSWORD=yyc3_music_0379

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=2

# 本地存储
STORAGE_PATH=/Volume2/dmusic
AUDIO_PATH=/Volume2/dmusic/audio
IMAGE_PATH=/Volume2/dmusic/images
```

---

## 四、端口分配

| 服务 | 端口 | 位置 |
|------|------|------|
| API Server | 3250 | 本地 |
| WebSocket | 3251 | 本地 |
| MySQL | 3306 | NAS |
| Redis | 6379 | 本地 |

---

## 五、前端对接

```typescript
const API_BASE = 'http://localhost:3250/api/v1'

// STT
fetch(`${API_BASE}/stt/transcribe`, { method: 'POST', body: formData })

// 位置
fetch(`${API_BASE}/spacetime/nearby?lat=${lat}&lng=${lng}`)

// 版本树
fetch(`${API_BASE}/collaboration/tree/${id}`)
```

---

<div align="center">

> YYC³ Team | D-Music 本地 API 方案

</div>
