import AdminGlobalLayout from "@/components/AdminGlobalLayout";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGlobalLayout>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AdminGlobalLayout>
  );
}
