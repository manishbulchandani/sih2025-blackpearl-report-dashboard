import React, { useMemo } from 'react';
import { DataTable } from '../../../shared/DataTable';
import type { TableColumn } from '../../../shared/DataTable';
import { Badge } from '../../../shared/Badge';
import { Chart } from '../../../shared/Chart';

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

interface EcologicalContextProps {
  ecologicalData: EcologicalData[];
}

const EcologicalContext: React.FC<EcologicalContextProps> = ({ ecologicalData }) => {
  const columns: TableColumn[] = [
    {
      key: 'asv_id',
      header: 'ASV ID',
      sortable: true,
      filterable: true,
      width: 'w-28'
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
      key: 'relative_abundance',
      header: 'Rel. Abundance',
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
      key: 'prevalence',
      header: 'Prevalence',
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
      key: 'cluster_id',
      header: 'Cluster',
      sortable: true,
      filterable: true,
      render: (value: number) => (
        <Badge variant="default">Cluster {value}</Badge>
      )
    }
  ];

  const abundanceDistribution = useMemo(() => {
    if (!ecologicalData || ecologicalData.length === 0) return [];

    // Create abundance categories
    const categories = [
      { name: 'Very High (>1%)', min: 0.01, max: 1, count: 0 },
      { name: 'High (0.1-1%)', min: 0.001, max: 0.01, count: 0 },
      { name: 'Medium (0.01-0.1%)', min: 0.0001, max: 0.001, count: 0 },
      { name: 'Low (<0.01%)', min: 0, max: 0.0001, count: 0 }
    ];

    ecologicalData.forEach(asv => {
      const abundance = asv.relative_abundance;
      if (abundance > 0.01) categories[0].count++;
      else if (abundance > 0.001) categories[1].count++;
      else if (abundance > 0.0001) categories[2].count++;
      else categories[3].count++;
    });

    return categories.map(cat => ({
      name: cat.name,
      value: cat.count
    }));
  }, [ecologicalData]);

  const clusterDistribution = useMemo(() => {
    if (!ecologicalData || ecologicalData.length === 0) return [];

    const clusterCounts: Record<number, number> = {};
    ecologicalData.forEach(asv => {
      clusterCounts[asv.cluster_id] = (clusterCounts[asv.cluster_id] || 0) + 1;
    });

    return Object.entries(clusterCounts)
      .map(([cluster, count]) => ({
        name: `Cluster ${cluster}`,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 clusters
  }, [ecologicalData]);

  if (!ecologicalData || ecologicalData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <p className="text-gray-500 text-center">No ecological data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          title="Abundance Categories"
          type="pie"
          data={abundanceDistribution}
          nameKey="name"
          valueKey="value"
          height={300}
          colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
          className="bg-white rounded-lg border border-gray-200"
        />
        
        <Chart
          title="Cluster Distribution (Top 10)"
          type="bar"
          data={clusterDistribution}
          xKey="name"
          yKey="value"
          height={300}
          colors={['#6366F1']}
          className="bg-white rounded-lg border border-gray-200"
        />
      </div>

      {/* Ecological Summary Table */}
      <DataTable
        title="ASV Ecological Summary"
        data={ecologicalData}
        columns={columns}
        searchPlaceholder="Search ASV ecological data..."
        downloadFilename="asv_ecological_summary.csv"
        itemsPerPage={15}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Abundance Statistics</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Total Reads:</strong> {ecologicalData.reduce((sum, asv) => sum + asv.total_reads, 0).toLocaleString()}</p>
            <p><strong>Mean Abundance:</strong> {(ecologicalData.reduce((sum, asv) => sum + asv.relative_abundance, 0) / ecologicalData.length * 100).toFixed(4)}%</p>
            <p><strong>Max Abundance:</strong> {(Math.max(...ecologicalData.map(asv => asv.relative_abundance)) * 100).toFixed(3)}%</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Distribution</h4>
          <div className="text-sm text-green-800 space-y-1">
            <p><strong>Unique Clusters:</strong> {new Set(ecologicalData.map(asv => asv.cluster_id)).size}</p>
            <p><strong>Samples Present:</strong> {Math.max(...ecologicalData.map(asv => asv.samples_present))}</p>
            <p><strong>Mean Prevalence:</strong> {(ecologicalData.reduce((sum, asv) => sum + asv.prevalence, 0) / ecologicalData.length * 100).toFixed(1)}%</p>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Diversity Metrics</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <p><strong>Total ASVs:</strong> {ecologicalData.length}</p>
            <p><strong>Dominant ASVs (&gt;1%):</strong> {ecologicalData.filter(asv => asv.relative_abundance > 0.01).length}</p>
            <p><strong>Rare ASVs (&lt;0.01%):</strong> {ecologicalData.filter(asv => asv.relative_abundance < 0.0001).length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcologicalContext;