import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Download, FileText, Image, Database, Archive, ChevronRight } from 'lucide-react';

export const ExportCenter: React.FC = () => {
  const exportCategories = [
    {
      category: 'Comparative Analysis',
      items: [
        {
          name: 'Taxonomic Comparison Data',
          description: 'Taxa abundance matrix across clusters',
          file: 'taxonomic_comparison.csv',
          path: '/data/taxonomy/taxonomic_assignments.csv',
          icon: Database,
          size: '89.3 KB',
          type: 'CSV'
        },
        {
          name: 'Cluster Analysis Results',
          description: 'Complete cluster assignments and coordinates',
          file: 'cluster_analysis.csv',
          path: '/data/clustering/cluster_analysis.csv',
          icon: Database,
          size: '156.8 KB',
          type: 'CSV'
        },
        {
          name: 'Alpha Diversity Metrics',
          description: 'Shannon, Simpson, richness indices',
          file: 'alpha_diversity.csv',
          path: '/data/analysis_results/alpha_diversity.csv',
          icon: FileText,
          size: '2.1 KB',
          type: 'CSV'
        }
      ]
    },
    {
      category: 'Statistical Analysis',
      items: [
        {
          name: 'Differential Abundance',
          description: 'Significant differences between clusters',
          file: 'differential_abundance.csv',
          path: '/data/analysis_results/clustering_summary.json',
          icon: FileText,
          size: '45.7 KB',
          type: 'CSV'
        },
        {
          name: 'Venn Diagram Data',
          description: 'Shared and unique features analysis',
          file: 'venn_data.json',
          path: '/data/complete_analysis_summary.json',
          icon: FileText,
          size: '12.4 KB',
          type: 'JSON'
        }
      ]
    },
    {
      category: 'Visualizations',
      items: [
        {
          name: 'Clustering Visualization',
          description: 'UMAP/PCA cluster plots',
          file: 'clustering_visualization.png',
          path: '/data/analysis_results/clustering_visualization.png',
          icon: Image,
          size: '234.5 KB',
          type: 'PNG'
        },
        {
          name: 'Interactive Dashboard',
          description: 'Complete comparative analysis dashboard',
          file: 'comparative_dashboard.html',
          path: '/data/dashboard/interactive_dashboard.html',
          icon: FileText,
          size: '3.2 MB',
          type: 'HTML'
        }
      ]
    },
    {
      category: 'Complete Results',
      items: [
        {
          name: 'Final Analysis Package',
          description: 'All results in compressed archive',
          file: 'comparative_analysis_complete.zip',
          path: '/data/final_results/eDNA_analysis_results_20250928_182839.zip',
          icon: Archive,
          size: '15.7 MB',
          type: 'ZIP'
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
      alert('Download not available in this demo');
    }
  };

  const downloadAll = () => {
    exportCategories.forEach(category => {
      category.items.forEach(item => {
        setTimeout(() => handleDownload(item.path, item.file), 200);
      });
    });
  };

  const getTotalSize = () => {
    const sizes = exportCategories.flatMap(cat => 
      cat.items.map(item => {
        const size = item.size;
        const value = parseFloat(size);
        const unit = size.split(' ')[1];
        
        if (unit === 'MB') return value * 1024;
        if (unit === 'GB') return value * 1024 * 1024;
        return value; // KB
      })
    );
    
    const totalKB = sizes.reduce((sum, size) => sum + size, 0);
    return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${totalKB.toFixed(0)} KB`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Export Center
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Download all comparative analysis results and visualizations
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
          {exportCategories.map((category, categoryIndex) => (
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

          {/* Export Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-medium text-gray-900 mb-4">Export Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {exportCategories.reduce((acc, cat) => acc + cat.items.length, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {exportCategories.length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {getTotalSize()}
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  6
                </div>
                <div className="text-sm text-gray-600">File Types</div>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h5 className="font-medium text-yellow-900 mb-2">Data Usage Guidelines</h5>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>• CSV files are compatible with R, Python, Excel, and most statistical software</p>
              <p>• JSON files contain structured data for programmatic analysis</p>
              <p>• PNG files are publication-ready static visualizations</p>
              <p>• HTML files provide interactive exploration capabilities</p>
              <p>• ZIP archive contains the complete analysis package</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};