import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaBuilding, FaArrowRight, FaTimes } from 'react-icons/fa';
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

const Projects = () => {
  const dark = useDarkMode();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', company: '', search: '' });
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const inp   = dark ? '#13151E' : '#FAFAFA';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => { fetchProjects(); }, [filters, pagination.page]);

  const fetchProjects = () => {
    setLoading(true);
    const filtered = projectsData.filter(p => {
      const ms = !filters.status  || p.status.toLowerCase() === filters.status.toLowerCase();
      const mc = !filters.company || (p.company && p.company.toLowerCase().includes(filters.company.toLowerCase()));
      const mq = !filters.search  ||
        p.projectName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (p.company && p.company.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.address.area && p.address.area.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.address.city && p.address.city.toLowerCase().includes(filters.search.toLowerCase()));
      return ms && mc && mq;
    });
    const total = filtered.length;
    const pages = Math.ceil(total / pagination.limit);
    const start = (pagination.page - 1) * pagination.limit;
    setProjects(filtered.slice(start, start + pagination.limit));
    setPagination(prev => ({ ...prev, total, pages }));
    setLoading(false);
  };

  const handleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  const clearFilters = () => {
    setFilters({ status: '', company: '', search: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };
  const handlePage = n => {
    setPagination(prev => ({ ...prev, page: n }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasFilters = filters.status || filters.company || filters.search;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .proj-root{font-family:'DM Sans',sans-serif}
        .serif{font-family:'Playfair Display',serif}
        .section-label{font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem}
        .gold-divider{width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.25rem}
        .gold-divider.center{margin-left:auto;margin-right:auto}
        .proj-card{border:1px solid var(--bdr);transition:transform .3s,box-shadow .3s,border-color .3s}
        .proj-card:hover{transform:translateY(-6px);box-shadow:0 20px 45px rgba(0,0,0,.15);border-color:#C9A84C}
        .proj-card:hover .proj-img{transform:scale(1.07)}
        .proj-img{transition:transform .5s ease}
        .filter-input{width:100%;padding:10px 14px;border-radius:2px;font-size:13px;outline:none;font-family:'DM Sans',sans-serif;border:1px solid var(--bdr);background:var(--inp);color:var(--txt);transition:border-color .2s,box-shadow .2s}
        .filter-input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.12)}
        .hero-proj{clip-path:polygon(0 0,100% 0,100% 88%,0 100%);padding-bottom:80px}
        .page-btn{width:40px;height:40px;border-radius:2px;font-size:13px;font-weight:700;transition:all .2s;cursor:pointer}
        .page-btn:disabled{opacity:.4;cursor:not-allowed}
        .spinner{width:36px;height:36px;border:3px solid rgba(201,168,76,.2);border-top-color:#C9A84C;border-radius:50%;animation:spin .7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .6s ease forwards}
        .d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.25s;opacity:0}.d3{animation-delay:.4s;opacity:0}
      `}</style>

      <div className="proj-root min-h-screen" style={{ background:bg, color:text, '--bdr':bdr, '--inp':inp, '--txt':text }}>

        {/* ── HERO ── */}
        <section className="hero-proj relative overflow-hidden pt-20" style={{ background:dark2 }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage:'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600")', backgroundSize:'cover', backgroundPosition:'center' }} />
          <div className="absolute left-0 top-0 h-full w-1" style={{ background:`linear-gradient(180deg,transparent,${gold},transparent)` }} />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pb-20">
            <span className="section-label fade-up d1">Portfolio</span>
            <div className="gold-divider center fade-up d1" />
            <h1 className="serif font-black text-white fade-up d2" style={{ fontSize:'clamp(2.5rem,6vw,4rem)', lineHeight:1.1 }}>
              Our <span style={{ color:gold }}>Projects</span>
            </h1>
            <p className="mt-4 text-base max-w-xl mx-auto fade-up d3" style={{ color:'rgba(255,255,255,.5)' }}>
              Completed and ongoing construction projects across Bangladesh
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 pb-24 relative z-10">

          {/* ── FILTERS ── */}
          <div className="rounded-sm p-6 mb-8 shadow-lg" style={{ background:card, border:`1px solid ${bdr}` }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                  <FaFilter size={10} /> Status
                </label>
                <select value={filters.status} onChange={e => handleFilter('status', e.target.value)} className="filter-input">
                  <option value="">All Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                  <FaBuilding size={10} /> Company
                </label>
                <input type="text" placeholder="Filter by company…" value={filters.company}
                  onChange={e => handleFilter('company', e.target.value)} className="filter-input" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                  <FaSearch size={10} /> Search
                </label>
                <input type="text" placeholder="Name, city, area…" value={filters.search}
                  onChange={e => handleFilter('search', e.target.value)} className="filter-input" />
              </div>
            </div>
            {hasFilters && (
              <div className="mt-4 pt-4" style={{ borderTop:`1px solid ${bdr}` }}>
                <button onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color:gold }}>
                  <FaTimes size={10} /> Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* ── COUNT ── */}
          <div className="mb-6 text-xs font-bold tracking-widest uppercase" style={{ color:sub }}>
            {loading ? 'Loading…' : `Showing ${projects.length} of ${pagination.total} projects`}
          </div>

          {/* ── GRID ── */}
          {loading ? (
            <div className="flex justify-center py-24"><div className="spinner" /></div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <FaBuilding className="mx-auto mb-4 text-5xl" style={{ color:bdr }} />
              <p className="text-lg font-semibold mb-2" style={{ color:text }}>No projects found</p>
              <p className="text-sm mb-6" style={{ color:sub }}>Try adjusting your filters</p>
              <button onClick={clearFilters}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase"
                style={{ color:gold }}>
                <FaTimes size={10} /> Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <Link key={p.id} to={`/projects/${p.slug}`}
                    className="proj-card rounded-sm overflow-hidden block" style={{ background:card }}>
                    <div className="aspect-video overflow-hidden relative"
                      style={{ background: dark ? '#1A1A2E' : '#E8E4DC' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0].url} alt={p.projectName} className="proj-img w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <FaBuilding style={{ color:gold, fontSize:28 }} />
                          <span className="text-xs tracking-widest uppercase" style={{ color:sub }}>No Image</span>
                        </div>
                      )}
                      <span className="absolute top-3 right-3 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm"
                        style={{ background: p.status==='Ongoing' ? 'rgba(201,168,76,.92)' : 'rgba(34,197,94,.85)', color:'white' }}>
                        {p.status}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="serif font-bold text-base mb-1 line-clamp-1" style={{ color:text }}>{p.projectName}</h3>
                      {p.company && <p className="text-xs font-semibold mb-1" style={{ color:gold }}>{p.company}</p>}
                      <p className="text-xs mb-1" style={{ color:sub }}>
                        {[p.address.area, p.address.city].filter(Boolean).join(', ')}
                      </p>
                      {p.address.plot && (
                        <p className="text-xs mb-3" style={{ color:sub, opacity:.7 }}>
                          Plot {p.address.plot}{p.address.road && `, Road ${p.address.road}`}{p.address.block && `, Block ${p.address.block}`}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 mt-2" style={{ borderTop:`1px solid ${bdr}` }}>
                        <span className="text-xs font-semibold" style={{ color:sub }}>{p.specifications?.floors}</span>
                        <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-1" style={{ color:gold }}>
                          View <FaArrowRight size={9} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                  <button onClick={() => handlePage(pagination.page-1)} disabled={pagination.page===1}
                    className="page-btn" style={{ background:card, color:text, border:`1px solid ${bdr}` }}>←</button>
                  {[...Array(pagination.pages)].map((_,i) => (
                    <button key={i} onClick={() => handlePage(i+1)}
                      className="page-btn"
                      style={{ background: pagination.page===i+1 ? gold : card, color: pagination.page===i+1 ? 'white' : text, border:`1px solid ${pagination.page===i+1 ? gold : bdr}` }}>
                      {i+1}
                    </button>
                  ))}
                  <button onClick={() => handlePage(pagination.page+1)} disabled={pagination.page===pagination.pages}
                    className="page-btn" style={{ background:card, color:text, border:`1px solid ${bdr}` }}>→</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;