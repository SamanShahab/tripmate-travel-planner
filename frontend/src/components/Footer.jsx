import { Link } from 'react-router-dom';
import { Compass, Globe, Share2, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#161616] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Compass size={20} className="text-[#7a8c5e]" />
              <span className="font-serif text-xl text-[#f0ebe0]">TripMate</span>
            </div>
            <p className="text-[#9a9080] text-sm leading-relaxed max-w-xs">
              Plan meaningful trips, discover remarkable places, and organize every detail in one beautiful workspace.
            </p>
            <div className="flex gap-4 mt-6">
              {[Globe, Share2, Code2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#9a9080] hover:text-[#f0ebe0] hover:border-white/20 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#9a9080] mb-4">Explore</h4>
            <ul className="space-y-3">
              {[['Destinations', '/destinations'], ['Plan a Trip', '/create-trip'], ['My Trips', '/trips']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-sm text-[#9a9080] hover:text-[#f0ebe0] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#9a9080] mb-4">Account</h4>
            <ul className="space-y-3">
              {[['Dashboard', '/dashboard'], ['Sign In', '/login'], ['Register', '/register']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-sm text-[#9a9080] hover:text-[#f0ebe0] transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#9a9080]">© 2024 TripMate. All rights reserved.</p>
          <p className="text-xs text-[#9a9080]">Travel Less Randomly. Experience More Intentionally.</p>
        </div>
      </div>
    </footer>
  );
}
