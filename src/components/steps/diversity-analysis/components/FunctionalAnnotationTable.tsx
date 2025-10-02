import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Search, Download, ChevronDown, ChevronUp } from 'lucide-react';

interface ASVEcologicalData {
  asv_id: string;
  total_reads: number;
  samples_present: number;
  relative_abundance: number;
  similarity_score: number;
  cluster_id: number;
  novelty_candidate: boolean;
}

interface FunctionalAnnotationTableProps {
  asvData: ASVEcologicalData[];
}

// Mock functional annotation data
const generateFunctionalAnnotation = (asv: ASVEcologicalData) => {
  const functions = [
    'Glucose metabolism', 'Amino acid transport', 'DNA replication', 
    'Cell wall synthesis', 'ATP synthase', 'Ribosomal protein',
    'Membrane transport', 'Signal transduction', 'Oxidative phosphorylation',
    'Glycolysis', 'Fatty acid biosynthesis', 'RNA polymerase'
  ];
  
  const categories = [
    'Metabolism', 'Transport', 'Replication', 'Structure', 
    'Energy', 'Translation', 'Signaling'
  ];

  const confidence = asv.similarity_score > 0.35 ? 'High' : 
                   asv.similarity_score > 0.30 ? 'Medium' : 'Low';

  return {
    function_name: functions[Math.floor(Math.random() * functions.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    confidence,
    kegg_id: `K${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`
  };
};

export const FunctionalAnnotationTable: React.FC<FunctionalAnnotationTableProps> = ({ asvData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showOnlyAnnotated, setShowOnlyAnnotated] = useState(false);

  const enrichedData = useMemo(() => {
    return asvData.map(asv => ({
      ...asv,
      annotation: generateFunctionalAnnotation(asv)
    }));
  }, [asvData]);

  const filteredData = useMemo(() => {
    let filtered = enrichedData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.asv_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.annotation.function_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.annotation.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => 
        item.annotation.category === filterCategory
      );
    }

    // Annotation filter
    if (showOnlyAnnotated) {
      filtered = filtered.filter(item => 
        item.annotation.confidence !== 'Low'
      );
    }

    // Sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key.includes('annotation.')) {
          const annotationKey = sortConfig.key.split('.')[1];
          aValue = a.annotation[annotationKey as keyof typeof a.annotation];
          bValue = b.annotation[annotationKey as keyof typeof b.annotation];
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [enrichedData, searchTerm, sortConfig, filterCategory, showOnlyAnnotated]);

  const handleSort = (key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return <ChevronDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-blue-600" /> : 
      <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  const categories = Array.from(new Set(enrichedData.map(item => item.annotation.category)));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Functional Annotation Table
            </CardTitle>
            <p className="text-gray-600 mt-1">
              ASV-level functional assignments and confidence scores
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search ASVs, functions, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                checked={showOnlyAnnotated}
                onChange={(e) => setShowOnlyAnnotated(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Annotated only</span>
            </label>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {enrichedData.length} ASVs
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('asv_id')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">ASV ID</span>
                    <SortIcon column="asv_id" />
                  </div>
                </th>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('cluster_id')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Cluster</span>
                    <SortIcon column="cluster_id" />
                  </div>
                </th>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('annotation.function_name')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Function</span>
                    <SortIcon column="annotation.function_name" />
                  </div>
                </th>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('annotation.category')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Category</span>
                    <SortIcon column="annotation.category" />
                  </div>
                </th>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('annotation.confidence')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Confidence</span>
                    <SortIcon column="annotation.confidence" />
                  </div>
                </th>
                <th 
                  className="border border-gray-200 px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('relative_abundance')}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">Abundance</span>
                    <SortIcon column="relative_abundance" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 50).map((item, index) => (
                <tr key={item.asv_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-4 py-3 font-mono text-sm">
                    {item.asv_id}
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge className={`${item.cluster_id >= 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                      {item.cluster_id >= 0 ? `Cluster ${item.cluster_id}` : 'Unassigned'}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900">{item.annotation.function_name}</div>
                      <div className="text-sm text-gray-500">{item.annotation.kegg_id}</div>
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge className="bg-purple-100 text-purple-800">
                      {item.annotation.category}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    <Badge className={
                      item.annotation.confidence === 'High' ? 'bg-green-100 text-green-800' :
                      item.annotation.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {item.annotation.confidence}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-right">
                    {(item.relative_abundance * 100).toFixed(3)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length > 50 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Showing first 50 results. Use filters to refine your search.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};