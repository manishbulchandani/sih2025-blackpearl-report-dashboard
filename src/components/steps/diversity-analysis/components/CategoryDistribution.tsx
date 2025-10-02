import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { PieChart, BarChart3, Download } from 'lucide-react';

interface FunctionalSummary {
  total_asvs_annotated: number;
  annotation_coverage: number;
  pathways_detected: number;
  top_categories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  functional_diversity: {
    unique_functions: number;
    functions_per_cluster: number[];
  };
}

interface CategoryDistributionProps {
  data: FunctionalSummary;
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ data }) => {
  const [viewType, setViewType] = useState<'pie' | 'bar'>('pie');

  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-orange-500',
    'bg-red-500'
  ];

  const total = data.top_categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Functional Category Distribution
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Breakdown of functional annotations by category
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('pie')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'pie' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PieChart className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewType('bar')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'bar' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chart Visualization */}
          <div className="flex items-center justify-center">
            {viewType === 'pie' ? (
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {data.top_categories.map((category, index) => {
                    const prevPercentages = data.top_categories
                      .slice(0, index)
                      .reduce((sum, cat) => sum + cat.percentage, 0);
                    
                    const radius = 80;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -(prevPercentages / 100) * circumference;
                    
                    return (
                      <circle
                        key={index}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke={colors[index]?.replace('bg-', '#') || '#6b7280'}
                        strokeWidth="20"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 hover:stroke-width-[25]"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{total}</div>
                    <div className="text-sm text-gray-500">Total Functions</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-3">
                {data.top_categories.map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{category.category}</span>
                      <span className="text-gray-500">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${colors[index]}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend and Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 mb-3">Category Breakdown</h4>
            <div className="space-y-3">
              {data.top_categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${colors[index]} flex-shrink-0`} />
                    <div>
                      <div className="font-medium text-gray-900">{category.category}</div>
                      <div className="text-sm text-gray-500">{category.count} functions</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {category.percentage}%
                  </Badge>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Summary Statistics</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-600">Total Categories:</span>
                  <div className="font-semibold text-blue-900">{data.top_categories.length}</div>
                </div>
                <div>
                  <span className="text-blue-600">Most Abundant:</span>
                  <div className="font-semibold text-blue-900">{data.top_categories[0]?.category}</div>
                </div>
                <div>
                  <span className="text-blue-600">Coverage:</span>
                  <div className="font-semibold text-blue-900">{data.annotation_coverage.toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-blue-600">Total Functions:</span>
                  <div className="font-semibold text-blue-900">{data.functional_diversity.unique_functions}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};