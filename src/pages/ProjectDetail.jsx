import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import {
  FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaArrowLeft,
  FaRulerCombined, FaLayerGroup, FaHammer, FaArrowRight,
  FaPhoneAlt, FaExpand,
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

const buildAddress = (addr) => {
  if (!addr) return '';
  return [
    addr.plot  ? `Plot-${addr.plot}`  : '',
    addr.road  ? `Road-${addr.road}`  : '',
    addr.block ? `Block-${addr.block}`: '',
    addr.area  || '',
    addr.city  || '',
  ].filter(Boolean).join(', ');
};

const fmtDate = (d) => {
  if (!d) return null;
  try {
    return new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'long' });
  } catch { return String(d); }
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const dark = useDarkMode();
  const [project, setProject]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [lbOpen, setLbOpen]       = useState(false);
  const [lbIndex, setLbIndex]     = useState(0);
  const [activeImg, setActiveImg] = useState(0);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const r = await api.get(`/projects/slug/${slug}`);
        setProject(r.data.data);
      } catch {
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  /* Loading */
  if (loading) return (
    <>
      <style>{`
        @keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
        .sk{background:linear-gradient(90deg,${dark?'#1C1E2A':'#F0EDE8'} 25%,${dark?'#252838':'#E8E4DC'} 50%,${dark?'#1C1E2A':'#F0EDE8'} 75%);background-size:1200px 100%;animation:shimmer 1.4s infinite linear;}
      `}</style>
      <div style={{ background:bg, minHeight:'100vh' }}>
        <div style={{ height:360, background:dark2 }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="sk rounded" style={{ height:380 }} />
            <div className="grid grid-cols-4 gap-2">{[...Array(4)].map((_,i)=><div key={i} className="sk rounded" style={{ height:80 }} />)}</div>
          </div>
          <div className="space-y-4">
            <div className="sk rounded" style={{ height:220 }} />
            <div className="sk rounded" style={{ height:260 }} />
          </div>
        </div>
      </div>
    </>
  );

  /* Not found */
  if (!project) return (
    <div style={{ background:bg, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <FaBuilding style={{ fontSize:48, color:gold, opacity:.4 }} />
      <h2 style={{ color:text, fontFamily:'Playfair Display, serif', fontSize:28 }}>Project Not Found</h2>
      <Link to="/projects" style={{ color:gold, fontWeight:700, fontSize:12, letterSpacing:'.15em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}>
        <FaArrowLeft size={11} /> Back to Projects
      </Link>
    </div>
  );

  const imgUrls = project.images?.map(img => img.url) || [];
  const slides  = imgUrls.map(src => ({ src }));
  const address = buildAddress(project.address);
  const lat = project.location?.coordinates?.[1];
  const lng = project.location?.coordinates?.[0];
  const hasGPS = lat && lng && parseFloat(lat) !== 0 && parseFloat(lng) !== 0;

  /* Map embed URL — GPS preferred, fallback to area search */
  const mapSrc = hasGPS
    ? `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent([project.address?.area, project.address?.city].filter(Boolean).join(', '))}&output=embed`;

  const mapsLink = hasGPS
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

  const specs = [
    { icon:<FaLayerGroup />,    label:'Floors',            val:project.specifications?.floors },
    { icon:<FaRulerCombined />, label:'Area / Floor',      val:project.specifications?.areaPerFloor },
    { icon:<FaRulerCombined />, label:'Total Area',        val:project.specifications?.totalArea },
    { icon:<FaHammer />,        label:'Construction Type', val:project.specifications?.constructionType },
  ].filter(s => s.val);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .pd-root { font-family:'DM Sans',sans-serif; }
        .serif   { font-family:'Playfair Display',serif; }
        .sl  { font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem; }
        .gdv { width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.25rem; }

        .hero-wrap { position:relative;overflow:hidden;min-height:360px;display:flex;flex-direction:column;justify-content:flex-end; }
        .hero-img  { position:absolute;inset:0;background-size:cover;background-position:center;transition:transform 8s ease; }
        .hero-img:hover { transform:scale(1.03); }
        .hero-ov   { position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.35) 55%,rgba(0,0,0,.15) 100%); }

        .thumb { cursor:pointer;border-radius:2px;overflow:hidden;border:2px solid transparent;transition:all .2s; }
        .thumb.active { border-color:#C9A84C; }
        .thumb:hover  { border-color:rgba(201,168,76,.55); }
        .thumb img    { width:100%;height:100%;object-fit:cover;display:block; }

        .spec-c { border:1px solid var(--bdr);transition:border-color .2s,box-shadow .2s; }
        .spec-c:hover { border-color:#C9A84C;box-shadow:0 4px 20px rgba(201,168,76,.1); }

        .irow { display:flex;align-items:flex-start;gap:12px;padding:14px 0;border-bottom:1px solid var(--bdr); }
        .irow:last-child { border-bottom:none; }

        .btn-g {
          display:inline-flex;align-items:center;gap:8px;
          padding:13px 22px;background:#C9A84C;color:white;
          font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
          border-radius:2px;transition:all .25s;
        }
        .btn-g:hover { opacity:.9;transform:translateY(-1px); }
        .btn-og {
          display:inline-flex;align-items:center;gap:8px;
          padding:11px 22px;border:2px solid #C9A84C;color:#C9A84C;
          font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
          border-radius:2px;transition:all .25s;
        }
        .btn-og:hover { background:#C9A84C;color:white;transform:translateY(-1px); }

        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
        .fu  { animation:fadeUp .5s ease forwards; }
        .d1  { animation-delay:.05s;opacity:0; }
        .d2  { animation-delay:.15s;opacity:0; }
        .d3  { animation-delay:.28s;opacity:0; }

        .yarl__container { background:rgba(0,0,0,.96)!important; }
      `}</style>

      <div className="pd-root min-h-screen" style={{ background:bg, color:text, '--bdr':bdr }}>

        {/* ══ HERO ══ */}
        <div className="hero-wrap">
          {imgUrls[activeImg] && (
            <div className="hero-img" style={{ backgroundImage:`url(${imgUrls[activeImg]})` }} />
          )}
          {!imgUrls[activeImg] && <div className="hero-img" style={{ background:dark2 }} />}
          <div className="hero-ov" />

          {/* Back */}
          <div className="absolute top-6 left-6 z-20">
            <Link to="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all hover:gap-3"
              style={{ color:'rgba(255,255,255,.75)' }}>
              <FaArrowLeft size={11} /> Back to Projects
            </Link>
          </div>

          {/* Fullscreen */}
          {imgUrls.length > 0 && (
            <button onClick={() => { setLbIndex(activeImg); setLbOpen(true); }}
              className="absolute top-6 right-6 z-20 w-10 h-10 rounded-sm flex items-center justify-center transition-all hover:scale-110"
              style={{ background:'rgba(0,0,0,.5)', color:'white', border:'1px solid rgba(255,255,255,.2)' }}>
              <FaExpand size={14} />
            </button>
          )}

          {/* Title */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-10 w-full">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold mb-1 fu d1" style={{ color:gold }}>{project.company}</p>
                <h1 className="serif font-black text-white fu d2"
                  style={{ fontSize:'clamp(1.8rem,4vw,3rem)', lineHeight:1.1, textShadow:'0 2px 20px rgba(0,0,0,.5)' }}>
                  {project.projectName}
                </h1>
                <div className="flex items-center gap-2 mt-2 fu d3">
                  <FaMapMarkerAlt style={{ color:gold }} size={11} />
                  <span className="text-sm" style={{ color:'rgba(255,255,255,.65)' }}>{address}</span>
                </div>
              </div>
              <span className="fu d3 text-[10px] font-bold tracking-widest uppercase px-3 py-2 rounded-sm flex-shrink-0"
                style={{ background:project.status==='Ongoing'?'rgba(201,168,76,.9)':'rgba(34,197,94,.85)', color:'white' }}>
                {project.status}
              </span>
            </div>
          </div>
        </div>

        {/* ══ BODY ══ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* ── MAIN LEFT ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* Image gallery */}
              {imgUrls.length > 0 && (
                <div>
                  <div className="relative rounded-sm overflow-hidden cursor-zoom-in mb-3"
                    style={{ background:dark?'#1A1A2E':'#E8E4DC' }}
                    onClick={() => { setLbIndex(activeImg); setLbOpen(true); }}>
                    <img src={imgUrls[activeImg]} alt={project.projectName}
                      className="w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      style={{ height:'clamp(220px,42vw,440px)' }} />
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-sm text-xs font-bold"
                      style={{ background:'rgba(0,0,0,.6)', color:'white' }}>
                      {activeImg+1} / {imgUrls.length}
                    </div>
                  </div>
                  {imgUrls.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {imgUrls.map((url,i) => (
                        <div key={i} className={`thumb h-16 ${i===activeImg?'active':''}`}
                          onClick={() => setActiveImg(i)}>
                          <img src={url} alt={`${project.projectName} ${i+1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="rounded-sm p-6" style={{ background:card, border:`1px solid ${bdr}` }}>
                <span className="sl">About this Project</span>
                <div className="gdv" />
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color:sub }}>
                  {project.description}
                </p>
              </div>

              {/* Specs */}
              {specs.length > 0 && (
                <div>
                  <span className="sl">Specifications</span>
                  <div className="gdv" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {specs.map((s,i) => (
                      <div key={i} className="spec-c rounded-sm p-5 text-center"
                        style={{ background:card }}>
                        <div className="w-10 h-10 rounded-sm flex items-center justify-center text-lg mx-auto mb-3"
                          style={{ background:dark?'#13151E':'#F7F3EC', color:gold }}>{s.icon}</div>
                        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color:sub }}>{s.label}</p>
                        <p className="text-sm font-bold serif" style={{ color:text }}>{s.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR RIGHT ── */}
            <div className="space-y-6">

              {/* Project info */}
              <div className="rounded-sm p-6" style={{ background:card, border:`1px solid ${bdr}` }}>
                <span className="sl">Project Info</span>
                <div className="gdv" />
                <div>
                  {[
                    { icon:<FaBuilding size={13} />,    label:'Client',      val:project.company },
                    { icon:<FaMapMarkerAlt size={13} />, label:'Location',   val:address || '—' },
                    { icon:<FaCalendarAlt size={13} />,  label:'Start Date', val:fmtDate(project.startDate) || '—' },
                    project.finishDate
                      ? { icon:<FaCalendarAlt size={13} />, label:'Finish Date', val:fmtDate(project.finishDate) }
                      : null,
                  ].filter(Boolean).map((row,i) => (
                    <div key={i} className="irow">
                      <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                        style={{ background:dark?'#13151E':'#F7F3EC', color:gold }}>
                        {row.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color:sub }}>{row.label}</p>
                        <p className="text-sm font-semibold mt-0.5" style={{ color:text }}>{row.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── LIVE MAP ── */}
              <div className="rounded-sm overflow-hidden" style={{ background:card, border:`1px solid ${bdr}` }}>
                <div className="px-5 pt-5 pb-4">
                  <span className="sl">Location Map</span>
                  <div className="gdv" style={{ marginBottom:0 }} />
                </div>

                {(hasGPS || project.address?.area) ? (
                  <>
                    <iframe
                      key={mapSrc}
                      title="Project location"
                      src={mapSrc}
                      width="100%"
                      height="250"
                      style={{
                        border:0, display:'block',
                        filter: dark ? 'invert(.88) hue-rotate(180deg) saturate(.7)' : 'none',
                      }}
                      loading="lazy"
                      allowFullScreen
                    />
                    <div className="px-5 py-3 flex items-center justify-between"
                      style={{ borderTop:`1px solid ${bdr}` }}>
                      <p className="text-xs" style={{ color:sub }}>
                        {hasGPS ? 'GPS coordinates' : 'Area search'}
                      </p>
                      <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:gap-2.5"
                        style={{ color:gold }}>
                        Open Maps <FaArrowRight size={9} />
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                    <FaMapMarkerAlt className="mb-2 text-3xl" style={{ color:bdr }} />
                    <p className="text-sm font-semibold" style={{ color:text }}>No location set</p>
                    <p className="text-xs mt-1" style={{ color:sub }}>Add GPS coordinates in admin panel</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="rounded-sm p-6 relative overflow-hidden"
                style={{ background:dark2, border:`1px solid rgba(201,168,76,.2)` }}>
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.05]" style={{ background:gold }} />
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background:`linear-gradient(90deg,transparent,${gold},transparent)` }} />
                <p className="sl">Interested?</p>
                <h3 className="serif font-bold text-white text-lg mb-2">Start a Similar Project</h3>
                <p className="text-xs mb-5" style={{ color:'rgba(255,255,255,.5)' }}>
                  Contact us to discuss your construction needs
                </p>
                <div className="flex flex-col gap-2">
                  <Link to="/contact" className="btn-g justify-center">
                    Get In Touch <FaArrowRight size={11} />
                  </Link>
                  <a href="tel:+8801XXXXXXXXX" className="btn-og justify-center">
                    <FaPhoneAlt size={11} /> Call Us
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── LIGHTBOX ── */}
        {lbOpen && slides.length > 0 && (
          <Lightbox
            open={lbOpen}
            close={() => setLbOpen(false)}
            slides={slides}
            index={lbIndex}
          />
        )}
      </div>
    </>
  );
};

export default ProjectDetail;