import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaBuilding, FaFilter, FaTimes, FaStar, FaRegStar,
} from 'react-icons/fa';

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    Ongoing:  'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    Finished: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${map[status] ?? map.Ongoing}`}>
      {status}
    </span>
  );
};

/* ─── ProjectManager ──────────────────────────────────────── */
const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const r = await api.get('/projects?limit=200');
      setProjects(r.data.data || []);
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

  const filtered = projects.filter(p => {
    const matchSearch = p.projectName.toLowerCase().includes(search.toLowerCase()) ||
                        (p.company || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter ? p.status === filter : true;
    return matchSearch && matchFilter;
  });

  const hasFilters = search || filter;

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AdminSidebar unreadCount={0} projectCount={projects.length} />

      <main className="ml-64 flex-1 min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0D0F18]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Manage <span className="text-amber-400">Projects</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              {projects.length} total projects in database
            </p>
          </div>
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wider"
          >
            <FaPlus size={11} /> Add New Project
          </Link>
        </header>

        <div className="px-8 py-6 space-y-5">

          {/* Filters */}
          <div className="bg-[#111320] border border-white/5 rounded-2xl px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">
                  <FaSearch size={9} /> Search
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
                  <input
                    type="text"
                    placeholder="Project name or company…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-500/50 focus:bg-white/[0.07] transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors">
                      <FaTimes size={11} />
                    </button>
                  )}
                </div>
              </div>
              {/* Status filter */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">
                  <FaFilter size={9} /> Status
                </label>
                <div className="flex gap-2">
                  {[{ val: '', label: 'All' }, { val: 'Ongoing', label: 'Ongoing' }, { val: 'Finished', label: 'Finished' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilter(opt.val)}
                      className={[
                        'px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border flex-1',
                        filter === opt.val
                          ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border-transparent',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-white/30 text-xs">
                  Showing <span className="text-white font-semibold">{filtered.length}</span> of <span className="text-white font-semibold">{projects.length}</span> projects
                </span>
                <button onClick={() => { setSearch(''); setFilter(''); }} className="text-xs text-white/30 hover:text-amber-400 flex items-center gap-1.5 transition-colors font-medium">
                  <FaTimes size={9} /> Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Count (no filters) */}
          {!hasFilters && !loading && (
            <p className="text-xs text-white/20 font-medium">
              Showing all {projects.length} projects
            </p>
          )}

          {/* Table */}
          <div className="bg-[#111320] border border-white/5 rounded-2xl overflow-hidden">

            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-white/[0.02] border-b border-white/5">
              {['Thumb', 'Project', 'Company', 'Location', 'Status', 'Year', '★', 'Actions'].map((h, i) => (
                <div key={h} className={`text-[10px] font-bold uppercase tracking-widest text-white/20 ${[1, 0, 2, 2, 1, 1, 1, 2][i] === 0 ? 'col-span-1' : ''}`}
                  style={{ gridColumn: `span ${[1, 2, 2, 2, 1, 1, 1, 2][i]}` }}>
                  {h}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="p-5 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-white/5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-white/5 rounded" />
                      <div className="h-3 w-1/3 bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <FaBuilding className="text-white/20 text-xl" />
                </div>
                <p className="text-sm font-semibold text-white/40">No projects found</p>
                <p className="text-xs text-white/20 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              filtered.map(project => (
                <div
                  key={project._id}
                  className="grid grid-cols-2 md:grid-cols-12 gap-3 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="col-span-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0">
                      {project.images?.[0] ? (
                        <img src={project.images[0].url} alt={project.projectName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaBuilding className="text-amber-500/40 text-sm" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm font-semibold text-white truncate">{project.projectName}</p>
                    <p className="text-xs text-white/30 md:hidden mt-0.5 truncate">{project.company}</p>
                  </div>

                  {/* Company */}
                  <div className="hidden md:block md:col-span-2">
                    <p className="text-xs text-white/40 truncate">{project.company}</p>
                  </div>

                  {/* Location */}
                  <div className="hidden md:block md:col-span-2">
                    <p className="text-xs text-white/40 truncate">
                      {[project.address?.area, project.address?.city].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block md:col-span-1">
                    <StatusBadge status={project.status} />
                  </div>

                  {/* Year */}
                  <div className="hidden md:block md:col-span-1">
                    <p className="text-xs text-white/30">
                      {project.startDate ? new Date(project.startDate).getFullYear() : '—'}
                    </p>
                  </div>

                  {/* Featured */}
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    {project.featured
                      ? <FaStar className="text-amber-400" size={13} />
                      : <FaRegStar className="text-white/10" size={13} />}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end md:justify-start items-center gap-1.5">
                    <Link
                      to={`/projects/${project.slug}`}
                      target="_blank"
                      title="View live"
                      className="w-8 h-8 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 flex items-center justify-center transition-all hover:-translate-y-0.5"
                    >
                      <FaEye size={12} />
                    </Link>
                    <Link
                      to={`/admin/projects/edit/${project._id}`}
                      title="Edit"
                      className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:-translate-y-0.5"
                    >
                      <FaEdit size={12} />
                    </Link>
                    <button
                      onClick={() => handleDelete(project._id, project.projectName)}
                      disabled={deleting === project._id}
                      title="Delete"
                      className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {deleting === project._id
                        ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <FaTrash size={12} />}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && filtered.length > 0 && (
            <p className="text-xs text-white/20">★ = Featured on home page</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectManager;