import { requireAdmin } from "@/lib/admin/auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
