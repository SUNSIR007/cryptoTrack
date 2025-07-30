'use client';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          测试页面
        </h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            系统状态检查
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">React 组件</span>
              <span className="text-green-600 dark:text-green-400">✓ 正常</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">Tailwind CSS</span>
              <span className="text-green-600 dark:text-green-400">✓ 正常</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-800 dark:text-green-200">TypeScript</span>
              <span className="text-green-600 dark:text-green-400">✓ 正常</span>
            </div>
          </div>
          
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
