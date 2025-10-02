import React, { useState, useEffect } from 'react';
import { Database, Calendar, Dna } from 'lucide-react';

// Components
import SummaryCards from './components/SummaryCards';
import TaxonomicTable from './components/TaxonomicTable';
import ConfidenceDistribution from './components/ConfidenceDistribution';
import SimilarityDistribution from './components/SimilarityDistribution';
import NoveltyExplorer from './components/NoveltyExplorer';
import EcologicalContext from './components/EcologicalContext';
import StatusBadge from '../../shared/StatusBadge';
import DownloadSection from '../../shared/DownloadSection';

interface AssignmentSummary {
  total_asvs: number;
  assigned_count: number;
  assignment_rate: number;
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  novelty_candidates: number;
  kingdom_distribution: Record<string, number>;
}

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

const TaxonomicAssignmentMain: React.FC = () => {
  const [assignmentSummary, setAssignmentSummary] = useState<AssignmentSummary | null>(null);
  const [taxonomicData, setTaxonomicData] = useState<TaxonomicAssignment[]>([]);
  const [ecologicalData, setEcologicalData] = useState<EcologicalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load assignment summary
        const summaryRes = await fetch('/data/taxonomy/assignment_summary.json');
        const summary = await summaryRes.json();
        setAssignmentSummary(summary);

        // Load taxonomic assignments
        const taxonomicRes = await fetch('/data/taxonomy/taxonomic_assignments.csv');
        const taxonomicText = await taxonomicRes.text();
        const taxonomicLines = taxonomicText.trim().split('\n');
        
        const taxonomicAssignments = taxonomicLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            asv_id: values[0],
            best_reference: values[1],
            similarity_score: parseFloat(values[2]),
            confidence: values[3],
            taxonomic_assignment: values[4],
            novelty_candidate: values[5] === 'True'
          };
        });
        setTaxonomicData(taxonomicAssignments);

        // Load ecological data
        const ecologicalRes = await fetch('/data/analysis_results/asv_ecological_summary.csv');
        const ecologicalText = await ecologicalRes.text();
        const ecologicalLines = ecologicalText.trim().split('\n');
        
        const ecologicalSummary = ecologicalLines.slice(1).map(line => {
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
        setEcologicalData(ecologicalSummary);

      } catch (error) {
        console.error('Error loading taxonomic assignment data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadData = [
    {
      category: 'Taxonomic Assignment',
      items: [
        {
          name: 'Taxonomic Assignments',
          description: 'ASV taxonomic assignments with confidence scores',
          filename: 'taxonomy/taxonomic_assignments.csv',
          size: '~25KB',
          type: 'csv' as const
        },
        {
          name: 'Assignment Summary',
          description: 'Overall assignment statistics and confidence distribution',
          filename: 'taxonomy/assignment_summary.json',
          size: '~2KB',
          type: 'json' as const
        }
      ]
    },
    {
      category: 'Ecological Context',
      items: [
        {
          name: 'ASV Ecological Summary',
          description: 'Abundance and ecological metrics per ASV',
          filename: 'analysis_results/asv_ecological_summary.csv',
          size: '~30KB',
          type: 'csv' as const
        }
      ]
    },
    {
      category: 'Novelty Detection',
      items: [
        {
          name: 'Novelty Candidates',
          description: 'List of ASVs flagged as potential novel taxa',
          filename: 'clustering/novel_candidates.csv',
          size: '~15KB',
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
          <p className="text-gray-600">Loading taxonomic assignment dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (!assignmentSummary) return { status: 'error' as const, message: 'No data available' };
    
    const assignmentRate = assignmentSummary.assignment_rate * 100;
    const noveltyRate = (assignmentSummary.novelty_candidates / assignmentSummary.total_asvs) * 100;
    
    if (assignmentRate > 80) {
      return {
        status: 'ready' as const,
        message: 'High-quality taxonomic assignments',
        description: `${assignmentRate.toFixed(1)}% of ASVs successfully assigned`
      };
    } else if (noveltyRate > 50) {
      return {
        status: 'warning' as const,
        message: 'High novelty detection rate',
        description: `${noveltyRate.toFixed(1)}% of ASVs are potential novel taxa`
      };
    } else {
      return {
        status: 'ready' as const,
        message: 'Taxonomic assignment completed',
        description: `${assignmentSummary.novelty_candidates} novelty candidates identified`
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
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Dna className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Taxonomic Assignment & Novelty Detection
              </h1>
              <p className="text-gray-600 mt-1">
                ASV classification and novel taxa identification
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Sample: SRR29925009</span>
            </div>
            <div className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
              Step 3 of 8
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Overview</h2>
            <SummaryCards 
              assignmentSummary={assignmentSummary}
            />
          </div>

          {/* Confidence & Similarity Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Confidence Distribution</h2>
              <ConfidenceDistribution 
                assignmentSummary={assignmentSummary}
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Similarity Score Distribution</h2>
              <SimilarityDistribution 
                taxonomicData={taxonomicData}
              />
            </div>
          </div>

          {/* Taxonomic Assignment Table */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ASV Taxonomic Assignments</h2>
            <TaxonomicTable 
              taxonomicData={taxonomicData}
            />
          </div>

          {/* Novelty Explorer */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Novelty Candidate Explorer</h2>
            <NoveltyExplorer 
              taxonomicData={taxonomicData}
              ecologicalData={ecologicalData}
            />
          </div>

          {/* Ecological Context */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Ecological Context</h2>
            <EcologicalContext 
              ecologicalData={ecologicalData}
            />
          </div>

          {/* Download Section */}
          <DownloadSection downloads={downloadData} />

          {/* Analysis Info */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Database className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-purple-900 mb-2">Assignment Statistics</h3>
                <div className="text-sm text-purple-800 space-y-1">
                  <p><strong>Total ASVs:</strong> {assignmentSummary?.total_asvs || 'N/A'}</p>
                  <p><strong>Assigned ASVs:</strong> {assignmentSummary?.assigned_count || 0} ({((assignmentSummary?.assignment_rate || 0) * 100).toFixed(1)}%)</p>
                  <p><strong>High Confidence:</strong> {assignmentSummary?.confidence_distribution.high || 0}</p>
                  <p><strong>Medium Confidence:</strong> {assignmentSummary?.confidence_distribution.medium || 0}</p>
                  <p><strong>Low Confidence:</strong> {assignmentSummary?.confidence_distribution.low || 0}</p>
                  <p><strong>Novelty Candidates:</strong> {assignmentSummary?.novelty_candidates || 0} ({assignmentSummary ? ((assignmentSummary.novelty_candidates / assignmentSummary.total_asvs) * 100).toFixed(1) : 0}%)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxonomicAssignmentMain;