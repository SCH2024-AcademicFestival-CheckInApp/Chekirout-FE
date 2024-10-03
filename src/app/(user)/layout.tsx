import UserGlobalLayout from "@/components/UserGlobalLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGlobalLayout>{children}</UserGlobalLayout>
  );
}
