import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaShieldAlt, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { userService } from '../services/api';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const { data } = await userService.getProfile();
        setUser(data.user);
        setFormData(data.user);
      } catch {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await userService.updateProfile({
        first_name: formData.first_name || '',
        last_name: formData.last_name || '',
        avatar: formData.profile?.avatar || formData.avatar || '',
        bio: formData.profile?.bio || formData.bio || '',
      });
      setUser(data.user);
      setFormData(data.user);
      setIsEditing(false);
      toast.success('Profile saved!');
    } catch {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  const initials =
    (formData.first_name?.[0] || user?.username?.[0] || '?').toUpperCase();

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Name not set';

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-2">

      {/* ── Page header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-semibold text-white">My Profile</h1>
        <p className="mt-1.5 text-sm text-slate-400">View and update your account information.</p>
      </motion.div>

      {/* ── Profile card ── */}
      <motion.div
        className="glass-panel rounded-3xl p-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Avatar + name row */}
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-tide-400 to-ember-400 text-3xl font-bold text-midnight-900 shadow-glow">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-midnight-800">
              <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </span>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">{fullName}</h2>
            <p className="flex items-center gap-1.5 text-sm text-slate-400">
              <FaUser className="text-xs text-tide-400" />
              @{user?.username}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
              <FaEnvelope className="text-xs text-tide-400" />
              {user?.email}
            </p>
          </div>

          {!isEditing && (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="btn-outline ml-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaEdit className="text-xs" />
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Details / Form */}
        {!isEditing ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { label: 'First Name', value: user?.first_name || '—' },
              { label: 'Last Name', value: user?.last_name || '—' },
              { label: 'Bio', value: user?.profile?.bio || 'No bio added.', full: true },
            ].map(({ label, value, full }) => (
              <div key={label} className={`rounded-xl border border-white/10 bg-white/5 p-4 ${full ? 'sm:col-span-2' : ''}`}>
                <p className="section-title mb-1.5">{label}</p>
                <p className="text-sm text-slate-200">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="first_name" className="mb-2 block text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  className="input"
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name || ''}
                  onChange={handleChange}
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="mb-2 block text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  className="input"
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name || ''}
                  onChange={handleChange}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-sm font-medium text-slate-300">
                Bio
              </label>
              <textarea
                className="input min-h-[100px] resize-y"
                id="bio"
                name="bio"
                value={formData.profile?.bio || formData.bio || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value },
                    bio: e.target.value,
                  }))
                }
                placeholder="Tell us about yourself…"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {saving ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : (
                  <>
                    <FaSave className="text-xs" /> Save Changes
                  </>
                )}
              </motion.button>
              <motion.button
                onClick={cancelEdit}
                className="btn-outline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaTimes className="text-xs" /> Cancel
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Account badges ── */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {[
          { label: 'Account Status', value: 'Active', icon: <FaShieldAlt />, color: 'tide' },
          { label: 'Membership', value: 'Premium', icon: <FaStar />, color: 'ember' },
        ].map(({ label, value, icon, color }) => (
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
              <p className="mt-1 text-xl font-semibold text-white">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Profile;
