import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import CalendarPage from "@/components/pages/CalendarPage";
import StaffPage from "@/components/pages/StaffPage";
import ProjectsPage from "@/components/pages/ProjectsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/calendar" replace />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="projects" element={<ProjectsPage />} />
          </Route>
        </Routes>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;