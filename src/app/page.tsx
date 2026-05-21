'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope from '@/components/Envelope';
import Invitation from '@/components/Invitation';

export default function Home() {
  const [isInvitationOpen, setIsInvitationOpen] = useState(false);

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f6f3ef] overflow-hidden">
      {/* Paper noise overlay */}
      <div className="fixed inset-0 opacity-8 z-0 pointer-events-none bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      
      {/* Envelope Stage */}
      <AnimatePresence>
        {!isInvitationOpen && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <Envelope onOpen={handleOpenInvitation} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Invitation */}
      <AnimatePresence>
        {isInvitationOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10"
          >
            <Invitation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
