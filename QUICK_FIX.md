# 🚨 快速修复：Vercel 部署错误

## 你遇到的问题

错误信息：`Input required and not supplied: vercel-token`

这是因为 GitHub Actions 工作流尝试自动部署到 Vercel，但缺少必要的配置。

## 🔧 立即修复方案

### 方案1: 删除 GitHub Actions 工作流（推荐）

```bash
# 删除导致问题的工作流文件
rm .github/workflows/deploy.yml

# 提交更改
git add .
git commit -m "Remove problematic GitHub Actions workflow"
git push
```

### 方案2: 直接通过 Vercel 网站部署

1. **不要使用 GitHub Actions**，直接在 Vercel 网站部署
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "New Project"
4. 选择你的 GitHub 仓库
5. **重要**: 在部署前配置环境变量：
   - Name: `NEXT_PUBLIC_COINGECKO_API_KEY`
   - Value: 你的 CoinGecko API 密钥
6. 点击 "Deploy"

## 📋 完整的部署步骤

### 步骤1: 清理项目

```bash
# 如果还没有删除工作流文件
rm .github/workflows/deploy.yml

# 确保项目可以正常构建
npm run build

# 提交所有更改
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

### 步骤2: 获取 API 密钥

1. 访问 [CoinGecko API](https://www.coingecko.com/en/api)
2. 注册账户并获取免费 API 密钥
3. 复制你的 API 密钥（格式：`CG-xxxxxxxxxx`）

### 步骤3: 在 Vercel 部署

1. **连接项目**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账户登录
   - 点击 "New Project"
   - 选择你的 cryptoTrack 仓库

2. **配置环境变量** ⚠️ **关键步骤**
   - 在部署页面，找到 "Environment Variables" 部分
   - 点击展开
   - 添加变量：
     - **Name**: `NEXT_PUBLIC_COINGECKO_API_KEY`
     - **Value**: `CG-你的实际API密钥`
     - **Environment**: 选择所有环境 (Production, Preview, Development)
   - 点击 "Add"

3. **开始部署**
   - 确认所有配置正确
   - 点击 "Deploy"
   - 等待构建完成

### 步骤4: 验证部署

部署完成后：
1. 访问你的 Vercel 应用 URL
2. 检查是否显示加密货币价格
3. 如果显示 "API 密钥未配置" 错误，说明环境变量配置有问题

## 🔍 故障排除

### 如果仍然有问题

1. **检查环境变量**
   - 进入 Vercel 项目设置
   - 确认 `NEXT_PUBLIC_COINGECKO_API_KEY` 已正确添加
   - 确认 API 密钥格式正确（以 `CG-` 开头）

2. **重新部署**
   - 在 Vercel 项目页面点击 "Redeploy"
   - 或者推送一个小的更改到 GitHub 触发重新部署

3. **查看构建日志**
   - 在 Vercel 项目页面查看部署详情
   - 检查是否有构建错误

## 📞 需要帮助？

如果按照以上步骤仍然有问题：

1. 查看 [VERCEL_TROUBLESHOOTING.md](./VERCEL_TROUBLESHOOTING.md) 获取详细的故障排除指南
2. 在 [GitHub Issues](https://github.com/SUNSIR007/cryptoTrack/issues) 创建新问题
3. 提供以下信息：
   - 错误截图
   - Vercel 构建日志
   - 你的配置步骤

## ✅ 成功标志

部署成功后，你应该看到：
- 网站正常加载
- 显示 BTC、ETH、SOL、BNB 的实时价格
- 可以搜索和添加新的加密货币
- 没有 "API 密钥未配置" 的错误提示

---

**记住**: 最重要的是在 Vercel 中正确配置 `NEXT_PUBLIC_COINGECKO_API_KEY` 环境变量！
