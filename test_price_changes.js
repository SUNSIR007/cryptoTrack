// 测试 OKX 链代币价格变化数据获取
const GeckoTerminalAPI = {
  BASE_URL: 'https://api.geckoterminal.com/api/v2'
};

const SUPPORTED_NETWORKS = {
  okx: {
    id: 'x-layer',
    name: 'X Layer (OKX)',
    coingecko_id: 'x-layer',
    address_pattern: /^0x[a-fA-F0-9]{40}$/,
    native_token: 'okb'
  }
};

async function testPriceChanges() {
  console.log('🧪 测试 OKX 链代币价格变化数据获取');
  console.log('=' .repeat(60));
  
  // 测试 XDOG 代币
  const tokenAddress = '0x0cc24c51bf89c00c5affbfcf5e856c25ecbdb48e';
  const network = 'okx';
  
  try {
    const networkConfig = SUPPORTED_NETWORKS[network];
    if (!networkConfig) {
      console.error(`不支持的网络: ${network}`);
      return;
    }

    console.log(`\n1️⃣ 测试代币: ${tokenAddress}`);
    console.log(`   网络: ${networkConfig.name} (${networkConfig.id})`);
    
    // 使用 GeckoTerminal API 获取代币信息（包含交易池数据）
    const url = `${GeckoTerminalAPI.BASE_URL}/networks/${networkConfig.id}/tokens/${tokenAddress}?include=top_pools`;
    console.log(`\n2️⃣ API 请求: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log(`❌ API响应失败: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log('\n3️⃣ 基本代币信息:');
    
    const tokenData = data.data;
    const attributes = tokenData.attributes;
    
    console.log(`   名称: ${attributes.name}`);
    console.log(`   符号: ${attributes.symbol}`);
    console.log(`   当前价格: $${attributes.price_usd}`);
    console.log(`   市值: $${attributes.market_cap_usd}`);
    
    // 从交易池数据中获取价格变化信息
    console.log('\n4️⃣ 价格变化数据:');
    
    let priceChange24h = 0;
    let priceChange7d = 0;
    
    if (data.included && data.included.length > 0) {
      console.log(`   找到 ${data.included.length} 个交易池`);
      
      // 获取主要交易池的价格变化数据
      const mainPool = data.included[0];
      console.log(`   主要交易池 ID: ${mainPool.id}`);
      
      if (mainPool && mainPool.attributes && mainPool.attributes.price_change_percentage) {
        const priceChanges = mainPool.attributes.price_change_percentage;
        
        console.log('   所有可用的价格变化数据:');
        Object.entries(priceChanges).forEach(([period, change]) => {
          console.log(`     ${period}: ${change}%`);
        });
        
        priceChange24h = parseFloat(priceChanges.h24) || 0;
        
        // 使用6小时数据估算7天变化
        if (priceChanges.h6) {
          priceChange7d = (parseFloat(priceChanges.h6) || 0) * 4;
        }
        
        console.log(`\n   ✅ 处理后的数据:`);
        console.log(`     24小时变化: ${priceChange24h}%`);
        console.log(`     7天变化(估算): ${priceChange7d}%`);
        
      } else {
        console.log('   ❌ 交易池数据中没有价格变化信息');
      }
    } else {
      console.log('   ❌ 没有找到交易池数据');
    }
    
    // 构建最终的代币数据对象
    console.log('\n5️⃣ 最终代币数据对象:');
    const cryptoData = {
      id: `gt-${network}-${tokenAddress}`,
      symbol: attributes.symbol?.toUpperCase() || 'UNKNOWN',
      name: attributes.name || attributes.symbol || 'Unknown Token',
      image: attributes.image_url || '',
      current_price: parseFloat(attributes.price_usd) || 0,
      price_change_percentage_24h: priceChange24h,
      price_change_percentage_7d: priceChange7d,
      market_cap: parseFloat(attributes.market_cap_usd) || 0,
      market_cap_rank: 0,
      total_volume: parseFloat(attributes.volume_usd?.h24) || 0,
      high_24h: 0,
      low_24h: 0,
      circulating_supply: parseFloat(attributes.normalized_total_supply) || 0,
      total_supply: parseFloat(attributes.normalized_total_supply) || parseFloat(attributes.total_supply) || 0,
      last_updated: new Date().toISOString(),
    };
    
    console.log('   代币数据:', JSON.stringify(cryptoData, null, 2));
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('🏁 测试完成');
}

// 运行测试
testPriceChanges().catch(console.error);
