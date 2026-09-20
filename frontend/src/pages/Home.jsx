import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star, Mountain, Waves, Landmark, Zap, UtensilsCrossed, Sunset } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { destinationsAPI } from '../services/api';

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
});

const categories = [
  { label: 'Mountains', icon: Mountain, color: '#7a8c5e' },
  { label: 'Beaches', icon: Waves, color: '#5e8a8c' },
  { label: 'Culture', icon: Landmark, color: '#8c7a5e' },
  { label: 'Adventure', icon: Zap, color: '#8c5e5e' },
  { label: 'Food', icon: UtensilsCrossed, color: '#8c7a5e' },
  { label: 'Weekend', icon: Sunset, color: '#7a5e8c' },
];

const features = [
  {
    title: 'Build your itinerary',
    desc: 'Day-by-day planning with activities, times, and notes — all in one elegant timeline.',
    img: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  },
  {
    title: 'Know your budget',
    desc: 'Track every expense category and see your total estimated spend before you even pack.',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
  },
  {
    title: 'Travel with confidence',
    desc: 'Real-time weather, destination insights, and travel tips — everything you need.',
    img: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
  },
];

const F = 'Manrope, sans-serif';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    destinationsAPI.getAll({ featured: true }).then(({ data }) => setFeatured(data)).catch(() => {});
  }, []);

  return (
    <MainLayout>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920"
            alt="Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.6) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.85) 0%, transparent 60%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1280, margin: '0 auto', padding: '0 24px', paddingTop: 100, width: '100%' }}>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7a8c5e', fontFamily: F, marginBottom: 24 }}>
              <span style={{ width: 32, height: 1, background: '#7a8c5e', display: 'inline-block' }} />
              Smart Travel Planning
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif"
            style={{ fontSize: 'clamp(40px, 7vw, 80px)', color: '#f0ebe0', lineHeight: 1.1, maxWidth: 700, marginBottom: 24 }}
          >
            Travel Less Randomly.
            <br />
            <em style={{ color: '#d4c5a9', fontStyle: 'italic' }}>Experience More</em>
            <br />
            Intentionally.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 17, color: '#9a9080', maxWidth: 480, lineHeight: 1.75, marginBottom: 40, fontFamily: F }}
          >
            Plan meaningful trips, discover remarkable places, and organize every detail in one beautiful workspace.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}
          >
            <Link to="/create-trip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: '#7a8c5e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: F, transition: 'background 0.2s, gap 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#8a9c6e'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#7a8c5e'; }}
            >
              Plan a Trip <ArrowRight size={16} />
            </Link>
            <Link to="/destinations"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', color: '#f0ebe0', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: F, border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            >
              Explore Destinations
            </Link>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(26,26,26,0.82)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '14px 16px', maxWidth: 460, width: '100%' }}
          >
            <MapPin size={16} style={{ color: '#7a8c5e', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && navigate(`/destinations?search=${search}`)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#f0ebe0', fontFamily: F, flex: 1, padding: 0 }}
            />
            <button
              onClick={() => navigate(`/destinations?search=${search}`)}
              style={{ padding: '8px 16px', background: '#7a8c5e', color: '#fff', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: F, transition: 'background 0.2s', flexShrink: 0 }}
              onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'}
              onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}
            >
              Search
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
        >
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, transparent, rgba(122,140,94,0.6))' }} />
        </motion.div>
      </section>

      {/* ── FEATURED DESTINATIONS ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '96px 24px' }}>
        <motion.div {...fadeUp(0)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7a8c5e', fontFamily: F }}>Handpicked</span>
            <h2 className="font-serif" style={{ fontSize: 40, color: '#f0ebe0', marginTop: 8 }}>Featured Destinations</h2>
          </div>
          <Link to="/destinations"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9a9080', textDecoration: 'none', fontFamily: F, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'}
            onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}
          >
            View all <ArrowRight size={14} />
          </Link>
        </motion.div>

        {featured.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }} className="feat-grid">
            {/* Large card */}
            {featured[0] && (
              <motion.div {...fadeUp(0)} style={{ gridColumn: '1', gridRow: '1 / 3', position: 'relative', borderRadius: 20, overflow: 'hidden', height: 500, cursor: 'pointer' }} className="feat-large">
                <Link to={`/destinations/${featured[0]._id}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <img src={featured[0].image} alt={featured[0].name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MapPin size={12} style={{ color: '#7a8c5e' }} />
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>{featured[0].country}</span>
                    </div>
                    <h3 className="font-serif" style={{ fontSize: 34, color: '#fff', marginBottom: 8 }}>{featured[0].name}</h3>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', maxWidth: 360, lineHeight: 1.6, fontFamily: F, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{featured[0].description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 12 }}>
                      <Star size={12} style={{ color: '#c9a84c', fill: '#c9a84c' }} />
                      <span style={{ fontSize: 12, color: '#c9a84c', fontFamily: F }}>{featured[0].rating}</span>
                    </div>
                  </div>
                  <div style={{ position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={15} style={{ color: '#fff' }} />
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Small cards */}
            {featured.slice(1, 5).map((dest, i) => (
              <motion.div key={dest._id} {...fadeUp(i + 1)} style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 240, cursor: 'pointer' }} className="feat-small">
                <Link to={`/destinations/${dest._id}`} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
                  <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, padding: '20px' }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: F }}>{dest.country}</span>
                    <h3 className="font-serif" style={{ fontSize: 20, color: '#fff', marginTop: 4 }}>{dest.name}</h3>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ArrowRight size={13} style={{ color: '#fff' }} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── EXPLORE BY EXPERIENCE ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 96px' }}>
        <motion.div {...fadeUp(0)} style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7a8c5e', fontFamily: F }}>Browse by</span>
          <h2 className="font-serif" style={{ fontSize: 40, color: '#f0ebe0', marginTop: 8 }}>Explore by Experience</h2>
        </motion.div>

        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }} className="scrollbar-hide">
          {categories.map((cat, i) => (
            <motion.div key={cat.label} {...fadeUp(i)}>
              <Link to={`/destinations?category=${cat.label}`}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, minWidth: 130, padding: '22px 16px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.08)', background: '#242424', textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.background = '#2c2c2c'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = '#242424'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cat.color}18` }}>
                  <cat.icon size={22} style={{ color: cat.color }} />
                </div>
                <span style={{ fontSize: 12, color: '#9a9080', fontFamily: F, fontWeight: 500, whiteSpace: 'nowrap' }}>{cat.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WHY TRIPMATE ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 96px' }}>
        <motion.div {...fadeUp(0)} style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#7a8c5e', fontFamily: F }}>Why TripMate</span>
          <h2 className="font-serif" style={{ fontSize: 40, color: '#f0ebe0', marginTop: 8 }}>Everything you need to travel well</h2>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} {...fadeUp(i)}>
              <div style={{ borderRadius: 18, overflow: 'hidden', height: 220, marginBottom: 24, position: 'relative' }}>
                <img src={f.img} alt={f.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,26,0.3), transparent)' }} />
              </div>
              <h3 className="font-serif" style={{ fontSize: 22, color: '#f0ebe0', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#9a9080', lineHeight: 1.75, fontFamily: F }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 96px' }}>
        <motion.div {...fadeUp(0)} style={{ position: 'relative', borderRadius: 24, overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400"
            alt="CTA"
            style={{ width: '100%', height: 320, objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.72)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px' }}>
            <h2 className="font-serif" style={{ fontSize: 38, color: '#f0ebe0', marginBottom: 14 }}>Ready to plan your next adventure?</h2>
            <p style={{ fontSize: 15, color: '#9a9080', marginBottom: 32, maxWidth: 440, lineHeight: 1.7, fontFamily: F }}>
              Start building your perfect trip today — free, beautiful, and effortless.
            </p>
            <Link to="/create-trip"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', background: '#7a8c5e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: F, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'}
              onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}
            >
              Plan a Trip <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <style>{`
        @media (min-width: 768px) {
          .feat-grid {
            grid-template-columns: 2fr 1fr !important;
          }
          .feat-large {
            grid-column: 1 !important;
            grid-row: 1 / 3 !important;
            height: 500px !important;
          }
          .feat-small {
            height: 240px !important;
          }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MainLayout>
  );
}
