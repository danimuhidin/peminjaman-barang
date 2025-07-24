import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/users - Mendapatkan semua user
export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Gagal mengambil data user.' }, { status: 500 });
  }
}

// POST /api/users - Membuat user baru
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Nama user diperlukan.' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Gagal membuat user.' }, { status: 500 });
  }
}