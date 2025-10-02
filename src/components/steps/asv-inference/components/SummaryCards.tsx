import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { FileText, Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface Phase2Summary {
  asv_count: number;
  total_reads: number;
  retention_rate: number;
  chimera_rate: number;
  quality_flags: string[];
  amplicon_type: string;
  length_stats: {
    mean: number;
    std: number;
    cv: number;
  };
  abundance_stats: {
    singletons: number;
    low_abundance: number;
    medium_abundance: number;
    high_abundance: number;
  };
  ready_for_phase3: boolean;
}

interface SummaryCardsProps {
  data: Phase2Summary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ data }) => {
  const cards = [
    {
      title: 'Total ASVs',
      value: data.asv_count.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Unique sequence variants detected'
    },
    {
      title: 'Reads Retained',
      value: data.total_reads.toLocaleString(),
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Final processed reads'
    },
    {
      title: 'Retention Rate',
      value: `${data.retention_rate.toFixed(1)}%`,
      icon: TrendingUp,
      color: data.retention_rate > 50 ? 'text-green-600' : 'text-orange-600',
      bgColor: data.retention_rate > 50 ? 'bg-green-50' : 'bg-orange-50',
      description: 'Reads passing quality filters'
    },
    {
      title: 'Chimera Rate',
      value: `${data.chimera_rate.toFixed(1)}%`,
      icon: AlertTriangle,
      color: data.chimera_rate < 20 ? 'text-green-600' : 'text-red-600',
      bgColor: data.chimera_rate < 20 ? 'bg-green-50' : 'bg-red-50',
      description: 'Chimeric sequences detected'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className={`${card.bgColor} rounded-lg p-3 mr-4`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Amplicon Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amplicon Type:</span>
                <Badge variant="default">{data.amplicon_type.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mean Length:</span>
                <span className="font-medium">{data.length_stats.mean.toFixed(0)} bp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Length CV:</span>
                <span className="font-medium">{(data.length_stats.cv * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Abundance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">High Abundance:</span>
                <span className="font-medium text-green-600">{data.abundance_stats.high_abundance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medium Abundance:</span>
                <span className="font-medium text-blue-600">{data.abundance_stats.medium_abundance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Abundance:</span>
                <span className="font-medium text-orange-600">{data.abundance_stats.low_abundance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Singletons:</span>
                <span className="font-medium text-red-600">{data.abundance_stats.singletons}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};