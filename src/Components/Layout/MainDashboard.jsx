import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
// import Header_page from './HeaderPage';
import Sidebar from "./Sidebar";
import Computer from "../Pages/Computer/Computer";
import EmployeePositionList from "../Pages/employee/EmployeePositionList";
import GenderList from "../Pages/employee/GenderList";
import Maintenance from "../Pages/Maintenance";
import Setting from "../Pages/Setting";
import Help from "../Pages/Help";
import Report from "../Pages/Report";
import Loader from "../commons/Loader";
import EmployeeInformation from "../Pages/employee/EmployeeInformation";
import Dashboard from "../Pages/Dashboard";
import User from "../SystemSetting/User";
import NotFound from "../Pages/NotFound";
import GroupMaster from "../SystemSetting/Role";
import ItemPermission from "../SystemSetting/ItemPermission";
import GroupDetails from "../SystemSetting/GroupDetails";
import HeaderPage from "./HeaderPage";
import Department from "../Pages/Company/Department";
import Office from "../Pages/Company/Office";
import Branch from "../Pages/Company/Branch";
import Company from "../Pages/Company/Company";

function MainDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open for better UX
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Timeout duration (e.g., 15 minutes)
  const timeoutDuration = 30 * 60 * 1000;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);

    // Session timeout logic
    const timeout = setTimeout(() => {
      // alert("Session expired. Redirecting to login.");
      navigate("/"); // Redirect to login page
    }, timeoutDuration);

    // Cleanup timers on unmount
    return () => {
      clearTimeout(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen overflow-hidden font-khmer">
      <HeaderPage toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main
        className={`flex-1 p-6 overflow-y-auto bg-gray-100 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-[220px]" : "md:ml-0" // Adjust margin on medium screens and up
        }`}
      >
        <Routes>
          {/* Redirect from /main-dashboard to /main-dashboard/dashboard */}
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="computer" element={<Computer />} />
          <Route
            path="employee/positionlist"
            element={<EmployeePositionList />}
          />
          <Route path="employee/genderlist" element={<GenderList />} />
          <Route
            path="employee/employeeinfo"
            element={<EmployeeInformation />}
          />
          <Route path="system_setting/user" element={<User />} />
          <Route path="system_setting/role" element={<GroupMaster />} />
          <Route path="system_setting/menu" element={<ItemPermission />} />
          <Route path="system_setting/rolemenu" element={<GroupDetails />} />
          <Route path="company/branch" element={<Branch />} />
          <Route path="company/department" element={<Department />} />
          <Route path="company/office" element={<Office />} />
          <Route path="company/companylist" element={<Company />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="setting" element={<Setting />} />
          <Route path="report" element={<Report />} />
          <Route path="help" element={<Help />} />
          <Route path="*" element={<NotFound />} />{" "}
          {/* Handle unmatched routes */}
        </Routes>
      </main>
    </div>
  );
}

export default MainDashboard;
