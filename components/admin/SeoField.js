"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ImageField } from "./MediaFields";
import { FieldShell, Toggle, errorInputClass, inputClass, useEditor } from "./ui";

function Counter({ value, max }) {
  const n = (value || "").length;
  return <span className={`text-xs ${n > max ? "font-semibold text-amber-600" : "text-slate-400"}`}>{n}/{max}</span>;
}

/** Google & social sharing settings, with a live Google result preview. */
export function SeoField({ value, onChange, path, isDefault, docTitle, pagePath }) {
  const { errors, siteUrl } = useEditor();
  const [social, setSocial] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const v = value || {};
  const [keywords, setKeywords] = useState(() => (v.keywords || []).join(", "));
  const set =(patch) => onChange({ _type: "seo", ...v, ...patch });
  const err = (name) => errors[`${path}.${name}`];

  const previewTitle = v.metaTitle || docTitle || "Uses the website's default title";
  const previewDesc = v.metaDescription || "Uses the website's default description.";
  const host = (siteUrl || "https://weselldeadlots.com").replace(/^https?:\/\//, "");

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">How it may look on Google</p>
        <p className="text-sm text-slate-600">{host}{pagePath && pagePath !== "/" ? ` › ${pagePath.replace(/^\//, "").replace(/\//g, " › ")}` : ""}</p>
        <p className="truncate text-xl text-[#1a0dab]">{previewTitle}</p>
        <p className="line-clamp-2 text-sm text-slate-600">{previewDesc}</p>
      </div>

      <FieldShell label={<span className="flex items-center justify-between">Title in Google <Counter value={v.metaTitle} max={60} /></span>} help={isDefault ? "Used on every page that doesn't set its own." : "Leave empty to use the page name / website default."}>
        <input className={inputClass} value={v.metaTitle || ""} onChange={(e) => set({ metaTitle: e.target.value })} />
      </FieldShell>
      <FieldShell label={<span className="flex items-center justify-between">Description in Google <Counter value={v.metaDescription} max={160} /></span>} help="One or two sentences that make people want to click.">
        <textarea rows={3} className={inputClass} value={v.metaDescription || ""} onChange={(e) => set({ metaDescription: e.target.value })} />
      </FieldShell>
      <FieldShell label="Search keywords" help="Separate with commas.">
        <input
          className={inputClass}
          value={keywords}
          onChange={(e) => {
            setKeywords(e.target.value);
            set({ keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) });
          }}
        />
      </FieldShell>

      <div className="rounded-xl border border-slate-200">
        <button type="button" onClick={() => setSocial(!social)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800">
          When shared on WhatsApp, Facebook, X… <ChevronDown className={`h-4 w-4 transition ${social ? "rotate-180" : ""}`} />
        </button>
        {social && (
          <div className="space-y-4 border-t border-slate-200 p-4">
            <ImageField field={{ label: "Share picture", help: "Best size 1200×630." }} value={v.ogImage} onChange={(img) => set({ ogImage: img })} />
            <FieldShell label="Share title" help="Leave empty to use the Google title.">
              <input className={inputClass} value={v.ogTitle || ""} onChange={(e) => set({ ogTitle: e.target.value })} />
            </FieldShell>
            <FieldShell label="Share description">
              <textarea rows={2} className={inputClass} value={v.ogDescription || ""} onChange={(e) => set({ ogDescription: e.target.value })} />
            </FieldShell>
            <FieldShell label="Title on X (Twitter)" help="Optional — only if different.">
              <input className={inputClass} value={v.twitterTitle || ""} onChange={(e) => set({ twitterTitle: e.target.value })} />
            </FieldShell>
            <FieldShell label="Description on X (Twitter)">
              <textarea rows={2} className={inputClass} value={v.twitterDescription || ""} onChange={(e) => set({ twitterDescription: e.target.value })} />
            </FieldShell>
            <ImageField field={{ label: "Picture on X (Twitter)" }} value={v.twitterImage} onChange={(img) => set({ twitterImage: img })} />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200">
        <button type="button" onClick={() => setAdvanced(!advanced)} className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800">
          Advanced <ChevronDown className={`h-4 w-4 transition ${advanced ? "rotate-180" : ""}`} />
        </button>
        {advanced && (
          <div className="space-y-4 border-t border-slate-200 p-4">
            <Toggle id={`${path}-noindex`} checked={v.noIndex} onChange={(c) => set({ noIndex: c })} label="Hide from Google" help="Google won't list this page." />
            <Toggle id={`${path}-nofollow`} checked={v.noFollow} onChange={(c) => set({ noFollow: c })} label="Tell Google not to follow links on this page" />
            <FieldShell label="Main address (canonical)" help="Only change this if the same content lives at another address." error={err("canonicalUrl")}>
              <input className={`${inputClass} ${err("canonicalUrl") ? errorInputClass : ""}`} placeholder={pagePath || "/"} value={v.canonicalUrl || ""} onChange={(e) => set({ canonicalUrl: e.target.value })} />
            </FieldShell>
            <FieldShell label="Structured data (JSON-LD)" help="For developers. Must be valid JSON." error={err("structuredData")}>
              <textarea rows={5} className={`${inputClass} font-mono text-xs ${err("structuredData") ? errorInputClass : ""}`} value={v.structuredData || ""} onChange={(e) => set({ structuredData: e.target.value })} />
            </FieldShell>
          </div>
        )}
      </div>
    </div>
  );
}
