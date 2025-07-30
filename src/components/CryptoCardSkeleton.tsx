export default function CryptoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="space-y-4">
        {/* 币种名称和图标 */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-8"></div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* 价格 */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>

        {/* 涨跌幅 */}
        <div className="flex justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
              ))}
            </div>
          </div>
          <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>

        {/* 市场数据 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-8"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-14"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-10"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-14"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
