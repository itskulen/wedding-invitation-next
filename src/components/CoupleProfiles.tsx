'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Person {
  name: string;
  parent: string;
  desc: string;
  image: string;
}

const people: Person[] = [
  {
    name: 'Latifah Qalbi Minza',
    parent: 'Putri dari Bapak Zainer & Ibu Minta Wahyuni (Almh)',
    desc: 'A gentle soul with a warm smile, she fills every room with kindness and grace.',
    image: '/TLV.jpg',
  },
  {
    name: 'Valen Harkin Aryo Dewanto',
    parent: 'Putra dari Bapak Suharja & Ibu Mia Suli Yunaini',
    desc: 'A calm and thoughtful partner who brings joy and laughter in every moment.',
    image: '/LNV.jpg',
  },
];

export default function CoupleProfiles() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-4 px-4"
      >
        <Card className="border border-[rgba(73,62,53,0.2)] rounded-[24px] p-5 shadow-[0_20px_45px_rgba(66,57,49,0.12)] bg-gradient-to-br from-white/83 via-[#f5f0e9]/80 to-[#eee7de]/78 backdrop-blur-sm">
          <h2 className="font-serif text-[clamp(2rem,3.4vw,2.6rem)] mb-1 text-center">
            Meet both of us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {people.map((person, index) => (
              <motion.button
                key={person.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                onClick={() => setSelectedPerson(person)}
                className="relative border border-[rgba(152,139,122,0.45)] rounded-[120px_120px_18px_18px] overflow-hidden p-0 cursor-pointer bg-white min-h-[460px] shadow-[0_15px_36px_rgba(73,62,53,0.2)] group hover:shadow-[0_20px_45px_rgba(73,62,53,0.3)] transition-shadow duration-300"
              >
                {/* Border decoration */}
                <div className="absolute inset-0 rounded-inherit border-2 border-[rgba(255,246,228,0.65)] pointer-events-none z-[2]" />
                
                {/* Image placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 group-hover:scale-105 transition-transform duration-450" />
                
                {/* Name overlay */}
                <span className="absolute left-3 right-3 bottom-12 bg-white/88 rounded-lg font-serif font-bold text-sm p-2 text-center group-hover:bg-white/95 transition-colors">
                  {person.name}
                </span>

                {/* Clickable hint */}
                <motion.div
                  className="absolute left-3 right-3 bottom-3 flex items-center justify-center"
                  initial={{ opacity: 0.6 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-1.5 text-[0.65rem] font-medium tracking-wide text-[#8a7060] uppercase">
                    <div className="h-0.5 w-3 bg-gradient-to-r from-[#c4a882] to-transparent" />
                    <span>Tap for details</span>
                    <div className="h-0.5 w-3 bg-gradient-to-l from-[#c4a882] to-transparent" />
                  </div>
                </motion.div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.section>

      {/* Profile Popup */}
      <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
        <DialogContent className="border-none rounded-2xl p-0 w-full max-w-[860px] bg-white/96">
          {selectedPerson && (
            <div className="grid grid-cols-[minmax(220px,320px)_1fr] gap-4 p-4">
              {/* Image */}
              <div className="w-full h-full max-h-[420px] bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl" />
              
              {/* Text content */}
              <div className="flex flex-col">
                <h3 className="font-serif text-2xl mb-1">{selectedPerson.name}</h3>
                <p className="text-[#6f655d] mb-2">{selectedPerson.parent}</p>
                <p className="text-[#3a342f] mb-4">{selectedPerson.desc}</p>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="bg-[#b8ab9f] text-[#24201c] border-none rounded-full px-4 py-2 cursor-pointer text-sm w-fit hover:-translate-y-0.5 transition-transform"
                >
                  close profile
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
