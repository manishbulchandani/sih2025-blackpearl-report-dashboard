import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { TreePine, Dna, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PhyloSummary {
  high_priority_candidates: number;
  broader_candidates: number;
  ready_for_phylogenetics: boolean;
  total_reference_sequences?: number;
  alignment_status?: string;
  tree_construction_status?: string;
  novel_sequences?: number;
}

interface PhylogeneticOverviewProps {
  data: PhyloSummary;
}

export const PhylogeneticOverview: React.FC<PhylogeneticOverviewProps> = ({ data }) => {
  const totalSequences = (data.total_reference_sequences || 0) + (data.novel_sequences || 0);
  
  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'not started':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'not started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Sequences */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Total Sequences</p>
              <p className="text-2xl font-bold text-blue-900">{totalSequences}</p>
              <p className="text-xs text-blue-700 mt-1">
                {data.total_reference_sequences || 0} reference + {data.novel_sequences || 0} novel
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center">
              <Dna className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Priority Novel ASVs */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">High-Priority Novel ASVs</p>
              <p className="text-2xl font-bold text-green-900">{data.high_priority_candidates}</p>
              <p className="text-xs text-green-700 mt-1">
                Included in alignment
              </p>
            </div>
            <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center">
              <TreePine className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Broader Candidate Set */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 mb-1">Broader Candidate Set</p>
              <p className="text-2xl font-bold text-purple-900">{data.broader_candidates}</p>
              <p className="text-xs text-purple-700 mt-1">
                Total sequences considered
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <TreePine className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alignment Status */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 mb-1">Alignment Status</p>
              <div className="flex items-center gap-2 mt-2">
                {getStatusIcon(data.alignment_status || 'pending')}
                <Badge className={getStatusColor(data.alignment_status || 'pending')}>
                  {data.alignment_status || 'Pending'}
                </Badge>
              </div>
              <p className="text-xs text-orange-700 mt-2">
                MAFFT alignment process
              </p>
            </div>
            <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Status Cards */}
      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-teal-900">Phylogenetic Analysis Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-teal-800">Tree Construction</h4>
              <div className="flex items-center gap-2">
                {getStatusIcon(data.tree_construction_status || 'not started')}
                <Badge className={getStatusColor(data.tree_construction_status || 'not started')}>
                  {data.tree_construction_status || 'Not Started'}
                </Badge>
              </div>
              <p className="text-sm text-teal-700">FastTree phylogenetic analysis</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-teal-800">Analysis Ready</h4>
              <div className="flex items-center gap-2">
                {data.ready_for_phylogenetics ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Clock className="h-5 w-5 text-yellow-600" />
                )}
                <Badge className={data.ready_for_phylogenetics ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                  {data.ready_for_phylogenetics ? 'Ready' : 'Preparing'}
                </Badge>
              </div>
              <p className="text-sm text-teal-700">
                {data.ready_for_phylogenetics ? 'All data prepared for analysis' : 'Preparing sequences for phylogenetic analysis'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-900">Sequence Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {((data.novel_sequences || 0) / totalSequences * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-indigo-700">Novel sequences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {((data.total_reference_sequences || 0) / totalSequences * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-indigo-700">Reference sequences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {data.high_priority_candidates > 0 ? 
                  ((data.high_priority_candidates / data.broader_candidates) * 100).toFixed(1) : '0.0'
                }%
              </div>
              <div className="text-sm text-indigo-700">Priority candidates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};