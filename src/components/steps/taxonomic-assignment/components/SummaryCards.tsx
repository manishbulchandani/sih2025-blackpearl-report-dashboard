import React from 'react';
import { Dna, Target, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';

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

interface SummaryCardsProps {
  assignmentSummary: AssignmentSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ assignmentSummary }) => {
  if (!assignmentSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const assignmentRate = assignmentSummary.assignment_rate * 100;
  const noveltyRate = (assignmentSummary.novelty_candidates / assignmentSummary.total_asvs) * 100;

  const cards = [
    {
      title: 'Total ASVs',
      value: assignmentSummary.total_asvs.toLocaleString(),
      icon: Dna,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: 'Processed sequences'
    },
    {
      title: 'Assigned Taxa',
      value: assignmentSummary.assigned_count.toLocaleString(),
      icon: Target,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      subtitle: `${assignmentRate.toFixed(1)}% assignment rate`
    },
    {
      title: 'High Confidence',
      value: assignmentSummary.confidence_distribution.high.toLocaleString(),
      icon: CheckCircle,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitle: 'Reliable assignments'
    },
    {
      title: 'Medium Confidence',
      value: assignmentSummary.confidence_distribution.medium.toLocaleString(),
      icon: TrendingUp,
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      subtitle: 'Moderate confidence'
    },
    {
      title: 'Low Confidence',
      value: assignmentSummary.confidence_distribution.low.toLocaleString(),
      icon: AlertTriangle,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      subtitle: 'Uncertain assignments'
    },
    {
      title: 'Novelty Candidates',
      value: assignmentSummary.novelty_candidates.toLocaleString(),
      icon: Users,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtitle: `${noveltyRate.toFixed(1)}% of total ASVs`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mr-4`}>
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;