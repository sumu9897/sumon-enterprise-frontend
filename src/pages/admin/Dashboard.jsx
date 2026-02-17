import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  FaProjectDiagram, FaCheckCircle, FaClock, FaEnvelope,
  FaEnvelopeOpen, FaArrowRight, FaSignOutAlt, FaPlus,
  FaEye, FaChartLine, FaUser, FaCalendarAlt, FaStar,
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

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const dark = useDarkMode();
  const [stats, setStats]                   = useState({
    totalProjects: 0, ongoingProjects: 0, finishedProjects: 0,
    totalInquiries: 0, unreadInquiries: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading]                 = useState(true);

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projRes, inqStatsRes, inqRes] = await Promise.all([
        api.get('/projects?limit=200'),
        api.get('/inquiries/stats'),
        api.get('/inquiries?limit=5'),
      ]);

      const projects = projRes.data.data || [];
      const inqStats = inqStatsRes.data.data || {};
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const statCards = [
    { title: 'Total Projects',    val: stats.totalProjects,    icon: <FaProjectDiagram />, color: '#3B82F6', link: '/admin/projects' },
    { title: 'Ongoing',           val: stats.ongoingProjects,  icon: <FaClock />,          color: '#F59E0B', link: '/admin/projects?status=Ongoing' },
    { title: 'Finished',          val: stats.finishedProjects, icon: <FaCheckCircle />,    color: '#22C55E', link: '/admin/projects?status=Finished' },
    { title: 'Total Inquiries',   val: stats.totalInquiries,   icon: <FaEnvelope />,       color: '#8B5CF6', link: '/admin/inquiries' },
    { title: 'Unread Inquiries',  val: stats.unreadInquiries,  icon: <FaEnvelopeOpen />,   color: '#EF4444', link: '/admin/inquiries?status=unread' },
  ];

  const quickActions = [
    { label: 'Add Project',   icon: <FaPlus />,    link: '/admin/projects/new', primary: true },
    { label: 'Projects',      icon: <FaProjectDiagram />, link: '/admin/projects' },
    { label: 'Inquiries',     icon: <FaEnvelope />, link: '/admin/inquiries' },
    { label: 'Public Site',   icon: <FaEye />,     link: '/' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .dash-root { font-family: 'DM Sans', sans-serif; }
        .serif     { font-family: 'Playfair Display', serif; }
        .section-label { font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem; }
        .gold-divider  { width:50px;height:3px;background:linear-gradient(90deg,#C9A84C,#E8C96A);border-radius:2px;margin-bottom:1.5rem; }

        /* Stat card */
        .stat-card {
          border:1px solid var(--bdr);border-radius:2px;padding:24px;
          position:relative;overflow:hidden;
          transition:transform .3s,box-shadow .3s,border-color .3s;
        }
        .stat-card:hover {
          transform:translateY(-5px);
          box-shadow:0 16px 40px rgba(0,0,0,.14);
          border-color:#C9A84C;
        }
        .stat-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:var(--card-color);opacity:.8;
        }
        .stat-icon {
          width:48px;height:48px;border-radius:2px;
          display:flex;align-items:center;justify-content:center;
          font-size:22px;
          background:var(--card-color-light);
          color:var(--card-color);
          transition:transform .3s;
        }
        .stat-card:hover .stat-icon { transform:scale(1.1) rotate(5deg); }

        /* Quick action buttons */
        .qa-btn {
          display:inline-flex;align-items:center;gap:8px;padding:11px 24px;
          border-radius:2px;font-weight:700;font-size:12px;
          letter-spacing:.12em;text-transform:uppercase;
          transition:all .25s;
        }
        .qa-btn.primary {
          background:#C9A84C;color:white;border:none;
        }
        .qa-btn.primary:hover { opacity:.9;transform:translateY(-1px); }
        .qa-btn.outline {
          background:transparent;border:2px solid var(--bdr);color:var(--txt);
        }
        .qa-btn.outline:hover { border-color:#C9A84C;color:#C9A84C;transform:translateY(-1px); }

        /* Inquiry table */
        .inq-table { width:100%;border-collapse:collapse; }
        .inq-table thead th {
          text-align:left;padding:12px;font-size:10px;font-weight:700;
          letter-spacing:.15em;text-transform:uppercase;
          color:var(--sub);border-bottom:1px solid var(--bdr);
          background:var(--th-bg);
        }
        .inq-table tbody tr {
          border-bottom:1px solid var(--bdr);
          transition:background .15s;
        }
        .inq-table tbody tr:hover { background:var(--row-hover); }
        .inq-table tbody td { padding:14px 12px;font-size:13px; }

        .status-badge {
          display:inline-block;padding:4px 10px;border-radius:2px;
          font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
        }

        .logout-btn {
          display:inline-flex;align-items:center;gap:8px;padding:10px 20px;
          background:#EF4444;color:white;border-radius:2px;
          font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;
          transition:all .2s;border:none;cursor:pointer;
        }
        .logout-btn:hover { background:#DC2626;transform:translateY(-1px); }

        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-600px 0}100%{background-position:600px 0} }

        .fade-up { animation:fadeUp .6s ease forwards; }
        .d1{animation-delay:.1s;opacity:0}.d2{animation-delay:.25s;opacity:0}
        .d3{animation-delay:.4s;opacity:0}.d4{animation-delay:.55s;opacity:0}

        .skeleton { background:linear-gradient(90deg,var(--sk1) 25%,var(--sk2) 50%,var(--sk1) 75%);background-size:1200px 100%;animation:shimmer 1.4s infinite linear; }
        .spinner { width:40px;height:40px;border:3px solid rgba(201,168,76,.2);border-top-color:#C9A84C;border-radius:50%;animation:spin .7s linear infinite; }
      `}</style>

      <div className="dash-root min-h-screen"
        style={{
          background:bg, color:text, '--bdr':bdr, '--txt':text, '--sub':sub,
          '--th-bg': dark?'#13151E':'#F7F3EC',
          '--row-hover': dark?'rgba(201,168,76,.04)':'rgba(201,168,76,.03)',
          '--sk1': dark?'#1C1E2A':'#F0EDE8', '--sk2': dark?'#252838':'#E8E4DC',
        }}>

        {/* ══ HEADER ══ */}
        <div className="border-b" style={{ background:dark2, borderColor:bdr }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="fade-up d1">
                <span className="section-label">Admin Panel</span>
                <h1 className="serif font-black text-white" style={{ fontSize:'clamp(1.6rem,4vw,2.5rem)' }}>
                  <span style={{ color:gold }}>Dashboard</span>
                </h1>
                <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,.4)' }}>
                  Welcome back, <strong style={{ color:gold }}>{admin?.name || 'Admin'}</strong>
                </p>
              </div>
              <button onClick={handleLogout} className="logout-btn fade-up d2">
                <FaSignOutAlt size={12} /> Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

          {/* ══ QUICK ACTIONS ══ */}
          <div className="mb-8 fade-up d3">
            <span className="section-label">Quick Access</span>
            <div className="gold-divider" />
            <div className="flex flex-wrap gap-3">
              {quickActions.map((a, i) => (
                <Link key={i} to={a.link}
                  className={`qa-btn ${a.primary ? 'primary' : 'outline'}`}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>

          {loading ? (
            /* Skeleton */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_,i) => (
                  <div key={i} className="rounded-sm p-6" style={{ background:card, border:`1px solid ${bdr}` }}>
                    <div className="skeleton rounded w-12 h-12 mb-3" />
                    <div className="skeleton rounded h-8 w-16 mb-2" />
                    <div className="skeleton rounded h-3 w-24" />
                  </div>
                ))}
              </div>
              <div className="rounded-sm p-6" style={{ background:card, border:`1px solid ${bdr}` }}>
                <div className="skeleton rounded h-6 w-32 mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_,i) => (
                    <div key={i} className="skeleton rounded h-12" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ══ STAT CARDS ══ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((c, i) => (
                  <Link key={i} to={c.link}
                    className="stat-card fade-up"
                    style={{
                      background:card,
                      '--card-color': c.color,
                      '--card-color-light': `${c.color}18`,
                      animationDelay: `${0.1 + i*0.1}s`, opacity:0,
                    }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="stat-icon">{c.icon}</div>
                      <FaArrowRight style={{ color:c.color, opacity:.5 }} />
                    </div>
                    <div className="serif font-black text-3xl mb-1" style={{ color:text }}>
                      {c.val}
                    </div>
                    <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color:sub }}>
                      {c.title}
                    </div>
                  </Link>
                ))}
              </div>

              {/* ══ RECENT INQUIRIES ══ */}
              <div className="rounded-sm p-6 mb-8"
                style={{ background:card, border:`1px solid ${bdr}` }}>
                <div className="flex items-center justify-between mb-5 pb-4"
                  style={{ borderBottom:`1px solid ${bdr}` }}>
                  <div>
                    <span className="section-label">Latest</span>
                    <h2 className="serif font-bold text-xl" style={{ color:text }}>Recent Inquiries</h2>
                  </div>
                  <Link to="/admin/inquiries"
                    className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all hover:gap-3"
                    style={{ color:gold }}>
                    View All <FaArrowRight size={10} />
                  </Link>
                </div>

                {recentInquiries.length === 0 ? (
                  <div className="py-12 text-center">
                    <FaEnvelope className="mx-auto mb-3 text-4xl" style={{ color:bdr }} />
                    <p className="text-sm font-semibold mb-1" style={{ color:text }}>No inquiries yet</p>
                    <p className="text-xs" style={{ color:sub }}>New contact form submissions will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6">
                    <table className="inq-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Subject</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentInquiries.map(inq => (
                          <tr key={inq._id}>
                            <td className="font-semibold" style={{ color:text }}>{inq.name}</td>
                            <td style={{ color:sub }}>{inq.email}</td>
                            <td className="max-w-xs truncate" style={{ color:sub }}>
                              {inq.subject}
                            </td>
                            <td>
                              <span className="status-badge"
                                style={{
                                  background: inq.status==='unread' ? 'rgba(239,68,68,.15)' :
                                              inq.status==='read'   ? 'rgba(59,130,246,.15)' : 'rgba(34,197,94,.15)',
                                  color:      inq.status==='unread' ? '#EF4444' :
                                              inq.status==='read'   ? '#3B82F6' : '#22C55E',
                                }}>
                                {inq.status}
                              </span>
                            </td>
                            <td style={{ color:sub }}>
                              {new Date(inq.createdAt).toLocaleDateString('en-US', {
                                month:'short', day:'numeric', year:'numeric',
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* ══ INFO CARDS ══ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* System Info */}
                <div className="rounded-sm p-6"
                  style={{ background:card, border:`1px solid ${bdr}` }}>
                  <div className="flex items-center gap-3 mb-5 pb-4"
                    style={{ borderBottom:`1px solid ${bdr}` }}>
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                      style={{ background:'rgba(201,168,76,.1)', color:gold }}>
                      <FaUser />
                    </div>
                    <div>
                      <span className="section-label mb-0">Account</span>
                      <h3 className="serif font-bold text-base" style={{ color:text }}>Your Info</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span style={{ color:sub }}>Email</span>
                      <span className="font-semibold" style={{ color:text }}>{admin?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color:sub }}>Role</span>
                      <span className="font-semibold capitalize" style={{ color:text }}>{admin?.role || 'Admin'}</span>
                    </div>
                    {admin?.lastLogin && (
                      <div className="flex justify-between items-center">
                        <span style={{ color:sub }}>Last Login</span>
                        <span className="font-semibold" style={{ color:text }}>
                          {new Date(admin.lastLogin).toLocaleDateString('en-US', { month:'short', day:'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="rounded-sm p-6"
                  style={{ background:card, border:`1px solid ${bdr}` }}>
                  <div className="flex items-center gap-3 mb-5 pb-4"
                    style={{ borderBottom:`1px solid ${bdr}` }}>
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                      style={{ background:'rgba(201,168,76,.1)', color:gold }}>
                      <FaChartLine />
                    </div>
                    <div>
                      <span className="section-label mb-0">Overview</span>
                      <h3 className="serif font-bold text-base" style={{ color:text }}>At a Glance</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span style={{ color:sub }}>Active Projects</span>
                      <span className="font-semibold" style={{ color:'#F59E0B' }}>{stats.ongoingProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color:sub }}>Completed</span>
                      <span className="font-semibold" style={{ color:'#22C55E' }}>{stats.finishedProjects}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color:sub }}>Pending Inquiries</span>
                      <span className="font-semibold" style={{ color:'#EF4444' }}>
                        {stats.unreadInquiries}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity placeholder */}
                <div className="rounded-sm p-6 relative overflow-hidden"
                  style={{ background:dark2, border:`1px solid rgba(201,168,76,.25)` }}>
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.06]"
                    style={{ background:gold }} />
                  <div className="flex items-center gap-3 mb-5 pb-4"
                    style={{ borderBottom:`1px solid rgba(201,168,76,.2)` }}>
                    <div className="w-10 h-10 rounded-sm flex items-center justify-center"
                      style={{ background:'rgba(201,168,76,.15)', color:gold }}>
                      <FaStar />
                    </div>
                    <div>
                      <span className="section-label mb-0">Featured</span>
                      <h3 className="serif font-bold text-base text-white">Projects</h3>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span style={{ color:'rgba(255,255,255,.5)' }}>Featured</span>
                      <span className="font-semibold" style={{ color:gold }}>
                        {stats.totalProjects > 0
                          ? Math.ceil(stats.totalProjects * 0.2)
                          : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color:'rgba(255,255,255,.5)' }}>Total</span>
                      <span className="font-semibold text-white">{stats.totalProjects}</span>
                    </div>
                    <Link to="/admin/projects"
                      className="block w-full text-center py-2 mt-4 rounded-sm font-bold text-[10px] tracking-widest uppercase transition-all hover:-translate-y-0.5"
                      style={{ background:gold, color:'white' }}>
                      Manage Projects
                    </Link>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;