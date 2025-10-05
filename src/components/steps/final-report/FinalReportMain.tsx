import React from 'react';
import { FileText } from 'lucide-react';
import SpeciesIdentificationReport from './components/SpeciesIdentificationReport';

const FinalReportMain: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Final Report - Species Identification & Ecological Assessment
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analysis summary with identified species and ecological insights
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            Step 9 - Complete
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <SpeciesIdentificationReport />
        </div>
      </div>
    </div>
  );
};

export default FinalReportMain;