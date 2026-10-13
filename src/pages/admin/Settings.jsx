import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaKey, FaShieldAlt, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import api, { getApiErrorMessage } from '../../services/api';

const Field = ({ label, name, value, onChange, autoComplete }) => (
  <label className="block">
    <span className="text-xs font-semibold text-white/55">{label}</span>
    <input name={name} type="password" autoComplete={autoComplete} required minLength={name === 'currentPassword' ? undefined : 12} value={value} onChange={onChange} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10" />
  </label>
);

const Settings = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const handleChange = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.value }));

  const changePassword = async (event) => {
    event.preventDefault();
    if (form.password.length < 12) return toast.error('Use at least 12 characters.');
    if (form.password !== form.confirm) return toast.error('New passwords do not match.');
    try {
      setLoading(true);
      await api.post('/auth/change-password', { currentPassword: form.currentPassword, password: form.password });
      logout();
      navigate('/admin/login', { replace: true });
      toast.success('Password changed. Sign in again.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Password could not be changed.'));
    } finally {
      setLoading(false);
    }
  };

  const logoutAll = async () => {
    try {
      setSigningOut(true);
      await api.post('/auth/logout-all');
      logout();
      navigate('/admin/login', { replace: true });
      toast.success('All sessions signed out.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not sign out all sessions.'));
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white">
      <AdminSidebar />
      <main className="flex-1 px-4 pb-10 pt-20 sm:px-8 md:ml-64 md:pt-8">
        <header className="mb-8 max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Security center</p>
          <h1 className="mt-2 font-heading text-3xl sm:text-4xl">Administrator settings</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40">Review your account and keep administrative access protected. Password changes invalidate every existing session.</p>
        </header>
        <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6">
            <div className="flex items-center gap-3"><FaUserShield className="text-amber-400" /><h2 className="font-heading text-xl">Account profile</h2></div>
            <dl className="mt-6 divide-y divide-white/5 rounded-xl border border-white/5 bg-white/[.02] px-4 text-sm">
              {[['Name', admin?.name], ['Email', admin?.email], ['Role', admin?.role]].map(([label, value]) => (
                <div key={label} className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center"><dt className="text-white/35">{label}</dt><dd className="break-all font-medium capitalize text-white/80">{value || '—'}</dd></div>
              ))}
            </dl>
            <div className="mt-6 rounded-xl border border-red-500/15 bg-red-500/5 p-4">
              <div className="flex items-start gap-3"><FaShieldAlt className="mt-1 shrink-0 text-red-300" /><p className="text-xs leading-5 text-white/45">Use this if a device is lost or you suspect unauthorized access.</p></div>
              <button type="button" disabled={signingOut} onClick={logoutAll} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"><FaSignOutAlt />{signingOut ? 'Signing out…' : 'Sign out every device'}</button>
            </div>
          </section>
          <section className="rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6">
            <div className="flex items-center gap-3"><FaKey className="text-amber-400" /><h2 className="font-heading text-xl">Change password</h2></div>
            <p className="mt-2 text-sm text-white/35">Use at least 12 characters and avoid reusing an old password.</p>
            <form onSubmit={changePassword} className="mt-6 space-y-4">
              <Field label="Current password" name="currentPassword" value={form.currentPassword} onChange={handleChange} autoComplete="current-password" />
              <Field label="New password" name="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
              <Field label="Confirm new password" name="confirm" value={form.confirm} onChange={handleChange} autoComplete="new-password" />
              <button disabled={loading} className="w-full rounded-xl bg-amber-400 px-5 py-3 font-bold text-[#111320] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Updating…' : 'Update password'}</button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
