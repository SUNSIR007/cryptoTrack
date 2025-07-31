#!/usr/bin/env node

/**
 * 环境变量检查脚本
 * 用于验证 CryptoTrack 项目的环境变量配置
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvironmentVariables() {
  log('\n🔍 检查环境变量配置...', 'blue');
  log('=' .repeat(50), 'blue');

  const requiredVars = [
    'NEXT_PUBLIC_COINGECKO_API_KEY',
    'COINGECKO_API_KEY'
  ];

  let hasAnyKey = false;
  let issues = [];

  // 检查环境变量
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      log(`✅ ${varName}: 已配置`, 'green');
      hasAnyKey = true;
      
      // 验证 API 密钥格式
      if (value.startsWith('CG-')) {
        log(`   格式正确 (CG-xxxxxxxx)`, 'green');
      } else {
        log(`   ⚠️  格式可能不正确，应以 'CG-' 开头`, 'yellow');
        issues.push(`${varName} 格式可能不正确`);
      }
    } else {
      log(`❌ ${varName}: 未配置`, 'red');
    }
  });

  // 检查 .env 文件
  log('\n📁 检查环境变量文件...', 'blue');
  
  const envFiles = ['.env.local', '.env', '.env.example'];
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file}: 存在`, 'green');
      
      if (file === '.env.example') {
        log(`   这是模板文件，请复制为 .env.local 并配置实际密钥`, 'yellow');
      }
    } else {
      if (file === '.env.local') {
        log(`❌ ${file}: 不存在`, 'red');
        issues.push('缺少 .env.local 文件');
      } else {
        log(`⚪ ${file}: 不存在`, 'reset');
      }
    }
  });

  // 总结
  log('\n📊 检查结果:', 'blue');
  log('=' .repeat(50), 'blue');

  if (hasAnyKey && issues.length === 0) {
    log('🎉 环境变量配置正确！', 'green');
    log('项目应该可以正常运行。', 'green');
  } else if (hasAnyKey && issues.length > 0) {
    log('⚠️  环境变量已配置，但存在一些问题:', 'yellow');
    issues.forEach(issue => log(`   - ${issue}`, 'yellow'));
  } else {
    log('❌ 环境变量未正确配置！', 'red');
    log('\n🔧 解决方案:', 'yellow');
    log('1. 获取 CoinGecko API 密钥: https://www.coingecko.com/en/api', 'yellow');
    log('2. 创建 .env.local 文件:', 'yellow');
    log('   cp .env.example .env.local', 'yellow');
    log('3. 在 .env.local 中添加:', 'yellow');
    log('   NEXT_PUBLIC_COINGECKO_API_KEY=CG-你的API密钥', 'yellow');
    log('4. 重启开发服务器:', 'yellow');
    log('   npm run dev', 'yellow');
  }

  log('\n📖 更多帮助:', 'blue');
  log('- API 配置指南: ./API_SETUP_GUIDE.md', 'blue');
  log('- 部署指南: ./DEPLOYMENT.md', 'blue');
  log('- 贡献指南: ./CONTRIBUTING.md', 'blue');

  return hasAnyKey && issues.length === 0;
}

async function testApiConnection() {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || process.env.COINGECKO_API_KEY;
  
  if (!apiKey) {
    log('\n⚠️  跳过 API 连接测试：未配置 API 密钥', 'yellow');
    return false;
  }

  log('\n🌐 测试 API 连接...', 'blue');
  
  try {
    // 使用内置 fetch（Node.js 18+）或动态导入
    let fetch;
    if (typeof globalThis.fetch !== 'undefined') {
      fetch = globalThis.fetch;
    } else {
      // 对于较老的 Node.js 版本，尝试使用 node-fetch
      try {
        fetch = (await import('node-fetch')).default;
      } catch (e) {
        console.log('⚠️  无法导入 fetch，跳过 API 连接测试', 'yellow');
        return false;
      }
    }
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&x_cg_demo_api_key=${apiKey}`
    );

    if (response.ok) {
      const data = await response.json();
      log('✅ API 连接成功！', 'green');
      log(`   比特币当前价格: $${data.bitcoin?.usd || 'N/A'}`, 'green');
      return true;
    } else {
      log(`❌ API 连接失败: HTTP ${response.status}`, 'red');
      if (response.status === 401) {
        log('   可能的原因: API 密钥无效', 'red');
      } else if (response.status === 429) {
        log('   可能的原因: 请求频率过高', 'red');
      }
      return false;
    }
  } catch (error) {
    log(`❌ API 连接测试失败: ${error.message}`, 'red');
    log('   注意: 这可能是网络问题，不一定是配置问题', 'yellow');
    return false;
  }
}

// 主函数
async function main() {
  log(`${colors.bold}🔑 CryptoTrack 环境变量检查工具${colors.reset}`, 'blue');
  
  const envOk = checkEnvironmentVariables();
  
  if (envOk) {
    await testApiConnection();
  }
  
  log('\n' + '='.repeat(50), 'blue');
  log('检查完成！', 'blue');
}

// 运行检查
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkEnvironmentVariables, testApiConnection };
