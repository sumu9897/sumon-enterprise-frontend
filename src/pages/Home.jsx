import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowRight, FaBuilding, FaTools, FaHome, FaAward, FaHandshake, FaChartLine } from 'react-icons/fa';

/* ── useDarkMode — syncs with Header toggle ── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const Home = () => {
  const dark = useDarkMode();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ experience: 0, projects: 0, services: 0, satisfaction: 0 });

  /* Theme tokens */
  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => {
    fetchFeaturedProjects();
    animateStats();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await api.get('/projects/featured');
      setFeaturedProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const targets = { experience: 25, projects: 50, services: 4, satisfaction: 100 };
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        experience: Math.floor(targets.experience * progress),
        projects: Math.floor(targets.projects * progress),
        services: Math.floor(targets.services * progress),
        satisfaction: Math.floor(targets.satisfaction * progress),
      });

      if (currentStep >= steps) {
        setStats(targets);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  };

  const services = [
    {
      id: 1,
      title: 'Main Contractor',
      description: 'Complete construction project management from start to finish.',
      icon: <FaBuilding size={36} />,
    },
    {
      id: 2,
      title: 'Sub Contractor',
      description: 'Specialized construction services for specific project phases.',
      icon: <FaTools size={36} />,
    },
    {
      id: 3,
      title: 'Repairing Work',
      description: 'Professional repair and maintenance services for buildings.',
      icon: <FaAward size={36} />,
    },
    {
      id: 4,
      title: 'Apartment Development',
      description: 'End-to-end residential apartment development and construction.',
      icon: <FaHome size={36} />,
    },
  ];

  const statsData = [
    { label: 'Years of Experience', value: stats.experience, suffix: '+', icon: <FaChartLine size={28} /> },
    { label: 'Projects Completed', value: stats.projects, suffix: '+', icon: <FaBuilding size={28} /> },
    { label: 'Services Offered', value: stats.services, suffix: '', icon: <FaTools size={28} /> },
    { label: 'Client Satisfaction', value: stats.satisfaction, suffix: '%', icon: <FaHandshake size={28} /> },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        .home-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        .section-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: .28em; text-transform: uppercase;
          color: #C9A84C; display: block; margin-bottom: .5rem;
        }
        .gold-divider {
          width: 50px; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #E8C96A);
          border-radius: 2px; margin-bottom: 1.25rem;
        }
        .gold-divider.center { margin-left: auto; margin-right: auto; }

        .hero-home {
          position: relative; overflow: hidden;
          min-height: 85vh; display: flex; align-items: center;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(15,17,23,.95) 0%, rgba(28,30,42,.85) 100%);
        }
        .hero-overlay.light {
          background: linear-gradient(135deg, rgba(26,26,46,.92) 0%, rgba(26,26,46,.78) 100%);
        }
        .hero-bg {
          position: absolute; inset: 0; opacity: 0.15;
          background-image: url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920');
          background-size: cover; background-position: center;
        }

        .stat-card {
          transition: transform .3s, box-shadow .3s;
        }
        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(201,168,76,.18);
        }

        .service-card {
          border: 1px solid var(--bdr);
          transition: transform .3s, box-shadow .3s, border-color .3s;
        }
        .service-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0,0,0,.12);
          border-color: #C9A84C;
        }

        .project-card {
          border: 1px solid var(--bdr);
          transition: transform .3s, box-shadow .3s, border-color .3s;
        }
        .project-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0,0,0,.15);
          border-color: #C9A84C;
        }
        .project-card:hover .project-img { transform: scale(1.07); }
        .project-img { transition: transform .5s ease; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .fade-up { animation: fadeUp .8s ease forwards; }
        .fade-in { animation: fadeIn .6s ease forwards; }
        .d1 { animation-delay: .1s;  opacity: 0; }
        .d2 { animation-delay: .25s; opacity: 0; }
        .d3 { animation-delay: .4s;  opacity: 0; }
        .d4 { animation-delay: .55s; opacity: 0; }

        .cta-section {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #C9A84C 0%, #B39640 100%);
        }
        .cta-pattern {
          position: absolute; inset: 0; opacity: 0.08;
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .btn-gold {
          background: #C9A84C;
          color: white;
          padding: 14px 32px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          transition: all .3s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: none;
          cursor: pointer;
        }
        .btn-gold:hover {
          background: #B39640;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(201,168,76,.35);
        }

        .btn-outline {
          background: transparent;
          color: white;
          padding: 14px 32px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          transition: all .3s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 2px solid white;
          cursor: pointer;
        }
        .btn-outline:hover {
          background: white;
          color: #1A1A2E;
          transform: translateY(-2px);
        }

        .spinner {
          width: 50px; height: 50px;
          border: 4px solid var(--bdr);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        className="home-root min-h-screen"
        style={{
          background: bg, color: text,
          '--bdr': bdr,
        }}
      >

        {/* ══ HERO SECTION ══ */}
        <section className="hero-home">
          <div className="hero-bg" />
          <div className={`hero-overlay ${dark ? '' : 'light'}`} />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <div
                className="inline-block px-4 py-2 rounded-sm mb-6 fade-up d1"
                style={{ background: 'rgba(201,168,76,.15)', border: `1px solid rgba(201,168,76,.3)` }}
              >
                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: gold }}>
                  Established 2000
                </span>
              </div>

              <h1
                className="serif font-black text-white mb-6 fade-up d2"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}
              >
                M/S SUMON <span style={{ color: gold }}>ENTERPRISE</span>
              </h1>

              <p
                className="text-xl md:text-2xl mb-4 fade-up d3"
                style={{ color: 'rgba(255,255,255,.85)' }}
              >
                Building Dreams, Creating Landmarks Since 2000
              </p>

              <p
                className="text-base mb-10 leading-relaxed fade-up d4"
                style={{ color: 'rgba(255,255,255,.6)', maxWidth: '580px' }}
              >
                Leading construction company providing excellence in Main Contracting,
                Sub-Contracting, Repairing, and Apartment Development across Bangladesh.
              </p>

              <div className="flex flex-wrap gap-4 fade-up d4">
                <Link to="/projects" className="btn-gold">
                  View Projects <FaArrowRight size={12} />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS COUNTER ══ */}
        <section
          className="py-16 border-b"
          style={{ background: dark2, borderColor: bdr }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="stat-card rounded-sm p-6 text-center"
                  style={{ background: card, border: `1px solid ${bdr}` }}
                >
                  <div className="flex justify-center mb-3" style={{ color: gold }}>
                    {stat.icon}
                  </div>
                  <div
                    className="text-4xl md:text-5xl font-bold mb-2 serif"
                    style={{ color: text }}
                  >
                    {stat.value}{stat.suffix}
                  </div>
                  <div
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: sub }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED PROJECTS ══ */}
        <section className="py-20" style={{ background: bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">Portfolio</span>
              <div className="gold-divider center" />
              <h2
                className="serif font-black mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: text }}
              >
                Featured <span style={{ color: gold }}>Projects</span>
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: sub }}>
                Explore some of our most prestigious construction projects across Bangladesh
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="spinner" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProjects.slice(0, 6).map((project) => (
                    <Link
                      key={project._id}
                      to={`/projects/${project.slug}`}
                      className="project-card rounded-sm overflow-hidden block"
                      style={{ background: card }}
                    >
                      {/* Image */}
                      <div
                        className="aspect-video overflow-hidden relative"
                        style={{ background: dark ? '#1A1A2E' : '#E8E4DC' }}
                      >
                        {project.images?.[0] ? (
                          <img
                            src={project.images[0].url}
                            alt={project.projectName}
                            className="project-img w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <FaBuilding style={{ color: gold, fontSize: 28 }} />
                            <span
                              className="text-xs tracking-widest uppercase"
                              style={{ color: sub }}
                            >
                              No Image
                            </span>
                          </div>
                        )}

                        {/* Status badge */}
                        <span
                          className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm"
                          style={{
                            background: project.status === 'Ongoing'
                              ? 'rgba(201,168,76,.92)'
                              : 'rgba(34,197,94,.85)',
                            color: 'white',
                          }}
                        >
                          {project.status}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3
                          className="serif font-bold text-base mb-1 line-clamp-1"
                          style={{ color: text }}
                        >
                          {project.projectName}
                        </h3>

                        {project.company && (
                          <p className="text-xs font-semibold mb-1" style={{ color: gold }}>
                            {project.company}
                          </p>
                        )}

                        <p className="text-xs mb-3" style={{ color: sub }}>
                          {[project.address?.area, project.address?.city]
                            .filter(Boolean)
                            .join(', ')}
                        </p>

                        <div
                          className="flex items-center justify-between pt-3"
                          style={{ borderTop: `1px solid ${bdr}` }}
                        >
                          <span
                            className="text-xs font-bold tracking-widest uppercase flex items-center gap-1"
                            style={{ color: gold }}
                          >
                            View Details <FaArrowRight size={9} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to="/projects" className="btn-gold">
                    View All Projects <FaArrowRight size={12} />
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ══ SERVICES OVERVIEW ══ */}
        <section className="py-20 border-t" style={{ background: dark2, borderColor: bdr }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">What We Do</span>
              <div className="gold-divider center" />
              <h2
                className="serif font-black mb-4"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: text }}
              >
                Our <span style={{ color: gold }}>Services</span>
              </h2>
              <p className="max-w-2xl mx-auto" style={{ color: sub }}>
                Comprehensive construction solutions tailored to your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="service-card rounded-sm p-8 text-center"
                  style={{ background: card }}
                >
                  <div className="flex justify-center mb-4" style={{ color: gold }}>
                    {service.icon}
                  </div>
                  <h3
                    className="serif font-bold text-lg mb-3"
                    style={{ color: text }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: sub }}>
                    {service.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:gap-3"
                style={{ color: gold }}
              >
                Learn More About Our Services <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ CTA SECTION ══ */}
        <section className="cta-section py-20">
          <div className="cta-pattern" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2
              className="serif font-black text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Ready to Start Your Project?
            </h2>
            <p className="text-lg mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,.85)' }}>
              Let's build something amazing together. Contact us today for a consultation.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 bg-white text-xl font-bold tracking-wider uppercase px-10 py-4 rounded-sm transition-all hover:scale-105 hover:shadow-2xl"
              style={{ color: '#1A1A2E' }}
            >
              Get In Touch <FaArrowRight size={16} />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;