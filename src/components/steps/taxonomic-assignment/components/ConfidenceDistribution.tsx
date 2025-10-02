import React from 'react';
import { Chart } from '../../../shared/Chart';

interface AssignmentSummary {
  total_asvs: number;
  assigned_count: number;
  assignment_rate: number;
  confidence_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  novelty_candidates: number;
  kingdom_distribution: Record<string, number>;
}

interface ConfidenceDistributionProps {
  assignmentSummary: AssignmentSummary | null;
}

const ConfidenceDistribution: React.FC<ConfidenceDistributionProps> = ({ assignmentSummary }) => {
  if (!assignmentSummary) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const confidenceData = [
    {
      name: 'High',
      value: assignmentSummary.confidence_distribution.high,
      percentage: ((assignmentSummary.confidence_distribution.high / assignmentSummary.total_asvs) * 100).toFixed(1)
    },
    {
      name: 'Medium',
      value: assignmentSummary.confidence_distribution.medium,
      percentage: ((assignmentSummary.confidence_distribution.medium / assignmentSummary.total_asvs) * 100).toFixed(1)
    },
    {
      name: 'Low',
      value: assignmentSummary.confidence_distribution.low,
      percentage: ((assignmentSummary.confidence_distribution.low / assignmentSummary.total_asvs) * 100).toFixed(1)
    }
  ];

  return (
    <Chart
      type="pie"
      data={confidenceData}
      nameKey="name"
      valueKey="value"
      height={300}
      colors={['#10B981', '#F59E0B', '#EF4444']}
      formatTooltip={(value: any, name: string) => [`${value} ASVs (${confidenceData.find(d => d.name === name)?.percentage}%)`, name]}
      className="bg-white rounded-lg border border-gray-200"
    />
  );
};

export default ConfidenceDistribution;