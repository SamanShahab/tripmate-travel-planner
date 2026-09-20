import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, DollarSign, Heart, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { tripsAPI, destinationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const steps = [
  { num: '01', label: 'Destination', icon: MapPin },
  { num: '02', label: 'Dates', icon: Calendar },
  { num: '03', label: 'Travelers', icon: Users },
  { num: '04', label: 'Budget', icon: DollarSign },
  { num: '05', label: 'Preferences', icon: Heart },
  { num: '06', label: 'Review', icon: CheckCircle },
];

const preferenceOptions = ['Adventure', 'Culture', 'Food', 'Nature', 'Photography', 'Relaxation', 'Shopping', 'Nightlife'];

const inputStyle = {
  width: '100%', background: '#2a2a2a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12, padding: '13px 16px',
  fontSize: 14, color: '#f0ebe0',
  fontFamily: 'Manrope, sans-serif',
  outline: 'none', transition: 'border-color 0.2s',
  boxSizing: 'border-box', display: 'block',
};

const labelStyle = {
  display: 'block', fontSize: 11,
  textTransform: 'uppercase', letterSpacing: '0.1em',
  color: '#9a9080', marginBottom: 8,
  fontFamily: 'Manrope, sans-serif',
};

export default function CreateTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tripName: '', destination: searchParams.get('destination') || '',
    destinationName: '', startDate: '', endDate: '',
    travelers: 1, budget: '', preferences: [],
  });

  useEffect(() => {
    if (!user) navigate('/login');
    destinationsAPI.getAll().then(({ data }) => {
      setDestinations(data);
      if (searchParams.get('destination')) {
        const d = data.find(d => d._id === searchParams.get('destination'));
        if (d) setForm(f => ({ ...f, destinationName: d.name }));
      }
    }).catch(() => {});
  }, []);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const togglePref = (pref) => setForm(f => ({
    ...f,
    preferences: f.preferences.includes(pref)
      ? f.preferences.filter(p => p !== pref)
      : [...f.preferences, pref],
  }));

  const canNext = () => {
    if (currentStep === 0) return form.destination && form.tripName;
    if (currentStep === 1) return form.startDate && form.endDate && form.endDate >= form.startDate;
    if (currentStep === 2) return form.travelers >= 1;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await tripsAPI.create(form);
      toast.success('Trip created!');
      navigate(`/trips/${data._id}/itinerary`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally { setLoading(false); }
  };

  const getDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    return Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <MainLayout>
      <div style={{ minHeight: '100vh', paddingTop: 112, paddingBottom: 96, maxWidth: 800, margin: '0 auto', padding: '112px 24px 96px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope, sans-serif' }}>New Journey</span>
          <h1 className="font-serif" style={{ fontSize: 40, color: '#f0ebe0', marginTop: 8 }}>Plan Your Trip</h1>
        </motion.div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48, overflowX: 'auto', paddingBottom: 8 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 10, border: 'none',
                  fontSize: 12, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
                  cursor: i < currentStep ? 'pointer' : i === currentStep ? 'default' : 'default',
                  background: i === currentStep ? '#7a8c5e' : i < currentStep ? 'rgba(122,140,94,0.15)' : 'rgba(255,255,255,0.04)',
                  color: i === currentStep ? '#fff' : i < currentStep ? '#7a8c5e' : '#6b6560',
                  transition: 'all 0.2s',
                }}
              >
                <span>{step.num}</span>
                <span style={{ display: 'none' }} className="step-label">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ width: 24, height: 1, background: i < currentStep ? '#7a8c5e' : 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            style={{ minHeight: 320 }}
          >
            {/* Step 0 */}
            {currentStep === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>Where are you going?</h2>
                <div>
                  <label style={labelStyle}>Trip Name</label>
                  <input type="text" placeholder="e.g. Summer in Hunza"
                    value={form.tripName} onChange={e => update('tripName', e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Destination</label>
                  <select value={form.destination}
                    onChange={e => {
                      const d = destinations.find(d => d._id === e.target.value);
                      update('destination', e.target.value);
                      update('destinationName', d?.name || '');
                    }}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  >
                    <option value="" style={{ background: '#2a2a2a' }}>Select a destination</option>
                    {destinations.map(d => (
                      <option key={d._id} value={d._id} style={{ background: '#2a2a2a' }}>{d.name}, {d.country}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 1 */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>When are you traveling?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Start Date', key: 'startDate', min: new Date().toISOString().split('T')[0] },
                    { label: 'End Date', key: 'endDate', min: form.startDate || new Date().toISOString().split('T')[0] },
                  ].map(({ label, key, min }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input type="date" value={form[key]} min={min}
                        onChange={e => update(key, e.target.value)}
                        style={{ ...inputStyle, colorScheme: 'dark' }}
                        onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      />
                    </div>
                  ))}
                </div>
                {getDays() > 0 && (
                  <p style={{ fontSize: 14, color: '#7a8c5e', fontFamily: 'Manrope, sans-serif' }}>
                    {getDays()} day{getDays() !== 1 ? 's' : ''} trip
                  </p>
                )}
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>How many travelers?</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  {['-', '+'].map((sym, idx) => (
                    <button key={sym} onClick={() => update('travelers', idx === 0 ? Math.max(1, form.travelers - 1) : form.travelers + 1)}
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.12)',
                        background: 'transparent', color: '#f0ebe0',
                        fontSize: 20, cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
                    >{sym}</button>
                  ))}
                  <span className="font-serif" style={{ fontSize: 52, color: '#f0ebe0', minWidth: 60, textAlign: 'center' }}>{form.travelers}</span>
                </div>
                <p style={{ fontSize: 14, color: '#9a9080', fontFamily: 'Manrope, sans-serif' }}>
                  {form.travelers} traveler{form.travelers !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>What's your budget?</h2>
                <div>
                  <label style={labelStyle}>Total Budget (USD)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9a9080', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>$</span>
                    <input type="number" placeholder="0" value={form.budget}
                      onChange={e => update('budget', e.target.value)}
                      style={{ ...inputStyle, paddingLeft: 28 }}
                      onFocus={e => e.target.style.borderColor = '#7a8c5e'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
                {form.budget && form.travelers && (
                  <p style={{ fontSize: 14, color: '#9a9080', fontFamily: 'Manrope, sans-serif' }}>
                    ~${Math.round(form.budget / form.travelers)} per person
                    {getDays() > 0 && ` · ~$${Math.round(form.budget / getDays())} per day`}
                  </p>
                )}
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>What are your interests?</h2>
                <p style={{ fontSize: 14, color: '#9a9080', fontFamily: 'Manrope, sans-serif' }}>Select all that apply</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {preferenceOptions.map(pref => (
                    <button key={pref} onClick={() => togglePref(pref)}
                      style={{
                        padding: '9px 18px', borderRadius: 10, border: 'none',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        fontFamily: 'Manrope, sans-serif', transition: 'all 0.2s',
                        background: form.preferences.includes(pref) ? '#7a8c5e' : 'rgba(255,255,255,0.05)',
                        color: form.preferences.includes(pref) ? '#fff' : '#9a9080',
                        outline: form.preferences.includes(pref) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >{pref}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <h2 className="font-serif" style={{ fontSize: 26, color: '#f0ebe0' }}>Review your trip</h2>
                <div style={{ padding: 24, borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', background: '#242424', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    ['Trip Name', form.tripName],
                    ['Destination', form.destinationName],
                    ['Dates', form.startDate && form.endDate ? `${form.startDate} → ${form.endDate} (${getDays()} days)` : '—'],
                    ['Travelers', form.travelers],
                    ['Budget', form.budget ? `$${form.budget}` : 'Not set'],
                    ['Preferences', form.preferences.join(', ') || 'None selected'],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9a9080', fontFamily: 'Manrope, sans-serif', flexShrink: 0 }}>{label}</span>
                      <span style={{ fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope, sans-serif', textAlign: 'right' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              color: '#9a9080', fontSize: 14, fontFamily: 'Manrope, sans-serif',
              opacity: currentStep === 0 ? 0.3 : 1, transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (currentStep > 0) e.currentTarget.style.color = '#f0ebe0'; }}
            onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}
          >
            <ArrowLeft size={16} /> Back
          </button>

          {currentStep < steps.length - 1 ? (
            <button onClick={() => setCurrentStep(s => s + 1)} disabled={!canNext()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12, border: 'none',
                background: canNext() ? '#7a8c5e' : 'rgba(122,140,94,0.3)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: canNext() ? 'pointer' : 'not-allowed',
                fontFamily: 'Manrope, sans-serif', transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (canNext()) e.currentTarget.style.background = '#8a9c6e'; }}
              onMouseLeave={e => { if (canNext()) e.currentTarget.style.background = '#7a8c5e'; }}
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', borderRadius: 12, border: 'none',
                background: loading ? 'rgba(122,140,94,0.4)' : '#7a8c5e',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Manrope, sans-serif', transition: 'background 0.2s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#8a9c6e'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#7a8c5e'; }}
            >
              {loading ? 'Creating...' : 'Create Trip'} <ArrowRight size={16} />
            </button>
          )}
        </div>

        <style>{`
          @media (min-width: 640px) {
            .step-label { display: inline !important; }
          }
        `}</style>
      </div>
    </MainLayout>
  );
}
