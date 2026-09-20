import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) { toast.success('Welcome back!'); navigate('/dashboard'); }
    else toast.error(result.message);
  };

  const inputStyle = {
    width: '100%', background: '#2a2a2a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '13px 16px',
    fontSize: 14, color: '#f0ebe0',
    fontFamily: 'Manrope, sans-serif',
    outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex' }}>
      {/* Left Image */}
      <div style={{ flex: 1, position: 'relative', display: 'none' }} className="login-img-panel">
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"
          alt="Travel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.55)' }} />
        <div style={{ position: 'absolute', bottom: 48, left: 48, right: 48 }}>
          <p className="font-serif" style={{ fontSize: 28, color: '#fff', lineHeight: 1.4, maxWidth: 320 }}>
            "The world is a book, and those who do not travel read only one page."
          </p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 12 }}>— Saint Augustine</p>
        </div>
      </div>

      {/* Right Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 380 }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 40 }}>
            <Compass size={20} style={{ color: '#7a8c5e' }} />
            <span className="font-serif" style={{ fontSize: 20, color: '#f0ebe0' }}>TripMate</span>
          </Link>

          <h1 className="font-serif" style={{ fontSize: 32, color: '#f0ebe0', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: '#9a9080', marginBottom: 32, lineHeight: 1.6 }}>
            Sign in to continue planning your adventures
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
                Email
              </label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', marginBottom: 8, fontFamily: 'Manrope, sans-serif' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9a9080', cursor: 'pointer', padding: 0, display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', marginTop: 4,
                background: loading ? 'rgba(122,140,94,0.4)' : '#7a8c5e',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Manrope, sans-serif', transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#8a9c6e'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#7a8c5e'; }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize: 14, color: '#9a9080', textAlign: 'center', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7a8c5e', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .login-img-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}
