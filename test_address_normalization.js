// 测试地址标准化功能
function normalizeEVMAddress(address) {
  if (!address.startsWith('0x')) {
    return address;
  }
  
  // 如果地址长度不足42个字符，补充前导零
  if (address.length < 42) {
    const hexPart = address.slice(2);
    const paddedHex = hexPart.padStart(40, '0');
    return '0x' + paddedHex;
  }
  
  return address;
}

function detectTokenNetwork(address) {
  // 标准化EVM地址
  const normalizedAddress = normalizeEVMAddress(address);
  
  // EVM 地址格式检查
  if (/^0x[a-fA-F0-9]{40}$/.test(normalizedAddress)) {
    return 'evm';
  }

  return null;
}

// 测试用例
const testAddresses = [
  '0x6c24c51bf89c00c5affbfcf5e856c25ecbdb48e',  // 你提供的地址（41字符）
  '0x0cc24c51bf89c00c5affbfcf5e856c25ecbdb48e', // CoinGecko的地址（42字符）
  '0xa0b86a33e6776e681c6c5b7f4b8e8b8e8b8e8b8e', // 标准地址
  '0x1234567890abcdef1234567890abcdef12345678',   // 标准地址
  '0x123456789abcdef1234567890abcdef12345678',    // 缺少一个字符
];

console.log('🧪 测试地址标准化功能');
console.log('=' .repeat(60));

testAddresses.forEach((addr, index) => {
  console.log(`\n${index + 1}. 原始地址: ${addr}`);
  console.log(`   长度: ${addr.length}`);
  
  const normalized = normalizeEVMAddress(addr);
  console.log(`   标准化: ${normalized}`);
  console.log(`   新长度: ${normalized.length}`);
  
  const network = detectTokenNetwork(addr);
  console.log(`   检测结果: ${network || '无法识别'}`);
  
  const isValid = /^0x[a-fA-F0-9]{40}$/.test(normalized);
  console.log(`   是否有效: ${isValid ? '✅' : '❌'}`);
});

console.log('\n' + '='.repeat(60));
console.log('🎯 重点测试 XDOG 地址:');

const xdogOriginal = '0x6c24c51bf89c00c5affbfcf5e856c25ecbdb48e';
const xdogNormalized = normalizeEVMAddress(xdogOriginal);
const xdogCoinGecko = '0x0cc24c51bf89c00c5affbfcf5e856c25ecbdb48e';

console.log(`原始地址:     ${xdogOriginal}`);
console.log(`标准化地址:   ${xdogNormalized}`);
console.log(`CoinGecko地址: ${xdogCoinGecko}`);
console.log(`是否匹配:     ${xdogNormalized === xdogCoinGecko ? '❌ 不匹配' : '❌ 不匹配'}`);

// 看起来你的地址和CoinGecko的地址确实不同，不只是前导零的问题
console.log('\n🔍 详细分析:');
console.log(`你的地址十六进制部分:     ${xdogOriginal.slice(2)}`);
console.log(`CoinGecko地址十六进制部分: ${xdogCoinGecko.slice(2)}`);

// 找出不同的位置
const hex1 = xdogOriginal.slice(2).padStart(40, '0');
const hex2 = xdogCoinGecko.slice(2);
console.log(`补零后你的地址:           ${hex1}`);
console.log(`CoinGecko地址:           ${hex2}`);

let diffCount = 0;
for (let i = 0; i < 40; i++) {
  if (hex1[i] !== hex2[i]) {
    console.log(`差异位置 ${i}: '${hex1[i]}' vs '${hex2[i]}'`);
    diffCount++;
  }
}
console.log(`总共 ${diffCount} 个字符不同`);
