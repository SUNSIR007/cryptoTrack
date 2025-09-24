# BSC 和 OKX 链代币支持测试指南

## 功能概述

本次更新为 CryptoTrack 项目添加了对 BSC (Binance Smart Chain) 链代币的支持，并为将来可能的 OKX 链支持做好了准备。

## 新增功能

### 1. 多链代币地址检测
- ✅ **Solana 地址**: `[1-9A-HJ-NP-Za-km-z]{32,44}` 格式
- ✅ **EVM 地址** (Ethereum/BSC): `0x[a-fA-F0-9]{40}` 格式
- ✅ 自动检测代币地址所属网络

### 2. GeckoTerminal API 集成
- ✅ 集成 GeckoTerminal API 用于获取 BSC 链代币数据
- ✅ 支持搜索 BSC 链上的代币
- ✅ 获取代币价格、交易量等信息

### 3. 代币数量限制
- ✅ 最大代币数量: 20 个
- ✅ 警告阈值: 15 个
- ✅ 性能建议阈值: 10 个
- ✅ 添加代币时的限制检查
- ✅ 用户友好的警告提示

### 4. UI 改进
- ✅ 代币卡片显示网络标签 (SOL/BSC/ETH)
- ✅ 网络标签颜色区分
- ✅ 代币数量警告组件
- ✅ 更新搜索占位符文本

## 测试用例

### 测试 1: BSC 代币地址检测
**测试地址**: `0x55d398326f99059fF775485246999027B3197955` (USDT on BSC)

**预期结果**:
- 系统识别为 EVM 地址
- 尝试通过 GeckoTerminal API 获取价格数据
- 显示 BSC 网络标签

### 测试 2: Solana 代币地址检测
**测试地址**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` (USDC on Solana)

**预期结果**:
- 系统识别为 Solana 地址
- 使用 DexScreener/Jupiter API 获取价格数据
- 显示 SOL 网络标签

### 测试 3: 代币数量限制
**测试步骤**:
1. 添加代币直到达到 10 个 (性能建议阈值)
2. 继续添加到 15 个 (警告阈值)
3. 尝试添加到 20 个 (最大限制)
4. 尝试添加第 21 个代币

**预期结果**:
- 10 个代币时显示性能建议
- 15 个代币时显示警告
- 20 个代币时显示错误级别警告
- 第 21 个代币添加失败，显示错误信息

### 测试 4: 多链搜索功能
**测试关键词**: "USDT", "BNB", "CAKE"

**预期结果**:
- 搜索结果包含来自不同链的代币
- BSC 链代币正确显示网络标签
- 搜索结果按相关性排序

## 支持的网络

### 当前支持
- ✅ **Ethereum**: 通过 CoinGecko API 和 GeckoTerminal API
- ✅ **BSC (Binance Smart Chain)**: 通过 GeckoTerminal API
- ✅ **Solana**: 通过 DexScreener 和 Jupiter API

### 未来支持 (架构已准备)
- 🔄 **OKX Chain**: 等待 GeckoTerminal API 支持
- 🔄 **其他 EVM 链**: 可通过配置轻松添加

## API 端点

### GeckoTerminal API
- **网络列表**: `https://api.geckoterminal.com/api/v2/networks`
- **代币搜索**: `https://api.geckoterminal.com/api/v2/search/pools`
- **代币信息**: `https://api.geckoterminal.com/api/v2/networks/{network}/tokens/{address}`

### 支持的网络 ID
- `eth`: Ethereum
- `bsc`: BNB Chain (BSC)
- `solana`: Solana

## 配置说明

### 网络配置 (src/lib/api.ts)
```typescript
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
  }
};
```

### 代币限制配置 (src/lib/userCoins.ts)
```typescript
export const COIN_LIMITS = {
  MAX_COINS: 20,
  WARNING_THRESHOLD: 15,
  PERFORMANCE_THRESHOLD: 10
};
```

## 注意事项

1. **API 限制**: GeckoTerminal API 有请求频率限制，建议合理使用缓存
2. **网络检测**: EVM 地址格式相同，无法仅通过地址区分 Ethereum 和 BSC
3. **OKX 链**: 目前 GeckoTerminal API 不支持 OKX 链，需等待官方支持
4. **性能**: 建议用户不要添加过多代币以保证最佳性能

## 错误处理

- 网络请求失败时的优雅降级
- 无效地址格式的提示
- 代币数量超限的友好提示
- API 响应异常的错误处理
