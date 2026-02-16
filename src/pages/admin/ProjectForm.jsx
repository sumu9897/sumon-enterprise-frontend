import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import {
  FaSave, FaTimes, FaMapMarkerAlt, FaInfoCircle,
  FaImage, FaBuilding, FaClipboardList, FaCheckCircle,
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

/* ─────────────────────────────────────────────────────────────
   parseGoogleMapsUrl — extracts lat/lng from any Google Maps URL
   Supports:
   • https://maps.google.com/?q=23.8103,90.4125
   • https://www.google.com/maps/place/.../@23.8103,90.4125,17z/...
   • https://maps.app.goo.gl/... (short link — user must expand first)
   • https://www.google.com/maps?ll=23.8103,90.4125
   • Decimal degree pairs pasted directly: "23.8103, 90.4125"
───────────────────────────────────────────────────────────── */
const parseGoogleMapsUrl = (input) => {
  if (!input || !input.trim()) return null;
  const s = input.trim();

  // 1. Plain "lat, lng" pair
  const plain = s.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (plain) return { lat: plain[1], lng: plain[2] };

  // 2. @lat,lng in URL
  const atMatch = s.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };

  // 3. ?q=lat,lng
  const qMatch = s.match(/[?&]q=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };

  // 4. ll=lat,lng
  const llMatch = s.match(/ll=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (llMatch) return { lat: llMatch[1], lng: llMatch[2] };

  // 5. !3d{lat}!4d{lng} (embedded map URLs)
  const d3Match = s.match(/!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/);
  if (d3Match) return { lat: d3Match[1], lng: d3Match[2] };

  return null;
};

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dark = useDarkMode();
  const isEditMode = !!id;

  const bg    = dark ? '#0F1117' : '#F8F5EF';
  const card  = dark ? '#1C1E2A' : '#FFFFFF';
  const text  = dark ? '#E8E8F0' : '#1A1A2E';
  const sub   = dark ? '#888899' : '#6B6B8A';
  const bdr   = dark ? '#2A2A3E' : '#E8E4DC';
  const inp   = dark ? '#13151E' : '#FAFAFA';
  const gold  = '#C9A84C';
  const dark2 = dark ? '#13151E' : '#1A1A2E';

  const [formData, setFormData] = useState({
    projectName: '',
    company: '',
    description: '',
    'address.plot': '',
    'address.road': '',
    'address.block': '',
    'address.area': '',
    'address.city': 'Dhaka',
    status: 'Ongoing',
    startDate: '',
    finishDate: '',
    'specifications.floors': '',
    'specifications.areaPerFloor': '',
    'specifications.totalArea': '',
    'specifications.constructionType': '',
    featured: false,
    longitude: '90.4125',
    latitude: '23.8103',
  });

  const [images, setImages]           = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mapUrlInput, setMapUrlInput] = useState('');
  const [mapParsed, setMapParsed]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(false);

  useEffect(() => {
    if (isEditMode) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setFetching(true);
      const r = await api.get(`/projects/${id}`);
      const p = r.data.data;
      setFormData({
        projectName: p.projectName || '',
        company: p.company || '',
        description: p.description || '',
        'address.plot':  p.address?.plot  || '',
        'address.road':  p.address?.road  || '',
        'address.block': p.address?.block || '',
        'address.area':  p.address?.area  || '',
        'address.city':  p.address?.city  || 'Dhaka',
        status:    p.status    || 'Ongoing',
        startDate: p.startDate ? p.startDate.split('T')[0] : '',
        finishDate: p.finishDate ? p.finishDate.split('T')[0] : '',
        'specifications.floors':           p.specifications?.floors           || '',
        'specifications.areaPerFloor':     p.specifications?.areaPerFloor     || '',
        'specifications.totalArea':        p.specifications?.totalArea        || '',
        'specifications.constructionType': p.specifications?.constructionType || '',
        featured:  p.featured  || false,
        longitude: p.location?.coordinates?.[0] || '90.4125',
        latitude:  p.location?.coordinates?.[1] || '23.8103',
      });
    } catch {
      toast.error('Failed to load project');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    // Generate previews
    const readers = files.map(file => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then(setImagePreviews);
  };

  /* ── Parse map URL and fill lat/lng ── */
  const handleParseMapUrl = () => {
    const result = parseGoogleMapsUrl(mapUrlInput);
    if (result) {
      setFormData(prev => ({ ...prev, latitude: result.lat, longitude: result.lng }));
      setMapParsed(true);
      toast.success(`Location set: ${result.lat}, ${result.lng}`);
      setTimeout(() => setMapParsed(false), 3000);
    } else {
      toast.error('Could not extract coordinates. Try expanding short URLs first, or paste lat,lng directly (e.g. 23.8103, 90.4125)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    images.forEach(img => data.append('images', img));

    try {
      setLoading(true);
      if (isEditMode) {
        await api.put(`/projects/${id}`, data);
        toast.success('Project updated');
      } else {
        await api.post('/projects', data);
        toast.success('Project created');
      }
      navigate('/admin/projects');
    } catch (err) {
      toast.error(err.response?.data?.error?.message || 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
      <div style={{ width:40, height:40, border:`3px solid rgba(201,168,76,.2)`, borderTopColor:gold, borderRadius:'50%', animation:'spin .7s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const Section = ({ icon, title, children }) => (
    <div className="rounded-sm p-6 mb-6" style={{ background:card, border:`1px solid ${bdr}` }}>
      <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom:`1px solid ${bdr}` }}>
        <div className="w-8 h-8 rounded-sm flex items-center justify-center text-sm"
          style={{ background: dark?'#13151E':'#F7F3EC', color:gold }}>{icon}</div>
        <h2 className="serif font-bold text-lg" style={{ color:text }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  const Field = ({ label, required, hint, children }) => (
    <div>
      <label className="block text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
        {label}{required && <span className="ml-1" style={{ color:'#EF4444' }}>*</span>}
      </label>
      {children}
      {hint && <p className="text-xs mt-1" style={{ color:sub }}>{hint}</p>}
    </div>
  );

  const inputStyle = {
    width:'100%', padding:'10px 14px', borderRadius:2,
    fontSize:13, outline:'none', fontFamily:"'DM Sans',sans-serif",
    border:`1px solid ${bdr}`, background:inp, color:text,
    transition:'border-color .2s, box-shadow .2s',
  };

  const focusStyle = {
    onFocus: e => { e.target.style.borderColor=gold; e.target.style.boxShadow='0 0 0 3px rgba(201,168,76,.12)'; },
    onBlur:  e => { e.target.style.borderColor=bdr;  e.target.style.boxShadow='none'; },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        .form-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }
        .section-label { font-size:11px;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#C9A84C;display:block;margin-bottom:.5rem; }

        .btn-gold {
          display:inline-flex;align-items:center;gap:8px;padding:13px 28px;
          background:#C9A84C;color:white;font-weight:700;font-size:13px;
          letter-spacing:.12em;text-transform:uppercase;border-radius:2px;
          transition:all .25s;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;
        }
        .btn-gold:hover { opacity:.9; transform:translateY(-1px); }
        .btn-gold:disabled { opacity:.6;cursor:not-allowed;transform:none; }

        .btn-cancel {
          display:inline-flex;align-items:center;gap:8px;padding:11px 28px;
          border:2px solid var(--bdr);color:var(--sub);font-weight:700;font-size:13px;
          letter-spacing:.12em;text-transform:uppercase;border-radius:2px;
          background:transparent;transition:all .25s;cursor:pointer;font-family:'DM Sans',sans-serif;
        }
        .btn-cancel:hover { border-color:#EF4444;color:#EF4444; }

        .map-parse-btn {
          display:inline-flex;align-items:center;gap:6px;padding:10px 18px;
          background:#C9A84C;color:white;font-weight:700;font-size:12px;
          letter-spacing:.1em;text-transform:uppercase;border-radius:2px;
          border:none;cursor:pointer;transition:all .2s;white-space:nowrap;font-family:'DM Sans',sans-serif;
        }
        .map-parse-btn:hover { opacity:.9; }

        .img-preview { width:80px;height:80px;object-fit:cover;border-radius:2px;border:2px solid var(--bdr); }

        @keyframes spin { to{transform:rotate(360deg)} }
        .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:white;border-radius:50%;animation:spin .6s linear infinite; }
      `}</style>

      <div className="form-root min-h-screen"
        style={{ background:bg, color:text, '--bdr':bdr, '--sub':sub }}>

        {/* ── PAGE HEADER ── */}
        <div className="border-b" style={{ background:dark2, borderColor:bdr }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
            <span className="section-label">Admin Panel</span>
            <h1 className="serif font-black text-white" style={{ fontSize:'clamp(1.6rem,4vw,2.2rem)' }}>
              {isEditMode ? 'Edit ' : 'Add New '}
              <span style={{ color:gold }}>Project</span>
            </h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>

            {/* ══ BASIC INFO ══ */}
            <Section icon={<FaBuilding />} title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Project Name" required>
                  <input name="projectName" type="text" required
                    value={formData.projectName} onChange={handleChange}
                    placeholder="e.g. Bashundhara Heights"
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Company" required>
                  <input name="company" type="text" required
                    value={formData.company} onChange={handleChange}
                    placeholder="e.g. M/S Sumon Enterprise"
                    style={inputStyle} {...focusStyle} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description" required>
                    <textarea name="description" required rows="4"
                      value={formData.description} onChange={handleChange}
                      placeholder="Describe the project scope, type, and highlights…"
                      style={{ ...inputStyle, resize:'vertical', lineHeight:'1.6' }}
                      {...focusStyle} />
                  </Field>
                </div>
              </div>
            </Section>

            {/* ══ ADDRESS ══ */}
            <Section icon={<FaMapMarkerAlt />} title="Address">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field label="Plot" hint="e.g. 34">
                  <input name="address.plot" type="text"
                    value={formData['address.plot']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Road" hint="e.g. 7">
                  <input name="address.road" type="text"
                    value={formData['address.road']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Block" hint="e.g. C">
                  <input name="address.block" type="text"
                    value={formData['address.block']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Area" required hint="e.g. Bashundhara">
                  <input name="address.area" type="text" required
                    value={formData['address.area']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="City" required>
                  <input name="address.city" type="text" required
                    value={formData['address.city']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
              </div>
            </Section>

            {/* ══ LOCATION — MAP URL FEATURE ══ */}
            <Section icon={<FaMapMarkerAlt />} title="Map Location (GPS Coordinates)">

              {/* HOW-TO instructions */}
              <div className="rounded-sm p-4 mb-5" style={{ background: dark?'rgba(201,168,76,.07)':'rgba(201,168,76,.06)', border:`1px solid rgba(201,168,76,.2)` }}>
                <div className="flex gap-3">
                  <FaInfoCircle className="flex-shrink-0 mt-0.5" style={{ color:gold }} />
                  <div>
                    <p className="text-sm font-bold mb-2" style={{ color:gold }}>How to get coordinates from Google Maps</p>
                    <ol className="space-y-1.5 text-xs" style={{ color:sub }}>
                      <li><span className="font-bold" style={{ color:text }}>1.</span> Go to <strong style={{ color:text }}>Google Maps</strong> and find the project location</li>
                      <li><span className="font-bold" style={{ color:text }}>2.</span> Right-click on the exact spot → click <strong style={{ color:text }}>"What's here?"</strong></li>
                      <li><span className="font-bold" style={{ color:text }}>3.</span> Copy the coordinates that appear (e.g. <code style={{ background: dark?'#0F1117':'#F0EDE8', padding:'1px 5px', borderRadius:2 }}>23.8103, 90.4125</code>)</li>
                      <li><span className="font-bold" style={{ color:text }}>4.</span> <strong style={{ color:text }}>OR</strong> copy the full URL from the address bar and paste it below</li>
                      <li><span className="font-bold" style={{ color:text }}>5.</span> Click <strong style={{ color:text }}>"Extract"</strong> — coordinates fill automatically ✓</li>
                    </ol>
                    <p className="text-xs mt-2 pt-2" style={{ color:sub, borderTop:`1px solid ${bdr}` }}>
                      <strong style={{ color:'#F59E0B' }}>⚠ Short URLs</strong> (maps.app.goo.gl/...) must be opened in your browser first — then copy the full URL from the address bar.
                    </p>
                  </div>
                </div>
              </div>

              {/* URL Input + Parse button */}
              <Field label="Paste Google Maps URL or Coordinates">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mapUrlInput}
                    onChange={e => setMapUrlInput(e.target.value)}
                    placeholder="https://www.google.com/maps/place/...  or  23.8103, 90.4125"
                    style={{ ...inputStyle, flex:1 }}
                    {...focusStyle}
                  />
                  <button type="button" onClick={handleParseMapUrl} className="map-parse-btn">
                    {mapParsed ? <FaCheckCircle /> : <FaMapMarkerAlt />}
                    {mapParsed ? 'Done!' : 'Extract'}
                  </button>
                </div>
              </Field>

              {/* Manual lat/lng */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <Field label="Latitude" hint="e.g. 23.8103">
                  <input name="latitude" type="text"
                    value={formData.latitude} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Longitude" hint="e.g. 90.4125">
                  <input name="longitude" type="text"
                    value={formData.longitude} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
              </div>

              {/* Live map preview */}
              {formData.latitude && formData.longitude && (
                <div className="mt-4">
                  <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color:gold }}>
                    Map Preview
                  </p>
                  <div className="rounded-sm overflow-hidden" style={{ height:200, border:`1px solid ${bdr}` }}>
                    <iframe
                      key={`${formData.latitude}-${formData.longitude}`}
                      title="Location preview"
                      src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                      width="100%" height="100%"
                      style={{ border:0, filter: dark?'invert(.9) hue-rotate(180deg) saturate(.7)':'none' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </Section>

            {/* ══ PROJECT DETAILS ══ */}
            <Section icon={<FaClipboardList />} title="Project Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Status" required>
                  <select name="status" required value={formData.status} onChange={handleChange}
                    style={inputStyle} {...focusStyle}>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Finished">Finished</option>
                  </select>
                </Field>

                <Field label="Start Date" required>
                  <input name="startDate" type="date" required
                    value={formData.startDate} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>

                <Field label="Finish Date" hint="Leave blank if project is ongoing">
                  <input name="finishDate" type="date"
                    value={formData.finishDate} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input type="checkbox" name="featured"
                        checked={formData.featured} onChange={handleChange}
                        className="sr-only" />
                      <div
                        className="w-12 h-6 rounded-full transition-colors duration-200 flex items-center px-1"
                        style={{ background: formData.featured ? gold : bdr }}
                        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                      >
                        <div
                          className="w-4 h-4 rounded-full bg-white transition-transform duration-200"
                          style={{ transform: formData.featured ? 'translateX(24px)' : 'translateX(0)' }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color:text }}>Featured Project</p>
                      <p className="text-xs" style={{ color:sub }}>Shows on home page</p>
                    </div>
                  </label>
                </div>
              </div>
            </Section>

            {/* ══ SPECIFICATIONS ══ */}
            <Section icon={<FaClipboardList />} title="Specifications">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Floors" hint="e.g. G+9">
                  <input name="specifications.floors" type="text"
                    value={formData['specifications.floors']} onChange={handleChange}
                    placeholder="G+9" style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Area per Floor" hint="e.g. 3200 sqft">
                  <input name="specifications.areaPerFloor" type="text"
                    value={formData['specifications.areaPerFloor']} onChange={handleChange}
                    placeholder="3200 sqft" style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Total Area">
                  <input name="specifications.totalArea" type="text"
                    value={formData['specifications.totalArea']} onChange={handleChange}
                    style={inputStyle} {...focusStyle} />
                </Field>
                <Field label="Construction Type" hint="e.g. Fair-Face, RCC">
                  <input name="specifications.constructionType" type="text"
                    value={formData['specifications.constructionType']} onChange={handleChange}
                    placeholder="Fair-Face" style={inputStyle} {...focusStyle} />
                </Field>
              </div>
            </Section>

            {/* ══ IMAGES ══ */}
            <Section icon={<FaImage />} title="Project Images">
              <Field label="Upload Images" hint="Select multiple images — max 5MB each (JPEG/PNG/WebP)">
                <div
                  className="relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors hover:border-[#C9A84C]"
                  style={{ borderColor:bdr }}
                  onClick={() => document.getElementById('img-upload').click()}
                >
                  <FaImage className="mx-auto mb-2 text-3xl" style={{ color: gold }} />
                  <p className="text-sm font-semibold" style={{ color:text }}>
                    Click to select images
                  </p>
                  <p className="text-xs mt-1" style={{ color:sub }}>
                    {images.length > 0 ? `${images.length} file(s) selected` : 'JPEG, PNG, WebP · up to 5MB each'}
                  </p>
                  <input id="img-upload" type="file" multiple accept="image/*"
                    onChange={handleImageChange} className="sr-only" />
                </div>
              </Field>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={`Preview ${i+1}`} className="img-preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-sm flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{i+1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* ══ ACTIONS ══ */}
            <div className="flex gap-4 flex-wrap">
              <button type="submit" disabled={loading} className="btn-gold">
                {loading
                  ? <><div className="spinner" /> Saving…</>
                  : <><FaSave size={13} /> {isEditMode ? 'Update Project' : 'Create Project'}</>
                }
              </button>
              <button type="button" onClick={() => navigate('/admin/projects')} className="btn-cancel">
                <FaTimes size={13} /> Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectForm;