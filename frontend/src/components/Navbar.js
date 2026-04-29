import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars, FaTimes, FaSignOutAlt,
  FaUser, FaChartBar, FaHistory,
} from 'react-icons/fa';

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => pathname === path;

  const navLink =
    'text-sm font-medium transition-colors duration-200 hover:text-white';
  const activeClass = 'text-white';
  const inactiveClass = 'text-slate-400';

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { to: '/sessions', label: 'Sessions', icon: <FaHistory /> },
    { to: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-midnight-900/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-tide-400 to-ember-400 text-sm font-bold text-midnight-900 shadow-glow">
              S
            </span>
            <span className="font-display text-lg font-semibold text-white">
              Scale<span className="gradient-text">Hub</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              {authLinks.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${navLink} ${
                    isActive(to) ? activeClass : inactiveClass
                  } ${isActive(to) ? 'bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <span className={`text-xs ${isActive(to) ? 'text-tide-400' : 'text-slate-500'}`}>
                    {icon}
                  </span>
                  {label}
                </Link>
              ))}
              <div className="ml-2 h-6 w-px bg-white/10" />
              <motion.button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-2 rounded-lg border border-ember-400/30 bg-ember-400/10 px-4 py-2 text-sm font-medium text-ember-300 transition-all duration-200 hover:bg-ember-400/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSignOutAlt className="text-xs" />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`rounded-lg px-4 py-2 ${navLink} ${
                  isActive('/login') ? activeClass : inactiveClass
                } hover:bg-white/5`}
              >
                Sign In
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="ml-1 rounded-xl bg-gradient-to-r from-tide-400 to-ember-400 px-5 py-2 text-sm font-semibold text-midnight-900 shadow-glow"
                >
                  Get Started
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-midnight-900/95 px-6 py-4 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {authLinks.map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive(to)
                          ? 'bg-white/10 text-white'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className={isActive(to) ? 'text-tide-400' : 'text-slate-500'}>
                        {icon}
                      </span>
                      {label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-white/10" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-ember-300 hover:bg-ember-400/10"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-xl bg-gradient-to-r from-tide-400 to-ember-400 px-4 py-2.5 text-center text-sm font-semibold text-midnight-900"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
