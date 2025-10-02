import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { BarChart3, LineChart, TrendingUp, Download } from 'lucide-react';

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

interface AlphaDiversity {
  richness: number;
  shannon: number;
  simpson: number;
  evenness: number;
  sample_id: string;
}

interface DiversityMetricsProps {
  functionalData: FunctionalSummary;
  alphaData: AlphaDiversity;
}

export const DiversityMetrics: React.FC<DiversityMetricsProps> = ({ functionalData, alphaData }) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  // Calculate functional diversity metrics
  const functionsPerCluster = functionalData.functional_diversity.functions_per_cluster;
  const clusterSizes = [8, 11, 17, 5, 10, 15, 12, 9, 14, 7, 6]; // Mock cluster sizes
  
  // Calculate diversity-size correlation
  const diversityData = functionsPerCluster.map((functions, index) => ({
    clusterId: index,
    functionalDiversity: functions,
    clusterSize: clusterSizes[index] || 5,
    diversity_efficiency: functions / (clusterSizes[index] || 5)
  }));

  const maxFunctions = Math.max(...functionsPerCluster);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Functional Diversity Metrics
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Analysis of functional diversity across clusters and ecological metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'bar' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-2 rounded-md transition-colors ${
                  chartType === 'line' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LineChart className="h-4 w-4" />
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
          {/* Diversity Overview Cards */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Ecological Diversity Summary</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Shannon Index</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{alphaData.shannon.toFixed(2)}</div>
                <div className="text-xs text-blue-700">Species evenness: {alphaData.evenness.toFixed(3)}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Simpson Index</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{alphaData.simpson.toFixed(3)}</div>
                <div className="text-xs text-green-700">Dominance: {(1 - alphaData.simpson).toFixed(3)}</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Richness</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{alphaData.richness}</div>
                <div className="text-xs text-purple-700">Total species</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Func. Diversity</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{functionalData.functional_diversity.unique_functions}</div>
                <div className="text-xs text-orange-700">Unique functions</div>
              </div>
            </div>

            {/* Diversity Interpretation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3">Diversity Interpretation</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className={alphaData.shannon > 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {alphaData.shannon > 3 ? 'High' : 'Moderate'}
                  </Badge>
                  <span className="text-gray-700">Shannon diversity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={alphaData.evenness > 0.8 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {alphaData.evenness > 0.8 ? 'Even' : 'Uneven'}
                  </Badge>
                  <span className="text-gray-700">Community structure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={functionalData.annotation_coverage > 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {functionalData.annotation_coverage > 70 ? 'Good' : 'Limited'}
                  </Badge>
                  <span className="text-gray-700">Functional coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-6">
            <h4 className="font-medium text-gray-900">Functions per Cluster Analysis</h4>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {chartType === 'bar' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 mb-4">Functional diversity by cluster</div>
                  {diversityData.slice(0, 8).map((item) => (
                    <div key={item.clusterId} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Cluster {item.clusterId}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{item.functionalDiversity} functions</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {item.diversity_efficiency.toFixed(1)} eff
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${(item.functionalDiversity / maxFunctions) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">Diversity vs Cluster Size Correlation</div>
                  <div className="relative h-64">
                    <svg viewBox="0 0 400 200" className="w-full h-full">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line
                          key={i}
                          x1={50 + i * 75}
                          y1={20}
                          x2={50 + i * 75}
                          y2={180}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line
                          key={i}
                          x1={50}
                          y1={20 + i * 40}
                          x2={350}
                          y2={20 + i * 40}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Data points and line */}
                      <polyline
                        points={diversityData.slice(0, 8).map((item, index) => 
                          `${50 + (index * 40)},${180 - (item.functionalDiversity / maxFunctions) * 160}`
                        ).join(' ')}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      
                      {diversityData.slice(0, 8).map((item, index) => (
                        <circle
                          key={item.clusterId}
                          cx={50 + (index * 40)}
                          cy={180 - (item.functionalDiversity / maxFunctions) * 160}
                          r="4"
                          fill="#3b82f6"
                          className="hover:r-6 cursor-pointer"
                        />
                      ))}
                      
                      {/* Axis labels */}
                      <text x="200" y="195" textAnchor="middle" className="text-xs fill-gray-600">
                        Cluster Index
                      </text>
                      <text x="25" y="100" textAnchor="middle" className="text-xs fill-gray-600" transform="rotate(-90 25 100)">
                        Functions
                      </text>
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-3">Diversity Statistics</h5>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-blue-600">Avg Functions/Cluster:</span>
                  <div className="font-semibold text-blue-900">
                    {(functionsPerCluster.reduce((a, b) => a + b, 0) / functionsPerCluster.length).toFixed(1)}
                  </div>
                </div>
                <div>
                  <span className="text-blue-600">Max Diversity:</span>
                  <div className="font-semibold text-blue-900">{Math.max(...functionsPerCluster)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Min Diversity:</span>
                  <div className="font-semibold text-blue-900">{Math.min(...functionsPerCluster)}</div>
                </div>
                <div>
                  <span className="text-blue-600">CV:</span>
                  <div className="font-semibold text-blue-900">
                    {((Math.sqrt(functionsPerCluster.reduce((acc, val) => acc + Math.pow(val - (functionsPerCluster.reduce((a, b) => a + b, 0) / functionsPerCluster.length), 2), 0) / functionsPerCluster.length) / (functionsPerCluster.reduce((a, b) => a + b, 0) / functionsPerCluster.length)) * 100).toFixed(1)}%
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