import { Link } from 'react-router-dom';
import { FaBuilding, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AuthMessage = ({ title, message, tone = 'success', actionLabel = 'Return to sign in', actionTo = '/admin/login' }) => (
  <main className="min-h-screen bg-[#0d0f18] text-white flex items-center justify-center px-5 py-12">
    <section className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111320] p-8 text-center shadow-2xl">
      <div className="flex justify-center items-center gap-3 text-amber-400 mb-7"><FaBuilding /><span className="font-bold tracking-[.18em] text-xs">M/S SUMON ENTERPRISE</span></div>
      <div className={`mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full ${tone === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
        {tone === 'success' ? <FaCheckCircle size={24} /> : <FaExclamationTriangle size={24} />}
      </div>
      <h1 className="font-heading text-3xl">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">{message}</p>
      <Link to={actionTo} className="mt-7 inline-flex rounded-xl bg-amber-400 px-6 py-3 font-bold text-[#111320] hover:bg-amber-300">{actionLabel}</Link>
    </section>
  </main>
);

export default AuthMessage;
