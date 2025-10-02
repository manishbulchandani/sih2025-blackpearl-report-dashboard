import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { ZoomIn, ZoomOut, Download, RotateCcw, Maximize, TreePine } from 'lucide-react';

interface TreeData {
  newick_string: string;
  node_count: number;
  leaf_count: number;
  root_id: string;
}

interface PhylogeneticTreeVisualizationProps {
  treeData: TreeData;
  novelCandidates: number;
}

interface TreeNode {
  id: string;
  name: string;
  type: 'novel' | 'reference';
  distance: number;
  children?: TreeNode[];
  reads?: number;
  similarity?: number;
}

export const PhylogeneticTreeVisualization: React.FC<PhylogeneticTreeVisualizationProps> = ({ 
  treeData, 
  novelCandidates 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [colorScheme, setColorScheme] = useState<'type' | 'distance' | 'reads'>('type');
  const svgRef = useRef<SVGSVGElement>(null);

  // Parse simple Newick string to create tree structure
  const parseNewick = (): TreeNode => {
    // This is a simplified parser for demonstration
    // In a real implementation, you'd use a proper Newick parser
    return {
      id: 'root',
      name: 'Root',
      type: 'reference',
      distance: 0,
      children: [
        {
          id: 'clade1',
          name: 'Novel Clade',
          type: 'novel',
          distance: 0.05,
          children: [
            { id: 'novel1', name: 'Novel_ASV_1', type: 'novel', distance: 0.02, reads: 234, similarity: 0.87 },
            { id: 'novel2', name: 'Novel_ASV_2', type: 'novel', distance: 0.03, reads: 156, similarity: 0.85 },
            { id: 'novel3', name: 'Novel_ASV_3', type: 'novel', distance: 0.04, reads: 189, similarity: 0.88 }
          ]
        },
        {
          id: 'clade2',
          name: 'Reference Clade',
          type: 'reference',
          distance: 0.03,
          children: [
            { id: 'ref1', name: 'Ref_1', type: 'reference', distance: 0.01, reads: 567, similarity: 0.95 },
            { id: 'ref2', name: 'Ref_2', type: 'reference', distance: 0.02, reads: 432, similarity: 0.94 },
            {
              id: 'subclade1',
              name: 'Mixed Subclade',
              type: 'reference',
              distance: 0.025,
              children: [
                { id: 'novel4', name: 'Novel_ASV_4', type: 'novel', distance: 0.015, reads: 298, similarity: 0.86 },
                { id: 'ref3', name: 'Ref_3', type: 'reference', distance: 0.01, reads: 623, similarity: 0.96 }
              ]
            }
          ]
        }
      ]
    };
  };

  const treeStructure = parseNewick();

  const getNodeColor = (node: TreeNode) => {
    switch (colorScheme) {
      case 'type':
        return node.type === 'novel' ? '#22c55e' : '#3b82f6';
      case 'distance':
        const intensity = Math.min(node.distance * 20, 1);
        return `rgba(239, 68, 68, ${intensity})`;
      case 'reads':
        if (!node.reads) return '#94a3b8';
        const readIntensity = Math.min(node.reads / 500, 1);
        return `rgba(147, 51, 234, ${readIntensity})`;
      default:
        return '#6b7280';
    }
  };

  const renderTreeNode = (node: TreeNode, x: number, y: number): React.JSX.Element => {
    const nodeRadius = node.children ? 4 : 6;
    const childSpacing = 80;
    const levelSpacing = 120;
    
    return (
      <g key={node.id}>
        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={getNodeColor(node)}
          stroke={selectedNode === node.id ? '#ef4444' : '#fff'}
          strokeWidth={selectedNode === node.id ? 3 : 1}
          className="cursor-pointer hover:stroke-orange-400 hover:stroke-2"
          onClick={() => setSelectedNode(node.id)}
        />
        
        {/* Node label */}
        {showLabels && !node.children && (
          <text
            x={x + 10}
            y={y + 5}
            fontSize="10"
            fill="#374151"
            className="font-medium"
          >
            {node.name}
          </text>
        )}
        
        {/* Children */}
        {node.children && node.children.map((child, index) => {
          const childX = x + levelSpacing;
          const childY = y + (index - (node.children!.length - 1) / 2) * childSpacing;
          
          return (
            <g key={child.id}>
              {/* Branch line */}
              <line
                x1={x}
                y1={y}
                x2={childX}
                y2={childY}
                stroke="#6b7280"
                strokeWidth="1"
                className="opacity-70"
              />
              
              {/* Branch length label */}
              <text
                x={(x + childX) / 2}
                y={y + (childY - y) / 2 - 5}
                fontSize="8"
                fill="#6b7280"
                textAnchor="middle"
                className="opacity-60"
              >
                {child.distance.toFixed(3)}
              </text>
              
              {renderTreeNode(child, childX, childY)}
            </g>
          );
        })}
      </g>
    );
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoomLevel(1);
    setSelectedNode(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Interactive Phylogenetic Tree
            </CardTitle>
            <p className="text-gray-600 mt-1">
              FastTree-generated phylogeny with novel ASVs highlighted
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value as 'type' | 'distance' | 'reads')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="type">Color by Type</option>
              <option value="distance">Color by Distance</option>
              <option value="reads">Color by Reads</option>
            </select>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                showLabels ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Labels
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tree Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{treeData.leaf_count}</div>
              <div className="text-sm text-blue-700">Leaf nodes</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">{novelCandidates}</div>
              <div className="text-sm text-green-700">Novel ASVs</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{treeData.node_count}</div>
              <div className="text-sm text-purple-700">Total nodes</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-orange-600">
                {((novelCandidates / treeData.leaf_count) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-orange-700">Novel proportion</div>
            </div>
          </div>

          {/* Tree Controls */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Tree Controls:</span>
              <button
                onClick={handleZoomIn}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Reset View"
              >
                <RotateCcw className="h-4 w-4 text-gray-600" />
              </button>
              <div className="text-sm text-gray-600">
                Zoom: {(zoomLevel * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Novel</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Reference</span>
              </div>
            </div>
          </div>

          {/* Tree Visualization */}
          <div className="bg-white border rounded-lg p-4 overflow-auto" style={{ minHeight: '500px' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="500"
              viewBox={`0 0 ${800 / zoomLevel} ${500 / zoomLevel}`}
              className="w-full"
            >
              <g transform={`translate(50, 250) scale(${zoomLevel})`}>
                {renderTreeNode(treeStructure, 0, 0)}
              </g>
            </svg>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-3">Selected Node Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-blue-700">Node ID:</span>
                  <div className="font-medium text-blue-900">{selectedNode}</div>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Branch Length:</span>
                  <div className="font-medium text-blue-900">0.025</div>
                </div>
                <div>
                  <span className="text-sm text-blue-700">Support Value:</span>
                  <div className="font-medium text-blue-900">0.87</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Export Tree</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                SVG Image
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                PNG Image
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Newick Format
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2">
                <Maximize className="h-4 w-4" />
                Full Screen
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};