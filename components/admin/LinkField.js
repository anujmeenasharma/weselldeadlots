"use client";

import { useId, useState } from "react";
import { ChevronDown, Globe, FileText } from "lucide-react";
import { FieldShell, Toggle, errorInputClass, inputClass, useEditor } from "./ui";

/**
 * Edits a `link` object: text, where it goes (page on this site / other website), new tab,
 * and less-used options tucked away under "More options".
 */
export function LinkEditor({ value, onChange, path, showLabel = true }) {
  const { errors, sitePaths } = useEditor();
  const [more, setMore] = useState(false);
  const id = useId();
  const v = value || {};
  const external = v.linkType === "external";
  const set = (patch) => onChange({ _type: v._type || "link", linkType: "internal", ...v, ...patch });

  return (
    <div className="space-y-3">
      {showLabel && (
        <FieldShell label="Button / link text" error={errors[`${path}.label`]} htmlFor={`${id}-label`} compact>
          <input id={`${id}-label`} className={`${inputClass} ${errors[`${path}.label`] ? errorInputClass : ""}`} value={v.label || ""} onChange={(e) => set({ label: e.target.value })} />
        </FieldShell>
      )}

      <div className="inline-flex rounded-lg border border-slate-300 bg-slate-50 p-0.5 text-sm">
        {[
          { value: "internal", label: "A page on this website", icon: FileText },
          { value: "external", label: "Another website", icon: Globe },
        ].map((opt) => {
          const active = (v.linkType || "internal") === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ linkType: opt.value })}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${active ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
            >
              <opt.icon className="h-4 w-4" /> {opt.label}
            </button>
          );
        })}
      </div>

      {external ? (
        <FieldShell error={errors[`${path}.url`]} help="Full address, e.g. https://example.com" compact>
          <input className={`${inputClass} ${errors[`${path}.url`] ? errorInputClass : ""}`} placeholder="https://" value={v.url || ""} onChange={(e) => set({ url: e.target.value })} />
        </FieldShell>
      ) : (
        <FieldShell error={errors[`${path}.path`]} help='Pick a page or type one, e.g. /contact' compact>
          <input
            className={`${inputClass} ${errors[`${path}.path`] ? errorInputClass : ""}`}
            list={`${id}-paths`}
            placeholder="/"
            value={v.path || ""}
            onChange={(e) => set({ path: e.target.value })}
          />
          <datalist id={`${id}-paths`}>
            {sitePaths.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </FieldShell>
      )}

      <button type="button" onClick={() => setMore(!more)} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ChevronDown className={`h-4 w-4 transition ${more ? "rotate-180" : ""}`} /> More options
      </button>
      {more && (
        <div className="space-y-3 rounded-lg bg-slate-50 p-3">
          <Toggle id={`${id}-tab`} checked={v.openInNewTab} onChange={(c) => set({ openInNewTab: c })} label="Open in a new browser tab" />
          <Toggle id={`${id}-hide`} checked={v.hidden} onChange={(c) => set({ hidden: c })} label="Hide this link" />
          <FieldShell label="Button style" compact>
            <select className={inputClass} value={v.variant || "default"} onChange={(e) => set({ variant: e.target.value })}>
              <option value="default">Standard</option>
              <option value="primary">Blue (highlighted)</option>
              <option value="outline">Outline</option>
            </select>
          </FieldShell>
          <FieldShell label="Tracking name (Meta Pixel)" help="Optional. Sent to Facebook ads when clicked, e.g. SellWithUsClick." compact>
            <input className={inputClass} value={v.trackingEvent || ""} onChange={(e) => set({ trackingEvent: e.target.value })} />
          </FieldShell>
        </div>
      )}
    </div>
  );
}

export function LinkField({ field, value, onChange, path }) {
  const { errors } = useEditor();
  return (
    <FieldShell label={field.label} help={field.help} error={errors[path]}>
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <LinkEditor value={value} onChange={onChange} path={path} />
      </div>
    </FieldShell>
  );
}
