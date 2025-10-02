import React, { useMemo } from 'react';
import { Chart } from '../../../shared/Chart';

interface TaxonomicAssignment {
  asv_id: string;
  best_reference: string;
  similarity_score: number;
  confidence: string;
  taxonomic_assignment: string;
  novelty_candidate: boolean;
}

interface SimilarityDistributionProps {
  taxonomicData: TaxonomicAssignment[];
}

const SimilarityDistribution: React.FC<SimilarityDistributionProps> = ({ taxonomicData }) => {
  const histogramData = useMemo(() => {
    if (!taxonomicData || taxonomicData.length === 0) return [];

    // Create bins for similarity scores
    const bins = [
      { range: '0.0-0.1', min: 0.0, max: 0.1, count: 0 },
      { range: '0.1-0.2', min: 0.1, max: 0.2, count: 0 },
      { range: '0.2-0.3', min: 0.2, max: 0.3, count: 0 },
      { range: '0.3-0.4', min: 0.3, max: 0.4, count: 0 },
      { range: '0.4-0.5', min: 0.4, max: 0.5, count: 0 },
      { range: '0.5-0.6', min: 0.5, max: 0.6, count: 0 },
      { range: '0.6-0.7', min: 0.6, max: 0.7, count: 0 },
      { range: '0.7-0.8', min: 0.7, max: 0.8, count: 0 },
      { range: '0.8-0.9', min: 0.8, max: 0.9, count: 0 },
      { range: '0.9-1.0', min: 0.9, max: 1.0, count: 0 }
    ];

    // Count ASVs in each bin
    taxonomicData.forEach(asv => {
      const score = asv.similarity_score;
      const binIndex = Math.min(Math.floor(score * 10), 9);
      bins[binIndex].count++;
    });

    return bins.map(bin => ({
      name: bin.range,
      value: bin.count,
      isNovelty: bin.max <= 0.7 // Highlight novelty threshold
    }));
  }, [taxonomicData]);

  if (!taxonomicData || taxonomicData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Similarity Score Distribution</h3>
        <p className="text-sm text-gray-600 mt-1">
          Distribution of ASV similarity scores (red bars indicate potential novelty candidates &lt; 0.7)
        </p>
      </div>
      <div className="p-4">
        <Chart
          type="histogram"
          data={histogramData}
          xKey="name"
          yKey="value"
          height={300}
          colors={['#3B82F6']}
          formatTooltip={(value: any, name: string) => [`${value} ASVs`, `Similarity ${name}`]}
          showLegend={false}
        />
      </div>
    </div>
  );
};

export default SimilarityDistribution;