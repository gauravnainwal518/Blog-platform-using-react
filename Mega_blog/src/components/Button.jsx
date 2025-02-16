import React from "react";

export default function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  hoverColor = "hover:bg-blue-700",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg transition-all duration-300 ${bgColor} ${textColor} ${hoverColor} 
                disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
