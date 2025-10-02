import React, { useMemo } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ClusterData {
  asv_id: string;
  best_reference: string;
  similarity_score: number;
  confidence: string;
  taxonomic_assignment: string;
  novelty_candidate: boolean;
  cluster_id: number;
  umap_x: number;
  umap_y: number;
}

interface ClusterVisualizationProps {
  clusterData: ClusterData[];
}

const ClusterVisualization: React.FC<ClusterVisualizationProps> = ({ clusterData }) => {
  const visualizationData = useMemo(() => {
    if (!clusterData.length) return [];

    // Get color palette for clusters
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];

    return clusterData.map(point => ({
      x: point.umap_x,
      y: point.umap_y,
      cluster_id: point.cluster_id,
      asv_id: point.asv_id,
      novelty_candidate: point.novelty_candidate,
      similarity_score: point.similarity_score,
      color: colors[point.cluster_id % colors.length]
    }));
  }, [clusterData]);

  const clusterGroups = useMemo(() => {
    const groups: Record<number, typeof visualizationData> = {};
    visualizationData.forEach(point => {
      if (!groups[point.cluster_id]) {
        groups[point.cluster_id] = [];
      }
      groups[point.cluster_id].push(point);
    });
    return groups;
  }, [visualizationData]);

  if (!clusterData.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No visualization data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* UMAP Scatter Plot */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">UMAP Cluster Visualization</h3>
          <p className="text-sm text-gray-600 mt-1">
            Two-dimensional projection of ASV clusters in UMAP space
          </p>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={600}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                domain={['dataMin - 1', 'dataMax + 1']}
                label={{ value: 'UMAP 1', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                domain={['dataMin - 1', 'dataMax + 1']}
                label={{ value: 'UMAP 2', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  name === 'x' ? `UMAP 1: ${value.toFixed(2)}` : `UMAP 2: ${value.toFixed(2)}`,
                  ''
                ]}
                labelFormatter={(_label: any, payload: any) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return [
                      `ASV: ${data.asv_id}`,
                      `Cluster: ${data.cluster_id}`,
                      `Similarity: ${(data.similarity_score * 100).toFixed(1)}%`,
                      `Novelty: ${data.novelty_candidate ? 'Yes' : 'No'}`
                    ].join(' | ');
                  }
                  return '';
                }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              
              {/* Render each cluster as a separate scatter series */}
              {Object.entries(clusterGroups).map(([clusterId, points]) => (
                <Scatter
                  key={clusterId}
                  name={`Cluster ${clusterId}`}
                  data={points}
                  fill={points[0]?.color || '#3B82F6'}
                  fillOpacity={0.7}
                  strokeWidth={1}
                  stroke={points[0]?.color || '#3B82F6'}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cluster Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-md font-semibold text-gray-900 mb-3">Cluster Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {Object.entries(clusterGroups).slice(0, 24).map(([clusterId, points]) => (
            <div key={clusterId} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: points[0]?.color || '#3B82F6' }}
              />
              <span className="text-xs text-gray-700">
                Cluster {clusterId} ({points.length})
              </span>
            </div>
          ))}
          {Object.keys(clusterGroups).length > 24 && (
            <div className="text-xs text-gray-500">
              +{Object.keys(clusterGroups).length - 24} more...
            </div>
          )}
        </div>
      </div>

      {/* Visualization Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Visualization Information</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Algorithm:</strong> UMAP (Uniform Manifold Approximation and Projection)</p>
          <p><strong>Points Displayed:</strong> {visualizationData.length} ASVs</p>
          <p><strong>Clusters Shown:</strong> {Object.keys(clusterGroups).length}</p>
          <p><strong>Novelty Candidates:</strong> {visualizationData.filter(p => p.novelty_candidate).length}</p>
          <p className="mt-2 text-xs">
            <strong>Note:</strong> Each point represents an ASV positioned based on sequence similarity. 
            Points closer together are more similar. Colors represent different clusters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClusterVisualization;