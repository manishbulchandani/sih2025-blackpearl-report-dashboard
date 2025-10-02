import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Eye, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

export const PathwayVisualization: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState<'network' | 'kegg'>('network');

  // Mock pathway network data
  const networkNodes = [
    { id: 'glucose', name: 'Glucose', type: 'substrate', x: 50, y: 100 },
    { id: 'g6p', name: 'Glucose-6-P', type: 'intermediate', x: 150, y: 100 },
    { id: 'f6p', name: 'Fructose-6-P', type: 'intermediate', x: 250, y: 100 },
    { id: 'fbp', name: 'Fructose-1,6-BP', type: 'intermediate', x: 350, y: 100 },
    { id: 'gap', name: 'Glyceraldehyde-3-P', type: 'intermediate', x: 450, y: 80 },
    { id: 'dhap', name: 'DHAP', type: 'intermediate', x: 450, y: 120 },
    { id: 'bpg', name: '1,3-Bisphosphoglycerate', type: 'intermediate', x: 550, y: 80 },
    { id: 'pg3', name: '3-Phosphoglycerate', type: 'intermediate', x: 650, y: 80 },
    { id: 'pyruvate', name: 'Pyruvate', type: 'product', x: 750, y: 100 },
  ];

  const networkConnections = [
    { from: 'glucose', to: 'g6p', enzyme: 'Hexokinase' },
    { from: 'g6p', to: 'f6p', enzyme: 'Phosphoglucose isomerase' },
    { from: 'f6p', to: 'fbp', enzyme: 'Phosphofructokinase' },
    { from: 'fbp', to: 'gap', enzyme: 'Aldolase' },
    { from: 'fbp', to: 'dhap', enzyme: 'Aldolase' },
    { from: 'gap', to: 'bpg', enzyme: 'Glyceraldehyde-3-P dehydrogenase' },
    { from: 'bpg', to: 'pg3', enzyme: 'Phosphoglycerate kinase' },
    { from: 'pg3', to: 'pyruvate', enzyme: 'Pyruvate kinase' },
  ];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleReset = () => setZoomLevel(100);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'substrate': return '#3b82f6'; // blue
      case 'product': return '#10b981'; // green
      case 'intermediate': return '#8b5cf6'; // purple
      default: return '#6b7280'; // gray
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Pathway Visualization
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Interactive pathway maps and functional networks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('network')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'network' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Network
              </button>
              <button
                onClick={() => setViewMode('kegg')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'kegg' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                KEGG Map
              </button>
            </div>
            <div className="flex gap-1">
              <button 
                onClick={handleZoomOut}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button 
                onClick={handleZoomIn}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button 
                onClick={handleReset}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
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
          {viewMode === 'network' ? (
            <div className="space-y-4">
              {/* Network Visualization */}
              <div className="bg-gray-50 rounded-lg p-4 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Glycolysis Pathway Network</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    Zoom: {zoomLevel}%
                  </Badge>
                </div>
                
                <div 
                  className="relative bg-white rounded border"
                  style={{ 
                    width: '800px', 
                    height: '300px',
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top left'
                  }}
                >
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {/* Draw connections */}
                    {networkConnections.map((conn, index) => {
                      const fromNode = networkNodes.find(n => n.id === conn.from);
                      const toNode = networkNodes.find(n => n.id === conn.to);
                      if (!fromNode || !toNode) return null;
                      
                      return (
                        <g key={index}>
                          <line
                            x1={fromNode.x + 40}
                            y1={fromNode.y + 20}
                            x2={toNode.x}
                            y2={toNode.y + 20}
                            stroke="#6b7280"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                          <text
                            x={(fromNode.x + toNode.x + 40) / 2}
                            y={(fromNode.y + toNode.y) / 2 + 10}
                            textAnchor="middle"
                            className="text-xs fill-gray-600"
                          >
                            {conn.enzyme}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Arrow marker definition */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#6b7280"
                        />
                      </marker>
                    </defs>
                  </svg>
                  
                  {/* Draw nodes */}
                  {networkNodes.map((node) => (
                    <div
                      key={node.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ left: node.x, top: node.y }}
                    >
                      <div
                        className="px-3 py-2 rounded-lg text-white text-xs font-medium shadow-lg hover:shadow-xl transition-shadow"
                        style={{ backgroundColor: getNodeColor(node.type) }}
                        title={`${node.name} (${node.type})`}
                      >
                        {node.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-3">Legend</h5>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('substrate') }} />
                    <span className="text-sm text-gray-700">Substrate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('intermediate') }} />
                    <span className="text-sm text-gray-700">Intermediate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: getNodeColor('product') }} />
                    <span className="text-sm text-gray-700">Product</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* KEGG Map Placeholder */}
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">KEGG Pathway Map</h4>
                <p className="text-gray-600 mb-4">
                  Interactive KEGG pathway visualization would be embedded here
                </p>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8">
                  <p className="text-sm text-gray-500">
                    When available, this section would display:
                  </p>
                  <ul className="text-sm text-gray-500 mt-2 space-y-1">
                    <li>• Interactive KEGG pathway maps</li>
                    <li>• Enzyme activity overlays</li>
                    <li>• Abundance-based color coding</li>
                    <li>• Clickable pathway components</li>
                  </ul>
                </div>
              </div>

              {/* Pathway Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Active Pathways</h5>
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-blue-700">pathways detected</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-medium text-green-900 mb-2">Coverage</h5>
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <div className="text-sm text-green-700">of known pathways</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">Enzymes</h5>
                  <div className="text-2xl font-bold text-purple-600">156</div>
                  <div className="text-sm text-purple-700">unique enzymes</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};