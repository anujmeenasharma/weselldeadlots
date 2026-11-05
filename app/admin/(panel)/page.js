import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Icon from "@/components/admin/Icon";
import { DOCUMENTS } from "@/lib/admin/config";
import { getOverview } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Dashboard" };

const hrefFor = (doc) =>
  doc._type === "page" ? `/admin/pages/${doc._id}` : doc._type === "blogPost" ? `/admin/articles/${doc._id}` : `/admin/edit/${doc._type}`;

const TILES = [
  { href: "/admin/edit/homePage", type: "homePage" },
  { href: "/admin/edit/navigation", type: "navigation" },
  { href: "/admin/edit/footer", type: "footer" },
  { href: "/admin/edit/siteSettings", type: "siteSettings" },
  { href: "/admin/edit/contactPage", type: "contactPage" },
  { href: "/admin/edit/sellPage", type: "sellPage" },
];

const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function Dashboard() {
  await requireAdmin();
  const overview = await getOverview().catch(() => null);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Welcome back 👋</h1>
      <p className="mt-1 text-slate-500">What would you like to change on the website today?</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILES.map(({ href, type }) => {
          const doc = DOCUMENTS[type];
          return (
            <Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#1392f9] hover:shadow-md">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-[#1392f9]">
                <Icon name={doc.icon} className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-bold text-slate-900">{doc.label}</h2>
              <p className="mt-1 text-sm leading-snug text-slate-500">{doc.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#1392f9] opacity-0 transition group-hover:opacity-100">
                Edit <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Pages & articles</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/admin/pages" className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100">
              <p className="text-3xl font-bold text-slate-900">{overview?.pages ?? "–"}</p>
              <p className="text-sm text-slate-500">Other pages</p>
            </Link>
            <Link href="/admin/articles" className="rounded-xl bg-slate-50 p-4 hover:bg-slate-100">
              <p className="text-3xl font-bold text-slate-900">{overview?.posts ?? "–"}</p>
              <p className="text-sm text-slate-500">Blog articles</p>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-slate-900">Recently changed</h2>
          <ul className="mt-3 divide-y divide-slate-100">
            {(overview?.recent || []).map((doc) => (
              <li key={doc._id}>
                <Link href={hrefFor(doc)} className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-[#1392f9]">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-slate-800">
                    <Icon name={DOCUMENTS[doc._type]?.icon} />
                    <span className="truncate">{DOCUMENTS[doc._type]?.collection ? doc.title : DOCUMENTS[doc._type]?.label}</span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">{formatter.format(new Date(doc._updatedAt))}</span>
                </Link>
              </li>
            ))}
            {!overview && <li className="py-2 text-sm text-red-600">Couldn&apos;t reach Sanity. Check the project settings.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
