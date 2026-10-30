import React from "react";

export function Badge({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "emergency";
}) {
  const styles = {
    default: "bg-paper text-muted border-line",
    accent: "bg-[#EEF2FB] text-accent border-line",
    emergency: "bg-[#FDF2F2] text-emergency border-[#F8D7DA]",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
