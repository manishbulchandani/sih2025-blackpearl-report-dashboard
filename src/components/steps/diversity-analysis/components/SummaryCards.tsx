import React from 'react';
import { Card, CardContent } from '../../../shared/Card';
import { TrendingUp, Users, Route, Dna } from 'lucide-react';

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

interface AlphaDiversity {
  richness: number;
  shannon: number;
  simpson: number;
  evenness: number;
  sample_id: string;
}

interface SummaryCardsProps {
  functionalData: FunctionalSummary;
  alphaData: AlphaDiversity;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ functionalData, alphaData }) => {
  const cards = [
    {
      title: 'Total ASVs Annotated',
      value: functionalData.total_asvs_annotated.toLocaleString(),
      subtitle: `${functionalData.annotation_coverage.toFixed(1)}% coverage`,
      icon: Dna,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Pathways Detected',
      value: functionalData.pathways_detected.toString(),
      subtitle: 'Functional pathways',
      icon: Route,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Shannon Diversity',
      value: alphaData.shannon.toFixed(2),
      subtitle: `Richness: ${alphaData.richness}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Top Category',
      value: functionalData.top_categories[0]?.category || 'N/A',
      subtitle: `${functionalData.top_categories[0]?.percentage || 0}% of functions`,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className={`${card.bgColor} border-0`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.color} mb-1`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};