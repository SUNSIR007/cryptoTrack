'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // 检查是否是扩展冲突相关的错误
    if (error.message.includes('solana') ||
        error.message.includes('Cannot assign to read only property') ||
        error.message.includes('phantom') ||
        error.message.includes('wallet')) {
      console.warn('检测到钱包扩展相关错误');
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isExtensionError = this.state.error?.message.includes('solana') ||
                              this.state.error?.message.includes('Cannot assign to read only property') ||
                              this.state.error?.message.includes('phantom') ||
                              this.state.error?.message.includes('wallet');

      return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <h3 className="text-red-800 dark:text-red-200 font-medium mb-2">
            {isExtensionError ? '扩展冲突错误' : '出现错误'}
          </h3>
          <p className="text-red-600 dark:text-red-400 text-sm mb-3">
            {isExtensionError
              ? '检测到浏览器扩展冲突，可能是钱包扩展导致的。'
              : '组件加载失败，请刷新页面重试'
            }
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
