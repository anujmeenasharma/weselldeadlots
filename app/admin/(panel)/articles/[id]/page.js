import { notFound } from "next/navigation";
import DocumentEditor from "@/components/admin/DocumentEditor";
import { getDocumentById, getSitePaths, listPostOptions } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";
import { siteUrl } from "@/sanity/env";

export const metadata = { title: "Edit article" };

export default async function EditArticlePage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const [doc, sitePaths, posts] = await Promise.all([getDocumentById(id), getSitePaths(), listPostOptions()]);
  if (!doc || doc._type !== "blogPost") notFound();
  return (
    <DocumentEditor key={doc._id} type="blogPost" initialDoc={doc} posts={posts} sitePaths={sitePaths} siteUrl={siteUrl} backHref="/admin/articles" />
  );
}
