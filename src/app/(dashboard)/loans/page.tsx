'use client';

import { useState, useEffect } from 'react';
import { format } from "date-fns";
import { id as localeId } from 'date-fns/locale/id'; // PERBAIKAN: Import locale dengan benar
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Definisikan tipe data yang dibutuhkan
interface User {
  id: number;
  name: string;
}

interface Item {
  id: number;
  name: string;
}

interface Loan {
  id: number;
  startDate: string;
  endDate: string | null;
  status: number; // 1 = dipinjam, 0 = dikembalikan
  qty: number;
  user: {
    name: string;
  };
  item: {
    name: string;
  };
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [returningLoanId, setReturningLoanId] = useState<number | null>(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [loansRes, usersRes, itemsRes] = await Promise.all([
        fetch('/api/loans'),
        fetch('/api/users'),
        fetch('/api/items'),
      ]);

      if (!loansRes.ok || !usersRes.ok || !itemsRes.ok) {
        throw new Error('Gagal mengambil data awal');
      }

      const loansData = await loansRes.json();
      const usersData = await usersRes.json();
      const itemsData = await itemsRes.json();

      setLoans(loansData);
      setUsers(usersData);
      setItems(itemsData);

    } catch (err) {
      setError('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenAddModal = () => {
    setSelectedUserId('');
    setSelectedItemId('');
    setQuantity(1);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsModalOpen(true);
  };

  const handleSaveLoan = async () => {
    if (!selectedUserId || !selectedItemId || quantity <= 0 || !startDate || !endDate) {
      alert('Harap lengkapi semua field, termasuk tanggal mulai dan akhir.');
      return;
    }
    if (endDate < startDate) {
      alert('Tanggal akhir tidak boleh sebelum tanggal mulai.');
      return;
    }

    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: parseInt(selectedUserId),
          itemId: parseInt(selectedItemId),
          qty: quantity,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Gagal membuat peminjaman baru');
      
      setIsModalOpen(false);
      fetchInitialData();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleOpenReturnConfirm = (loanId: number) => {
    setReturningLoanId(loanId);
    setIsConfirmOpen(true);
  };

  const handleReturnLoan = async () => {
    if (!returningLoanId) return;

    try {
      const response = await fetch(`/api/loans/${returningLoanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 0 }),
      });

      if (!response.ok) throw new Error('Gagal mengembalikan barang');
      
      setIsConfirmOpen(false);
      setReturningLoanId(null);
      fetchInitialData();
    } catch (err) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };
  
  if (isLoading) return <div className="text-center text-white p-10">Loading data...</div>;
  if (error) return <div className="text-center text-red-500 p-10">Error: {error}</div>;

  return (
    <div className="flex flex-col justify-start min-h-screen font-sans pb-20">
      <div className='border-b lg:border-none border-gray-400 mb-6 p-3'>
        <h1 className="text-lg lg:text-2xl text-left lg:text-center font-bold text-white">Data Peminjaman</h1>
      </div>

      <div className="flex justify-center w-full px-4 pb-20">
        <div className="w-full max-w-2xl">
          {loans.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada data peminjaman.</p>
          ) : (
            <ul className="space-y-3">
              {loans.map((loan) => (
                <li key={loan.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-grow">
                    <p className="font-bold text-lg text-white">{loan.item.name} <span className="text-sm font-normal text-gray-400">({loan.qty}x)</span></p>
                    <p className="text-sm text-gray-300">Peminjam: <span className="font-semibold">{loan.user.name}</span></p>
                    <p className="text-xs text-gray-400">Periode: {new Date(loan.startDate).toLocaleDateString('id-ID')} - {loan.endDate ? new Date(loan.endDate).toLocaleDateString('id-ID') : '...'}</p>
                  </div>
                  <div className="w-full sm:w-auto">
                    {loan.status === 1 ? (
                      <Button onClick={() => handleOpenReturnConfirm(loan.id)} className="w-full bg-green-600 hover:bg-green-700">Kembalikan</Button>
                    ) : (
                      <span className="text-sm font-semibold text-green-500 px-3 py-1.5 rounded-full bg-green-900/50 block text-center">Sudah Kembali</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Button onClick={handleOpenAddModal} className="fixed bottom-24 right-8 rounded-full h-16 w-16 text-white text-3xl shadow-lg bg-blue-600 hover:bg-blue-700">+</Button>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Buat Peminjaman Baru</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="user">Peminjam</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user"><SelectValue placeholder="Pilih Peminjam..." /></SelectTrigger>
                <SelectContent>
                  {users.map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="item">Barang</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger id="item"><SelectValue placeholder="Pilih Barang..." /></SelectTrigger>
                <SelectContent>
                  {items.map(item => <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Tanggal Mulai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/* PERBAIKAN: Gunakan locale yang diimpor */}
                    {startDate ? format(startDate, "d MMMM yyyy", { locale: localeId }) : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Tanggal Akhir</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {/* PERBAIKAN: Gunakan locale yang diimpor */}
                    {endDate ? format(endDate, "d MMMM yyyy", { locale: localeId }) : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="quantity">Jumlah</Label>
              <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} min="1"/>
            </div>
          </div>
          <DialogFooter><Button onClick={handleSaveLoan}>Simpan Peminjaman</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pengembalian</AlertDialogTitle>
            <AlertDialogDescription>Anda yakin ingin menandai barang ini sebagai sudah dikembalikan ?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnLoan} className="bg-green-600 hover:bg-green-700">Ya, Kembalikan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}