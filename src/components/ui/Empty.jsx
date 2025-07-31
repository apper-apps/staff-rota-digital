import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className,
  icon = "Inbox",
  title = "No data found",
  message = "Get started by adding your first item.",
  actionLabel,
  onAction
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-gray-200",
      className
    )}>
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;