import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBuilding, FaEnvelope } from 'react-icons/fa';
import api from '../../services/api';
import AuthMessage from './AuthMessage';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    try { await api.post('/auth/forgot-password', { email: email.trim() }); setSent(true); }
    catch (err) { setError(err.response?.data?.error?.message || 'Recovery email could not be sent. Please try again.'); }
    finally { setLoading(false); }
  };
  if (sent) return <AuthMessage title="Check your inbox" message="If an active administrator account matches that address, a single-use recovery link has been sent. It expires in 15 minutes." />;
  return <main className="min-h-screen bg-[#0d0f18] text-white flex items-center justify-center px-5 py-12"><section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111320] p-8"><div className="flex items-center gap-3 text-amber-400 mb-8"><FaBuilding /><span className="font-bold tracking-[.18em] text-xs">M/S SUMON ENTERPRISE</span></div><h1 className="font-heading text-3xl">Recover access</h1><p className="mt-3 text-sm leading-6 text-white/45">Enter your administrator email. For security, the response is identical whether or not an account exists.</p><form onSubmit={submit} className="mt-7 space-y-5"><label className="block"><span className="text-xs font-semibold text-white/60">Email address</span><div className="relative mt-2"><FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" /><input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 focus:border-amber-400 focus:outline-none" /></div></label>{error && <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<button disabled={loading} className="w-full rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-[#111320] disabled:opacity-60">{loading ? 'Sending…' : 'Send secure recovery link'}</button></form><Link to="/admin/login" className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white"><FaArrowLeft /> Back to sign in</Link></section></main>;
};

export default ForgotPassword;
