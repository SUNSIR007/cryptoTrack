# CryptoTrack - 实时加密货币价格监测

一个现代化的实时加密货币价格监测网站，支持多链代币价格追踪，包括 Bitcoin、Ethereum、Solana、BSC 链代币和 pump.fun 上的热门 meme 币。

## 功能特性

- 🚀 **多链代币支持** - 支持 Ethereum、BSC、Solana 链上的代币价格监测
- 🔍 **智能地址识别** - 自动识别不同链的代币地址格式
- 🌐 **多数据源整合** - 整合 CoinGecko、GeckoTerminal、DexScreener 等多个数据源
- 📊 **实时价格监测** - 监测主流币种和热门 meme 币的实时价格
- 🎯 **代币搜索** - 支持按名称、符号或地址搜索多链代币
- 🛡️ **智能限制** - 代币数量限制和性能优化提醒
- 🏷️ **网络标签** - 清晰显示代币所属区块链网络
- 🌙 **深色/浅色模式** - 支持主题切换，深色模式背景为纯黑色
- 📱 **响应式设计** - 适配各种设备屏幕尺寸
- 🔄 **自动刷新** - 每5分钟自动更新价格数据
- 💎 **现代UI** - 圆角矩形卡片设计，简约美观
- ⚡ **快速加载** - 基于Next.js构建，性能优化

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React
- **API**: CoinGecko API, GeckoTerminal API, DexScreener API
- **部署**: Vercel

## 支持的区块链网络

### 主要支持
1. **Ethereum** - 以太坊主网代币
2. **BSC (Binance Smart Chain)** - 币安智能链代币
3. **Solana** - Solana 生态代币和 pump.fun meme 币

### 默认监测代币
1. **Bitcoin (BTC)** - 比特币
2. **Ethereum (ETH)** - 以太坊
3. **BNB** - 币安币
4. **Solana (SOL)** - 索拉纳

### 代币添加方式
- 🔍 **搜索添加**: 按名称或符号搜索
- 📋 **地址添加**: 直接输入代币合约地址
- 🎯 **智能识别**: 自动识别地址所属网络

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API 密钥

**重要**：项目需要 CoinGecko API 密钥才能正常运行。

1. 获取免费 API 密钥：访问 [CoinGecko API](https://www.coingecko.com/en/api) 注册并获取密钥
2. 创建环境变量文件：
```bash
cp .env.example .env.local
```
3. 编辑 `.env.local` 文件，填入你的 API 密钥：
```env
NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的实际API密钥
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

> 📖 **详细配置指南**：查看 [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) 获取完整的 API 配置说明。

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到Vercel

### 快速部署

1. Fork 这个仓库到你的 GitHub 账户
2. 在 [Vercel](https://vercel.com) 中导入项目
3. **重要**：在部署前配置环境变量
   - 进入项目设置 → Environment Variables
   - 添加：`NEXT_PUBLIC_COINGECKO_API_KEY` = `你的CoinGecko API密钥`
4. 点击部署

### 通过 CLI 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 配置环境变量
vercel env add NEXT_PUBLIC_COINGECKO_API_KEY

# 部署
vercel --prod
```

> 📖 **详细部署指南**：查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的部署说明。

## API 配置

项目使用 CoinGecko API 获取价格数据。**每个部署者都需要配置自己的 API 密钥**：

- 🆓 **免费获取**：[CoinGecko API](https://www.coingecko.com/en/api)
- 📝 **配置方法**：查看 [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)
- 🔧 **环境变量**：`NEXT_PUBLIC_COINGECKO_API_KEY`

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

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **图表**: Recharts
- **API**: CoinGecko API

## 🤝 贡献

我们欢迎所有形式的贡献！请查看 [贡献指南](./CONTRIBUTING.md) 了解如何参与项目开发。

### 快速贡献步骤

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 配置你的 API 密钥（查看 [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)）
4. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
5. 推送到分支 (`git push origin feature/AmazingFeature`)
6. 创建 Pull Request

## 📞 支持

- 📖 [API 配置指南](./API_SETUP_GUIDE.md)
- 🚀 [部署指南](./DEPLOYMENT.md)
- 🔧 [Vercel 故障排除](./VERCEL_TROUBLESHOOTING.md)
- 🤝 [贡献指南](./CONTRIBUTING.md)
- 🐛 [报告问题](https://github.com/SUNSIR007/cryptoTrack/issues)

## 开发者

由Augment和Claude协作开发完成。

## 许可证

ISC

