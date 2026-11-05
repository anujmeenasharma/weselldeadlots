"use client";

import { createContext, useContext, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-[15px] text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-[#1392f9] focus:outline-none focus:ring-2 focus:ring-[#1392f9]/20 transition";

export const errorInputClass = "border-red-400 focus:border-red-500 focus:ring-red-200";

/** Shared editor state for deeply nested fields (errors, picker data). */
export const EditorContext = createContext({ errors: {}, posts: [], sitePaths: [] });
export const useEditor = () => useContext(EditorContext);

export function FieldShell({ label, help, error, children, htmlFor, compact = false }) {
  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-800">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </p>
      ) : (
        help && <p className="text-[13px] leading-snug text-slate-500">{help}</p>
      )}
    </div>
  );
}

const BUTTON = {
  primary: "bg-[#1392f9] text-white hover:bg-[#0d7dd4] shadow-sm disabled:bg-slate-300",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-sm",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  dangerGhost: "text-red-600 hover:bg-red-50",
};

export function Button({ variant = "secondary", size = "md", className = "", ...props }) {
  const sizes = { sm: "h-8 px-2.5 text-sm gap-1.5", md: "h-10 px-4 text-sm gap-2", icon: "h-8 w-8 justify-center" };
  return (
    <button
      type="button"
      className={`inline-flex items-center rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${BUTTON[variant]} ${className}`}
      {...props}
    />
  );
}

export function IconButton({ label, children, className = "", ...props }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition disabled:opacity-30 disabled:hover:bg-transparent ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label, help, id }) {
  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-[#1392f9]" : "bg-slate-300"}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-800 cursor-pointer">
          {label}
        </label>
        {help && <p className="text-[13px] text-slate-500">{help}</p>}
      </div>
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[85vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-xl ${wide ? "max-w-3xl" : "max-w-md"}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-bold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}
