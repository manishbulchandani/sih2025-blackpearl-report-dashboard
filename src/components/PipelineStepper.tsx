import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  key: string;
}

interface PipelineStepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepId: number) => void;
}

const PipelineStepper: React.FC<PipelineStepperProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  const canGoPrevious = currentStep > 1;
  const canGoNext = currentStep < steps.length;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onStepChange(currentStep + 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    onStepChange(stepId);
  };

  return (
    <div className="space-y-6">
      {/* Step Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isAccessible = step.id <= currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-5 left-1/2 w-full h-0.5 -z-10">
                    <div
                      className={`h-full transition-colors duration-300 ${
                        isCompleted ? 'bg-slate-600' : 'bg-gray-200'
                      }`}
                      style={{ width: '100%', marginLeft: '20px' }}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <button
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-600 text-white ring-4 ring-slate-100'
                      : isCompleted
                      ? 'bg-slate-600 text-white hover:bg-slate-700'
                      : isAccessible
                      ? 'bg-white border-2 border-gray-300 text-gray-500 hover:border-slate-300'
                      : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </button>

                {/* Step Label */}
                <div className="mt-3 text-center max-w-32">
                  <p
                    className={`text-xs font-medium ${
                      isActive
                        ? 'text-slate-600'
                        : isCompleted
                        ? 'text-slate-600'
                        : 'text-gray-500'
                    }`}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={`text-xs mt-1 leading-tight ${
                      isActive
                        ? 'text-gray-900 font-medium'
                        : isCompleted
                        ? 'text-gray-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            canGoPrevious
              ? 'text-slate-600 hover:bg-slate-50 border border-slate-200'
              : 'text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1]?.name}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            canGoNext
              ? 'text-white bg-slate-600 hover:bg-slate-700'
              : 'text-gray-400 bg-gray-200 cursor-not-allowed'
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default PipelineStepper;