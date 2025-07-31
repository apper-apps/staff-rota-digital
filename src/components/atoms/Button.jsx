import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  icon,
  iconPosition = "left",
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === "left" && (
        <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 16} />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 16} />
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;