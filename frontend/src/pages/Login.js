import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.login(username, password);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setIsAuthenticated(true);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-160px)] items-center justify-center px-4">

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-tide-400/12 blur-3xl"
          animate={{ x: [0, 20, 0], y: [0, 24, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-ember-400/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 shadow-glow-lg">
          {/* Icon + Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-tide-400 to-ember-400 shadow-glow">
              <FaLock className="text-xl text-midnight-900" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-white">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-slate-400">Sign in to your ScaleHub account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" htmlFor="username">
                <FaUser className="text-xs text-tide-400" />
                Username
              </label>
              <input
                className="input"
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300" htmlFor="password">
                <FaLock className="text-xs text-tide-400" />
                Password
              </label>
              <input
                className="input"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <FaArrowRight className="text-xs" />
                </span>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-tide-400 transition-colors hover:text-tide-300">
              Create one free
            </Link>
          </p>
        </div>

        {/* Feature pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['JWT Auth', 'Docker Scaling', 'Nginx LB', 'PostgreSQL'].map((f) => (
            <span key={f} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-500">
              {f}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
