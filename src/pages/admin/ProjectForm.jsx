import { useState, useEffect, memo } from 'react';
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

const parseGoogleMapsUrl = (input) => {
  if (!input || !input.trim()) return null;
  const s = input.trim();
  const plain = s.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (plain) return { lat: plain[1], lng: plain[2] };
  const atMatch = s.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };
  const qMatch = s.match(/[?&]q=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };
  const llMatch = s.match(/ll=(-?\d+\.?\d+),(-?\d+\.?\d+)/);
  if (llMatch) return { lat: llMatch[1], lng: llMatch[2] };
  const d3Match = s.match(/!3d(-?\d+\.?\d+)!4d(-?\d+\.?\d+)/);
  if (d3Match) return { lat: d3Match[1], lng: d3Match[2] };
  return null;
};

// ══════════════════════════════════════════════════════════════
// CRITICAL: These components MUST be outside the main component
// to prevent React from recreating them on every render
// ══════════════════════════════════════════════════════════════

const Section = memo(({ icon, title, children }) => (
  <div className="section-card">
    <div className="section-header">
      <div className="section-icon">{icon}</div>
      <h2 className="section-title">{title}</h2>
    </div>
    {children}
  </div>
));
Section.displayName = 'Section';

const Field = memo(({ label, required, hint, children }) => (
  <div className="field">
    <label className="field-label">
      {label}{required && <span className="required">*</span>}
    </label>
    {children}
    {hint && <p className="field-hint">{hint}</p>}
  </div>
));
Field.displayName = 'Field';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dark = useDarkMode();
  const isEditMode = !!id;

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

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [mapUrlInput, setMapUrlInput] = useState('');
  const [mapParsed, setMapParsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          setFetching(true);
          const r = await api.get(`/projects/${id}`);
          const p = r.data.data;
          setFormData({
            projectName: p.projectName || '',
            company: p.company || '',
            description: p.description || '',
            'address.plot': p.address?.plot || '',
            'address.road': p.address?.road || '',
            'address.block': p.address?.block || '',
            'address.area': p.address?.area || '',
            'address.city': p.address?.city || 'Dhaka',
            status: p.status || 'Ongoing',
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            finishDate: p.finishDate ? p.finishDate.split('T')[0] : '',
            'specifications.floors': p.specifications?.floors || '',
            'specifications.areaPerFloor': p.specifications?.areaPerFloor || '',
            'specifications.totalArea': p.specifications?.totalArea || '',
            'specifications.constructionType': p.specifications?.constructionType || '',
            featured: p.featured || false,
            longitude: p.location?.coordinates?.[0] || '90.4125',
            latitude: p.location?.coordinates?.[1] || '23.8103',
          });
        } catch {
          toast.error('Failed to load project');
        } finally {
          setFetching(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const readers = files.map(file => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    }));
    Promise.all(readers).then(setImagePreviews);
  };

  const handleParseMapUrl = () => {
    const result = parseGoogleMapsUrl(mapUrlInput);
    if (result) {
      setFormData(prev => ({ ...prev, latitude: result.lat, longitude: result.lng }));
      setMapParsed(true);
      toast.success(`Location set: ${result.lat}, ${result.lng}`);
      setTimeout(() => setMapParsed(false), 3000);
    } else {
      toast.error('Could not extract coordinates');
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

  if (fetching) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <style>{`
          .loading-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:${dark?'#0F1117':'#F8F5EF'}}
          .spinner{width:40px;height:40px;border:3px solid rgba(201,168,76,.2);border-top-color:#C9A84C;border-radius:50%;animation:spin .7s linear infinite}
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        .form-root {
          font-family: 'DM Sans', sans-serif;
          background: ${dark ? '#0F1117' : '#F8F5EF'};
          color: ${dark ? '#E8E8F0' : '#1A1A2E'};
          min-height: 100vh;
        }
        .serif { font-family: 'Playfair Display', serif; }
        
        .page-header {
          background: ${dark ? '#13151E' : '#1A1A2E'};
          border-bottom: 1px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
        }
        
        .section-label {
          font-size: 11px; font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: #C9A84C; margin-bottom: .5rem;
        }
        
        .section-card {
          background: ${dark ? '#1C1E2A' : '#FFFFFF'};
          border: 1px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
          border-radius: 2px; padding: 24px; margin-bottom: 24px;
        }
        
        .section-header {
          display: flex; align-items: center; gap: 12px;
          padding-bottom: 16px; margin-bottom: 20px;
          border-bottom: 1px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
        }
        
        .section-icon {
          width: 32px; height: 32px; border-radius: 2px;
          display: flex; align-items: center; justify-content: center;
          background: ${dark ? '#13151E' : '#F7F3EC'};
          color: #C9A84C; font-size: 14px;
        }
        
        .section-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 18px;
          color: ${dark ? '#E8E8F0' : '#1A1A2E'};
        }
        
        .field { margin-bottom: 0; }
        
        .field-label {
          display: block; font-size: 11px; font-weight: 700;
          letter-spacing: .28em; text-transform: uppercase;
          color: #C9A84C; margin-bottom: 8px;
        }
        
        .required { color: #EF4444; margin-left: 4px; }
        .field-hint {
          font-size: 12px; color: ${dark ? '#888899' : '#6B6B8A'};
          margin-top: 4px;
        }
        
        .form-input, .form-textarea, .form-select {
          width: 100%; padding: 10px 14px; border-radius: 2px;
          font-size: 13px; outline: none; font-family: 'DM Sans', sans-serif;
          border: 1px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
          background: ${dark ? '#13151E' : '#FAFAFA'};
          color: ${dark ? '#E8E8F0' : '#1A1A2E'};
          transition: border-color .2s, box-shadow .2s;
        }
        
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #C9A84C;
          box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.12);
        }
        
        .form-textarea { resize: vertical; line-height: 1.6; }
        
        .info-box {
          background: ${dark ? 'rgba(201,168,76,.07)' : 'rgba(201,168,76,.06)'};
          border: 1px solid rgba(201,168,76,.2);
          border-radius: 2px; padding: 16px; margin-bottom: 20px;
        }
        
        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; background: #C9A84C; color: white;
          font-weight: 700; font-size: 13px; letter-spacing: .12em;
          text-transform: uppercase; border-radius: 2px;
          border: none; cursor: pointer; transition: all .25s;
        }
        .btn-gold:hover { opacity: .9; transform: translateY(-1px); }
        .btn-gold:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        
        .btn-cancel {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px; border: 2px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
          color: ${dark ? '#888899' : '#6B6B8A'}; font-weight: 700;
          font-size: 13px; letter-spacing: .12em; text-transform: uppercase;
          border-radius: 2px; background: transparent;
          cursor: pointer; transition: all .25s;
        }
        .btn-cancel:hover { border-color: #EF4444; color: #EF4444; }
        
        .map-parse-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 18px; background: #C9A84C; color: white;
          font-weight: 700; font-size: 12px; letter-spacing: .1em;
          text-transform: uppercase; border-radius: 2px; border: none;
          cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .map-parse-btn:hover { opacity: .9; }
        
        .img-preview {
          width: 80px; height: 80px; object-fit: cover;
          border-radius: 2px; border: 2px solid ${dark ? '#2A2A3E' : '#E8E4DC'};
        }
        
        .toggle-switch {
          width: 48px; height: 24px; border-radius: 12px;
          display: flex; align-items: center; padding: 0 2px;
          cursor: pointer; transition: background-color .2s;
        }
        
        .toggle-thumb {
          width: 16px; height: 16px; border-radius: 50%;
          background: white; transition: transform .2s;
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .btn-spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.3);
          border-top-color: white; border-radius: 50%;
          animation: spin .6s linear infinite;
        }
      `}</style>

      <div className="form-root">
        <div className="page-header">
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
            <span className="section-label">Admin Panel</span>
            <h1 className="serif" style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, color: 'white' }}>
              {isEditMode ? 'Edit ' : 'Add New '}
              <span style={{ color: '#C9A84C' }}>Project</span>
            </h1>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
          <form onSubmit={handleSubmit}>

            <Section icon={<FaBuilding />} title="Basic Information">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Field label="Project Name" required>
                  <input
                    name="projectName"
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g. Bashundhara Heights"
                    className="form-input"
                  />
                </Field>
                <Field label="Company" required>
                  <input
                    name="company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. M/S Sumon Enterprise"
                    className="form-input"
                  />
                </Field>
              </div>
              <div style={{ marginTop: '20px' }}>
                <Field label="Description" required>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the project scope, type, and highlights…"
                    className="form-textarea"
                  />
                </Field>
              </div>
            </Section>

            <Section icon={<FaMapMarkerAlt />} title="Address">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <Field label="Plot" hint="e.g. 34">
                  <input
                    name="address.plot"
                    type="text"
                    value={formData['address.plot']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Road" hint="e.g. 7">
                  <input
                    name="address.road"
                    type="text"
                    value={formData['address.road']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Block" hint="e.g. C">
                  <input
                    name="address.block"
                    type="text"
                    value={formData['address.block']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Area" required hint="e.g. Bashundhara">
                  <input
                    name="address.area"
                    type="text"
                    required
                    value={formData['address.area']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="City" required>
                  <input
                    name="address.city"
                    type="text"
                    required
                    value={formData['address.city']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
              </div>
            </Section>

            <Section icon={<FaMapMarkerAlt />} title="Map Location (GPS Coordinates)">
              <div className="info-box">
                <div style={{ display: 'flex', gap: '12px' }}>
                  <FaInfoCircle style={{ color: '#C9A84C', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#C9A84C', marginBottom: '8px' }}>
                      How to get coordinates from Google Maps
                    </p>
                    <ol style={{ fontSize: '12px', color: dark ? '#888899' : '#6B6B8A', paddingLeft: '18px', lineHeight: '1.8' }}>
                      <li>Go to Google Maps and find the project location</li>
                      <li>Right-click on the exact spot → click "What's here?"</li>
                      <li>Copy the coordinates (e.g. 23.8103, 90.4125)</li>
                      <li><strong>OR</strong> copy the full URL from the address bar</li>
                      <li>Click "Extract" — coordinates fill automatically ✓</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Field label="Paste Google Maps URL or Coordinates">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={mapUrlInput}
                    onChange={(e) => setMapUrlInput(e.target.value)}
                    placeholder="https://www.google.com/maps/place/...  or  23.8103, 90.4125"
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={handleParseMapUrl} className="map-parse-btn">
                    {mapParsed ? <><FaCheckCircle /> Done!</> : <><FaMapMarkerAlt /> Extract</>}
                  </button>
                </div>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                <Field label="Latitude" hint="e.g. 23.8103">
                  <input
                    name="latitude"
                    type="text"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Longitude" hint="e.g. 90.4125">
                  <input
                    name="longitude"
                    type="text"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
              </div>

              {formData.latitude && formData.longitude && (
                <div style={{ marginTop: '16px' }}>
                  <p className="field-label">Map Preview</p>
                  <div style={{ height: '200px', borderRadius: '2px', overflow: 'hidden', border: `1px solid ${dark ? '#2A2A3E' : '#E8E4DC'}` }}>
                    <iframe
                      key={`${formData.latitude}-${formData.longitude}`}
                      title="Location preview"
                      src={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: dark ? 'invert(.9) hue-rotate(180deg) saturate(.7)' : 'none' }}
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </Section>

            <Section icon={<FaClipboardList />} title="Project Details">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Field label="Status" required>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Finished">Finished</option>
                  </select>
                </Field>
                <Field label="Start Date" required>
                  <input
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Finish Date" hint="Leave blank if ongoing">
                  <input
                    name="finishDate"
                    type="date"
                    value={formData.finishDate}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      name="featured"
                      style={{ display: 'none' }}
                      checked={formData.featured}
                      onChange={handleChange}
                    />
                    <div
                      className="toggle-switch"
                      style={{ backgroundColor: formData.featured ? '#C9A84C' : (dark ? '#2A2A3E' : '#E8E4DC') }}
                      onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}
                    >
                      <div
                        className="toggle-thumb"
                        style={{ transform: formData.featured ? 'translateX(24px)' : 'translateX(0)' }}
                      />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: dark ? '#E8E8F0' : '#1A1A2E' }}>
                        Featured Project
                      </p>
                      <p style={{ fontSize: '12px', color: dark ? '#888899' : '#6B6B8A' }}>
                        Shows on home page
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </Section>

            <Section icon={<FaClipboardList />} title="Specifications">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <Field label="Floors" hint="e.g. G+9">
                  <input
                    name="specifications.floors"
                    type="text"
                    value={formData['specifications.floors']}
                    onChange={handleChange}
                    placeholder="G+9"
                    className="form-input"
                  />
                </Field>
                <Field label="Area per Floor" hint="e.g. 3200 sqft">
                  <input
                    name="specifications.areaPerFloor"
                    type="text"
                    value={formData['specifications.areaPerFloor']}
                    onChange={handleChange}
                    placeholder="3200 sqft"
                    className="form-input"
                  />
                </Field>
                <Field label="Total Area">
                  <input
                    name="specifications.totalArea"
                    type="text"
                    value={formData['specifications.totalArea']}
                    onChange={handleChange}
                    className="form-input"
                  />
                </Field>
                <Field label="Construction Type" hint="e.g. Fair-Face">
                  <input
                    name="specifications.constructionType"
                    type="text"
                    value={formData['specifications.constructionType']}
                    onChange={handleChange}
                    placeholder="Fair-Face"
                    className="form-input"
                  />
                </Field>
              </div>
            </Section>

            <Section icon={<FaImage />} title="Project Images">
              <Field label="Upload Images" hint="Select multiple images — max 5MB each (JPEG/PNG/WebP)">
                <div
                  style={{
                    border: `2px dashed ${dark ? '#2A2A3E' : '#E8E4DC'}`,
                    borderRadius: '2px',
                    padding: '32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('img-upload').click()}
                >
                  <FaImage style={{ color: '#C9A84C', fontSize: '32px', marginBottom: '8px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 700, color: dark ? '#E8E8F0' : '#1A1A2E' }}>
                    Click to select images
                  </p>
                  <p style={{ fontSize: '12px', color: dark ? '#888899' : '#6B6B8A', marginTop: '4px' }}>
                    {images.length > 0 ? `${images.length} file(s) selected` : 'JPEG, PNG, WebP · up to 5MB each'}
                  </p>
                  <input
                    id="img-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </Field>

              {imagePreviews.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt={`Preview ${i + 1}`} className="img-preview" />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,.4)',
                          opacity: 0,
                          transition: 'opacity .2s',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                      >
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button type="submit" disabled={loading} className="btn-gold">
                {loading ? (
                  <>
                    <div className="btn-spinner" /> Saving…
                  </>
                ) : (
                  <>
                    <FaSave size={13} /> {isEditMode ? 'Update Project' : 'Create Project'}
                  </>
                )}
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