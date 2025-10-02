import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';
import { Badge } from '../../shared/Badge';
import { Alert, AlertDescription } from '../../shared/Alert';
import { SummaryCards } from './components/SummaryCards';
import { QualityPanel } from './components/QualityPanel';
import { PlotsSection } from './components/PlotsSection';
import { TablesSection } from './components/TablesSection';
import { RawJsonViewer } from './components/RawJsonViewer';
import { DownloadCenter } from './components/DownloadCenter';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface Phase2Summary {
  asv_count: number;
  total_reads: number;
  retention_rate: number;
  chimera_rate: number;
  quality_flags: string[];
  amplicon_type: string;
  length_stats: {
    mean: number;
    std: number;
    cv: number;
  };
  abundance_stats: {
    singletons: number;
    low_abundance: number;
    medium_abundance: number;
    high_abundance: number;
  };
  ready_for_phase3: boolean;
}

interface Dada2Summary {
  total_ASVs: number;
  total_reads_final: number;
  mean_reads_per_ASV: number;
  read_retention_rate: number;
  chimera_proportion: number;
  sequence_lengths: {
    min: number;
    max: number;
    median: number;
  };
}

const ASVInferenceStep: React.FC = () => {
  const [phase2Data, setPhase2Data] = useState<Phase2Summary | null>(null);
  const [dada2Data, setDada2Data] = useState<Dada2Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load phase2 summary
        const phase2Response = await fetch('/data/results/phase2_summary.json');
        if (!phase2Response.ok) throw new Error('Failed to load phase2 summary');
        const phase2Json = await phase2Response.json();
        setPhase2Data(phase2Json);

        // Load dada2 summary
        const dada2Response = await fetch('/data/asv_results/dada2_summary.json');
        if (!dada2Response.ok) throw new Error('Failed to load dada2 summary');
        const dada2Json = await dada2Response.json();
        setDada2Data(dada2Json);

        setLoading(false);
      } catch (err) {
        console.error('Error loading ASV data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusInfo = () => {
    if (!phase2Data) return { status: 'loading', icon: Clock, text: 'Loading...', color: 'bg-gray-500' };
    
    if (phase2Data.ready_for_phase3) {
      return {
        status: 'complete',
        icon: CheckCircle,
        text: 'Ready for Taxonomic Assignment',
        color: 'bg-green-500'
      };
    } else {
      return {
        status: 'warning',
        icon: AlertTriangle,
        text: 'Needs Attention',
        color: 'bg-orange-500'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading ASV inference data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error loading data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Step 2: ASV Inference & Abundance Profiling
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Amplicon Sequence Variant detection and abundance analysis
              </p>
            </div>
            <Badge className={`${statusInfo.color} text-white px-3 py-1 flex items-center gap-2`}>
              <StatusIcon className="h-4 w-4" />
              {statusInfo.text}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      {phase2Data && <SummaryCards data={phase2Data} />}

      {/* Quality Assessment Panel */}
      {phase2Data && <QualityPanel data={phase2Data} />}

      {/* Plots & Visuals */}
      {phase2Data && dada2Data && (
        <PlotsSection phase2Data={phase2Data} dada2Data={dada2Data} />
      )}

      {/* Tables Section */}
      {phase2Data && dada2Data && (
        <TablesSection phase2Data={phase2Data} dada2Data={dada2Data} />
      )}

      {/* Raw JSON Viewer */}
      {phase2Data && dada2Data && (
        <RawJsonViewer phase2Data={phase2Data} dada2Data={dada2Data} />
      )}

      {/* Download Center */}
      <DownloadCenter />

      {/* Next Step Badge */}
      {phase2Data?.ready_for_phase3 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">
                  Ready for Next Step
                </h3>
                <p className="text-green-700">
                  ASV inference completed successfully. Proceed to taxonomic assignment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ASVInferenceStep;