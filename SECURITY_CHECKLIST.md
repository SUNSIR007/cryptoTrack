# 🔒 安全检查清单

## ✅ 已修复的安全问题

### 1. API密钥泄露
- [x] 删除了包含硬编码API密钥的 `test.html` 文件
- [x] 确保所有API密钥都通过环境变量配置
- [x] 更新了 `.env.example` 文件说明

### 2. 测试页面暴露
- [x] 删除了 `/debug` 调试页面
- [x] 删除了 `/test` 测试页面
- [x] 删除了 `/test-v2ex` V2EX测试页面
- [x] 删除了 `/test-token-search` 代币搜索测试页面
- [x] 在 `robots.txt` 中禁止访问测试路径

### 3. 安全头部加强
- [x] 移除了CSP中的 `'unsafe-eval'`
- [x] 添加了 `Permissions-Policy` 头部
- [x] 添加了 `Strict-Transport-Security` 头部
- [x] 改进了CSP策略，添加了 `object-src 'none'` 和 `base-uri 'self'`

### 4. 网站透明度
- [x] 保留了 `/security` 安全声明页面
- [x] 更新了 `robots.txt` 说明网站用途
- [x] 明确标注这是教育用途的开源项目

## 🔍 部署前检查

### 环境变量安全
- [ ] 确认 `.env.local` 文件不在版本控制中
- [ ] 确认生产环境中API密钥通过平台环境变量配置
- [ ] 确认没有硬编码的敏感信息

### 代码安全
- [ ] 确认没有调试代码或测试页面
- [ ] 确认所有外部API调用都是安全的
- [ ] 确认没有XSS或注入漏洞

### 部署安全
- [ ] 确认HTTPS正常工作
- [ ] 确认安全头部正确设置
- [ ] 确认CSP策略生效

## 🚨 Google安全警告的可能原因

### 1. 内容相关
- 网站包含"crypto"、"bitcoin"等敏感关键词
- 浏览器误判为金融诈骗网站

### 2. 技术相关
- 新域名缺乏信誉历史
- 部署平台被误判
- SSL证书问题

### 3. 代码相关
- ✅ 已修复：硬编码API密钥
- ✅ 已修复：测试页面暴露
- ✅ 已修复：不安全的CSP策略

## 📋 解决Google安全警告的步骤

### 1. 立即措施
- [x] 修复所有安全问题
- [x] 删除测试和调试代码
- [x] 加强安全头部配置

### 2. 提交审核
- [ ] 访问 [Google Safe Browsing](https://safebrowsing.google.com/safebrowsing/report_error/)
- [ ] 提交网站重新审核请求
- [ ] 说明这是合法的教育项目

### 3. 增强信誉
- [ ] 提交到 Google Search Console
- [ ] 添加详细的关于页面
- [ ] 获得用户正面反馈

### 4. 监控状态
- [ ] 定期检查安全状态
- [ ] 监控证书有效期
- [ ] 关注安全漏洞

## 🔗 相关资源

- [Google Safe Browsing 报告](https://safebrowsing.google.com/safebrowsing/report_error/)
- [Vercel 安全最佳实践](https://vercel.com/docs/security)
- [Next.js 安全指南](https://nextjs.org/docs/advanced-features/security-headers)
- [OWASP 安全检查清单](https://owasp.org/www-project-web-security-testing-guide/)

## 📞 如需帮助

如果安全警告仍然存在，请：
1. 检查浏览器控制台错误
2. 使用在线安全检测工具
3. 联系域名注册商
4. 在项目Issues中报告问题
