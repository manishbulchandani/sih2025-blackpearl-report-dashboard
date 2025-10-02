import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Network, Download, Eye } from 'lucide-react';

export const ComparativeNetworks: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Comparative Networks
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Network analysis of co-occurrence patterns and functional interactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Visualization Placeholder */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Network Visualization</h4>
            <p className="text-gray-600 mb-4">
              Interactive network plots showing ASV co-occurrence and functional relationships
            </p>
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
              <p className="text-sm text-gray-500 mb-2">
                Network analysis features:
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• ASV co-occurrence networks</li>
                <li>• Functional pathway interactions</li>
                <li>• Cluster-based connectivity</li>
                <li>• Hub species identification</li>
                <li>• Community detection</li>
              </ul>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Network Nodes</h5>
              <div className="text-2xl font-bold text-blue-600">211</div>
              <div className="text-sm text-blue-700">ASVs</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">Connections</h5>
              <div className="text-2xl font-bold text-green-600">1,247</div>
              <div className="text-sm text-green-700">Edges</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-2">Communities</h5>
              <div className="text-2xl font-bold text-purple-600">11</div>
              <div className="text-sm text-purple-700">Detected</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-medium text-orange-900 mb-2">Modularity</h5>
              <div className="text-2xl font-bold text-orange-600">0.75</div>
              <div className="text-sm text-orange-700">Score</div>
            </div>
          </div>

          {/* Optional: Static Network Image */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Pre-generated Network Plot</h4>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                Static network visualization would be displayed here
              </p>
              <p className="text-sm text-gray-500 mt-2">
                File: comparison/plots/network.png
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};