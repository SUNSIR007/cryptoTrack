'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { PricePoint } from '../types/crypto';
import { formatPrice } from '../lib/api';

interface PriceChartProps {
  data: PricePoint[];
  symbol: string;
  isPositive: boolean;
  period: string;
}

export default function PriceChart({ data, symbol, isPositive, period }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p className="text-sm">暂无图表数据</p>
      </div>
    );
  }

  // 格式化数据用于图表显示
  const chartData = data.map(point => {
    const date = new Date(point.timestamp);
    return {
      timestamp: point.timestamp,
      price: point.price,
      // 格式化时间显示
      time: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    };
  });

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const timestamp = data.payload.timestamp;
      const date = new Date(timestamp);

      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return null;
      }

      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {date.toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })} {date.toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatPrice(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // 计算价格范围以优化Y轴显示
  const prices = data.map(point => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const padding = priceRange * 0.1; // 添加10%的上下边距
  const yAxisMin = Math.max(0, minPrice - padding);
  const yAxisMax = maxPrice + padding;

  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={false}
          />
          <YAxis
            hide
            domain={[yAxisMin, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
              fill: isPositive ? '#10b981' : '#ef4444',
              stroke: '#fff',
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
