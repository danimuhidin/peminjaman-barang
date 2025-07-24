import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * GET /api/loans/[id]
 * Mengambil satu data peminjaman spesifik berdasarkan ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loanId = parseInt(params.id, 10);
    if (isNaN(loanId)) {
      return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
    }

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        user: true,
        item: true,
      },
    });

    if (!loan) {
      return NextResponse.json({ error: 'Data peminjaman tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json(loan);
  } catch (error) {
    console.error("Gagal mengambil data peminjaman:", error);
    return NextResponse.json({ error: 'Gagal mengambil data peminjaman.' }, { status: 500 });
  }
}


/**
 * PUT /api/loans/[id]
 * Memperbarui status peminjaman. Fungsi utamanya adalah untuk
 * menandai peminjaman sebagai "selesai" atau "dikembalikan" (status: 0).
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loanId = parseInt(params.id, 10);
    if (isNaN(loanId)) {
      return NextResponse.json({ error: 'ID tidak valid.' }, { status: 400 });
    }

    const { status } = await request.json();

    // Validasi bahwa status ada di dalam request body
    if (status === undefined || typeof status !== 'number') {
      return NextResponse.json({ error: 'Status diperlukan dan harus berupa angka.' }, { status: 400 });
    }

    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status: status,
      },
    });

    return NextResponse.json(updatedLoan);
  } catch (error) {
    // Menangani error jika record yang akan diupdate tidak ditemukan
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Data peminjaman tidak ditemukan.' }, { status: 404 });
    }
    console.error("Gagal memperbarui peminjaman:", error);
    return NextResponse.json({ error: 'Gagal memperbarui peminjaman.' }, { status: 500 });
  }
}