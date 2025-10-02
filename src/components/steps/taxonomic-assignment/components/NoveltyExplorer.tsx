import React, { useMemo } from 'react';
import { DataTable } from '../../../shared/DataTable';
import type { TableColumn } from '../../../shared/DataTable';
import { Badge } from '../../../shared/Badge';
import { AlertTriangle, Download } from 'lucide-react';

interface TaxonomicAssignment {
  asv_id: string;
  best_reference: string;
  similarity_score: number;
  confidence: string;
  taxonomic_assignment: string;
  novelty_candidate: boolean;
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

interface NoveltyExplorerProps {
  taxonomicData: TaxonomicAssignment[];
  ecologicalData: EcologicalData[];
}

const NoveltyExplorer: React.FC<NoveltyExplorerProps> = ({ taxonomicData, ecologicalData }) => {
  const noveltyData = useMemo(() => {
    const noveltyCandidates = taxonomicData.filter(asv => asv.novelty_candidate);
    
    return noveltyCandidates.map(asv => {
      const ecological = ecologicalData.find(eco => eco.asv_id === asv.asv_id);
      return {
        ...asv,
        total_reads: ecological?.total_reads || 0,
        relative_abundance: ecological?.relative_abundance || 0,
        cluster_id: ecological?.cluster_id || 0
      };
    });
  }, [taxonomicData, ecologicalData]);

  const columns: TableColumn[] = [
    {
      key: 'asv_id',
      header: 'ASV ID',
      sortable: true,
      filterable: true,
      width: 'w-28'
    },
    {
      key: 'best_reference',
      header: 'Closest Reference',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-900 font-mono">{value}</span>
      )
    },
    {
      key: 'similarity_score',
      header: 'Max Similarity',
      sortable: true,
      render: (value: number) => {
        const percentage = (value * 100).toFixed(1);
        return (
          <div className="flex items-center space-x-2">
            <span className="text-red-600 font-medium">{percentage}%</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-400"
                style={{ width: `${value * 100}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      key: 'total_reads',
      header: 'Abundance',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm font-medium text-gray-900">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'relative_abundance',
      header: 'Rel. Abundance',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm text-gray-900">{(value * 100).toFixed(3)}%</span>
      )
    },
    {
      key: 'cluster_id',
      header: 'Cluster',
      sortable: true,
      render: (value: number) => (
        <Badge variant="default">Cluster {value}</Badge>
      )
    }
  ];

  const handleDownloadNovelty = () => {
    const csvContent = [
      'asv_id,best_reference,similarity_score,confidence,total_reads,relative_abundance,cluster_id',
      ...noveltyData.map(item =>
        `${item.asv_id},${item.best_reference},${item.similarity_score},${item.confidence},${item.total_reads},${item.relative_abundance},${item.cluster_id}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'novelty_candidates.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Novelty Candidates Detected
              </h3>
              <p className="text-sm text-red-700 mt-1">
                {noveltyData.length} ASVs have similarity scores below 70% threshold, indicating potential novel taxa.
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadNovelty}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Novelty Candidates</span>
          </button>
        </div>
      </div>

      {/* Novelty Table */}
      <DataTable
        title={`Novelty Candidates (${noveltyData.length})`}
        data={noveltyData}
        columns={columns}
        searchPlaceholder="Search novelty candidates..."
        downloadFilename="novelty_candidates.csv"
        itemsPerPage={10}
        className="bg-white rounded-lg border border-gray-200"
      />

      {/* Additional Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Novelty Detection Criteria</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Similarity score &lt; 0.7 (70%) to closest reference sequence</li>
          <li>• Low confidence taxonomic assignment</li>
          <li>• Potential representation of undescribed or poorly characterized taxa</li>
          <li>• Candidates for further phylogenetic analysis and potential new species description</li>
        </ul>
      </div>
    </div>
  );
};

export default NoveltyExplorer;