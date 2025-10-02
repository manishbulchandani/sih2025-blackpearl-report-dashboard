import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Eye, Search, Filter, Download, TreePine, BarChart3 } from 'lucide-react';

interface NovelSequence {
  id: string;
  sequence: string;
  type: 'reference' | 'novel';
  gc_content: number;
  similarity_to_nearest: number;
  reads: number;
}

interface NovelCandidateExplorerProps {
  sequences: NovelSequence[];
  totalCandidates: number;
}

export const NovelCandidateExplorer: React.FC<NovelCandidateExplorerProps> = ({ 
  sequences, 
  totalCandidates 
}) => {
  const [sortBy, setSortBy] = useState<'reads' | 'similarity' | 'gc_content'>('reads');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Generate priority levels based on reads and similarity
  const getPriorityLevel = (sequence: NovelSequence): 'high' | 'medium' | 'low' => {
    if (sequence.reads > 200 && sequence.similarity_to_nearest < 0.90) return 'high';
    if (sequence.reads > 100 || sequence.similarity_to_nearest < 0.95) return 'medium';
    return 'low';
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
    }
  };

  // Filter and sort sequences
  const filteredSequences = sequences
    .filter(seq => {
      const matchesSearch = seq.id.toLowerCase().includes(searchTerm.toLowerCase());
      const priority = getPriorityLevel(seq);
      const matchesPriority = priorityFilter === 'all' || priority === priorityFilter;
      return matchesSearch && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'reads':
          return b.reads - a.reads;
        case 'similarity':
          return a.similarity_to_nearest - b.similarity_to_nearest;
        case 'gc_content':
          return Math.abs(0.5 - a.gc_content) - Math.abs(0.5 - b.gc_content);
        default:
          return 0;
      }
    });

  const priorityStats = {
    high: sequences.filter(seq => getPriorityLevel(seq) === 'high').length,
    medium: sequences.filter(seq => getPriorityLevel(seq) === 'medium').length,
    low: sequences.filter(seq => getPriorityLevel(seq) === 'low').length
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Novel Candidate Explorer
            </CardTitle>
            <p className="text-gray-600 mt-1">
              High-priority novel ASVs with detailed sequence statistics and tree navigation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-800">
              {sequences.length} novel sequences
            </Badge>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Priority Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Total Candidates</h4>
              <div className="text-2xl font-bold text-blue-600">{sequences.length}</div>
              <div className="text-sm text-blue-700">novel sequences</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium text-red-900 mb-2">High Priority</h4>
              <div className="text-2xl font-bold text-red-600">{priorityStats.high}</div>
              <div className="text-sm text-red-700">immediate interest</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-2">Medium Priority</h4>
              <div className="text-2xl font-bold text-yellow-600">{priorityStats.medium}</div>
              <div className="text-sm text-yellow-700">potential candidates</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Low Priority</h4>
              <div className="text-2xl font-bold text-green-600">{priorityStats.low}</div>
              <div className="text-sm text-green-700">background diversity</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search novel candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'reads' | 'similarity' | 'gc_content')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="reads">Read Count</option>
                <option value="similarity">Similarity</option>
                <option value="gc_content">GC Content</option>
              </select>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASV ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Similarity to Nearest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GC Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Samples Present
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSequences.slice(0, 15).map((sequence) => {
                  const priority = getPriorityLevel(sequence);
                  const samplesPresent = Math.floor(Math.random() * 5) + 1; // Mock data
                  
                  return (
                    <tr key={sequence.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPriorityIcon(priority)}</span>
                          <Badge className={getPriorityColor(priority)}>
                            {priority}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TreePine className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{sequence.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-900">{sequence.reads.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {(sequence.similarity_to_nearest * 100).toFixed(1)}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-red-500"
                              style={{ width: `${(1 - sequence.similarity_to_nearest) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(sequence.gc_content * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {samplesPresent} samples
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedCandidate(sequence.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Jump to Tree"
                          >
                            <TreePine className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Candidate Details */}
          {selectedCandidate && (
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-green-900">
                  Candidate Details: {selectedCandidate}
                </h4>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-green-700 hover:text-green-900"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Sequence Information</h5>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Length:</span>
                        <span className="font-medium">1,247 bp</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">GC Content:</span>
                        <span className="font-medium">
                          {(sequences.find(s => s.id === selectedCandidate)?.gc_content! * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Similarity:</span>
                        <span className="font-medium">
                          {(sequences.find(s => s.id === selectedCandidate)?.similarity_to_nearest! * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Abundance Information</h5>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Reads:</span>
                        <span className="font-medium">
                          {sequences.find(s => s.id === selectedCandidate)?.reads.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Relative Abundance:</span>
                        <span className="font-medium">0.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-606">Sample Prevalence:</span>
                        <span className="font-medium">3/5 samples</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Phylogenetic Context</h5>
                    <div className="bg-white rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        This ASV forms a distinct clade with other novel sequences, suggesting potential new taxa.
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                          View in Tree
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          View Alignment
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-800 mb-2">Nearest Reference</h5>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Closest match:</div>
                      <div className="font-medium text-gray-900 mb-2">Bacterium_XYZ_strain_123</div>
                      <div className="text-sm text-gray-600">
                        Distance: {(1 - sequences.find(s => s.id === selectedCandidate)?.similarity_to_nearest!).toFixed(3)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download High Priority
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                Export Tree Subset
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};