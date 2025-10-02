import React from 'react';
import DataAcquisitionMain from './steps/data-acquisition/DataAcquisitionMain';
import ASVInferenceMain from './steps/asv-inference/ASVInferenceMain';
import TaxonomicAssignmentMain from './steps/taxonomic-assignment/TaxonomicAssignmentMain';
import ClusteringMain from './steps/clustering/ClusteringMain';
import DiversityAnalysisMain from './steps/diversity-analysis/DiversityAnalysisMain';
import ComparativeAnalysisMain from './steps/comparative-analysis/ComparativeAnalysisMain';
import CandidateSelectionMain from './steps/candidate-selection/CandidateSelectionMain';
import PhylogeneticMain from './steps/phylogenetic/PhylogeneticMain';
import FinalReportMain from './steps/final-report/FinalReportMain';

interface StepContentProps {
  currentStep: number;
  stepKey: string;
}

const StepContent: React.FC<StepContentProps> = ({ stepKey }) => {
  const renderStepContent = () => {
    switch (stepKey) {
      case 'data-acquisition':
        return <DataAcquisitionMain />;
      case 'asv-inference':
        return <ASVInferenceMain />;
      case 'taxonomic-assignment':
        return <TaxonomicAssignmentMain />;
      case 'clustering':
        return <ClusteringMain />;
      case 'diversity-analysis':
        return <DiversityAnalysisMain />;
      case 'comparative-analysis':
        return <ComparativeAnalysisMain />;
      case 'candidate-selection':
        return <CandidateSelectionMain />;
      case 'phylogenetic':
        return <PhylogeneticMain />;
      case 'final-report':
        return <FinalReportMain />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Step content not found</p>
              <p className="text-gray-400 text-sm mt-2">Please select a valid step</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-white">
      {renderStepContent()}
    </div>
  );
};

export default StepContent;