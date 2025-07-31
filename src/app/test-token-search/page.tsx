'use client';

import { useState } from 'react';
import { searchAndGetTokenPrice, getTokenPriceFromDexScreener } from '@/lib/api';

export default function TestTokenSearchPage() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testTokenSearch = async () => {
    if (!address.trim()) {
      addLog('请输入代币地址');
      return;
    }

    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog(`开始测试代币地址搜索: ${address}`);
    
    try {
      // 检测是否为Solana代币地址
      const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
      addLog(`地址格式检测: ${isSolanaAddress ? '有效的Solana地址' : '无效的Solana地址'}`);
      
      if (!isSolanaAddress) {
        addLog('地址格式不正确，请输入有效的Solana代币地址');
        return;
      }

      // 测试searchAndGetTokenPrice函数
      addLog('调用searchAndGetTokenPrice...');
      const searchResult = await searchAndGetTokenPrice(address.trim());
      addLog(`searchAndGetTokenPrice结果: ${searchResult ? '成功' : '失败'}`);
      
      if (searchResult) {
        addLog(`代币名称: ${searchResult.name}`);
        addLog(`代币符号: ${searchResult.symbol}`);
        addLog(`当前价格: $${searchResult.current_price}`);
        setResult(searchResult);
      } else {
        // 直接测试DexScreener API
        addLog('尝试直接调用DexScreener API...');
        const dexResult = await getTokenPriceFromDexScreener(address.trim());
        addLog(`DexScreener结果: ${dexResult ? '成功' : '失败'}`);
        
        if (dexResult) {
          addLog(`代币名称: ${dexResult.name}`);
          addLog(`代币符号: ${dexResult.symbol}`);
          addLog(`当前价格: $${dexResult.current_price}`);
          setResult(dexResult);
        } else {
          addLog('所有API都无法获取代币信息');
        }
      }
      
    } catch (error) {
      addLog(`错误: ${error}`);
      console.error('测试失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const testKnownTokens = () => {
    const knownTokens = [
      '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump', // V2EX
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    ];
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">测试已知代币:</h3>
        {knownTokens.map((token, index) => (
          <button
            key={index}
            onClick={() => setAddress(token)}
            className="block w-full text-left p-2 mb-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-mono"
          >
            {token}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">代币地址搜索测试</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            代币地址:
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="输入Solana代币地址..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          />
        </div>
        
        <button
          onClick={testTokenSearch}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {loading ? '搜索中...' : '测试搜索'}
        </button>
        
        {testKnownTokens()}
      </div>

      {/* 日志显示 */}
      {logs.length > 0 && (
        <div className="bg-gray-900 text-green-400 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">执行日志:</h3>
          <div className="space-y-1 font-mono text-sm max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">搜索结果:</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>代币名称:</strong> {result.name}
            </div>
            <div>
              <strong>代币符号:</strong> {result.symbol}
            </div>
            <div>
              <strong>当前价格:</strong> ${result.current_price}
            </div>
            <div>
              <strong>24h变化:</strong> {result.price_change_percentage_24h?.toFixed(2)}%
            </div>
            <div>
              <strong>市值:</strong> ${result.market_cap?.toLocaleString()}
            </div>
            <div>
              <strong>24h交易量:</strong> ${result.total_volume?.toLocaleString()}
            </div>
          </div>
          
          {result.dexscreener_data && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">DexScreener数据:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(result.dexscreener_data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
