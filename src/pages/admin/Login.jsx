import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaBuilding, FaEnvelope, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await login(form.email.trim(), form.password, form.remember);
      toast.success('Welcome back');
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Unable to sign in');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#0d0f18] text-white grid lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden lg:flex relative overflow-hidden p-14 flex-col justify-between bg-[#111522]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,#c9a84c_0,transparent_35%)]" />
        <div className="relative flex items-center gap-3 text-amber-400"><FaBuilding /><span className="font-bold tracking-[.22em] text-xs">M/S SUMON ENTERPRISE</span></div>
        <div className="relative max-w-xl">
          <p className="text-amber-400 text-xs font-bold tracking-[.25em] uppercase mb-4">Administrator portal</p>
          <h1 className="font-heading text-5xl leading-tight">Manage projects with clarity and confidence.</h1>
          <p className="mt-5 text-white/45 leading-7">Secure access to project publishing, customer inquiries, and company operations.</p>
        </div>
        <p className="relative text-xs text-white/25">Authorized personnel only · All access is logged</p>
      </section>
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 text-amber-400 mb-10"><FaBuilding /><span className="font-bold tracking-[.18em] text-xs">M/S SUMON ENTERPRISE</span></div>
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[.22em]">Secure access</p>
          <h2 className="font-heading text-3xl mt-2">Welcome back</h2>
          <p className="text-white/40 text-sm mt-2 mb-8">Sign in to the administration workspace.</p>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <label className="block"><span className="text-xs font-semibold text-white/60">Email address</span><div className="relative mt-2"><FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" /><input type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-white placeholder:text-white/20 focus:border-amber-400 focus:outline-none" placeholder="name@company.com" /></div></label>
            <label className="block"><span className="text-xs font-semibold text-white/60">Password</span><div className="relative mt-2"><FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-12 text-white placeholder:text-white/20 focus:border-amber-400 focus:outline-none" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div></label>
            <div className="flex items-center justify-between gap-4 text-sm"><label className="flex items-center gap-2 text-white/50"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} className="accent-amber-400" /> Remember me</label><Link to="/admin/forgot-password" className="font-semibold text-amber-400 hover:text-amber-300">Forgot password?</Link></div>
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-amber-400 px-5 py-3.5 font-bold text-[#111320] hover:bg-amber-300 disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in securely'}</button>
            <p role="status" aria-live="polite" className="text-center text-xs text-white/25">Passwords and access tokens are never sent by email.</p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
