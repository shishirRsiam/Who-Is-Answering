import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaCircle } from 'react-icons/fa';

// Palette cycles through 5 vivid accent colours so each container gets a
// distinct colour when multiple containers appear side by side.
const PALETTE = ['#2ee6a6', '#ff8f3f', '#a78bfa', '#38bdf8', '#fb7185'];

function ContainerCard({ containerId, onClick }) {
  const colorIndex = parseInt(containerId.slice(-1), 10) % PALETTE.length;
  const color = PALETTE[colorIndex];
  const shortId = containerId.length > 12 ? containerId.slice(-12) : containerId;

  return (
    <motion.div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-midnight-800/60 p-6 backdrop-blur transition-colors duration-200 hover:border-white/20"
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
    >
      {/* Colour accent glow in top-right corner */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
          style={{ boxShadow: `0 0 16px ${color}55` }}
        >
          <FaServer style={{ color }} className="text-base" />
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          <FaCircle style={{ color, fontSize: 6 }} />
          Active
        </span>
      </div>

      {/* Container ID */}
      <div className="mt-5">
        <p className="section-title mb-1.5">Container ID</p>
        <p className="break-all font-mono text-sm font-semibold" style={{ color }}>
          {shortId}
        </p>
      </div>

      {/* Footer row */}
      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="section-title">Last Connected</span>
        <span className="text-xs text-slate-400">Just now</span>
      </div>
    </motion.div>
  );
}

export default ContainerCard;
