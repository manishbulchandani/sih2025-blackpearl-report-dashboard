import React, { useState, useEffect } from 'react';
import { PhylogeneticOverview } from './components/PhylogeneticOverview';
import { SequenceAlignmentViewer } from './components/SequenceAlignmentViewer';
import { PhylogeneticTreeVisualization } from './components/PhylogeneticTreeVisualization';
import { NovelCandidateExplorer } from './components/NovelCandidateExplorer';
import { SummaryMetrics } from './components/SummaryMetrics';
import { ExportDownloadPanel } from './components/ExportDownloadPanel';

interface PhyloSummary {
  high_priority_candidates: number;
  broader_candidates: number;
  ready_for_phylogenetics: boolean;
  total_reference_sequences?: number;
  alignment_status?: string;
  tree_construction_status?: string;
  novel_sequences?: number;
}

interface AlignmentData {
  sequences: Array<{
    id: string;
    sequence: string;
    type: 'reference' | 'novel';
    gc_content: number;
    similarity_to_nearest: number;
    reads: number;
  }>;
  alignment_length: number;
  conserved_sites: number;
}

interface TreeData {
  newick_string: string;
  node_count: number;
  leaf_count: number;
  root_id: string;
}

const PhylogeneticStep: React.FC = () => {
  const [phyloSummary, setPhyloSummary] = useState<PhyloSummary | null>(null);
  const [alignmentData, setAlignmentData] = useState<AlignmentData | null>(null);
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPhylogeneticData = async () => {
      try {
        // Load phylogenetic summary
        const phyloResponse = await fetch('/data/phylogenetics/phylo_summary.json');
        if (phyloResponse.ok) {
          const phyloData = await phyloResponse.json();
          
          // Enhance with additional mock data for demonstration
          const enhancedPhyloData: PhyloSummary = {
            ...phyloData,
            total_reference_sequences: 150,
            alignment_status: phyloData.ready_for_phylogenetics ? 'Completed' : 'Pending',
            tree_construction_status: phyloData.ready_for_phylogenetics ? 'Completed' : 'Not Started',
            novel_sequences: phyloData.high_priority_candidates || 12
          };
          
          setPhyloSummary(enhancedPhyloData);
        }

        // Generate mock alignment data
        const mockAlignmentData: AlignmentData = {
          sequences: generateMockSequences(25),
          alignment_length: 1247,
          conserved_sites: 892
        };
        setAlignmentData(mockAlignmentData);

        // Generate mock tree data
        const mockTreeData: TreeData = {
          newick_string: generateMockNewick(),
          node_count: 48,
          leaf_count: 25,
          root_id: 'root_1'
        };
        setTreeData(mockTreeData);

      } catch (err) {
        console.error('Error loading phylogenetic data:', err);
        setError('Failed to load phylogenetic analysis data');
      } finally {
        setLoading(false);
      }
    };

    loadPhylogeneticData();
  }, []);

  const generateMockSequences = (count: number): AlignmentData['sequences'] => {
    const sequences = [];
    const bases = ['A', 'T', 'G', 'C', '-'];
    
    for (let i = 0; i < count; i++) {
      const isNovel = i < 12; // First 12 are novel
      const sequenceLength = 1247;
      let sequence = '';
      
      for (let j = 0; j < sequenceLength; j++) {
        if (Math.random() < 0.05) {
          sequence += '-'; // Gap
        } else {
          sequence += bases[Math.floor(Math.random() * 4)];
        }
      }
      
      sequences.push({
        id: isNovel ? `Novel_ASV_${i + 1}` : `Ref_${i - 11}`,
        sequence,
        type: isNovel ? 'novel' as const : 'reference' as const,
        gc_content: Math.random() * 0.3 + 0.4, // 40-70%
        similarity_to_nearest: isNovel ? Math.random() * 0.15 + 0.85 : Math.random() * 0.05 + 0.95,
        reads: isNovel ? Math.floor(Math.random() * 500) + 100 : Math.floor(Math.random() * 1000) + 500
      });
    }
    
    return sequences;
  };

  const generateMockNewick = (): string => {
    // Simple mock Newick string for demonstration
    return "((Novel_ASV_1:0.05,Novel_ASV_2:0.03)0.8:0.02,(Novel_ASV_3:0.07,(Ref_1:0.01,Ref_2:0.02)0.9:0.01)0.7:0.03,((Novel_ASV_4:0.04,Novel_ASV_5:0.06)0.85:0.02,(Ref_3:0.01,(Ref_4:0.02,Ref_5:0.01)0.95:0.01)0.88:0.02)0.75:0.03);";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading phylogenetic analysis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Step 7 — Phylogenetic Alignment & Tree Construction
        </h1>
        <p className="text-gray-600">
          Integration of novel ASVs with reference sequences, sequence alignment, and phylogenetic tree construction 
          for visualizing evolutionary relationships and candidate exploration.
        </p>
      </div>

      {/* Overview Cards */}
      {phyloSummary && (
        <PhylogeneticOverview data={phyloSummary} />
      )}

      {/* Sequence Alignment Viewer */}
      {alignmentData && (
        <SequenceAlignmentViewer data={alignmentData} />
      )}

      {/* Phylogenetic Tree Visualization */}
      {treeData && phyloSummary && (
        <PhylogeneticTreeVisualization 
          treeData={treeData} 
          novelCandidates={phyloSummary.high_priority_candidates}
        />
      )}

      {/* Novel Candidate Explorer */}
      {alignmentData && phyloSummary && (
        <NovelCandidateExplorer 
          sequences={alignmentData.sequences.filter(s => s.type === 'novel')}
          totalCandidates={phyloSummary.high_priority_candidates}
        />
      )}

      {/* Summary & Metrics */}
      {phyloSummary && alignmentData && treeData && (
        <SummaryMetrics 
          phyloSummary={phyloSummary}
          alignmentData={alignmentData}
          treeData={treeData}
        />
      )}

      {/* Export & Download Panel */}
      <ExportDownloadPanel />
    </div>
  );
};

export default PhylogeneticStep;