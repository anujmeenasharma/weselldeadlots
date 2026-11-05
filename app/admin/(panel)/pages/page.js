import DocumentList from "@/components/admin/DocumentList";
import { createDocument } from "@/app/admin/actions";
import { listDocuments } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Other pages" };

export default async function PagesList() {
  await requireAdmin();
  const items = await listDocuments("page");
  return (
    <DocumentList
      title="Other pages"
      description="Privacy, terms and any page you create. New pages start hidden until you make them live."
      icon="File"
      items={items}
      basePath="/admin/pages"
      urlPrefix="/"
      createAction={createDocument.bind(null, "page")}
      createLabel="New page"
      emptyText="No pages yet."
    />
  );
}
