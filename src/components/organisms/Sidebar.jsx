import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/calendar", label: "Calendar", icon: "Calendar" },
    { path: "/staff", label: "Staff", icon: "Users" },
    { path: "/projects", label: "Projects", icon: "FolderOpen" }
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Staff Rota</h2>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100",
                    isActive 
                      ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600" 
                      : "text-gray-700 hover:text-gray-900"
                  )
                }
              >
                <ApperIcon name={item.icon} size={18} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-full">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;