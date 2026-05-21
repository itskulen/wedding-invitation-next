import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAX_NAME = 191;
const MAX_ADDRESS = 500;
const MAX_INVITE = 191;

function normalizeStatus(value: unknown): 'attend' | 'not_attend' | null {
  if (value === 'attend' || value === 'not_attend') return value;
  return null;
}

/** Public: guests submit attendance from the invitation page. */
export async function POST(request: Request) {
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database is not configured. Set DATABASE_URL on the server.' },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Expected JSON object' }, { status: 400 });
  }

  const { name, address, status, inviteTag } = body as Record<string, unknown>;

  const nameStr = typeof name === 'string' ? name.trim() : '';
  const addressStr = typeof address === 'string' ? address.trim() : '';
  const statusNorm = normalizeStatus(status);
  const inviteStr =
    typeof inviteTag === 'string' ? inviteTag.trim().slice(0, MAX_INVITE) : undefined;

  if (!nameStr || !addressStr || !statusNorm) {
    return NextResponse.json(
      { error: 'name, address, and status (attend | not_attend) are required' },
      { status: 400 }
    );
  }

  if (nameStr.length > MAX_NAME || addressStr.length > MAX_ADDRESS) {
    return NextResponse.json({ error: 'name or address too long' }, { status: 400 });
  }

  try {
    const row = await prisma.attendance.create({
      data: {
        name: nameStr,
        address: addressStr,
        status: statusNorm,
        inviteTag: inviteStr || null,
      },
    });

    return NextResponse.json({
      id: row.id,
      name: row.name,
      address: row.address,
      status: row.status as 'attend' | 'not_attend',
      date: row.createdAt.toISOString().slice(0, 10),
    });
  } catch (e) {
    console.error('[api/attendance POST]', e);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
