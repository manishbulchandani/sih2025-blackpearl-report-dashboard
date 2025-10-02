import React, { useState, useEffect } from 'react';
import { Database, Calendar, Network } from 'lucide-react';

// Components
import SummaryCards from './components/SummaryCards';
import ClusterSizeDistribution from './components/ClusterSizeDistribution';
import ASVClusterTable from './components/ASVClusterTable';
import ClusterEcologicalSummary from './components/ClusterEcologicalSummary';
import ClusterVisualization from './components/ClusterVisualization';
import OutlierExplorer from './components/OutlierExplorer';
import StatusBadge from '../../shared/StatusBadge';
import DownloadSection from '../../shared/DownloadSection';

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

const ClusteringMain: React.FC = () => {
  const [clusterData, setClusterData] = useState<ClusterData[]>([]);
  const [ecologicalData, setEcologicalData] = useState<EcologicalData[]>([]);
  const [clusterSummary, setClusterSummary] = useState<ClusterSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load cluster analysis data
        const clusterRes = await fetch('/data/clustering/cluster_analysis.csv');
        const clusterText = await clusterRes.text();
        const clusterLines = clusterText.trim().split('\n');
        
        const clusters = clusterLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            asv_id: values[0],
            best_reference: values[1],
            similarity_score: parseFloat(values[2]),
            confidence: values[3],
            taxonomic_assignment: values[4],
            novelty_candidate: values[5] === 'True',
            cluster_id: parseInt(values[6]),
            umap_x: parseFloat(values[7]),
            umap_y: parseFloat(values[8])
          };
        });
        setClusterData(clusters);

        // Load ecological data
        const ecoRes = await fetch('/data/analysis_results/asv_ecological_summary.csv');
        const ecoText = await ecoRes.text();
        const ecoLines = ecoText.trim().split('\n');
        
        const ecological = ecoLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            asv_id: values[0],
            total_reads: parseInt(values[1]),
            samples_present: parseInt(values[2]),
            max_sample_abundance: parseInt(values[3]),
            mean_abundance: parseFloat(values[4]),
            std_abundance: parseFloat(values[5]),
            prevalence: parseFloat(values[6]),
            relative_abundance: parseFloat(values[7]),
            cluster_id: parseInt(values[11])
          };
        });
        setEcologicalData(ecological);

        // Calculate cluster summary
        const clusterSizes: Record<number, number> = {};
        clusters.forEach(asv => {
          clusterSizes[asv.cluster_id] = (clusterSizes[asv.cluster_id] || 0) + 1;
        });

        const sizes = Object.values(clusterSizes);
        const summary: ClusterSummary = {
          total_clusters: Object.keys(clusterSizes).length,
          total_asvs: clusters.length,
          average_cluster_size: sizes.reduce((a, b) => a + b, 0) / sizes.length,
          largest_cluster_size: Math.max(...sizes),
          smallest_cluster_size: Math.min(...sizes),
          singletons_count: sizes.filter(size => size === 1).length,
          cluster_sizes: clusterSizes
        };
        setClusterSummary(summary);

      } catch (error) {
        console.error('Error loading clustering data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadData = [
    {
      category: 'Clustering Results',
      items: [
        {
          name: 'ASV Clusters',
          description: 'ASV to cluster mapping with UMAP coordinates',
          filename: 'clustering/cluster_analysis.csv',
          size: '~30KB',
          type: 'csv' as const
        },
        {
          name: 'Cluster Summary',
          description: 'Overall clustering statistics and metrics',
          filename: 'clustering/cluster_summary.csv',
          size: '~5KB',
          type: 'csv' as const
        }
      ]
    },
    {
      category: 'Ecological Context',
      items: [
        {
          name: 'ASV Ecological Summary',
          description: 'Ecological metrics per ASV',
          filename: 'analysis_results/asv_ecological_summary.csv',
          size: '~35KB',
          type: 'csv' as const
        }
      ]
    },
    {
      category: 'Visualizations',
      items: [
        {
          name: 'Cluster Visualization',
          description: 'Interactive clustering plot',
          filename: 'clustering/clustering_visualization.png',
          size: '~500KB',
          type: 'csv' as const
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clustering analysis dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (!clusterSummary) return { status: 'error' as const, message: 'No data available' };
    
    const avgClusterSize = clusterSummary.average_cluster_size;
    const singletonRate = (clusterSummary.singletons_count / clusterSummary.total_clusters) * 100;
    
    if (avgClusterSize > 5 && singletonRate < 30) {
      return {
        status: 'ready' as const,
        message: 'Well-structured clustering',
        description: `${clusterSummary.total_clusters} clusters with avg size ${avgClusterSize.toFixed(1)}`
      };
    } else if (singletonRate > 50) {
      return {
        status: 'warning' as const,
        message: 'High singleton rate detected',
        description: `${singletonRate.toFixed(1)}% of clusters are singletons`
      };
    } else {
      return {
        status: 'ready' as const,
        message: 'Clustering analysis completed',
        description: `${clusterSummary.total_asvs} ASVs grouped into ${clusterSummary.total_clusters} clusters`
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Network className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Clustering & Ecological Summary
              </h1>
              <p className="text-gray-600 mt-1">
                Sequence clustering and ecological pattern analysis
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Sample: SRR29925009</span>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Step 4 of 8
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Status Badge */}
          <StatusBadge
            status={statusInfo.status}
            message={statusInfo.message}
            description={statusInfo.description}
          />

          {/* Summary Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Clustering Overview</h2>
            <SummaryCards 
              clusterSummary={clusterSummary}
            />
          </div>

          {/* Cluster Size Distribution */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cluster Size Distribution</h2>
            <ClusterSizeDistribution 
              clusterSummary={clusterSummary}
            />
          </div>

          {/* ASV Cluster Mapping Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ASV → Cluster Mapping</h2>
            <ASVClusterTable 
              clusterData={clusterData}
              clusterSummary={clusterSummary}
            />
          </div>

          {/* Cluster Ecological Summary */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cluster Ecological Summary</h2>
            <ClusterEcologicalSummary 
              ecologicalData={ecologicalData}
              clusterSummary={clusterSummary}
            />
          </div>

          {/* Cluster Visualization */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Cluster Visualization</h2>
            <ClusterVisualization 
              clusterData={clusterData}
            />
          </div>

          {/* Outlier & Singleton Explorer */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Outliers & Singletons</h2>
            <OutlierExplorer 
              clusterData={clusterData}
            />
          </div>

          {/* Download Section */}
          <DownloadSection downloads={downloadData} />

          {/* Analysis Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900 mb-2">Clustering Statistics</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p><strong>Total Clusters:</strong> {clusterSummary?.total_clusters || 'N/A'}</p>
                  <p><strong>Total ASVs:</strong> {clusterSummary?.total_asvs || 'N/A'}</p>
                  <p><strong>Average Cluster Size:</strong> {clusterSummary?.average_cluster_size.toFixed(1) || 'N/A'}</p>
                  <p><strong>Largest Cluster:</strong> {clusterSummary?.largest_cluster_size || 'N/A'} ASVs</p>
                  <p><strong>Singleton Clusters:</strong> {clusterSummary?.singletons_count || 'N/A'} ({clusterSummary ? ((clusterSummary.singletons_count / clusterSummary.total_clusters) * 100).toFixed(1) : 0}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusteringMain;