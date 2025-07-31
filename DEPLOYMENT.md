# CryptoTrack 部署指南

本文档详细说明如何将CryptoTrack项目部署到Vercel平台。

## 前置要求

1. **GitHub账户** - 用于托管代码
2. **Vercel账户** - 用于部署应用
3. **Git** - 用于版本控制

## 部署步骤

### 1. 准备代码仓库

首先，确保你的代码已经推送到GitHub仓库：

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: CryptoTrack application"

# 添加远程仓库（替换为你的GitHub仓库URL）
git remote add origin https://github.com/yourusername/cryptoTrack.git

# 推送到GitHub
git push -u origin main
```

### 2. 在Vercel中部署

#### 方法一：通过Vercel网站部署

1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账户登录
3. 点击 "New Project"
4. 选择你的 `cryptoTrack` 仓库
5. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

6. 点击 "Deploy" 开始部署

#### 方法二：通过Vercel CLI部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 在项目目录中运行部署
vercel

# 按照提示配置项目
# - Set up and deploy? Y
# - Which scope? (选择你的账户)
# - Link to existing project? N
# - What's your project's name? cryptotrack
# - In which directory is your code located? ./

# 部署到生产环境
vercel --prod
```

### 3. 环境变量配置 ⚠️ **必需步骤**

**重要**：项目需要 CoinGecko API 密钥才能正常运行。

#### 获取 API 密钥

1. 访问 [CoinGecko API](https://www.coingecko.com/en/api)
2. 注册账户并获取免费 API 密钥
3. 复制你的 API 密钥（格式：`CG-xxxxxxxxxx`）

#### 在 Vercel 中配置环境变量

1. 进入 Vercel 项目仪表板
2. 点击 "Settings" 标签
3. 选择 "Environment Variables"
4. 添加以下环境变量：

| 变量名 | 值 | 环境 |
|--------|----|----- |
| `NEXT_PUBLIC_COINGECKO_API_KEY` | `CG-你的实际API密钥` | Production, Preview, Development |

#### 通过 CLI 配置

```bash
# 添加环境变量
vercel env add NEXT_PUBLIC_COINGECKO_API_KEY

# 按提示输入：
# - 变量值：你的 CoinGecko API 密钥
# - 环境：选择 Production, Preview, Development
```

#### 验证配置

部署完成后，如果看到以下错误，说明环境变量未正确配置：
- "CoinGecko API密钥未配置"
- "HTTP error! status: 401"

解决方法：
1. 检查环境变量名称是否正确
2. 确认 API 密钥有效
3. 重新部署项目

### 4. 自定义域名（可选）

1. 在Vercel项目设置中选择 "Domains"
2. 添加你的自定义域名
3. 按照提示配置DNS记录

### 5. 验证部署

部署完成后，Vercel会提供一个URL，例如：
- `https://cryptotrack.vercel.app`
- `https://cryptotrack-yourusername.vercel.app`

访问这个URL来验证应用是否正常运行。

## 自动部署

一旦设置完成，每次向GitHub仓库推送代码时，Vercel会自动触发新的部署：

```bash
# 修改代码后
git add .
git commit -m "Update: description of changes"
git push origin main
```

## 故障排除

### 常见问题

1. **构建失败**
   - 检查package.json中的依赖是否正确
   - 确保所有TypeScript错误已修复
   - 查看Vercel构建日志获取详细错误信息

2. **API调用失败**
   - 检查CoinGecko API密钥是否有效
   - 确认API调用URL格式正确
   - 检查网络连接和CORS设置

3. **样式问题**
   - 确保Tailwind CSS配置正确
   - 检查CSS文件是否正确导入

### 查看日志

在Vercel项目仪表板中：
1. 选择 "Functions" 标签查看服务器端日志
2. 选择 "Deployments" 标签查看构建日志

## 性能优化

1. **启用缓存**
   - Vercel自动为静态资源启用CDN缓存
   - API响应可以通过适当的缓存头进行优化

2. **图片优化**
   - 使用Next.js的Image组件自动优化图片

3. **代码分割**
   - Next.js自动进行代码分割，无需额外配置

## 监控和分析

1. **Vercel Analytics**
   - 在项目设置中启用Analytics
   - 查看页面性能和用户行为数据

2. **错误监控**
   - 集成Sentry或其他错误监控服务
   - 监控API调用失败和客户端错误

## 更新和维护

1. **定期更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **监控API使用**
   - 定期检查CoinGecko API使用情况
   - 确保不超过API限制

3. **备份配置**
   - 定期备份Vercel项目配置
   - 保存重要的环境变量

## 支持

如果遇到部署问题，可以：
1. 查看Vercel官方文档
2. 检查GitHub Issues
3. 联系技术支持

---

**注意**: 确保在生产环境中使用HTTPS，Vercel默认为所有部署启用HTTPS。
