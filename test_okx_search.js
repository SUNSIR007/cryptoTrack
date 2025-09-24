// 测试 OKX 链代币搜索功能
const API_KEY = 'CG-yueBVpChwNZbHLKqQxBbqpwR'; // 你的实际API密钥

// 测试 XDOG 代币
const XDOG_CONTRACT = '0x6c24c51bf89c00c5affbfcf5e856c25ecbdb48e';

async function testOKXSearch() {
    console.log('🧪 测试 OKX 链代币搜索功能');
    console.log('=' .repeat(50));
    
    // 1. 测试 CoinGecko 直接搜索
    console.log('\n1️⃣ 测试 CoinGecko 直接搜索 XDOG:');
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/xdog?x_cg_demo_api_key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ CoinGecko 找到 XDOG:');
            console.log(`   名称: ${data.name}`);
            console.log(`   符号: ${data.symbol}`);
            console.log(`   平台:`, data.platforms);
            console.log(`   当前价格: $${data.market_data?.current_price?.usd || 'N/A'}`);
        } else {
            console.log('❌ CoinGecko 搜索失败:', response.status);
        }
    } catch (error) {
        console.log('❌ CoinGecko 搜索错误:', error.message);
    }
    
    // 2. 测试 GeckoTerminal X Layer 网络
    console.log('\n2️⃣ 测试 GeckoTerminal X Layer 网络:');
    try {
        const response = await fetch(`https://api.geckoterminal.com/api/v2/networks/x-layer/tokens/${XDOG_CONTRACT}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ GeckoTerminal 找到 XDOG:');
            console.log(`   地址: ${data.data?.attributes?.address}`);
            console.log(`   名称: ${data.data?.attributes?.name}`);
            console.log(`   符号: ${data.data?.attributes?.symbol}`);
            console.log(`   价格: $${data.data?.attributes?.price_usd || 'N/A'}`);
        } else {
            console.log('❌ GeckoTerminal 搜索失败:', response.status);
            const errorText = await response.text();
            console.log('   错误详情:', errorText);
        }
    } catch (error) {
        console.log('❌ GeckoTerminal 搜索错误:', error.message);
    }
    
    // 3. 测试 GeckoTerminal 获取 X Layer 网络上的热门代币
    console.log('\n3️⃣ 测试 GeckoTerminal X Layer 网络热门代币:');
    try {
        const response = await fetch('https://api.geckoterminal.com/api/v2/networks/x-layer/trending_pools');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ X Layer 热门池子:');
            data.data?.slice(0, 3).forEach((pool, index) => {
                console.log(`   ${index + 1}. ${pool.attributes?.name}`);
                console.log(`      地址: ${pool.attributes?.address}`);
                console.log(`      基础代币: ${pool.relationships?.base_token?.data?.id}`);
            });
        } else {
            console.log('❌ 获取热门池子失败:', response.status);
        }
    } catch (error) {
        console.log('❌ 获取热门池子错误:', error.message);
    }
    
    // 4. 测试网络检测逻辑
    console.log('\n4️⃣ 测试网络检测逻辑:');
    const address = XDOG_CONTRACT;
    const isEVM = /^0x[a-fA-F0-9]{40}$/.test(address);
    console.log(`   地址: ${address}`);
    console.log(`   是否为EVM地址: ${isEVM}`);
    console.log(`   地址长度: ${address.length}`);
    
    // 5. 测试 DexScreener 搜索
    console.log('\n5️⃣ 测试 DexScreener 搜索:');
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${XDOG_CONTRACT}`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ DexScreener 结果:');
            if (data.pairs && data.pairs.length > 0) {
                data.pairs.slice(0, 2).forEach((pair, index) => {
                    console.log(`   池子 ${index + 1}:`);
                    console.log(`     链ID: ${pair.chainId}`);
                    console.log(`     DEX: ${pair.dexId}`);
                    console.log(`     价格: $${pair.priceUsd || 'N/A'}`);
                    console.log(`     基础代币: ${pair.baseToken?.symbol}`);
                });
            } else {
                console.log('   没有找到交易对');
            }
        } else {
            console.log('❌ DexScreener 搜索失败:', response.status);
        }
    } catch (error) {
        console.log('❌ DexScreener 搜索错误:', error.message);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('🏁 测试完成');
}

// 运行测试
testOKXSearch().catch(console.error);
