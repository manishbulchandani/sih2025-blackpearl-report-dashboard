import { Routes, Route, Navigate } from "react-router-dom";
import ReportDashboard from "./components/ReportDashboard";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
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
