# M-98 Music
——董小姐个人音乐中心
创建一个融合科技感设计与音乐体验的现代化Web应用。这个应用将展示董小姐的个人音乐中心，包含音乐播放器、AI歌词创作、粉丝互动系统和数据面板等功能。
## 应用架构设计
### 技术栈
- 前端框架: React 18
- 样式框架: Tailwind CSS
- 动画库: Framer Motion, GSAP
- 3D效果: Three.js
- 图表库: Chart.js
- 音频处理: Howler.js
- 状态管理: React Context API
### 项目结构
```plaintext
m98-music/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── assets/
│   │   ├── music/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Player/
│   │   ├── Lyrics/
│   │   ├── Fans/
│   │   ├── Analytics/
│   │   ├── Common/
│   │   └── Layout/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── context/
│   ├── App.js
│   ├── index.js
│   └── styles/
├── docs/
├── package.json
└── README.md

```
## 完整代码实现
### package.json
```json
{
  "name": "m98-music",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "chart.js": "^4.4.0",
    "framer-motion": "^10.12.16",
    "gsap": "^3.12.2",
    "howler": "^2.2.3",
    "react": "^18.2.0",
    "react-chartjs-2": "^5.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.10.1",
    "react-router-dom": "^6.14.1",
    "react-scripts": "5.0.1",
    "three": "^0.153.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "tailwindcss": "^3.3.2",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27"
  }
}

```
### public/index.html
```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="M-98 MUSIC - 董小姐个人音乐中心，融合东方美学与现代科技的音乐体验平台"
    />
    <title>M-98 MUSIC | 董小姐个人音乐中心</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
  </head>
  <body>
    <noscript>您需要启用JavaScript才能运行此应用。</noscript>
    <div id="root"></div>
  </body>
</html>

```
### src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```
### src/styles/index.css
```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  /* M-98 MUSIC 主题色彩 */
  --m98-primary: #6366F1;     /* 主色调 - 靛蓝色 */
  --m98-secondary: #8B5CF6;   /* 次要色 - 紫色 */
  --m98-accent: #EC4899;      /* 强调色 - 粉色 */
  --m98-dark: #0F172A;         /* 深色背景 */
  --m98-darker: #0A1128;       /* 更深色背景 */
  --m98-light: #E5E7EB;        /* 浅色文本 */
  --m98-success: #10B981;      /* 成功色 */
  --m98-warning: #F59E0B;      /* 警告色 */
  --m98-error: #EF4444;        /* 错误色 */
  
  /* 霓虹光效 */
  --neon-blue: #38BDF8;
  --neon-purple: #A855F7;
  --neon-pink: #EC4899;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  background-color: var(--m98-dark);
  color: #ffffff;
  overflow-x: hidden;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%);
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--m98-primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--m98-secondary);
}

/* 玻璃态效果 */
.glass {
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 霓虹发光效果 */
.neon-glow {
  box-shadow: 0 0 15px var(--m98-primary);
}

.neon-glow-blue {
  box-shadow: 0 0 15px var(--neon-blue);
}

.neon-glow-purple {
  box-shadow: 0 0 15px var(--neon-purple);
}

.neon-glow-pink {
  box-shadow: 0 0 15px var(--neon-pink);
}

.neon-text {
  text-shadow: 0 0 10px currentColor;
}

/* 网格背景 */
.grid-bg {
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}

/* 科技感边框 */
.tech-border {
  position: relative;
}

.tech-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-image: linear-gradient(45deg, var(--m98-primary), var(--m98-accent)) 1;
  pointer-events: none;
}

/* 脉冲动画 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 5px var(--m98-error);
  }
  50% {
    box-shadow: 0 0 20px var(--m98-error);
  }
}

.pulse {
  animation: pulse 1.5s infinite;
}

/* 数据流动画 */
@keyframes data-flow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.data-flow {
  background: linear-gradient(90deg, 
    transparent, 
    var(--m98-primary), 
    transparent
  );
  background-size: 200% 100%;
  animation: data-flow 2s linear infinite;
}

/* 音频可视化动画 */
@keyframes audio-wave {
  0% { height: 5px; }
  50% { height: 30px; }
  100% { height: 5px; }
}

.audio-wave {
  display: flex;
  align-items: flex-end;
  height: 40px;
  gap: 3px;
}

.audio-wave span {
  width: 4px;
  background: linear-gradient(to top, var(--m98-primary), var(--m98-accent));
  border-radius: 2px;
  animation: audio-wave 1s ease-in-out infinite;
}

.audio-wave span:nth-child(2) { animation-delay: 0.1s; }
.audio-wave span:nth-child(3) { animation-delay: 0.2s; }
.audio-wave span:nth-child(4) { animation-delay: 0.3s; }
.audio-wave span:nth-child(5) { animation-delay: 0.4s; }

/* 3D卡片效果 */
.card-3d {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-3d:hover {
  transform: rotateY(10deg) rotateX(5deg);
}

/* 粒子背景 */
.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.particle {
  position: absolute;
  background: var(--m98-primary);
  border-radius: 50%;
  pointer-events: none;
  opacity: 0.5;
}

/* 电路板效果 */
.circuit-board {
  position: relative;
  overflow: hidden;
}

.circuit-board::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(90deg, transparent 98%, var(--m98-primary) 100%),
    linear-gradient(0deg, transparent 98%, var(--m98-primary) 100%);
  background-size: 30px 30px;
  opacity: 0.1;
  pointer-events: none;
}

/* 音乐播放器进度条 */
.music-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.music-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--m98-primary), var(--m98-accent));
  border-radius: 2px;
  width: 0%;
  transition: width 0.1s linear;
}

/* 歌词高亮 */
.lyrics-highlight {
  color: var(--m98-accent);
  text-shadow: 0 0 10px var(--m98-accent);
  font-size: 1.2em;
  transition: all 0.3s ease;
}

/* 粉丝留言墙 */
.fan-message {
  position: relative;
  overflow: hidden;
}

.fan-message::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    left: 100%;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

```
### src/App.js
```javascript
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Howl } from 'howler';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Player from './pages/Player';
import Lyrics from './pages/Lyrics';
import Fans from './pages/Fans';
import Analytics from './pages/Analytics';
import { MusicProvider } from './context/MusicContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import ParticlesBackground from './components/Common/ParticlesBackground';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [sound, setSound] = useState(null);

  // 初始化音频
  useEffect(() => {
    const initSound = () => {
      const newSound = new Howl({
        src: ['/assets/music/sample.mp3'],
        html5: true,
        onplay: () => setIsPlaying(true),
        onpause: () => setIsPlaying(false),
        onstop: () => setIsPlaying(false),
        onend: () => setIsPlaying(false),
      });
      setSound(newSound);
    };

    initSound();

    return () => {
      if (sound) {
        sound.unload();
      }
    };
  }, []);

  // 播放控制
  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black relative">
        <ParticlesBackground />
        <MusicProvider>
          <AnalyticsProvider>
            <Header 
              isPlaying={isPlaying} 
              togglePlay={togglePlay} 
              currentTrack={currentTrack}
            />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player" element={<Player />} />
                <Route path="/lyrics" element={<Lyrics />} />
                <Route path="/fans" element={<Fans />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
            <Footer />
          </AnalyticsProvider>
        </MusicProvider>
      </div>
    </Router>
  );
}

export default App;

```
### src/context/MusicContext.js
```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Howl } from 'howler';

const MusicContext = createContext();

export const useMusic = () => useContext(MusicContext);

export const MusicProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: "夜空中最亮的星",
      artist: "董小姐",
      album: "M-98 Collection",
      duration: "4:32",
      cover: "/assets/images/album1.jpg",
      src: "/assets/music/track1.mp3"
    },
    {
      id: 2,
      title: "追梦赤子心",
      artist: "董小姐",
      album: "M-98 Collection",
      duration: "3:45",
      cover: "/assets/images/album2.jpg",
      src: "/assets/music/track2.mp3"
    },
    {
      id: 3,
      title: "光年之外",
      artist: "董小姐",
      album: "M-98 Collection",
      duration: "5:12",
      cover: "/assets/images/album3.jpg",
      src: "/assets/music/track3.mp3"
    }
  ]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [sound, setSound] = useState(null);
  const [progress, setProgress] = useState(0);

  // 初始化音频
  useEffect(() => {
    if (playlist.length > 0) {
      loadTrack(0);
    }
  }, [playlist]);

  // 加载音轨
  const loadTrack = (index) => {
    if (sound) {
      sound.unload();
    }

    const track = playlist[index];
    const newSound = new Howl({
      src: [track.src],
      html5: true,
      volume: volume,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        playNext();
      },
    });

    setSound(newSound);
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
    setProgress(0);
  };

  // 播放/暂停
  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };

  // 播放下一首
  const playNext = () => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
    if (sound) {
      sound.play();
    }
  };

  // 播放上一首
  const playPrevious = () => {
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(prevIndex);
    if (sound) {
      sound.play();
    }
  };

  // 设置音量
  const setVolumeLevel = (level) => {
    setVolume(level);
    if (sound) {
      sound.volume(level);
    }
  };

  // 更新进度
  useEffect(() => {
    let interval;
    
    if (isPlaying && sound) {
      interval = setInterval(() => {
        const seek = sound.seek();
        const duration = sound.duration();
        if (duration > 0) {
          setProgress((seek / duration) * 100);
        }
      }, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, sound]);

  // 跳转到指定位置
  const seekTo = (percentage) => {
    if (sound) {
      const duration = sound.duration();
      sound.seek(duration * (percentage / 100));
      setProgress(percentage);
    }
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    playlist,
    currentTrackIndex,
    progress,
    togglePlay,
    playNext,
    playPrevious,
    setVolumeLevel,
    seekTo,
    loadTrack
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

```
### src/context/AnalyticsContext.js
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';

const AnalyticsContext = createContext();

export const useAnalytics = () => useContext(AnalyticsContext);

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState({
    listeners: {
      daily: [120, 190, 300, 500, 200, 300, 450],
      weekly: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
      monthly: [12000, 19000, 30000, 50000, 20000, 30000, 45000]
    },
    plays: {
      daily: [320, 290, 400, 600, 500, 700, 850],
      weekly: [3200, 2900, 4000, 6000, 5000, 7000, 8500],
      monthly: [32000, 29000, 40000, 60000, 50000, 70000, 85000]
    },
    fans: {
      growth: [1200, 1350, 1500, 1800, 2100, 2500, 3000],
      demographics: {
        age: {
          "18-24": 25,
          "25-34": 40,
          "35-44": 20,
          "45-54": 10,
          "55+": 5
        },
        gender: {
          "Male": 45,
          "Female": 55
        },
        location: {
          "北京": 20,
          "上海": 18,
          "广州": 15,
          "深圳": 12,
          "成都": 10,
          "其他": 25
        }
      }
    },
    revenue: {
      daily: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
      monthly: [36000, 57000, 90000, 150000, 60000, 90000, 135000]
    }
  });

  const [fanMessages, setFanMessages] = useState([
    {
      id: 1,
      name: "音乐爱好者",
      avatar: "/assets/images/fan1.jpg",
      message: "董小姐的音乐总是能触动我的心灵，每首歌都有故事！",
      time: "2小时前",
      likes: 42
    },
    {
      id: 2,
      name: "夜空下的梦",
      avatar: "/assets/images/fan2.jpg",
      message: "昨晚的演唱会太震撼了！期待下次见面！",
      time: "5小时前",
      likes: 38
    },
    {
      id: 3,
      name: "追光者",
      avatar: "/assets/images/fan3.jpg",
      message: "新歌《光年之外》已经单曲循环一周了，太好听了！",
      time: "1天前",
      likes: 56
    },
    {
      id: 4,
      name: "音乐旅行者",
      avatar: "/assets/images/fan4.jpg",
      message: "董小姐的歌声陪伴我度过了很多艰难时刻，感谢你！",
      time: "2天前",
      likes: 73
    }
  ]);

  const addFanMessage = (message) => {
    const newMessage = {
      id: fanMessages.length + 1,
      name: "我",
      avatar: "/assets/images/default-avatar.jpg",
      message: message,
      time: "刚刚",
      likes: 0
    };
    setFanMessages([newMessage, ...fanMessages]);
  };

  const value = {
    analyticsData,
    fanMessages,
    addFanMessage
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

```
### src/components/Layout/Header.js
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiHome, FiMusic, FiEdit, FiUsers, FiBarChart2, FiPlay, FiPause } from 'react-icons/fi';
import { useMusic } from '../../context/MusicContext';

const Header = ({ isPlaying, togglePlay, currentTrack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: '首页', icon: <FiHome /> },
    { path: '/player', label: '音乐播放器', icon: <FiMusic /> },
    { path: '/lyrics', label: 'AI歌词创作', icon: <FiEdit /> },
    { path: '/fans', label: '粉丝互动', icon: <FiUsers /> },
    { path: '/analytics', label: '数据分析', icon: <FiBarChart2 /> },
  ];

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass py-2' : 'py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <FiMusic className="text-white text-xl" />
          </motion.div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              M-98 MUSIC
            </span>
            <p className="text-xs text-gray-400">董小姐个人音乐中心</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                location.pathname === item.path
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Mini Player */}
        {currentTrack && (
          <div className="hidden md:flex items-center space-x-3 glass px-4 py-2 rounded-lg">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center"
            >
              {isPlaying ? <FiPause className="text-white text-sm" /> : <FiPlay className="text-white text-sm" />}
            </button>
            <div className="text-sm">
              <div className="text-white font-medium truncate max-w-[120px]">{currentTrack.title}</div>
              <div className="text-gray-400 text-xs">{currentTrack.artist}</div>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.nav 
          className="md:hidden glass mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Mini Player */}
            {currentTrack && (
              <div className="flex items-center space-x-3 glass px-4 py-3 rounded-lg mt-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center"
                >
                  {isPlaying ? <FiPause className="text-white text-sm" /> : <FiPlay className="text-white text-sm" />}
                </button>
                <div className="text-sm">
                  <div className="text-white font-medium">{currentTrack.title}</div>
                  <div className="text-gray-400 text-xs">{currentTrack.artist}</div>
                </div>
              </div>
            )}
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
};

export default Header;

```
### src/components/Layout/Footer.js
```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiInstagram, FiWeibo, FiMusic } from 'react-icons/fi';

const Footer = () => {
  return (
    <motion.footer 
      className="glass mt-12 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
              M-98 MUSIC
            </h2>
            <p className="text-gray-400 mt-2">
              董小姐个人音乐中心 - 融合东方美学与现代科技的音乐体验
            </p>
          </div>
          
          <div className="flex space-x-4">
            <motion.a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"
              whileHover={{ y: -5 }}
            >
              <FiMusic />
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors"
              whileHover={{ y: -5 }}
            >
              <FiTwitter />
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-500 transition-colors"
              whileHover={{ y: -5 }}
            >
              <FiInstagram />
            </motion.a>
            <motion.a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 transition-colors"
              whileHover={{ y: -5 }}
            >
              <FiWeibo />
            </motion.a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} M-98 MUSIC. All rights reserved.</p>
          <p className="mt-1">Designed with ❤️ for 董小姐</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

```
### src/components/Common/ParticlesBackground.js
```javascript
import React, { useEffect, useRef } from 'react';

const ParticlesBackground = () => {
  const canvasRef = useRef();
  const particlesRef = useRef([]);
  const animationFrameRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`; // 蓝紫色调
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 创建粒子
    const createParticles = () => {
      const particlesCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      for (let i = 0; i < particlesCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };
    
    createParticles();
    
    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // 绘制连线
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-bg"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
    />
  );
};

export default ParticlesBackground;

```
### src/pages/Home.js
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlay, FiMusic, FiEdit, FiUsers, FiBarChart2, FiArrowRight, FiHeart } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';
import { useAnalytics } from '../context/AnalyticsContext';

const Home = () => {
  const { currentTrack, isPlaying, togglePlay } = useMusic();
  const { analyticsData } = useAnalytics();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const canvasRef = useRef();

  // 自动切换粉丝留言
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 音频可视化
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const bars = 50;
    const barWidth = canvas.width / bars;
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        const barHeight = isPlaying 
          ? Math.random() * canvas.height * 0.7 + canvas.height * 0.1
          : canvas.height * 0.1;
        
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, '#6366F1');
        gradient.addColorStop(1, '#EC4899');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
      }
      
      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };
    
    draw();
  }, [isPlaying]);

  const features = [
    {
      icon: <FiMusic className="text-3xl" />,
      title: '专属音乐播放器',
      description: '高品质音乐播放体验，个性化推荐',
      color: 'from-indigo-500 to-purple-500',
      link: '/player'
    },
    {
      icon: <FiEdit className="text-3xl" />,
      title: 'AI歌词创作助手',
      description: '东方哲学与现代电子元素融合',
      color: 'from-purple-500 to-pink-500',
      link: '/lyrics'
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: '粉丝互动系统',
      description: '实时留言墙，粉丝统计分析',
      color: 'from-pink-500 to-rose-500',
      link: '/fans'
    },
    {
      icon: <FiBarChart2 className="text-3xl" />,
      title: '专业数据面板',
      description: '听众分析，播放趋势，收入报告',
      color: 'from-rose-500 to-orange-500',
      link: '/analytics'
    }
  ];

  const testimonials = [
    {
      name: "音乐评论家",
      role: "《音乐周刊》",
      content: "董小姐的音乐融合了东方哲学与现代电子元素，创造出独特的音乐风格，M-98 MUSIC平台完美展现了她的艺术魅力。"
    },
    {
      name: "忠实粉丝",
      role: "10年追随者",
      content: "通过M-98 MUSIC平台，我能第一时间听到董小姐的新歌，还能和其他粉丝交流，感觉就像一个大家庭。"
    },
    {
      name: "音乐制作人",
      role: "合作艺术家",
      content: "与董小姐在M-98 MUSIC平台上的合作非常愉快，平台的AI歌词创作工具为我们的创作带来了很多灵感。"
    }
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
            M-98 MUSIC
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            董小姐个人音乐中心 - 融合东方美学与现代科技的音乐体验平台
          </p>
          
          {/* Audio Visualizer */}
          <div className="max-w-2xl mx-auto mb-10 h-32 rounded-xl overflow-hidden glass">
            <canvas 
              ref={canvasRef} 
              className="w-full h-full"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {currentTrack && (
              <button
                onClick={togglePlay}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center"
              >
                {isPlaying ? (
                  <>
                    暂停播放 <FiMusic className="ml-2" />
                  </>
                ) : (
                  <>
                    播放音乐 <FiPlay className="ml-2" />
                  </>
                )}
              </button>
            )}
            <Link
              to="/player"
              className="px-6 py-3 rounded-lg glass text-white font-medium hover:bg-gray-800 transition-colors flex items-center"
            >
              探索音乐 <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">核心特色功能</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-xl p-6 hover:shadow-lg transition-all duration-300 tech-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 mb-4">{feature.description}</p>
              <Link
                to={feature.link}
                className="text-indigo-400 hover:text-indigo-300 flex items-center"
              >
                了解更多 <FiArrowRight className="ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">数据概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl font-bold text-indigo-400 mb-2">
              {analyticsData.listeners.daily[6].toLocaleString()}
            </div>
            <div className="text-gray-400">日活跃听众</div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {analyticsData.plays.daily[6].toLocaleString()}
            </div>
            <div className="text-gray-400">日播放次数</div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {analyticsData.fans.growth[6].toLocaleString()}
            </div>
            <div className="text-gray-400">粉丝总数</div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-3xl font-bold text-rose-400 mb-2">
              {analyticsData.revenue.daily[6].toLocaleString()}
            </div>
            <div className="text-gray-400">日收入 (¥)</div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">用户评价</h2>
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass rounded-xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={activeTestimonial}
          >
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                {testimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{testimonials[activeTestimonial].name}</h3>
                <p className="text-gray-400">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>
            <p className="text-gray-300 text-lg italic mb-6">
              "{testimonials[activeTestimonial].content}"
            </p>
            <div className="flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === activeTestimonial ? 'bg-indigo-500' : 'bg-gray-700'
                  }`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          className="glass rounded-xl p-12 text-center circuit-board"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">加入董小姐的音乐世界</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            体验融合东方美学与现代科技的音乐之旅，探索无限可能
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/player"
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              开始体验 <FiPlay className="ml-2" />
            </Link>
            <Link
              to="/fans"
              className="px-8 py-3 rounded-lg glass text-white font-medium hover:bg-gray-800 transition-colors flex items-center"
            >
              加入粉丝社区 <FiUsers className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

```
### src/pages/Player.js
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiHeart, FiMoreHorizontal, FiList } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';

const Player = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playlist, 
    currentTrackIndex, 
    progress, 
    togglePlay, 
    playNext, 
    playPrevious, 
    setVolumeLevel,
    seekTo 
  } = useMusic();
  
  const [volume, setVolume] = useState(0.7);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const progressBarRef = useRef();
  
  // 更新音量
  useEffect(() => {
    setVolumeLevel(volume);
  }, [volume, setVolumeLevel]);
  
  // 格式化时间
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // 处理进度条点击
  const handleProgressClick = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = (offsetX / width) * 100;
    seekTo(percentage);
  };
  
  // 获取当前时间
  const getCurrentTime = () => {
    if (!currentTrack) return '0:00';
    const duration = parseDuration(currentTrack.duration);
    const currentTime = (progress / 100) * duration;
    return formatTime(currentTime);
  };
  
  // 解析持续时间
  const parseDuration = (durationStr) => {
    const [mins, secs] = durationStr.split(':').map(Number);
    return mins * 60 + secs;
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">音乐播放器</h1>
        <p className="text-gray-400 mb-8">高品质音乐播放体验</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主播放器 */}
          <div className="lg:col-span-2">
            <motion.div
              className="glass rounded-xl p-8 circuit-board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentTrack ? (
                <>
                  {/* 专辑封面 */}
                  <div className="flex justify-center mb-8">
                    <motion.div
                      className="w-64 h-64 rounded-xl overflow-hidden shadow-2xl relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 z-10"></div>
                      <img 
                        src={currentTrack.cover} 
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                      {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="audio-wave">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <span key={i}></span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* 歌曲信息 */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">{currentTrack.title}</h2>
                    <p className="text-gray-400">{currentTrack.artist}</p>
                    <p className="text-gray-500 text-sm">{currentTrack.album}</p>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="mb-6">
                    <div 
                      ref={progressBarRef}
                      className="music-progress cursor-pointer h-2 rounded-full"
                      onClick={handleProgressClick}
                    >
                      <div 
                        className="music-progress-bar rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-1">
                      <span>{getCurrentTime()}</span>
                      <span>{currentTrack.duration}</span>
                    </div>
                  </div>
                  
                  {/* 控制按钮 */}
                  <div className="flex justify-center items-center space-x-8 mb-8">
                    <button 
                      onClick={playPrevious}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <FiSkipBack className="text-xl" />
                    </button>
                    
                    <button 
                      onClick={togglePlay}
                      className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      {isPlaying ? (
                        <FiPause className="text-2xl" />
                      ) : (
                        <FiPlay className="text-2xl ml-1" />
                      )}
                    </button>
                    
                    <button 
                      onClick={playNext}
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <FiSkipForward className="text-xl" />
                    </button>
                  </div>
                  
                  {/* 其他控制 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <FiHeart className="text-xl" />
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <FiMoreHorizontal className="text-xl" />
                      </button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <FiVolume2 className="text-gray-400" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-24 accent-indigo-500"
                      />
                    </div>
                    
                    <button 
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <FiList className="text-xl" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-400">没有正在播放的音乐</p>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* 播放列表 */}
          <div>
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiList className="mr-2" /> 播放列表
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {playlist.map((track, index) => (
                  <motion.div
                    key={track.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentTrackIndex === index 
                        ? 'bg-indigo-900 bg-opacity-30 border-l-4 border-indigo-500' 
                        : 'hover:bg-gray-800'
                    }`}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      if (currentTrackIndex !== index) {
                        // 这里应该调用loadTrack，但为了简化，我们只更新索引
                        // 实际应用中应该调用context中的loadTrack方法
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <img 
                        src={track.cover} 
                        alt={track.title}
                        className="w-12 h-12 rounded-lg mr-3"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{track.title}</h3>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {track.duration}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* 播放历史 */}
            <motion.div
              className="glass rounded-xl p-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4">播放历史</h2>
              <div className="space-y-3">
                {playlist.slice(0, 3).map((track) => (
                  <div key={`history-${track.id}`} className="p-3 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex items-center">
                      <img 
                        src={track.cover} 
                        alt={track.title}
                        className="w-10 h-10 rounded-lg mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-sm">{track.title}</h3>
                        <p className="text-xs text-gray-400">{track.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;

```
### src/pages/Lyrics.js
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiSave, FiRefreshCw, FiCopy, FiDownload } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';

const Lyrics = () => {
  const { currentTrack } = useMusic();
  const [lyrics, setLyrics] = useState('');
  const [theme, setTheme] = useState('东方哲学');
  const [style, setStyle] = useState('现代电子');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  
  
// 示例歌词模板
const lyricsTemplates = {
  '东方哲学': {
    '现代电子': `在数字的海洋中寻找自我
虚拟与现实交织的边界
古老的智慧在代码中重生
电子脉冲传递着千年思绪

霓虹灯光下的冥想
数据流中的禅意
东方的灵魂在西方的节拍中舞动
寻找内心的平静与和谐

在0和1的世界里
我们依然能感受到风的温度
在算法的迷宫中
我们依然能找到爱的方向`,
      '传统民谣': `青山绿水间，云雾缭绕
古琴声声，诉说着千年故事
东方的智慧，如流水般清澈
在时光的长河中永不消逝

竹影摇曳，月光如水
古老的诗句在心中回荡
传统的韵律，现代的表达
文化的传承，在创新中延续

东方的哲学，如星辰般璀璨
照亮我们前行的道路
在快节奏的生活中
寻找内心的宁静与和谐`
},
'都市情感': {
  '现代电子': `城市的霓虹灯下
我们相遇在虚拟与现实之间
电子音乐中跳动的心
数据流中传递的情感

高楼大厦间的孤独
在数字世界中寻找连接
现代生活的快节奏
让我们渴望真实的温暖

在算法的推荐中
我们找到了彼此
在社交网络的海洋中
我们学会了爱与被爱`,
  '抒情流行': `城市的夜晚，灯火辉煌
忙碌的人群，匆匆而过
在这繁华的都市中
我寻找着属于我的角落

回忆如潮水般涌来
那些美好的时光
如今只能在梦中重现
留下无尽的思念

都市的情感，复杂而真实
爱与恨，喜与悲
在这钢筋水泥的森林中
我们依然相信爱的力量`
    }
  };
  
  // 生成歌词
  const generateLyrics = () => {
    setIsGenerating(true);
    
    // 模拟AI生成歌词的过程
    setTimeout(() => {
      const template = lyricsTemplates[theme]?.[style] || '';
      setGeneratedLyrics(template);
      setIsGenerating(false);
    }, 2000);
  };
  
  // 复制歌词
  const copyLyrics = () => {
    navigator.clipboard.writeText(generatedLyrics);
    alert('歌词已复制到剪贴板');
  };
  
  // 下载歌词
  const downloadLyrics = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLyrics], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${theme}_${style}_歌词.txt`;
    element.click();
  };
  
  // 保存歌词
  const saveLyrics = () => {
    // 在实际应用中，这里会调用API保存歌词
    alert('歌词已保存');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">AI歌词创作助手</h1>
        <p className="text-gray-400 mb-8">融合东方哲学与现代电子元素的智能歌词创作</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 创作控制面板 */}
          <div className="lg:col-span-1">
            <motion.div
              className="glass rounded-xl p-6 circuit-board"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiEdit2 className="mr-2" /> 创作设置
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">主题</label>
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="东方哲学">东方哲学</option>
                    <option value="都市情感">都市情感</option>
                    <option value="自然风光">自然风光</option>
                    <option value="未来科技">未来科技</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">风格</label>
                  <select 
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="现代电子">现代电子</option>
                    <option value="传统民谣">传统民谣</option>
                    <option value="抒情流行">抒情流行</option>
                    <option value="摇滚说唱">摇滚说唱</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">关键词 (可选)</label>
                  <input 
                    type="text" 
                    placeholder="输入关键词，用逗号分隔"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                <button
                  onClick={generateLyrics}
                  disabled={isGenerating}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      生成中...
                    </>
                  ) : (
                    <>
                      生成歌词 <FiEdit2 className="ml-2" />
                    </>
                  )}
                </button>
              </div>
              
              {/* 当前播放歌曲 */}
              {currentTrack && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <h3 className="font-bold mb-3">当前播放</h3>
                  <div className="flex items-center">
                    <img 
                      src={currentTrack.cover} 
                      alt={currentTrack.title}
                      className="w-12 h-12 rounded-lg mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{currentTrack.title}</h4>
                      <p className="text-sm text-gray-400">{currentTrack.artist}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
          
          {/* 歌词编辑区 */}
          <div className="lg:col-span-2">
            <motion.div
              className="glass rounded-xl p-6 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">歌词编辑器</h2>
                {generatedLyrics && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyLyrics}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title="复制歌词"
                    >
                      <FiCopy />
                    </button>
                    <button
                      onClick={downloadLyrics}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title="下载歌词"
                    >
                      <FiDownload />
                    </button>
                    <button
                      onClick={saveLyrics}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      title="保存歌词"
                    >
                      <FiSave />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex-1 mb-4">
                {isGenerating ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-400">AI正在为您创作歌词...</p>
                  </div>
                ) : generatedLyrics ? (
                  <textarea
                    value={generatedLyrics}
                    onChange={(e) => setGeneratedLyrics(e.target.value)}
                    className="w-full h-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono"
                    rows={15}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <FiEdit2 className="text-4xl mb-4" />
                    <p>设置创作参数并点击"生成歌词"开始创作</p>
                  </div>
                )}
              </div>
              
              {/* 歌词预览 */}
              {generatedLyrics && (
                <div className="border-t border-gray-800 pt-4">
                  <h3 className="font-bold mb-3">预览效果</h3>
                  <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                    {generatedLyrics.split('\n').map((line, index) => (
                      <p key={index} className="mb-1 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
        
        {/* 创作历史 */}
        <motion.div
          className="glass rounded-xl p-6 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">创作历史</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: '星空下的梦', theme: '东方哲学', style: '现代电子', date: '2023-06-15' },
              { title: '城市霓虹', theme: '都市情感', style: '抒情流行', date: '2023-06-10' },
              { title: '山水之间', theme: '自然风光', style: '传统民谣', date: '2023-06-05' }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-4 rounded-lg bg-gray-800 bg-opacity-50 hover:bg-gray-800 transition-colors cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <h3 className="font-bold mb-1">{item.title}</h3>
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{item.theme} · {item.style}</span>
                  <span>{item.date}</span>
                </div>
                <div className="text-xs text-gray-500 truncate">
                  在数字的海洋中寻找自我，虚拟与现实交织的边界...
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Lyrics;

```
### src/pages/Fans.js
```javascript
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMessageSquare, FiHeart, FiSend, FiUsers, FiTrendingUp, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useAnalytics } from '../context/AnalyticsContext';

const Fans = () => {
  const { fanMessages, addFanMessage, analyticsData } = useAnalytics();
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const canvasRef = useRef();
  
  // 提交留言
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addFanMessage(newMessage);
      setNewMessage('');
    }
  };
  
  // 点赞留言
  const handleLikeMessage = (id) => {
    // 在实际应用中，这里会调用API更新点赞数
    console.log(`Liked message ${id}`);
  };
  
  // 粉丝增长图表
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.stroke();
    
    // 绘制数据
    const data = analyticsData.fans.growth;
    const maxValue = Math.max(...data);
    const xStep = graphWidth / (data.length - 1);
    
    // 绘制区域
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (value / maxValue) * graphHeight;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 绘制线条
    ctx.beginPath();
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (value / maxValue) * graphHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - (value / maxValue) * graphHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1';
      ctx.fill();
      
      // 绘制数值
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(value, x, y - 10);
    });
    
    // 绘制标签
    const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];
    labels.forEach((label, index) => {
      const x = padding + index * xStep;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '12px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - padding + 20);
    });
  }, [analyticsData]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2">粉丝互动系统</h1>
        <p className="text-gray-400 mb-8">实时留言墙，粉丝统计分析</p>
        
        {/* 粉丝数据概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-3xl font-bold text-indigo-400 mb-2">
              {analyticsData.fans.growth[6].toLocaleString()}
            </div>
            <div className="text-gray-400">粉丝总数</div>
            <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
              <FiTrendingUp className="mr-1" /> +12.5%
            </div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {fanMessages.length}
            </div>
            <div className="text-gray-400">留言数量</div>
            <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
              <FiTrendingUp className="mr-1" /> +8.3%
            </div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {Math.floor(fanMessages.reduce((sum, msg) => sum + msg.likes, 0) / fanMessages.length)}
            </div>
            <div className="text-gray-400">平均点赞</div>
            <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
              <FiTrendingUp className="mr-1" /> +5.7%
            </div>
          </motion.div>
          
          <motion.div
            className="glass rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-3xl font-bold text-rose-400 mb-2">
              78%
            </div>
            <div className="text-gray-400">活跃度</div>
            <div className="text-green-400 text-sm mt-1 flex items-center justify-center">
              <FiTrendingUp className="mr-1" /> +3.2%
            </div>
          </motion.div>
        </div>
        
        {/* 标签页 */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'messages'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            <FiMessageSquare className="inline mr-2" /> 粉丝留言
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'analytics'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            <FiUsers className="inline mr-2" /> 粉丝分析
          </button>
        </div>
        
        {/* 内容区域 */}
        {activeTab === 'messages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 留言墙 */}
            <div className="lg:col-span-2">
              <motion.div
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl font-bold mb-4">粉丝留言墙</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {fanMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      className="fan-message p-4 rounded-lg bg-gray-800 bg-opacity-50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start">
                        <img 
                          src={message.avatar} 
                          alt={message.name}
                          className="w-10 h-10 rounded-full mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold">{message.name}</h3>
                              <p className="text-xs text-gray-400 flex items-center">
                                <FiCalendar className="mr-1" /> {message.time}
                              </p>
                            </div>
                            <button
                              onClick={() => handleLikeMessage(message.id)}
                              className="flex items-center text-gray-400 hover:text-pink-500 transition-colors"
                            >
                              <FiHeart className={`mr-1 ${message.likes > 0 ? 'text-pink-500' : ''}`} />
                              {message.likes}
                            </button>
                          </div>
                          <p className="text-gray-300">{message.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* 发表留言 */}
            <div>
              <motion.div
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h2 className="text-xl font-bold mb-4">发表留言</h2>
                <form onSubmit={handleSubmitMessage}>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">您的留言</label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                      rows={4}
                      placeholder="分享您对董小姐音乐的感受..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    发表留言 <FiSend className="ml-2" />
                  </button>
                </form>
                
                {/* 粉丝等级 */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <h3 className="font-bold mb-3">粉丝等级</h3>
                  <div className="space-y-3">
                    {[
                      { level: '钻石粉丝', color: 'from-purple-500 to-pink-500', fans: '1000+' },
                      { level: '金牌粉丝', color: 'from-yellow-500 to-orange-500', fans: '500+' },
                      { level: '银牌粉丝', color: 'from-gray-300 to-gray-500', fans: '100+' },
                      { level: '普通粉丝', color: 'from-blue-400 to-indigo-500', fans: '1+' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center p-3 rounded-lg bg-gray-800 bg-opacity-50">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white text-xs font-bold mr-3`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.level}</h4>
                          <p className="text-xs text-gray-400">{item.fans} 粉丝</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 粉丝增长 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-4">粉丝增长趋势</h2>
              <div className="h-64">
                <canvas ref={canvasRef} width="400" height="256"></canvas>
              </div>
            </motion.div>
            
            {/* 粉丝分布 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4">粉丝分布</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <FiMapPin className="mr-2" /> 地区分布
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(analyticsData.fans.demographics.location).map(([location, percentage]) => (
                      <div key={location}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{location}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">年龄分布</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(analyticsData.fans.demographics.age).map(([age, percentage]) => (
                      <div key={age} className="p-2 rounded-lg bg-gray-800 bg-opacity-50 text-center">
                        <div className="font-bold">{age}</div>
                        <div className="text-sm text-gray-400">{percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">性别分布</h3>
                  <div className="flex space-x-4">
                    {Object.entries(analyticsData.fans.demographics.gender).map(([gender, percentage]) => (
                      <div key={gender} className="flex-1 p-3 rounded-lg bg-gray-800 bg-opacity-50 text-center">
                        <div className="font-bold">{gender === 'Male' ? '男性' : '女性'}</div>
                        <div className="text-sm text-gray-400">{percentage}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fans;

```
### src/pages/Analytics.js
```javascript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { FiTrendingUp, FiUsers, FiMusic, FiDollarSign, FiCalendar, FiDownload } from 'react-icons/fi';
import { useAnalytics } from '../context/AnalyticsContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  const { analyticsData } = useAnalytics();
  const [timeRange, setTimeRange] = useState('daily');
  const [activeTab, setActiveTab] = useState('overview');
  
  // 听众数据图表
  const listenersChartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '听众数量',
        data: analyticsData.listeners[timeRange],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const listenersChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '听众趋势',
        color: '#E5E7EB',
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };
  
  // 播放数据图表
  const playsChartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '播放次数',
        data: analyticsData.plays[timeRange],
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const playsChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '播放趋势',
        color: '#E5E7EB',
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };
  
  // 收入数据图表
  const revenueChartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '收入 (¥)',
        data: analyticsData.revenue[timeRange],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };
  
  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '收入趋势',
        color: '#E5E7EB',
      },
    },
    scales: {
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };
  
  // 粉丝年龄分布饼图
  const ageDistributionData = {
    labels: Object.keys(analyticsData.fans.demographics.age),
    datasets: [
      {
        data: Object.values(analyticsData.fans.demographics.age),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const ageDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#E5E7EB',
        },
      },
      title: {
        display: true,
        text: '粉丝年龄分布',
        color: '#E5E7EB',
      },
    },
  };
  
  // 导出报告
  const exportReport = () => {
    // 在实际应用中，这里会生成并下载PDF报告
    alert('报告导出功能将在实际应用中实现');
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">专业数据面板</h1>
            <p className="text-gray-400">听众分析，播放趋势，收入报告，粉丝增长统计</p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="daily">日数据</option>
              <option value="weekly">周数据</option>
              <option value="monthly">月数据</option>
            </select>
            <button
              onClick={exportReport}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              <FiDownload className="mr-2" /> 导出报告
            </button>
          </div>
        </div>
        
        {/* 标签页 */}
        <div className="flex border-b border-gray-800 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            数据概览
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'detailed'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('detailed')}
          >
            详细分析
          </button>
        </div>
        
        {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 听众趋势 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FiUsers className="mr-2" /> 听众趋势
                </h2>
                <div className="text-green-400 text-sm flex items-center">
                  <FiTrendingUp className="mr-1" /> +12.5%
                </div>
              </div>
              <div className="h-64">
                <Line data={listenersChartData} options={listenersChartOptions} />
              </div>
            </motion.div>
            
            {/* 播放趋势 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FiMusic className="mr-2" /> 播放趋势
                </h2>
                <div className="text-green-400 text-sm flex items-center">
                  <FiTrendingUp className="mr-1" /> +8.3%
                </div>
              </div>
              <div className="h-64">
                <Line data={playsChartData} options={playsChartOptions} />
              </div>
            </motion.div>
            
            {/* 收入趋势 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <FiDollarSign className="mr-2" /> 收入趋势
                </h2>
                <div className="text-green-400 text-sm flex items-center">
                  <FiTrendingUp className="mr-1" /> +15.7%
                </div>
              </div>
              <div className="h-64">
                <Line data={revenueChartData} options={revenueChartOptions} />
              </div>
            </motion.div>
            
            {/* 粉丝年龄分布 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">粉丝年龄分布</h2>
              <div className="h-64">
                <Pie data={ageDistributionData} options={ageDistributionOptions} />
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 热门歌曲 */}
            <motion.div
              className="glass rounded-xl p-6 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-bold mb-4">热门歌曲排行</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 text-gray-400">排名</th>
                      <th className="text-left py-3 text-gray-400">歌曲</th>
                      <th className="text-left py-3 text-gray-400">播放次数</th>
                      <th className="text-left py-3 text-gray-400">趋势</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, title: '夜空中最亮的星', plays: 125430, trend: 'up' },
                      { rank: 2, title: '追梦赤子心', plays: 98760, trend: 'up' },
                      { rank: 3, title: '光年之外', plays: 87540, trend: 'down' },
                      { rank: 4, title: '平凡之路', plays: 76540, trend: 'up' },
                      { rank: 5, title: '成都', plays: 65430, trend: 'same' }
                    ].map((song, index) => (
                      <tr key={index} className="border-b border-gray-800 last:border-0">
                        <td className="py-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {song.rank}
                          </div>
                        </td>
                        <td className="py-3 font-medium">{song.title}</td>
                        <td className="py-3">{song.plays.toLocaleString()}</td>
                        <td className="py-3">
                          {song.trend === 'up' ? (
                            <span className="text-green-400 flex items-center">
                              <FiTrendingUp className="mr-1" /> 上升
                            </span>
                          ) : song.trend === 'down' ? (
                            <span className="text-red-400 flex items-center">
                              <FiTrendingUp className="mr-1 transform rotate-180" /> 下降
                            </span>
                          ) : (
                            <span className="text-gray-400">持平</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            {/* 听众地区分布 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4">听众地区分布</h2>
              <div className="space-y-3">
                {Object.entries(analyticsData.fans.demographics.location).map(([location, percentage]) => (
                  <div key={location}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{location}</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 收入来源 */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4">收入来源</h2>
              <div className="space-y-4">
                {[
                  { source: '音乐流媒体', amount: 45000, percentage: 45, color: 'from-indigo-500 to-purple-500' },
                  { source: '演唱会', amount: 35000, percentage: 35, color: 'from-purple-500 to-pink-500' },
                  { source: '周边商品', amount: 15000, percentage: 15, color: 'from-pink-500 to-rose-500' },
                  { source: '其他', amount: 5000, percentage: 5, color: 'from-rose-500 to-orange-500' }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.source}</span>
                      <span>¥{item.amount.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${item.color} h-2 rounded-full`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* 活跃时间分析 */}
            <motion.div
              className="glass rounded-xl p-6 lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">活跃时间分析</h2>
              <div className="grid grid-cols-7 gap-2">
                {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, dayIndex) => (
                  <div key={dayIndex} className="text-center">
                    <div className="text-sm text-gray-400 mb-2">{day}</div>
                    <div className="space-y-1">
                      {[0, 6, 12, 18].map((hour, hourIndex) => {
                        const activity = Math.floor(Math.random() * 100);
                        const height = activity + 20;
                        return (
                          <div key={hourIndex} className="flex justify-center">
                            <div 
                              className="w-6 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t"
                              style={{ height: `${height}%` }}
                              title={`${hour}:00 - ${hour + 6}:00: ${activity}%`}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-gray-400">
                每日活跃时段分布（每6小时为一个时段）
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;

```
## 完整文档
### README.md
```plaintext
# M-98 MUSIC: 董小姐个人音乐中心

M-98 MUSIC 是一个为董小姐量身定制的个人音乐中心应用，融合东方美学与现代科技，提供全方位的音乐体验和粉丝互动功能。

## 🎵 核心特色功能

### 专属音乐播放器
- 实时播放统计
- 自动播放列表
- 音频控制界面
- 播放历史记录

### AI歌词创作助手
- 东方哲学风格
- 现代电子元素融合
- 智能词汇搭配
- 主题化创作

### 粉丝互动系统
- 实时留言墙
- 粉丝统计分析
- 社交媒体集成
- 等级系统设计

### 专业数据面板
- 听众分析
- 播放趋势
- 收入报告
- 粉丝增长统计

## 📊 项目亮点

1. **专属定制**: 完全为董小姐(M98)量身定制的品牌风格
2. **技术先进**: 现代化微服务架构，容器化部署
3. **AI融合**: 原创AI歌词生成，体现东方美学
4. **用户体验**: 现代化UI设计，丰富交互动画
5. **可扩展性**: 模块化设计，易于功能扩展

## 🛠️ 技术栈

- **前端框架**: React 18
- **样式框架**: Tailwind CSS
- **动画库**: Framer Motion, GSAP
- **3D效果**: Three.js
- **图表库**: Chart.js
- **音频处理**: Howler.js
- **状态管理**: React Context API

## 🚀 快速开始

### 环境要求
- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖
```bash
npm install

```
### 启动开发服务器
```bash
npm start

```
应用将在 http://localhost:3000 上运行。
### 构建生产版本
```bash
npm run build

```
## 📁 项目结构
```plaintext
m98-music/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── assets/
│   │   ├── music/
│   │   ├── images/
│   │   └── styles/
│   ├── components/
│   │   ├── Player/        # 音乐播放器组件
│   │   ├── Lyrics/        # AI歌词创作组件
│   │   ├── Fans/          # 粉丝互动组件
│   │   ├── Analytics/     # 数据分析组件
│   │   ├── Common/        # 通用组件
│   │   └── Layout/        # 布局组件
│   ├── pages/             # 页面组件
│   ├── hooks/             # 自定义Hook
│   ├── utils/             # 工具函数
│   ├── context/           # 状态管理
│   ├── App.js             # 主应用组件
│   ├── index.js           # 入口文件
│   └── styles/            # 样式文件
├── docs/                  # 文档
├── package.json
└── README.md

```
## 🎨 设计特色
### 视觉吸引力
- 深色主题: 采用深空灰（#0A1128）和暗蓝（#051937）背景，减少视觉疲劳
- 霓虹光效: 按钮边框使用发光效果，增强科技感
- 动态渐变: 卡片背景采用径向渐变和网格纹理
- 玻璃态效果: 半透明遮罩配合模糊背景，增强层次感
### 交互沉浸感
- 实时动效: 音频可视化、数据流动画增强操作感知
- 手势交互: 滑动操作触发轨迹光带，长按按钮触发能量聚集动画
- 智能响应: 场景化动态布局，AI驱动的交互提示
### 信息传达
- 数据可视化: 三维数据呈现，动态数据标注
- 科技感导航: 磁悬浮效果，扇形辐射菜单
- 沉浸式面板: 控制台模式，命令执行进度条
## 📱 响应式设计
应用完全响应式，适配各种设备尺寸：
- 桌面端: 完整功能展示，多列布局
- 平板端: 优化布局，保持核心功能
- 手机端: 简化界面，专注核心体验
## ♿ 无障碍设计
- 颜色对比度: 确保文本与背景对比度≥4.5:1
- 键盘导航: 完整的键盘操作支持
- 屏幕阅读器: 语义化HTML和ARIA属性
- 减少动画: 支持prefers-reduced-motion媒体查询
## 🔧 自定义主题
通过修改CSS变量，可以轻松定制应用主题：
```css
:root {
  /* M-98 MUSIC 主题色彩 */
  --m98-primary: #6366F1;     /* 主色调 - 靛蓝色 */
  --m98-secondary: #8B5CF6;   /* 次要色 - 紫色 */
  --m98-accent: #EC4899;      /* 强调色 - 粉色 */
  --m98-dark: #0F172A;         /* 深色背景 */
  --m98-darker: #0A1128;       /* 更深色背景 */
  --m98-light: #E5E7EB;        /* 浅色文本 */
}

```
## 📈 性能优化
- 代码分割: 使用React.lazy和Suspense实现组件懒加载
- 图片优化: 响应式图片，WebP格式支持
- 动画优化: 使用transform和opacity属性，避免重排
- 缓存策略: 静态资源缓存，API数据缓存
## 🚀 部署
### Netlify部署
1. 将代码推送到GitHub仓库
2. 在Netlify中连接GitHub仓库
3. 设置构建设置：
    - Build command: npm run build
    - Publish directory: build
4. 部署
### Vercel部署
1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. Vercel会自动检测React项目并设置构建设置
4. 部署
## 🤝 贡献
欢迎贡献代码、报告问题或提出新功能建议！请查看 贡献指南 了解更多信息。
## 📄 许可证
MIT License
## 🙏 致谢
特别感谢董小姐(M98)的灵感与支持，让这个音乐中心成为可能。
```plaintext

### docs/COMPONENT_GUIDE.md

```markdown
# M-98 MUSIC 组件开发指南

本文档提供了M-98 MUSIC应用的详细组件开发指南，包括设计原则、技术实现和最佳实践。

## 设计原则

### 1. 科技感认知锚点

#### 视觉吸引力
- **深色主题主导**: 背景采用深空灰（#0A1128）或暗蓝（#051937），减少视觉疲劳，突出数据内容
- **霓虹光效应用**: 按钮边框使用box-shadow: 0 0 15px #4F46E5，悬停时增强光晕半径
- **动态渐变与材质**: 卡片背景采用「径向渐变 + 网格纹理」，玻璃态（Glassmorphism）效果

#### 3D空间与几何元素
- **层级深度构建**: 卡片默认阴影box-shadow: 0 4px 20px rgba(0,0,0,0.15)，悬停时增加Z轴偏移
- **科技感装饰元素**: 角落添加纳米管风格边框，背景点缀动态粒子

### 2. 交互沉浸感

#### 实时动效增强操作感知
- **数据加载状态优化**: 骨架屏采用「电路板线路」动画，长列表加载时条目从底部「融入」界面
- **手势交互反馈**: 滑动操作触发「轨迹光带」，长按按钮触发「能量聚集」动画

#### 智能交互逻辑
- **场景化动态布局**: 数据密集型页面检测到滚动时，侧边栏自动收缩为图标模式
- **AI驱动的交互提示**: 新用户首次操作时，界面元素边缘显示「霓虹引导线」

### 3. 信息传达效率

#### 数据可视化升级
- **三维数据呈现**: 使用Three.js构建可旋转的3D柱状图，网络拓扑图采用「节点连接线发光」效果
- **动态数据标注**: 折线图异常点自动添加「警告脉冲」动画，数据表格支持「全息投影」模式

#### 操作流程优化
- **科技感导航系统**: 顶部导航栏采用「磁悬浮」效果，二级菜单展开时选项以「扇形辐射」方式弹出
- **沉浸式操作面板**: 专业工具采用「控制台模式」，输入框底部显示「命令执行进度条」

## 组件开发流程

### 1. 需求分析

在开发新组件前，明确以下问题：
- 组件的用途和场景
- 需要支持的设计风格
- 必要的props和事件
- 响应式需求
- 无障碍性要求

### 2. 设计原型

使用Figma或Sketch设计组件原型，考虑：
- 不同状态（默认、悬停、激活、禁用）
- 不同尺寸（小、中、大）
- 不同主题（亮色、暗色）
- 动画效果和过渡

### 3. 代码实现

#### 组件结构

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2, children }) => {
  const [state, setState] = useState(initialValue);
  const ref = useRef();
  
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);
  
  const handleEvent = () => {
    // 事件处理逻辑
  };
  
  return (
    <motion.div
      ref={ref}
      className="component-name"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={handleEvent}
    >
      {children}
    </motion.div>
  );
};

export default ComponentName;

```
#### 样式实现
```css
.component-name {
  /* 基础样式 */
  background-color: var(--m98-dark);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    padding: var(--space-md);
  }
  
  /* 深色模式 */
  @media (prefers-color-scheme: dark) {
    background-color: var(--m98-darker);
  }
}

/* 网格背景 */
.component-name::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

/* 霓虹发光效果 */
.component-name:hover {
  box-shadow: 0 0 15px var(--m98-primary);
}

```
### 4. 测试验证
确保组件：
- 在不同浏览器中正常显示
- 响应式布局正确
- 交互功能正常
- 动画流畅
- 无障碍性良好
### 5. 文档编写
为组件编写详细文档，包括：
- 组件描述
- Props表格
- 使用示例
- 注意事项
## 核心组件详解
### 1. MusicPlayer（音乐播放器）
#### 功能特点
- 播放/暂停控制
- 上一首/下一首切换
- 进度条拖动
- 音量控制
- 播放列表管理
- 音频可视化
#### 技术实现
- 使用Howler.js处理音频播放
- 使用Framer Motion实现动画效果
- 使用Canvas API实现音频可视化
- 使用React Context管理播放状态
#### 代码示例
```jsx
import { Howl } from 'howler';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  
  useEffect(() => {
    const newSound = new Howl({
      src: ['/assets/music/sample.mp3'],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });
    setSound(newSound);
    
    return () => {
      newSound.unload();
    };
  }, []);
  
  const togglePlay = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
    }
  };
  
  return (
    <div className="music-player">
      {/* 播放器UI */}
    </div>
  );
};

```
### 2. LyricsGenerator（AI歌词创作助手）
#### 功能特点
- 主题选择（东方哲学、都市情感等）
- 风格选择（现代电子、传统民谣等）
- 关键词输入
- AI生成歌词
- 歌词编辑
- 保存/下载歌词
#### 技术实现
- 使用模拟AI生成（实际应用中可接入真实AI API）
- 使用文本区域实现歌词编辑
- 使用文件下载API实现歌词下载
#### 代码示例
```jsx
const LyricsGenerator = () => {
  const [theme, setTheme] = useState('东方哲学');
  const [style, setStyle] = useState('现代电子');
  const [lyrics, setLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateLyrics = () => {
    setIsGenerating(true);
    
    // 模拟AI生成过程
    setTimeout(() => {
      const generatedLyrics = generateLyricsByAI(theme, style);
      setLyrics(generatedLyrics);
      setIsGenerating(false);
    }, 2000);
  };
  
  return (
    <div className="lyrics-generator">
      {/* 歌词生成器UI */}
    </div>
  );
};

```
### 3. FanInteraction（粉丝互动系统）
#### 功能特点
- 粉丝留言墙
- 留言点赞
- 粉丝数据分析
- 粉丝等级系统
- 实时统计
#### 技术实现
- 使用Chart.js实现数据可视化
- 使用Canvas API绘制自定义图表
- 使用React Context管理粉丝数据
#### 代码示例
```jsx
const FanInteraction = () => {
  const { fanMessages, addFanMessage } = useAnalytics();
  const [newMessage, setNewMessage] = useState('');
  
  const handleSubmitMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addFanMessage(newMessage);
      setNewMessage('');
    }
  };
  
  return (
    <div className="fan-interaction">
      {/* 粉丝互动UI */}
    </div>
  );
};

```
### 4. DataAnalytics（专业数据面板）
#### 功能特点
- 听众分析
- 播放趋势
- 收入报告
- 粉丝增长统计
- 数据导出
#### 技术实现
- 使用Chart.js实现各种图表
- 使用react-chartjs-2封装Chart.js
- 使用文件下载API实现报告导出
#### 代码示例
```jsx
const DataAnalytics = () => {
  const { analyticsData } = useAnalytics();
  const [timeRange, setTimeRange] = useState('daily');
  
  const chartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '听众数量',
        data: analyticsData.listeners[timeRange],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };
  
  return (
    <div className="data-analytics">
      <Line data={chartData} />
    </div>
  );
};

```
## 最佳实践
### 1. 性能优化
- 使用React.memo避免不必要的重渲染
- 使用useCallback和useMemo优化函数和计算
- 懒加载非关键组件
- 优化动画性能（使用transform和opacity）
- 使用代码分割减少初始加载时间
### 2. 无障碍设计
- 使用语义化HTML标签
- 提供键盘导航支持
- 添加ARIA属性
- 确保颜色对比度符合WCAG标准
- 支持屏幕阅读器
### 3. 代码规范
- 遵循ESLint规则
- 使用Prettier格式化代码
- 编写清晰的注释
- 保持组件单一职责
- 使用TypeScript增强类型安全
### 4. 主题定制
- 使用CSS变量定义主题色彩
- 提供主题切换功能
- 支持自定义主题
- 确保主题一致性
## 常见问题
### Q: 如何实现组件的响应式设计？
A: 使用Tailwind CSS的响应式类名或CSS媒体查询：
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 内容 */}
</div>

```
### Q: 如何优化动画性能？
A: 使用transform和opacity属性，避免触发重排：
```css
.element {
  will-change: transform, opacity;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

```
### Q: 如何实现深色模式？
A: 使用CSS变量和媒体查询：
```css
:root {
  --bg-color: #ffffff;
  --text-color: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #0F172A;
    --text-color: #ffffff;
  }
}

.element {
  background-color: var(--bg-color);
  color: var(--text-color);
}

```
### Q: 如何实现数据可视化？
A: 使用Chart.js和react-chartjs-2：
```jsx
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MyChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'My Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
    ],
  };

  return <Line data={data} />;
};

```
## 资源链接
- React文档
- Tailwind CSS文档
- Framer Motion文档
- Chart.js文档
- Howler.js文档
- Web无障碍性指南
```plaintext

## 部署说明

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 构建步骤

1. 安装依赖
```bash
npm install

```
1. 构建生产版本
```bash
npm run build

```
1. 部署到静态服务器
    构建完成后，build目录包含所有静态文件，可以部署到任何静态服务器。
### 部署到Netlify
1. 将代码推送到GitHub仓库
2. 在Netlify中连接GitHub仓库
3. 设置构建设置：
    - Build command: npm run build
    - Publish directory: build
4. 部署
### 部署到Vercel
1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. Vercel会自动检测React项目并设置构建设置
4. 部署
### 自定义域名
无论使用哪种部署方式，都可以通过以下步骤设置自定义域名：
1. 在域名提供商处添加DNS记录
2. 在部署平台（Netlify/Vercel）中添加自定义域名
3. 等待DNS解析完成
## 总结
M-98 MUSIC是一个融合科技感设计与音乐体验的现代化Web应用，专为董小姐打造。应用采用了深色主题、霓虹光效、动态渐变和玻璃态效果，营造出强烈的科技感。同时，通过实时动效、手势交互和智能反馈，提供了沉浸式的用户体验。
应用包含四大核心功能：专属音乐播放器、AI歌词创作助手、粉丝互动系统和专业数据面板，全面满足音乐人和粉丝的需求。通过模块化的组件设计和响应式布局，应用在各种设备上都能提供优秀的体验。
开发者可以基于这个应用创建自己的音乐平台，或者直接使用其中的组件来构建具有科技感的Web应用。