"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { ChevronRight, Loader2, Plus, Search } from "lucide-react";
import { imageUrl } from "@/sanity/lib/image";
import Icon from "./Icon";
import { inputClass } from "./ui";

function CreateButton({ label }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#1392f9] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0d7dd4] disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} {label}
    </button>
  );
}

const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** List of pages or blog articles, with search and a "create" button. */
export default function DocumentList({ title, description, icon, items, basePath, urlPrefix, createAction, createLabel, emptyText }) {
  const [query, setQuery] = useState("");
  const filtered = items.filter((i) => `${i.title} ${i.slug}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Icon name={icon} className="h-6 w-6 text-[#1392f9]" /> {title}
          </h1>
          <p className="mt-1 text-slate-500">{description}</p>
        </div>
        <form action={createAction}>
          <CreateButton label={createLabel} />
        </form>
      </div>

      {items.length > 5 && (
        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className={`${inputClass} pl-9`} placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}

      <ul className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {filtered.map((item) => {
          const thumb = imageUrl(item.image, { width: 120, height: 120 });
          return (
            <li key={item._id}>
              <Link href={`${basePath}/${item._id}`} className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="h-12 w-12 rounded-lg object-cover" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <Icon name={icon} className="h-5 w-5" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-slate-900">{item.title || "Untitled"}</span>
                  <span className="block truncate text-sm text-slate-500">
                    {urlPrefix}
                    {item.slug}
                  </span>
                </span>
                {item.status === "hidden" && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Hidden</span>}
                <span className="hidden text-xs text-slate-400 sm:block">Edited {date.format(new Date(item._updatedAt))}</span>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </Link>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="px-5 py-10 text-center text-sm text-slate-500">{items.length ? "Nothing matches your search." : emptyText}</li>}
      </ul>
    </div>
  );
}
