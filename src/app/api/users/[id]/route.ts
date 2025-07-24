import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: { params: any }) {
  try {
    const userId = parseInt(context.params.id, 10);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return NextResponse.json({ error: 'Gagal mengambil data user.' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, context: { params: any }) {
  try {
    const userId = parseInt(context.params.id, 10);
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Nama user diperlukan.' }, { status: 400 });
    }
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Gagal memperbarui user.' }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, context: { params: any }) {
  try {
    const userId = parseInt(context.params.id, 10);
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json({ error: 'Gagal menghapus user.' }, { status: 500 });
  }
}