import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { authService } from '../services/api';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (error) {
      const errorMsg = error.response?.data;
      if (typeof errorMsg === 'object') {
        Object.values(errorMsg).forEach(msg => toast.error(msg[0] || msg));
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card auth-card-register"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-header">
          <h1 className="gradient-text">Join ScaleHub</h1>
          <p>Create your account and start learning Docker scaling</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="username">
                <FaUser /> Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose username"
                required
                disabled={loading}
              />
            </motion.div>

            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="email">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                disabled={loading}
              />
            </motion.div>
          </div>

          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="First name"
                disabled={loading}
              />
            </motion.div>

            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Last name"
                disabled={loading}
              />
            </motion.div>
          </div>

          <div className="form-row">
            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="password">
                <FaLock /> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                required
                disabled={loading}
              />
            </motion.div>

            <motion.div className="form-group" whileFocus={{ scale: 1.02 }}>
              <label htmlFor="password_confirm">
                <FaLock /> Confirm Password
              </label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                disabled={loading}
              />
            </motion.div>
          </div>

          <motion.button
            type="submit"
            className="btn-primary btn-large"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </motion.div>

      <div className="auth-decoration">
        <motion.div
          className="decoration-circle decoration-1"
          animate={{
            x: [0, 30, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="decoration-circle decoration-2"
          animate={{
            x: [0, -30, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        ></motion.div>
      </div>
    </div>
  );
}

export default Register;
