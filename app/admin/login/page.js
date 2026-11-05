import { redirect } from "next/navigation";
import { isAdmin, isAdminConfigured } from "@/lib/admin/auth";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return <LoginForm configured={isAdminConfigured()} />;
}
