import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaServer, FaNetworkWired, FaPlay, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { testService, userService } from '../services/api';
import ContainerCard from '../components/ContainerCard';

function Dashboard() {
  const [containerHistory, setContainerHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentContainer, setCurrentContainer] = useState(null);
  const [stats, setStats] = useState({ total_requests: 0, unique_containers: 0 });

  useEffect(() => {
    loadSessionData();
  }, []);

  const loadSessionData = async () => {
    try {
      const { data } = await userService.getSessions();
      const sessions = data.sessions || [];
      const uniqueIds = [...new Set(sessions.map((s) => s.container_id))];
      setContainerHistory(uniqueIds.slice(0, 6));
      setStats({ total_requests: sessions.length, unique_containers: uniqueIds.length });
    } catch {
      // First load — user has no sessions yet.
    }
  };

  const handleScaleTest = async () => {
    setLoading(true);
    try {
      const { data } = await testService.scaleTest();
      const id = data.container_id;
      setCurrentContainer(id);
      if (!containerHistory.includes(id)) {
        setContainerHistory((prev) => [id, ...prev].slice(0, 6));
      }
      setStats((prev) => ({
        total_requests: prev.total_requests + 1,
        unique_containers: new Set([...containerHistory, id]).size,
      }));
      toast.success(`Connected → ${id.slice(-12)}`);
    } catch {
      toast.error('Failed to reach the backend. Is Docker running?');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Requests', value: stats.total_requests, icon: <FaRocket />, color: 'tide' },
    { label: 'Unique Containers', value: stats.unique_containers, icon: <FaServer />, color: 'ember' },
    { label: 'Load Balancing', value: 'Active', icon: <FaNetworkWired />, color: 'tide' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-2">

      {/* ── Hero ── */}
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-midnight-800/60 p-8 md:p-12"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-tide-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-ember-400/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-tide-400/25 bg-tide-400/10 px-3 py-1 text-xs font-medium text-tide-400">
            <span className="dot-active" />
            Live Scaling Demo
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">
            Docker <span className="gradient-text">Scaling</span> Dashboard
          </h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Send requests and watch Nginx distribute them across multiple containers in real time.
            Each container ID in the response is proof of load balancing at work.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              onClick={handleScaleTest}
              disabled={loading}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Connecting…
                </>
              ) : (
                <>
                  <FaPlay className="text-xs" />
                  Test Scale Connection
                </>
              )}
            </motion.button>

            {currentContainer && (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 rounded-xl border border-tide-400/20 bg-tide-400/10 px-4 py-2.5"
              >
                <FaServer className="text-xs text-tide-400" />
                <span className="text-xs text-slate-400">Served by</span>
                <code className="text-sm font-semibold text-tide-400">{currentContainer.slice(-12)}</code>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {statCards.map(({ label, value, icon, color }) => (
          <div key={label} className="glass-panel flex items-center gap-4 rounded-2xl p-5">
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-midnight-900 ${
                color === 'tide'
                  ? 'bg-gradient-to-br from-tide-400 to-tide-500 shadow-glow'
                  : 'bg-gradient-to-br from-ember-400 to-ember-500 shadow-glow-ember'
              }`}
            >
              {icon}
            </div>
            <div>
              <p className="section-title">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Container History ── */}
      {containerHistory.length > 0 && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-white">Container History</h2>
            <span className="section-title">Last {containerHistory.length}</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {containerHistory.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ContainerCard
                  containerId={id}
                  onClick={() => setCurrentContainer(id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Info Cards ── */}
      <motion.div
        className="grid gap-4 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {[
          {
            title: 'How It Works',
            items: [
              'Nginx receives every request and picks the least-busy container.',
              'Click "Test Scale Connection" — watch the container ID change.',
              'Your session history shows the distribution across replicas.',
              'More replicas = more resilience and higher throughput.',
            ],
          },
          {
            title: 'Why Horizontal Scaling?',
            items: [
              'Handles traffic spikes without a single point of failure.',
              'Add or remove replicas without application downtime.',
              'Even load distribution keeps response times predictable.',
              'PostgreSQL persists data across all container instances.',
            ],
          },
        ].map(({ title, items }) => (
          <div key={title} className="glass-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-tide-400" />
              <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
            </div>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-slate-400">
                  <span className="mt-0.5 flex-shrink-0 text-ember-400">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Dashboard;
