import React from 'react';
import { Network, Target, TrendingUp, Users, Circle, AlertTriangle } from 'lucide-react';

interface ClusterSummary {
  total_clusters: number;
  total_asvs: number;
  average_cluster_size: number;
  largest_cluster_size: number;
  smallest_cluster_size: number;
  singletons_count: number;
  cluster_sizes: Record<number, number>;
}

interface SummaryCardsProps {
  clusterSummary: ClusterSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ clusterSummary }) => {
  if (!clusterSummary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  const singletonRate = (clusterSummary.singletons_count / clusterSummary.total_clusters) * 100;

  const cards = [
    {
      title: 'Total Clusters',
      value: clusterSummary.total_clusters.toLocaleString(),
      icon: Network,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: 'Distinct groups formed'
    },
    {
      title: 'Total ASVs',
      value: clusterSummary.total_asvs.toLocaleString(),
      icon: Target,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      subtitle: 'Sequences clustered'
    },
    {
      title: 'Average Cluster Size',
      value: clusterSummary.average_cluster_size.toFixed(1),
      icon: TrendingUp,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtitle: 'ASVs per cluster'
    },
    {
      title: 'Largest Cluster',
      value: clusterSummary.largest_cluster_size.toLocaleString(),
      icon: Users,
      color: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      subtitle: 'Most populated cluster'
    },
    {
      title: 'Smallest Cluster',
      value: clusterSummary.smallest_cluster_size.toLocaleString(),
      icon: Circle,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      subtitle: 'Least populated cluster'
    },
    {
      title: 'Singleton Clusters',
      value: clusterSummary.singletons_count.toLocaleString(),
      icon: AlertTriangle,
      color: singletonRate > 50 ? 'bg-red-50' : 'bg-yellow-50',
      iconColor: singletonRate > 50 ? 'text-red-600' : 'text-yellow-600',
      subtitle: `${singletonRate.toFixed(1)}% of clusters`
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