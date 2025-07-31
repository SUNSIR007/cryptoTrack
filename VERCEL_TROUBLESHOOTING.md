# 🔧 Vercel 部署故障排除指南

## 常见部署错误及解决方案

### 1. GitHub Actions 相关错误

**错误信息**: `Input required and not supplied: vercel-token`

**原因**: GitHub Actions 工作流尝试自动部署到 Vercel，但缺少必要的配置。

**解决方案**:
1. **推荐方法**: 直接通过 Vercel 网站部署，不使用 GitHub Actions
2. **或者**: 删除 `.github/workflows/deploy.yml` 文件
3. **或者**: 在 GitHub 仓库设置中配置 Vercel 相关的 Secrets

```bash
# 删除 GitHub Actions 工作流（如果不需要）
rm .github/workflows/deploy.yml
git add .
git commit -m "Remove GitHub Actions workflow"
git push
```

### 2. 环境变量未配置

**错误信息**: 应用部署成功但显示 "API 密钥未配置"

**解决方案**:
1. 进入 Vercel 项目仪表板
2. 点击 "Settings" → "Environment Variables"
3. 添加变量：
   - Name: `NEXT_PUBLIC_COINGECKO_API_KEY`
   - Value: `CG-你的API密钥`
   - Environment: Production, Preview, Development
4. 重新部署项目

### 3. 构建失败

**错误信息**: `Build failed` 或 `Command "npm run build" exited with 1`

**可能原因和解决方案**:

#### 原因1: 依赖安装失败
```bash
# 本地测试构建
npm ci
npm run build
```

#### 原因2: TypeScript 类型错误
```bash
# 检查类型错误
npm run lint
```

#### 原因3: 环境变量问题
- 确保在 Vercel 中正确配置了 `NEXT_PUBLIC_COINGECKO_API_KEY`
- 检查 API 密钥格式是否正确（应以 `CG-` 开头）

### 4. 部署成功但功能异常

**问题**: 网站可以访问但加密货币价格不显示

**检查步骤**:
1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签是否有错误信息
3. 查看 Network 标签，检查 API 请求状态
4. 确认环境变量是否正确配置

**常见错误**:
- `401 Unauthorized`: API 密钥无效
- `429 Too Many Requests`: API 请求频率过高
- `CORS Error`: 网络或 API 配置问题

## 🚀 推荐的部署流程

### 方法1: 简单部署（推荐新手）

1. **Fork 项目到你的 GitHub**
2. **获取 API 密钥**: [CoinGecko API](https://www.coingecko.com/en/api)
3. **连接 Vercel**:
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 登录
   - 点击 "New Project"
   - 选择 cryptoTrack 仓库
4. **配置环境变量**:
   - 在部署页面添加 `NEXT_PUBLIC_COINGECKO_API_KEY`
5. **点击 Deploy**

### 方法2: 本地测试后部署

1. **本地设置**:
```bash
git clone https://github.com/你的用户名/cryptoTrack.git
cd cryptoTrack
npm install
cp .env.example .env.local
# 编辑 .env.local 添加你的 API 密钥
npm run dev
```

2. **测试构建**:
```bash
npm run build
npm run check-env
```

3. **推送并部署**:
```bash
git add .
git commit -m "Configure for deployment"
git push
# 然后在 Vercel 中导入项目
```

## 🔍 调试技巧

### 检查环境变量
在 Vercel 项目中添加临时调试代码：
```javascript
console.log('API Key:', process.env.NEXT_PUBLIC_COINGECKO_API_KEY);
```

### 查看构建日志
1. 进入 Vercel 项目仪表板
2. 点击失败的部署
3. 查看 "Build Logs" 获取详细错误信息

### 测试 API 连接
使用浏览器直接测试 API：
```
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=你的API密钥
```

## 📞 获取帮助

如果以上方法都无法解决问题：

1. **检查项目文档**:
   - [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)

2. **运行本地诊断**:
```bash
npm run check-env
```

3. **查看 Vercel 官方文档**:
   - [Vercel Next.js 部署指南](https://vercel.com/docs/frameworks/nextjs)
   - [环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)

4. **创建 Issue**:
   - 访问 [项目 Issues 页面](https://github.com/SUNSIR007/cryptoTrack/issues)
   - 提供详细的错误信息和步骤

## ✅ 部署成功检查清单

- [ ] 项目在 Vercel 中成功构建
- [ ] 环境变量 `NEXT_PUBLIC_COINGECKO_API_KEY` 已配置
- [ ] 网站可以正常访问
- [ ] 加密货币价格正常显示
- [ ] 搜索功能正常工作
- [ ] 没有控制台错误
- [ ] API 状态组件显示正常（绿色或不显示）

---

**提示**: 大多数部署问题都是由于环境变量未正确配置导致的。请确保在 Vercel 中正确添加了 API 密钥！
