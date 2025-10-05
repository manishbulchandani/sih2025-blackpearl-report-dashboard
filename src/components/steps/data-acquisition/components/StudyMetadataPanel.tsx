import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../shared/Card';
import { Database, MapPin, Microscope, ExternalLink, Info, Dna, Globe } from 'lucide-react';

interface StudyMetadata {
  study_information: {
    title: string;
    bioproject: string;
    biosample: string;
    sra_study: string;
    sra_experiment: string;
    sra_run: string;
    submission_date: string;
    submitted_by: string;
    study_abstract: string;
  };
  sample_information: {
    sample_id: string;
    organism: string;
    taxonomy_id: string;
    environment: string;
    location: string;
    sample_type: string;
    target_community: string;
  };
  sequencing_information: {
    platform: string;
    library_name: string;
    library_strategy: string;
    read_length: string;
    target_gene: string;
    total_spots: number;
    total_bases: string;
  };
  identified_taxa: {
    major_groups: Array<{
      name: string;
      description: string;
      asv_count: number;
      percentage: number;
      ecological_role: string;
      common_members: string[];
    }>;
    ecological_context: {
      habitat: string;
      depth_range: string;
      environmental_factors: string;
      study_focus: string;
    };
  };
  ncbi_links: {
    bioproject: string;
    biosample: string;
    sra_study: string;
    sra_experiment: string;
    sra_run: string;
    taxonomy: string;
  };
}

const StudyMetadataPanel: React.FC = () => {
  const [metadata, setMetadata] = useState<StudyMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/data/study_metadata.json');
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error('Error loading study metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  if (loading || !metadata) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Study Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">
                  {metadata.study_information.title}
                </CardTitle>
                <p className="text-sm text-gray-700 mb-3">
                  {metadata.study_information.study_abstract}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {metadata.sample_information.organism}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {metadata.sequencing_information.target_gene}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {metadata.sequencing_information.platform}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Location</span>
              </div>
              <div className="text-gray-900 font-semibold">{metadata.sample_information.location}</div>
              <div className="text-sm text-gray-600">{metadata.sample_information.sample_type}</div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Microscope className="h-4 w-4" />
                <span className="font-medium">Target Community</span>
              </div>
              <div className="text-gray-900 font-semibold">{metadata.sample_information.target_community}</div>
              <div className="text-sm text-gray-600">{metadata.sample_information.environment}</div>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Database className="h-4 w-4" />
                <span className="font-medium">Sequencing</span>
              </div>
              <div className="text-gray-900 font-semibold">{metadata.sequencing_information.total_spots.toLocaleString()} reads</div>
              <div className="text-sm text-gray-600">{metadata.sequencing_information.read_length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NCBI Links Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-blue-600" />
            NCBI Database Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <a
              href={metadata.ncbi_links.bioproject}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">BioProject</div>
                <div className="text-xs text-gray-600">{metadata.study_information.bioproject}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
            
            <a
              href={metadata.ncbi_links.biosample}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">BioSample</div>
                <div className="text-xs text-gray-600">{metadata.study_information.biosample}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
            
            <a
              href={metadata.ncbi_links.sra_study}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">SRA Study</div>
                <div className="text-xs text-gray-600">{metadata.study_information.sra_study}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
            
            <a
              href={metadata.ncbi_links.sra_experiment}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">SRA Experiment</div>
                <div className="text-xs text-gray-600">{metadata.study_information.sra_experiment}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
            
            <a
              href={metadata.ncbi_links.sra_run}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">SRA Run</div>
                <div className="text-xs text-gray-600">{metadata.study_information.sra_run}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
            
            <a
              href={metadata.ncbi_links.taxonomy}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors group"
            >
              <div>
                <div className="text-sm font-medium text-gray-900">Taxonomy</div>
                <div className="text-xs text-gray-600">NCBI:{metadata.sample_information.taxonomy_id}</div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Identified Taxa Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dna className="h-5 w-5 text-green-600" />
            Identified Taxonomic Groups
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Major eukaryotic groups detected in {metadata.sample_information.location} marine sediment samples
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metadata.identified_taxa.major_groups.map((group, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === group.name ? null : group.name)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <Globe className={`h-6 w-6 ${
                        index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">{group.name}</div>
                      <div className="text-sm text-gray-600">{group.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{group.asv_count}</div>
                      <div className="text-xs text-gray-600">{group.percentage}% of ASVs</div>
                    </div>
                    <svg
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedSection === group.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {expandedSection === group.name && (
                  <div className="p-4 bg-white border-t border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Ecological Role</h4>
                        <p className="text-sm text-gray-600">{group.ecological_role}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Common Members</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.common_members.map((member, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {member}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ecological Context Card */}
      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-green-600" />
            Ecological Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Habitat Information</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Location:</strong> {metadata.identified_taxa.ecological_context.habitat}</p>
                <p><strong>Depth:</strong> {metadata.identified_taxa.ecological_context.depth_range}</p>
                <p><strong>Disturbance:</strong> {metadata.identified_taxa.ecological_context.environmental_factors}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Study Focus</h4>
              <p className="text-sm text-gray-600">
                {metadata.identified_taxa.ecological_context.study_focus}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyMetadataPanel;