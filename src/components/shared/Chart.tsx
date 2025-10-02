import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart, LineChart, Line
} from 'recharts';

export interface ChartProps {
  title?: string;
  data: any[];
  type: 'bar' | 'pie' | 'area' | 'line' | 'histogram';
  xKey?: string;
  yKey?: string;
  nameKey?: string;
  valueKey?: string;
  height?: number;
  colors?: string[];
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  formatTooltip?: (value: any, name: string, props: any) => [string, string];
}

const DEFAULT_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

export const Chart: React.FC<ChartProps> = ({
  title,
  data,
  type,
  xKey = 'name',
  yKey = 'value',
  nameKey = 'name',
  valueKey = 'value',
  height = 300,
  colors = DEFAULT_COLORS,
  className = '',
  showLegend = true,
  showTooltip = true,
  formatTooltip
}) => {
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip formatter={formatTooltip} />}
            {showLegend && <Legend />}
            <Bar dataKey={yKey} fill={colors[0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry[nameKey]}: ${entry[valueKey]}`}
              outerRadius={Math.min(height / 3, 120)}
              fill="#8884d8"
              dataKey={valueKey}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={formatTooltip} />}
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip formatter={formatTooltip} />}
            {showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke={colors[0]} 
              fill={colors[0]} 
              fillOpacity={0.6} 
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip formatter={formatTooltip} />}
            {showLegend && <Legend />}
            <Line type="monotone" dataKey={yKey} stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        );

      case 'histogram':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip formatter={formatTooltip} />}
            {showLegend && <Legend />}
            <Bar dataKey={yKey} fill={colors[0]} />
          </BarChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};