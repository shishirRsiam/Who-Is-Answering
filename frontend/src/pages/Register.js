import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';

const FIELDS = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username', icon: <FaUser />, required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', icon: <FaEnvelope />, required: true },
  { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'John', icon: null, required: false },
  { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Doe', icon: null, required: false },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', icon: <FaLock />, required: true },
  { name: 'password_confirm', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password', icon: <FaLock />, required: true },
];

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(formData);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error) {
      const errors = error.response?.data;
      if (errors && typeof errors === 'object') {
        Object.entries(errors).forEach(([field, msgs]) => {
          const msg = Array.isArray(msgs) ? msgs[0] : msgs;
          toast.error(`${field}: ${msg}`);
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-10">

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
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="glass-panel rounded-3xl p-8 shadow-glow-lg">
          {/* Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-tide-400 to-ember-400 shadow-glow">
              <FaRocket className="text-xl text-midnight-900" />
            </div>
            <h1 className="font-display text-3xl font-semibold text-white">Join ScaleHub</h1>
            <p className="mt-1.5 text-sm text-slate-400">Create your free account and explore Docker scaling</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map(({ name, label, type, placeholder, icon, required }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
                  >
                    {icon && <span className="text-xs text-tide-400">{icon}</span>}
                    {label}
                    {required && <span className="text-ember-400">*</span>}
                  </label>
                  <input
                    className="input"
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={loading}
                  />
                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              className="btn-primary mt-2 w-full"
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
                  Creating account…
                </span>
              ) : (
                'Create Free Account'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-tide-400 transition-colors hover:text-tide-300">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
