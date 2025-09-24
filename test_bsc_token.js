// 测试 BSC 代币地址检测和价格获取
// 运行: node test_bsc_token.js

const testBSCToken = async () => {
  const testAddress = '0x000ae314e2a2172a039b26378814c252734f556a'; // ASTER token
  
  console.log('🧪 测试 BSC 代币地址检测和价格获取');
  console.log('测试地址:', testAddress);
  
  // 测试地址格式检测
  const evmPattern = /^0x[a-fA-F0-9]{40}$/;
  const isValidEVM = evmPattern.test(testAddress);
  console.log('✅ EVM 地址格式检测:', isValidEVM ? '通过' : '失败');
  
  // 测试 GeckoTerminal API 调用
  try {
    console.log('\n📡 测试 GeckoTerminal API...');
    
    // 测试代币信息获取
    const tokenUrl = `https://api.geckoterminal.com/api/v2/networks/bsc/tokens/${testAddress}`;
    console.log('请求 URL:', tokenUrl);
    
    const response = await fetch(tokenUrl, {
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ 代币信息获取成功');
      console.log('代币名称:', data.data.attributes.name);
      console.log('代币符号:', data.data.attributes.symbol);
      console.log('当前价格:', data.data.attributes.price_usd);
      console.log('市值:', data.data.attributes.market_cap_usd);
      
      // 测试获取主要交易池
      const topPools = data.data.relationships?.top_pools?.data;
      if (topPools && topPools.length > 0) {
        const mainPoolId = topPools[0].id;
        console.log('主要交易池 ID:', mainPoolId);
        
        // 获取池子详细信息
        const poolUrl = `https://api.geckoterminal.com/api/v2/networks/bsc/pools/${mainPoolId.split('_')[1]}`;
        console.log('池子 URL:', poolUrl);
        
        const poolResponse = await fetch(poolUrl, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (poolResponse.ok) {
          const poolData = await poolResponse.json();
          console.log('✅ 池子信息获取成功');
          console.log('24h 价格变化:', poolData.data.attributes.price_change_percentage?.h24 + '%');
          console.log('24h 交易量:', poolData.data.attributes.volume_usd?.h24);
        } else {
          console.log('❌ 池子信息获取失败:', poolResponse.status);
        }
      }
    } else {
      console.log('❌ 代币信息获取失败:', response.status);
    }
  } catch (error) {
    console.error('❌ API 测试失败:', error);
  }
};

// 如果在 Node.js 环境中运行
if (typeof window === 'undefined') {
  // 添加 fetch polyfill for Node.js
  global.fetch = require('node-fetch');
  testBSCToken();
}

module.exports = { testBSCToken };
