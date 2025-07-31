# 🔑 API 配置指南

## 概述

CryptoTrack 使用 CoinGecko API 获取加密货币价格数据。为了让项目正常运行，你需要配置自己的 API 密钥。

## 🚀 快速开始

### 1. 获取 CoinGecko API 密钥

1. 访问 [CoinGecko API 官网](https://www.coingecko.com/en/api)
2. 点击 "Get Free API Key" 注册账户
3. 验证邮箱后，在控制台获取你的 API 密钥
4. 免费版本每月有 10,000 次请求限制，对个人使用足够

### 2. 本地开发配置

#### 方法一：使用 .env.local 文件 (推荐)

1. 在项目根目录创建 `.env.local` 文件：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的 API 密钥：
```env
NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的实际API密钥
```

3. 启动开发服务器：
```bash
npm run dev
```

#### 方法二：直接设置环境变量

```bash
# Linux/macOS
export NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的实际API密钥
npm run dev

# Windows (PowerShell)
$env:NEXT_PUBLIC_COINGECKO_API_KEY="CG-你的实际API密钥"
npm run dev

# Windows (CMD)
set NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的实际API密钥
npm run dev
```

## 🌐 部署配置

### Vercel 部署

1. **通过 Vercel 控制台配置**：
   - 进入你的 Vercel 项目仪表板
   - 点击 "Settings" → "Environment Variables"
   - 添加新变量：
     - Name: `NEXT_PUBLIC_COINGECKO_API_KEY`
     - Value: `CG-你的实际API密钥`
     - Environment: `Production`, `Preview`, `Development`

2. **通过 Vercel CLI 配置**：
```bash
vercel env add NEXT_PUBLIC_COINGECKO_API_KEY
# 输入你的 API 密钥
# 选择环境: Production, Preview, Development
```

3. **重新部署**：
```bash
vercel --prod
```

### Netlify 部署

1. 在 Netlify 项目设置中：
   - 进入 "Site settings" → "Environment variables"
   - 添加：`NEXT_PUBLIC_COINGECKO_API_KEY` = `CG-你的实际API密钥`

### Railway 部署

1. 在 Railway 项目中：
   - 进入 "Variables" 标签
   - 添加：`NEXT_PUBLIC_COINGECKO_API_KEY` = `CG-你的实际API密钥`

### 其他平台

对于其他部署平台，请在相应的环境变量配置中添加：
- 变量名：`NEXT_PUBLIC_COINGECKO_API_KEY`
- 变量值：你的 CoinGecko API 密钥

## 🔧 环境变量说明

### NEXT_PUBLIC_COINGECKO_API_KEY vs COINGECKO_API_KEY

- `NEXT_PUBLIC_COINGECKO_API_KEY`: 客户端可访问，用于前端 API 调用
- `COINGECKO_API_KEY`: 仅服务端可访问，更安全但功能受限

**推荐使用 `NEXT_PUBLIC_COINGECKO_API_KEY`** 因为本项目主要在客户端进行 API 调用。

### 安全注意事项

1. **API 密钥暴露**：由于使用 `NEXT_PUBLIC_` 前缀，API 密钥会暴露在客户端代码中
2. **免费版限制**：CoinGecko 免费版有请求限制，请合理使用
3. **密钥保护**：不要将 API 密钥提交到公共代码仓库

## 🛠️ 故障排除

### 常见错误

1. **"CoinGecko API密钥未配置"**
   - 检查环境变量是否正确设置
   - 确认变量名拼写正确
   - 重启开发服务器

2. **"HTTP error! status: 401"**
   - API 密钥无效或已过期
   - 检查 CoinGecko 账户状态
   - 重新生成 API 密钥

3. **"HTTP error! status: 429"**
   - 超出 API 请求限制
   - 等待限制重置或升级 API 计划

### 调试步骤

1. **检查环境变量**：
```javascript
console.log('API Key:', process.env.NEXT_PUBLIC_COINGECKO_API_KEY);
```

2. **测试 API 连接**：
```bash
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=你的API密钥"
```

3. **查看浏览器控制台**：
   - 打开开发者工具
   - 查看 Console 和 Network 标签
   - 检查 API 请求状态

## 📞 获取帮助

如果遇到问题：

1. 查看 [CoinGecko API 文档](https://www.coingecko.com/en/api/documentation)
2. 检查项目的 [Issues 页面](https://github.com/SUNSIR007/cryptoTrack/issues)
3. 创建新的 Issue 描述你的问题

## 🔄 API 密钥更新

如需更换 API 密钥：

1. 在 CoinGecko 控制台生成新密钥
2. 更新环境变量配置
3. 重新部署应用（如果是生产环境）

---

**注意**：请妥善保管你的 API 密钥，不要分享给他人或提交到公共代码仓库。
