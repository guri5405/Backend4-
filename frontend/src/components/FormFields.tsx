"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}

function FieldWrapper({ label, error, hint, htmlFor, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-slate"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-light">{hint}</p>}
      {error && <p className="text-xs text-brick">{error}</p>}
    </div>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} error={error} hint={hint} htmlFor={fieldId}>
        <input
          ref={ref}
          id={fieldId}
          className={clsx(
            "focus-ring w-full rounded-md border bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-slate-light/70",
            error ? "border-brick" : "border-line",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
InputField.displayName = "InputField";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, error, hint, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <FieldWrapper label={label} error={error} hint={hint} htmlFor={fieldId}>
        <textarea
          ref={ref}
          id={fieldId}
          className={clsx(
            "focus-ring w-full resize-none rounded-md border bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-slate-light/70",
            error ? "border-brick" : "border-line",
            className
          )}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextareaField.displayName = "TextareaField";
