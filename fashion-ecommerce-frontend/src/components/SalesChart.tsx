"use client";

import { useState } from "react";

interface DataPoint {
  day: string;
  sales: number;
}

const salesData: DataPoint[] = [
  { day: "Mon", sales: 1200 },
  { day: "Tue", sales: 1800 },
  { day: "Wed", sales: 1400 },
  { day: "Thu", sales: 2200 },
  { day: "Fri", sales: 2800 },
  { day: "Sat", sales: 3200 },
  { day: "Sun", sales: 2600 },
];

export default function SalesChart() {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const width = 600;
  const height = 200;
  const padding = 40;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxSales = Math.max(...salesData.map(d => d.sales));
  const minSales = Math.min(...salesData.map(d => d.sales));

  const getX = (index: number) => {
    return padding + (index / (salesData.length - 1)) * chartWidth;
  };

  const getY = (sales: number) => {
    return height - padding - ((sales - minSales) / (maxSales - minSales)) * chartHeight;
  };

  const pathData = salesData
    .map((point, index) => {
      const x = getX(index);
      const y = getY(point.sales);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="relative">
      <svg width={width} height={height} className="w-full h-full">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding + (i / 4) * chartHeight;
          return (
            <line
              key={i}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Area under the line */}
        <path
          d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#areaGradient)"
        />

        {/* Main line */}
        <path
          d={pathData}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {salesData.map((point, index) => {
          const x = getX(index);
          const y = getY(point.sales);
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="6"
              fill="white"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              className="cursor-pointer transition-all duration-200 hover:r-8"
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          );
        })}

        {/* X-axis labels */}
        {salesData.map((point, index) => {
          const x = getX(index);
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {point.day}
            </text>
          );
        })}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = minSales + (i / 4) * (maxSales - minSales);
          const y = padding + (i / 4) * chartHeight;
          return (
            <text
              key={i}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              ${Math.round(value).toLocaleString()}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm z-10"
          style={{
            left: `${getX(salesData.findIndex(d => d.day === hoveredPoint.day))}px`,
            top: `${getY(hoveredPoint.sales) - 60}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="font-semibold text-gray-900">{hoveredPoint.day}</div>
          <div className="text-blue-600">${hoveredPoint.sales.toLocaleString()}</div>
        </div>
      )}
    </div>
  );
} 