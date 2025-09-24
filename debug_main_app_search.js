// 调试主应用搜索逻辑
// 运行: node debug_main_app_search.js

const testAddress = '0x0cc24c51bf89c00c5affbfcf5e856c25ecbdb48e';

console.log('🧪 调试主应用搜索逻辑');
console.log('测试地址:', testAddress);
console.log('=' .repeat(60));

// 模拟主应用的搜索逻辑
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

function detectTokenAddressType(address) {
  // Solana地址
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return { isValid: true, network: 'solana', networkName: 'Solana' };
  }

  // 标准化EVM地址
  const normalizedAddress = normalizeEVMAddress(address);

  // EVM地址（以太坊、BSC、OKX等）
  if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    return { isValid: true, network: 'evm', networkName: 'EVM (Ethereum/BSC/OKX)' };
  }

  return { isValid: false };
}

// 测试主应用的逻辑
console.log('\n1. 地址检测:');
const addressInfo = detectTokenAddressType(testAddress);
console.log('检测结果:', addressInfo);

if (addressInfo.isValid) {
  console.log('\n2. 地址标准化:');
  const normalizedQuery = addressInfo.network === 'evm' ? normalizeEVMAddress(testAddress) : testAddress;
  console.log('原始地址:', testAddress);
  console.log('标准化后:', normalizedQuery);
  console.log('是否相同:', testAddress === normalizedQuery);
  
  console.log('\n3. 模拟API调用:');
  console.log('将调用 searchAndGetTokenPrice 函数，参数:', normalizedQuery);
  
  // 测试API调用
  testAPICall(normalizedQuery);
} else {
  console.log('❌ 地址检测失败');
}

async function testAPICall(address) {
  try {
    console.log('\n📡 测试API调用...');
    const response = await fetch('http://localhost:3005/api/test-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: address })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API调用成功:', data.success);
    
    if (data.success && data.data) {
      console.log('代币信息:');
      console.log('- ID:', data.data.id);
      console.log('- 名称:', data.data.name);
      console.log('- 符号:', data.data.symbol);
      console.log('- 价格:', data.data.current_price);
      console.log('- 网络:', data.data.dexscreener_data?.chainId || 'unknown');
    } else {
      console.log('❌ API返回失败:', data.error);
    }
  } catch (error) {
    console.error('❌ API调用失败:', error.message);
  }
}
