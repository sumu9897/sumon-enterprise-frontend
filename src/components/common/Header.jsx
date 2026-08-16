import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHardHat } from 'react-icons/fa';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/projects', label: 'Projects' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
];

/* ─────────────────────────────────────────────
   useDarkMode hook — persists preference
───────────────────────────────────────────── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return [dark, setDark];
};

/* ─────────────────────────────────────────────
   Header Component
───────────────────────────────────────────── */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useDarkMode();
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-3 focus:text-secondary">
        Skip to main content
      </a>
      {/* ── Inject Google Font ── */}
      <style>{`
        :root {
          --gold: #C9A84C;
          --gold-light: #E8C96A;
          --header-bg-light: #FFFFFF;
          --header-bg-dark: #0F1117;
          --text-light: #1A1A2E;
          --text-dark: #E8E8F0;
          --border-light: #E5E5E5;
          --border-dark: #2A2A3E;
          --hover-bg-light: #F7F3EC;
          --hover-bg-dark: #1C1C2E;
        }

        .header-root {
          font-family: 'DM Sans', sans-serif;
        }
        .brand-font {
          font-family: 'Playfair Display', serif;
        }

        /* ── Gold underline animation ── */
        .nav-link-item {
          position: relative;
          padding-bottom: 2px;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--gold);
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link-item:hover::after,
        .nav-link-item.active::after {
          width: 100%;
        }

        /* ── Mobile menu slide-down ── */
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu-enter {
          animation: slideDown 0.25s ease forwards;
        }

        /* ── Theme toggle button ── */
        .theme-btn {
          position: relative;
          width: 52px;
          height: 26px;
          border-radius: 999px;
          transition: background 0.3s;
          cursor: pointer;
          border: none;
          outline: none;
        }
        .theme-btn-knob {
          position: absolute;
          top: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          transition: left 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }
        .theme-btn-knob.light-pos { left: 3px; }
        .theme-btn-knob.dark-pos  { left: 29px; }

        /* ── Scrolled shadow ── */
        .header-scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
        }
        .dark .header-scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.40);
        }

        /* ── Gold accent bar at top ── */
        .gold-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light), var(--gold));
          background-size: 200% 100%;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <header
        className={`header-root sticky top-0 z-50 transition-all duration-300
          ${dark ? 'bg-[#0F1117] text-[#E8E8F0]' : 'bg-white text-[#1A1A2E]'}
          ${scrolled ? 'header-scrolled' : ''}
        `}
      >
        {/* Gold shimmer bar */}
        <div className="gold-bar" />

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div
                className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'var(--gold)' }}
              >
                <FaHardHat className="text-white text-lg" />
              </div>
              <div className="leading-tight">
                <div
                  className="brand-font font-black text-[15px] sm:text-[17px] tracking-wide uppercase leading-none"
                  style={{ color: dark ? '#E8E8F0' : '#1A1A2E' }}
                >
                  M/S Sumon
                </div>
                <div
                  className="text-[10px] tracking-[0.2em] uppercase font-semibold mt-0.5"
                  style={{ color: 'var(--gold)' }}
                >
                  Enterprise
                </div>
              </div>
            </Link>

            {/* ── Desktop Navigation ── */}
            <div className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link-item text-[13.5px] font-semibold tracking-wide uppercase transition-colors duration-200
                    ${isActive(link.path)
                      ? 'active'
                      : ''
                    }
                  `}
                  style={{
                    color: isActive(link.path)
                      ? 'var(--gold)'
                      : dark ? '#B0B0C8' : '#4A4A6A',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-3">
              {/* Dark/Light Toggle */}
              <button
                onClick={() => setDark(!dark)}
                aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
                aria-pressed={dark}
                title={`Switch to ${dark ? 'light' : 'dark'} theme`}
                className="theme-btn flex-shrink-0"
                style={{ background: dark ? '#2A2A4E' : '#E8C96A' }}
              >
                <span className={`theme-btn-knob ${dark ? 'dark-pos' : 'light-pos'}`}>
                  {dark ? '🌙' : '☀️'}
                </span>
              </button>

              {/* CTA Button — desktop */}
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold tracking-wider uppercase rounded-sm text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'var(--gold)' }}
              >
                Get a Quote
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`${isOpen ? 'Close' : 'Open'} navigation menu`}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation"
                className={`md:hidden w-10 h-10 flex items-center justify-center rounded-sm transition-colors duration-200
                  ${dark ? 'hover:bg-[#1C1C2E]' : 'hover:bg-[#F7F3EC]'}
                `}
              >
                {isOpen
                  ? <FaTimes className="text-xl" style={{ color: 'var(--gold)' }} />
                  : <FaBars className="text-xl" style={{ color: dark ? '#E8E8F0' : '#1A1A2E' }} />
                }
              </button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          {isOpen && (
            <div
              ref={mobileMenuRef}
              id="mobile-navigation"
              className={`md:hidden mobile-menu-enter pb-5 border-t
                ${dark ? 'border-[#2A2A3E]' : 'border-[#E5E5E5]'}
              `}
            >
              <div className="pt-3 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-sm text-[13px] font-semibold tracking-wide uppercase transition-colors duration-150
                      ${isActive(link.path)
                        ? dark ? 'bg-[#1C1C2E]' : 'bg-[#F7F3EC]'
                        : dark ? 'hover:bg-[#1C1C2E]' : 'hover:bg-[#F7F3EC]'
                      }
                    `}
                    style={{
                      color: isActive(link.path)
                        ? 'var(--gold)'
                        : dark ? '#B0B0C8' : '#4A4A6A',
                    }}
                  >
                    {link.label}
                    {isActive(link.path) && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--gold)' }}
                      />
                    )}
                  </Link>
                ))}

                {/* Mobile CTA */}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 mx-3 flex items-center justify-center gap-2 py-3 text-[13px] font-bold tracking-widest uppercase rounded-sm text-white"
                  style={{ background: 'var(--gold)' }}
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
