import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/users/[id] - Mendapatkan satu user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Gagal mengambil data user.' }, { status: 500 });
  }
}

// PUT /api/users/[id] - Memperbarui user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
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

// DELETE /api/users/[id] - Menghapus user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: 'User berhasil dihapus.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Gagal menghapus user.' }, { status: 500 });
  }
}