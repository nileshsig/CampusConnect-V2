import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text mb-1.5">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full min-h-[44px] px-3.5 py-2 bg-surface border rounded-input text-text text-sm transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:bg-paper disabled:text-muted ${
            error ? "border-emergency" : "border-line"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-emergency">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
