'use client';

import { useEffect, useState } from 'react';
import { fetchPriceHistory } from '@/lib/api';

export default function DebugPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const history = await fetchPriceHistory('bitcoin', 7);
        setData(history.slice(0, 3)); // 只显示前3个数据点
      } catch (error) {
        console.error('Error:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          调试页面 - 时间戳测试
        </h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            API数据测试
          </h2>
          
          {data.map((point, index) => {
            const date = new Date(point.timestamp);
            return (
              <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-gray-900 dark:text-white">
                  <strong>原始时间戳:</strong> {point.timestamp}
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>转换后日期:</strong> {date.toString()}
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>格式化日期:</strong> {date.toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit'
                  })} {date.toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-900 dark:text-white">
                  <strong>价格:</strong> ${point.price}
                </p>
              </div>
            );
          })}
          
          <div className="mt-6">
            <a 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              返回主页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
