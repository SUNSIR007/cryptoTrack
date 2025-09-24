'use client';

import { AlertTriangle, Info, XCircle } from 'lucide-react';
import { getCoinCountWarning, COIN_LIMITS } from '@/lib/userCoins';

interface CoinCountWarningProps {
  userCoins: string[];
  className?: string;
}

export default function CoinCountWarning({ userCoins, className = '' }: CoinCountWarningProps) {
  const warning = getCoinCountWarning(userCoins);

  if (!warning.hasWarning) {
    return null;
  }

  const getIcon = () => {
    switch (warning.level) {
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getColorClasses = () => {
    switch (warning.level) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className={`rounded-lg border p-3 ${getColorClasses()} ${className}`}>
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {warning.message}
          </p>
          {warning.level === 'error' && (
            <p className="text-xs mt-1 opacity-80">
              请删除一些代币后再添加新的，或考虑使用自定义监控列表功能。
            </p>
          )}
          {warning.level === 'warning' && (
            <p className="text-xs mt-1 opacity-80">
              建议保持在 {COIN_LIMITS.WARNING_THRESHOLD} 个代币以内以获得最佳性能。
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
