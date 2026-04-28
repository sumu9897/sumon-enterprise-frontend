import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import {
  FaTrash, FaEnvelope, FaEnvelopeOpen, FaFilter,
  FaTimes, FaReply, FaUser, FaPhone, FaTag, FaCalendarAlt,
  FaInbox,
} from 'react-icons/fa';

/* ─── Status Badge ────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    unread:  'bg-red-500/15 text-red-400 border border-red-500/20',
    read:    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    replied: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${map[status] ?? map.read}`}>
      {status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
      {status}
    </span>
  );
};

/* ─── Detail Row ──────────────────────────────────────────── */
const DetailRow = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-amber-400 text-[11px]">{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{label}</p>
      <p className="text-sm text-white/80 font-medium mt-0.5 break-words">{value || '—'}</p>
    </div>
  </div>
);

/* ─── InquiryManager ──────────────────────────────────────── */
const InquiryManager = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => { fetchInquiries(); }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries?limit=100');
      setInquiries(res.data.data || []);
    } catch {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/inquiries/${id}/status`, { status });
      toast.success('Status updated');
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      if (selectedInquiry?._id === id) setSelectedInquiry(prev => ({ ...prev, status }));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete inquiry from "${name}"? This cannot be undone.`)) return;
    try {
      setDeleting(id);
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted');
      setInquiries(prev => prev.filter(i => i._id !== id));
      if (selectedInquiry?._id === id) setSelectedInquiry(null);
    } catch {
      toast.error('Failed to delete inquiry');
    } finally {
      setDeleting(null);
    }
  };

  const handleSelect = (inq) => {
    setSelectedInquiry(inq);
    if (inq.status === 'unread') handleStatusChange(inq._id, 'read');
  };

  const filtered = filter ? inquiries.filter(i => i.status === filter) : inquiries;
  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AdminSidebar unreadCount={unreadCount} projectCount={0} />

      <main className="ml-64 flex-1 min-w-0">

        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0D0F18]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl text-white" style={{ fontFamily: 'Georgia, serif' }}>
              Manage <span className="text-amber-400">Inquiries</span>
            </h1>
            <p className="text-white/30 text-xs mt-0.5">
              {inquiries.length} total · {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/20 text-xs font-bold px-3 py-1.5 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              {unreadCount} Unread
            </span>
          )}
        </header>

        <div className="px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: List */}
            <div className="lg:col-span-2 space-y-4">

              {/* Filter bar */}
              <div className="bg-[#111320] border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4">
                <div className="flex items-center gap-2 text-amber-400 shrink-0">
                  <FaFilter size={11} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Filter</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[{ val: '', label: 'All' }, { val: 'unread', label: 'Unread' }, { val: 'read', label: 'Read' }, { val: 'replied', label: 'Replied' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilter(opt.val)}
                      className={[
                        'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                        filter === opt.val
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-transparent',
                      ].join(' ')}
                    >
                      {opt.label}
                      {opt.val === 'unread' && unreadCount > 0 && (
                        <span className="ml-1.5 bg-red-500/30 text-red-400 text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </button>
                  ))}
                  {filter && (
                    <button onClick={() => setFilter('')} className="px-2 py-1.5 rounded-lg text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1">
                      <FaTimes size={9} /> Clear
                    </button>
                  )}
                </div>
                <span className="ml-auto text-white/20 text-xs font-medium shrink-0">
                  {filtered.length} / {inquiries.length}
                </span>
              </div>

              {/* Table */}
              <div className="bg-[#111320] border border-white/5 rounded-2xl overflow-hidden">
                {loading ? (
                  <div className="p-6 space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 text-center">
                    <FaInbox className="mx-auto mb-3 text-4xl text-white/10" />
                    <p className="text-sm font-semibold text-white/40">No inquiries found</p>
                    <p className="text-xs text-white/20 mt-1">Try a different filter</p>
                  </div>
                ) : (
                  <>
                    <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-white/[0.02] border-b border-white/5">
                      {['', 'Name', 'Email', 'Subject', 'Date', 'Status', ''].map((h, i) => (
                        <div key={i} className={`text-[10px] font-bold uppercase tracking-widest text-white/20 ${i === 0 ? 'col-span-1' : i === 1 ? 'col-span-2' : i === 2 ? 'col-span-2' : i === 3 ? 'col-span-3' : i === 4 ? 'col-span-2' : i === 5 ? 'col-span-1' : 'col-span-1 text-center'}`}>
                          {h}
                        </div>
                      ))}
                    </div>
                    <div>
                      {filtered.map(inq => {
                        const isActive = selectedInquiry?._id === inq._id;
                        return (
                          <div
                            key={inq._id}
                            onClick={() => handleSelect(inq)}
                            className={[
                              'grid grid-cols-12 gap-3 px-5 py-4 border-b border-white/[0.04] cursor-pointer transition-all duration-150 items-center',
                              isActive
                                ? 'bg-amber-500/5 border-l-2 border-l-amber-500/50'
                                : 'hover:bg-white/[0.02]',
                              inq.status === 'unread' ? 'border-l-2 border-l-red-500/40' : '',
                            ].join(' ')}
                          >
                            {/* Icon */}
                            <div className="col-span-1 flex items-center justify-center">
                              {inq.status === 'unread'
                                ? <FaEnvelope className="text-red-400" size={13} />
                                : <FaEnvelopeOpen className="text-white/20" size={13} />}
                            </div>
                            {/* Name */}
                            <div className="col-span-2">
                              <p className={`text-sm font-semibold truncate ${inq.status === 'unread' ? 'text-white' : 'text-white/70'}`}>
                                {inq.name}
                              </p>
                            </div>
                            {/* Email */}
                            <div className="col-span-2 hidden md:block">
                              <p className="text-xs text-white/40 truncate">{inq.email}</p>
                            </div>
                            {/* Subject */}
                            <div className="col-span-3 hidden md:block">
                              <p className="text-xs text-white/40 truncate">{inq.subject}</p>
                            </div>
                            {/* Date */}
                            <div className="col-span-2 hidden md:block">
                              <p className="text-xs text-white/30">
                                {new Date(inq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                            {/* Status */}
                            <div className="col-span-1">
                              <StatusBadge status={inq.status} />
                            </div>
                            {/* Delete */}
                            <div className="col-span-1 flex justify-center">
                              <button
                                onClick={e => { e.stopPropagation(); handleDelete(inq._id, inq.name); }}
                                disabled={deleting === inq._id}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/15 text-white/30 hover:text-red-400 flex items-center justify-center transition-all"
                              >
                                {deleting === inq._id
                                  ? <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                  : <FaTrash size={11} />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Detail panel */}
            <div className="lg:col-span-1">
              {selectedInquiry ? (
                <div className="bg-[#111320] border border-white/5 rounded-2xl overflow-hidden sticky top-24">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Inquiry Detail</p>
                      <button onClick={() => setSelectedInquiry(null)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white flex items-center justify-center transition-all">
                        <FaTimes size={10} />
                      </button>
                    </div>
                    <h2 className="font-bold text-base text-white" style={{ fontFamily: 'Georgia, serif' }}>
                      {selectedInquiry.name}
                    </h2>
                    <div className="mt-2">
                      <StatusBadge status={selectedInquiry.status} />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="px-5 py-4 space-y-4 border-b border-white/5">
                    <DetailRow icon={<FaUser />}        label="Name"    value={selectedInquiry.name} />
                    <DetailRow icon={<FaEnvelope />}    label="Email"   value={selectedInquiry.email} />
                    {selectedInquiry.phone && <DetailRow icon={<FaPhone />} label="Phone" value={selectedInquiry.phone} />}
                    <DetailRow icon={<FaTag />}         label="Subject" value={selectedInquiry.subject} />
                    <DetailRow icon={<FaCalendarAlt />} label="Date"    value={new Date(selectedInquiry.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} />
                  </div>

                  {/* Message */}
                  <div className="px-5 py-4 border-b border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2">Message</p>
                    <div className="bg-white/[0.03] rounded-xl px-4 py-3">
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{selectedInquiry.message}</p>
                    </div>
                  </div>

                  {/* Status change */}
                  <div className="px-5 py-4 border-b border-white/5">
                    <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-2">Update Status</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['unread', 'read', 'replied'].map(s => {
                        const isActive = selectedInquiry.status === s;
                        const colors = { unread: 'bg-red-500/15 text-red-400 border-red-500/30', read: 'bg-blue-500/15 text-blue-400 border-blue-500/30', replied: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
                        return (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(selectedInquiry._id, s)}
                            className={[
                              'py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all',
                              isActive ? colors[s] : 'bg-white/5 text-white/30 border-transparent hover:bg-white/10 hover:text-white/60',
                            ].join(' ')}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reply button */}
                  <div className="px-5 py-4">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=Re: ${encodeURIComponent(selectedInquiry.subject)}`}
                      className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider"
                    >
                      <FaReply size={11} /> Reply via Email
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-[#111320] border border-white/5 rounded-2xl p-8 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <FaEnvelope className="text-white/20 text-xl" />
                  </div>
                  <p className="text-sm font-semibold text-white/40">Select an inquiry</p>
                  <p className="text-xs text-white/20 mt-1">Click any row to view details</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default InquiryManager;