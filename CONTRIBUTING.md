# 🤝 贡献指南

感谢你对 CryptoTrack 项目的关注！我们欢迎所有形式的贡献。

## 🚀 快速开始

### 1. Fork 和克隆项目

```bash
# Fork 项目到你的 GitHub 账户
# 然后克隆到本地
git clone https://github.com/你的用户名/cryptoTrack.git
cd cryptoTrack
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑 .env.local，添加你的 CoinGecko API 密钥
# NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的API密钥
```

> 📖 详细配置说明请查看 [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md)

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📋 贡献类型

我们欢迎以下类型的贡献：

- 🐛 **Bug 修复**：修复现有功能的问题
- ✨ **新功能**：添加新的功能特性
- 📚 **文档改进**：改进文档、注释或示例
- 🎨 **UI/UX 改进**：改进用户界面和用户体验
- ⚡ **性能优化**：提升应用性能
- 🧪 **测试**：添加或改进测试用例
- 🔧 **工具和配置**：改进开发工具和配置

## 🔄 开发流程

### 1. 创建分支

```bash
# 从 main 分支创建新分支
git checkout -b feature/你的功能名称
# 或
git checkout -b fix/修复的问题
```

### 2. 开发和测试

- 遵循现有的代码风格
- 添加必要的注释
- 确保代码通过 linting 检查
- 测试你的更改

```bash
# 运行 linting 检查
npm run lint

# 构建项目确保无错误
npm run build
```

### 3. 提交更改

```bash
# 添加更改
git add .

# 提交更改（使用清晰的提交信息）
git commit -m "feat: 添加新的价格提醒功能"
# 或
git commit -m "fix: 修复价格显示精度问题"
```

### 4. 推送和创建 PR

```bash
# 推送到你的 fork
git push origin feature/你的功能名称

# 在 GitHub 上创建 Pull Request
```

## 📝 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 配置
- 使用有意义的变量和函数名
- 添加适当的注释

### React 组件

- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- Props 接口使用 TypeScript 定义
- 合理使用 `useCallback` 和 `useMemo` 优化性能

### 样式

- 使用 Tailwind CSS
- 支持深色模式
- 确保响应式设计
- 保持一致的设计语言

### API 调用

- 使用现有的 API 缓存机制
- 添加适当的错误处理
- 考虑请求去重
- 遵循 API 限制

## 🐛 报告 Bug

在报告 Bug 时，请包含：

1. **环境信息**：
   - 操作系统
   - 浏览器版本
   - Node.js 版本

2. **重现步骤**：
   - 详细的操作步骤
   - 预期行为
   - 实际行为

3. **相关信息**：
   - 错误截图
   - 控制台错误信息
   - 相关配置

## 💡 功能建议

在提出新功能建议时，请：

1. 描述功能的用途和价值
2. 提供具体的使用场景
3. 考虑实现的复杂度
4. 检查是否已有类似的 Issue

## 🔍 代码审查

所有的 Pull Request 都会经过代码审查：

- 确保代码质量和一致性
- 检查功能是否正常工作
- 验证是否遵循项目规范
- 确保没有引入新的 Bug

## 📞 获取帮助

如果你需要帮助：

1. 查看现有的 [Issues](https://github.com/SUNSIR007/cryptoTrack/issues)
2. 阅读项目文档
3. 创建新的 Issue 描述你的问题

## 📄 许可证

通过贡献代码，你同意你的贡献将在与项目相同的许可证下发布。

---

再次感谢你的贡献！🎉
