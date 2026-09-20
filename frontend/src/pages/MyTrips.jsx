import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Calendar, Users, DollarSign, Trash2, ArrowRight, Map } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { tripsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const statusColor = { upcoming: '#7a8c5e', ongoing: '#c9a84c', completed: '#9a9080' };

export default function MyTrips() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    tripsAPI.getAll().then(({ data }) => setTrips(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return;
    setDeleting(id);
    try { await tripsAPI.delete(id); setTrips(p => p.filter(t => t._id !== id)); toast.success('Trip deleted'); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const getDays = t => Math.ceil((new Date(t.endDate) - new Date(t.startDate)) / 86400000) + 1;

  return (
    <MainLayout>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '112px 24px 96px' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope,sans-serif' }}>Your journeys</span>
            <h1 className="font-serif" style={{ fontSize: 48, color: '#f0ebe0', marginTop: 8 }}>My Trips</h1>
          </div>
          <Link to="/create-trip" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 22px', background: '#7a8c5e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Manrope,sans-serif', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'} onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}>
            <Plus size={15} /> New Trip
          </Link>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ height: 320, borderRadius: 16, background: '#242424' }} className="animate-pulse" />)}
          </div>
        ) : trips.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '100px 0' }}>
            <Map size={48} style={{ color: '#9a9080', opacity: 0.3, margin: '0 auto 16px' }} />
            <h3 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0', marginBottom: 10 }}>No trips yet</h3>
            <p style={{ color: '#9a9080', fontSize: 15, fontFamily: 'Manrope,sans-serif', marginBottom: 28 }}>Start planning your first adventure</p>
            <Link to="/create-trip" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '12px 24px', background: '#7a8c5e', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: 14, fontWeight: 600, fontFamily: 'Manrope,sans-serif' }}>
              <Plus size={15} /> Plan a Trip
            </Link>
          </motion.div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            <AnimatePresence>
              {trips.map((trip, i) => (
                <motion.div key={trip._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.06 }}
                  style={{ borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', background: '#242424', overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Image */}
                  <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                    <img src={trip.destination?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'}
                      alt={trip.tripName} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'} onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: 'Manrope,sans-serif', background: `${statusColor[trip.status]}20`, color: statusColor[trip.status] }}>
                        {trip.status}
                      </span>
                    </div>
                    <button onClick={() => handleDelete(trip._id)} disabled={deleting === trip._id}
                      style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.4)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}>
                      <Trash2 size={13} style={{ color: '#fff' }} />
                    </button>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '18px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <MapPin size={11} style={{ color: '#7a8c5e' }} />
                      <span style={{ fontSize: 11, color: '#9a9080', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Manrope,sans-serif' }}>{trip.destination?.country || trip.destinationName}</span>
                    </div>
                    <h3 className="font-serif" style={{ fontSize: 20, color: '#f0ebe0', marginBottom: 12 }}>{trip.tripName}</h3>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                      {[
                        [Calendar, `${getDays(trip)} days`],
                        [Users, `${trip.travelers} travelers`],
                        ...(trip.budget > 0 ? [[DollarSign, `$${trip.budget}`]] : []),
                      ].map(([Icon, text], idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Icon size={11} style={{ color: '#9a9080' }} />
                          <span style={{ fontSize: 12, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{text}</span>
                        </div>
                      ))}
                    </div>

                    <p style={{ fontSize: 12, color: '#6b6560', marginBottom: 16, fontFamily: 'Manrope,sans-serif' }}>
                      {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>

                    <Link to={`/trips/${trip._id}/itinerary`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '10px 0', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, fontSize: 13, color: '#9a9080', textDecoration: 'none', fontFamily: 'Manrope,sans-serif', fontWeight: 500, transition: 'all 0.2s', boxSizing: 'border-box' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(122,140,94,0.4)'; e.currentTarget.style.color = '#7a8c5e'; e.currentTarget.style.background = 'rgba(122,140,94,0.07)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = '#9a9080'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      View Itinerary <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
