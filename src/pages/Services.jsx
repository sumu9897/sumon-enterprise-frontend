import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaTools, FaHammer, FaHome, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const useDarkMode = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const Services = () => {
  const dark = useDarkMode();

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  const services = [
    {
      icon: <FaBuilding />,
      title: 'Main Contractor',
      tagline: 'From conception to completion',
      description: 'Complete project management and execution covering every phase of construction.',
      features: [
        'Full project planning and design coordination',
        'Quality control and assurance throughout',
        'Timeline and budget management',
        'Coordination with all stakeholders',
        'Compliance with building codes and regulations',
        'Post-construction support and documentation',
      ],
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    },
    {
      icon: <FaTools />,
      title: 'Sub Contractor',
      tagline: 'Specialized expertise on demand',
      description: 'Specialized construction services for specific project phases and trade requirements.',
      features: [
        'Specialized trade and technical work',
        'Electrical and plumbing installations',
        'HVAC systems design and installation',
        'Interior finishing and fit-out',
        'Structural and civil work',
        'MEP (Mechanical, Electrical, Plumbing) services',
      ],
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
    },
    {
      icon: <FaHammer />,
      title: 'Repairing Work',
      tagline: 'Restore, repair, renew',
      description: 'Professional repair and maintenance services for residential and commercial buildings.',
      features: [
        'Structural assessment and repairs',
        'Waterproofing and damp-proofing solutions',
        'Facade and exterior restoration',
        'Foundation stabilization and repairs',
        'Roof repair and maintenance',
        'Emergency repair response services',
      ],
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    },
    {
      icon: <FaHome />,
      title: 'Apartment Development',
      tagline: 'End-to-end residential solutions',
      description: 'Complete residential development from land acquisition through to final handover.',
      features: [
        'Land acquisition and feasibility studies',
        'Architectural design and planning',
        'Full construction management',
        'Premium quality materials and finishes',
        'Timely project delivery guaranteed',
        'Legal documentation and title support',
      ],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    },
  ];

  const process = [
    { step:'01', title:'Consultation', desc:'Initial meeting to understand your requirements, scope, and budget.' },
    { step:'02', title:'Planning',     desc:'Detailed project planning, design coordination, and timeline setting.' },
    { step:'03', title:'Execution',    desc:'Professional construction with rigorous quality control at every stage.' },
    { step:'04', title:'Delivery',     desc:'Timely handover with complete documentation and post-project support.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .svc-root{font-family:'DM Sans',sans-serif}
        .serif{font-family:'Playfair Display',serif}
        .section-label{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem}
        .gold-divider{width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.5rem}
        .gold-divider.center{margin-left:auto;margin-right:auto}

        .hero-svc{clip-path:polygon(0 0,100% 0,100% 88%,0 100%);padding-bottom:90px}

        .svc-img{transition:transform .5s ease}
        .svc-row:hover .svc-img{transform:scale(1.04)}

        .feature-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0}

        .process-card{border:1px solid var(--bdr);transition:transform .3s,box-shadow .3s,border-color .3s}
        .process-card:hover{transform:translateY(-5px);box-shadow:0 16px 40px rgba(0,0,0,.14);border-color:#C9A84C}

        .btn-gold{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;background:#C9A84C;color:white;font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all .25s}
        .btn-gold:hover{opacity:.9;transform:translateY(-1px)}
        .btn-outline-gold{display:inline-flex;align-items:center;gap:8px;padding:11px 28px;border:2px solid #C9A84C;color:#C9A84C;font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all .25s}
        .btn-outline-gold:hover{background:#C9A84C;color:white;transform:translateY(-1px)}

        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .65s ease forwards}
        .d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.25s;opacity:0}.d3{animation-delay:.4s;opacity:0}
      `}</style>

      <div className="svc-root min-h-screen" style={{ background:bg, color:text, '--bdr':bdr }}>

        {/* ── HERO ── */}
        <section className="hero-svc relative overflow-hidden pt-20" style={{ background:dark2 }}>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage:'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600")', backgroundSize:'cover', backgroundPosition:'center' }} />
          <div className="absolute left-0 top-0 h-full w-1" style={{ background:`linear-gradient(180deg,transparent,${gold},transparent)` }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pb-20">
            <span className="section-label fade-up d1">What We Offer</span>
            <div className="gold-divider center fade-up d1" />
            <h1 className="serif font-black text-white fade-up d2" style={{ fontSize:'clamp(2.5rem,6vw,4rem)', lineHeight:1.1 }}>
              Our <span style={{ color:gold }}>Services</span>
            </h1>
            <p className="mt-4 text-base max-w-xl mx-auto fade-up d3" style={{ color:'rgba(255,255,255,.5)' }}>
              Comprehensive construction solutions tailored to your specific needs
            </p>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((s, i) => (
              <div key={i} className={`svc-row grid grid-cols-1 lg:grid-cols-2 gap-14 items-center ${i%2===1 ? 'lg:grid-flow-dense' : ''}`}>

                {/* Image */}
                <div className={`${i%2===1 ? 'lg:col-start-2' : ''} overflow-hidden rounded-sm`}
                  style={{ border:`1px solid ${bdr}` }}>
                  <img src={s.image} alt={s.title} className="svc-img w-full h-72 md:h-80 object-cover" />
                </div>

                {/* Content */}
                <div className={i%2===1 ? 'lg:col-start-1' : ''}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-sm text-2xl mb-5"
                    style={{ background: dark ? '#1C1E2A' : '#F7F3EC', color:gold, border:`1px solid ${bdr}` }}>
                    {s.icon}
                  </div>
                  <span className="section-label">{s.tagline}</span>
                  <div className="gold-divider" />
                  <h2 className="serif font-bold mb-3" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', color:text }}>{s.title}</h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color:sub }}>{s.description}</p>
                  <div className="space-y-1">
                    {s.features.map((f, fi) => (
                      <div key={fi} className="feature-item">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5" style={{ color:gold, fontSize:14 }} />
                        <span className="text-sm" style={{ color:sub }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROCESS ── */}
        <section className="py-24" style={{ background: dark ? '#13151E' : '#FFFFFF' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">How We Work</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold mb-3" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>Our Work Process</h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color:sub }}>A streamlined approach to deliver your project successfully</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((p, i) => (
                <div key={i} className="process-card rounded-sm p-7 relative overflow-hidden" style={{ background:card }}>
                  {/* Step number watermark */}
                  <div className="absolute -top-3 -right-1 serif font-black opacity-[0.05]"
                    style={{ fontSize:80, color:gold, lineHeight:1 }}>{p.step}</div>
                  <div className="relative z-10">
                    <div className="serif font-black text-3xl mb-3" style={{ color:gold }}>{p.step}</div>
                    <h3 className="font-bold text-base mb-2" style={{ color:text }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color:sub }}>{p.desc}</p>
                  </div>
                  {/* Connector arrow */}
                  {i < process.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                      <FaArrowRight style={{ color:gold, fontSize:14 }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US STATS ── */}
        <section className="py-20 relative overflow-hidden" style={{ background:dark2 }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="section-label">Why Choose Us</span>
              <div className="gold-divider center" />
              <h2 className="serif font-bold text-white" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)' }}>Proven Track Record</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { val:'25+', label:'Years Experience', desc:'Over two decades of proven expertise in construction across Bangladesh.' },
                { val:'50+', label:'Projects Completed', desc:'Successfully delivered diverse construction projects of all scales.' },
                { val:'100%', label:'Quality Assured', desc:'Unwavering commitment to the highest quality standards on every project.' },
              ].map((s, i) => (
                <div key={i} className="text-center p-8 rounded-sm" style={{ border:`1px solid rgba(201,168,76,.2)` }}>
                  <div className="serif font-black text-5xl mb-2" style={{ color:gold }}>{s.val}</div>
                  <div className="font-bold text-white mb-3">{s.label}</div>
                  <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,.45)' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-24" style={{ background:bg }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label">Get Started</span>
            <div className="gold-divider center" />
            <h2 className="serif font-bold mb-4" style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', color:text }}>Ready to Start Your Project?</h2>
            <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color:sub }}>
              Get in touch today to discuss your construction needs and receive a free consultation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-gold">Contact Us <FaArrowRight size={12} /></Link>
              <Link to="/projects" className="btn-outline-gold">View Our Projects</Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Services;