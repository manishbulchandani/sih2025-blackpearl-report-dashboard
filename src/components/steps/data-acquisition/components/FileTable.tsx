import React from 'react';
import { Folder, FileText } from 'lucide-react';

interface FileTableProps {
  files: {
    name: string;
    size: string;
    type: 'fastq' | 'directory' | 'other';
    path: string;
    description?: string;
  }[];
  title: string;
  description?: string;
}

const FileTable: React.FC<FileTableProps> = ({ files, title, description }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'directory':
        return <Folder className="w-4 h-4 text-blue-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleDownload = (filePath: string) => {
    const link = document.createElement('a');
    link.href = `/data/${filePath}`;
    link.download = filePath.split('/').pop() || filePath;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {files.map((file, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {getIcon(file.type)}
                    <span className="text-sm font-medium text-gray-900">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {file.size}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {file.description || 'No description available'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {file.type !== 'directory' && (
                    <button
                      onClick={() => handleDownload(file.path)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Download
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileTable;