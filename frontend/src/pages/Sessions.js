import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaServer } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../services/api';
import './Sessions.css';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await userService.getSessions();
      setSessions(response.data.sessions || []);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load sessions');
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container sessions-loading">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container sessions-page">
      <motion.div
        className="sessions-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1>Learning <span className="gradient-text">Sessions</span></h1>
        <p>Track your container interactions and scaling patterns</p>
      </motion.div>

      {sessions.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaServer className="empty-icon" />
          <h2>No Sessions Yet</h2>
          <p>Start by clicking "Test Scale Connection" on the Dashboard</p>
        </motion.div>
      ) : (
        <motion.div
          className="sessions-table-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="sessions-stats">
            <div className="stat-item">
              <span className="stat-label">Total Sessions</span>
              <span className="stat-value">{sessions.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Unique Containers</span>
              <span className="stat-value">{new Set(sessions.map(s => s.container_id)).size}</span>
            </div>
          </div>

          <table className="sessions-table">
            <thead>
              <tr>
                <th>
                  <FaClock /> Timestamp
                </th>
                <th>
                  <FaServer /> Container ID
                </th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Response Time (ms)</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <motion.tr
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="session-row"
                >
                  <td className="timestamp-cell">
                    {formatTime(session.timestamp)}
                  </td>
                  <td className="container-cell">
                    <span className="container-id-badge">
                      {session.container_id.slice(-12)}
                    </span>
                  </td>
                  <td className="endpoint-cell">
                    <code>{session.endpoint}</code>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge status-${session.status}`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="response-time-cell">
                    {(session.response_time * 1000).toFixed(2)}ms
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Info Card */}
      <motion.div
        className="sessions-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Understanding Your Sessions</h3>
        <div className="info-grid">
          <div className="info-item">
            <h4>Container ID</h4>
            <p>Unique identifier of the container that handled your request</p>
          </div>
          <div className="info-item">
            <h4>Load Balancing</h4>
            <p>Nginx distributes requests across multiple containers using round-robin</p>
          </div>
          <div className="info-item">
            <h4>Response Time</h4>
            <p>Time taken for the container to process your request</p>
          </div>
          <div className="info-item">
            <h4>Scaling Benefits</h4>
            <p>Multiple containers ensure high availability and fault tolerance</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Sessions;
