import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Eye, Download, Search, Filter, Dna } from 'lucide-react';

interface AlignmentData {
  sequences: Array<{
    id: string;
    sequence: string;
    type: 'reference' | 'novel';
    gc_content: number;
    similarity_to_nearest: number;
    reads: number;
  }>;
  alignment_length: number;
  conserved_sites: number;
}

interface SequenceAlignmentViewerProps {
  data: AlignmentData;
}

export const SequenceAlignmentViewer: React.FC<SequenceAlignmentViewerProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');
  const [filterType, setFilterType] = useState<'all' | 'novel' | 'reference'>('all');
  const [selectedSequence, setSelectedSequence] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSequences = data.sequences.filter(seq => {
    const matchesFilter = filterType === 'all' || seq.type === filterType;
    const matchesSearch = seq.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSequencePreview = (sequence: string, length: number = 50) => {
    return sequence.substring(0, length) + (sequence.length > length ? '...' : '');
  };

  const getTypeColor = (type: 'reference' | 'novel') => {
    return type === 'novel' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const calculateConservationLevel = () => {
    // Mock conservation calculation
    const conservationScore = Math.random();
    if (conservationScore > 0.8) return 'high';
    if (conservationScore > 0.5) return 'medium';
    return 'low';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Sequence Alignment Viewer
            </CardTitle>
            <p className="text-gray-600 mt-1">
              MAFFT-aligned sequences with novel ASVs highlighted
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'overview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  viewMode === 'detailed' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'
                }`}
              >
                Detailed
              </button>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Alignment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Alignment Length</h4>
              <div className="text-2xl font-bold text-blue-600">{data.alignment_length}</div>
              <div className="text-sm text-blue-700">base pairs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Conserved Sites</h4>
              <div className="text-2xl font-bold text-green-600">{data.conserved_sites}</div>
              <div className="text-sm text-green-700">
                {((data.conserved_sites / data.alignment_length) * 100).toFixed(1)}% conservation
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Total Sequences</h4>
              <div className="text-2xl font-bold text-purple-600">{data.sequences.length}</div>
              <div className="text-sm text-purple-700">in alignment</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Novel ASVs</h4>
              <div className="text-2xl font-bold text-orange-600">
                {data.sequences.filter(s => s.type === 'novel').length}
              </div>
              <div className="text-sm text-orange-700">highlighted sequences</div>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sequences by ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'novel' | 'reference')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sequences</option>
                <option value="novel">Novel Only</option>
                <option value="reference">Reference Only</option>
              </select>
            </div>
          </div>

          {viewMode === 'overview' ? (
            /* Overview Mode */
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Sequence Overview</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sequence ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GC Content
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Similarity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sequence Preview
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSequences.slice(0, 10).map((sequence) => (
                      <tr key={sequence.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Dna className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{sequence.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTypeColor(sequence.type)}>
                            {sequence.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(sequence.gc_content * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(sequence.similarity_to_nearest * 100).toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sequence.reads.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                            {getSequencePreview(sequence.sequence, 20)}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => setSelectedSequence(sequence.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredSequences.length > 10 && (
                <div className="text-center">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Load More ({filteredSequences.length - 10} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Detailed Alignment View */
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Detailed Alignment View</h4>
              
              {selectedSequence ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900">Viewing: {selectedSequence}</h5>
                    <button
                      onClick={() => setSelectedSequence(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Close
                    </button>
                  </div>
                  
                  <div className="bg-white border rounded-lg p-4 overflow-x-auto">
                    <code className="text-xs font-mono whitespace-pre-wrap break-all">
                      {data.sequences.find(s => s.id === selectedSequence)?.sequence}
                    </code>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Multiple Sequence Alignment</h4>
                  <p className="text-gray-600 mb-4">
                    Interactive alignment viewer with conservation highlighting
                  </p>
                  
                  {/* Mock alignment visualization */}
                  <div className="bg-white rounded-lg p-4 max-w-4xl mx-auto overflow-x-auto">
                    <div className="space-y-1 font-mono text-xs">
                      {filteredSequences.slice(0, 8).map((seq) => (
                        <div key={seq.id} className="flex items-center gap-2">
                          <div className="w-24 text-right text-gray-600 flex-shrink-0">
                            {seq.id.substring(0, 12)}
                          </div>
                          <div className="flex-1 bg-gray-100 p-1 rounded">
                            {getSequencePreview(seq.sequence, 80).split('').map((base, baseIndex) => (
                              <span
                                key={baseIndex}
                                className={`${
                                  seq.type === 'novel' 
                                    ? 'bg-green-200 text-green-900' 
                                    : calculateConservationLevel() === 'high'
                                    ? 'bg-blue-200 text-blue-900'
                                    : calculateConservationLevel() === 'medium'
                                    ? 'bg-yellow-200 text-yellow-900'
                                    : 'text-gray-700'
                                }`}
                              >
                                {base}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Click on any sequence in the overview table to view full alignment details
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Download Options */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Download Alignment</h4>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                FASTA Format
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                PHYLIP Format
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Statistics CSV
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};