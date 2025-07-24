import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/items/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    // Implementasi mirip dengan get user by id
    const itemId = parseInt(params.id, 10);
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
    return NextResponse.json(item);
}

// PUT /api/items/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    // Implementasi mirip dengan update user
    const itemId = parseInt(params.id, 10);
    const { name } = await request.json();
    try {
        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: { name },
        });
        return NextResponse.json(updatedItem);
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Gagal memperbarui item.' }, { status: 500 });
    }
}

// DELETE /api/items/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    // Implementasi mirip dengan delete user
    const itemId = parseInt(params.id, 10);
    try {
        await prisma.item.delete({ where: { id: itemId } });
        return NextResponse.json({ message: 'Item berhasil dihapus.' });
    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ error: 'Item tidak ditemukan.' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Gagal menghapus item.' }, { status: 500 });
    }
}