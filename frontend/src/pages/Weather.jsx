import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wind, Droplets, Thermometer, Eye, Search } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { weatherAPI, tripsAPI } from '../services/api';

const weatherIcons = { Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️', Fog: '🌫️' };

export default function Weather() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tripId) {
      tripsAPI.getOne(tripId).then(({ data }) => {
        setTrip(data); setCity(data.destinationName || '');
        fetchWeather(data.destinationName);
      }).catch(() => {});
    }
  }, [tripId]);

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    setLoading(true); setError('');
    try {
      const base = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${base}/weather/${encodeURIComponent(cityName)}`);
      const data = await res.json();
      if (data.cod === '200' || data.cod === 200) {
        setWeather(data);
      } else {
        setError('City not found. Try: Lahore, Karachi, Islamabad, Dubai, Istanbul');
      }
    } catch (err) {
      setError('Weather unavailable. Try again.');
    } finally { setLoading(false); }
  };

  const current = weather?.list?.[0];

  return (
    <MainLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '112px 24px 96px' }}>
        <div style={{ marginBottom: 40 }}>
          {tripId && (
            <Link to={`/trips/${tripId}/itinerary`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9a9080', textDecoration: 'none', marginBottom: 24 }}
              onMouseEnter={e => e.currentTarget.style.color = '#f0ebe0'} onMouseLeave={e => e.currentTarget.style.color = '#9a9080'}>
              <ArrowLeft size={14} /> Itinerary
            </Link>
          )}
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope,sans-serif', display: 'block' }}>Weather</span>
          <h1 className="font-serif" style={{ fontSize: 38, color: '#f0ebe0', marginTop: 6 }}>{trip?.destinationName || 'Weather'}</h1>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: '#242424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px' }}>
            <Search size={15} style={{ color: '#9a9080', flexShrink: 0 }} />
            <input type="text" placeholder="Search city..."
              value={city} onChange={e => setCity(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchWeather(city)}
              style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', flex: 1, padding: 0 }}
            />
          </div>
          <button onClick={() => fetchWeather(city)}
            style={{ padding: '12px 22px', background: '#7a8c5e', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', transition: 'background 0.2s', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = '#8a9c6e'} onMouseLeave={e => e.currentTarget.style.background = '#7a8c5e'}>
            Search
          </button>
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div style={{ width: 32, height: 32, border: '2px solid #7a8c5e', borderTopColor: 'transparent', borderRadius: '50%' }} className="animate-spin" />
          </div>
        )}

        {error && (
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 14, color: '#f87171', fontFamily: 'Manrope,sans-serif' }}>
            {error}
          </div>
        )}

        {weather && current && !loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Current */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              style={{ padding: 32, borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', background: '#242424', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -10, right: 10, fontSize: 120, opacity: 0.08, lineHeight: 1, userSelect: 'none' }}>
                {weatherIcons[current.weather[0].main] || '🌍'}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9a9080', marginBottom: 12, fontFamily: 'Manrope,sans-serif' }}>
                  {weather.city?.name}, {weather.city?.country}
                </p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 16 }}>
                  <span className="font-serif" style={{ fontSize: 80, color: '#f0ebe0', lineHeight: 1 }}>{Math.round(current.main.temp)}°</span>
                  <div style={{ paddingBottom: 8 }}>
                    <p style={{ fontSize: 18, color: '#d4c5a9', fontFamily: 'Manrope,sans-serif', textTransform: 'capitalize' }}>{current.weather[0].description}</p>
                    <p style={{ fontSize: 13, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginTop: 3 }}>Feels like {Math.round(current.main.feels_like)}°C</p>
                  </div>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '20px 0' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }} className="weather-stats">
                  {[
                    { icon: Droplets, label: 'Humidity', value: `${current.main.humidity}%` },
                    { icon: Wind, label: 'Wind', value: `${Math.round(current.wind.speed)} m/s` },
                    { icon: Thermometer, label: 'Min / Max', value: `${Math.round(current.main.temp_min)}° / ${Math.round(current.main.temp_max)}°` },
                    { icon: Eye, label: 'Visibility', value: current.visibility ? `${(current.visibility / 1000).toFixed(1)} km` : 'N/A' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(122,140,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} style={{ color: '#7a8c5e' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif' }}>{label}</p>
                        <p style={{ fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Forecast */}
            <div>
              <h3 style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9a9080', marginBottom: 14, fontFamily: 'Manrope,sans-serif' }}>5-Day Forecast</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }} className="forecast-grid">
                {weather.list?.filter((_, i) => i % 8 === 0).slice(0, 5).map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ padding: '16px 12px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)', background: '#242424', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginBottom: 8 }}>
                      {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p style={{ fontSize: 28, marginBottom: 8 }}>{weatherIcons[item.weather[0].main] || '🌍'}</p>
                    <p style={{ fontSize: 15, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', fontWeight: 700 }}>{Math.round(item.main.temp)}°</p>
                    <p style={{ fontSize: 10, color: '#9a9080', fontFamily: 'Manrope,sans-serif', marginTop: 4, textTransform: 'capitalize' }}>{item.weather[0].description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 64, marginBottom: 16 }}>🌍</p>
            <p style={{ color: '#9a9080', fontSize: 15, fontFamily: 'Manrope,sans-serif' }}>Search for a city to see weather information</p>
          </div>
        )}
      </div>
      <style>{`
        @media(min-width:640px){.weather-stats{grid-template-columns:repeat(4,1fr)!important;}}
        @media(max-width:480px){.forecast-grid{grid-template-columns:repeat(2,1fr)!important;}}
      `}</style>
    </MainLayout>
  );
}
