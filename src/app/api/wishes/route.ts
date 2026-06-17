import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET — load all wishes
export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(wishes);
  } catch {
    return NextResponse.json({ error: 'Failed to load wishes.' }, { status: 503 });
  }
}

// POST — save a new wish
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { name?: string; message?: string };
    const name = body.name?.trim();
    const message = body.message?.trim();

    if (!name || !message) {
      return NextResponse.json({ error: 'Name and message are required.' }, { status: 400 });
    }

    const wish = await prisma.wish.create({
      data: { name, message },
    });

    return NextResponse.json(wish, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save wish.' }, { status: 503 });
  }
}