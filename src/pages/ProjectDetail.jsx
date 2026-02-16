import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { FaMapMarkerAlt, FaCalendar, FaBuilding, FaArrowLeft, FaArrowRight, FaRuler, FaLayerGroup, FaPaintBrush, FaPhone } from 'react-icons/fa';
import projectsData from '../data/projects.json';

const useDarkMode = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const dark = useDarkMode();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => {
    const found = projectsData.find(p => p.slug === slug);
    setProject(found || null);
    setLoading(false);
  }, [slug]);

  const buildAddress = (a) =>
    [a.plot && `Plot ${a.plot}`, a.road && `Road ${a.road}`, a.block && `Block ${a.block}`, a.area, a.city]
      .filter(Boolean).join(', ');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background:bg }}>
      <div style={{ width:40, height:40, border:`3px solid rgba(201,168,76,.2)`, borderTopColor:gold, borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background:bg }}>
      <p className="text-xl font-semibold" style={{ color:text }}>Project Not Found</p>
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase" style={{ color:gold }}>
        <FaArrowLeft /> Back to Projects
      </Link>
    </div>
  );

  const images = project.images?.map(i => i.url) || [];
  const fullAddress = buildAddress(project.address);

  const specItems = [
    { icon:<FaLayerGroup />, label:'Floors',         value:project.specifications?.floors },
    { icon:<FaRuler />,      label:'Area per Floor', value:project.specifications?.floorArea },
    { icon:<FaBuilding />,   label:'Type',           value:project.specifications?.type },
    { icon:<FaPaintBrush />, label:'Finish',         value:project.specifications?.finish },
  ].filter(s => s.value);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .det-root{font-family:'DM Sans',sans-serif}
        .serif{font-family:'Playfair Display',serif}
        .section-label{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem}
        .gold-divider{width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.25rem}

        .thumb{overflow:hidden;border-radius:2px;cursor:pointer;transition:transform .3s,box-shadow .3s}
        .thumb:hover{transform:scale(1.04);box-shadow:0 8px 20px rgba(0,0,0,.2)}
        .thumb img{transition:transform .4s}
        .thumb:hover img{transform:scale(1.08)}

        .info-row{display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid var(--bdr)}
        .info-row:last-child{border-bottom:none}

        .spec-item{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:2px;border:1px solid var(--bdr);transition:border-color .2s}
        .spec-item:hover{border-color:#C9A84C}

        .btn-gold{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;background:#C9A84C;color:white;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all .25s;width:100%;justify-content:center}
        .btn-gold:hover{opacity:.9;transform:translateY(-1px)}
        .btn-outline-gold{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border:2px solid #C9A84C;color:#C9A84C;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;border-radius:2px;transition:all .25s;width:100%;justify-content:center}
        .btn-outline-gold:hover{background:#C9A84C;color:white;transform:translateY(-1px)}
      `}</style>

      <div className="det-root min-h-screen" style={{ background:bg, color:text, '--bdr':bdr }}>

        {/* ── HERO BANNER ── */}
        <div className="relative h-72 md:h-96 overflow-hidden" style={{ background:dark2 }}>
          {images[0] ? (
            <img src={images[0]} alt={project.projectName} className="w-full h-full object-cover opacity-50" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaBuilding style={{ color:gold, fontSize:64, opacity:.3 }} />
            </div>
          )}
          <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(10,10,20,.95) 0%, rgba(10,10,20,.4) 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-8">
            {/* Back button */}
            <Link to="/projects" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-4 transition-opacity hover:opacity-70"
              style={{ color:gold }}>
              <FaArrowLeft /> Back to Projects
            </Link>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="serif font-black text-white" style={{ fontSize:'clamp(1.8rem,5vw,3rem)', lineHeight:1.1 }}>
                  {project.projectName}
                </h1>
                {project.company && (
                  <p className="mt-1 text-sm font-semibold" style={{ color:gold }}>{project.company}</p>
                )}
              </div>
              <span className="text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-sm"
                style={{ background: project.status==='Ongoing' ? 'rgba(201,168,76,.9)' : 'rgba(34,197,94,.85)', color:'white' }}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── LEFT / MAIN ── */}
            <div className="lg:col-span-2 space-y-10">

              {/* Gallery */}
              {images.length > 0 && (
                <div>
                  <span className="section-label">Gallery</span>
                  <div className="gold-divider" />
                  {/* Main image */}
                  <div className="thumb rounded-sm overflow-hidden mb-3 cursor-pointer" onClick={() => { setPhotoIndex(0); setLightboxOpen(true); }}>
                    <img src={images[0]} alt={project.projectName} className="w-full h-72 md:h-96 object-cover" />
                  </div>
                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="thumb aspect-square"
                          onClick={() => { setPhotoIndex(idx); setLightboxOpen(true); }}>
                          <img src={img} alt={`${project.projectName} ${idx+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <span className="section-label">Overview</span>
                <div className="gold-divider" />
                <h2 className="serif font-bold text-xl mb-4" style={{ color:text }}>Project Description</h2>
                <p className="text-sm leading-relaxed" style={{ color:sub }}>{project.description}</p>
              </div>

              {/* Specifications */}
              {specItems.length > 0 && (
                <div>
                  <span className="section-label">Details</span>
                  <div className="gold-divider" />
                  <h2 className="serif font-bold text-xl mb-5" style={{ color:text }}>Specifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {specItems.map((s, i) => (
                      <div key={i} className="spec-item" style={{ background:card }}>
                        <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 text-sm"
                          style={{ background: dark ? '#13151E' : '#F7F3EC', color:gold }}>
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color:sub }}>{s.label}</p>
                          <p className="text-sm font-semibold" style={{ color:text }}>{s.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <div className="space-y-6">

              {/* Project Info */}
              <div className="rounded-sm p-6" style={{ background:card, border:`1px solid ${bdr}` }}>
                <span className="section-label">Info</span>
                <div className="gold-divider" />
                <h3 className="serif font-bold text-lg mb-4" style={{ color:text }}>Project Information</h3>
                <div style={{ '--bdr':bdr }}>
                  {project.company && (
                    <div className="info-row">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: dark ? '#13151E' : '#F7F3EC', color:gold }}>
                        <FaBuilding size={13} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color:sub }}>Client</p>
                        <p className="text-sm font-semibold" style={{ color:text }}>{project.company}</p>
                      </div>
                    </div>
                  )}
                  <div className="info-row">
                    <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{ background: dark ? '#13151E' : '#F7F3EC', color:gold }}>
                      <FaMapMarkerAlt size={13} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color:sub }}>Location</p>
                      <p className="text-sm font-semibold" style={{ color:text }}>{fullAddress}</p>
                    </div>
                  </div>
                  {project.startDate && (
                    <div className="info-row">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: dark ? '#13151E' : '#F7F3EC', color:gold }}>
                        <FaCalendar size={13} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color:sub }}>Started</p>
                        <p className="text-sm font-semibold" style={{ color:text }}>{project.startDate}</p>
                      </div>
                    </div>
                  )}
                  {project.finishDate && (
                    <div className="info-row">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: dark ? '#13151E' : '#F7F3EC', color:gold }}>
                        <FaCalendar size={13} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color:sub }}>Completed</p>
                        <p className="text-sm font-semibold" style={{ color:text }}>{project.finishDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="rounded-sm overflow-hidden" style={{ border:`1px solid ${bdr}`, height:200 }}>
                <iframe
                  title="Project location"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3Lkw&q=${encodeURIComponent([project.address.area, project.address.city].filter(Boolean).join(', '))}`}
                  width="100%" height="100%"
                  style={{ border:0, filter: dark ? 'invert(.9) hue-rotate(180deg) saturate(.7)' : 'none' }}
                  allowFullScreen="" loading="lazy"
                />
              </div>

              {/* CTA */}
              <div className="rounded-sm p-6 relative overflow-hidden" style={{ background:dark2 }}>
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.06]" style={{ background:gold }} />
                <div className="relative z-10">
                  <h3 className="serif font-bold text-white text-lg mb-2">Interested in a Similar Project?</h3>
                  <p className="text-xs mb-5" style={{ color:'rgba(255,255,255,.5)' }}>
                    Contact us to discuss your construction needs
                  </p>
                  <div className="space-y-3">
                    <Link to="/contact" className="btn-gold">
                      Get In Touch <FaArrowRight size={11} />
                    </Link>
                    <a href="tel:+8801XXXXXXXXX" className="btn-outline-gold">
                      <FaPhone size={11} /> Call Now
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && images.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={images.map(src => ({ src }))}
            on={{ view: ({ index }) => setPhotoIndex(index) }}
          />
        )}
      </div>
    </>
  );
};

export default ProjectDetail;