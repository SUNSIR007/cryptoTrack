'use client';

import { useEffect, useState } from 'react';

interface ExtensionGuardProps {
  children: React.ReactNode;
}

export default function ExtensionGuard({ children }: ExtensionGuardProps) {
  const [hasExtensionConflict, setHasExtensionConflict] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检测和处理浏览器扩展冲突
    const detectExtensionConflicts = () => {
      try {
        // 检查是否有Solana钱包扩展
        if (typeof window !== 'undefined') {
          // 保护window.solana属性
          if (window.solana && typeof window.solana === 'object') {
            try {
              // 尝试创建一个代理来避免冲突
              const originalSolana = window.solana;
              Object.defineProperty(window, 'solana', {
                value: originalSolana,
                writable: false,
                configurable: false
              });
            } catch (error) {
              console.warn('Solana扩展冲突检测:', error);
              // 如果无法设置属性，说明可能有冲突
              setHasExtensionConflict(true);
            }
          }

          // 检查其他可能的扩展冲突
          const potentialConflicts = ['ethereum', 'web3', 'phantom'];
          potentialConflicts.forEach(prop => {
            if (window[prop as keyof Window]) {
              console.log(`检测到扩展: ${prop}`);
            }
          });
        }
      } catch (error) {
        console.error('扩展冲突检测失败:', error);
        setHasExtensionConflict(true);
      } finally {
        setIsLoading(false);
      }
    };

    // 延迟检测以避免与扩展初始化冲突
    const timer = setTimeout(detectExtensionConflicts, 100);

    return () => clearTimeout(timer);
  }, []);

  // 错误边界处理
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('solana') || event.message.includes('Cannot assign to read only property')) {
        console.warn('检测到扩展相关错误，启用兼容模式');
        setHasExtensionConflict(true);
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && typeof event.reason === 'object' && event.reason.message) {
        if (event.reason.message.includes('solana') || event.reason.message.includes('Cannot assign to read only property')) {
          console.warn('检测到扩展相关Promise错误，启用兼容模式');
          setHasExtensionConflict(true);
          event.preventDefault();
        }
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">正在加载...</p>
        </div>
      </div>
    );
  }

  if (hasExtensionConflict) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-black rounded-2xl shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            检测到浏览器扩展冲突
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            您的浏览器扩展（如Phantom、Solflare等钱包）可能与应用发生冲突。
          </p>
          
          <div className="space-y-3 text-left mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white">解决方案：</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• 尝试刷新页面</li>
              <li>• 暂时禁用钱包扩展</li>
              <li>• 使用无痕模式浏览</li>
              <li>• 清除浏览器缓存</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              刷新页面
            </button>
            
            <button
              onClick={() => {
                setHasExtensionConflict(false);
                setIsLoading(false);
              }}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
            >
              强制继续
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
