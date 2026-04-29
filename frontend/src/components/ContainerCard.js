import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaCopy } from 'react-icons/fa';

const PALETTE = ['#2ee6a6', '#ff8f3f', '#a78bfa', '#38bdf8', '#fb7185'];

function CompactContainerCard({ containerId, updatedAt, onClick }) {
  // Stable hash-based color
  const hash = containerId
    .split('')
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const color = PALETTE[hash % PALETTE.length];
  const shortId = containerId.slice(0, 12);

  // Shorter time format for compact design
  function timeAgo(dateString) {
    if (!dateString) return "Unknown";

    const past = new Date(dateString);
    if (isNaN(past.getTime())) return "Unknown";

    const now = new Date();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  // Handy copy function
  const handleCopy = (e) => {
    e.stopPropagation(); // Prevents triggering the card's onClick
    navigator.clipboard.writeText(containerId);
    // You can trigger a toast notification here if you want
  };

  return (
    <motion.div
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 p-4 backdrop-blur-xl transition-all duration-300 hover:border-white/15 hover:bg-slate-800/50 hover:shadow-lg"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Subtle Top-Right Glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      {/* Header: Icon & Last Used */}
      <div className="relative z-10 flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/20 shadow-inner"
          style={{ boxShadow: `inset 0 0 12px -6px ${color}60` }}
        >
          <FaServer style={{ color }} className="text-lg drop-shadow-md" />
        </div>

        <div className="re text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Last Used
          </span>
          <p className="text-xs font-medium text-slate-300">
            {timeAgo(updatedAt)}
          </p>
        </div>
      </div>

      {/* Footer: Container ID & Copy Action */}
      <div className="relative z-10 mt-5 flex items-end justify-between border-t border-white/5 pt-3">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Container ID
          </span>
          <p
            className="font-mono text-sm font-bold tracking-tight text-slate-200 transition-colors group-hover:text-white"
            style={{ textShadow: `0 0 16px ${color}30` }}
          >
            {shortId}
          </p>
        </div>

        {/* Copy Button (Appears on Hover) */}
        <button
          onClick={handleCopy}
          className="rounded-md p-1.5 text-slate-500 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100"
          title="Copy full ID"
        >
          <FaCopy size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default CompactContainerCard;