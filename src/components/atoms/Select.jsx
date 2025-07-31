import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = React.forwardRef(({ 
  className, 
  children,
  error,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8 transition-all duration-200",
          error && "border-red-300 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;