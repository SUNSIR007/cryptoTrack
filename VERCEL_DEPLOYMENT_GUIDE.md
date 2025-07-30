# Vercel 部署指南

## 🚀 部署步骤

### 1. 修复的问题

✅ **已修复**: 移除了 `vercel.json` 中冲突的 `builds` 和 `functions` 属性
✅ **已修复**: 修复了viewport配置警告
✅ **已修复**: 更新了项目描述信息

**之前的错误**:
```
The `functions` property cannot be used in conjunction with the `builds` property. Please remove one of them.
```

**修复方案**:
- 简化了 `vercel.json` 配置
- 移除了不必要的 `builds` 和 `routes` 配置
- 将viewport从metadata中分离出来
- 更新了package.json描述信息

### 2. 当前配置文件

#### vercel.json
```json
{
  "name": "cryptotrack",
  "framework": "nextjs",
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### package.json (关键脚本)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 3. 部署到Vercel

#### 方法一: 通过Vercel CLI
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署
vercel --prod
```

#### 方法二: 通过GitHub集成
1. 将代码推送到GitHub仓库
2. 在Vercel控制台连接GitHub仓库
3. Vercel会自动检测Next.js项目并部署

### 4. 环境变量配置

如果需要在Vercel中配置环境变量:

1. 在Vercel项目设置中添加环境变量
2. 或在 `vercel.json` 中添加:
```json
{
  "env": {
    "NODE_ENV": "production",
    "CUSTOM_API_KEY": "@custom-api-key"
  }
}
```

### 5. 项目特点

- ✅ **Next.js 14**: 使用最新的App Router
- ✅ **TypeScript**: 完整的类型支持
- ✅ **Tailwind CSS**: 响应式设计
- ✅ **实时数据**: CoinGecko API集成
- ✅ **PWA支持**: 包含manifest和图标

### 6. 部署后验证

部署成功后，验证以下功能:

- [ ] 页面正常加载
- [ ] 四个币种(BTC, ETH, SOL, BNB)数据正常显示
- [ ] 响应式布局在不同设备上正常
- [ ] 深色/浅色模式切换正常
- [ ] 刷新按钮功能正常
- [ ] 页脚固定在底部
- [ ] 网站图标正确显示

### 7. 常见问题解决

#### 构建失败
```bash
# 本地测试构建
npm run build
```

#### API调用问题
- 确保CoinGecko API在生产环境中可访问
- 检查CORS设置

#### 样式问题
- 确保Tailwind CSS正确配置
- 检查 `tailwind.config.js` 中的content路径

### 8. 性能优化

Vercel会自动优化:
- ✅ 静态文件CDN
- ✅ 图片优化
- ✅ 代码分割
- ✅ 边缘函数

## 🎯 部署成功标志

当看到以下内容时，说明部署成功:
- Vercel提供的生产环境URL
- 所有功能正常工作
- 响应式设计在移动端和桌面端都正常

## 📞 支持

如果遇到其他部署问题:
1. 检查Vercel部署日志
2. 确认所有依赖都在 `package.json` 中
3. 验证Next.js配置正确
4. 检查环境变量设置

现在可以安全地部署到Vercel了！🚀
