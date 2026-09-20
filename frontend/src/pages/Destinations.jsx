import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { destinationsAPI } from '../services/api';

const categories = ['All', 'Mountains', 'Beaches', 'Culture', 'Adventure', 'Food', 'Weekend'];

const S = {
  page: { paddingTop: 112, paddingBottom: 96, maxWidth: 1280, margin: '0 auto', padding: '112px 24px 96px' },
  label: { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7a8c5e', fontFamily: 'Manrope,sans-serif' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, background: '#242424', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 16px' },
  searchInput: { background: 'transparent', border: 'none', outline: 'none', fontSize: 14, color: '#f0ebe0', fontFamily: 'Manrope,sans-serif', flex: 1, padding: 0, width: '100%' },
};

export default function Destinations() {
  const [searchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (activeCategory !== 'All') params.category = activeCategory;
    destinationsAPI.getAll(params).then(({ data }) => setDestinations(data)).catch(() => {}).finally(() => setLoading(false));
  }, [search, activeCategory]);

  return (
    <MainLayout>
      <div style={S.page}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
          <span style={S.label}>Discover</span>
          <h1 className="font-serif" style={{ fontSize: 48, color: '#f0ebe0', marginTop: 8, marginBottom: 12 }}>Destinations</h1>
          <p style={{ fontSize: 15, color: '#9a9080', maxWidth: 480, lineHeight: 1.7, fontFamily: 'Manrope,sans-serif' }}>
            From the peaks of Karakoram to the beaches of Bali — find your next remarkable place.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
          <div style={S.searchWrap}>
            <Search size={16} style={{ color: '#9a9080', flexShrink: 0 }} />
            <input
              type="text" placeholder="Search destinations, countries..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={S.searchInput}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#9a9080', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  flexShrink: 0, padding: '8px 18px', borderRadius: 10, border: 'none',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Manrope,sans-serif',
                  transition: 'all 0.2s',
                  background: activeCategory === cat ? '#7a8c5e' : 'rgba(255,255,255,0.05)',
                  color: activeCategory === cat ? '#fff' : '#9a9080',
                  outline: activeCategory === cat ? 'none' : '1px solid rgba(255,255,255,0.09)',
                }}
                onMouseEnter={e => { if (activeCategory !== cat) { e.currentTarget.style.color = '#f0ebe0'; e.currentTarget.style.outline = '1px solid rgba(255,255,255,0.18)'; } }}
                onMouseLeave={e => { if (activeCategory !== cat) { e.currentTarget.style.color = '#9a9080'; e.currentTarget.style.outline = '1px solid rgba(255,255,255,0.09)'; } }}
              >{cat}</button>
            ))}
          </div>
        </motion.div>

        <p style={{ fontSize: 12, color: '#6b6560', marginBottom: 28, fontFamily: 'Manrope,sans-serif' }}>
          {loading ? 'Loading...' : `${destinations.length} destination${destinations.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 280, borderRadius: 16, background: '#242424' }} className="animate-pulse" />)}
          </div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#9a9080', fontSize: 16, fontFamily: 'Manrope,sans-serif' }}>No destinations found.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }}
              style={{ marginTop: 16, background: 'none', border: 'none', color: '#7a8c5e', fontSize: 14, cursor: 'pointer', fontFamily: 'Manrope,sans-serif', textDecoration: 'underline' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {destinations.map((dest, i) => (
              <motion.div key={dest._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 6) * 0.06 }}>
                <Link to={`/destinations/${dest._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', background: '#242424', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s, transform 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                      <img src={dest.image} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                      {dest.category && (
                        <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 10px', background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', borderRadius: 8 }}>
                          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: 'Manrope,sans-serif' }}>{dest.category}</span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={11} style={{ color: '#c9a84c', fill: '#c9a84c' }} />
                        <span style={{ fontSize: 12, color: '#c9a84c', fontFamily: 'Manrope,sans-serif' }}>{dest.rating}</span>
                      </div>
                      <div style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowRight size={13} style={{ color: '#fff' }} />
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '16px 18px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                        <MapPin size={11} style={{ color: '#7a8c5e' }} />
                        <span style={{ fontSize: 11, color: '#9a9080', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Manrope,sans-serif' }}>{dest.country}</span>
                      </div>
                      <h3 className="font-serif" style={{ fontSize: 20, color: '#f0ebe0', marginBottom: 6 }}>{dest.name}</h3>
                      <p style={{ fontSize: 12, color: '#9a9080', lineHeight: 1.6, fontFamily: 'Manrope,sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.description}
                      </p>
                      {dest.estimatedDailyBudget > 0 && (
                        <p style={{ fontSize: 12, color: '#7a8c5e', marginTop: 10, fontFamily: 'Manrope,sans-serif', fontWeight: 600 }}>~${dest.estimatedDailyBudget}/day</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
