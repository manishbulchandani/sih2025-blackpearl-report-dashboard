import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { BarChart3, Grid3X3, Download } from 'lucide-react';

interface FunctionalSummary {
  total_asvs_annotated: number;
  annotation_coverage: number;
  pathways_detected: number;
  top_categories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  functional_diversity: {
    unique_functions: number;
    functions_per_cluster: number[];
  };
}

interface PathwayAnalysisProps {
  data: FunctionalSummary;
}

// Mock pathway data
const generatePathwayData = (data: FunctionalSummary) => {
  const pathways = [
    { name: 'Glycolysis / Gluconeogenesis', id: 'ko00010' },
    { name: 'Citrate cycle (TCA cycle)', id: 'ko00020' },
    { name: 'Pentose phosphate pathway', id: 'ko00030' },
    { name: 'Fatty acid biosynthesis', id: 'ko00061' },
    { name: 'Amino acid metabolism', id: 'ko00270' },
    { name: 'Purine metabolism', id: 'ko00230' },
    { name: 'Cell wall biogenesis', id: 'ko00550' },
    { name: 'DNA replication', id: 'ko03030' },
    { name: 'Ribosome biogenesis', id: 'ko03008' },
    { name: 'Oxidative phosphorylation', id: 'ko00190' }
  ];

  return pathways.map((pathway) => ({
    ...pathway,
    abundance: Math.floor(Math.random() * 50) + 10,
    clusters: data.functional_diversity.functions_per_cluster.map(() => 
      Math.floor(Math.random() * 20) + 5
    ),
    coverage: Math.random() * 0.8 + 0.2,
    significance: Math.random() < 0.3 ? 'High' : Math.random() < 0.6 ? 'Medium' : 'Low'
  }));
};

export const PathwayAnalysis: React.FC<PathwayAnalysisProps> = ({ data }) => {
  const [viewType, setViewType] = useState<'bar' | 'heatmap'>('bar');
  const pathwayData = generatePathwayData(data);

  const maxAbundance = Math.max(...pathwayData.map(p => p.abundance));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Pathway Summary Analysis
            </CardTitle>
            <p className="text-gray-600 mt-1">
              Functional pathway abundances across clusters and communities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewType('bar')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'bar' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewType('heatmap')}
                className={`p-2 rounded-md transition-colors ${
                  viewType === 'heatmap' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewType === 'bar' ? (
          <div className="space-y-6">
            {/* Bar Chart View */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Pathway Abundance Distribution</h4>
              <div className="space-y-3">
                {pathwayData.slice(0, 8).map((pathway) => (
                  <div key={pathway.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700 min-w-0 flex-1">
                          {pathway.name}
                        </span>
                        <Badge className={
                          pathway.significance === 'High' ? 'bg-green-100 text-green-800' :
                          pathway.significance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {pathway.significance}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {pathway.abundance}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(pathway.abundance / maxAbundance) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {pathway.id} • {(pathway.coverage * 100).toFixed(1)}% coverage
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Pathways Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-3">Top Performing Pathways</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pathwayData
                  .sort((a, b) => b.abundance - a.abundance)
                  .slice(0, 3)
                  .map((pathway, index) => (
                    <div key={pathway.id} className="text-center">
                      <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                      <div className="text-sm font-medium text-blue-900">{pathway.name}</div>
                      <div className="text-xs text-blue-600">{pathway.abundance} abundance</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Heatmap View */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Pathway × Cluster Heatmap</h4>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="grid grid-cols-12 gap-1 text-xs">
                    {/* Header row */}
                    <div className="col-span-3"></div>
                    {data.functional_diversity.functions_per_cluster.map((_, index) => (
                      <div key={index} className="text-center font-medium text-gray-700 p-2">
                        C{index}
                      </div>
                    ))}
                    
                    {/* Data rows */}
                    {pathwayData.slice(0, 8).map((pathway) => (
                      <React.Fragment key={pathway.id}>
                        <div className="col-span-3 text-xs font-medium text-gray-700 p-2 truncate">
                          {pathway.name}
                        </div>
                        {pathway.clusters.map((value, clusterIndex) => {
                          const intensity = value / 25; // Normalize to 0-1
                          return (
                            <div
                              key={clusterIndex}
                              className="p-2 rounded text-center text-white text-xs font-medium"
                              style={{
                                backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                                color: intensity > 0.5 ? 'white' : 'black'
                              }}
                              title={`${pathway.name} - Cluster ${clusterIndex}: ${value}`}
                            >
                              {value}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Heatmap Legend */}
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Low</span>
                <div className="flex gap-1">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map(opacity => (
                    <div
                      key={opacity}
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                    />
                  ))}
                </div>
                <span>High</span>
              </div>
            </div>

            {/* Cluster Summary */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-3">Cluster Functional Diversity</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {data.functional_diversity.functions_per_cluster.slice(0, 8).map((count, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-purple-600">C{index}</div>
                    <div className="text-sm text-purple-900">{count} functions</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};