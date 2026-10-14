import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSave, FaTrash, FaUserPlus, FaUsers } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import api, { getApiErrorMessage } from '../../services/api';
import { ADMIN_PERMISSION_GROUPS } from '../../constants/adminPermissions';

const emptyForm = { name: '', email: '', password: '', permissions: [] };

const PermissionEditor = ({ value, onChange, disabled = false }) => {
  const toggle = (permission) => {
    onChange(value.includes(permission)
      ? value.filter((item) => item !== permission)
      : [...value, permission]);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {ADMIN_PERMISSION_GROUPS.map((group) => (
        <fieldset key={group.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4" disabled={disabled}>
          <legend className="px-2 text-xs font-bold uppercase tracking-widest text-amber-400">{group.label}</legend>
          <div className="space-y-2">
            {group.permissions.map(([permission, label]) => (
              <label key={permission} className="flex cursor-pointer items-center gap-3 text-sm text-white/65">
                <input type="checkbox" checked={value.includes(permission)} onChange={() => toggle(permission)} className="h-4 w-4 accent-amber-400" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
};

const UserManager = () => {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadAdmins = async () => {
    try {
      const response = await api.get('/auth/admins');
      setAdmins(response.data.data || []);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Users could not be loaded.'), { toastId: 'admin-users-load' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const createAdmin = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await api.post('/auth/register', form);
      setAdmins((current) => [...current, response.data.data.admin]);
      setForm(emptyForm);
      toast.success('Administrator created.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Administrator could not be created.'));
    } finally {
      setSaving(false);
    }
  };

  const updateLocal = (id, patch) => setAdmins((current) => current.map((admin) => (
    admin._id === id ? { ...admin, ...patch } : admin
  )));

  const saveAccess = async (admin) => {
    try {
      setBusyId(admin._id);
      const response = await api.put(`/auth/admins/${admin._id}`, {
        name: admin.name,
        permissions: admin.permissions,
        isActive: admin.isActive,
      });
      updateLocal(admin._id, response.data.data);
      toast.success('Access updated. Existing sessions were revoked.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Access could not be updated.'));
      await loadAdmins();
    } finally {
      setBusyId(null);
    }
  };

  const removeAdmin = async (admin) => {
    if (!window.confirm(`Delete administrator "${admin.name}"?`)) return;
    try {
      setBusyId(admin._id);
      await api.delete(`/auth/admins/${admin._id}`);
      setAdmins((current) => current.filter((item) => item._id !== admin._id));
      toast.success('Administrator deleted.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Administrator could not be deleted.'));
    } finally {
      setBusyId(null);
    }
  };

  const inputClass = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-amber-400/50';

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white">
      <AdminSidebar />
      <main className="min-w-0 flex-1 pt-16 md:ml-64 md:pt-0">
        <header className="border-b border-white/5 px-4 py-5 sm:px-8">
          <h1 className="font-heading text-2xl">Users & <span className="text-amber-400">Access</span></h1>
          <p className="mt-1 text-sm text-white/35">Create administrator accounts and control exactly what each person can change.</p>
        </header>

        <div className="space-y-6 px-4 py-6 sm:px-8">
          <form onSubmit={createAdmin} className="space-y-5 rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6">
            <div className="flex items-center gap-3"><FaUserPlus className="text-amber-400" /><h2 className="font-heading text-xl">Add administrator</h2></div>
            <div className="grid gap-4 md:grid-cols-3">
              <input className={inputClass} placeholder="Full name" required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={inputClass} placeholder="Email address" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className={inputClass} placeholder="Temporary password (12+ characters)" required minLength={12} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <PermissionEditor value={form.permissions} onChange={(permissions) => setForm({ ...form, permissions })} />
            <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#111320] disabled:opacity-50"><FaUserPlus />{saving ? 'Creating…' : 'Create administrator'}</button>
          </form>

          <section className="space-y-4">
            <div className="flex items-center gap-3"><FaUsers className="text-amber-400" /><h2 className="font-heading text-xl">Current administrators</h2></div>
            {loading ? <p className="text-sm text-white/40">Loading users…</p> : admins.map((admin) => {
              const primary = admin.role === 'superadmin';
              return (
                <article key={admin._id} className="space-y-5 rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2"><h3 className="font-bold">{admin.name}</h3>{primary && <span className="rounded-full bg-amber-400/15 px-2 py-1 text-[10px] font-bold uppercase text-amber-400">Superadmin</span>}</div>
                      <p className="text-sm text-white/35">{admin.email}</p>
                    </div>
                    {!primary && <label className="flex items-center gap-2 text-sm text-white/60"><input type="checkbox" checked={admin.isActive !== false} onChange={(e) => updateLocal(admin._id, { isActive: e.target.checked })} className="h-4 w-4 accent-emerald-400" />Account active</label>}
                  </div>
                  {primary ? <p className="rounded-xl border border-amber-400/15 bg-amber-400/5 p-4 text-sm text-amber-200/70">The primary administrator has full access and cannot be restricted here.</p> : <PermissionEditor value={admin.permissions || []} onChange={(permissions) => updateLocal(admin._id, { permissions })} />}
                  {!primary && <div className="flex flex-wrap gap-3"><button type="button" disabled={busyId === admin._id} onClick={() => saveAccess(admin)} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-[#111320] disabled:opacity-50"><FaSave />Save access</button><button type="button" disabled={busyId === admin._id} onClick={() => removeAdmin(admin)} className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 disabled:opacity-50"><FaTrash />Delete user</button></div>}
                </article>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserManager;
