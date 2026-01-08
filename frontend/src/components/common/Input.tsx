import { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showLabel?: boolean;
  rightElement?: ReactNode;
}

const inputBaseClasses =
  "w-full px-4 py-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-0 text-sm";

export function Input({
  label,
  showLabel = false,
  rightElement,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className={showLabel ? "" : "sr-only"}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={cn(inputBaseClasses, rightElement && "pr-12", className)}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
