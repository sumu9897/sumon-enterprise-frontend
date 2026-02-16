import { useEffect, useState, useRef } from 'react';
import { FaHistory, FaCheckCircle, FaUsers, FaAward, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const useDarkMode = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const useCountUp = (end, duration = 2000, start = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = ts => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setValue(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step); else setValue(end);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return value;
};

const StatNum = ({ end, suffix, start }) => {
  const v = useCountUp(end, 2000, start);
  return <>{v}{suffix}</>;
};

const About = () => {
  const dark = useDarkMode();
  const [statsVis, setStatsVis] = useState(false);
  const statsRef = useRef(null);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const bg2   = dark ? '#13151E' : '#FFFFFF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold:.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const milestones = [
    { year:'2000', event:'Company Established', desc:'Started with a vision to deliver quality construction in Bangladesh.' },
    { year:'2005', event:'10th Project Completed', desc:'Reached our first major milestone with residential projects.' },
    { year:'2010', event:'Expanded to Major Cities', desc:'Extended operations to Dhaka, Comilla, and Narayangonj.' },
    { year:'2015', event:'30 Projects Milestone', desc:'Diversified into commercial and industrial construction.' },
    { year:'2020', event:'50+ Projects Delivered', desc:'Established as one of Bangladesh\'s trusted contractors.' },
    { year:'2025', event:'25 Years of Excellence', desc:'Celebrating a quarter century of building Bangladesh\'s future.' },
  ];

  const values = [
    { icon:<FaCheckCircle />, title:'Quality First',           desc:'We never compromise on the quality of materials and workmanship.' },
    { icon:<FaUsers />,       title:'Client Satisfaction',     desc:'Our clients\' success and satisfaction is our top priority.' },
    { icon:<FaAward />,       title:'Professional Excellence', desc:'We maintain the highest standards of professionalism on every project.' },
    { icon:<FaHistory />,     title:'Timely Delivery',         desc:'We commit to deadlines and consistently deliver projects on schedule.' },
  ];

  const stats = [
    { end:25, suffix:'+', label:'Years of Experience' },
    { end:50, suffix:'+', label:'Projects Completed'  },
    { end:4,  suffix:'',  label:'Core Services'       },
    { end:100,suffix:'%', label:'Client Satisfaction' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .about-root{font-family:'DM Sans',sans-serif}
        .serif{font-family:'Playfair Display',serif}
        .section-label{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem}
        .gold-divider{width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.5rem}
        .gold-divider.center{margin-left:auto;margin-right:auto}

        .hero-about{clip-path:polygon(0 0,100% 0,100% 88%,0 100%);padding-bottom:90px}

        .value-card{border:1px solid var(--bdr);transition:transform .3s,box-shadow .3s,border-color .3s}
        .value-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.14);border-color:#C9A84C}
        .value-card:hover .val-icon{background:#C9A84C!important;color:white!important}
        .val-icon{transition:background .3s,color .3s}

        .timeline-item{position:relative;padding-left:40px}
        .timeline-item::before{content:'';position:absolute;left:11px;top:28px;bottom:-20px;width:2px;background:var(--bdr)}
        .timeline-item:last-child::before{display:none}
        .timeline-dot{position:absolute;left:0;top:4px;width:24px;height:24px;border-radius:50%;border:2px solid #C9A84C;background:var(--card);display:flex;align-items:center;justify-content:center}
        .timeline-dot.active{background:#C9A84C}

        .btn-gold{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:#C9A84C;color:white;font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all .25s}
        .btn-gold:hover{opacity:.9;transform:translateY(-1px)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .65s ease forwards}
        .d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.25s;opacity:0}.d3{animation-delay:.4s;opacity:0}
      `}</style>

      <div className="about-root min-h-screen" style={{ background:bg, color:text, '--bdr':bdr, '--card':card }}>

        {/* ── HERO ── */}
        <section className="hero-about relative overflow-hidden pt-20" style={{ background:dark2 }}>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage:'url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600")', backgroundSize:'cover', backgroundPosition:'center' }} />
          <div className="absolute left-0 top-0 h-full w-1" style={{ background:`linear-gradient(180deg,transparent,${gold},transparent)` }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pb-20">
            <span className="section-label fade-up d1">Our Story</span>
            <div className="gold-divider center fade-up d1" />
            <h1 className="serif font-black text-white fade-up d2" style={{ fontSize:'clamp(2.5rem,6vw,4rem)', lineHeight:1.1 }}>
              About <span style={{ color:gold }}>M/S Sumon Enterprise</span>
            </h1>
            <p className="mt-4 text-base max-w-2xl mx-auto fade-up d3" style={{ color:'rgba(255,255,255,.5)' }}>
              Building Bangladesh's future with 25+ years of construction excellence
            </p>
          </div>
        </section>

        {/* ── OUR STORY ── */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-label">Who We Are</span>
              <div className="gold-divider" />
              <h2 className="serif font-bold mb-6" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>
                25 Years of Building Trust
              </h2>
              <div className="space-y-4 text-sm leading-relaxed" style={{ color:sub }}>
                <p>Founded in 2000, <strong style={{ color:gold }}>M/S Sumon Enterprise</strong> has grown from a small construction firm to one of Bangladesh's most trusted contractors. With over 25 years of experience, we have successfully completed more than 50 projects across the country.</p>
                <p>Our journey began with a simple vision: to provide high-quality construction services that combine traditional craftsmanship with modern technology. Today, we are proud to have built lasting relationships with clients who trust us with their most important projects.</p>
                <p>From residential apartments to commercial buildings and industrial facilities, our portfolio showcases our versatility and unwavering commitment to excellence.</p>
              </div>
              <div className="mt-8">
                <Link to="/projects" className="btn-gold">
                  View Our Work <FaArrowRight size={12} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
                alt="Construction site"
                className="w-full h-96 object-cover rounded-sm"
                style={{ border:`4px solid ${bdr}` }}
              />
              {/* Floating stat badge */}
              <div className="absolute -bottom-5 -left-5 px-6 py-4 rounded-sm shadow-xl"
                style={{ background:dark2, border:`1px solid ${gold}` }}>
                <div className="serif font-black text-3xl" style={{ color:gold }}>25+</div>
                <div className="text-xs font-bold tracking-widest uppercase text-white">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef} className="py-20 relative overflow-hidden"
          style={{ background:dark2, clipPath:'polygon(0 5%,100% 0,100% 95%,0 100%)', margin:'-40px 0', paddingTop:80, paddingBottom:80 }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s,i) => (
                <div key={i} className="text-center group relative">
                  {i>0 && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 hidden md:block" style={{ background:'rgba(201,168,76,.2)' }} />}
                  <div className="serif font-black text-5xl mb-2 transition-transform duration-300 group-hover:scale-110" style={{ color:gold }}>
                    <StatNum end={s.end} suffix={s.suffix} start={statsVis} />
                  </div>
                  <div className="text-xs font-bold tracking-widest uppercase" style={{ color:'rgba(255,255,255,.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MILESTONES ── */}
        <section className="py-24" style={{ background:bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">History</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>Our Milestones</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 max-w-4xl mx-auto">
              {milestones.map((m, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${i===milestones.length-1 ? 'active' : ''}`}>
                    {i===milestones.length-1 && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="rounded-sm p-5" style={{ background:card, border:`1px solid ${bdr}` }}>
                    <div className="serif font-black text-2xl mb-1" style={{ color:gold }}>{m.year}</div>
                    <div className="font-bold text-sm mb-1" style={{ color:text }}>{m.event}</div>
                    <div className="text-xs leading-relaxed" style={{ color:sub }}>{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-24" style={{ background: dark ? '#13151E' : '#F8F5EF' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">Principles</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold mb-3" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>Our Core Values</h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color:sub }}>The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => (
                <div key={i} className="value-card rounded-sm p-7 text-center" style={{ background:card }}>
                  <div className="val-icon w-14 h-14 rounded-sm flex items-center justify-center text-2xl mx-auto mb-5"
                    style={{ background: dark ? '#1A1A2E' : '#F7F3EC', color:gold }}>{v.icon}</div>
                  <h3 className="serif font-bold text-lg mb-3" style={{ color:text }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color:sub }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MISSION & VISION ── */}
        <section className="py-24 relative overflow-hidden" style={{ background:dark2 }}>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-[0.04]" style={{ background:gold }} />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full opacity-[0.04]" style={{ background:gold }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="rounded-sm p-8" style={{ border:`1px solid rgba(201,168,76,.25)` }}>
                <span className="section-label">Purpose</span>
                <div className="gold-divider" />
                <h2 className="serif font-bold text-white text-2xl mb-4">Our Mission</h2>
                <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,.55)' }}>
                  To deliver exceptional construction services that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to excellence. We strive to build not just structures, but lasting relationships and communities.
                </p>
              </div>
              <div className="rounded-sm p-8" style={{ border:`1px solid rgba(201,168,76,.25)` }}>
                <span className="section-label">Future</span>
                <div className="gold-divider" />
                <h2 className="serif font-bold text-white text-2xl mb-4">Our Vision</h2>
                <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,.55)' }}>
                  To be Bangladesh's most trusted and respected construction company, known for transforming visions into reality while setting new standards in quality, safety, and sustainability in the construction industry.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20" style={{ background:bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label">Work With Us</span>
            <div className="gold-divider center" />
            <h2 className="serif font-bold mb-4" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>Ready to Start Your Project?</h2>
            <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color:sub }}>
              Let's build something extraordinary together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-gold">Contact Us <FaArrowRight size={12} /></Link>
              <Link to="/projects"
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold tracking-widest uppercase rounded-sm border-2 transition-all hover:-translate-y-0.5"
                style={{ borderColor:gold, color:gold }}>
                Our Projects
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;