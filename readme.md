# CryptoTrack - 实时加密货币价格监测

一个现代化的实时加密货币价格监测网站，支持BTC、ETH、SOL和pump.fun上的热门meme币（如Fartcoin）的价格追踪。

## 功能特性

- 🚀 **实时价格监测** - 监测BTC、ETH、SOL和热门meme币的实时价格
- 🌙 **深色/浅色模式** - 支持主题切换，深色模式背景为纯黑色
- 📱 **响应式设计** - 适配各种设备屏幕尺寸
- 🔄 **自动刷新** - 每5分钟自动更新价格数据
- 🎯 **手动刷新** - 点击刷新按钮立即更新数据
- 💎 **现代UI** - 圆角矩形卡片设计，简约美观
- 📊 **价格变化** - 显示24小时价格变化百分比
- ⚡ **快速加载** - 基于Next.js构建，性能优化

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React
- **API**: CoinGecko API
- **部署**: Vercel

## 监测的加密货币

1. **Bitcoin (BTC)** - 比特币
2. **Ethereum (ETH)** - 以太坊
3. **Solana (SOL)** - 索拉纳
4. **Fartcoin (FARTCOIN)** - pump.fun上的热门meme币

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 自动部署完成

## API配置

项目使用CoinGecko API获取价格数据，API密钥已配置在代码中。如需更换API密钥，请修改 `src/lib/api.ts` 文件中的 `API_KEY` 常量。

## 项目结构

```
cryptoTrack/
├── app/                    # Next.js App Router页面
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── src/
│   ├── components/        # React组件
│   │   ├── CryptoCard.tsx # 加密货币卡片组件
│   │   ├── ThemeToggle.tsx # 主题切换组件
│   │   └── RefreshButton.tsx # 刷新按钮组件
│   ├── lib/               # 工具函数
│   │   ├── api.ts         # API调用逻辑
│   │   └── theme-context.tsx # 主题上下文
│   └── types/             # TypeScript类型定义
│       └── crypto.ts      # 加密货币相关类型
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 开发者

由Augment和Claude协作开发完成。

