import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Plus, Compass } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    tripsAPI.getAll().then(({ data }) => setTrips(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const upcoming = trips.filter(t => t.status === 'upcoming').sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const nextTrip = upcoming[0];
  const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
  const getDaysUntil = d => Math.ceil((new Date(d) - new Date()) / 86400000);

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Compass },
    { label: 'Upcoming', value: upcoming.length, icon: Calendar },
    { label: 'Travelers', value: trips.reduce((s, t) => s + t.travelers, 0), icon: Users },
    { label: 'Est. Spending', value: `$${totalBudget.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <MainLayout>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px 96px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 14, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginBottom: 4 }}>{getGreeting()},</p>
          <h1 className="font-serif" style={{ fontSize: 52, color: '#f0ebe0' }}>{user?.name?.split(' ')[0]}.</h1>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 48 }} className="stats-grid">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              style={{ padding: '20px 22px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', background: '#242424' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{stat.label}</p>
                <stat.icon size={14} style={{ color: '#7a8c5e' }} />
              </div>
              <p className="font-serif" style={{ fontSize: 34, color: '#f0ebe0' }}>{loading ? '—' : stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }} className="dash-grid">
          {/* Next Adventure */}
          <div>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="font-serif" style={{ fontSize: 26, color: '#f0ebe0', marginBottom: 20 }}>
              Next Adventure
            </motion.h2>

            {nextTrip ? (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', height: 300 }}>
                <img src={nextTrip.destination?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'}
                  alt={nextTrip.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MapPin size={12} style={{ color: '#7a8c5e' }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope,sans-serif' }}>{nextTrip.destination?.country || nextTrip.destinationName}</span>
                    {getDaysUntil(nextTrip.startDate) > 0 && (
                      <span style={{ marginLeft: 'auto', fontSize: 11, padding: '4px 10px', background: 'rgba(122,140,94,0.25)', color: '#7a8c5e', borderRadius: 8, fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>
                        {getDaysUntil(nextTrip.startDate)} days away
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif" style={{ fontSize: 26, color: '#fff', marginBottom: 6 }}>{nextTrip.tripName}</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 16, fontFamily: 'Manrope,sans-serif' }}>
                    {new Date(nextTrip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Link to={`/trips/${nextTrip._id}/itinerary`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: 13, fontFamily: 'Manrope,sans-serif', fontWeight: 500, transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}>
                    View Itinerary <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                style={{ height: 300, borderRadius: 20, border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <Compass size={36} style={{ color: '#9a9080', opacity: 0.3 }} />
                <p style={{ color: '#9a9080', fontSize: 15, fontFamily: 'Manrope,sans-serif' }}>No upcoming trips</p>
                <Link to="/create-trip" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 22px', background: '#7a8c5e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>
                  <Plus size={14} /> Plan a Trip
                </Link>
              </motion.div>
            )}
          </div>

          {/* Recent Trips */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>Recent Trips</h2>
              <Link to="/trips" style={{ fontSize: 12, color: '#9a9080', textDecoration: 'none', fontFamily: 'Manrope,sans-serif', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'} onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
                View all
              </Link>
            </motion.div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loading ? [...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 64, borderRadius: 12, background: '#242424' }} className="animate-pulse" />
              )) : trips.slice(0, 5).map((trip, i) => (
                <motion.div key={trip._id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 + 0.3 }}>
                  <Link to={`/trips/${trip._id}/itinerary`}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#242424', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.background = '#2a2a2a'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#242424'; }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={trip.destination?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100'}
                        alt={trip.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.tripName}</p>
                      <p style={{ fontSize: 12, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginTop: 2 }}>{trip.destination?.name || trip.destinationName}</p>
                    </div>
                    <ArrowRight size={13} style={{ color: '#9a9080', flexShrink: 0 }} />
                  </Link>
                </motion.div>
              ))}
              {!loading && trips.length === 0 && (
                <p style={{ fontSize: 14, color: '#9a9080', textAlign: 'center', padding: '32px 0', fontFamily: 'Manrope,sans-serif' }}>No trips yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(min-width:768px){.stats-grid{grid-template-columns:repeat(4,1fr)!important;}}
        @media(min-width:1024px){.dash-grid{grid-template-columns:2fr 1fr!important;}}
      `}</style>
    </MainLayout>
  );
}
