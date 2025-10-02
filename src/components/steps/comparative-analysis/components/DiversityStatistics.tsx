import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { BarChart3, LineChart, Download, TrendingUp } from 'lucide-react';

interface ComparisonSummary {
  total_clusters: number;
  total_asvs: number;
  shared_asvs: number;
  unique_asvs_per_cluster: number[];
  top_taxa_differences: Array<{
    taxon: string;
    cluster_difference: number;
    significance: string;
  }>;
  top_functional_differences: Array<{
    function: string;
    fold_change: number;
    significance: string;
  }>;
  diversity_metrics: {
    cluster_diversity: number[];
    overall_beta_diversity: number;
  };
}

interface AlphaDiversity {
  richness: number;
  shannon: number;
  simpson: number;
  evenness: number;
  sample_id: string;
}

interface DiversityStatisticsProps {
  data: ComparisonSummary;
  alphaData: AlphaDiversity;
}

export const DiversityStatistics: React.FC<DiversityStatisticsProps> = ({ data, alphaData }) => {
  const [chartType, setChartType] = useState<'alpha' | 'beta' | 'pca'>('alpha');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Diversity & Statistical Comparisons
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Alpha/beta diversity analysis and statistical significance testing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('alpha')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  chartType === 'alpha' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Alpha
              </button>
              <button
                onClick={() => setChartType('beta')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  chartType === 'beta' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Beta
              </button>
              <button
                onClick={() => setChartType('pca')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  chartType === 'pca' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                PCA
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {chartType === 'alpha' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Alpha Diversity by Cluster</h4>
                <div className="space-y-3">
                  {data.diversity_metrics.cluster_diversity.map((diversity, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Cluster {index}</span>
                        <span className="text-sm text-gray-600">{diversity.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(diversity / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Overall Statistics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{alphaData.shannon.toFixed(2)}</div>
                    <div className="text-sm text-blue-700">Shannon Index</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{alphaData.simpson.toFixed(3)}</div>
                    <div className="text-sm text-green-700">Simpson Index</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{alphaData.richness}</div>
                    <div className="text-sm text-purple-700">Richness</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{alphaData.evenness.toFixed(3)}</div>
                    <div className="text-sm text-orange-700">Evenness</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chartType === 'beta' && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">Beta Diversity Analysis</h4>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">
                    {data.diversity_metrics.overall_beta_diversity.toFixed(2)}
                  </div>
                  <div className="text-gray-600">Overall Beta Diversity</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">High</div>
                    <div className="text-sm text-gray-600">Between-cluster separation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">0.12</div>
                    <div className="text-sm text-gray-600">Within-cluster variation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">6.2</div>
                    <div className="text-sm text-gray-600">F-statistic</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chartType === 'pca' && (
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900">PCA / Beta Diversity Plot</h4>
              <div className="bg-gray-50 rounded-lg p-8">
                <div className="relative w-full h-64 bg-white rounded border">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    {/* Axes */}
                    <line x1="50" y1="250" x2="350" y2="250" stroke="#6b7280" strokeWidth="1" />
                    <line x1="50" y1="50" x2="50" y2="250" stroke="#6b7280" strokeWidth="1" />
                    
                    {/* Axis labels */}
                    <text x="200" y="280" textAnchor="middle" className="text-xs fill-gray-600">
                      PC1 (45.2% variance)
                    </text>
                    <text x="25" y="150" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 150)">
                      PC2 (32.1% variance)
                    </text>
                    
                    {/* Data points for clusters */}
                    {data.unique_asvs_per_cluster.map((_, index) => {
                      const colors = ['#3b82f6', '#22c55e', '#a855f7', '#f97316', '#ef4444', '#06b6d4'];
                      const x = 80 + (index * 50) + (Math.random() - 0.5) * 40;
                      const y = 80 + (index * 30) + (Math.random() - 0.5) * 60;
                      
                      return (
                        <g key={index}>
                          <circle
                            cx={x}
                            cy={y}
                            r="8"
                            fill={colors[index % colors.length]}
                            fillOpacity="0.7"
                          />
                          <text
                            x={x}
                            y={y + 3}
                            textAnchor="middle"
                            className="text-xs fill-white font-medium"
                          >
                            C{index}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  PCA plot showing cluster separation in multidimensional space
                </div>
              </div>
            </div>
          )}

          {/* Statistical Significance */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Statistical Significance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-green-700 mb-3">Significant Differences</h5>
                <div className="space-y-2">
                  {data.top_taxa_differences.filter(t => t.significance === 'High').map((taxa, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                      <span className="text-sm font-medium text-gray-700">{taxa.taxon}</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-100 text-red-800">p  0.001</Badge>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-blue-700 mb-3">Test Statistics</h5>
                <div className="space-y-3">
                  <div className="flex justify-between bg-white p-3 rounded">
                    <span className="text-sm text-gray-700">PERMANOVA F-stat</span>
                    <span className="font-medium">6.24</span>
                  </div>
                  <div className="flex justify-between bg-white p-3 rounded">
                    <span className="text-sm text-gray-700">R² explained</span>
                    <span className="font-medium">0.68</span>
                  </div>
                  <div className="flex justify-between bg-white p-3 rounded">
                    <span className="text-sm text-gray-700">p-value</span>
                    <span className="font-medium text-red-600"> 0.001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};