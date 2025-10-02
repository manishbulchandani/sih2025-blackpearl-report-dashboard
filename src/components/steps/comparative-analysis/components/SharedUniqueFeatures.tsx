import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Share2, Download, Eye } from 'lucide-react';

interface ComparisonSummary {
  total_clusters: number;
  total_asvs: number;
  shared_asvs: number;
  unique_asvs_per_cluster: number[];
  top_taxa_differences: Array<{
    taxon: string;
    cluster_difference: number;
    significance: string;
  }>;
  top_functional_differences: Array<{
    function: string;
    fold_change: number;
    significance: string;
  }>;
  diversity_metrics: {
    cluster_diversity: number[];
    overall_beta_diversity: number;
  };
}

interface SharedUniqueFeaturesProps {
  data: ComparisonSummary;
}

export const SharedUniqueFeatures: React.FC<SharedUniqueFeaturesProps> = ({ data }) => {
  const [viewType, setViewType] = useState<'venn' | 'upset'>('venn');
  const [featureType, setFeatureType] = useState<'asvs' | 'functions'>('asvs');

  // Generate mock Venn diagram data
  const vennData = {
    asvs: {
      cluster_overlaps: data.unique_asvs_per_cluster.length >= 3 ? [
        { clusters: [0, 1], count: 15, asvs: ['ASV1', 'ASV2', 'ASV15', 'ASV28', 'ASV41'] },
        { clusters: [0, 2], count: 12, asvs: ['ASV3', 'ASV7', 'ASV22', 'ASV35'] },
        { clusters: [1, 2], count: 18, asvs: ['ASV5', 'ASV12', 'ASV18', 'ASV31', 'ASV44'] },
        { clusters: [0, 1, 2], count: 8, asvs: ['ASV9', 'ASV16', 'ASV23', 'ASV38'] }
      ] : [
        { clusters: [0, 1], count: data.shared_asvs, asvs: ['ASV1', 'ASV2', 'ASV15'] }
      ],
      unique: data.unique_asvs_per_cluster.map((count, index) => ({
        cluster: index,
        count: Math.floor(count * 0.6), // 60% unique
        asvs: [`ASV${index}1`, `ASV${index}2`, `ASV${index}3`]
      }))
    },
    functions: {
      cluster_overlaps: [
        { clusters: [0, 1], count: 8, functions: ['Glycolysis', 'ATP synthesis', 'DNA repair'] },
        { clusters: [0, 2], count: 6, functions: ['Transport', 'Metabolism'] },
        { clusters: [1, 2], count: 10, functions: ['Signal transduction', 'Cell wall', 'Transcription'] },
        { clusters: [0, 1, 2], count: 4, functions: ['Core metabolism', 'Essential genes'] }
      ],
      unique: data.unique_asvs_per_cluster.map((_, index) => ({
        cluster: index,
        count: Math.floor(Math.random() * 15) + 5,
        functions: [`Function${index}A`, `Function${index}B`]
      }))
    }
  };

  const currentData = vennData[featureType];
  // const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Shared vs Unique Features
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Overlap analysis of ASVs and functional categories across clusters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={featureType}
              onChange={(e) => setFeatureType(e.target.value as 'asvs' | 'functions')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="asvs">ASVs</option>
              <option value="functions">Functions</option>
            </select>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('venn')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewType === 'venn' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Venn
              </button>
              <button
                onClick={() => setViewType('upset')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewType === 'upset' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                UpSet
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {viewType === 'venn' ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Venn Diagram Visualization */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  {featureType === 'asvs' ? 'ASV' : 'Functional'} Overlap Visualization
                </h4>
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                  <div className="relative w-80 h-64">
                    {data.unique_asvs_per_cluster.length >= 3 ? (
                      // Three-circle Venn diagram
                      <svg viewBox="0 0 300 200" className="w-full h-full">
                        {/* Circle 1 */}
                        <circle cx="100" cy="80" r="60" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
                        <text x="70" y="60" textAnchor="middle" className="text-xs font-medium fill-blue-700">
                          C0
                        </text>
                        
                        {/* Circle 2 */}
                        <circle cx="200" cy="80" r="60" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="2" />
                        <text x="230" y="60" textAnchor="middle" className="text-xs font-medium fill-green-700">
                          C1
                        </text>
                        
                        {/* Circle 3 */}
                        <circle cx="150" cy="140" r="60" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="2" />
                        <text x="150" y="175" textAnchor="middle" className="text-xs font-medium fill-purple-700">
                          C2
                        </text>
                        
                        {/* Intersection labels */}
                        <text x="120" y="85" textAnchor="middle" className="text-xs font-bold">
                          {currentData.cluster_overlaps.find(o => 
                            o.clusters.length === 2 && o.clusters.includes(0) && o.clusters.includes(1)
                          )?.count || 0}
                        </text>
                        <text x="180" y="85" textAnchor="middle" className="text-xs font-bold">
                          {currentData.cluster_overlaps.find(o => 
                            o.clusters.length === 2 && o.clusters.includes(1) && o.clusters.includes(2)
                          )?.count || 0}
                        </text>
                        <text x="125" y="115" textAnchor="middle" className="text-xs font-bold">
                          {currentData.cluster_overlaps.find(o => 
                            o.clusters.length === 2 && o.clusters.includes(0) && o.clusters.includes(2)
                          )?.count || 0}
                        </text>
                        <text x="150" y="105" textAnchor="middle" className="text-xs font-bold">
                          {currentData.cluster_overlaps.find(o => 
                            o.clusters.length === 3
                          )?.count || 0}
                        </text>
                      </svg>
                    ) : (
                      // Two-circle Venn diagram
                      <svg viewBox="0 0 300 200" className="w-full h-full">
                        <circle cx="120" cy="100" r="60" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" />
                        <circle cx="180" cy="100" r="60" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="2" />
                        <text x="90" y="105" textAnchor="middle" className="text-xs font-medium fill-blue-700">C0</text>
                        <text x="210" y="105" textAnchor="middle" className="text-xs font-medium fill-green-700">C1</text>
                        <text x="150" y="105" textAnchor="middle" className="text-xs font-bold">
                          {data.shared_asvs}
                        </text>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Overlap Details */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Overlap Details</h4>
                <div className="space-y-3">
                  {currentData.cluster_overlaps.map((overlap, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Share2 className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-700">
                            Clusters {overlap.clusters.join(', ')}
                          </span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {overlap.count} {featureType}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {featureType === 'asvs' ? 
                          `Examples: ${'asvs' in overlap ? overlap.asvs?.slice(0, 3).join(', ') : ''}...` :
                          `Examples: ${'functions' in overlap ? overlap.functions?.slice(0, 2).join(', ') : ''}...`
                        }
                      </div>
                    </div>
                  ))}
                </div>

                {/* Unique Features */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-3">Unique Features per Cluster</h5>
                  <div className="space-y-2">
                    {currentData.unique.slice(0, 5).map((unique, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-blue-700">Cluster {unique.cluster}</span>
                        <span className="font-medium text-blue-900">{unique.count} unique</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">UpSet Plot Representation</h4>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">UpSet Plot Visualization</h4>
                <p className="text-gray-600 mb-4">
                  Interactive UpSet plot would be displayed here for complex intersections
                </p>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    UpSet plot features:
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Set intersection matrix</li>
                    <li>• Interactive filtering</li>
                    <li>• Multiple set comparisons</li>
                    <li>• Detailed intersection analysis</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Total Shared</h5>
              <div className="text-2xl font-bold text-green-600">
                {currentData.cluster_overlaps.reduce((sum, overlap) => sum + overlap.count, 0)}
              </div>
              <div className="text-sm text-green-700">{featureType}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Total Unique</h5>
              <div className="text-2xl font-bold text-blue-600">
                {currentData.unique.reduce((sum, unique) => sum + unique.count, 0)}
              </div>
              <div className="text-sm text-blue-700">{featureType}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">Overlap %</h5>
              <div className="text-2xl font-bold text-purple-600">
                {featureType === 'asvs' ? 
                  ((data.shared_asvs / data.total_asvs) * 100).toFixed(1) :
                  '34.2'
                }%
              </div>
              <div className="text-sm text-purple-700">of total</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-medium text-orange-900 mb-2">Max Intersection</h5>
              <div className="text-2xl font-bold text-orange-600">
                {Math.max(...currentData.cluster_overlaps.map(o => o.count))}
              </div>
              <div className="text-sm text-orange-700">{featureType}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};