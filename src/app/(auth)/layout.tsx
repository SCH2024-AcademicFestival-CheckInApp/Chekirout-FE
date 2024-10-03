import UserGlobalLayout from "@/components/UserGlobalLayout";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGlobalLayout>{children}</UserGlobalLayout>
  );
}
