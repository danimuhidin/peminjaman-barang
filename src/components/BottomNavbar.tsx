'use client'; // Penting: Ini adalah Client Component karena menggunakan useRouter dan state/interaktivitas

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Untuk mengetahui rute aktif

export default function BottomNavbar() {
  const pathname = usePathname(); // Hook untuk mendapatkan path URL saat ini

  // Fungsi untuk menentukan apakah sebuah link aktif
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-950 text-white shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/loans" className={`flex flex-1 flex-col items-center p-2 text-xs lg:text-sm font-medium ${isActive('/loans') ? 'text-blue-200' : 'text-white hover:text-blue-100'} transition-colors duration-200`}>
            <svg className="w-5 lg:w-6 h-5 lg:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v4a4 4 0 004 4h.01M12 10V4m0 0l-3 3m3-3l3 3m-4 8v4M9 20h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Peminjaman
        </Link>

        <Link href="/items" className={`flex flex-1 flex-col items-center p-2 text-xs lg:text-sm font-medium ${isActive('/items') ? 'text-blue-200' : 'text-white hover:text-blue-100'} transition-colors duration-200`}>
            <svg className="w-5 lg:w-6 h-5 lg:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Barang
        </Link>

        <Link href="/users" className={`flex flex-1 flex-col items-center p-2 text-xs lg:text-sm font-medium ${isActive('/users') ? 'text-blue-200' : 'text-white hover:text-blue-100'} transition-colors duration-200`}>
            <svg className="w-5 lg:w-6 h-5 lg:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h.01M18.665 14H5.335C3.593 14 2 15.65 2 17.778v1.444C2 21.35 3.593 23 5.335 23h13.33C20.407 23 22 21.35 22 19.222v-1.444C22 15.65 20.407 14 18.665 14zM12 2a4 4 0 100 8 4 4 0 000-8z"></path></svg>
            User
        </Link>

        <Link href="/" className={`flex flex-1 flex-col items-center p-2 text-xs lg:text-sm font-medium ${isActive('/') ? 'text-blue-200' : 'text-white hover:text-blue-100'} transition-colors duration-200`}>
            <svg className="w-5 lg:w-6 h-5 lg:h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
        </Link>
      </div>
    </nav>
  );
}