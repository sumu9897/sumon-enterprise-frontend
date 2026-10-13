import { useEffect, useId, useState } from 'react';
import { toast } from 'react-toastify';
import { FaBuilding, FaEnvelope, FaHistory, FaImages, FaPlus, FaSave, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../../components/AdminSidebar';
import api, { getApiErrorMessage } from '../../services/api';
import defaultSiteContent from '../../data/defaultSiteContent';

const TABS = [
  { key: 'about', label: 'About', icon: <FaHistory /> },
  { key: 'services', label: 'Services', icon: <FaBuilding /> },
  { key: 'gallery', label: 'Gallery', icon: <FaImages /> },
  { key: 'contact', label: 'Contact', icon: <FaEnvelope /> },
];

const cloneDefaults = () => JSON.parse(JSON.stringify(defaultSiteContent));

const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10';
const Label = ({ title, children }) => <label className="block"><span className="text-xs font-semibold text-white/55">{title}</span>{children}</label>;
const TextInput = ({ title, ...props }) => <Label title={title}><input className={inputClass} {...props} /></Label>;
const TextArea = ({ title, ...props }) => <Label title={title}><textarea className={`${inputClass} min-h-28 resize-y`} {...props} /></Label>;
const RemoveButton = ({ onClick, label = 'Remove' }) => <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10"><FaTrash />{label}</button>;

const ImageField = ({ title = 'Image', value, onChange }) => {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const payload = new FormData();
    payload.append('image', file);
    try {
      setUploading(true);
      const response = await api.post('/site-content/images', payload);
      onChange(response.data.data.url);
      toast.success('Image uploaded. Save all changes to publish it.', { toastId: `image-upload-${inputId}` });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Image could not be uploaded.'), { toastId: `image-upload-error-${inputId}` });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <span className="text-xs font-semibold text-white/55">{title}</span>
      <div className="mt-2 grid gap-3 sm:grid-cols-[112px_1fr]">
        <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:aspect-square">
          {value ? <img src={value} alt={`${title} preview`} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-2xl text-white/15"><FaImages /></div>}
        </div>
        <div className="space-y-3">
          <input className={`${inputClass} mt-0`} type="url" value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder="https://…" />
          <input id={inputId} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={uploadImage} />
          <label htmlFor={inputId} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20 ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
            <FaImages />{uploading ? 'Uploading…' : 'Upload image'}
          </label>
          <p className="text-[11px] text-white/30">JPEG, PNG or WebP · maximum 5MB</p>
        </div>
      </div>
    </div>
  );
};

const ContentManager = () => {
  const [tab, setTab] = useState('about');
  const [content, setContent] = useState(cloneDefaults);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.get('/site-content/admin'), api.get('/projects?limit=100')])
      .then(([contentResult, projectsResult]) => {
        if (!active) return;
        const data = contentResult.status === 'fulfilled' ? contentResult.value.data.data || {} : cloneDefaults();
        const loadedProjects = projectsResult.status === 'fulfilled' ? projectsResult.value.data.data || [] : [];
        const fallbackGallery = loadedProjects.flatMap((project) => (project.images || []).map((image, index) => ({ imageUrl: image.url, caption: image.caption || project.projectName, project: project._id, order: index, active: true })));
        setContent({
          about: { ...defaultSiteContent.about, ...(data.about || {}) },
          services: data.services?.length ? data.services : defaultSiteContent.services,
          contact: { ...defaultSiteContent.contact, ...(data.contact || {}) },
          gallery: (data.gallery?.length ? data.gallery : fallbackGallery).map((item) => ({ ...item, project: item.project?._id || item.project })),
        });
        setProjects(loadedProjects);
        if (contentResult.status === 'rejected') {
          toast.error(getApiErrorMessage(contentResult.reason, 'CMS content could not be loaded.'), {
            toastId: 'cms-content-load-error',
          });
        }
        if (projectsResult.status === 'rejected') {
          toast.error(getApiErrorMessage(projectsResult.reason, 'Projects could not be loaded.'), {
            toastId: 'cms-projects-load-error',
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const setAbout = (field, value) => setContent((current) => ({ ...current, about: { ...current.about, [field]: value } }));
  const setContact = (field, value) => setContent((current) => ({ ...current, contact: { ...current.contact, [field]: value } }));
  const updateArray = (section, index, field, value) => setContent((current) => ({
    ...current,
    [section]: current[section].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }));
  const removeArray = (section, index) => setContent((current) => ({ ...current, [section]: current[section].filter((_, itemIndex) => itemIndex !== index) }));
  const addArray = (section, item) => setContent((current) => ({ ...current, [section]: [...current[section], item] }));
  const updateAboutArray = (section, index, field, value) => setContent((current) => ({ ...current, about: { ...current.about, [section]: current.about[section].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) } }));
  const removeAboutArray = (section, index) => setContent((current) => ({ ...current, about: { ...current.about, [section]: current.about[section].filter((_, itemIndex) => itemIndex !== index) } }));
  const addAboutArray = (section, item) => setContent((current) => ({ ...current, about: { ...current.about, [section]: [...current.about[section], item] } }));

  const save = async () => {
    try {
      setSaving(true);
      await api.put('/site-content', content);
      toast.success('Website content published successfully.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Content could not be saved.'));
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-[#0D0F18] text-white"><AdminSidebar /><div className="pt-28 text-center text-white/40 md:ml-64">Loading content manager…</div></div>;

  return (
    <div className="flex min-h-screen bg-[#0D0F18] text-white">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-20 sm:px-8 md:ml-64 md:pt-8">
        <header className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-400">Website CMS</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="font-heading text-3xl sm:text-4xl">Content manager</h1><p className="mt-2 text-sm text-white/40">Update public website content without editing code.</p></div>
            <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#111320] transition hover:bg-amber-300 disabled:opacity-50"><FaSave />{saving ? 'Saving…' : 'Save all changes'}</button>
          </div>
        </header>

        <div className="mx-auto mt-8 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/5 bg-[#111320] p-2">
            {TABS.map((item) => <button type="button" key={item.key} onClick={() => setTab(item.key)} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${tab === item.key ? 'bg-amber-400 text-[#111320]' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}>{item.icon}{item.label}</button>)}
          </div>

          {tab === 'about' && <section className="mt-6 space-y-6">
            <div className="grid gap-5 rounded-2xl border border-white/5 bg-[#111320] p-5 sm:grid-cols-2 sm:p-6">
              <TextInput title="Eyebrow" value={content.about.eyebrow} onChange={(e) => setAbout('eyebrow', e.target.value)} />
              <TextInput title="Page title" value={content.about.title} onChange={(e) => setAbout('title', e.target.value)} />
              <TextInput title="Subtitle" value={content.about.subtitle} onChange={(e) => setAbout('subtitle', e.target.value)} />
              <TextInput title="Story heading" value={content.about.heading} onChange={(e) => setAbout('heading', e.target.value)} />
              <div className="sm:col-span-2"><ImageField title="Story image" value={content.about.imageUrl || ''} onChange={(value) => setAbout('imageUrl', value)} /></div>
              <div className="sm:col-span-2"><TextArea title="Story paragraphs (one paragraph per line)" value={(content.about.paragraphs || []).join('\n')} onChange={(e) => setAbout('paragraphs', e.target.value.split('\n').filter(Boolean))} /></div>
            </div>
            <EditorList title="Milestones" onAdd={() => addAboutArray('milestones', { year: '', title: '', description: '' })}>
              {(content.about.milestones || []).map((item, index) => <div key={item._id || index} className="grid gap-3 rounded-xl border border-white/5 bg-white/[.02] p-4 md:grid-cols-[120px_1fr_2fr_auto]"><input className={inputClass} placeholder="Year" value={item.year || ''} onChange={(e) => updateAboutArray('milestones', index, 'year', e.target.value)} /><input className={inputClass} placeholder="Title" value={item.title || ''} onChange={(e) => updateAboutArray('milestones', index, 'title', e.target.value)} /><input className={inputClass} placeholder="Description" value={item.description || ''} onChange={(e) => updateAboutArray('milestones', index, 'description', e.target.value)} /><RemoveButton onClick={() => removeAboutArray('milestones', index)} /></div>)}
            </EditorList>
            <EditorList title="Company values" onAdd={() => addAboutArray('values', { title: '', description: '' })}>
              {(content.about.values || []).map((item, index) => <div key={item._id || index} className="grid gap-3 rounded-xl border border-white/5 bg-white/[.02] p-4 md:grid-cols-[1fr_2fr_auto]"><input className={inputClass} placeholder="Value title" value={item.title || ''} onChange={(e) => updateAboutArray('values', index, 'title', e.target.value)} /><input className={inputClass} placeholder="Description" value={item.description || ''} onChange={(e) => updateAboutArray('values', index, 'description', e.target.value)} /><RemoveButton onClick={() => removeAboutArray('values', index)} /></div>)}
            </EditorList>
          </section>}

          {tab === 'services' && <EditorList title="Services" className="mt-6" onAdd={() => addArray('services', { title: '', tagline: '', description: '', imageUrl: '', features: [], order: content.services.length, active: true })}>
            {content.services.map((service, index) => <div key={service._id || index} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[.02] p-4 lg:grid-cols-2">
              <TextInput title="Service title" value={service.title || ''} onChange={(e) => updateArray('services', index, 'title', e.target.value)} />
              <TextInput title="Tagline" value={service.tagline || ''} onChange={(e) => updateArray('services', index, 'tagline', e.target.value)} />
              <ImageField title="Service image" value={service.imageUrl || ''} onChange={(value) => updateArray('services', index, 'imageUrl', value)} />
              <TextInput title="Display order" type="number" min="0" value={service.order ?? index} onChange={(e) => updateArray('services', index, 'order', Number(e.target.value))} />
              <TextArea title="Description" value={service.description || ''} onChange={(e) => updateArray('services', index, 'description', e.target.value)} />
              <TextArea title="Features (one per line)" value={(service.features || []).join('\n')} onChange={(e) => updateArray('services', index, 'features', e.target.value.split('\n').filter(Boolean))} />
              <div className="flex items-center justify-between lg:col-span-2"><label className="flex items-center gap-2 text-sm text-white/60"><input type="checkbox" checked={service.active !== false} onChange={(e) => updateArray('services', index, 'active', e.target.checked)} />Visible on website</label><RemoveButton onClick={() => removeArray('services', index)} /></div>
            </div>)}
          </EditorList>}

          {tab === 'gallery' && <EditorList title="Project-linked gallery" className="mt-6" onAdd={() => addArray('gallery', { imageUrl: '', caption: '', project: '', order: content.gallery.length, active: true })}>
            <p className="-mt-3 text-xs leading-5 text-white/35">Every image must reference a project. Visitors can open that project directly from the image overlay.</p>
            {content.gallery.map((item, index) => <div key={item._id || index} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[.02] p-4 lg:grid-cols-[140px_1fr_auto]">
              <div className="aspect-square overflow-hidden rounded-xl bg-white/5">{item.imageUrl ? <img src={item.imageUrl} alt="Gallery preview" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-3xl text-white/10"><FaImages /></div>}</div>
              <div className="grid gap-3 sm:grid-cols-2"><Label title="Linked project"><select required className={inputClass} value={item.project || ''} onChange={(e) => { const project = projects.find((entry) => entry._id === e.target.value); updateArray('gallery', index, 'project', e.target.value); if (!item.imageUrl && project?.images?.[0]?.url) updateArray('gallery', index, 'imageUrl', project.images[0].url); }}><option value="">Select project</option>{projects.map((project) => <option key={project._id} value={project._id}>{project.projectName}</option>)}</select></Label><TextInput title="Display order" type="number" min="0" value={item.order ?? index} onChange={(e) => updateArray('gallery', index, 'order', Number(e.target.value))} /><div className="sm:col-span-2"><ImageField title="Gallery image" value={item.imageUrl || ''} onChange={(value) => updateArray('gallery', index, 'imageUrl', value)} /></div><div className="sm:col-span-2"><TextInput title="Caption" value={item.caption || ''} onChange={(e) => updateArray('gallery', index, 'caption', e.target.value)} /></div><label className="flex items-center gap-2 text-sm text-white/60"><input type="checkbox" checked={item.active !== false} onChange={(e) => updateArray('gallery', index, 'active', e.target.checked)} />Visible on website</label></div>
              <RemoveButton onClick={() => removeArray('gallery', index)} />
            </div>)}
          </EditorList>}

          {tab === 'contact' && <section className="mt-6 space-y-6 rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2"><TextInput title="Phone" value={content.contact.phone || ''} onChange={(e) => setContact('phone', e.target.value)} /><TextInput title="WhatsApp number" value={content.contact.whatsapp || ''} onChange={(e) => setContact('whatsapp', e.target.value)} /><TextInput title="Email" type="email" value={content.contact.email || ''} onChange={(e) => setContact('email', e.target.value)} /><TextInput title="Office address" value={content.contact.address || ''} onChange={(e) => setContact('address', e.target.value)} /><TextInput title="Facebook URL" type="url" value={content.contact.facebookUrl || ''} onChange={(e) => setContact('facebookUrl', e.target.value)} /><TextInput title="Google Maps embed URL" type="url" value={content.contact.mapEmbedUrl || ''} onChange={(e) => setContact('mapEmbedUrl', e.target.value)} /></div>
            <div><div className="mb-3 flex items-center justify-between"><h2 className="font-heading text-xl">Office hours</h2><button type="button" onClick={() => setContact('officeHours', [...(content.contact.officeHours || []), { day: '', hours: '', open: true }])} className="inline-flex items-center gap-2 text-xs font-bold text-amber-400"><FaPlus />Add day</button></div>{(content.contact.officeHours || []).map((item, index) => <div key={item._id || index} className="grid gap-3 border-t border-white/5 py-3 sm:grid-cols-[1fr_2fr_auto_auto]"><input className={inputClass} placeholder="Day" value={item.day || ''} onChange={(e) => setContact('officeHours', content.contact.officeHours.map((row, rowIndex) => rowIndex === index ? { ...row, day: e.target.value } : row))} /><input className={inputClass} placeholder="Hours" value={item.hours || ''} onChange={(e) => setContact('officeHours', content.contact.officeHours.map((row, rowIndex) => rowIndex === index ? { ...row, hours: e.target.value } : row))} /><label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" checked={item.open !== false} onChange={(e) => setContact('officeHours', content.contact.officeHours.map((row, rowIndex) => rowIndex === index ? { ...row, open: e.target.checked } : row))} />Open</label><RemoveButton onClick={() => setContact('officeHours', content.contact.officeHours.filter((_, rowIndex) => rowIndex !== index))} /></div>)}</div>
          </section>}
        </div>
      </main>
    </div>
  );
};

const EditorList = ({ title, onAdd, children, className = '' }) => <section className={`space-y-4 rounded-2xl border border-white/5 bg-[#111320] p-5 sm:p-6 ${className}`}><div className="flex items-center justify-between gap-3"><h2 className="font-heading text-xl">{title}</h2><button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-400 transition hover:bg-amber-400/20"><FaPlus />Add item</button></div>{children}</section>;

export default ContentManager;
