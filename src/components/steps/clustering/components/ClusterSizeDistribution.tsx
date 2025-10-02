import React, { useMemo } from 'react';
import { Chart } from '../../../shared/Chart';

interface ClusterSummary {
  total_clusters: number;
  total_asvs: number;
  average_cluster_size: number;
  largest_cluster_size: number;
  smallest_cluster_size: number;
  singletons_count: number;
  cluster_sizes: Record<number, number>;
}

interface ClusterSizeDistributionProps {
  clusterSummary: ClusterSummary | null;
}

const ClusterSizeDistribution: React.FC<ClusterSizeDistributionProps> = ({ clusterSummary }) => {
  const distributionData = useMemo(() => {
    if (!clusterSummary) return [];

    // Create size bins for better visualization
    const sizeBins: Record<string, number> = {
      '1': 0,      // Singletons
      '2-5': 0,    // Small clusters
      '6-10': 0,   // Medium clusters
      '11-20': 0,  // Large clusters
      '21+': 0     // Very large clusters
    };

    Object.values(clusterSummary.cluster_sizes).forEach(size => {
      if (size === 1) {
        sizeBins['1']++;
      } else if (size <= 5) {
        sizeBins['2-5']++;
      } else if (size <= 10) {
        sizeBins['6-10']++;
      } else if (size <= 20) {
        sizeBins['11-20']++;
      } else {
        sizeBins['21+']++;
      }
    });

    return Object.entries(sizeBins).map(([range, count]) => ({
      name: range === '1' ? 'Singletons' : `${range} ASVs`,
      value: count,
      isSingleton: range === '1'
    }));
  }, [clusterSummary]);

  const topClustersData = useMemo(() => {
    if (!clusterSummary) return [];

    // Get top 10 largest clusters
    const clusters = Object.entries(clusterSummary.cluster_sizes)
      .map(([id, size]) => ({ name: `Cluster ${id}`, value: size }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return clusters;
  }, [clusterSummary]);

  if (!clusterSummary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Size Distribution */}
      <Chart
        title="Cluster Size Distribution"
        type="bar"
        data={distributionData}
        xKey="name"
        yKey="value"
        height={300}
        colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444']}
        formatTooltip={(value: any, name: string) => [`${value} clusters`, name]}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Top Clusters */}
      <Chart
        title="Top 10 Largest Clusters"
        type="bar"
        data={topClustersData}
        xKey="name"
        yKey="value"
        height={300}
        colors={['#10B981']}
        formatTooltip={(value: any, name: string) => [`${value} ASVs`, name]}
        className="bg-white rounded-lg border border-gray-200"
      />
    </div>
  );
};

export default ClusterSizeDistribution;