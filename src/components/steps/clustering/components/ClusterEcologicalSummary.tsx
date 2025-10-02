import React, { useMemo } from 'react';
import { DataTable } from '../../../shared/DataTable';
import type { TableColumn } from '../../../shared/DataTable';
import { Chart } from '../../../shared/Chart';
import { Badge } from '../../../shared/Badge';

interface EcologicalData {
  asv_id: string;
  total_reads: number;
  samples_present: number;
  max_sample_abundance: number;
  mean_abundance: number;
  std_abundance: number;
  prevalence: number;
  relative_abundance: number;
  cluster_id: number;
}

interface ClusterSummary {
  total_clusters: number;
  total_asvs: number;
  average_cluster_size: number;
  largest_cluster_size: number;
  smallest_cluster_size: number;
  singletons_count: number;
  cluster_sizes: Record<number, number>;
}

interface ClusterEcologicalSummaryProps {
  ecologicalData: EcologicalData[];
  clusterSummary: ClusterSummary | null;
}

const ClusterEcologicalSummary: React.FC<ClusterEcologicalSummaryProps> = ({ 
  ecologicalData, 
  clusterSummary 
}) => {
  const clusterEcological = useMemo(() => {
    if (!ecologicalData.length || !clusterSummary) return [];

    const clusterMap: Record<number, EcologicalData[]> = {};
    
    // Group ASVs by cluster
    ecologicalData.forEach(asv => {
      if (!clusterMap[asv.cluster_id]) {
        clusterMap[asv.cluster_id] = [];
      }
      clusterMap[asv.cluster_id].push(asv);
    });

    // Calculate cluster-level metrics
    return Object.entries(clusterMap).map(([clusterId, asvs]) => {
      const totalReads = asvs.reduce((sum, asv) => sum + asv.total_reads, 0);
      const relativeAbundances = asvs.map(asv => asv.relative_abundance);
      const prevalences = asvs.map(asv => asv.prevalence);
      const dominantAsv = asvs.reduce((max, asv) => 
        asv.total_reads > max.total_reads ? asv : max
      );

      return {
        cluster_id: parseInt(clusterId),
        total_reads: totalReads,
        asv_count: asvs.length,
        mean_relative_abundance: relativeAbundances.reduce((a, b) => a + b, 0) / relativeAbundances.length,
        max_relative_abundance: Math.max(...relativeAbundances),
        mean_prevalence: prevalences.reduce((a, b) => a + b, 0) / prevalences.length,
        dominant_asv: dominantAsv.asv_id
      };
    }).sort((a, b) => b.total_reads - a.total_reads);
  }, [ecologicalData, clusterSummary]);

  const abundanceDistribution = useMemo(() => {
    if (!clusterEcological.length) return [];

    return clusterEcological.slice(0, 10).map(cluster => ({
      name: `Cluster ${cluster.cluster_id}`,
      value: cluster.total_reads,
      relative_abundance: (cluster.mean_relative_abundance * 100).toFixed(3)
    }));
  }, [clusterEcological]);

  const columns: TableColumn[] = [
    {
      key: 'cluster_id',
      header: 'Cluster ID',
      sortable: true,
      render: (value: number) => (
        <Badge variant="default">Cluster {value}</Badge>
      )
    },
    {
      key: 'asv_count',
      header: 'ASV Count',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'total_reads',
      header: 'Total Reads',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'mean_relative_abundance',
      header: 'Mean Rel. Abundance',
      sortable: true,
      render: (value: number) => {
        const percentage = (value * 100).toFixed(3);
        const color = value > 0.01 ? 'text-green-600' : value > 0.001 ? 'text-yellow-600' : 'text-gray-600';
        return (
          <span className={`font-medium ${color}`}>{percentage}%</span>
        );
      }
    },
    {
      key: 'max_relative_abundance',
      header: 'Max Rel. Abundance',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm text-gray-900">{(value * 100).toFixed(3)}%</span>
      )
    },
    {
      key: 'mean_prevalence',
      header: 'Mean Prevalence',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm">{(value * 100).toFixed(1)}%</span>
          <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400"
              style={{ width: `${value * 100}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'dominant_asv',
      header: 'Dominant ASV',
      render: (value: string) => (
        <span className="text-sm font-mono text-blue-600">{value}</span>
      )
    }
  ];

  if (!ecologicalData.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No ecological data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cluster Abundance Chart */}
      <Chart
        title="Top 10 Clusters by Abundance"
        type="bar"
        data={abundanceDistribution}
        xKey="name"
        yKey="value"
        height={300}
        colors={['#10B981']}
        formatTooltip={(value: any, name: string, props: any) => [
          `${value.toLocaleString()} reads (${props.payload?.relative_abundance}%)`, 
          name
        ]}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Cluster Ecological Table */}
      <DataTable
        title="Cluster Ecological Summary"
        data={clusterEcological}
        columns={columns}
        searchPlaceholder="Search cluster..."
        downloadFilename="cluster_ecological_summary.csv"
        itemsPerPage={15}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Abundance Distribution</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>Total Reads:</strong> {ecologicalData.reduce((sum, asv) => sum + asv.total_reads, 0).toLocaleString()}</p>
            <p><strong>Most Abundant Cluster:</strong> {clusterEcological[0]?.cluster_id || 'N/A'}</p>
            <p><strong>Reads in Top Cluster:</strong> {clusterEcological[0]?.total_reads.toLocaleString() || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Cluster Diversity</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Active Clusters:</strong> {clusterEcological.length}</p>
            <p><strong>Mean Cluster Size:</strong> {clusterSummary?.average_cluster_size.toFixed(1) || 'N/A'}</p>
            <p><strong>Largest Cluster:</strong> {Math.max(...clusterEcological.map(c => c.asv_count))} ASVs</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Ecological Metrics</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p><strong>Mean Prevalence:</strong> {(clusterEcological.reduce((sum, c) => sum + c.mean_prevalence, 0) / clusterEcological.length * 100).toFixed(1)}%</p>
            <p><strong>High Abundance Clusters (&gt;1%):</strong> {clusterEcological.filter(c => c.mean_relative_abundance > 0.01).length}</p>
            <p><strong>Rare Clusters (&lt;0.1%):</strong> {clusterEcological.filter(c => c.mean_relative_abundance < 0.001).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterEcologicalSummary;