import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  className, 
  message = "Something went wrong. Please try again.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200",
      className
    )}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Occurred</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} icon="RotateCcw">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;