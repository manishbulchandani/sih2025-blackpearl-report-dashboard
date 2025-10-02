import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';

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

interface Dada2Summary {
  total_ASVs: number;
  total_reads_final: number;
  mean_reads_per_ASV: number;
  read_retention_rate: number;
  chimera_proportion: number;
  sequence_lengths: {
    min: number;
    max: number;
    median: number;
  };
}

interface PlotsSectionProps {
  phase2Data: Phase2Summary;
  dada2Data: Dada2Summary;
}

interface ReadTrackingData {
  input: number;
  filtered: number;
  nonchim: number;
}

export const PlotsSection: React.FC<PlotsSectionProps> = ({ phase2Data, dada2Data }) => {
  const [readTrackingData, setReadTrackingData] = useState<ReadTrackingData | null>(null);

  useEffect(() => {
    const loadReadTracking = async () => {
      try {
        const response = await fetch('/data/asv_results/read_tracking.tsv');
        const text = await response.text();
        const lines = text.trim().split('\n');
        if (lines.length > 1) {
          const values = lines[1].split('\t');
          setReadTrackingData({
            input: parseInt(values[1]),
            filtered: parseInt(values[2]),
            nonchim: parseInt(values[3])
          });
        }
      } catch (error) {
        console.error('Error loading read tracking data:', error);
      }
    };

    loadReadTracking();
  }, []);

  // Abundance distribution data
  const abundanceData = useMemo(() => [
    { 
      category: 'High Abundance', 
      count: phase2Data.abundance_stats.high_abundance,
      color: '#10B981'
    },
    { 
      category: 'Medium Abundance', 
      count: phase2Data.abundance_stats.medium_abundance,
      color: '#3B82F6'
    },
    { 
      category: 'Low Abundance', 
      count: phase2Data.abundance_stats.low_abundance,
      color: '#F59E0B'
    },
    { 
      category: 'Singletons', 
      count: phase2Data.abundance_stats.singletons,
      color: '#EF4444'
    }
  ], [phase2Data]);

  // Chimera vs Non-chimera data
  const chimeraData = useMemo(() => [
    {
      name: 'Non-chimeric',
      value: 100 - phase2Data.chimera_rate,
      color: '#10B981'
    },
    {
      name: 'Chimeric',
      value: phase2Data.chimera_rate,
      color: '#EF4444'
    }
  ], [phase2Data]);

  // Sequence length distribution (simulated based on available stats)
  const sequenceLengthData = useMemo(() => {
    const mean = phase2Data.length_stats.mean;
    const std = phase2Data.length_stats.std;
    const min = dada2Data.sequence_lengths.min;
    const max = dada2Data.sequence_lengths.max;
    
    // Create bins for sequence length distribution
    const bins = [];
    const binSize = Math.max(5, Math.floor((max - min) / 10));
    
    for (let i = min; i <= max; i += binSize) {
      const binCenter = i + binSize / 2;
      const binEnd = Math.min(i + binSize, max);
      
      // Simulate normal distribution around mean
      const distance = Math.abs(binCenter - mean);
      const height = Math.exp(-(distance * distance) / (2 * std * std));
      const count = Math.round(height * phase2Data.asv_count * 0.1);
      
      bins.push({
        range: `${i}-${binEnd}`,
        count: count,
        length: binCenter
      });
    }
    
    return bins;
  }, [phase2Data, dada2Data]);

  // Read tracking flow data
  const readTrackingFlow = useMemo(() => {
    if (!readTrackingData) return [];
    
    return [
      { stage: 'Input', reads: readTrackingData.input, retention: 100 },
      { stage: 'Filtered', reads: readTrackingData.filtered, retention: (readTrackingData.filtered / readTrackingData.input * 100) },
      { stage: 'Non-chimeric', reads: readTrackingData.nonchim, retention: (readTrackingData.nonchim / readTrackingData.input * 100) }
    ];
  }, [readTrackingData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plots & Visualizations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Row 1: Abundance and Chimera charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Abundance Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">ASV Abundance Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={abundanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {abundanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chimera vs Non-chimeric */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Chimera Detection Results</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chimeraData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.value.toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chimeraData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Sequence length and read tracking */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sequence Length Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Sequence Length Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sequenceLengthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Read Tracking Flow */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Read Processing Pipeline</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={readTrackingFlow}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'reads' ? value.toLocaleString() : `${value.toFixed(1)}%`,
                      name === 'reads' ? 'Reads' : 'Retention %'
                    ]} 
                  />
                  <Legend />
                  <Bar dataKey="reads" fill="#3B82F6" name="Reads" />
                  <Bar dataKey="retention" fill="#10B981" name="Retention %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 3: Quality Profile Images */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Quality Profiles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Forward Reads (R1)</h5>
                  <img 
                    src="/data/figures/quality_profile_F.png" 
                    alt="Forward reads quality profile"
                    className="w-full h-auto border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Reverse Reads (R2)</h5>
                  <img 
                    src="/data/figures/quality_profile_R.png" 
                    alt="Reverse reads quality profile"
                    className="w-full h-auto border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Error Rate Profiles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Forward Reads (R1)</h5>
                  <img 
                    src="/data/figures/error_rates_F.png" 
                    alt="Forward reads error rates"
                    className="w-full h-auto border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Reverse Reads (R2)</h5>
                  <img 
                    src="/data/figures/error_rates_R.png" 
                    alt="Reverse reads error rates"
                    className="w-full h-auto border border-gray-200 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};