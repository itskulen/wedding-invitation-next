import GuestManager from '@/components/GuestManager';
import { getAttendanceForAdmin } from '@/lib/attendance-server';
import { isDatabaseConfigured } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const initialAttendance = await getAttendanceForAdmin().catch(() => []);

  return (
    <GuestManager
      initialAttendance={initialAttendance}
      databaseEnabled={isDatabaseConfigured()}
    />
  );
}
