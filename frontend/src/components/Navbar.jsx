import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Bookmark, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setProfileOpen(false); }, [location]);

  const navLinks = [
    { label: 'Explore', to: '/' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Plan a Trip', to: '/create-trip' },
    { label: 'My Trips', to: '/trips' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.4s ease',
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled ? 'rgba(26,26,26,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <Compass size={22} style={{ color: '#7a8c5e' }} />
          <span className="font-serif" style={{ fontSize: 20, color: '#f0ebe0', letterSpacing: '0.03em' }}>TripMate</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive(link.to) ? '#7a8c5e' : '#9a9080',
                transition: 'color 0.2s',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = '#f0ebe0'; }}
              onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = '#9a9080'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="hidden-mobile">
          {user ? (
            <>
              <Link to="/trips" style={{ color: '#9a9080', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'}
                onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
                <Bookmark size={18} />
              </Link>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9a9080', fontSize: 14, padding: 0,
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'rgba(122,140,94,0.15)',
                    border: '1px solid rgba(122,140,94,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={15} style={{ color: '#7a8c5e' }} />
                  </div>
                  <span style={{ color: '#f0ebe0', fontWeight: 500 }}>{user.name?.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', right: 0, top: 46,
                        width: 200,
                        background: '#242424',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 14,
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <Link to="/dashboard"
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', color: '#9a9080', textDecoration: 'none', fontSize: 14 }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#f0ebe0'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9a9080'; }}
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                      <button
                        onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                          padding: '12px 16px', background: 'none', border: 'none',
                          color: '#9a9080', fontSize: 14, cursor: 'pointer', textAlign: 'left',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#f87171'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9a9080'; }}
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                style={{ fontSize: 14, color: '#9a9080', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => e.target.style.color = '#f0ebe0'}
                onMouseLeave={e => e.target.style.color = '#9a9080'}
              >
                Sign In
              </Link>
              <Link to="/register" style={{
                fontSize: 13, fontWeight: 600,
                padding: '9px 20px',
                background: '#7a8c5e',
                color: '#fff',
                borderRadius: 10,
                textDecoration: 'none',
                transition: 'background 0.2s',
                letterSpacing: '0.02em',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'}
                onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#9a9080', padding: 4, display: 'none' }}
          className="show-mobile"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(26,26,26,0.99)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '16px 24px 20px',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} style={{
                padding: '10px 0', fontSize: 15, fontWeight: 500,
                color: isActive(link.to) ? '#7a8c5e' : '#9a9080',
                textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" style={{ padding: '10px 0', fontSize: 15, color: '#9a9080', textDecoration: 'none' }}>Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }}
                  style={{ background: 'none', border: 'none', textAlign: 'left', padding: '10px 0', fontSize: 15, color: '#f87171', cursor: 'pointer' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10, paddingTop: 12 }}>
                <Link to="/login" style={{
                  flex: 1, textAlign: 'center', padding: '10px 0',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
                  fontSize: 14, color: '#9a9080', textDecoration: 'none',
                }}>Sign In</Link>
                <Link to="/register" style={{
                  flex: 1, textAlign: 'center', padding: '10px 0',
                  background: '#7a8c5e', borderRadius: 10,
                  fontSize: 14, color: '#fff', textDecoration: 'none', fontWeight: 600,
                }}>Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </motion.nav>
  );
}
