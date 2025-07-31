import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const currentDate = new Date();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            Staff Rota Pro
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Efficient team scheduling and cost management
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          <span className="font-medium">
            {format(currentDate, "EEEE, MMMM d, yyyy")}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;