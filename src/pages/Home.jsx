import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  FaArrowRight, FaBuilding, FaTools, FaHome, FaAward,
  FaHandshake, FaChartLine, FaCheckCircle, FaHammer,
} from 'react-icons/fa';

/* ── useDarkMode ── */
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

/* ── Count-up ── */
const useCountUp = (end, duration = 2000, active = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step); else setValue(end);
    };
    requestAnimationFrame(step);
  }, [end, duration, active]);
  return value;
};

const StatNum = ({ end, suffix, active }) => {
  const v = useCountUp(end, 2000, active);
  return <>{v}{suffix}</>;
};

const Home = () => {
  const dark = useDarkMode();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [statsVis, setStatsVis]                 = useState(false);
  const statsRef = useRef(null);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  /* ─────────────────────────────────────────────
     Fetch projects:
     1. Try /projects/featured first
     2. If empty/error → fall back to /projects?limit=6
     This guarantees the section is never empty.
  ───────────────────────────────────────────── */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        // Step 1: try featured endpoint
        const featRes = await api.get('/projects/featured');
        const featured = featRes.data?.data || [];

        if (featured.length > 0) {
          setFeaturedProjects(featured.slice(0, 6));
          return;
        }

        // Step 2: fallback — just get latest 6 projects
        const allRes = await api.get('/projects?page=1&limit=6');
        const all = allRes.data?.data || [];
        setFeaturedProjects(all.slice(0, 6));

      } catch (err) {
        // Step 2 as error fallback
        try {
          const allRes = await api.get('/projects?page=1&limit=6');
          setFeaturedProjects((allRes.data?.data || []).slice(0, 6));
        } catch (e) {
          console.error('Could not load projects:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  /* ── Stats intersection observer ── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVis(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { end: 25,  suffix: '+', label: 'Years of Experience', icon: <FaChartLine /> },
    { end: 50,  suffix: '+', label: 'Projects Completed',  icon: <FaBuilding />  },
    { end: 4,   suffix: '',  label: 'Core Services',       icon: <FaTools />     },
    { end: 100, suffix: '%', label: 'Client Satisfaction', icon: <FaHandshake /> },
  ];

  const services = [
    { icon: <FaBuilding />, title: 'Main Contractor',       desc: 'Complete project management and execution from conception to completion.' },
    { icon: <FaTools />,    title: 'Sub Contractor',        desc: 'Specialized construction services for specific project phases and requirements.' },
    { icon: <FaHammer />,   title: 'Repairing Work',        desc: 'Professional repair and maintenance services for residential and commercial buildings.' },
    { icon: <FaHome />,     title: 'Apartment Development', desc: 'End-to-end residential development from land acquisition to final handover.' },
  ];

  const whyUs = [
    { icon: <FaCheckCircle />, title: 'Proven Quality',    desc: 'Every project is delivered with premium materials and rigorous quality checks at each stage.' },
    { icon: <FaAward />,       title: 'Award-Worthy Work', desc: '25 years of consistent excellence recognised by clients across Bangladesh.' },
    { icon: <FaHandshake />,   title: 'Client-First',      desc: 'We listen, adapt, and deliver exactly what our clients envision — on time and on budget.' },
    { icon: <FaChartLine />,   title: 'Proven Growth',     desc: 'From 1 project to 50+, our track record speaks for our reliability and ambition.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .home-root { font-family: 'DM Sans', sans-serif; }
        .serif     { font-family: 'Playfair Display', serif; }
        .section-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: .28em; text-transform: uppercase;
          color: #C9A84C; display: block; margin-bottom: .5rem;
        }
        .gold-divider {
          width: 50px; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #E8C96A);
          border-radius: 2px; margin-bottom: 1.5rem;
        }
        .gold-divider.center { margin-left: auto; margin-right: auto; }

        .hero-clip {
          clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%);
          padding-bottom: 100px;
        }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: #C9A84C; color: white;
          font-weight: 700; font-size: 13px;
          letter-spacing: .12em; text-transform: uppercase;
          border-radius: 2px; transition: all .25s;
          position: relative; overflow: hidden;
        }
        .btn-gold::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: rgba(255,255,255,.2);
          transform: skewX(-20deg); transition: left .45s ease;
        }
        .btn-gold:hover::after { left: 150%; }
        .btn-gold:hover { opacity: .9; transform: translateY(-1px); }

        .btn-outline-white {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px; border: 2px solid rgba(255,255,255,.4);
          color: white; font-weight: 700; font-size: 13px;
          letter-spacing: .12em; text-transform: uppercase;
          border-radius: 2px; transition: all .25s;
        }
        .btn-outline-white:hover { border-color: #C9A84C; color: #C9A84C; transform: translateY(-1px); }

        .btn-outline-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px; border: 2px solid #C9A84C; color: #C9A84C;
          font-weight: 700; font-size: 13px;
          letter-spacing: .12em; text-transform: uppercase;
          border-radius: 2px; transition: all .25s;
        }
        .btn-outline-gold:hover { background: #C9A84C; color: white; transform: translateY(-1px); }

        .svc-card { border: 1px solid var(--bdr); transition: transform .3s, box-shadow .3s, border-color .3s; }
        .svc-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.14); border-color: #C9A84C; }
        .svc-card:hover .svc-icon { background: #C9A84C !important; color: white !important; }
        .svc-icon { transition: background .3s, color .3s; }

        .proj-card { border: 1px solid var(--bdr); transition: transform .3s, box-shadow .3s, border-color .3s; }
        .proj-card:hover { transform: translateY(-6px); box-shadow: 0 20px 45px rgba(0,0,0,.15); border-color: #C9A84C; }
        .proj-card:hover .proj-img { transform: scale(1.07); }
        .proj-img { transition: transform .5s ease; }

        .why-card { border: 1px solid var(--bdr); transition: transform .3s, box-shadow .3s, border-color .3s; }
        .why-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,.14); border-color: #C9A84C; }
        .why-card:hover .why-icon { background: #C9A84C !important; color: white !important; }
        .why-icon { transition: background .3s, color .3s; }

        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position:-600px 0; } 100% { background-position:600px 0; } }
        @keyframes bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(8px)} }

        .fade-up { animation: fadeUp .65s ease forwards; }
        .d1{animation-delay:.1s;opacity:0} .d2{animation-delay:.25s;opacity:0}
        .d3{animation-delay:.4s;opacity:0} .d4{animation-delay:.55s;opacity:0}

        .skeleton {
          background: linear-gradient(90deg, var(--sk1) 25%, var(--sk2) 50%, var(--sk1) 75%);
          background-size: 1200px 100%;
          animation: shimmer 1.4s infinite linear;
        }
        .bounce { animation: bounce 1.8s ease infinite; }
      `}</style>

      <div
        className="home-root min-h-screen"
        style={{
          background: bg, color: text, '--bdr': bdr,
          '--sk1': dark ? '#1C1E2A' : '#F0EDE8',
          '--sk2': dark ? '#252838' : '#E8E4DC',
        }}
      >

        {/* ══ HERO ══ */}
        <section className="hero-clip relative overflow-hidden pt-20" style={{ background: dark2 }}>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage:'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920")', backgroundSize:'cover', backgroundPosition:'center' }} />
          <div className="absolute left-0 top-0 h-full w-1"
            style={{ background:`linear-gradient(180deg,transparent,${gold},transparent)` }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-2 rounded-sm mb-6 fade-up d1"
                style={{ background:'rgba(201,168,76,.12)', border:'1px solid rgba(201,168,76,.3)' }}>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color:gold }}>
                  Established 2000 · Bangladesh
                </span>
              </div>
              <h1 className="serif font-black text-white fade-up d2"
                style={{ fontSize:'clamp(2.8rem,7vw,5rem)', lineHeight:1.08 }}>
                M/S SUMON<br /><span style={{ color:gold }}>ENTERPRISE</span>
              </h1>
              <p className="mt-5 text-xl font-medium fade-up d3" style={{ color:'rgba(255,255,255,.75)' }}>
                Building Dreams, Creating Landmarks Since 2000
              </p>
              <p className="mt-3 text-base leading-relaxed fade-up d3 max-w-xl"
                style={{ color:'rgba(255,255,255,.5)' }}>
                Leading construction company delivering excellence in Main Contracting,
                Sub-Contracting, Repairing, and Apartment Development across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-4 mt-10 fade-up d4">
                <Link to="/projects" className="btn-gold">View Projects <FaArrowRight size={12} /></Link>
                <Link to="/contact"  className="btn-outline-white">Contact Us</Link>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bounce hidden md:block">
            <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
              style={{ borderColor:'rgba(201,168,76,.4)' }}>
              <div className="w-1 h-2 rounded-full" style={{ background:gold }} />
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section ref={statsRef} className="py-20 relative overflow-hidden"
          style={{ background:dark2, clipPath:'polygon(0 5%,100% 0,100% 95%,0 100%)',
                   marginTop:'-40px', marginBottom:'-40px', paddingTop:80, paddingBottom:80 }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s,i) => (
                <div key={i} className="text-center group relative">
                  {i>0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 hidden md:block"
                    style={{ background:'rgba(201,168,76,.2)' }} />}
                  <div className="w-12 h-12 rounded-sm flex items-center justify-center text-xl mx-auto mb-3"
                    style={{ background:'rgba(201,168,76,.12)', color:gold }}>{s.icon}</div>
                  <div className="serif font-black text-4xl md:text-5xl mb-1 transition-transform duration-300 group-hover:scale-110"
                    style={{ color:gold }}>
                    <StatNum end={s.end} suffix={s.suffix} active={statsVis} />
                  </div>
                  <div className="text-xs font-bold tracking-widest uppercase"
                    style={{ color:'rgba(255,255,255,.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED PROJECTS ══ */}
        <section className="py-24" style={{ background:bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">Portfolio</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold mb-3" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', color:text }}>
                Featured <span style={{ color:gold }}>Projects</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color:sub }}>
                Explore some of our most prestigious construction projects across Bangladesh
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_,i) => (
                  <div key={i} className="rounded-sm overflow-hidden" style={{ background:card, border:`1px solid ${bdr}` }}>
                    <div className="skeleton aspect-video" />
                    <div className="p-5 space-y-3">
                      <div className="skeleton rounded h-5 w-3/4" />
                      <div className="skeleton rounded h-3 w-1/2" />
                      <div className="skeleton rounded h-3 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredProjects.length === 0 ? (
              /* This state should never happen now thanks to the fallback */
              <div className="text-center py-12">
                <FaBuilding className="mx-auto mb-3 text-4xl" style={{ color:bdr }} />
                <p className="text-sm mb-4" style={{ color:sub }}>No projects loaded yet.</p>
                <Link to="/projects" className="btn-gold">Browse All Projects <FaArrowRight size={12} /></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProjects.map(project => (
                  <Link
                    key={project._id}
                    to={`/projects/${project.slug}`}
                    className="proj-card rounded-sm overflow-hidden block"
                    style={{ background:card }}
                  >
                    <div className="aspect-video overflow-hidden relative"
                      style={{ background: dark ? '#1A1A2E' : '#E8E4DC' }}>
                      {project.images?.[0] ? (
                        <img src={project.images[0].url} alt={project.projectName}
                          className="proj-img w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <FaBuilding style={{ color:gold, fontSize:28 }} />
                          <span className="text-xs tracking-widest uppercase" style={{ color:sub }}>No Image</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm"
                        style={{ background: project.status==='Ongoing' ? 'rgba(201,168,76,.92)' : 'rgba(34,197,94,.85)', color:'white' }}>
                        {project.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="serif font-bold text-base mb-1 line-clamp-1" style={{ color:text }}>
                        {project.projectName}
                      </h3>
                      {project.company && (
                        <p className="text-xs font-semibold mb-1" style={{ color:gold }}>{project.company}</p>
                      )}
                      <p className="text-xs mb-3" style={{ color:sub }}>
                        {[project.address?.area, project.address?.city].filter(Boolean).join(', ')}
                      </p>
                      <div className="flex items-center justify-between pt-3" style={{ borderTop:`1px solid ${bdr}` }}>
                        <span className="text-xs font-semibold" style={{ color:sub }}>
                          {project.specifications?.floors}
                           {project.startDate && (
                            <span
                              className={
                                project.specifications?.floors
                                  ? "ml-2 opacity-70"
                                  : "opacity-70"
                              }
                            >
                              {new Date(project.startDate).getFullYear()}
                              {project.finishDate
                                ? ` – ${new Date(project.finishDate).getFullYear()}`
                                : " – Running"}
                            </span>
                          )}
                        </span>
                        <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-1" style={{ color:gold }}>
                          View <FaArrowRight size={9} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/projects" className="btn-gold">
                View All Projects <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ SERVICES ══ */}
        <section className="py-24 relative overflow-hidden" style={{ background:dark2 }}>
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">What We Do</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold mb-3 text-white" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)' }}>
                Our <span style={{ color:gold }}>Services</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color:'rgba(255,255,255,.5)' }}>
                Comprehensive construction solutions tailored to your specific needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s,i) => (
                <div key={i} className="svc-card rounded-sm p-7 text-center" style={{ background:card }}>
                  <div className="svc-icon w-14 h-14 rounded-sm flex items-center justify-center text-2xl mx-auto mb-5"
                    style={{ background: dark ? '#1A1A2E' : '#F7F3EC', color:gold }}>{s.icon}</div>
                  <h3 className="serif font-bold text-lg mb-3" style={{ color:text }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:sub }}>{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase transition-all hover:gap-3"
                style={{ color:gold }}>
                Learn More About Our Services <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══ WHY CHOOSE US ══ */}
        <section className="py-24" style={{ background:bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">Why Us</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold mb-3" style={{ fontSize:'clamp(1.8rem,4vw,2.8rem)', color:text }}>
                Why Choose <span style={{ color:gold }}>Sumon Enterprise</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color:sub }}>The values and strengths that set us apart</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyUs.map((w,i) => (
                <div key={i} className="why-card rounded-sm p-7 text-center" style={{ background:card }}>
                  <div className="why-icon w-14 h-14 rounded-sm flex items-center justify-center text-2xl mx-auto mb-5"
                    style={{ background: dark ? '#1A1A2E' : '#F7F3EC', color:gold }}>{w.icon}</div>
                  <h3 className="serif font-bold text-lg mb-3" style={{ color:text }}>{w.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:sub }}>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="py-24 relative overflow-hidden" style={{ background:dark2 }}>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.04]" style={{ background:gold }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-[0.04]" style={{ background:gold }} />
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label">Get Started</span>
            <div className="gold-divider center" />
            <h2 className="serif font-black text-white mb-4" style={{ fontSize:'clamp(2rem,4vw,3rem)' }}>
              Ready to Start Your Project?
            </h2>
            <p className="text-base mb-10 max-w-2xl mx-auto" style={{ color:'rgba(255,255,255,.5)' }}>
              25+ years of expertise · 50+ completed projects · Trusted across Bangladesh
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-gold">Contact Us <FaArrowRight size={12} /></Link>
              <Link to="/projects" className="btn-outline-gold">Our Projects</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Home;