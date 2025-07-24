import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/items - Mendapatkan semua item
export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Gagal mengambil data item.' }, { status: 500 });
  }
}

// POST /api/items - Membuat item baru
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Nama item diperlukan.' }, { status: 400 });
    }

    const newItem = await prisma.item.create({
      data: { name },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Gagal membuat item.' }, { status: 500 });
  }
}