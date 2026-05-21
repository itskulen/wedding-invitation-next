'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { X, Copy, Check, Download, Search, Trash2, Plus, RefreshCw } from 'lucide-react';
import {
  type AttendanceConfirmation,
  ATTENDANCE_STORAGE_KEY,
  loadAttendanceConfirmations,
} from '@/lib/attendance-storage';

interface Guest {
  id: string;
  name: string;
  addedAt: number;
}

interface GuestManagerProps {
  initialAttendance?: AttendanceConfirmation[];
  databaseEnabled?: boolean;
}

export default function GuestManager({
  initialAttendance = [],
  databaseEnabled = false,
}: GuestManagerProps) {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceConfirmation[]>(initialAttendance);
  const [newGuestName, setNewGuestName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [importText, setImportText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const STORAGE_KEY = 'wedding-guests';

  const refreshAttendance = useCallback(() => {
    if (databaseEnabled) {
      router.refresh();
    } else {
      setAttendance(loadAttendanceConfirmations());
    }
  }, [databaseEnabled, router]);

  useEffect(() => {
    setAttendance(initialAttendance);
  }, [initialAttendance]);

  // Load guests from localStorage on mount; attendance from server props when DB is enabled
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setGuests(JSON.parse(stored));
      }
      if (!databaseEnabled) {
        setAttendance(loadAttendanceConfirmations());
      }
    } catch (err) {
      console.error('Failed to load guests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [databaseEnabled]);

  // When using localStorage fallback: sync across tabs; when using DB: refresh list on window focus
  useEffect(() => {
    if (databaseEnabled) {
      const onFocus = () => router.refresh();
      window.addEventListener('focus', onFocus);
      return () => window.removeEventListener('focus', onFocus);
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === ATTENDANCE_STORAGE_KEY) {
        setAttendance(loadAttendanceConfirmations());
      }
    };

    const onFocus = () => setAttendance(loadAttendanceConfirmations());

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, [databaseEnabled, router]);

  // Save guests to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    }
  }, [guests, isLoading]);

  // Show and hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Show and hide copy confirmation
  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => setCopiedIndex(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  const generateLink = (name: string): string => {
    const encoded = encodeURIComponent(name);
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    return `${origin}/?guest=${encoded}`;
  };

  const addGuest = useCallback(() => {
    const trimmedName = newGuestName.trim();
    
    if (!trimmedName) {
      setSuccessMessage('Please enter a guest name');
      return;
    }

    // Check for duplicate (case-insensitive)
    if (guests.some(g => g.name.toLowerCase() === trimmedName.toLowerCase())) {
      setSuccessMessage(`${trimmedName} is already in the list`);
      return;
    }

    const newGuest: Guest = {
      id: `${Date.now()}-${Math.random()}`,
      name: trimmedName,
      addedAt: Date.now(),
    };

    setGuests([...guests, newGuest]);
    setNewGuestName('');
    setSuccessMessage(`✓ ${trimmedName} added successfully`);
  }, [newGuestName, guests]);

  const deleteGuest = useCallback((id: string, name: string) => {
    setGuests(guests.filter(g => g.id !== id));
    setSuccessMessage(`✓ ${name} removed`);
  }, [guests]);

  const copyToClipboard = useCallback(async (link: string, id: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedIndex(id);
    } catch (err) {
      console.error('Failed to copy:', err);
      setSuccessMessage('Failed to copy link');
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addGuest();
    }
  };

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const attendCount = attendance.filter((item) => item.status === 'attend').length;

  const exportLinks = useCallback(() => {
    const links = guests
      .map(g => generateLink(g.name))
      .join('\n');
    
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(links)}`
    );
    element.setAttribute('download', 'wedding-invitations.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setSuccessMessage(`✓ Exported ${guests.length} invitation links`);
  }, [guests]);

  const handleBatchImport = () => {
    const names = importText
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      setSuccessMessage('No valid names found');
      return;
    }

    const newGuests: Guest[] = [];
    let duplicates = 0;

    names.forEach(name => {
      if (!guests.some(g => g.name.toLowerCase() === name.toLowerCase())) {
        newGuests.push({
          id: `${Date.now()}-${Math.random()}`,
          name,
          addedAt: Date.now(),
        });
      } else {
        duplicates++;
      }
    });

    if (newGuests.length > 0) {
      setGuests([...guests, ...newGuests]);
      setSuccessMessage(
        duplicates > 0
          ? `✓ Added ${newGuests.length} guests (${duplicates} duplicate${duplicates !== 1 ? 's' : ''} skipped)`
          : `✓ Added ${newGuests.length} guests`
      );
    } else {
      setSuccessMessage(`✗ All ${duplicates} names already exist`);
    }

    setImportText('');
    setShowImportModal(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-[#6f655d]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ background: 'linear-gradient(135deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="font-serif text-4xl md:text-5xl mb-2"
            style={{ color: '#3a2e26' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Guest Manager
          </motion.h1>
          <motion.p
            className="text-[#8b7d72]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Manage and distribute your wedding invitation links
          </motion.p>
        </div>

        {/* Main Card */}
        <Card
          className="rounded-[24px] p-6 md:p-8 border border-[rgba(184,160,120,0.3)] shadow-[0_25px_50px_rgba(184,171,159,0.15)]"
          style={{ background: 'linear-gradient(150deg, #faf7f2 0%, #f5ede0 50%, #ede3d4 100%)' }}
        >
          {/* Stats Bar */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { label: 'Total Guests', value: guests.length },
              { label: 'Showing', value: filteredGuests.length },
              { label: 'Status', value: guests.length > 0 ? '✓ Ready' : '○ Empty' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg p-4 text-center"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}
              >
                <div className="text-sm text-[#8b7d72] mb-1">{stat.label}</div>
                <div className="text-2xl font-bold" style={{ color: '#d4a843' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Attendance Summary */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {[
              { label: 'Attendance Confirmed', value: attendance.length },
              { label: 'Guest Attend', value: attendCount },
              { label: 'Not Attend', value: attendance.length - attendCount },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-lg p-4 text-center"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}
              >
                <div className="text-sm text-[#8b7d72] mb-1">{stat.label}</div>
                <div className="text-2xl font-bold" style={{ color: '#d4a843' }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Input Section */}
          <motion.div
            className="mb-8 space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium" style={{ color: '#3a2e26' }}>
              Add New Guest
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter guest name..."
                className="flex-1 px-4 py-3 rounded-lg border border-[rgba(184,160,120,0.3)] bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#d4a843] transition-all"
                style={{ color: '#3a2e26' }}
              />
              <motion.button
                onClick={addGuest}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
                style={{
                  background: 'linear-gradient(135deg, #d4a843 0%, #c4943f 100%)',
                  color: '#faf7f2',
                  boxShadow: '0 4px 12px rgba(212,168,67,0.25)',
                }}
              >
                <Plus size={18} />
                Add
              </motion.button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              onClick={() => setShowImportModal(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: 'rgba(184,160,120,0.15)',
                color: '#3a2e26',
                border: '1px solid rgba(184,160,120,0.3)',
              }}
            >
              📋 Batch Import
            </motion.button>
            <motion.button
              onClick={exportLinks}
              disabled={guests.length === 0}
              whileHover={guests.length > 0 ? { scale: 1.02 } : {}}
              whileTap={guests.length > 0 ? { scale: 0.98 } : {}}
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: guests.length > 0 ? 'rgba(212,168,67,0.15)' : 'rgba(212,168,67,0.08)',
                color: '#3a2e26',
                border: '1px solid rgba(212,168,67,0.3)',
              }}
            >
              <Download size={16} />
              Export Links
            </motion.button>
          </motion.div>

          {/* Search */}
          {guests.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89f97]" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guests..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[rgba(184,160,120,0.3)] bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#d4a843] transition-all text-sm"
                  style={{ color: '#3a2e26' }}
                />
              </div>
            </motion.div>
          )}

          {/* Guest List */}
          <AnimatePresence>
            {filteredGuests.length > 0 ? (
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {filteredGuests.map((guest, index) => (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group p-4 rounded-lg border border-[rgba(184,160,120,0.2)] backdrop-blur-sm hover:border-[rgba(212,168,67,0.3)] transition-all"
                    style={{ background: 'rgba(255,248,228,0.5)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                      {/* Guest Name */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate" style={{ color: '#3a2e26' }}>
                          {guest.name}
                        </h3>
                        <p className="text-xs text-[#a89f97] truncate">
                          {generateLink(guest.name)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        {/* Copy Button */}
                        <motion.button
                          onClick={() => copyToClipboard(generateLink(guest.name), guest.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg transition-all flex items-center gap-1"
                          style={{
                            background: copiedIndex === guest.id
                              ? 'rgba(100, 200, 100, 0.2)'
                              : 'rgba(212,168,67,0.15)',
                            color: copiedIndex === guest.id ? '#4CAF50' : '#d4a843',
                          }}
                          title="Copy invitation link"
                        >
                          {copiedIndex === guest.id ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </motion.button>

                        {/* Delete Button */}
                        <motion.button
                          onClick={() => deleteGuest(guest.id, guest.name)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg transition-all"
                          style={{
                            background: 'rgba(200, 100, 100, 0.1)',
                            color: '#c86464',
                          }}
                          title="Remove guest"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : guests.length > 0 ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-[#8b7d72]">No guests match "{searchQuery}"</p>
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[#8b7d72] mb-2">No guests added yet</p>
                <p className="text-sm text-[#a89f97]">Add your first guest above to get started</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Attendance Data List */}
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <motion.div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold" style={{ color: '#3a2e26' }}>
                Attendance Confirmations
              </h2>
              <motion.button
                type="button"
                onClick={refreshAttendance}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(184,160,120,0.35)] px-3 py-1.5 text-xs font-semibold text-[#3a2e26]"
                style={{ background: 'rgba(212,168,67,0.12)' }}
              >
                <RefreshCw size={13} />
                Refresh
              </motion.button>
            </motion.div>
            <p className="mb-3 text-xs text-[#8b7d72]">
              {databaseEnabled
                ? 'Attendance is stored in MySQL. Use Refresh to load the latest submissions.'
                : 'Attendance is stored in this browser (demo). Use Refresh after guests submit, or configure DATABASE_URL for production.'}
            </p>
            {attendance.length === 0 ? (
              <p className="text-sm text-[#8b7d72]">No attendance confirmations yet.</p>
            ) : (
              <div className="space-y-2">
                {attendance.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg p-3 border border-[rgba(184,160,120,0.22)]"
                    style={{ background: 'rgba(255,248,228,0.45)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium" style={{ color: '#3a2e26' }}>{item.name}</p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.status === 'attend'
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-rose-200 text-rose-900'
                        }`}
                      >
                        {item.status === 'attend' ? 'Attend' : 'Not Attend'}
                      </span>
                    </div>
                    <p className="text-sm text-[#6f655d] mt-1">{item.address}</p>
                    {item.inviteTag ? (
                      <p className="text-xs text-[#a89f97] mt-1">Invite: {item.inviteTag}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </Card>
      </motion.div>

      {/* Success Message Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 max-w-md px-6 py-3 rounded-full font-medium shadow-lg text-center"
            style={{
              background: 'linear-gradient(135deg, #d4a843 0%, #c4943f 100%)',
              color: '#faf7f2',
              boxShadow: '0 8px 24px rgba(212,168,67,0.3)',
            }}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Batch Import Modal */}
      <AnimatePresence>
        {showImportModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImportModal(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif" style={{ color: '#3a2e26' }}>
                  Batch Import Guests
                </h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} style={{ color: '#8b7d72' }} />
                </button>
              </div>

              <p className="text-sm text-[#8b7d72] mb-4">
                Paste guest names, one per line:
              </p>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="John Doe&#10;Jane Smith&#10;Sarah Johnson"
                className="w-full h-32 p-3 border border-[rgba(184,160,120,0.3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a843] resize-none"
                style={{ color: '#3a2e26' }}
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[rgba(184,160,120,0.3)] font-medium transition-colors"
                  style={{ color: '#3a2e26' }}
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleBatchImport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #d4a843 0%, #c4943f 100%)',
                    color: '#faf7f2',
                  }}
                >
                  Import
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
