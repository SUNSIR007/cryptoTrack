'use client';

interface ChartControlsProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const periods = [
  { value: '7', label: '7天' },
  { value: '30', label: '30天' },
  { value: '90', label: '90天' }
];

export default function ChartControls({ selectedPeriod, onPeriodChange }: ChartControlsProps) {
  return (
    <div className="flex space-x-1 bg-gray-100 dark:bg-black rounded-lg p-1 border dark:border-gray-700">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors duration-200 ${
            selectedPeriod === period.value
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
