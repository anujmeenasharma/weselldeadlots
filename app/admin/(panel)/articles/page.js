import DocumentList from "@/components/admin/DocumentList";
import { createDocument } from "@/app/admin/actions";
import { listDocuments } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata = { title: "Blog articles" };

export default async function ArticlesList() {
  await requireAdmin();
  const items = await listDocuments("blogPost");
  return (
    <DocumentList
      title="Blog articles"
      description="Articles written here appear first on the blog. Your older Shopify articles still show after them."
      icon="PenSquare"
      items={items}
      basePath="/admin/articles"
      urlPrefix="/blogs/"
      createAction={createDocument.bind(null, "blogPost")}
      createLabel="New article"
      emptyText="No articles written here yet — click “New article” to start."
    />
  );
}
