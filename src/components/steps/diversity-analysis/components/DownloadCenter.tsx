import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Download, FileText, Image, Database, ChevronRight } from 'lucide-react';

export const DownloadCenter: React.FC = () => {
  const downloadItems = [
    {
      category: 'Functional Data',
      items: [
        {
          name: 'Alpha Diversity Metrics',
          description: 'Shannon, Simpson, and richness indices',
          file: 'alpha_diversity.csv',
          path: '/data/analysis_results/alpha_diversity.csv',
          icon: FileText,
          size: '2.1 KB',
          type: 'CSV'
        },
        {
          name: 'ASV Ecological Summary',
          description: 'Abundance, similarity, and cluster assignments',
          file: 'asv_ecological_summary.csv',
          path: '/data/analysis_results/asv_ecological_summary.csv',
          icon: Database,
          size: '45.2 KB',
          type: 'CSV'
        },
        {
          name: 'Clustering Summary',
          description: 'Cluster statistics and novelty scores',
          file: 'clustering_summary.json',
          path: '/data/analysis_results/clustering_summary.json',
          icon: FileText,
          size: '3.8 KB',
          type: 'JSON'
        }
      ]
    },
    {
      category: 'Visualizations',
      items: [
        {
          name: 'Clustering Visualization',
          description: 'Static cluster analysis plot',
          file: 'clustering_visualization.png',
          path: '/data/analysis_results/clustering_visualization.png',
          icon: Image,
          size: '156 KB',
          type: 'PNG'
        },
        {
          name: 'Interactive Dashboard',
          description: 'Complete interactive analysis dashboard',
          file: 'interactive_dashboard.html',
          path: '/data/dashboard/interactive_dashboard.html',
          icon: FileText,
          size: '2.3 MB',
          type: 'HTML'
        }
      ]
    },
    {
      category: 'Analysis Results',
      items: [
        {
          name: 'Complete Analysis Summary',
          description: 'Comprehensive analysis results and metrics',
          file: 'complete_analysis_summary.json',
          path: '/data/complete_analysis_summary.json',
          icon: Database,
          size: '5.4 KB',
          type: 'JSON'
        }
      ]
    }
  ];

  const handleDownload = (path: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = path;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // In a real app, you might want to show a toast notification
      alert('Download not available in this demo');
    }
  };

  const downloadAll = () => {
    downloadItems.forEach(category => {
      category.items.forEach(item => {
        setTimeout(() => handleDownload(item.path, item.file), 100);
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Download Center
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Access all diversity analysis outputs and visualizations
            </p>
          </div>
          <button
            onClick={downloadAll}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Download All
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {downloadItems.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h4 className="font-medium text-gray-900 border-b border-gray-200 pb-2">
                {category.category}
              </h4>
              <div className="grid gap-3">
                {category.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-gray-500">Size: {item.size}</span>
                            <span className="text-xs text-gray-500">File: {item.file}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(item.path, item.file)}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm font-medium">Download</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Summary Statistics */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-4">Download Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {downloadItems.reduce((acc, cat) => acc + cat.items.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {downloadItems.filter(cat => cat.category === 'Functional Data')[0]?.items.length || 0}
                </div>
                <div className="text-sm text-gray-600">Data Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {downloadItems.filter(cat => cat.category === 'Visualizations')[0]?.items.length || 0}
                </div>
                <div className="text-sm text-gray-600">Visualizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ~2.5 MB
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Usage Instructions</h5>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• CSV files can be opened in Excel, R, Python, or any data analysis tool</p>
              <p>• JSON files contain structured data for programmatic analysis</p>
              <p>• HTML files can be opened in any web browser for interactive exploration</p>
              <p>• PNG files are publication-ready static visualizations</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};