import { prisma } from '@/lib/prisma';
import type { AttendanceConfirmation } from '@/lib/attendance-storage';

/** Load attendance rows for the admin dashboard (server-only). */
export async function getAttendanceForAdmin(): Promise<AttendanceConfirmation[]> {
  if (!prisma) return [];

  const rows = await prisma.attendance.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    address: r.address,
    status: r.status as 'attend' | 'not_attend',
    date: r.createdAt.toISOString().slice(0, 10),
    inviteTag: r.inviteTag ?? undefined,
  }));
}
