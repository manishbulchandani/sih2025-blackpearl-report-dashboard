import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Copy, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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

interface ASVMapping {
  ASV_ID: string;
  Sequence: string;
  Length: number;
}

interface TablesSectionProps {
  phase2Data: Phase2Summary;
  dada2Data: Dada2Summary;
}

export const TablesSection: React.FC<TablesSectionProps> = ({ phase2Data, dada2Data }) => {
  const [asvMappingData, setAsvMappingData] = useState<ASVMapping[]>([]);
  const [abundanceData, setAbundanceData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'abundance' | 'mapping' | 'stats'>('abundance');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load ASV mapping data
        const mappingResponse = await fetch('/data/asv_results/asv_mapping.csv');
        const mappingText = await mappingResponse.text();
        const mappingLines = mappingText.trim().split('\n');
        
        const mappingData = mappingLines.slice(1).map(line => {
          const values = line.split(',');
          return {
            ASV_ID: values[0],
            Sequence: values[1],
            Length: parseInt(values[2])
          };
        });
        setAsvMappingData(mappingData);

        // Load abundance table data
        const abundanceResponse = await fetch('/data/asv_results/asv_table_ids.tsv');
        const abundanceText = await abundanceResponse.text();
        const abundanceLines = abundanceText.trim().split('\n');
        const abundanceHeaders = abundanceLines[0].split('\t');
        
        if (abundanceLines.length > 1) {
          const abundanceValues = abundanceLines[1].split('\t');
          const sampleData = abundanceHeaders.slice(1).map((header, index) => ({
            ASV_ID: header,
            Abundance: parseInt(abundanceValues[index + 1]) || 0
          }));
          setAbundanceData(sampleData);
        }
      } catch (error) {
        console.error('Error loading table data:', error);
      }
    };

    loadData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateSequence = (sequence: string, maxLength: number = 50) => {
    if (sequence.length <= maxLength) return sequence;
    return sequence.substring(0, maxLength) + '...';
  };

  // Filter and paginate data based on active tab
  const getFilteredData = () => {
    let data: any[] = [];
    
    if (activeTab === 'abundance') {
      data = abundanceData.filter(item =>
        item.ASV_ID.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === 'mapping') {
      data = asvMappingData.filter(item =>
        item.ASV_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.Sequence.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return data;
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Detailed stats data
  const detailedStats = [
    { metric: 'Total ASVs', value: phase2Data.asv_count.toLocaleString() },
    { metric: 'Total Reads (Final)', value: phase2Data.total_reads.toLocaleString() },
    { metric: 'Mean Reads per ASV', value: dada2Data.mean_reads_per_ASV.toFixed(1) },
    { metric: 'Retention Rate', value: `${phase2Data.retention_rate.toFixed(1)}%` },
    { metric: 'Chimera Rate', value: `${phase2Data.chimera_rate.toFixed(1)}%` },
    { metric: 'Min Sequence Length', value: `${dada2Data.sequence_lengths.min} bp` },
    { metric: 'Max Sequence Length', value: `${dada2Data.sequence_lengths.max} bp` },
    { metric: 'Median Sequence Length', value: `${dada2Data.sequence_lengths.median} bp` },
    { metric: 'Mean Sequence Length', value: `${phase2Data.length_stats.mean.toFixed(0)} bp` },
    { metric: 'Sequence Length CV', value: `${(phase2Data.length_stats.cv * 100).toFixed(1)}%` }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Tables</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('abundance')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'abundance'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ASV Abundance Table
          </button>
          <button
            onClick={() => setActiveTab('mapping')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'mapping'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ASV Mapping Table
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'stats'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Detailed Statistics
          </button>
        </div>

        {/* Search and Controls */}
        {activeTab !== 'stats' && (
          <div className="flex items-center justify-between mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'abundance' ? 'ASV IDs' : 'ASV IDs or sequences'}...`}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {filteredData.length} entries
              </span>
            </div>
          </div>
        )}

        {/* Table Content */}
        {activeTab === 'abundance' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASV ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Abundance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item: any, index) => {
                  const getCategory = (abundance: number) => {
                    if (abundance === 1) return { name: 'Singleton', color: 'error' };
                    if (abundance < 100) return { name: 'Low', color: 'warning' };
                    if (abundance < 1000) return { name: 'Medium', color: 'default' };
                    return { name: 'High', color: 'success' };
                  };

                  const category = getCategory(item.Abundance);

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.ASV_ID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.Abundance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={category.color as any}>{category.name}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'mapping' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASV ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sequence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Length (bp)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item: ASVMapping, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.ASV_ID}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                      <div className="flex items-center space-x-2">
                        <span className="max-w-xs truncate">
                          {truncateSequence(item.Sequence)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(item.Sequence)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Copy full sequence"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.Length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => copyToClipboard(item.Sequence)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Copy Sequence
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailedStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{stat.metric}</span>
                  <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {activeTab !== 'stats' && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:text-gray-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};