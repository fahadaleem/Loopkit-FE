import { forwardRef, type InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, hint, id, className = "", ...rest }, ref) {
    return (
      <label htmlFor={id} className="block">
        <span className="block text-sm font-medium text-foreground mb-1.5">
          {label}
        </span>
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none ${className}`}
          {...rest}
        />
        {hint ? (
          <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </label>
    );
  },
);
