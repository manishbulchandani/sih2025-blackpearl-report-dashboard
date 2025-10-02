import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface WarningsPanelProps {
  warnings: string[];
  onDismiss?: (index: number) => void;
}

const WarningsPanel: React.FC<WarningsPanelProps> = ({ warnings, onDismiss }) => {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-2">Quality Warnings</h3>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-center justify-between text-sm text-red-700">
                <span>• {warning}</span>
                {onDismiss && (
                  <button
                    onClick={() => onDismiss(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WarningsPanel;