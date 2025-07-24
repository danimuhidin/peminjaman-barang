// app/items/page.tsx
'use client';

import { useState, useEffect } from 'react';
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

// Tipe data disesuaikan dengan output Prisma (id adalah number)
interface Item {
  id: number;
  name: string;
}

export default function ItemsPage() {
  // State untuk data dari API, loading, dan error
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItemName, setCurrentItemName] = useState('');
  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // State untuk Konfirmasi Hapus
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  // Fungsi untuk mengambil data barang dari API
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/items');
      if (!response.ok) {
        throw new Error('Gagal mengambil data barang');
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Error fetching items: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // Memanggil fetchItems saat komponen dimuat
  useEffect(() => {
    fetchItems();
  }, []);

  // --- Handler untuk Tambah/Edit Barang ---

  const handleOpenAddModal = () => {
    setCurrentItemName('');
    setEditingItemId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: Item) => {
    setCurrentItemName(item.name);
    setEditingItemId(item.id);
    setIsModalOpen(true);
  };

  const handleSaveItem = async () => {
    if (!currentItemName.trim()) {
      alert('Nama barang tidak boleh kosong!');
      return;
    }

    const method = editingItemId ? 'PUT' : 'POST';
    const url = editingItemId ? `/api/items/${editingItemId}` : '/api/items';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: currentItemName.trim() }),
      });

      if (!response.ok) {
        throw new Error(editingItemId ? 'Gagal memperbarui barang' : 'Gagal menambah barang');
      }

      setIsModalOpen(false);
      fetchItems(); // Refresh data setelah berhasil
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  // --- Handler untuk Hapus Barang ---

  const handleOpenConfirmDelete = (itemId: number) => {
    setDeletingItemId(itemId);
    setIsConfirmOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!deletingItemId) return;

    try {
      const response = await fetch(`/api/items/${deletingItemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus barang');
      }

      setIsConfirmOpen(false);
      setDeletingItemId(null);
      fetchItems(); // Refresh data setelah berhasil
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
        <h1 className="text-lg lg:text-2xl text-left lg:text-center font-bold text-white">Data Barang</h1>
      </div>

      <div className="flex item-center justify-center w-full pb-20">
        <div className="w-full max-w-md">
          {items.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada data barang.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between pb-2 px-2 border-b border-gray-600 hover:bg-gray-700 transition-colors duration-200"
                >
                  <span
                    className="flex-grow text-base font-medium text-white cursor-pointer"
                    onClick={() => handleOpenEditModal(item)}
                  >
                    {item.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenConfirmDelete(item.id)}
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

      {/* Button Tambah */}
      <Button
        className="fixed bottom-24 right-8 rounded-full h-16 w-16 text-white text-3xl shadow-lg bg-blue-600 hover:bg-blue-700"
        onClick={handleOpenAddModal}
      >
        +
      </Button>

      {/* Modal Tambah/Edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          // Kelas yang direvisi untuk posisi atas dengan sedikit padding
          className="sm:max-w-[425px]
                 data-[state=open]:!slide-in-from-top
                 data-[state=open]:!md:slide-in-from-bottom
                 data-[state=open]:!top-[20%]
                 data-[state=open]:!bottom-[unset]
                 data-[state=open]:!md:top-[50%]
                 data-[state=open]:!md:bottom-[unset]
                 md:top-[50%] md:translate-y-[-50%] md:left-[50%] md:translate-x-[-50%]
                 rounded-b-lg sm:rounded-lg rounded-t-lg"
        >
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Barang' : 'Tambah Barang Baru'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input
                id="name"
                value={currentItemName}
                onChange={(e) => setCurrentItemName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveItem}>
              {editingItemId ? 'Simpan Perubahan' : 'Tambah Barang'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent
          // Kelas yang direvisi untuk posisi atas dengan sedikit padding
          className="data-[state=open]:!slide-in-from-top
                 data-[state=open]:!md:slide-in-from-bottom
                 data-[state=open]:!top-[20%]
                 data-[state=open]:!bottom-[unset]
                 data-[state=open]:!md:top-[50%]
                 data-[state=open]:!md:bottom-[unset]
                 md:top-[50%] md:translate-y-[-50%] md:left-[50%] md:translate-x-[-50%]
                 rounded-b-lg sm:rounded-lg rounded-t-lg"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus data barang secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}