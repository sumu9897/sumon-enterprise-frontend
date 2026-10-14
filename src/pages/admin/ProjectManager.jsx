import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { getApiErrorMessage } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { PROJECT_STATUSES, getProjectStatus } from '../../constants/projectStatuses';
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaBuilding, FaFilter, FaTimes, FaStar, FaRegStar,
} from 'react-icons/fa';

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const meta = getProjectStatus(status);
  return (
    <span className={`inline-block rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${meta.badgeClass}`}>
      {status}
    </span>
  );
};

/* ─── ProjectManager ──────────────────────────────────────── */
const ProjectManager = () => {
  const { can } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedStatus = searchParams.get('status');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState(() => (
    PROJECT_STATUSES.some((status) => status.value === requestedStatus) ? requestedStatus : ''
  ));
  const [deleting, setDeleting] = useState(null);
  const [togglingFeatured, setTogglingFeatured] = useState(() => new Set());
  const [updatingStatus, setUpdatingStatus] = useState(null);

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

  const handleFeaturedToggle = async (project) => {
    if (togglingFeatured.has(project._id)) return;
    const nextFeatured = !project.featured;

    setProjects((current) => current.map((item) => (
      item._id === project._id ? { ...item, featured: nextFeatured } : item
    )));
    setTogglingFeatured((current) => new Set(current).add(project._id));

    try {
      const response = await api.put(`/projects/${project._id}`, { featured: nextFeatured });
      setProjects((current) => current.map((item) => (
        item._id === project._id ? { ...item, ...response.data.data } : item
      )));
      toast.success(nextFeatured ? 'Project added to featured list.' : 'Project removed from featured list.', {
        toastId: `featured-${project._id}`,
      });
    } catch (error) {
      setProjects((current) => current.map((item) => (
        item._id === project._id ? { ...item, featured: project.featured } : item
      )));
      toast.error(getApiErrorMessage(error, 'Featured status could not be updated.'), {
        toastId: `featured-error-${project._id}`,
      });
    } finally {
      setTogglingFeatured((current) => {
        const next = new Set(current);
        next.delete(project._id);
        return next;
      });
    }
  };

  const handleStatusChange = async (project, status) => {
    const previousStatus = project.status;
    setProjects((current) => current.map((item) => item._id === project._id ? { ...item, status } : item));
    setUpdatingStatus(project._id);
    try {
      await api.put(`/projects/${project._id}`, { status });
      toast.success('Project status updated.', { toastId: `status-${project._id}` });
    } catch (error) {
      setProjects((current) => current.map((item) => item._id === project._id ? { ...item, status: previousStatus } : item));
      toast.error(getApiErrorMessage(error, 'Project status could not be updated.'), { toastId: `status-error-${project._id}` });
    } finally {
      setUpdatingStatus(null);
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

      <main className="min-w-0 flex-1 pt-16 md:ml-64 md:pt-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#0D0F18]/80 px-4 py-4 backdrop-blur-xl sm:px-8">
          <div>
            <h1 className="font-bold text-xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Manage <span className="text-amber-400">Projects</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              {projects.length} total projects in database
            </p>
          </div>
          {can('projects.create') && <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wider"
          >
            <FaPlus size={11} /> Add New Project
          </Link>}
        </header>

        <div className="space-y-5 px-4 py-6 sm:px-8">

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
                <div className="flex flex-wrap gap-2">
                  {[{ value: '', label: 'All' }, ...PROJECT_STATUSES].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setFilter(opt.value)}
                      className={[
                        'min-w-[110px] flex-1 rounded-xl border px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all',
                        filter === opt.value
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
                    {(can('projects.status') || can('projects.update')) ? (
                      <select value={project.status} disabled={updatingStatus === project._id} onChange={(event) => handleStatusChange(project, event.target.value)} className="max-w-full rounded-lg border border-white/10 bg-[#171A27] px-2 py-1 text-[10px] text-white outline-none focus:border-amber-400/50">
                        {PROJECT_STATUSES.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                      </select>
                    ) : <StatusBadge status={project.status} />}
                  </div>

                  {/* Year */}
                  <div className="hidden md:block md:col-span-1">
                    <p className="text-xs text-white/30">
                      {project.startDate ? new Date(project.startDate).getFullYear() : '—'}
                    </p>
                  </div>

                  {/* Featured */}
                  <div className="hidden md:flex md:col-span-1 justify-center">
                    {can('projects.update') && (
                    <button
                      type="button"
                      onClick={() => handleFeaturedToggle(project)}
                      disabled={togglingFeatured.has(project._id)}
                      aria-pressed={Boolean(project.featured)}
                      aria-label={project.featured ? `Remove ${project.projectName} from featured projects` : `Add ${project.projectName} to featured projects`}
                      title={project.featured ? 'Remove from featured projects' : 'Add to featured projects'}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:scale-110 hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50 disabled:cursor-wait disabled:opacity-50"
                    >
                      {project.featured
                        ? <FaStar className="text-amber-400" size={15} />
                        : <FaRegStar className="text-white/20" size={15} />}
                    </button>
                    )}
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
                    {can('projects.update') && <Link
                      to={`/admin/projects/edit/${project._id}`}
                      title="Edit"
                      className="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-all hover:-translate-y-0.5"
                    >
                      <FaEdit size={12} />
                    </Link>}
                    {can('projects.delete') && <button
                      onClick={() => handleDelete(project._id, project.projectName)}
                      disabled={deleting === project._id}
                      title="Delete"
                      className="w-8 h-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-all hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      {deleting === project._id
                        ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                        : <FaTrash size={12} />}
                    </button>}
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
