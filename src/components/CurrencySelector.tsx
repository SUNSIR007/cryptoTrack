'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Check } from 'lucide-react';
import { currencyManager, currencies, Currency } from '@/lib/currency';

export default function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencyManager.getCurrentCurrency());

  useEffect(() => {
    const unsubscribe = currencyManager.addListener((currency) => {
      setCurrentCurrency(currency);
    });

    return unsubscribe;
  }, []);

  const handleCurrencyChange = (currencyCode: string) => {
    currencyManager.setCurrency(currencyCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-800 active:bg-gray-400 dark:active:bg-gray-700 transition-colors duration-200 shadow-lg border dark:border-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
        title={`当前货币: ${currentCurrency.name}`}
      >
        <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 货币选择面板 */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                选择货币单位
              </h3>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  {/* 货币符号 */}
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
                      {currency.symbol}
                    </span>
                  </div>
                  
                  {/* 货币信息 */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {currency.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {currency.code.toUpperCase()}
                    </div>
                  </div>
                  
                  {/* 选中状态 */}
                  {currentCurrency.code === currency.code && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                货币设置会自动保存
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
