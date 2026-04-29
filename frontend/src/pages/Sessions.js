import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaServer, FaLayerGroup, FaBolt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../services/api';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await userService.getSessions();
        setSessions(data.sessions || []);
      } catch {
        toast.error('Failed to load sessions.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatTime = (ts) =>
    new Date(ts).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });

  const uniqueContainers = new Set(sessions.map((s) => s.container_id)).size;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-2">

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold text-white">
          Learning <span className="gradient-text">Sessions</span>
        </h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Every "Test Scale Connection" request is logged here with its container and response time.
        </p>
      </motion.div>

      {sessions.length === 0 ? (
        <motion.div
          className="glass-panel flex flex-col items-center rounded-3xl p-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaServer className="text-5xl text-tide-400/40" />
          <h2 className="mt-5 font-display text-2xl font-semibold text-white">No Sessions Yet</h2>
          <p className="mt-2 text-sm text-slate-400">
            Go to the Dashboard and click <strong className="text-white">Test Scale Connection</strong> to generate your first session.
          </p>
        </motion.div>
      ) : (
        <>
          {/* ── Summary stats ── */}
          <motion.div
            className="grid gap-4 sm:grid-cols-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { label: 'Total Sessions', value: sessions.length, icon: <FaLayerGroup />, color: 'tide' },
              { label: 'Unique Containers', value: uniqueContainers, icon: <FaServer />, color: 'ember' },
              {
                label: 'Avg Response',
                value: `${(sessions.reduce((s, r) => s + r.response_time, 0) / sessions.length * 1000).toFixed(1)}ms`,
                icon: <FaBolt />,
                color: 'tide',
              },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="glass-panel flex items-center gap-4 rounded-2xl p-5">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-midnight-900 ${
                    color === 'tide'
                      ? 'bg-gradient-to-br from-tide-400 to-tide-500'
                      : 'bg-gradient-to-br from-ember-400 to-ember-500'
                  }`}
                >
                  {icon}
                </div>
                <div>
                  <p className="section-title">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-white">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* ── Sessions table ── */}
          <motion.div
            className="glass-panel overflow-hidden rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4">
                      <span className="flex items-center gap-2 section-title">
                        <FaClock /> Timestamp
                      </span>
                    </th>
                    <th className="px-6 py-4">
                      <span className="flex items-center gap-2 section-title">
                        <FaServer /> Container ID
                      </span>
                    </th>
                    <th className="px-6 py-4 section-title">Endpoint</th>
                    <th className="px-6 py-4 section-title">Status</th>
                    <th className="px-6 py-4 text-right section-title">Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, idx) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-white/5 transition-colors hover:bg-white/3 last:border-transparent"
                    >
                      <td className="px-6 py-3.5 text-xs text-slate-400">
                        {formatTime(session.timestamp)}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="badge-tide font-mono">
                          {session.container_id.slice(-12)}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <code className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-amber-200">
                          {session.endpoint}
                        </code>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="badge-success">{session.status}</span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <span className="text-xs font-medium text-amber-200">
                          {(session.response_time * 1000).toFixed(2)} ms
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* ── Info cards ── */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { title: 'Container ID', text: 'Each ID identifies the specific Docker replica that handled your request. Seeing multiple IDs confirms Nginx is load-balancing.' },
          { title: 'Response Time', text: 'Measured in milliseconds from when the view function starts to when the session is logged — shows per-container processing cost.' },
          { title: 'Load Balancing', text: 'Nginx uses the least-connection algorithm: the replica with fewest active connections wins, distributing load evenly.' },
          { title: 'Fault Tolerance', text: 'If one container fails, Nginx automatically stops routing to it. Your other sessions continue uninterrupted.' },
        ].map(({ title, text }) => (
          <div key={title} className="glass-panel rounded-2xl p-5">
            <h4 className="font-display text-sm font-semibold text-white">{title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Sessions;
