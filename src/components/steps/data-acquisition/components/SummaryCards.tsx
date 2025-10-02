import React from 'react';
import { FileText, TrendingUp, Zap, Activity, CheckCircle, AlertTriangle } from 'lucide-react';

interface SummaryCardsProps {
  dataAnalysis: any;
  phase1Summary: any;
  fastpReport: any;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ dataAnalysis, phase1Summary, fastpReport }) => {
  const retentionRate = phase1Summary?.retention_rate || 0;
  const isReady = phase1Summary?.ready_for_dada2 || false;
  const hasWarnings = phase1Summary?.quality_flags?.length > 0;

  const cards = [
    {
      title: 'Total Reads',
      value: fastpReport?.summary?.before_filtering?.total_reads?.toLocaleString() || 'N/A',
      subtitle: 'Before filtering',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Retention Rate',
      value: `${retentionRate.toFixed(1)}%`,
      subtitle: `${phase1Summary?.reads_retained?.toLocaleString() || 'N/A'} reads retained`,
      icon: TrendingUp,
      color: retentionRate > 90 ? 'green' : retentionRate > 80 ? 'yellow' : 'red'
    },
    {
      title: 'Quality Threshold',
      value: `Q${dataAnalysis?.automated_decisions?.quality_threshold || 'N/A'}`,
      subtitle: dataAnalysis?.automated_decisions?.quality_comment || 'Quality assessment',
      icon: Zap,
      color: 'purple'
    },
    {
      title: 'Mean Read Length',
      value: `${dataAnalysis?.r1_stats?.mean_length || 'N/A'}bp`,
      subtitle: `R2: ${dataAnalysis?.r2_stats?.mean_length || 'N/A'}bp`,
      icon: Activity,
      color: 'indigo'
    },
    {
      title: 'GC Content',
      value: `${((dataAnalysis?.r1_stats?.gc_content || 0) * 100).toFixed(1)}%`,
      subtitle: `R2: ${((dataAnalysis?.r2_stats?.gc_content || 0) * 100).toFixed(1)}%`,
      icon: Activity,
      color: 'teal'
    },
    {
      title: 'Pipeline Status',
      value: isReady ? 'Ready' : 'Needs Review',
      subtitle: hasWarnings ? `${phase1Summary?.quality_flags?.length} warnings` : 'All checks passed',
      icon: isReady ? CheckCircle : AlertTriangle,
      color: isReady ? 'green' : 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-600' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-900', icon: 'text-yellow-600' },
      red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', icon: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-600' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-900', icon: 'text-teal-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        const Icon = card.icon;
        
        return (
          <div key={index} className={`${colors.bg} rounded-lg border border-gray-200 p-6`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{card.value}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{card.subtitle}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;