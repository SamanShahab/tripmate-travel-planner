import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Clock, FileText, ArrowLeft, Check, X, DollarSign, Cloud } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { itineraryAPI, tripsAPI } from '../services/api';
import toast from 'react-hot-toast';

const activityTypes = ['hotel', 'food', 'sightseeing', 'transport', 'activity', 'other'];
const typeColors = { hotel: '#5e8a8c', food: '#8c7a5e', sightseeing: '#7a8c5e', transport: '#8c5e5e', activity: '#7a5e8c', other: '#9a9080' };

const iStyle = {
  background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 10, padding: '10px 13px', fontSize: 13,
  color: '#f0ebe0', fontFamily: 'Manrope,sans-serif',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

function ActivityForm({ onSave, onCancel, initial = {} }) {
  const [form, setForm] = useState({ time: '', title: '', description: '', notes: '', type: 'activity', ...initial });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={{ padding: 16, borderRadius: 14, border: '1px solid rgba(122,140,94,0.25)', background: '#222', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <input type="time" value={form.time} onChange={e => upd('time', e.target.value)} style={{ ...iStyle, colorScheme: 'dark' }}
          onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
        <select value={form.type} onChange={e => upd('type', e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}
          onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}>
          {activityTypes.map(t => <option key={t} value={t} style={{ background: '#1e1e1e' }}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
      </div>
      <input type="text" placeholder="Activity title *" value={form.title} onChange={e => upd('title', e.target.value)} style={iStyle}
        onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
      <input type="text" placeholder="Description (optional)" value={form.description} onChange={e => upd('description', e.target.value)} style={iStyle}
        onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
      <textarea placeholder="Notes (optional)" value={form.notes} onChange={e => upd('notes', e.target.value)} rows={2}
        style={{ ...iStyle, resize: 'none' }}
        onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'} />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, fontSize: 12, color: '#9a9080', cursor: 'pointer', fontFamily: 'Manrope,sans-serif' }}>
          <X size={12} /> Cancel
        </button>
        <button onClick={() => form.title && onSave(form)} disabled={!form.title}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 16px', background: form.title ? '#7a8c5e' : 'rgba(122,140,94,0.3)', border: 'none', borderRadius: 8, fontSize: 12, color: '#fff', cursor: form.title ? 'pointer' : 'not-allowed', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>
          <Check size={12} /> Save
        </button>
      </div>
    </motion.div>
  );
}

export default function ItineraryPlanner() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingTo, setAddingTo] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);

  useEffect(() => {
    Promise.all([tripsAPI.getOne(tripId), itineraryAPI.get(tripId)])
      .then(([t, it]) => { setTrip(t.data); setDays(it.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [tripId]);

  const handleAdd = async (dayId, form) => {
    try { const { data } = await itineraryAPI.addActivity(dayId, form); setDays(p => p.map(d => d._id === dayId ? data : d)); setAddingTo(null); toast.success('Activity added'); }
    catch { toast.error('Failed to add'); }
  };
  const handleUpdate = async (dayId, actId, form) => {
    try { const { data } = await itineraryAPI.updateActivity(dayId, actId, form); setDays(p => p.map(d => d._id === dayId ? data : d)); setEditingActivity(null); toast.success('Updated'); }
    catch { toast.error('Failed to update'); }
  };
  const handleDelete = async (dayId, actId) => {
    try { const { data } = await itineraryAPI.deleteActivity(dayId, actId); setDays(p => p.map(d => d._id === dayId ? data : d)); toast.success('Removed'); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <MainLayout><div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #7a8c5e', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
    </div></MainLayout>
  );

  return (
    <MainLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '112px 24px 96px' }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link to="/trips" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9a9080', textDecoration: 'none', marginBottom: 24, transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'} onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
            <ArrowLeft size={14} /> My Trips
          </Link>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope,sans-serif', display: 'block' }}>Itinerary</span>
          <h1 className="font-serif" style={{ fontSize: 38, color: '#f0ebe0', marginTop: 6 }}>{trip?.tripName}</h1>
          {trip && (
            <p style={{ fontSize: 13, color: '#9a9080', marginTop: 6, fontFamily: 'Manrope,sans-serif' }}>
              {trip.destinationName} · {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {trip.travelers} traveler{trip.travelers !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Trip Nav */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
          {[{ label: 'Budget', to: `/trips/${tripId}/budget`, icon: DollarSign }, { label: 'Weather', to: `/trips/${tripId}/weather`, icon: Cloud }].map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', fontSize: 13, color: '#9a9080', textDecoration: 'none', fontFamily: 'Manrope,sans-serif', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(122,140,94,0.4)'; e.currentTarget.style.color = '#7a8c5e'; e.currentTarget.style.background = 'rgba(122,140,94,0.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9a9080'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={13} /> {label}
            </Link>
          ))}
        </div>

        {/* Days */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {days.map((day, di) => (
            <motion.div key={day._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: di * 0.05 }}>
              {/* Day Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(122,140,94,0.12)', border: '1px solid rgba(122,140,94,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#7a8c5e', fontFamily: 'Manrope,sans-serif' }}>{String(day.day).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, color: '#9a9080', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Manrope,sans-serif' }}>Day {day.day}</p>
                    <h3 className="font-serif" style={{ fontSize: 18, color: '#f0ebe0' }}>{day.title}</h3>
                  </div>
                </div>
                {day.date && <span style={{ fontSize: 12, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>}
              </div>

              {/* Activities Timeline */}
              <div style={{ marginLeft: 22, paddingLeft: 22, borderLeft: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {day.activities.sort((a, b) => (a.time || '').localeCompare(b.time || '')).map(act => (
                  <div key={act._id}>
                    {editingActivity?.actId === act._id ? (
                      <ActivityForm initial={act} onSave={f => handleUpdate(day._id, act._id, f)} onCancel={() => setEditingActivity(null)} />
                    ) : (
                      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 12, transition: 'background 0.15s', cursor: 'default' }}
                        className="activity-row"
                      >
                        <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: typeColors[act.type] || '#9a9080' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            {act.time && <span style={{ fontSize: 11, color: '#9a9080', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'Manrope,sans-serif' }}><Clock size={10} />{act.time}</span>}
                            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, fontFamily: 'Manrope,sans-serif', background: `${typeColors[act.type]}20`, color: typeColors[act.type] }}>{act.type}</span>
                          </div>
                          <p style={{ fontSize: 14, color: '#f0ebe0', fontWeight: 600, fontFamily: 'Manrope,sans-serif' }}>{act.title}</p>
                          {act.description && <p style={{ fontSize: 12, color: '#9a9080', marginTop: 2, fontFamily: 'Manrope,sans-serif' }}>{act.description}</p>}
                          {act.notes && <div style={{ display: 'flex', gap: 5, marginTop: 4, alignItems: 'flex-start' }}>
                            <FileText size={10} style={{ color: '#9a9080', marginTop: 2, flexShrink: 0 }} />
                            <p style={{ fontSize: 11, color: '#9a9080', fontStyle: 'italic', fontFamily: 'Manrope,sans-serif' }}>{act.notes}</p>
                          </div>}
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }} className="act-actions">
                          <button onClick={() => setEditingActivity({ actId: act._id, dayId: day._id })}
                            style={{ padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#9a9080', cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#f0ebe0'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9a9080'; }}>
                            <Edit3 size={12} />
                          </button>
                          <button onClick={() => handleDelete(day._id, act._id)}
                            style={{ padding: 6, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: 'none', color: '#9a9080', cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#9a9080'; }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}

                <AnimatePresence>
                  {addingTo === day._id ? (
                    <ActivityForm onSave={f => handleAdd(day._id, f)} onCancel={() => setAddingTo(null)} />
                  ) : (
                    <button onClick={() => setAddingTo(day._id)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 0', background: 'none', border: 'none', fontSize: 12, color: '#9a9080', cursor: 'pointer', fontFamily: 'Manrope,sans-serif', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#7a8c5e'} onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
                      <Plus size={14} /> Add activity
                    </button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`.activity-row:hover { background: rgba(255,255,255,0.03) !important; }`}</style>
    </MainLayout>
  );
}
