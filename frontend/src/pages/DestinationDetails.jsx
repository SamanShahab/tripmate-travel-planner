import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Calendar, DollarSign, Heart, ArrowRight, Lightbulb, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { destinationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const btn = (active) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  width: '100%', padding: '13px 20px', borderRadius: 12, fontSize: 14,
  fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope,sans-serif',
  transition: 'all 0.2s', border: 'none',
  background: active ? 'rgba(122,140,94,0.12)' : '#7a8c5e',
  color: active ? '#7a8c5e' : '#fff',
  outline: active ? '1px solid #7a8c5e' : 'none',
});

export default function DestinationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dest, setDest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    destinationsAPI.getOne(id)
      .then(({ data }) => { setDest(data); if (user?.savedDestinations?.includes(id)) setSaved(true); })
      .catch(() => navigate('/destinations'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try { await destinationsAPI.save(id); setSaved(!saved); toast.success(saved ? 'Removed from saved' : 'Destination saved!'); }
    catch { toast.error('Something went wrong'); }
  };

  if (loading) return (
    <MainLayout><div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #7a8c5e', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
    </div></MainLayout>
  );
  if (!dest) return null;

  return (
    <MainLayout>
      {/* Hero */}
      <div style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
        <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1a1a1a 0%, rgba(26,26,26,0.3) 50%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(26,26,26,0.4), transparent)' }} />

        <Link to="/destinations" style={{
          position: 'absolute', top: 96, left: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
          background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)',
          padding: '7px 14px', borderRadius: 10, transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
        >
          <ArrowLeft size={14} /> Back
        </Link>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 1280, margin: '0 auto', padding: '0 24px 48px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <MapPin size={13} style={{ color: '#7a8c5e' }} />
              <span style={{ fontSize: 12, color: '#9a9080', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Manrope,sans-serif' }}>{dest.country}</span>
              {dest.category && <><span style={{ color: '#9a9080' }}>·</span><span style={{ fontSize: 12, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{dest.category}</span></>}
            </div>
            <h1 className="font-serif" style={{ fontSize: 56, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>{dest.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star size={14} style={{ color: '#c9a84c', fill: '#c9a84c' }} />
                <span style={{ fontSize: 14, color: '#c9a84c', fontFamily: 'Manrope,sans-serif' }}>{dest.rating}</span>
              </div>
              {dest.estimatedDailyBudget > 0 && <span style={{ fontSize: 14, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>~${dest.estimatedDailyBudget}/day</span>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48 }} className="dest-grid">
          {/* Main */}
          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ fontSize: 17, color: '#d4c5a9', lineHeight: 1.8, marginBottom: 48, fontFamily: 'Manrope,sans-serif' }}>
              {dest.description}
            </motion.p>

            {dest.places?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 48 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0', marginBottom: 20 }}>Places to Visit</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dest.places.map((place, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      style={{ display: 'flex', gap: 16, padding: '16px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#242424', transition: 'border-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(122,140,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={16} style={{ color: '#7a8c5e' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 14, fontWeight: 600, color: '#f0ebe0', marginBottom: 4, fontFamily: 'Manrope,sans-serif' }}>{place.name}</h4>
                        <p style={{ fontSize: 13, color: '#9a9080', lineHeight: 1.6, fontFamily: 'Manrope,sans-serif' }}>{place.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {dest.travelTips?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0', marginBottom: 20 }}>Travel Tips</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dest.travelTips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <Lightbulb size={14} style={{ color: '#c9a84c', marginTop: 2, flexShrink: 0 }} />
                      <p style={{ fontSize: 14, color: '#9a9080', lineHeight: 1.7, fontFamily: 'Manrope,sans-serif' }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Quick Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#242424' }}>
              <h3 style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>Quick Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {dest.bestTimeToVisit && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <Calendar size={15} style={{ color: '#7a8c5e', marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>Best time to visit</p>
                      <p style={{ fontSize: 14, color: '#f0ebe0', marginTop: 3, fontFamily: 'Manrope,sans-serif' }}>{dest.bestTimeToVisit}</p>
                    </div>
                  </div>
                )}
                {dest.estimatedDailyBudget > 0 && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <DollarSign size={15} style={{ color: '#7a8c5e', marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>Estimated daily budget</p>
                      <p style={{ fontSize: 14, color: '#f0ebe0', marginTop: 3, fontFamily: 'Manrope,sans-serif' }}>${dest.estimatedDailyBudget} {dest.currency}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to={`/create-trip?destination=${dest._id}`} style={btn(false)}
                onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'}
                onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}
              >
                Plan a Trip Here <ArrowRight size={15} />
              </Link>
              <button onClick={handleSave} style={btn(saved)}
                onMouseEnter={e => { if (!saved) { e.currentTarget.style.background = '#8a9c6e'; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (!saved) { e.currentTarget.style.background = '#7a8c5e'; e.currentTarget.style.color = '#fff'; } }}
              >
                <Heart size={15} style={{ fill: saved ? '#7a8c5e' : 'none' }} />
                {saved ? 'Saved' : 'Save Destination'}
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .dest-grid { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </MainLayout>
  );
}
