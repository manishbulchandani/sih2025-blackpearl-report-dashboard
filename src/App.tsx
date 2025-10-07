import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ReportDashboard from "./components/ReportDashboard";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal on component mount
    setShowModal(true);
  }, []);

  const handleViewPipeline = () => {
    // Open pipeline execution in new tab
    window.open("https://sih2025-blackpearl-prototype.vercel.app/database", "_blank");
    // Close modal
    setShowModal(false);
  };

  const handleViewDashboard = () => {
    // Just close the modal
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Welcome
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Choose an option to continue:
            </p>
            <div className="space-y-4">
              <button
                onClick={handleViewPipeline}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
              >
                View Pipeline Execution
              </button>
              <button
                onClick={handleViewDashboard}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 shadow-md"
              >
                View Result Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/reports/:reportId" element={<ReportDashboard />} />
        <Route
          path="*"
          element={
           <Navigate to="/reports/SRX25419065"/>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
