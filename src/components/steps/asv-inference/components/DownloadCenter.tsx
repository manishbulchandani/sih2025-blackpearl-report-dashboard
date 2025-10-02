import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Download, FileText, Database, Image } from 'lucide-react';

interface DownloadItem {
  title: string;
  description: string;
  filename: string;
  path: string;
  icon: any;
  type: 'fasta' | 'tsv' | 'csv' | 'json' | 'png';
  size?: string;
}

export const DownloadCenter: React.FC = () => {
  const downloadItems: DownloadItem[] = [
    {
      title: 'ASV Sequences',
      description: 'FASTA file containing all ASV sequences',
      filename: 'asv_sequences.fasta',
      path: '/data/asv_results/asv_sequences.fasta',
      icon: FileText,
      type: 'fasta',
      size: '~50KB'
    },
    {
      title: 'Abundance Table',
      description: 'Sample × ASV abundance matrix',
      filename: 'asv_table_ids.tsv',
      path: '/data/asv_results/asv_table_ids.tsv',
      icon: Database,
      type: 'tsv',
      size: '~25KB'
    },
    {
      title: 'ASV Mapping',
      description: 'ASV ID to sequence and length mapping',
      filename: 'asv_mapping.csv',
      path: '/data/asv_results/asv_mapping.csv',
      icon: Database,
      type: 'csv',
      size: '~100KB'
    },
    {
      title: 'Read Tracking',
      description: 'Read counts through processing pipeline',
      filename: 'read_tracking.tsv',
      path: '/data/asv_results/read_tracking.tsv',
      icon: Database,
      type: 'tsv',
      size: '~1KB'
    },
    {
      title: 'DADA2 Summary',
      description: 'Detailed processing statistics',
      filename: 'dada2_summary.json',
      path: '/data/asv_results/dada2_summary.json',
      icon: FileText,
      type: 'json',
      size: '~2KB'
    },
    {
      title: 'Phase 2 Summary',
      description: 'High-level results and quality flags',
      filename: 'phase2_summary.json',
      path: '/data/results/phase2_summary.json',
      icon: FileText,
      type: 'json',
      size: '~3KB'
    }
  ];

  const figureItems: DownloadItem[] = [
    {
      title: 'Forward Error Rates',
      description: 'Error rate profile for R1 reads',
      filename: 'error_rates_F.png',
      path: '/data/figures/error_rates_F.png',
      icon: Image,
      type: 'png',
      size: '~200KB'
    },
    {
      title: 'Reverse Error Rates',
      description: 'Error rate profile for R2 reads',
      filename: 'error_rates_R.png',
      path: '/data/figures/error_rates_R.png',
      icon: Image,
      type: 'png',
      size: '~200KB'
    },
    {
      title: 'Forward Quality Profile',
      description: 'Quality score profile for R1 reads',
      filename: 'quality_profile_F.png',
      path: '/data/figures/quality_profile_F.png',
      icon: Image,
      type: 'png',
      size: '~150KB'
    },
    {
      title: 'Reverse Quality Profile',
      description: 'Quality score profile for R2 reads',
      filename: 'quality_profile_R.png',
      path: '/data/figures/quality_profile_R.png',
      icon: Image,
      type: 'png',
      size: '~150KB'
    }
  ];

  const handleDownload = (item: DownloadItem) => {
    // Create a download link
    const link = document.createElement('a');
    link.href = item.path;
    link.download = item.filename;
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fasta':
        return 'bg-purple-100 text-purple-800';
      case 'tsv':
      case 'csv':
        return 'bg-green-100 text-green-800';
      case 'json':
        return 'bg-blue-100 text-blue-800';
      case 'png':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const DownloadGrid: React.FC<{ items: DownloadItem[]; title: string }> = ({ items, title }) => (
    <div className="space-y-4">
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleDownload(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {item.title}
                    </h5>
                  </div>
                </div>
                <Download className="h-4 w-4 text-gray-400" />
              </div>
              
              <p className="text-xs text-gray-600 mb-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type.toUpperCase()}
                </span>
                {item.size && (
                  <span className="text-xs text-gray-500">{item.size}</span>
                )}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 font-mono truncate">
                {item.filename}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const downloadAllFiles = () => {
    [...downloadItems, ...figureItems].forEach((item, index) => {
      setTimeout(() => {
        handleDownload(item);
      }, index * 500); // Stagger downloads to avoid browser blocking
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Download Center</CardTitle>
          <button
            onClick={downloadAllFiles}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download All</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Download all Step 2 output files and figures
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <DownloadGrid items={downloadItems} title="Data Files" />
          <DownloadGrid items={figureItems} title="Quality Figures" />
        </div>
        
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                <Download className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-800">
                Download Information
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                All files are available for download in their original formats. 
                Use these files for further analysis, reporting, or integration with other bioinformatics tools.
                File sizes are approximate and may vary.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};