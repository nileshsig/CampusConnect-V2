import React from "react";

export function Card({
  className = "",
  children,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface border border-line rounded-card p-5 ${
        onClick ? "cursor-pointer hover:border-accent transition-colors duration-150" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
