'use client';

import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun } from 'lucide-react';

export function WeatherLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Cloud className="h-16 w-16 text-blue-400" />
        </motion.div>

        <motion.div
          className="absolute -right-6 top-2"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Sun className="h-10 w-10 text-yellow-400" />
        </motion.div>

        <motion.div
          className="absolute -left-4 top-8"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
        >
          <CloudRain className="h-8 w-8 text-gray-400" />
        </motion.div>
      </div>

      <div className="space-y-2 text-center">
        <motion.h3
          className="text-lg font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Chargement des données météo...
        </motion.h3>

        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
