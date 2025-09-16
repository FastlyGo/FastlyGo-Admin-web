import { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

export const MetricCard = ({ title, value, icon, trend, className = '' }: MetricCardProps) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      {icon && <div className="text-teal-500">{icon}</div>}
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
        <TrendingUp className="w-4 h-4" />
        {trend}
      </div>
    )}
  </div>
);