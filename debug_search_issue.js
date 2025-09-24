// 调试搜索问题
const XDOG_ADDRESS = '0x0cc24c51bf89c00c5affbfcf5e856c25ecbdb48e';

// 模拟网络配置
const SUPPORTED_NETWORKS = {
  ethereum: {
    id: 'eth',
    name: 'Ethereum',
    coingecko_id: 'ethereum',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'ethereum'
  },
  bsc: {
    id: 'bsc',
    name: 'BNB Chain',
    coingecko_id: 'binance-smart-chain',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'binancecoin'
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    coingecko_id: 'solana',
    address_pattern: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    native_token: 'solana'
  },
  okx: {
    id: 'x-layer',
    name: 'X Layer (OKX)',
    coingecko_id: 'x-layer',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'okb'
  }
};

// 标准化EVM地址
function normalizeEVMAddress(address) {
  if (!address.startsWith('0x')) {
    return address;
  }
  
  if (address.length < 42) {
    const hexPart = address.slice(2);
    const paddedHex = hexPart.padStart(40, '0');
    return '0x' + paddedHex;
  }
  
  return address;
}

// 检测代币地址所属的网络
function detectTokenNetwork(address) {
  // Solana 地址有独特的格式，可以直接识别
  if (SUPPORTED_NETWORKS.solana.address_pattern.test(address)) {
    return 'solana';
  }

  // 标准化EVM地址
  const normalizedAddress = normalizeEVMAddress(address);
  
  // EVM 地址格式相同，无法直接区分 BSC、Ethereum、OKX 等
  if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    return 'evm';
  }

  return null;
}

// 测试 GeckoTerminal API 调用
async function testGeckoTerminalAPI(tokenAddress, network) {
  const networkConfig = SUPPORTED_NETWORKS[network];
  if (!networkConfig) {
    console.log(`❌ 不支持的网络: ${network}`);
    return null;
  }

  const url = `https://api.geckoterminal.com/api/v2/networks/${networkConfig.id}/tokens/${tokenAddress}`;
  console.log(`🔗 API URL: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log(`📡 响应状态: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ 错误响应: ${errorText}`);
      return null;
    }

    const data = await response.json();
    console.log('✅ 成功获取数据:');
    console.log(`   代币名称: ${data.data?.attributes?.name}`);
    console.log(`   代币符号: ${data.data?.attributes?.symbol}`);
    console.log(`   价格: $${data.data?.attributes?.price_usd}`);
    console.log(`   市值: $${data.data?.attributes?.market_cap_usd}`);
    
    return data;
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}`);
    return null;
  }
}

// 模拟完整的搜索流程
async function simulateSearch(input) {
  console.log('🔍 开始搜索流程');
  console.log('=' .repeat(50));
  console.log(`输入: ${input}`);
  
  // 1. 检测网络
  const detectedNetwork = detectTokenNetwork(input);
  console.log(`检测到的网络类型: ${detectedNetwork}`);
  
  if (detectedNetwork === 'evm') {
    // 2. 标准化地址
    const normalizedAddress = normalizeEVMAddress(input);
    console.log(`标准化地址: ${normalizedAddress}`);
    
    // 3. 尝试各个网络
    const networks = ['bsc', 'ethereum', 'okx'];
    
    for (const network of networks) {
      console.log(`\n📡 尝试 ${network.toUpperCase()} 网络:`);
      const result = await testGeckoTerminalAPI(normalizedAddress, network);
      
      if (result) {
        console.log(`✅ 在 ${network.toUpperCase()} 网络找到代币!`);
        return result;
      } else {
        console.log(`❌ 在 ${network.toUpperCase()} 网络未找到`);
      }
      
      // 避免API限制
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n❌ 所有网络都未找到代币');
  return null;
}

// 运行测试
async function runTest() {
  console.log('🧪 调试 XDOG 代币搜索问题');
  console.log('=' .repeat(60));
  
  await simulateSearch(XDOG_ADDRESS);
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 测试完成');
}

runTest().catch(console.error);
