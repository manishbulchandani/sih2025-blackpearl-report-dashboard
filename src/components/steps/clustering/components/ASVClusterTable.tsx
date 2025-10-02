import React from 'react';
import { DataTable } from '../../../shared/DataTable';
import type { TableColumn } from '../../../shared/DataTable';
import { Badge } from '../../../shared/Badge';

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

interface ClusterSummary {
  total_clusters: number;
  total_asvs: number;
  average_cluster_size: number;
  largest_cluster_size: number;
  smallest_cluster_size: number;
  singletons_count: number;
  cluster_sizes: Record<number, number>;
}

interface ASVClusterTableProps {
  clusterData: ClusterData[];
  clusterSummary: ClusterSummary | null;
}

const ASVClusterTable: React.FC<ASVClusterTableProps> = ({ clusterData, clusterSummary }) => {
  const columns: TableColumn[] = [
    {
      key: 'asv_id',
      header: 'ASV ID',
      sortable: true,
      filterable: true,
      width: 'w-28'
    },
    {
      key: 'cluster_id',
      header: 'Cluster ID',
      sortable: true,
      filterable: true,
      render: (value: number) => (
        <Badge variant="default">Cluster {value}</Badge>
      )
    },
    {
      key: 'cluster_size',
      header: 'Cluster Size',
      sortable: true,
      render: (_, row: ClusterData) => {
        const size = clusterSummary?.cluster_sizes[row.cluster_id] || 0;
        const color = size === 1 ? 'text-red-600' : size < 5 ? 'text-yellow-600' : 'text-green-600';
        return (
          <span className={`font-medium ${color}`}>
            {size} ASV{size !== 1 ? 's' : ''}
          </span>
        );
      }
    },
    {
      key: 'similarity_score',
      header: 'Similarity Score',
      sortable: true,
      render: (value: number) => {
        const percentage = (value * 100).toFixed(1);
        const color = value >= 0.7 ? 'text-green-600' : value >= 0.5 ? 'text-yellow-600' : 'text-red-600';
        
        return (
          <div className="flex items-center space-x-2">
            <span className={`${color} font-medium`}>{percentage}%</span>
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${color.replace('text-', 'bg-').replace('-600', '-400')}`}
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'confidence',
      header: 'Confidence',
      sortable: true,
      filterable: true,
      render: (value: string) => {
        const variant = value === 'high' ? 'success' : value === 'medium' ? 'warning' : 'error';
        return (
          <Badge variant={variant as any}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      }
    },
    {
      key: 'novelty_candidate',
      header: 'Novelty',
      sortable: true,
      render: (value: boolean) => (
        <Badge variant={value ? 'error' : 'default'}>
          {value ? 'Novel' : 'Known'}
        </Badge>
      )
    },
    {
      key: 'umap_coordinates',
      header: 'UMAP Coordinates',
      render: (_, row: ClusterData) => (
        <span className="text-xs text-gray-600 font-mono">
          ({row.umap_x.toFixed(2)}, {row.umap_y.toFixed(2)})
        </span>
      )
    }
  ];

  // Add cluster size to each row for sorting/filtering
  const enrichedData = clusterData.map(row => ({
    ...row,
    cluster_size: clusterSummary?.cluster_sizes[row.cluster_id] || 0
  }));

  return (
    <DataTable
      title="ASV → Cluster Mapping"
      data={enrichedData}
      columns={columns}
      searchPlaceholder="Search ASV ID, cluster ID, or reference..."
      downloadFilename="asv_cluster_mapping.csv"
      itemsPerPage={15}
      highlightRow={(row) => row.cluster_size === 1}
      highlightClass="bg-yellow-50 border-yellow-200"
      className="bg-white rounded-lg border border-gray-200"
    />
  );
};

export default ASVClusterTable;