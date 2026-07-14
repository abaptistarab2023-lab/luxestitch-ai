import { redirect } from "next/navigation";
import { getAdminCheck } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const check = await getAdminCheck();

  if (!check) {
    redirect("/login");
  }
  if (!check.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted-bg/40">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
