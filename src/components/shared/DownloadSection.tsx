import React from 'react';
import { Download, FileText, Archive } from 'lucide-react';

interface DownloadSectionProps {
  downloads: {
    category: string;
    items: {
      name: string;
      description: string;
      filename: string;
      size?: string;
      type: 'json' | 'html' | 'csv' | 'zip' | 'fastq' | 'env' | 'log';
    }[];
  }[];
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ downloads }) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'json':
      case 'csv':
      case 'env':
        return FileText;
      case 'html':
        return FileText;
      case 'zip':
        return Archive;
      case 'fastq':
        return FileText;
      case 'log':
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'json':
        return 'bg-blue-100 text-blue-800';
      case 'html':
        return 'bg-orange-100 text-orange-800';
      case 'csv':
        return 'bg-green-100 text-green-800';
      case 'zip':
        return 'bg-purple-100 text-purple-800';
      case 'fastq':
        return 'bg-indigo-100 text-indigo-800';
      case 'env':
        return 'bg-gray-100 text-gray-800';
      case 'log':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (filename: string) => {
    // Create download link for files in public/data
    const link = document.createElement('a');
    link.href = `/data/${filename}`;
    link.download = filename.split('/').pop() || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Download className="w-5 h-5 mr-2" />
        Download Files
      </h3>
      
      <div className="space-y-6">
        {downloads.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h4 className="text-md font-medium text-gray-700 mb-3">{category.category}</h4>
            <div className="grid grid-cols-1 gap-3">
              {category.items.map((item, itemIndex) => {
                const Icon = getIconForType(item.type);
                const typeColor = getTypeColor(item.type);
                
                return (
                  <div 
                    key={itemIndex}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <Icon className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${typeColor}`}>
                            {item.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.size && (
                          <p className="text-xs text-gray-500">{item.size}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(item.filename)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadSection;