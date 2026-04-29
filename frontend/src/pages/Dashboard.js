import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaServer, FaNetworkWired, FaPlay, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { testService, userService } from '../services/api';
import ContainerCard from '../components/ContainerCard';

function Dashboard() {
  const [containerHistory, setContainerHistory] = useState([]);
  const [containerUpdates, setContainerUpdates] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentContainer, setCurrentContainer] = useState(null);
  const [stats, setStats] = useState({ total_requests: 0, unique_containers: 0 });

  useEffect(() => {
    loadSessionData();
  }, []);

  // ----------------------------
  // Load session data properly
  // ----------------------------
  const loadSessionData = async () => {
    try {
      const { data } = await userService.getSessions();
      const sessions = data.sessions || [];
      console.log('Loaded sessions:', sessions);

      const updateMap = {};
      sessions.forEach((s) => {
        updateMap[s.container_id] = s.updated_at;
      });

      const uniqueIds = Object.keys(updateMap);

      setContainerHistory(uniqueIds);
      setContainerUpdates(updateMap);

      setStats({
        total_requests: sessions.length,
        unique_containers: uniqueIds.length,
      });
    } catch (err) {
      // First load or no data
      console.log("No sessions found yet");
    }
  };

  // ----------------------------
  // Scale test handler
  // ----------------------------
  const handleScaleTest = async () => {
    setLoading(true);

    try {
      const { data } = await testService.scaleTest();
      const id = data.container_id;

      const now = new Date().toISOString();

      setCurrentContainer(id);

      // Update history safely
      setContainerHistory((prev) => {
        const updated = new Set([id, ...prev]);
        setStats((s) => ({
          ...s,
          total_requests: s.total_requests + 1,
          unique_containers: updated.size,
        }));
        return [...updated];
      });

      // Update timestamp map
      setContainerUpdates((prev) => ({
        ...prev,
        [id]: now,
      }));

      toast.success(`Connected → ${id.slice(-12)}`);
    } catch (err) {
      toast.error('Failed to reach the backend. Is Docker running?');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI stats
  // ----------------------------
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
        <div className="relative">
          <h1 className="mt-4 font-display text-4xl font-semibold text-white md:text-5xl">
            Docker <span className="gradient-text">Scaling</span> Dashboard
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              onClick={handleScaleTest}
              disabled={loading}
              className="btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? 'Scale Connection Testing...' : (
                <>
                  <FaPlay className="text-xs" />
                  Test Scale Connection
                </>
              )}
            </motion.button>

            {currentContainer && (
              <div className="flex items-center gap-2 rounded-xl border border-tide-400/20 bg-tide-400/10 px-4 py-2.5">
                <FaServer className="text-xs text-tide-400" />
                <code className="text-sm font-semibold text-tide-400">
                  {currentContainer.slice(-12)}
                </code>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value, icon, color }) => (
          <div key={label} className="glass-panel flex items-center gap-4 rounded-2xl p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tide-400/20 text-white">
              {icon}
            </div>
            <div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-2xl font-semibold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Container History ── */}
      {containerHistory.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">Container History</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {containerHistory.map((id, i) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ContainerCard
                  containerId={id}
                  updatedAt={containerUpdates[id]}
                  onClick={() => setCurrentContainer(id)}
                />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── Info Section ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {[
          {
            title: 'How It Works',
            items: [
              'Nginx distributes traffic across containers.',
              'Each request maps to a container instance.',
              'Sessions track container-level routing.',
              'Scaling improves throughput and resilience.',
            ],
          },
          {
            title: 'Why Horizontal Scaling?',
            items: [
              'No single point of failure.',
              'Handles traffic spikes smoothly.',
              'Independent container execution.',
              'Database remains shared across replicas.',
            ],
          },
        ].map(({ title, items }) => (
          <div key={title} className="glass-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-tide-400" />
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>

            <ul className="space-y-2 text-sm text-slate-400">
              {items.map((item) => (
                <li key={item}>→ {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;