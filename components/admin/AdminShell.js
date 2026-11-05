"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { DOCUMENTS } from "@/lib/admin/config";
import Icon from "./Icon";

const NAV = [
  { heading: null, items: [{ href: "/admin", label: "Dashboard", lucide: LayoutDashboard }] },
  {
    heading: "On every page",
    items: ["siteSettings", "navigation", "footer"].map((type) => ({ href: `/admin/edit/${type}`, label: DOCUMENTS[type].label, icon: DOCUMENTS[type].icon })),
  },
  {
    heading: "Pages",
    items: [
      ...["homePage", "contactPage", "sellPage", "blogSettings"].map((type) => ({ href: `/admin/edit/${type}`, label: DOCUMENTS[type].label, icon: DOCUMENTS[type].icon })),
      { href: "/admin/pages", label: "Other pages", icon: "File" },
    ],
  },
  { heading: "Blog", items: [{ href: "/admin/articles", label: "Blog articles", icon: "PenSquare" }] },
];

function NavLinks({ onNavigate }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV.map((group, i) => (
        <div key={i}>
          {group.heading && <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.heading}</p>}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium transition ${
                      active ? "bg-[#1392f9] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.lucide ? <item.lucide className="h-4 w-4" /> : <Icon name={item.icon} />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-1 border-t border-slate-200 p-3">
      <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100">
        <ExternalLink className="h-4 w-4" /> View website
      </a>
      <form action={logoutAction}>
        <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-100">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </form>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-3 px-5 py-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand.png" alt="" className="h-9 w-9 object-contain" />
      <span className="leading-tight">
        <span className="block text-sm font-bold text-slate-900">We Sell Dead Lots</span>
        <span className="block text-xs text-slate-500">Website admin</span>
      </span>
    </Link>
  );
}

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <Brand />
        <NavLinks />
        <SidebarFooter />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-2 lg:hidden">
        <Brand />
        <button type="button" onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between pr-2">
              <Brand />
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </aside>
        </div>
      )}

      {children}
    </div>
  );
}
