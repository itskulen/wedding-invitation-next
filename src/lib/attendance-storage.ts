export const ATTENDANCE_STORAGE_KEY = 'wedding-attendance-confirmations';

export interface AttendanceConfirmation {
  id: string;
  name: string;
  address: string;
  status: 'attend' | 'not_attend';
  date: string;
  /** Optional `?guest=` value when the guest submitted from a personalized link */
  inviteTag?: string | null;
}

export function loadAttendanceConfirmations(): AttendanceConfirmation[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as AttendanceConfirmation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAttendanceConfirmations(list: AttendanceConfirmation[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(list));
}
