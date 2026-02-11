
import React from 'react';
import { motion } from 'framer-motion';
import { GlassCardProps } from '../../types';

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg transform-gpu ${className}`}
    >
      {/* Glossy shine effect wrapper - Clipped */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-[0.05] group-hover:animate-shine" />
      </div>

      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};
