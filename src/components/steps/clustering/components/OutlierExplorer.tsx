import React, { useMemo, useState } from 'react';
import { Search, ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { Badge, Card, DataTable } from '../../../shared';

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

interface OutlierExplorerProps {
  clusterData: ClusterData[];
}

const OutlierExplorer: React.FC<OutlierExplorerProps> = ({ clusterData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const outlierAnalysis = useMemo(() => {
    if (!clusterData.length) return {
      singletons: [],
      lowSimilarity: [],
      noveltyCandidate: [],
      clusterSizes: new Map()
    };

    // Calculate cluster sizes
    const clusterSizes = new Map<number, number>();
    clusterData.forEach(item => {
      clusterSizes.set(item.cluster_id, (clusterSizes.get(item.cluster_id) || 0) + 1);
    });

    // Identify different types of outliers
    const singletons = clusterData.filter(item => clusterSizes.get(item.cluster_id) === 1);
    const lowSimilarity = clusterData.filter(item => item.similarity_score < 0.7);
    const noveltyCandidate = clusterData.filter(item => item.novelty_candidate);

    return {
      singletons,
      lowSimilarity,
      noveltyCandidate,
      clusterSizes
    };
  }, [clusterData]);

  const filteredOutliers = useMemo(() => {
    const allOutliers = [
      ...outlierAnalysis.singletons.map(item => ({ ...item, outlier_type: 'Singleton' })),
      ...outlierAnalysis.lowSimilarity.map(item => ({ ...item, outlier_type: 'Low Similarity' })),
      ...outlierAnalysis.noveltyCandidate.map(item => ({ ...item, outlier_type: 'Novelty Candidate' }))
    ];

    // Remove duplicates (an ASV can be multiple types of outlier)
    const uniqueOutliers = allOutliers.reduce((acc, current) => {
      const existing = acc.find(item => item.asv_id === current.asv_id);
      if (existing) {
        existing.outlier_type += `, ${current.outlier_type}`;
      } else {
        acc.push(current);
      }
      return acc;
    }, [] as Array<ClusterData & { outlier_type: string }>);

    if (!searchTerm) return uniqueOutliers;
    
    return uniqueOutliers.filter(item =>
      item.asv_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.taxonomic_assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.best_reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [outlierAnalysis, searchTerm]);

  const outlierColumns = [
    {
      key: 'asv_id',
      header: 'ASV ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'cluster_id',
      header: 'Cluster',
      render: (value: number) => (
        <Badge>{value}</Badge>
      )
    },
    {
      key: 'outlier_type',
      header: 'Outlier Type',
      render: (value: string) => {
        const types = value.split(', ');
        return (
          <div className="flex flex-wrap gap-1">
            {types.map((type, idx) => (
              <Badge 
                key={idx}
                variant={
                  type === 'Singleton' ? 'error' :
                  type === 'Low Similarity' ? 'warning' :
                  'default'
                }
                className="text-xs"
              >
                {type}
              </Badge>
            ))}
          </div>
        );
      }
    },
    {
      key: 'similarity_score',
      header: 'Similarity',
      render: (value: number) => (
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${value < 0.7 ? 'text-red-600' : value < 0.9 ? 'text-yellow-600' : 'text-green-600'}`}>
            {(value * 100).toFixed(1)}%
          </span>
          {value < 0.7 && <AlertTriangle className="h-3 w-3 text-red-500" />}
        </div>
      )
    },
    {
      key: 'confidence',
      header: 'Confidence',
      render: (value: string) => (
        <Badge variant={
          value === 'High' ? 'success' :
          value === 'Medium' ? 'warning' :
          'error'
        }>
          {value}
        </Badge>
      )
    },
    {
      key: 'taxonomic_assignment',
      header: 'Taxonomic Assignment',
      render: (value: string) => (
        <span className="text-sm italic">{value || 'Unassigned'}</span>
      )
    },
    {
      key: 'best_reference',
      header: 'Best Reference',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-mono">{value}</span>
          <button 
            className="text-blue-500 hover:text-blue-700"
            title="View in NCBI"
          >
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Singleton Clusters</p>
              <p className="text-2xl font-bold text-red-600">{outlierAnalysis.singletons.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ASVs forming clusters of size 1
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Similarity</p>
              <p className="text-2xl font-bold text-yellow-600">{outlierAnalysis.lowSimilarity.length}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ASVs with &lt;70% similarity to references
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Novelty Candidates</p>
              <p className="text-2xl font-bold text-blue-600">{outlierAnalysis.noveltyCandidate.length}</p>
            </div>
            <Info className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Potential new species/variants
          </p>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search outliers by ASV ID, taxonomy, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-500">
            {filteredOutliers.length} outliers found
          </div>
        </div>

        {/* Outlier Table */}
        <DataTable
          data={filteredOutliers}
          columns={outlierColumns}
          searchable={false} // We handle search ourselves
        />
      </Card>

      {/* Outlier Categories Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h4 className="font-medium text-gray-900">Singleton Clusters</h4>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            ASVs that form clusters containing only themselves, indicating:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Highly divergent sequences</li>
            <li>• Potential sequencing artifacts</li>
            <li>• Rare or novel species</li>
            <li>• Technical outliers</li>
          </ul>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h4 className="font-medium text-gray-900">Low Similarity</h4>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            ASVs with &lt;70% similarity to reference databases, suggesting:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Poorly characterized taxa</li>
            <li>• Novel genetic variants</li>
            <li>• Contamination sources</li>
            <li>• Reference database gaps</li>
          </ul>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Info className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-gray-900">Novelty Candidates</h4>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            ASVs flagged as potential novel discoveries based on:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Distance from known taxa</li>
            <li>• Clustering patterns</li>
            <li>• Phylogenetic position</li>
            <li>• Environmental context</li>
          </ul>
        </Card>
      </div>

      {/* Export and Action Panel */}
      <Card className="p-4">
        <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Export Outlier List
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            Flag for Manual Review
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
            Cross-reference with Step 3
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
            Generate Report
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Use these tools to further investigate outliers and prepare them for downstream analysis.
        </p>
      </Card>
    </div>
  );
};

export default OutlierExplorer;