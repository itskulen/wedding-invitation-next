'use client';

import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center py-6 px-5 text-[#6f655d]"
    >
      <p>Created By Aryo Dewanto</p>
    </motion.footer>
  );
}
