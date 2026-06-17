'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import TypingText from './TypingText';
import {
  type AttendanceConfirmation,
  loadAttendanceConfirmations,
  saveAttendanceConfirmations,
} from '@/lib/attendance-storage';

interface Wish {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function RSVP() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'wishes' | 'attendance'>('wishes');
  const [attendanceData, setAttendanceData] = useState({
    name: '',
    address: '',
    status: 'attend' as 'attend' | 'not_attend',
  });
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

  // ── Load wishes from DB on mount ──────────────────────────────────────────
  useEffect(() => {
    fetch('/api/wishes')
      .then((res) => res.json())
      .then((data: Wish[]) => setWishes(data))
      .catch(() => {});
  }, []);

  // ── Submit wish to DB ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          message: formData.message.trim(),
        }),
      });

      if (res.ok) {
        const newWish: Wish = await res.json();
        setWishes((prev) => [newWish, ...prev]);
        setFormData({ name: '', message: '' });
      }
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttendanceInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAttendanceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceData.name.trim() || !attendanceData.address.trim()) return;

    setAttendanceError(null);
    setIsSubmittingAttendance(true);

    const inviteTag =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('guest') ?? undefined
        : undefined;

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: attendanceData.name.trim(),
          address: attendanceData.address.trim(),
          status: attendanceData.status,
          inviteTag: inviteTag || undefined,
        }),
      });

      if (res.ok) {
        setAttendanceData({ name: '', address: '', status: 'attend' });
        setAttendanceSubmitted(true);
        window.setTimeout(() => setAttendanceSubmitted(false), 4000);
        return;
      }

      if (res.status === 503) {
        const newConfirmation: AttendanceConfirmation = {
          id: Date.now().toString(),
          name: attendanceData.name.trim(),
          address: attendanceData.address.trim(),
          status: attendanceData.status,
          date: new Date().toISOString().split('T')[0],
          inviteTag: inviteTag || undefined,
        };
        const prev = loadAttendanceConfirmations();
        saveAttendanceConfirmations([newConfirmation, ...prev]);
        setAttendanceData({ name: '', address: '', status: 'attend' });
        setAttendanceSubmitted(true);
        window.setTimeout(() => setAttendanceSubmitted(false), 4000);
        setAttendanceError('Saved locally (database not configured on server).');
        window.setTimeout(() => setAttendanceError(null), 5000);
        return;
      }

      const errBody = (await res.json().catch(() => null)) as { error?: string } | null;
      setAttendanceError(errBody?.error ?? 'Could not save. Please try again.');
    } catch {
      setAttendanceError('Network error. Please try again.');
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  const formatWishDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-4 px-4"
    >
      <Card className="border border-[rgba(212,165,116,0.28)] rounded-[24px] p-5 shadow-[0_20px_45px_rgba(66,10,10,0.35)] bg-[#420a0a] text-[#d4a574]">
        <h2 className="font-great-vibes text-[clamp(2.4rem,4.8vw,3.6rem)] leading-tight text-center mb-1 text-[#c89968]">
          <TypingText text="Your wishes means a lot for us" speed={34} />
        </h2>
        <p className="text-center mt-0 mb-4 text-[#d4a574]">
          Wishes and Attendance Confirmation
        </p>

        {/* Tab Switcher */}
        <div className="mb-5 flex rounded-2xl border border-[rgba(212,165,116,0.3)] bg-[#5a1515] p-1 gap-1">
          {[
            { id: 'wishes', label: 'Wishes' },
            { id: 'attendance', label: 'Attendance Confirmation' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'wishes' | 'attendance')}
              className="relative flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300"
              style={{ color: activeTab === tab.id ? '#420a0a' : 'rgba(212,165,116,0.88)' }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="rsvp-tab"
                  className="absolute inset-0 rounded-xl border border-[rgba(212,165,116,0.65)] shadow-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(201,153,104,0.95), rgba(212,165,116,0.94))' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'wishes' ? (
            <motion.div
              key="wishes-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32 }}
            >
              <div className="mx-auto w-fit font-semibold mb-4">
                <span className="inline-grid place-items-center w-[2.3rem] h-[2rem] mr-2 rounded-full bg-[#d4a574] text-[#420a0a]">
                  {wishes.length}
                </span>
                Wishes
              </div>

              <form onSubmit={handleSubmit} className="grid gap-2 mb-5">
                <label className="font-semibold text-[#d4a574]">Your Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="border border-[rgba(212,165,116,0.35)] rounded-xl bg-white/94 p-3 font-inherit text-[#2a3438]"
                  placeholder="Masukkan nama Anda"
                />

                <label className="font-semibold text-[#d4a574]">Write Your Wishes</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={300}
                  className="border border-[rgba(212,165,116,0.35)] rounded-xl bg-white/94 p-3 font-inherit text-[#2a3438] resize-none"
                  placeholder="Tulis Ucapan & Doa Terbaikmu"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#c89968] to-[#d4a574] text-[#1a0505] border-none rounded-full px-4 py-2.5 cursor-pointer text-sm mt-1 w-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                >
                  {isSubmitting ? 'Mengirim...' : 'Kirim'}
                </button>
              </form>

              <div className="mt-6 max-h-[420px] overflow-auto grid gap-3 pr-1">
                {wishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-b border-b-[rgba(212,165,116,0.25)] pb-3"
                  >
                    <div className="flex justify-between gap-3 font-bold">
                      <span>{wish.name}</span>
                      <span className="text-[#c89968] text-sm">{formatWishDate(wish.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-[#d4a574]">{wish.message}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="attendance-panel"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32 }}
            >
              <form onSubmit={handleAttendanceSubmit} className="grid gap-2 mb-5">
                <label className="font-semibold text-[#d4a574]">Name</label>
                <input
                  name="name"
                  type="text"
                  value={attendanceData.name}
                  onChange={handleAttendanceInputChange}
                  required
                  className="border border-[rgba(212,165,116,0.35)] rounded-xl bg-white/94 p-3 font-inherit text-[#2a3438]"
                  placeholder="Masukkan nama Anda"
                />

                <label className="font-semibold text-[#d4a574]">Address</label>
                <input
                  name="address"
                  type="text"
                  value={attendanceData.address}
                  onChange={handleAttendanceInputChange}
                  required
                  className="border border-[rgba(212,165,116,0.35)] rounded-xl bg-white/94 p-3 font-inherit text-[#2a3438]"
                  placeholder="Alamat Anda"
                />

                <label className="font-semibold text-[#d4a574]">Confirm Attendance</label>
                <select
                  name="status"
                  value={attendanceData.status}
                  onChange={handleAttendanceInputChange}
                  className="border border-[rgba(212,165,116,0.35)] rounded-xl bg-white/94 p-3 font-inherit text-[#2a3438]"
                >
                  <option value="attend">Attend</option>
                  <option value="not_attend">Not Attend</option>
                </select>

                <button
                  type="submit"
                  disabled={isSubmittingAttendance}
                  className="bg-gradient-to-r from-[#c89968] to-[#d4a574] text-[#1a0505] border-none rounded-full px-4 py-2.5 cursor-pointer text-sm mt-1 w-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
                >
                  {isSubmittingAttendance ? 'Menyimpan...' : 'Submit Confirmation'}
                </button>
              </form>

              {attendanceError ? (
                <p className="mt-3 text-center text-sm text-rose-300">{attendanceError}</p>
              ) : null}

              {attendanceSubmitted ? (
                <p className="mt-4 text-center text-sm font-medium text-[#c89968]">
                  Terima kasih — konfirmasi kehadiran Anda telah diterima.
                </p>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.section>
  );
}