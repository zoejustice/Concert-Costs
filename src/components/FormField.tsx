import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  helper?: string;
  children: ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  helper,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-1 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-4 ${className}`}
    >
      <div className="sm:pt-0">
        <label htmlFor={htmlFor} className="label-text font-medium">
          {label}
        </label>
        {helper ? (
          <p className="text-xs text-base-content/60 mt-0.5">{helper}</p>
        ) : null}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
