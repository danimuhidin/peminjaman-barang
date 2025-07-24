import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/loans
 * Mengambil semua data peminjaman, termasuk data user dan item terkait.
 * Diurutkan dari yang terbaru.
 */
export async function GET() {
  try {
    const loans = await prisma.loan.findMany({
      include: {
        user: {
          select: { name: true }, // Hanya ambil nama user
        },
        item: {
          select: { name: true }, // Hanya ambil nama item
        },
      },
      orderBy: {
        createdAt: 'desc', // Urutkan dari yang terbaru
      }
    });
    return NextResponse.json(loans);
  } catch (error) {
    console.error("Gagal mengambil data peminjaman:", error);
    return NextResponse.json({ error: 'Gagal mengambil data peminjaman.' }, { status: 500 });
  }
}

/**
 * POST /api/loans
 * Membuat data peminjaman baru berdasarkan input dari frontend,
 * termasuk periode tanggal (startDate dan endDate) yang ditentukan manual.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, itemId, qty, startDate, endDate } = await request.json();

    // Validasi input dari body request
    if (!userId || !itemId || !qty || !startDate || !endDate) {
      return NextResponse.json({ error: 'Semua field (termasuk tanggal) diperlukan.' }, { status: 400 });
    }

    const newLoan = await prisma.loan.create({
      data: {
        userId: parseInt(userId, 10),
        itemId: parseInt(itemId, 10),
        qty: parseInt(qty, 10),
        startDate: new Date(startDate), // Konversi string ISO dari frontend ke objek Date
        endDate: new Date(endDate),     // Konversi string ISO dari frontend ke objek Date
      },
    });

    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat peminjaman:", error);
    return NextResponse.json({ error: 'Gagal membuat peminjaman.' }, { status: 500 });
  }
}