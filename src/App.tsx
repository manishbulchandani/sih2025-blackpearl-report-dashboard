import { Routes, Route } from "react-router-dom";
import ReportDashboard from "./components/ReportDashboard";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/reports/:reportId" element={<ReportDashboard />} />
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Report Dashboard
                </h1>
                <p className="text-gray-600">
                  Navigate to /reports/:reportId to view a report
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
