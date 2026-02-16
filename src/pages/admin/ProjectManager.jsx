import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaBuilding, FaFilter, FaTimes, FaStar, FaRegStar,
} from 'react-icons/fa';

const useDarkMode = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const ProjectManager = () => {
  const dark = useDarkMode();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('');
  const [deleting, setDeleting]   = useState(null);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const inp   = dark ? '#13151E' : '#FAFAFA';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const r = await api.get('/projects?limit=200');
      setProjects(r.data.data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProjects = projects.filter(p => {
    const ms = p.projectName.toLowerCase().includes(search.toLowerCase()) ||
               (p.company || '').toLowerCase().includes(search.toLowerCase());
    const mf = filter ? p.status === filter : true;
    return ms && mf;
  });

  const hasFilters = search || filter;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .adm-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }
        .section-label { font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem; }
        .gold-divider { width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.25rem; }

        .filter-input {
          width:100%;padding:10px 14px;border-radius:2px;font-size:13px;outline:none;
          font-family:'DM Sans',sans-serif;border:1px solid var(--bdr);
          background:var(--inp);color:var(--txt);transition:border-color .2s,box-shadow .2s;
        }
        .filter-input:focus { border-color:#C9A84C; box-shadow:0 0 0 3px rgba(201,168,76,.12); }
        .filter-input option { background:var(--inp);color:var(--txt); }

        .proj-row { border-bottom:1px solid var(--bdr); transition:background .15s; }
        .proj-row:hover { background:var(--row-hover); }
        .proj-row:last-child { border-bottom:none; }

        .action-btn { width:34px;height:34px;border-radius:2px;display:flex;align-items:center;justify-content:center;transition:all .2s;cursor:pointer; }
        .action-btn:hover { transform:translateY(-1px); }

        .btn-gold {
          display:inline-flex;align-items:center;gap:8px;
          padding:11px 22px;background:#C9A84C;color:white;
          font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;
          border-radius:2px;transition:all .25s;
        }
        .btn-gold:hover { opacity:.9;transform:translateY(-1px); }

        .status-badge {
          display:inline-block;padding:3px 10px;border-radius:2px;
          font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
        }

        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-600px 0}100%{background-position:600px 0} }
        .skeleton { background:linear-gradient(90deg,var(--sk1) 25%,var(--sk2) 50%,var(--sk1) 75%);background-size:1200px 100%;animation:shimmer 1.4s infinite linear; }
        .spinner { width:32px;height:32px;border:3px solid rgba(201,168,76,.2);border-top-color:#C9A84C;border-radius:50%;animation:spin .7s linear infinite; }
      `}</style>

      <div className="adm-root min-h-screen"
        style={{ background:bg, color:text, '--bdr':bdr, '--inp':inp, '--txt':text,
                 '--row-hover': dark ? 'rgba(201,168,76,.04)' : 'rgba(201,168,76,.03)',
                 '--sk1': dark?'#1C1E2A':'#F0EDE8', '--sk2': dark?'#252838':'#E8E4DC' }}>

        {/* ── PAGE HEADER ── */}
        <div className="border-b" style={{ background:dark2, borderColor:bdr }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="section-label">Admin Panel</span>
                <h1 className="serif font-black text-white" style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)' }}>
                  Manage <span style={{ color:gold }}>Projects</span>
                </h1>
                <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,.4)' }}>
                  {projects.length} total projects in database
                </p>
              </div>
              <Link to="/admin/projects/new" className="btn-gold flex-shrink-0">
                <FaPlus size={11} /> Add New Project
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

          {/* ── FILTERS ── */}
          <div className="rounded-sm p-5 mb-6 shadow-sm" style={{ background:card, border:`1px solid ${bdr}` }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                  <FaSearch size={9} /> Search
                </label>
                <input type="text" placeholder="Name or company…" value={search}
                  onChange={e => setSearch(e.target.value)} className="filter-input" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                  <FaFilter size={9} /> Status
                </label>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="filter-input">
                  <option value="">All Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
            </div>
            {hasFilters && (
              <div className="mt-3 pt-3" style={{ borderTop:`1px solid ${bdr}` }}>
                <button onClick={() => { setSearch(''); setFilter(''); }}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color:gold }}>
                  <FaTimes size={10} /> Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* ── COUNT ── */}
          <div className="mb-4 text-xs font-bold tracking-widest uppercase" style={{ color:sub }}>
            {loading ? 'Loading…' : `Showing ${filteredProjects.length} of ${projects.length} projects`}
          </div>

          {/* ── TABLE ── */}
          <div className="rounded-sm overflow-hidden shadow-sm" style={{ background:card, border:`1px solid ${bdr}` }}>

            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-[10px] font-bold tracking-widest uppercase"
              style={{ background: dark ? '#13151E' : '#F7F3EC', color:sub, borderBottom:`1px solid ${bdr}` }}>
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Project</div>
              <div className="col-span-2">Company</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-center">★</div>
              <div className="col-span-1 text-center">Actions</div>
            </div>

            {loading ? (
              <div className="space-y-px">
                {[...Array(5)].map((_,i) => (
                  <div key={i} className="px-5 py-4 flex items-center gap-4">
                    <div className="skeleton rounded w-12 h-12 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton rounded h-4 w-2/3" />
                      <div className="skeleton rounded h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="py-20 text-center">
                <FaBuilding className="mx-auto mb-3 text-4xl" style={{ color:bdr }} />
                <p className="text-sm font-semibold mb-1" style={{ color:text }}>No projects found</p>
                <p className="text-xs" style={{ color:sub }}>Try adjusting your filters</p>
              </div>
            ) : (
              filteredProjects.map(project => (
                <div key={project._id}
                  className="proj-row grid grid-cols-2 md:grid-cols-12 gap-4 px-5 py-4 items-center">

                  {/* Thumbnail */}
                  <div className="col-span-1">
                    <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0"
                      style={{ background: dark ? '#1A1A2E' : '#E8E4DC' }}>
                      {project.images?.[0] ? (
                        <img src={project.images[0].url} alt={project.projectName}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaBuilding style={{ color:gold, fontSize:14 }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-span-1 md:col-span-3">
                    <p className="text-sm font-bold line-clamp-1" style={{ color:text }}>{project.projectName}</p>
                    <p className="text-xs md:hidden mt-0.5" style={{ color:sub }}>{project.company}</p>
                  </div>

                  {/* Company */}
                  <div className="hidden md:block md:col-span-2">
                    <p className="text-xs line-clamp-1" style={{ color:sub }}>{project.company}</p>
                  </div>

                  {/* Location */}
                  <div className="hidden md:block md:col-span-2">
                    <p className="text-xs" style={{ color:sub }}>
                      {[project.address?.area, project.address?.city].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block md:col-span-1">
                    <span className="status-badge"
                      style={{
                        background: project.status==='Ongoing' ? 'rgba(201,168,76,.15)' : 'rgba(34,197,94,.15)',
                        color: project.status==='Ongoing' ? gold : '#22C55E',
                      }}>
                      {project.status}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block md:col-span-1">
                    <p className="text-xs" style={{ color:sub }}>
                      {project.startDate
                        ? new Date(project.startDate).getFullYear()
                        : '—'}
                    </p>
                  </div>

                  {/* Featured star */}
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    {project.featured
                      ? <FaStar style={{ color:gold }} size={14} />
                      : <FaRegStar style={{ color:bdr }} size={14} />}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 md:col-span-1 flex justify-end md:justify-center items-center gap-1">
                    <Link to={`/projects/${project.slug}`} target="_blank"
                      className="action-btn" title="View live"
                      style={{ background: dark?'#13151E':'#F0F9FF', color:'#38BDF8' }}>
                      <FaEye size={13} />
                    </Link>
                    <Link to={`/admin/projects/edit/${project._id}`}
                      className="action-btn" title="Edit"
                      style={{ background: dark?'#13151E':'#F0FDF4', color:'#22C55E' }}>
                      <FaEdit size={13} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id, project.projectName)}
                      disabled={deleting === project._id}
                      className="action-btn" title="Delete"
                      style={{ background: dark?'#13151E':'#FFF1F2', color:'#EF4444' }}>
                      {deleting === project._id
                        ? <div style={{ width:13,height:13,border:'2px solid #EF4444',borderTopColor:'transparent',borderRadius:'50%',animation:'spin .6s linear infinite' }} />
                        : <FaTrash size={13} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── FOOTER COUNT ── */}
          {!loading && filteredProjects.length > 0 && (
            <div className="mt-4 text-xs" style={{ color:sub }}>
              ★ = Featured on home page
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectManager;