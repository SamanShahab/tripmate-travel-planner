import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Car, UtensilsCrossed, Zap, ShoppingBag, MoreHorizontal } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { budgetAPI, tripsAPI } from '../services/api';
import toast from 'react-hot-toast';

const cats = [
  { key: 'accommodation', label: 'Accommodation', icon: Home, color: '#5e8a8c' },
  { key: 'transportation', label: 'Transportation', icon: Car, color: '#8c5e5e' },
  { key: 'food', label: 'Food & Dining', icon: UtensilsCrossed, color: '#8c7a5e' },
  { key: 'activities', label: 'Activities', icon: Zap, color: '#7a5e8c' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#5e7a8c' },
  { key: 'other', label: 'Other', icon: MoreHorizontal, color: '#9a9080' },
];

export default function BudgetCalculator() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState({ accommodation: 0, transportation: 0, food: 0, activities: 0, shopping: 0, other: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([tripsAPI.getOne(tripId), budgetAPI.get(tripId)])
      .then(([t, b]) => { setTrip(t.data); setBudget(b.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [tripId]);

  const total = cats.reduce((s, c) => s + (Number(budget[c.key]) || 0), 0);
  const days = trip ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1 : 1;
  const perPerson = trip?.travelers ? total / trip.travelers : total;
  const perDay = days ? total / days : total;

  const handleSave = async () => {
    setSaving(true);
    try { await budgetAPI.update(tripId, budget); toast.success('Budget saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <MainLayout><div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #7a8c5e', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
    </div></MainLayout>
  );

  return (
    <MainLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '112px 24px 96px' }}>
        <div style={{ marginBottom: 40 }}>
          <Link to={`/trips/${tripId}/itinerary`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9a9080', textDecoration: 'none', marginBottom: 24 }}
            onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'} onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
            <ArrowLeft size={14} /> Itinerary
          </Link>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope,sans-serif', display: 'block' }}>Budget</span>
          <h1 className="font-serif" style={{ fontSize: 38, color: '#f0ebe0', marginTop: 6 }}>{trip?.tripName}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }} className="budget-grid">
          {/* Categories */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cats.map((cat, i) => (
              <motion.div key={cat.key} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#242424' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${cat.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <cat.icon size={18} style={{ color: cat.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9a9080', fontFamily: 'Manrope,sans-serif', display: 'block', marginBottom: 6 }}>{cat.label}</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9a9080', fontSize: 14, fontFamily: 'Manrope,sans-serif' }}>$</span>
                    <input type="number" min="0" placeholder="0"
                      value={budget[cat.key] || ''}
                      onChange={e => setBudget(b => ({ ...b, [cat.key]: Number(e.target.value) || 0 }))}
                      style={{ width: '100%', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 12px 9px 26px', fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#7a8c5e'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                    />
                  </div>
                </div>
                {total > 0 && budget[cat.key] > 0 && (
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginBottom: 4 }}>{Math.round((budget[cat.key] / total) * 100)}%</p>
                    <div style={{ width: 64, height: 4, background: '#2e2e2e', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 4, background: cat.color, width: `${(budget[cat.key] / total) * 100}%`, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            <button onClick={handleSave} disabled={saving}
              style={{ width: '100%', padding: '14px', marginTop: 4, background: saving ? 'rgba(122,140,94,0.4)' : '#7a8c5e', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Manrope,sans-serif', transition: 'background 0.2s' }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#8a9c6e'; }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#7a8c5e'; }}>
              {saving ? 'Saving...' : 'Save Budget'}
            </button>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#242424' }}>
              <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', marginBottom: 20, fontFamily: 'Manrope,sans-serif' }}>Summary</h3>
              <div>
                <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>Total Estimated</p>
                <p className="font-serif" style={{ fontSize: 36, color: '#f0ebe0', marginTop: 4 }}>${total.toLocaleString()}</p>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Per Person', `$${Math.round(perPerson).toLocaleString()}`], ['Per Day', `$${Math.round(perDay).toLocaleString()}`],
                  ...(trip?.budget > 0 ? [['Trip Budget', `$${trip.budget.toLocaleString()}`, total > trip.budget ? '#f87171' : '#7a8c5e']] : [])
                ].map(([label, value, color]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{label}</span>
                    <span style={{ fontSize: 14, color: color || '#f0ebe0', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              {trip?.budget > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>Budget used</span>
                    <span style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{Math.min(100, Math.round((total / trip.budget) * 100))}%</span>
                  </div>
                  <div style={{ height: 6, background: '#2e2e2e', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: total > trip.budget ? '#ef4444' : '#7a8c5e', width: `${Math.min(100, (total / trip.budget) * 100)}%`, transition: 'width 0.4s' }} />
                  </div>
                </div>
              )}
            </motion.div>

            {total > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#242424' }}>
                <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', marginBottom: 16, fontFamily: 'Manrope,sans-serif' }}>Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cats.filter(c => budget[c.key] > 0).map(cat => (
                    <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#9a9080', flex: 1, fontFamily: 'Manrope,sans-serif' }}>{cat.label}</span>
                      <span style={{ fontSize: 13, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>${budget[cat.key].toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(min-width:900px){.budget-grid{grid-template-columns:2fr 1fr !important;}}`}</style>
    </MainLayout>
  );
}
