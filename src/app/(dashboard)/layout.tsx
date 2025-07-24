// src/app/(dashboard)/layout.tsx
import BottomNavbar from '../../components/BottomNavbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pb-16"> {/* Beri padding-bottom agar konten tidak tertutup navbar */}
        {children}
      </main>
      <BottomNavbar /> {/* Navbar hanya muncul di layout ini */}
    </div>
  );
}