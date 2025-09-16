import { useEffect, useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  displayValue: string;
}

interface CustomBarChartProps {
  data: ChartData[];
  title?: string;
  subtitle?: string;
  maxValue?: number;
  className?: string;
}

export const CustomBarChart = ({
  data,
  title = "Ventas Semanales",
  subtitle = "Últimos 7 días",
  maxValue,
  className = ""
}: CustomBarChartProps) => {
  const [animated, setAnimated] = useState(false);

  const chartMaxValue = maxValue || Math.max(...data.map(d => d.value));

  // Generate Y-axis labels
  const yAxisLabels = [
    `€${(chartMaxValue / 1000).toFixed(0)}k`,
    `€${((chartMaxValue * 0.75) / 1000).toFixed(1)}k`,
    `€${((chartMaxValue * 0.5) / 1000).toFixed(1)}k`,
    '€0'
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="text-center mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>

      <div className="relative h-48 mx-4">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[75, 50, 25].map((percentage) => (
            <div
              key={percentage}
              className="w-full h-px bg-gray-100"
              style={{ bottom: `${percentage}%` }}
            />
          ))}
        </div>

        {/* Chart structure */}
        <div className="absolute left-0 right-8 bottom-7 top-0 border-l-2 border-b-2 border-gray-300" />

        {/* Y-axis labels */}
        <div className="absolute -left-12 top-0 bottom-7 flex flex-col justify-between text-xs text-gray-600 font-medium">
          {yAxisLabels.map((label, index) => (
            <div key={index} className="flex items-center h-5">
              {label}
            </div>
          ))}
        </div>

        {/* Bars container */}
        <div className="absolute left-0 right-8 bottom-7 top-0 flex items-end justify-between gap-1">
          {data.map((item, index) => {
            const height = (item.value / chartMaxValue) * 100;
            return (
              <div
                key={index}
                className="relative flex-1 h-full flex items-end group min-w-0"
              >
                {/* Background bar */}
                <div className="absolute bottom-0 w-full h-full bg-teal-50 rounded-t opacity-20" />

                {/* Data bar */}
                <div
                  className="w-full bg-gradient-to-t from-teal-400 to-teal-300 rounded-t transition-all duration-700 ease-out hover:scale-105 hover:shadow-lg hover:shadow-teal-500/30 relative z-10"
                  style={{
                    height: animated ? `${height}%` : '0%'
                  }}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                    {item.displayValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-0 right-8 bottom-0 h-7 flex justify-between items-center text-xs text-gray-600 font-medium">
          {data.map((item, index) => (
            <span key={index} className="text-center flex-1 min-w-0">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};