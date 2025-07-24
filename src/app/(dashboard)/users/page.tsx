// app/users/page.tsx
'use client';

import { useState, useEffect } from 'react'; // 1. Import useEffect
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// 2. Tipe data disesuaikan dengan output Prisma (id adalah number)
interface User {
  id: number;
  name: string;
}

export default function UsersPage() {
  // 3. State untuk menampung data dari API, loading, dan error
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  // 4. Fungsi untuk mengambil data dari API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Gagal mengambil data peminjam');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Error fetching users: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // 5. useEffect untuk memanggil fetchUsers saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Handler untuk Tambah/Edit User ---
  const handleOpenAddModal = () => {
    setCurrentUserName('');
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setCurrentUserName(user.name);
    setEditingUserId(user.id);
    setIsModalOpen(true);
  };

  // 6. Logika Simpan (Tambah/Edit) diubah ke API call
  const handleSaveUser = async () => {
    if (!currentUserName.trim()) {
      alert('Nama tidak boleh kosong!');
      return;
    }

    const method = editingUserId ? 'PUT' : 'POST';
    const url = editingUserId ? `/api/users/${editingUserId}` : '/api/users';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentUserName.trim() }),
      });

      if (!response.ok) {
        throw new Error(editingUserId ? 'Gagal memperbarui peminjam' : 'Gagal menambah peminjam');
      }

      setIsModalOpen(false);
      fetchUsers(); // Refresh data setelah berhasil
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // --- Handler untuk Hapus User ---
  const handleOpenConfirmDelete = (userId: number) => {
    setDeletingUserId(userId);
    setIsConfirmOpen(true);
  };

  // 7. Logika Hapus diubah ke API call
  const handleDeleteUser = async () => {
    if (!deletingUserId) return;

    try {
      const response = await fetch(`/api/users/${deletingUserId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus peminjam');
      }

      setIsConfirmOpen(false);
      setDeletingUserId(null);
      fetchUsers(); // Refresh data setelah berhasil
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // --- Render Komponen ---
  if (isLoading) {
    return <div className="text-center text-white p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-10">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col justify-start min-h-screen font-sans pb-20">
      <div className='border-b lg:border-none border-gray-400 mb-6 p-3'>
        <h1 className="text-lg lg:text-2xl text-left lg:text-center font-bold text-white">Data Peminjam</h1>
      </div>
      <div className="flex item-center justify-center w-full pb-20">
        <div className="w-full max-w-md">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada data peminjam.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between pb-2 px-2 border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200"
                >
                  <span className="flex-grow text-base font-medium text-white cursor-pointer" onClick={() => handleOpenEditModal(user)}>
                    {user.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenConfirmDelete(user.id)}
                    className="ml-4 border-red-500 text-red-500 bg-transparent hover:bg-red-50 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Sisa JSX untuk Button dan Dialog tidak perlu diubah, sudah benar */}
      <Button className="fixed bottom-24 right-8 rounded-full h-16 w-16 text-white text-3xl shadow-lg bg-blue-600 hover:bg-blue-700" onClick={handleOpenAddModal}>+</Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] ..."> {/* ClassName dipersingkat untuk keringkasan */}
          <DialogHeader>
            <DialogTitle>{editingUserId ? 'Edit Peminjam' : 'Tambah Peminjam'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input id="name" value={currentUserName} onChange={(e) => setCurrentUserName(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveUser}>{editingUserId ? 'Simpan Perubahan' : 'Tambah'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="..."> {/* ClassName dipersingkat */}
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini akan menghapus data peminjam secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}