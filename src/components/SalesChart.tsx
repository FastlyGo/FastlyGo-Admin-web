import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  data?: {
    labels: string[];
    values: number[];
  };
  className?: string;
}

export const SalesChart = ({ data, className = '' }: SalesChartProps) => {
  const defaultData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [1200, 1500, 900, 1800, 2100, 2800, 2400]
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Sales',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        color: '#1A202C',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E2E8F0',
        },
        ticks: {
          color: '#64748B',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748B',
        },
      },
    },
  };

  const chartConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Sales',
        data: chartData.values,
        backgroundColor: 'rgba(0, 212, 170, 0.8)',
        borderColor: '#00D4AA',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
      <Bar options={options} data={chartConfig} />
    </div>
  );
};