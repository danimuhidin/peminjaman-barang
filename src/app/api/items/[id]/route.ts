// app/api/items/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/items/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: { params: any }) {
  const itemId = parseInt(context.params.id, 10);
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
  }

  return NextResponse.json(item);
}

// PUT /api/items/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: NextRequest, context: { params: any }) {
  const itemId = parseInt(context.params.id, 10);
  const { name } = await request.json();

  try {
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: { name },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Gagal memperbarui item.' }, { status: 500 });
  }
}

// DELETE /api/items/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, context: { params: any }) {
  const itemId = parseInt(context.params.id, 10);

  try {
    await prisma.item.delete({ where: { id: itemId } });
    return NextResponse.json({ message: 'Item berhasil dihapus.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Gagal menghapus item.' }, { status: 500 });
  }
}
