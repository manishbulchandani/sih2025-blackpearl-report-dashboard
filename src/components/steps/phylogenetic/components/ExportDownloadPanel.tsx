import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Download, FileText, TreePine, Image, Archive, BarChart3 } from 'lucide-react';

export const ExportDownloadPanel: React.FC = () => {
  const downloadItems = [
    {
      category: 'Sequence Files',
      icon: <FileText className="h-5 w-5" />,
      color: 'blue',
      items: [
        {
          name: 'Combined Sequences',
          file: 'combined_seqs.fasta',
          description: 'Reference + novel sequences merged',
          format: 'FASTA',
          size: '2.1 MB'
        },
        {
          name: 'Aligned Sequences',
          file: 'aligned_seqs.fasta',
          description: 'MAFFT-aligned sequences',
          format: 'FASTA',
          size: '2.8 MB'
        },
        {
          name: 'Novel Candidates',
          file: 'novel_candidates.fasta',
          description: 'High-priority novel ASVs only',
          format: 'FASTA',
          size: '156 KB'
        }
      ]
    },
    {
      category: 'Phylogenetic Trees',
      icon: <TreePine className="h-5 w-5" />,
      color: 'green',
      items: [
        {
          name: 'Phylogenetic Tree',
          file: 'phylogenetic_tree.nwk',
          description: 'FastTree-generated phylogeny',
          format: 'Newick',
          size: '45 KB'
        },
        {
          name: 'Tree with Support',
          file: 'tree_bootstrap.nwk',
          description: 'Tree with bootstrap support values',
          format: 'Newick',
          size: '52 KB'
        },
        {
          name: 'Tree Visualization',
          file: 'tree_plot.svg',
          description: 'Publication-ready tree figure',
          format: 'SVG',
          size: '234 KB'
        }
      ]
    },
    {
      category: 'Analysis Results',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'purple',
      items: [
        {
          name: 'Summary Report',
          file: 'phylo_summary.json',
          description: 'Complete analysis summary',
          format: 'JSON',
          size: '12 KB'
        },
        {
          name: 'Distance Matrix',
          file: 'distance_matrix.csv',
          description: 'Pairwise evolutionary distances',
          format: 'CSV',
          size: '89 KB'
        },
        {
          name: 'Candidate Statistics',
          file: 'candidate_stats.csv',
          description: 'Novel ASV detailed statistics',
          format: 'CSV',
          size: '34 KB'
        }
      ]
    },
    {
      category: 'Visualizations',
      icon: <Image className="h-5 w-5" />,
      color: 'orange',
      items: [
        {
          name: 'Tree PNG (High-res)',
          file: 'phylogenetic_tree_hires.png',
          description: '300 DPI publication figure',
          format: 'PNG',
          size: '1.2 MB'
        },
        {
          name: 'Alignment View',
          file: 'alignment_overview.png',
          description: 'Sequence alignment visualization',
          format: 'PNG',
          size: '890 KB'
        },
        {
          name: 'Candidate Highlights',
          file: 'novel_candidates_tree.png',
          description: 'Tree with novel ASVs highlighted',
          format: 'PNG',
          size: '756 KB'
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-900',
      green: 'from-green-50 to-green-100 border-green-200 text-green-900',
      purple: 'from-purple-50 to-purple-100 border-purple-200 text-purple-900',
      orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-900'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getButtonColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      green: 'bg-green-600 hover:bg-green-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      orange: 'bg-orange-600 hover:bg-orange-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Export & Download Center
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Download phylogenetic analysis results, trees, and publication-ready figures
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Download All
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Downloads */}
          <div className="bg-gradient-to-r from-blue-50 via-green-50 to-purple-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Quick Downloads</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <TreePine className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Complete Tree Package</div>
                  <div className="text-sm text-gray-600">Tree + alignment + metadata</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Novel Candidates</div>
                  <div className="text-sm text-gray-600">High-priority sequences only</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Image className="h-6 w-6 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Publication Figures</div>
                  <div className="text-sm text-gray-600">High-res images for papers</div>
                </div>
              </button>
            </div>
          </div>

          {/* Detailed Download Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {downloadItems.map((category) => (
              <div
                key={category.category}
                className={`bg-gradient-to-br ${getColorClasses(category.color)} rounded-lg border p-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-white rounded-lg`}>
                    {category.icon}
                  </div>
                  <h4 className="font-medium">{category.category}</h4>
                </div>
                
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div key={item.file} className="bg-white rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">{item.name}</div>
                          <div className="text-sm text-gray-600 mb-2">{item.description}</div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">{item.format}</span>
                            <span>{item.size}</span>
                          </div>
                        </div>
                        <button
                          className={`ml-3 px-3 py-1 ${getButtonColor(category.color)} text-white text-sm rounded-lg flex items-center gap-1`}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Export Options */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Custom Export Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">Tree Export Formats</h5>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-600">Include bootstrap values</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-gray-600">Color-code novel sequences</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Include branch lengths as labels</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-600">Collapse low-support branches</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-700">Figure Settings</h5>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Resolution (DPI)</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="150">150 (Web)</option>
                      <option value="300" selected>300 (Print)</option>
                      <option value="600">600 (High Quality)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Format</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="png">PNG</option>
                      <option value="svg">SVG</option>
                      <option value="pdf">PDF</option>
                      <option value="eps">EPS</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Generate Custom Export
              </button>
            </div>
          </div>

          {/* Citation & Usage */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="font-medium text-blue-900 mb-3">Citation & Usage Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-2">Software Used</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• MAFFT v7.490 (Multiple sequence alignment)</li>
                  <li>• FastTree v2.1.11 (Phylogenetic tree construction)</li>
                  <li>• DADA2 (ASV inference and processing)</li>
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-blue-800 mb-2">Analysis Parameters</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Alignment: MAFFT --auto</li>
                  <li>• Tree: FastTree -nt -gtr</li>
                  <li>• Bootstrap: 1000 replicates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};