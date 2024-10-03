import AdminGlobalLayout from "@/components/AdminGlobalLayout";

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <AdminGlobalLayout>{children}</AdminGlobalLayout>;
  }