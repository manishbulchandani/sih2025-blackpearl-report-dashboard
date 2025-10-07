import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import StepContent from './StepContent';

const ReportDashboard: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Data Acquisition & Quality Control', key: 'data-acquisition' },
    { id: 2, name: 'ASV Inference & Abundance Profiling', key: 'asv-inference' },
    { id: 3, name: 'Taxonomic Assignment & Novelty Detection', key: 'taxonomic-assignment' },
    { id: 4, name: 'Clustering & Ecological Summary', key: 'clustering' },
    { id: 5, name: 'Diversity Analysis', key: 'diversity-analysis' },
    { id: 6, name: 'Comparative Analysis & Export', key: 'comparative-analysis' },
    { id: 7, name: 'Phylogenetic Alignment & Tree Construction', key: 'phylogenetic' },
    { id:8, name: 'Final Report', key: 'final-report' }
  ];

  const handleStepChange = (stepId: number) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        steps={steps}
        currentStep={currentStep}
        onStepChange={handleStepChange}
        reportId={reportId}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <StepContent 
          currentStep={currentStep} 
          stepKey={steps[currentStep - 1]?.key} 
        />
      </main>
    </div>
  );
};

export default ReportDashboard;