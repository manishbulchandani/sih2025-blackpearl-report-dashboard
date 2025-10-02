import React from "react";
import {
  Database,
  BarChart3,
  Search,
  Network,
  PieChart,
  Target,
  GitBranch,
  FileText,
  ChevronRight,
} from "lucide-react";

interface Step {
  id: number;
  name: string;
  key: string;
}

interface SidebarProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (stepId: number) => void;
  reportId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  steps,
  currentStep,
  onStepChange,
  reportId,
}) => {
  const getStepIcon = (stepId: number) => {
    const iconClass = "w-5 h-5";
    switch (stepId) {
      case 1:
        return <Database className={iconClass} />;
      case 2:
        return <BarChart3 className={iconClass} />;
      case 3:
        return <Search className={iconClass} />;
      case 4:
        return <Network className={iconClass} />;
      case 5:
        return <PieChart className={iconClass} />;
      case 6:
        return <Target className={iconClass} />;
      case 7:
        return <GitBranch className={iconClass} />;
      case 8:
        return <FileText className={iconClass} />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="w-80 bg-slate-800 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              Report Dashboard
            </h1>
            <p className="text-sm text-slate-300">ID: {reportId}</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-300">
            {currentStep} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps Navigation */}
      <div
        className="flex-1 overflow-y-auto p-4 sidebar-scroll"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <nav className="space-y-2">
          {steps.map((step) => {
            const status = getStepStatus(step.id);

            return (
              <button
                key={step.id}
                onClick={() => onStepChange(step.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                  status === "current"
                    ? "bg-blue-600 text-white shadow-lg"
                    : status === "completed"
                    ? "bg-slate-700 text-white hover:bg-slate-600"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                } hover:scale-[1.02]`}
              >
                <div className="flex items-center space-x-3">
                  {/* Step Icon/Status */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      status === "current" ? "bg-white/20" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`${
                        status === "current" ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {getStepIcon(step.id)}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-medium ${
                          status === "current"
                            ? "text-blue-100"
                            : status === "completed"
                            ? "text-slate-300"
                            : "text-slate-400"
                        }`}
                      >
                        Step {step.id}
                      </p>
                      {status === "current" && (
                        <ChevronRight className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                    <p
                      className={`text-sm font-medium mt-1 leading-tight ${
                        status === "current"
                          ? "text-white"
                          : status === "completed"
                          ? "text-white"
                          : "text-slate-300"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
