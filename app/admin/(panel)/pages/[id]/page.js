import { notFound } from "next/navigation";
import DocumentEditor from "@/components/admin/DocumentEditor";
import { getDocumentById, getSitePaths } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";
import { siteUrl } from "@/sanity/env";

export const metadata = { title: "Edit page" };

export default async function EditPagePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [doc, sitePaths] = await Promise.all([getDocumentById(id), getSitePaths()]);
  if (!doc || doc._type !== "page") notFound();
  return <DocumentEditor key={doc._id} type="page" initialDoc={doc} sitePaths={sitePaths} siteUrl={siteUrl} backHref="/admin/pages" />;
}
