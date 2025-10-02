import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Users, BarChart3, Share2, TrendingUp, Target, Layers } from 'lucide-react';

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

interface ComparativeOverviewProps {
  data: ComparisonSummary;
}

export const ComparativeOverview: React.FC<ComparativeOverviewProps> = ({ data }) => {
  const cards = [
    {
      title: 'Clusters Compared',
      value: data.total_clusters.toString(),
      subtitle: `${data.total_asvs} total ASVs`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Top Taxa Difference',
      value: data.top_taxa_differences[0]?.taxon || 'N/A',
      subtitle: `${data.top_taxa_differences[0]?.cluster_difference.toFixed(1)}x fold change`,
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Shared Features',
      value: data.shared_asvs.toString(),
      subtitle: `${((data.shared_asvs / data.total_asvs) * 100).toFixed(1)}% overlap`,
      icon: Share2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      title: 'Top Function Diff',
      value: data.top_functional_differences[0]?.function || 'N/A',
      subtitle: `${data.top_functional_differences[0]?.fold_change.toFixed(1)}x fold change`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    },
    {
      title: 'Beta Diversity',
      value: data.diversity_metrics.overall_beta_diversity.toFixed(2),
      subtitle: 'Between-cluster diversity',
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      iconBg: 'bg-red-100'
    },
    {
      title: 'Unique ASVs',
      value: Math.max(...data.unique_asvs_per_cluster).toString(),
      subtitle: 'Max per cluster',
      icon: Layers,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Comparative Analysis Overview
        </CardTitle>
        <p className="text-gray-600 mt-1">
          Key metrics comparing clusters, taxa, and functional differences
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Additional Summary Stats */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Taxa Differences */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Top Taxonomic Differences</h4>
            <div className="space-y-3">
              {data.top_taxa_differences.slice(0, 3).map((taxa, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-green-500' : 
                      index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                    }`} />
                    <span className="font-medium text-gray-700">{taxa.taxon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{taxa.cluster_difference.toFixed(1)}x</span>
                    <Badge className={
                      taxa.significance === 'High' ? 'bg-red-100 text-red-800' :
                      taxa.significance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {taxa.significance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Functional Differences */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Top Functional Differences</h4>
            <div className="space-y-3">
              {data.top_functional_differences.slice(0, 3).map((func, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-orange-500' : 
                      index === 1 ? 'bg-red-500' : 'bg-pink-500'
                    }`} />
                    <span className="font-medium text-gray-700">{func.function}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{func.fold_change.toFixed(1)}x</span>
                    <Badge className={
                      func.significance === 'High' ? 'bg-red-100 text-red-800' :
                      func.significance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {func.significance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cluster Diversity Distribution */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">Cluster Diversity Distribution</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {data.diversity_metrics.cluster_diversity.map((diversity, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-blue-600">C{index}</div>
                <div className="text-sm text-blue-800">{diversity.toFixed(2)}</div>
                <div className="text-xs text-blue-600">Shannon</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};