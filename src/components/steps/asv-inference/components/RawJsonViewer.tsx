import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { ChevronDown, ChevronUp, Copy, Download } from 'lucide-react';

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

interface RawJsonViewerProps {
  phase2Data: Phase2Summary;
  dada2Data: Dada2Summary;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ phase2Data, dada2Data }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const JsonSection: React.FC<{
    title: string;
    data: any;
    filename: string;
    sectionKey: string;
  }> = ({ title, data, filename, sectionKey }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
              {title}
            </CardTitle>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => copyToClipboard(data)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Copy JSON"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => downloadJson(data, filename)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Download JSON"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        
        {isExpanded && (
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                <code>{JSON.stringify(data, null, 2)}</code>
              </pre>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Raw JSON Data</h3>
        <p className="text-sm text-gray-600">
          Expandable viewers for structured data transparency
        </p>
      </div>

      <JsonSection
        title="Phase 2 Summary (High-level Results)"
        data={phase2Data}
        filename="phase2_summary.json"
        sectionKey="phase2"
      />

      <JsonSection
        title="DADA2 Summary (Detailed Statistics)"
        data={dada2Data}
        filename="dada2_summary.json"
        sectionKey="dada2"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100">
              <span className="text-blue-600 text-sm font-medium">i</span>
            </div>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              About Raw JSON Data
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              These JSON files contain the complete structured data used to generate the dashboard visualizations. 
              You can copy or download them for further analysis, custom reporting, or integration with other tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};