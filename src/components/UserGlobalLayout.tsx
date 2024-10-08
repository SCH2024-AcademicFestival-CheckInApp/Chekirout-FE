export default function UserGloabalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 ">
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-md overflow-hidden flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
