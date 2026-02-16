import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft, FaBuilding, FaSearch } from 'react-icons/fa';

/* ── useDarkMode ── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
};

function NotFound() {
  const dark = useDarkMode();
  const navigate = useNavigate();

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const border = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';

  const quickLinks = [
    { to: '/', icon: <FaHome />, label: 'Home' },
    { to: '/projects', icon: <FaBuilding />, label: 'Projects' },
    { to: '/gallery', icon: <FaSearch />, label: 'Gallery' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .notfound-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        .floating {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .btn-gold {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 32px;
          background: #C9A84C; color: white;
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.3s;
          border: none; cursor: pointer;
        }
        .btn-gold:hover {
          background: #B39640;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(201,168,76,0.35);
        }

        .btn-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 12px 28px;
          border: 2px solid var(--bd);
          background: transparent;
          color: var(--txt);
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.3s;
          cursor: pointer;
        }
        .btn-outline:hover {
          border-color: #C9A84C;
          color: #C9A84C;
          transform: translateY(-2px);
        }

        .quick-link {
          border: 1px solid var(--bd);
          transition: all 0.3s;
        }
        .quick-link:hover {
          border-color: #C9A84C;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .quick-link:hover .link-icon {
          background: #C9A84C !important;
          color: white !important;
        }
        .link-icon { transition: all 0.3s; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.2s; opacity: 0; }
        .d3 { animation-delay: 0.3s; opacity: 0; }
        .d4 { animation-delay: 0.4s; opacity: 0; }
        .d5 { animation-delay: 0.5s; opacity: 0; }

        .gradient-text {
          background: linear-gradient(135deg, #C9A84C 0%, #E8C96A 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div
        className="notfound-root min-h-screen flex items-center justify-center px-6 py-20"
        style={{ background: bg, color: text, '--bd': border, '--txt': text }}
      >
        <div className="max-w-4xl w-full text-center">
          
          {/* 404 Number - Floating Animation */}
          <div className="floating fade-in d1 mb-8">
            <h1
              className="serif font-black gradient-text"
              style={{ fontSize: 'clamp(6rem, 15vw, 12rem)', lineHeight: 1 }}
            >
              404
            </h1>
          </div>

          {/* Main Message */}
          <div className="mb-8 fade-in d2">
            <h2
              className="serif font-bold mb-3"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: text }}
            >
              Page Not Found
            </h2>
            <p className="text-base max-w-md mx-auto leading-relaxed" style={{ color: sub }}>
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in d3">
            <Link to="/" className="btn-gold">
              <FaHome size={14} /> Go to Homepage
            </Link>
            <button onClick={() => navigate(-1)} className="btn-outline">
              <FaArrowLeft size={14} /> Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="fade-in d4">
            <p
              className="text-xs font-bold tracking-widest uppercase mb-4"
              style={{ color: gold }}
            >
              Quick Links
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className="quick-link rounded-sm p-6 block"
                  style={{ background: card }}
                >
                  <div
                    className="link-icon w-12 h-12 rounded-sm flex items-center justify-center text-xl mx-auto mb-3"
                    style={{
                      background: dark ? '#13151E' : '#F7F3EC',
                      color: gold,
                    }}
                  >
                    {link.icon}
                  </div>
                  <p className="font-semibold text-sm" style={{ color: text }}>
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Help Text */}
          <div className="mt-12 fade-in d5">
            <p className="text-xs" style={{ color: sub }}>
              Need help? Contact us at{' '}
              <a
                href="mailto:sumonconstruction2024@gmail.com"
                className="font-semibold hover:underline"
                style={{ color: gold }}
              >
                sumonconstruction2024@gmail.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default NotFound;