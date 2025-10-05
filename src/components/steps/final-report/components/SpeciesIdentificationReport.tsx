import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Badge } from '../../../shared/Badge';
import { Alert, AlertDescription } from '../../../shared/Alert';
import { 
  FileText, Download, CheckCircle, TrendingUp, Database, 
  Microscope, Globe, BarChart3, PieChart, ExternalLink,
  AlertCircle, Info, Dna, TreePine, AlertTriangle
} from 'lucide-react';

interface TaxonomySummary {
  taxonomy_summary: {
    total_asvs: number;
    assigned: number;
    unassigned: number;
    assignment_rate: number;
  };
  major_taxonomic_groups: {
    [key: string]: {
      count: number;
      percentage: number;
      phyla?: any;
      classes?: any;
    };
  };
  ecological_insights: {
    dominant_groups: Array<{
      name: string;
      percentage: number;
      ecological_note: string;
    }>;
    biodiversity_notes: string[];
    trawling_impact_indicators: string[];
  };
  top_identified_asvs: Array<{
    asv_id: string;
    abundance: number;
    taxonomy: string;
    species_match: string;
    similarity: number;
    confidence: string;
    ecological_note: string;
  }>;
  novel_candidates_context: {
    total_novel: number;
    interpretation: string;
    phylogenetic_significance: string;
    research_value: string;
  };
}

interface StudyMetadata {
  study_information: {
    title: string;
    submitted_by: string;
    bioproject: string;
  };
  sample_information: {
    location: string;
    sample_type: string;
    target_community: string;
  };
  sequencing_information: {
    platform: string;
    target_gene: string;
    total_spots: number;
  };
}

const SpeciesIdentificationReport: React.FC = () => {
  const [taxonomy, setTaxonomy] = useState<TaxonomySummary | null>(null);
  const [metadata, setMetadata] = useState<StudyMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load taxonomy summary
        const taxResponse = await fetch('/data/taxonomy/detailed_taxonomy_summary.json');
        if (!taxResponse.ok) throw new Error('Failed to load taxonomy summary');
        const taxJson = await taxResponse.json();
        setTaxonomy(taxJson);

        // Load study metadata
        const metaResponse = await fetch('/data/study_metadata.json');
        if (!metaResponse.ok) throw new Error('Failed to load study metadata');
        const metaJson = await metaResponse.json();
        setMetadata(metaJson);

        setLoading(false);
      } catch (err) {
        console.error('Error loading species identification data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading species identification report...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error loading species identification data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!taxonomy || !metadata) {
    return null;
  }

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-3">
            <CheckCircle className="h-8 w-8" />
            Species Identification Report - {metadata.sample_information.location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{taxonomy.taxonomy_summary.total_asvs}</div>
              <div className="text-white/90 text-sm">Total ASVs Detected</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{taxonomy.taxonomy_summary.assigned}</div>
              <div className="text-white/90 text-sm">Species Identified</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{taxonomy.taxonomy_summary.assignment_rate}%</div>
              <div className="text-white/90 text-sm">Assignment Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{Object.keys(taxonomy.major_taxonomic_groups).length}</div>
              <div className="text-white/90 text-sm">Major Groups</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Identified Species */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-6 w-6 text-blue-600" />
            Top Identified Species
          </CardTitle>
          <p className="text-gray-600 mt-1">
            Most abundant organisms detected in {metadata.sample_information.sample_type}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxonomy.top_identified_asvs.map((asv, index) => (
              <div
                key={asv.asv_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-lg text-gray-900">{asv.species_match}</div>
                      <div className="text-sm text-gray-600">{asv.asv_id} • {asv.abundance.toLocaleString()} reads</div>
                    </div>
                  </div>
                  <Badge className={getConfidenceColor(asv.confidence)}>
                    {asv.similarity.toFixed(1)}% similarity • {asv.confidence} confidence
                  </Badge>
                </div>
                
                <div className="bg-gray-50 rounded p-3 mb-2">
                  <div className="text-xs text-gray-500 mb-1">Taxonomic Classification:</div>
                  <code className="text-xs text-gray-700">{asv.taxonomy}</code>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{asv.ecological_note}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Major Taxonomic Groups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-6 w-6 text-green-600" />
            Major Taxonomic Groups Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(taxonomy.major_taxonomic_groups).map(([groupName, group], index) => (
              <div
                key={groupName}
                className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 cursor-pointer transition-colors"
                onClick={() => setSelectedGroup(selectedGroup === groupName ? null : groupName)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Globe className={`h-6 w-6 ${
                      index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{group.count}</div>
                    <div className="text-sm text-gray-600">{group.percentage}%</div>
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{groupName}</h3>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${group.percentage}%` }}
                  />
                </div>
                
                {selectedGroup === groupName && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-600 space-y-1">
                      {group.phyla && Object.entries(group.phyla).map(([phylumName, phylum]: [string, any]) => (
                        <div key={phylumName} className="flex justify-between">
                          <span>{phylumName}</span>
                          <span className="font-medium">{phylum.count}</span>
                        </div>
                      ))}
                      {group.classes && Object.entries(group.classes).map(([className, classData]: [string, any]) => (
                        <div key={className} className="flex justify-between">
                          <span>{className}</span>
                          <span className="font-medium">{classData.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ecological Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Dominant Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taxonomy.ecological_insights.dominant_groups.map((group, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{group.name}</span>
                    <Badge className="bg-blue-100 text-blue-800">{group.percentage}%</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{group.ecological_note}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Environmental Impact Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taxonomy.ecological_insights.trawling_impact_indicators.map((indicator, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{indicator}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biodiversity Notes */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900">
            <Dna className="h-6 w-6" />
            Biodiversity Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {taxonomy.ecological_insights.biodiversity_notes.map((note, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Novel Candidates */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900">
            <TreePine className="h-6 w-6" />
            Novel Candidate Discovery
          </CardTitle>
          <p className="text-gray-700 mt-1">
            {taxonomy.novel_candidates_context.total_novel} unassigned sequences represent potential new species
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Interpretation</h4>
              <p className="text-sm text-gray-700">{taxonomy.novel_candidates_context.interpretation}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Phylogenetic Significance</h4>
              <p className="text-sm text-gray-700">{taxonomy.novel_candidates_context.phylogenetic_significance}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Research Value</h4>
              <p className="text-sm text-gray-700">{taxonomy.novel_candidates_context.research_value}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Citation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Study Citation & Data Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Study Title</h4>
              <p className="text-sm text-gray-700">{metadata.study_information.title}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Submitted By</h4>
              <p className="text-sm text-gray-700">{metadata.study_information.submitted_by}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">NCBI Accessions</h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://www.ncbi.nlm.nih.gov/bioproject/${metadata.study_information.bioproject}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200"
                >
                  {metadata.study_information.bioproject}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Download Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-gray-600" />
            Download Complete Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FileText className="h-5 w-5" />
              <span>PDF Report</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Database className="h-5 w-5" />
              <span>Species List (CSV)</span>
            </button>
            <button className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <BarChart3 className="h-5 w-5" />
              <span>Analysis Data (JSON)</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpeciesIdentificationReport;