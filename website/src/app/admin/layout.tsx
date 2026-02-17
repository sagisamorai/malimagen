import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background-secondary">
      <AdminSidebar />
      <main className="flex-1 mr-64 p-8">{children}</main>
    </div>
  );
}
