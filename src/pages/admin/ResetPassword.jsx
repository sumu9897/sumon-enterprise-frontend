import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaBuilding, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import api from '../../services/api';
import AuthMessage from './AuthMessage';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setError('');
    if (form.password.length < 12) return setError('Use at least 12 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setLoading(true);
    try { await api.post('/auth/reset-password', { token, password: form.password }); setComplete(true); }
    catch (err) { setError(err.response?.data?.error?.message || 'The password could not be reset.'); }
    finally { setLoading(false); }
  };
  if (!token) return <AuthMessage tone="warning" title="Invalid recovery link" message="This link is incomplete. Request a new password recovery email." actionLabel="Request a new link" actionTo="/admin/forgot-password" />;
  if (complete) return <AuthMessage title="Password reset complete" message="Your password has been updated and existing sessions were invalidated. You can now sign in securely." />;
  return <main className="min-h-screen bg-[#0d0f18] text-white flex items-center justify-center px-5 py-12"><section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111320] p-8"><div className="flex items-center gap-3 text-amber-400 mb-8"><FaBuilding /><span className="font-bold tracking-[.18em] text-xs">M/S SUMON ENTERPRISE</span></div><h1 className="font-heading text-3xl">Choose a new password</h1><p className="mt-3 text-sm text-white/45">Use at least 12 characters. Completing this reset signs out every existing session.</p><form onSubmit={submit} className="mt-7 space-y-5">{['password', 'confirm'].map((field) => <label key={field} className="block"><span className="text-xs font-semibold text-white/60">{field === 'password' ? 'New password' : 'Confirm new password'}</span><div className="relative mt-2"><FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" /><input type={show ? 'text' : 'password'} required minLength={12} maxLength={128} autoComplete="new-password" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 focus:border-amber-400 focus:outline-none" />{field === 'password' && <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35">{show ? <FaEyeSlash /> : <FaEye />}</button>}</div></label>)}{error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-[#111320] disabled:opacity-60">{loading ? 'Updating…' : 'Reset password'}</button></form></section></main>;
};

export default ResetPassword;
