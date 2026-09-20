import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <main>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
