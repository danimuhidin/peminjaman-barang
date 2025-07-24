import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: { params: any }) {
  try {
    const loanId = parseInt(context.params.id, 10);
    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
      include: { user: true, item: true },
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, context: { params: any }) {
  try {
    const loanId = parseInt(context.params.id, 10);
    const { status } = await request.json();
    if (status === undefined) {
      return NextResponse.json({ error: 'Status diperlukan.' }, { status: 400 });
    }
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: { status: Number(status) },
    });
    return NextResponse.json(updatedLoan);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Data peminjaman tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Gagal memperbarui peminjaman.' }, { status: 500 });
  }
}