import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface QualityPlotsProps {
  dataAnalysis: any;
  fastpReport: any;
}

const QualityPlots: React.FC<QualityPlotsProps> = ({ dataAnalysis, fastpReport }) => {
  const lengthDistributionData = useMemo(() => {
    if (!dataAnalysis?.r1_stats?.length_distribution) return [];
    
    const r1 = dataAnalysis.r1_stats.length_distribution;
    const r2 = dataAnalysis.r2_stats.length_distribution;
    
    return [
      { position: 'Q25', R1: r1.q25, R2: r2.q25 },
      { position: 'Median', R1: r1.median, R2: r2.median },
      { position: 'Q75', R1: r1.q75, R2: r2.q75 }
    ];
  }, [dataAnalysis]);

  const qualityComparisonData = useMemo(() => {
    if (!dataAnalysis) return [];
    
    return [
      {
        metric: 'Q20 Rate',
        R1: (dataAnalysis.r1_stats.q20_rate * 100).toFixed(1),
        R2: (dataAnalysis.r2_stats.q20_rate * 100).toFixed(1)
      },
      {
        metric: 'Q30 Rate', 
        R1: (dataAnalysis.r1_stats.q30_rate * 100).toFixed(1),
        R2: (dataAnalysis.r2_stats.q30_rate * 100).toFixed(1)
      },
      {
        metric: 'Mean Quality',
        R1: dataAnalysis.r1_stats.mean_quality.toFixed(1),
        R2: dataAnalysis.r2_stats.mean_quality.toFixed(1)
      }
    ];
  }, [dataAnalysis]);

  const retentionData = useMemo(() => {
    if (!fastpReport?.summary) return [];
    
    const before = fastpReport.summary.before_filtering.total_reads;
    const after = fastpReport.summary.after_filtering.total_reads;
    const discarded = before - after;
    
    return [
      { name: 'Retained', value: after, color: '#10B981' },
      { name: 'Discarded', value: discarded, color: '#EF4444' }
    ];
  }, [fastpReport]);

  const beforeAfterData = useMemo(() => {
    if (!fastpReport?.summary) return [];
    
    const before = fastpReport.summary.before_filtering;
    const after = fastpReport.summary.after_filtering;
    
    return [
      {
        stage: 'Before Filtering',
        'Total Reads': before.total_reads,
        'Q20 Rate': (before.q20_rate * 100).toFixed(1),
        'Q30 Rate': (before.q30_rate * 100).toFixed(1)
      },
      {
        stage: 'After Filtering',
        'Total Reads': after.total_reads,
        'Q20 Rate': (after.q20_rate * 100).toFixed(1),
        'Q30 Rate': (after.q30_rate * 100).toFixed(1)
      }
    ];
  }, [fastpReport]);

  const gcContentData = useMemo(() => {
    if (!dataAnalysis) return 0;
    return ((dataAnalysis.r1_stats.gc_content + dataAnalysis.r2_stats.gc_content) / 2 * 100).toFixed(1);
  }, [dataAnalysis]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Read Length Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Read Length Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lengthDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="R1" fill="#3B82F6" name="Read 1" />
              <Bar dataKey="R2" fill="#8B5CF6" name="Read 2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quality Score Comparison */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Score Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="R1" fill="#059669" name="Read 1" />
              <Bar dataKey="R2" fill="#7C3AED" name="Read 2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Retention Pie Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Read Retention</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={retentionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${((entry.value / retentionData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {retentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value.toLocaleString(), 'Reads']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* GC Content Gauge */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">GC Content</h3>
          <div className="flex items-center justify-center h-[250px]">
            <div className="relative w-40 h-40">
              <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                <div 
                  className="absolute inset-0 rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + (Number(gcContentData) / 100) * 50}% 0%, 100% 100%, 0% 100%)`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{gcContentData}%</div>
                    <div className="text-sm text-gray-600">GC Content</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before vs After Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtering Impact</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={beforeAfterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Q20 Rate" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Q30 Rate" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QualityPlots;