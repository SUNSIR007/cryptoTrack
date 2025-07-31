'use client';

import { useState } from 'react';
import { searchAndGetTokenPrice, getTokenPriceFromDexScreener, getTokenPriceFromJupiter } from '@/lib/api';

export default function TestV2EXPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testV2EXPrice = async () => {
    setLoading(true);
    setResult(null);
    setLogs([]);
    
    addLog('开始测试V2EX价格获取...');
    
    try {
      const v2exAddress = '9raUVuzeWUk53co63M4WXLWPWE4Xc6Lpn7RS9dnkpump';
      addLog(`V2EX代币地址: ${v2exAddress}`);
      
      // 测试DexScreener
      addLog('测试DexScreener API...');
      const dexResult = await getTokenPriceFromDexScreener(v2exAddress);
      addLog(`DexScreener结果: ${dexResult ? '成功' : '失败'}`);
      if (dexResult) {
        addLog(`价格: $${dexResult.current_price}`);
      }
      
      // 测试Jupiter
      addLog('测试Jupiter API...');
      const jupiterResult = await getTokenPriceFromJupiter(v2exAddress);
      addLog(`Jupiter结果: ${jupiterResult ? '成功' : '失败'}`);
      if (jupiterResult) {
        addLog(`价格: $${jupiterResult.current_price}`);
      }
      
      // 测试综合搜索
      addLog('测试综合搜索...');
      const searchResult = await searchAndGetTokenPrice('v2ex');
      addLog(`综合搜索结果: ${searchResult ? '成功' : '失败'}`);
      
      setResult({
        dexScreener: dexResult,
        jupiter: jupiterResult,
        search: searchResult
      });
      
    } catch (error) {
      addLog(`错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          V2EX价格测试页面
        </h1>
        
        <div className="space-y-6">
          <button
            onClick={testV2EXPrice}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium"
          >
            {loading ? '测试中...' : '测试V2EX价格获取'}
          </button>
          
          {/* 日志显示 */}
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            <h3 className="text-white mb-2">控制台日志:</h3>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
          
          {/* 结果显示 */}
          {result && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">测试结果:</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-blue-600">DexScreener:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.dexScreener, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-600">Jupiter:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.jupiter, null, 2)}
                  </pre>
                </div>
                
                <div>
                  <h4 className="font-medium text-purple-600">综合搜索:</h4>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                    {JSON.stringify(result.search, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
