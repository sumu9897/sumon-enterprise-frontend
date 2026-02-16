import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBuilding, FaTools, FaHome, FaHardHat, FaChevronDown } from 'react-icons/fa';
import projectsData from '../data/projects.json';

/* ─────────────────────────────────────────────
   useDarkMode — reads the class set by Header
───────────────────────────────────────────── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
};

/* ─────────────────────────────────────────────
   useCountUp — animates a number from 0 to end
───────────────────────────────────────────── */
const useCountUp = (end, duration = 2000, start = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(end);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return value;
};

/* ─────────────────────────────────────────────
   StatCard
───────────────────────────────────────────── */
const StatCard = ({ label, end, suffix, dark, startCount }) => {
  const value = useCountUp(end, 2000, startCount);
  return (
    <div className="text-center group">
      <div
        className="text-5xl md:text-6xl font-black mb-2 transition-transform duration-300 group-hover:scale-110"
        style={{ color: '#C9A84C', fontFamily: "'Playfair Display', serif" }}
      >
        {value}{suffix}
      </div>
      <div
        className="text-sm font-semibold tracking-widest uppercase"
        style={{ color: dark ? '#B0B0C8' : '#6B6B8A' }}
      >
        {label}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Home Component
───────────────────────────────────────────── */
const Home = () => {
  const dark = useDarkMode();
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Featured projects — first 3 with images, fallback to first 3
  const featured = [
    ...projectsData.filter((p) => p.images?.length > 0),
    ...projectsData.filter((p) => !p.images?.length),
  ].slice(0, 3);

  // Animate hero on mount
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Trigger count-up when stats section enters viewport
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      id: 1,
      icon: <FaBuilding />,
      title: 'Main Contractor',
      description: 'Complete construction project management from groundbreaking to handover.',
    },
    {
      id: 2,
      icon: <FaTools />,
      title: 'Sub Contractor',
      description: 'Specialized construction services for specific project phases and trades.',
    },
    {
      id: 3,
      icon: <FaHardHat />,
      title: 'Repairing Work',
      description: 'Professional structural repair and maintenance services for all building types.',
    },
    {
      id: 4,
      icon: <FaHome />,
      title: 'Apartment Development',
      description: 'End-to-end residential apartment development, design, and construction.',
    },
  ];

  const statsData = [
    { label: 'Years of Experience', end: 25, suffix: '+' },
    { label: 'Projects Completed', end: 50, suffix: '+' },
    { label: 'Services Offered',   end: 4,  suffix: ''  },
    { label: 'Client Satisfaction', end: 100, suffix: '%' },
  ];

  const bg   = dark ? '#0F1117' : '#FFFFFF';
  const bg2  = dark ? '#13151E' : '#F8F5EF';
  const text = dark ? '#E8E8F0' : '#1A1A2E';
  const sub  = dark ? '#888899' : '#6B6B8A';
  const card = dark ? '#1C1E2A' : '#FFFFFF';
  const border = dark ? '#2A2A3E' : '#E8E4DC';
  const gold = '#C9A84C';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .home-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        /* Hero text reveal */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-item { opacity: 0; }
        .hero-visible .hero-item { animation: fadeUp 0.7s ease forwards; }
        .hero-item:nth-child(1) { animation-delay: 0.1s; }
        .hero-item:nth-child(2) { animation-delay: 0.3s; }
        .hero-item:nth-child(3) { animation-delay: 0.5s; }
        .hero-item:nth-child(4) { animation-delay: 0.7s; }
        .hero-item:nth-child(5) { animation-delay: 0.9s; }

        /* Gold divider line */
        .gold-divider {
          width: 60px; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #E8C96A);
          margin: 0 auto 1.5rem;
          border-radius: 2px;
        }
        .gold-divider.left { margin: 0 0 1.5rem; }

        /* Section label */
        .section-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 0.75rem;
        }

        /* Card hover lift */
        .project-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        /* Service card */
        .service-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
          border: 1px solid transparent;
        }
        .service-card:hover {
          transform: translateY(-4px);
          border-color: #C9A84C;
        }

        /* Gold shimmer button */
        .btn-gold {
          background: #C9A84C;
          color: white;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 28px;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .btn-gold::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 60%; height: 100%;
          background: rgba(255,255,255,0.2);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
        }
        .btn-gold:hover::after { left: 150%; }
        .btn-gold:hover { opacity: 0.92; transform: translateY(-1px); }

        .btn-outline-gold {
          border: 2px solid #C9A84C;
          color: #C9A84C;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 12px 28px;
          border-radius: 2px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.25s;
        }
        .btn-outline-gold:hover {
          background: #C9A84C;
          color: white;
          transform: translateY(-1px);
        }

        /* Diagonal section separator */
        .diagonal-sep {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
          padding-bottom: 80px;
        }

        /* Scroll indicator bounce */
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .bounce { animation: bounce 1.5s infinite; }

        /* Stats section diagonal */
        .stats-section {
          clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
          margin: -40px 0;
          padding: 100px 0;
          position: relative;
          z-index: 1;
        }

        /* Icon ring */
        .icon-ring {
          width: 72px; height: 72px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          margin: 0 auto 1.5rem;
          transition: transform 0.3s;
        }
        .service-card:hover .icon-ring {
          transform: scale(1.1) rotate(5deg);
        }

        /* Reveal animation for sections */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal { animation: revealUp 0.6s ease forwards; }
      `}</style>

      <div className="home-root" style={{ background: bg, color: text }}>

        {/* ════════════════════════════════
            HERO
        ════════════════════════════════ */}
        <section
          className="relative flex items-center overflow-hidden"
          style={{ minHeight: '92vh' }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920")',
            }}
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: dark
                ? 'linear-gradient(120deg, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.7) 60%, rgba(10,10,20,0.4) 100%)'
                : 'linear-gradient(120deg, rgba(15,17,23,0.90) 0%, rgba(15,17,23,0.65) 60%, rgba(15,17,23,0.3) 100%)',
            }}
          />

          {/* Decorative gold line */}
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ background: 'linear-gradient(180deg, transparent, #C9A84C, transparent)' }}
          />

          <div
            className={`relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 ${heroVisible ? 'hero-visible' : ''}`}
          >
            <div className="max-w-3xl">
              {/* Label */}
              <div className="hero-item flex items-center gap-3 mb-6">
                <div style={{ width: 40, height: 2, background: gold }} />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: gold }}
                >
                  Established 2000 · Bangladesh
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-item serif font-black text-white mb-4 leading-[1.1]"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                M/S Sumon<br />
                <span style={{ color: gold }}>Enterprise</span>
              </h1>

              {/* Sub-headline */}
              <p className="hero-item text-xl md:text-2xl font-light text-white/80 mb-6">
                Building Dreams, Creating Landmarks
              </p>

              {/* Body */}
              <p className="hero-item text-base text-white/60 mb-10 max-w-xl leading-relaxed">
                Leading construction company in Bangladesh delivering excellence in
                Main Contracting, Sub-Contracting, Repairing, and Apartment Development
                for over 25 years.
              </p>

              {/* CTAs */}
              <div className="hero-item flex flex-wrap gap-4">
                <Link to="/projects" className="btn-gold">
                  View Projects <FaArrowRight />
                </Link>
                <Link to="/contact" className="btn-outline-gold">
                  Get a Quote
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bounce">
            <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
            <FaChevronDown className="text-white/40" />
          </div>
        </section>

        {/* ════════════════════════════════
            STATS BANNER
        ════════════════════════════════ */}
        <section
          ref={statsRef}
          className="stats-section"
          style={{ background: dark ? '#13151E' : '#1A1A2E' }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
              {statsData.map((s, i) => (
                <div key={i} className="relative">
                  {i > 0 && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 hidden md:block"
                      style={{ background: 'rgba(201,168,76,0.25)' }}
                    />
                  )}
                  <StatCard {...s} dark={dark} startCount={statsVisible} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            FEATURED PROJECTS
        ════════════════════════════════ */}
        <section className="py-24" style={{ background: bg2 }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-14">
              <p className="section-label">Portfolio</p>
              <div className="gold-divider" />
              <h2 className="serif font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: text }}>
                Featured Projects
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: sub }}>
                A selection of our most prestigious construction projects across Bangladesh
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="project-card rounded-sm overflow-hidden block"
                  style={{ background: card, border: `1px solid ${border}` }}
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden relative">
                    {project.images?.[0] ? (
                      <img
                        src={project.images[0].url}
                        alt={project.projectName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center gap-2"
                        style={{ background: dark ? '#2A2A3E' : '#E8E4DC' }}
                      >
                        <FaBuilding style={{ color: gold, fontSize: 32 }} />
                        <span className="text-xs uppercase tracking-widest" style={{ color: sub }}>
                          No Image
                        </span>
                      </div>
                    )}
                    {/* Status badge */}
                    <span
                      className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm"
                      style={{
                        background: project.status === 'Ongoing'
                          ? 'rgba(201,168,76,0.9)'
                          : 'rgba(30,180,100,0.9)',
                        color: 'white',
                      }}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="serif font-bold text-lg mb-1 line-clamp-1"
                      style={{ color: text }}
                    >
                      {project.projectName}
                    </h3>
                    {project.company && (
                      <p className="text-sm font-medium mb-1" style={{ color: gold }}>
                        {project.company}
                      </p>
                    )}
                    <p className="text-xs" style={{ color: sub }}>
                      {[project.address.area, project.address.city].filter(Boolean).join(', ')}
                    </p>
                    <div
                      className="mt-4 pt-4 flex items-center justify-between text-xs font-semibold tracking-widest uppercase"
                      style={{ borderTop: `1px solid ${border}`, color: gold }}
                    >
                      <span>{project.specifications?.floors}</span>
                      <span className="flex items-center gap-1">
                        View Details <FaArrowRight />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link to="/projects" className="btn-gold">
                View All Projects <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SERVICES
        ════════════════════════════════ */}
        <section className="py-24" style={{ background: bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Heading */}
            <div className="text-center mb-14">
              <p className="section-label">What We Do</p>
              <div className="gold-divider" />
              <h2 className="serif font-bold mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: text }}>
                Our Services
              </h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: sub }}>
                Comprehensive construction solutions built on expertise, precision, and trust
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="service-card rounded-sm p-8 text-center"
                  style={{ background: card, borderColor: border }}
                >
                  <div
                    className="icon-ring"
                    style={{ background: dark ? '#1A1A2E' : '#F7F3EC', color: gold }}
                  >
                    {s.icon}
                  </div>
                  <h3
                    className="serif font-bold text-lg mb-3"
                    style={{ color: text }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: sub }}>
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-14">
              <Link to="/services" className="btn-outline-gold">
                All Services <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            CTA BANNER
        ════════════════════════════════ */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            background: dark
              ? 'linear-gradient(135deg, #13151E 0%, #1C1E2A 100%)'
              : 'linear-gradient(135deg, #1A1A2E 0%, #2A2A4E 100%)',
          }}
        >
          {/* Decorative gold circles */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-5"
            style={{ background: gold }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-5"
            style={{ background: gold }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <p className="section-label mb-4" style={{ color: gold }}>Let's Build Together</p>
            <h2
              className="serif font-black text-white mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Ready to Start Your Project?
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-2xl mx-auto">
              Contact us today and let's bring your construction vision to life with
              quality, precision, and dedication.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-gold">
                Get In Touch <FaArrowRight />
              </Link>
              <Link to="/projects" className="btn-outline-gold">
                Our Work
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;