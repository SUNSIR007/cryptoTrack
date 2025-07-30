'use client';

import { useState, useEffect } from 'react';
import { Clock, Check } from 'lucide-react';
import { timezoneManager, timezones, Timezone } from '@/lib/timezone';

export default function TimezoneSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTimezone, setCurrentTimezone] = useState<Timezone>(timezoneManager.getCurrentTimezone());
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const unsubscribe = timezoneManager.addListener((timezone) => {
      setCurrentTimezone(timezone);
    });

    return unsubscribe;
  }, []);

  // 更新当前时间
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(timezoneManager.getCurrentTime());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [currentTimezone]);

  const handleTimezoneChange = (timezoneId: string) => {
    timezoneManager.setTimezone(timezoneId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-800 active:bg-gray-400 dark:active:bg-gray-700 transition-colors duration-200 shadow-lg border dark:border-gray-700 min-w-[44px] min-h-[44px] flex items-center justify-center"
        title={`当前时区: ${currentTimezone.name}\n${currentTime}`}
      >
        <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 时区选择面板 */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                选择时区
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                当前时间: {currentTime}
              </p>
            </div>
            
            <div className="p-2 max-h-80 overflow-y-auto">
              {timezones.map((timezone) => (
                <button
                  key={timezone.id}
                  onClick={() => handleTimezoneChange(timezone.id)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                >
                  {/* 时区信息 */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {timezone.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {timezone.city} • {timezone.offset}
                    </div>
                  </div>
                  
                  {/* 选中状态 */}
                  {currentTimezone.id === timezone.id && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                时区设置会自动保存
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
