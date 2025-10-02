import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
// import { Badge } from '../../../shared/Badge';
import { Grid3X3, BarChart3, Download } from 'lucide-react';

interface ClusterData {
  asv_id: string;
  cluster_id: number;
  similarity_score: number;
  taxonomic_assignment: string;
  umap_x: number;
  umap_y: number;
}

interface TaxonomicData {
  asv_id: string;
  similarity_score: number;
  confidence: string;
  taxonomic_assignment: string;
  best_reference: string;
}

interface TaxonomicComparisonProps {
  clusterData: ClusterData[];
  taxonomicData: TaxonomicData[];
}

export const TaxonomicComparison: React.FC<TaxonomicComparisonProps> = ({ 
  clusterData, 
  taxonomicData 
}) => {
  const [viewType, setViewType] = useState<'heatmap' | 'bar'>('heatmap');
  const [taxonomicLevel, setTaxonomicLevel] = useState<'reference' | 'assignment'>('reference');

  // Process data for comparison
  const comparisonData = useMemo(() => {
    const clusters = Array.from(new Set(
      clusterData.filter(d => d.cluster_id >= 0).map(d => d.cluster_id)
    )).sort((a, b) => a - b);

    // Extract taxonomic groups from references
    const getTaxonomicGroup = (item: TaxonomicData) => {
      if (taxonomicLevel === 'reference') {
        return item.best_reference.split('_')[0] || 'Unknown';
      }
      return item.taxonomic_assignment === 'unassigned' ? 'Unassigned' : item.taxonomic_assignment;
    };

    // Build taxa abundance matrix
    const taxaMatrix: { [key: string]: { [key: number]: number } } = {};
    
    clusters.forEach(clusterId => {
      const clusterASVs = clusterData.filter(d => d.cluster_id === clusterId);
      
      clusterASVs.forEach(asv => {
        const taxonomicInfo = taxonomicData.find(t => t.asv_id === asv.asv_id);
        if (taxonomicInfo) {
          const taxon = getTaxonomicGroup(taxonomicInfo);
          
          if (!taxaMatrix[taxon]) {
            taxaMatrix[taxon] = {};
            clusters.forEach(c => taxaMatrix[taxon][c] = 0);
          }
          taxaMatrix[taxon][clusterId] += 1;
        }
      });
    });

    // Convert to array format and calculate percentages
    const matrixData = Object.entries(taxaMatrix).map(([taxon, clusterCounts]) => {
      const totalCounts = Object.values(clusterCounts).reduce((sum, count) => sum + count, 0);
      const percentages = Object.fromEntries(
        Object.entries(clusterCounts).map(([clusterId, count]) => [
          clusterId, 
          totalCounts > 0 ? (count / totalCounts) * 100 : 0
        ])
      );
      
      return {
        taxon,
        clusterCounts,
        percentages,
        total: totalCounts
      };
    }).filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 taxa

    return { clusters, matrixData };
  }, [clusterData, taxonomicData, taxonomicLevel]);

  const maxCount = Math.max(
    ...comparisonData.matrixData.flatMap(item => 
      Object.values(item.clusterCounts)
    )
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Taxonomic Comparison
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Taxa abundance comparison across clusters with differential analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={taxonomicLevel}
              onChange={(e) => setTaxonomicLevel(e.target.value as 'reference' | 'assignment')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="reference">By Reference</option>
              <option value="assignment">By Assignment</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
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
        <div className="space-y-6">
          {viewType === 'heatmap' ? (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Taxa × Cluster Heatmap</h4>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="grid gap-1 text-xs" style={{ gridTemplateColumns: `200px repeat(${comparisonData.clusters.length}, 80px)` }}>
                    {/* Header row */}
                    <div className="font-medium text-gray-700 p-2">Taxon</div>
                    {comparisonData.clusters.map(clusterId => (
                      <div key={clusterId} className="text-center font-medium text-gray-700 p-2">
                        Cluster {clusterId}
                      </div>
                    ))}
                    
                    {/* Data rows */}
                    {comparisonData.matrixData.map(item => (
                      <React.Fragment key={item.taxon}>
                        <div className="text-xs font-medium text-gray-700 p-2 truncate border-r border-gray-200">
                          {item.taxon}
                        </div>
                        {comparisonData.clusters.map(clusterId => {
                          const count = item.clusterCounts[clusterId] || 0;
                          const intensity = maxCount > 0 ? count / maxCount : 0;
                          
                          return (
                            <div
                              key={clusterId}
                              className="p-2 rounded text-center text-xs font-medium border border-gray-100"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                color: intensity > 0.5 ? 'white' : 'black'
                              }}
                              title={`${item.taxon} - Cluster ${clusterId}: ${count} ASVs`}
                            >
                              {count}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Heatmap Legend */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Low (0)</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map(opacity => (
                    <div
                      key={opacity}
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                    />
                  ))}
                </div>
                <span>High ({maxCount})</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Taxonomic Abundance by Cluster</h4>
              <div className="space-y-4">
                {comparisonData.matrixData.slice(0, 6).map(item => (
                  <div key={item.taxon} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-700">{item.taxon}</span>
                      <span className="text-sm text-gray-500">{item.total} total ASVs</span>
                    </div>
                    <div className="flex gap-1 h-6">
                      {comparisonData.clusters.map((clusterId, index) => {
                        const count = item.clusterCounts[clusterId] || 0;
                        const percentage = item.total > 0 ? (count / item.total) * 100 : 0;
                        const colors = [
                          'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
                          'bg-red-500', 'bg-pink-500', 'bg-indigo-500', 'bg-yellow-500',
                          'bg-gray-500', 'bg-teal-500', 'bg-cyan-500'
                        ];
                        
                        return (
                          <div
                            key={clusterId}
                            className={`${colors[index % colors.length]} rounded-sm flex items-center justify-center text-white text-xs font-medium`}
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                            title={`Cluster ${clusterId}: ${count} ASVs (${percentage.toFixed(1)}%)`}
                          >
                            {percentage > 10 ? count : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Most Abundant</h5>
              <div className="text-lg font-bold text-blue-600">
                {comparisonData.matrixData[0]?.taxon || 'N/A'}
              </div>
              <div className="text-sm text-blue-700">
                {comparisonData.matrixData[0]?.total || 0} ASVs
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Most Diverse Cluster</h5>
              <div className="text-lg font-bold text-green-600">
                Cluster {comparisonData.clusters.length > 0 ? 
                  comparisonData.clusters.reduce((max, clusterId) => {
                    const diversity = comparisonData.matrixData.filter(item => 
                      item.clusterCounts[clusterId] > 0
                    ).length;
                    const maxDiversity = comparisonData.matrixData.filter(item => 
                      item.clusterCounts[max] > 0
                    ).length;
                    return diversity > maxDiversity ? clusterId : max;
                  }, comparisonData.clusters[0]) : 'N/A'
                }
              </div>
              <div className="text-sm text-green-700">
                Multiple taxa
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">Total Taxa</h5>
              <div className="text-lg font-bold text-purple-600">
                {comparisonData.matrixData.length}
              </div>
              <div className="text-sm text-purple-700">
                Detected across clusters
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};