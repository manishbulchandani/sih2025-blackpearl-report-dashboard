import React, { useState, useEffect } from 'react';
import { Database, Calendar, Info } from 'lucide-react';

// Components
import SummaryCards from './components/SummaryCards';
import QualityPlots from './components/QualityPlots';
import WarningsPanel from './components/WarningsPanel';
import FileTable from './components/FileTable';
import StatusBadge from '../../shared/StatusBadge';
import DownloadSection from '../../shared/DownloadSection';
import EmbeddedReport from '../../shared/EmbeddedReport';

const DataAcquisitionMain: React.FC = () => {
  const [dataAnalysis, setDataAnalysis] = useState<any>(null);
  const [phase1Summary, setPhase1Summary] = useState<any>(null);
  const [fastpReport, setFastpReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all required data files
        const [analysisRes, summaryRes, fastpRes] = await Promise.all([
          fetch('/data/analysis/data_analysis.json'),
          fetch('/data/results/phase1_summary.json'),
          fetch('/data/trimmed/fastp_report.json')
        ]);

        const [analysis, summary, fastp] = await Promise.all([
          analysisRes.json(),
          summaryRes.json(),
          fastpRes.json()
        ]);

        setDataAnalysis(analysis);
        setPhase1Summary(summary);
        setFastpReport(fastp);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const rawDataFiles = [
    {
      name: 'SRR29925009_1.fastq.gz',
      size: '~190MB',
      type: 'fastq' as const,
      path: 'raw/SRR29925009_1.fastq.gz',
      description: 'Forward reads'
    },
    {
      name: 'SRR29925009_2.fastq.gz',
      size: '~190MB',
      type: 'fastq' as const,
      path: 'raw/SRR29925009_2.fastq.gz',
      description: 'Reverse reads'
    }
  ];

  const trimmedDataFiles = [
    {
      name: 'SRR29925009_1.trim.fastq.gz',
      size: '~170MB',
      type: 'fastq' as const,
      path: 'trimmed/SRR29925009_1.trim.fastq.gz',
      description: 'Trimmed forward reads'
    },
    {
      name: 'SRR29925009_2.trim.fastq.gz',
      size: '~165MB',
      type: 'fastq' as const,
      path: 'trimmed/SRR29925009_2.trim.fastq.gz',
      description: 'Trimmed reverse reads'
    }
  ];

  const downloadData = [
    {
      category: 'Raw Data',
      items: [
        {
          name: 'Raw FASTQ Files',
          description: 'Original sequencing reads',
          filename: 'raw/SRR29925009_1.fastq.gz',
          size: '~380MB total',
          type: 'fastq' as const
        }
      ]
    },
    {
      category: 'Analysis Results',
      items: [
        {
          name: 'Data Analysis Summary',
          description: 'Comprehensive sequence statistics and quality metrics',
          filename: 'analysis/data_analysis.json',
          size: '15KB',
          type: 'json' as const
        },
        {
          name: 'Pipeline Parameters',
          description: 'Configuration parameters used in analysis',
          filename: 'analysis/parameters.env',
          size: '1KB',
          type: 'env' as const
        },
        {
          name: 'Phase 1 Summary',
          description: 'Processing summary and quality flags',
          filename: 'results/phase1_summary.json',
          size: '2KB',
          type: 'json' as const
        }
      ]
    },
    {
      category: 'Quality Reports',
      items: [
        {
          name: 'MultiQC Report',
          description: 'Comprehensive quality control summary',
          filename: 'qc/multiqc_report.html',
          size: '2.5MB',
          type: 'html' as const
        },
        {
          name: 'FastP Report',
          description: 'Read trimming and filtering report',
          filename: 'trimmed/fastp_report.html',
          size: '1.2MB',
          type: 'html' as const
        },
        {
          name: 'FastP JSON Data',
          description: 'Detailed trimming statistics in JSON format',
          filename: 'trimmed/fastp_report.json',
          size: '50KB',
          type: 'json' as const
        }
      ]
    },
    {
      category: 'Processed Data',
      items: [
        {
          name: 'Trimmed FASTQ Files',
          description: 'Quality-filtered and trimmed reads',
          filename: 'trimmed/SRR29925009_1.trim.fastq.gz',
          size: '~335MB total',
          type: 'fastq' as const
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data acquisition dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusInfo = () => {
    if (!phase1Summary) return { status: 'error' as const, message: 'No data available' };
    
    if (phase1Summary.ready_for_dada2) {
      return {
        status: 'ready' as const,
        message: 'Ready for Step 2: DADA2 Inference',
        description: 'All quality checks passed successfully'
      };
    } else {
      return {
        status: 'warning' as const,
        message: 'Quality issues detected',
        description: `${phase1Summary.quality_flags?.length || 0} warnings need attention`
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
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Data Acquisition & Quality Control
              </h1>
              <p className="text-gray-600 mt-1">
                Raw data processing and quality assessment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Sample: SRR29925009</span>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              Step 1 of 8
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

          {/* Warnings Panel */}
          {phase1Summary?.quality_flags && phase1Summary.quality_flags.length > 0 && (
            <WarningsPanel warnings={phase1Summary.quality_flags} />
          )}

          {/* Summary Cards */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Overview Metrics</h2>
            <SummaryCards 
              dataAnalysis={dataAnalysis}
              phase1Summary={phase1Summary}
              fastpReport={fastpReport}
            />
          </div>

          {/* Quality Plots */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quality Analysis</h2>
            <QualityPlots 
              dataAnalysis={dataAnalysis}
              fastpReport={fastpReport}
            />
          </div>

          {/* Embedded Reports */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quality Control Reports</h2>
            <div className="space-y-6">
              <EmbeddedReport
                title="MultiQC Comprehensive Report"
                description="Aggregate quality control metrics across all processing steps"
                htmlFile="qc/multiqc_report.html"
                type="multiqc"
              />
              <EmbeddedReport
                title="FastP Trimming Report"
                description="Detailed read filtering and trimming analysis"
                htmlFile="trimmed/fastp_report.html"
                type="fastp"
              />
            </div>
          </div>

          {/* File Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FileTable
              title="Raw Data Files"
              description="Original sequencing files"
              files={rawDataFiles}
            />
            <FileTable
              title="Processed Data Files"
              description="Quality-filtered and trimmed reads"
              files={trimmedDataFiles}
            />
          </div>

          {/* Download Section */}
          <DownloadSection downloads={downloadData} />

          {/* Analysis Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Analysis Information</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Data Type:</strong> {dataAnalysis?.automated_decisions?.data_type || 'N/A'}</p>
                  <p><strong>Expected Marker:</strong> {dataAnalysis?.automated_decisions?.expected_marker || 'N/A'}</p>
                  <p><strong>Quality Threshold:</strong> Q{dataAnalysis?.automated_decisions?.quality_threshold || 'N/A'}</p>
                  <p><strong>Min Length Filter:</strong> {dataAnalysis?.automated_decisions?.min_length || 'N/A'}bp</p>
                  <p><strong>Truncation Lengths:</strong> R1={dataAnalysis?.automated_decisions?.truncLen_r1 || 'N/A'}bp, R2={dataAnalysis?.automated_decisions?.truncLen_r2 || 'N/A'}bp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAcquisitionMain;