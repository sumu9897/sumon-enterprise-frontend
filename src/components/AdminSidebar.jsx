import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FaProjectDiagram, FaPlus, FaEnvelope, FaEye,
  FaSignOutAlt, FaTachometerAlt, FaArrowRight,
} from 'react-icons/fa';

/* ─── Nav Item ────────────────────────────────────────────── */
const NavItem = ({ to, icon, label, badge, badgeVariant = 'red', isNew, external }) => {
  const location = useLocation();
  const active = !external && (location.pathname === to || location.pathname.startsWith(to + '/'));

  const badgeStyles = {
    red:   'bg-red-500/20 text-red-400',
    amber: 'bg-amber-500/20 text-amber-400',
    green: 'bg-emerald-500/20 text-emerald-400',
  };

  const cls = [
    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group border',
    active
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'text-white/50 hover:text-white hover:bg-white/5 border-transparent',
  ].join(' ');

  const iconCls = [
    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all',
    active ? 'bg-amber-500/15 text-amber-400' : 'bg-white/5 group-hover:bg-white/10',
  ].join(' ');

  const content = (
    <>
      <span className={iconCls}>{icon}</span>
      <span className="flex-1 leading-none">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />}
      {badge != null && !active && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeStyles[badgeVariant]}`}>
          {badge}
        </span>
      )}
      {isNew && !active && (
        <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">
          New
        </span>
      )}
      {external && (
        <FaArrowRight className="text-[10px] text-white/20 -rotate-45" />
      )}
    </>
  );

  if (external) {
    return <a href={to} target="_blank" rel="noreferrer" className={cls}>{content}</a>;
  }
  return <Link to={to} className={cls}>{content}</Link>;
};

/* ─── Section Label ───────────────────────────────────────── */
const SidebarSection = ({ label }) => (
  <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-2 pt-4 first:pt-2">
    {label}
  </p>
);

/* ─── Sidebar ─────────────────────────────────────────────── */
const AdminSidebar = ({ unreadCount = 0, projectCount = 0 }) => {
  const { admin, logout } = useAuth();

  const initials = (admin?.name || 'A')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#111320] border-r border-white/5 flex flex-col fixed left-0 top-0 bottom-0 z-30 overflow-hidden">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
            <FaProjectDiagram className="text-amber-400 text-sm" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">AdminPanel</p>
            <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-widest">Studio CMS</p>
          </div>
        </div>
      </div>

      {/* Admin chip */}
      <div className="px-4 py-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-black text-black shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{admin?.name || 'Admin'}</p>
            <p className="text-white/30 text-[10px] truncate">{admin?.email}</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <SidebarSection label="Main" />
        <NavItem to="/admin/dashboard" icon={<FaTachometerAlt size={14} />} label="Dashboard" />

        <SidebarSection label="Projects" />
        <NavItem
          to="/admin/projects/new"
          icon={<FaPlus size={13} />}
          label="Add Project"
          isNew
        />
        <NavItem
          to="/admin/projects"
          icon={<FaProjectDiagram size={13} />}
          label="All Projects"
          badge={projectCount || undefined}
          badgeVariant="amber"
        />

        <SidebarSection label="Communication" />
        <NavItem
          to="/admin/inquiries"
          icon={<FaEnvelope size={13} />}
          label="Inquiries"
          badge={unreadCount || undefined}
          badgeVariant="red"
        />

        <SidebarSection label="Site" />
        <NavItem
          to="/"
          icon={<FaEye size={13} />}
          label="Public Site"
          external
        />
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group border border-transparent"
        >
          <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-red-500/15 shrink-0 transition-all">
            <FaSignOutAlt size={13} />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;