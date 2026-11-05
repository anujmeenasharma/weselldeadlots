import { notFound } from "next/navigation";
import DocumentEditor from "@/components/admin/DocumentEditor";
import { DOCUMENTS, SINGLETONS } from "@/lib/admin/config";
import { getDocumentById, getSitePaths } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";
import { siteUrl } from "@/sanity/env";

export async function generateMetadata({ params }) {
  const { type } = await params;
  return { title: DOCUMENTS[type]?.label || "Edit" };
}

export default async function EditSingletonPage({ params }) {
  await requireAdmin();
  const { type } = await params;
  if (!SINGLETONS.includes(type)) notFound();
  const [doc, sitePaths] = await Promise.all([getDocumentById(type), getSitePaths()]);
  return (
    <DocumentEditor
      key={type}
      type={type}
      initialDoc={doc || { _id: type, _type: type }}
      sitePaths={sitePaths}
      siteUrl={siteUrl}
    />
  );
}
