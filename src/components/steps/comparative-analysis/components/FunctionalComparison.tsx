import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { BarChart3, Grid3X3, Download, TrendingUp, TrendingDown } from 'lucide-react';

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

interface FunctionalComparisonProps {
  data: ComparisonSummary;
}

export const FunctionalComparison: React.FC<FunctionalComparisonProps> = ({ data }) => {
  const [viewType, setViewType] = useState<'heatmap' | 'bar'>('bar');
  const [pathwayType, setPathwayType] = useState<'all' | 'metabolism' | 'transport'>('all');

  // Generate mock functional comparison data based on clusters
  const functionalData = [
    { 
      pathway: 'Glycolysis/Gluconeogenesis', 
      type: 'metabolism',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 50) + 10),
      fold_change: 2.4,
      significance: 'High'
    },
    { 
      pathway: 'Citrate cycle (TCA cycle)', 
      type: 'metabolism',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 40) + 15),
      fold_change: 1.8,
      significance: 'Medium'
    },
    { 
      pathway: 'Amino acid transport', 
      type: 'transport',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 35) + 5),
      fold_change: 3.1,
      significance: 'High'
    },
    { 
      pathway: 'Oxidative phosphorylation', 
      type: 'metabolism',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 45) + 8),
      fold_change: 1.2,
      significance: 'Low'
    },
    { 
      pathway: 'Cell wall biogenesis', 
      type: 'structure',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 30) + 12),
      fold_change: 2.7,
      significance: 'High'
    },
    { 
      pathway: 'Signal transduction', 
      type: 'signaling',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 25) + 18),
      fold_change: 1.9,
      significance: 'Medium'
    },
    { 
      pathway: 'Fatty acid biosynthesis', 
      type: 'metabolism',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 20) + 22),
      fold_change: 1.5,
      significance: 'Medium'
    },
    { 
      pathway: 'DNA replication', 
      type: 'replication',
      clusters: data.unique_asvs_per_cluster.map((_, i) => Math.floor(Math.random() * 15) + 25),
      fold_change: 0.8,
      significance: 'Low'
    }
  ];

  const filteredData = pathwayType === 'all' ? functionalData : 
    functionalData.filter(item => item.type === pathwayType);

  const maxAbundance = Math.max(...functionalData.flatMap(item => item.clusters));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Functional Comparison
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Pathway abundance and functional differences across clusters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pathwayType}
              onChange={(e) => setPathwayType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Pathways</option>
              <option value="metabolism">Metabolism</option>
              <option value="transport">Transport</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
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
              <button
                onClick={() => setViewType('heatmap')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'heatmap' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
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
          {viewType === 'bar' ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Pathway Abundance Comparison</h4>
              <div className="space-y-4">
                {filteredData.map((pathway, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-700">{pathway.pathway}</span>
                        <Badge className={`text-xs ${
                          pathway.type === 'metabolism' ? 'bg-blue-100 text-blue-800' :
                          pathway.type === 'transport' ? 'bg-green-100 text-green-800' :
                          pathway.type === 'structure' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {pathway.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {pathway.fold_change > 1 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm text-gray-600">{pathway.fold_change}x</span>
                        </div>
                        <Badge className={
                          pathway.significance === 'High' ? 'bg-red-100 text-red-800' :
                          pathway.significance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {pathway.significance}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 h-6">
                      {pathway.clusters.map((abundance, clusterIndex) => {
                        const percentage = (abundance / maxAbundance) * 100;
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
                          'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500',
                          'bg-gray-500', 'bg-teal-500', 'bg-cyan-500'
                        ];
                        
                        return (
                          <div
                            key={clusterIndex}
                            className={`${colors[clusterIndex % colors.length]} rounded-sm flex items-center justify-center text-white text-xs font-medium`}
                            style={{ width: `${Math.max(percentage, 3)}%` }}
                            title={`Cluster ${clusterIndex}: ${abundance} abundance`}
                          >
                            {percentage > 8 ? abundance : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Pathway × Cluster Heatmap</h4>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="grid gap-1 text-xs" style={{ gridTemplateColumns: `250px repeat(${data.unique_asvs_per_cluster.length}, 80px)` }}>
                    {/* Header row */}
                    <div className="font-medium text-gray-700 p-2">Pathway</div>
                    {data.unique_asvs_per_cluster.map((_, clusterIndex) => (
                      <div key={clusterIndex} className="text-center font-medium text-gray-700 p-2">
                        C{clusterIndex}
                      </div>
                    ))}
                    
                    {/* Data rows */}
                    {filteredData.map((pathway) => (
                      <React.Fragment key={pathway.pathway}>
                        <div className="text-xs font-medium text-gray-700 p-2 truncate border-r border-gray-200">
                          {pathway.pathway}
                        </div>
                        {pathway.clusters.map((abundance, clusterIndex) => {
                          const intensity = abundance / maxAbundance;
                          
                          return (
                            <div
                              key={clusterIndex}
                              className="p-2 rounded text-center text-xs font-medium border border-gray-100"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                color: intensity > 0.5 ? 'white' : 'black'
                              }}
                              title={`${pathway.pathway} - Cluster ${clusterIndex}: ${abundance}`}
                            >
                              {abundance}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Functional Differences */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Top Functional Differences</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-green-700 mb-3">Most Upregulated</h5>
                <div className="space-y-2">
                  {data.top_functional_differences
                    .filter(f => f.fold_change > 1)
                    .slice(0, 3)
                    .map((func, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                        <span className="text-sm font-medium text-gray-700">{func.function}</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">{func.fold_change.toFixed(1)}x</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-red-700 mb-3">Most Downregulated</h5>
                <div className="space-y-2">
                  {functionalData
                    .filter(f => f.fold_change < 1)
                    .slice(0, 3)
                    .map((func, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded">
                        <span className="text-sm font-medium text-gray-700">{func.pathway}</span>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">{func.fold_change.toFixed(1)}x</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};