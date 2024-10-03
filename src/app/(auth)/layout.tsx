import UserLayout from "@/components/UserLayout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserLayout>{children}</UserLayout>
  );
}
