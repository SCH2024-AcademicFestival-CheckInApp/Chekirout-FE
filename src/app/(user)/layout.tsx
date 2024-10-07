import BottomNav from "@/components/BottonNav";
import TopNav from "@/components/TopNav";
import UserGlobalLayout from "@/components/UserGlobalLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserGlobalLayout>
      <TopNav />
      {children}
      <BottomNav />
    </UserGlobalLayout>
  );
}
