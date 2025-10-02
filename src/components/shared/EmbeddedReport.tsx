import React, { useState } from 'react';
import { ExternalLink, FileText, Eye, EyeOff } from 'lucide-react';

interface EmbeddedReportProps {
  title: string;
  description: string;
  htmlFile: string;
  type: 'multiqc' | 'fastqc' | 'fastp';
}

const EmbeddedReport: React.FC<EmbeddedReportProps> = ({ title, description, htmlFile, type }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const getReportUrl = () => {
    return `/data/${htmlFile}`;
  };

  const openInNewTab = () => {
    window.open(getReportUrl(), '_blank');
  };

  const getTypeColor = () => {
    switch (type) {
      case 'multiqc':
        return 'bg-blue-100 text-blue-800';
      case 'fastqc':
        return 'bg-green-100 text-green-800';
      case 'fastp':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor()}`}>
              {type.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            </button>
            <button
              onClick={openInNewTab}
              className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open</span>
            </button>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="relative">
          {!isIframeLoaded && (
            <div className="flex items-center justify-center h-96 bg-gray-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading report...</p>
              </div>
            </div>
          )}
          <iframe
            src={getReportUrl()}
            className={`w-full h-96 border-0 ${!isIframeLoaded ? 'hidden' : ''}`}
            onLoad={() => setIsIframeLoaded(true)}
            title={title}
          />
        </div>
      )}
    </div>
  );
};

export default EmbeddedReport;