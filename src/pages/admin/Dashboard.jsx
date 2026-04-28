import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import { toast } from 'react-toastify';

import {
  FaProjectDiagram, FaCheckCircle, FaClock, FaEnvelope,
  FaEnvelopeOpen, FaArrowRight, FaPlus, FaChartLine,
  FaUser, FaBell,
} from 'react-icons/fa';

/* ─── Stat Card ───────────────────────────────────────────── */
const StatCard = ({ title, value, icon, to, color }) => {
  const schemes = {
    blue:   { border: 'hover:border-blue-500/30',    iconBg: 'bg-blue-500/10',    iconHover: 'group-hover:bg-blue-500/20',    iconText: 'text-blue-400',    bar: 'bg-blue-500/50',    arrow: 'group-hover:text-blue-400'    },
    amber:  { border: 'hover:border-amber-500/30',   iconBg: 'bg-amber-500/10',   iconHover: 'group-hover:bg-amber-500/20',   iconText: 'text-amber-400',   bar: 'bg-amber-500/50',   arrow: 'group-hover:text-amber-400'   },
    green:  { border: 'hover:border-emerald-500/30', iconBg: 'bg-emerald-500/10', iconHover: 'group-hover:bg-emerald-500/20', iconText: 'text-emerald-400', bar: 'bg-emerald-500/50', arrow: 'group-hover:text-emerald-400' },
    purple: { border: 'hover:border-purple-500/30',  iconBg: 'bg-purple-500/10',  iconHover: 'group-hover:bg-purple-500/20',  iconText: 'text-purple-400',  bar: 'bg-purple-500/50',  arrow: 'group-hover:text-purple-400'  },
    red:    { border: 'hover:border-red-500/30',     iconBg: 'bg-red-500/10',     iconHover: 'group-hover:bg-red-500/20',     iconText: 'text-red-400',     bar: 'bg-red-500/60',     arrow: ''                             },
  };
  const s = schemes[color];
  return (
    <Link to={to} className={`bg-[#111320] border border-white/5 rounded-2xl p-5 hover:-translate-y-0.5 transition-all duration-300 group ${s.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${s.iconBg} ${s.iconHover}`}>
          <span className={s.iconText}>{icon}</span>
        </div>
        {color === 'red'
          ? <span className="text-[9px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
          : <FaArrowRight className={`text-xs text-white/10 transition-colors ${s.arrow}`} />}
      </div>
      <p className="font-black text-3xl text-white" style={{ fontFamily: 'Georgia, serif' }}>{value}</p>
      <p className="text-white/30 text-[11px] uppercase tracking-widest font-semibold mt-1">{title}</p>
      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full w-1/2 rounded-full ${s.bar}`} />
      </div>
    </Link>
  );
};

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    unread:  'bg-red-500/15 text-red-400',
    read:    'bg-blue-500/15 text-blue-400',
    replied: 'bg-emerald-500/15 text-emerald-400',
  };
  return (
    <span className={`inline-block px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${map[status] ?? map.read}`}>
      {status}
    </span>
  );
};

/* ─── Dashboard ───────────────────────────────────────────── */
const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState({
    totalProjects: 0, ongoingProjects: 0, finishedProjects: 0,
    totalInquiries: 0, unreadInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, inqStatsRes, inqRes] = await Promise.all([
        api.get('/projects?limit=200'),
        api.get('/inquiries/stats'),
        api.get('/inquiries?limit=5'),
      ]);
      const projects  = projRes.data.data || [];
      const inqStats  = inqStatsRes.data.data || {};
      const inquiries = inqRes.data.data || [];
      setStats({
        totalProjects:    projects.length,
        ongoingProjects:  projects.filter(p => p.status === 'Ongoing').length,
        finishedProjects: projects.filter(p => p.status === 'Finished').length,
        totalInquiries:   inqStats.total || 0,
        unreadInquiries:  inqStats.unread || 0,
      });
      setRecentInquiries(inquiries);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const initials = (admin?.name || 'A').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const statCards = [
    { title: 'Total Projects',   value: stats.totalProjects,    icon: <FaProjectDiagram />, to: '/admin/projects',                color: 'blue'   },
    { title: 'Ongoing',          value: stats.ongoingProjects,  icon: <FaClock />,          to: '/admin/projects?status=Ongoing', color: 'amber'  },
    { title: 'Finished',         value: stats.finishedProjects, icon: <FaCheckCircle />,    to: '/admin/projects?status=Finished',color: 'green'  },
    { title: 'Total Inquiries',  value: stats.totalInquiries,   icon: <FaEnvelope />,       to: '/admin/inquiries',               color: 'purple' },
    { title: 'Unread Inquiries', value: stats.unreadInquiries,  icon: <FaEnvelopeOpen />,   to: '/admin/inquiries?status=unread', color: 'red'    },
  ];

  const glance = [
    { label: 'Active',    val: stats.ongoingProjects,  barColor: 'bg-amber-500/60',   textColor: 'text-amber-400',   pct: stats.totalProjects   ? stats.ongoingProjects  / stats.totalProjects   * 100 : 0 },
    { label: 'Completed', val: stats.finishedProjects, barColor: 'bg-emerald-500/60', textColor: 'text-emerald-400', pct: stats.totalProjects   ? stats.finishedProjects / stats.totalProjects   * 100 : 0 },
    { label: 'Pending',   val: stats.unreadInquiries,  barColor: 'bg-red-500/60',     textColor: 'text-red-400',     pct: stats.totalInquiries  ? Math.min(stats.unreadInquiries / stats.totalInquiries * 100, 100) : 0 },
  ];

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AdminSidebar unreadCount={stats.unreadInquiries} projectCount={stats.totalProjects} />

      <main className="ml-64 flex-1 min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0D0F18]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Dashboard <span className="text-amber-400">Overview</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
              <FaBell className="text-white/40 text-sm" />
              {stats.unreadInquiries > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#0D0F18]" />
              )}
            </button>
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wider"
            >
              <FaPlus size={11} /> Add Project
            </Link>
          </div>
        </header>

        <div className="px-8 py-6 space-y-6">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <div key={i} className="bg-[#111320] border border-white/5 rounded-2xl p-5 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-white/5 mb-4" />
                    <div className="h-8 w-12 bg-white/5 rounded mb-2" />
                    <div className="h-3 w-20 bg-white/5 rounded" />
                  </div>
                ))
              : statCards.map((c, i) => <StatCard key={i} {...c} />)
            }
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Inquiries table */}
            <div className="lg:col-span-2 bg-[#111320] border border-white/5 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Latest</p>
                  <h2 className="font-bold text-lg text-white mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                    Recent Inquiries
                  </h2>
                </div>
                <Link to="/admin/inquiries" className="text-[11px] font-bold text-white/30 hover:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                  View All <FaArrowRight size={10} />
                </Link>
              </div>

              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : recentInquiries.length === 0 ? (
                <div className="py-16 text-center">
                  <FaEnvelope className="mx-auto mb-3 text-4xl text-white/10" />
                  <p className="text-sm font-semibold text-white/40">No inquiries yet</p>
                  <p className="text-xs text-white/20 mt-1">New submissions will appear here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        {['Name', 'Email', 'Subject', 'Status', 'Date'].map(h => (
                          <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white/20">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentInquiries.map(inq => (
                        <tr key={inq._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3.5 text-sm font-semibold text-white">{inq.name}</td>
                          <td className="px-5 py-3.5 text-xs text-white/40">{inq.email}</td>
                          <td className="px-5 py-3.5 text-xs text-white/40 max-w-[160px] truncate">{inq.subject}</td>
                          <td className="px-5 py-3.5"><StatusBadge status={inq.status} /></td>
                          <td className="px-5 py-3.5 text-xs text-white/30">
                            {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">

              {/* Account */}
              <div className="bg-[#111320] border border-white/5 rounded-2xl p-5">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
                  <FaUser size={9} /> Account
                </p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-black text-lg shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{admin?.name || 'Admin'}</p>
                    <p className="text-white/30 text-xs capitalize">{admin?.role || 'Admin'}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-xs">Email</span>
                    <span className="text-white/60 text-xs font-medium truncate max-w-[150px]">{admin?.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/30 text-xs">Role</span>
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider capitalize">
                      {admin?.role || 'Admin'}
                    </span>
                  </div>
                  {admin?.lastLogin && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/30 text-xs">Last Login</span>
                      <span className="text-white/60 text-xs font-medium">
                        {new Date(admin.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* At a glance */}
              <div className="bg-[#111320] border border-white/5 rounded-2xl p-5 flex-1">
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-1.5">
                  <FaChartLine size={9} /> Overview
                </p>
                <div className="space-y-3">
                  {glance.map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="text-white/40 text-xs w-16 shrink-0">{r.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${r.barColor}`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className={`text-xs font-bold w-5 text-right ${r.textColor}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <Link
                    to="/admin/projects"
                    className="block w-full text-center bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold py-2.5 rounded-xl uppercase tracking-widest transition-all"
                  >
                    Manage Projects
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;