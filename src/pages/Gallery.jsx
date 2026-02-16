import { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaImage, FaBuilding, FaTimes } from 'react-icons/fa';

/* ── useDarkMode ── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
};

const Gallery = () => {
  const dark = useDarkMode();

  const bg     = dark ? '#0F1117' : '#F8F5EF';
  const card   = dark ? '#1C1E2A' : '#FFFFFF';
  const text   = dark ? '#E8E8F0' : '#1A1A2E';
  const sub    = dark ? '#888899' : '#6B6B8A';
  const border = dark ? '#2A2A3E' : '#E8E4DC';
  const gold   = '#C9A84C';
  const dark2  = dark ? '#13151E' : '#1A1A2E';

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      // Fetch all projects with high limit to get all images
      const response = await api.get('/projects?limit=1000');
      const projects = response.data.data;

      // Extract all images from every project
      const allImages = [];
      projects.forEach((project) => {
        if (project.images && project.images.length > 0) {
          project.images.forEach((img) => {
            allImages.push({
              url: img.url,
              projectName: project.projectName,
              projectId: project._id,
              slug: project.slug,
              status: project.status,
              company: project.company,
              location: [project.address?.area, project.address?.city]
                .filter(Boolean)
                .join(', '),
            });
          });
        }
      });
      setImages(allImages);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    filter === 'all'
      ? images
      : images.filter((img) => img.status === filter);

  const filterButtons = [
    { value: 'all', label: 'All Projects' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Finished', label: 'Finished' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .gallery-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        .section-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #C9A84C; display: block; margin-bottom: 0.6rem;
        }
        .gold-divider {
          width: 50px; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #E8C96A);
          border-radius: 2px; margin-bottom: 1.5rem;
        }
        .gold-divider.center { margin-left: auto; margin-right: auto; }

        .hero-gallery {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
          padding-bottom: 80px;
        }

        .filter-btn {
          padding: 10px 24px;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 2px;
          transition: all 0.25s;
          border: 2px solid var(--bd);
          background: transparent;
          cursor: pointer;
        }
        .filter-btn.active {
          background: #C9A84C;
          color: white;
          border-color: #C9A84C;
        }
        .filter-btn:hover:not(.active) {
          border-color: #C9A84C;
          color: #C9A84C;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 2px;
          cursor: pointer;
          border: 1px solid var(--bd);
          background: var(--bg);
        }
        .gallery-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .spinner {
          width: 50px; height: 50px;
          border: 4px solid var(--bd);
          border-top-color: #C9A84C;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.65s ease forwards; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.25s; opacity: 0; }
        .d3 { animation-delay: 0.4s; opacity: 0; }

        /* Skeleton loading */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(
            90deg,
            ${dark ? '#1C1E2A' : '#F0EDE8'} 25%,
            ${dark ? '#252838' : '#E8E4DC'} 50%,
            ${dark ? '#1C1E2A' : '#F0EDE8'} 75%
          );
          background-size: 1200px 100%;
          animation: shimmer 1.4s infinite linear;
        }

        /* Custom lightbox styles for dark mode */
        .yarl__root {
          --yarl__color_backdrop: ${dark ? 'rgba(15, 17, 23, 0.95)' : 'rgba(0, 0, 0, 0.9)'};
        }
      `}</style>

      <div
        className="gallery-root min-h-screen"
        style={{
          background: bg, color: text,
          '--bd': border, '--bg': card,
        }}
      >

        {/* ══ HERO ══ */}
        <section className="hero-gallery relative overflow-hidden pt-20" style={{ background: dark2 }}>
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600")',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ background: `linear-gradient(180deg, transparent, ${gold}, transparent)` }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center pb-20">
            <span className="section-label fade-up d1">Visual Portfolio</span>
            <div className="gold-divider center fade-up d1" />
            <h1
              className="serif font-black text-white fade-up d2"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1.1 }}
            >
              Project <span style={{ color: gold }}>Gallery</span>
            </h1>
            <p
              className="mt-4 text-base max-w-xl mx-auto fade-up d3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              {!loading && images.length > 0
                ? `Browse through ${images.length} images from our construction projects`
                : 'Browse through our collection of completed and ongoing construction projects'}
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 pb-24 relative z-10">

          {/* ══ FILTERS ══ */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterButtons.map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`filter-btn ${filter === btn.value ? 'active' : ''}`}
                style={{
                  color: filter === btn.value ? 'white' : text,
                  borderColor: filter === btn.value ? gold : border,
                  background: filter === btn.value ? gold : 'transparent',
                }}
              >
                {btn.label}
                {btn.value !== 'all' && filter === btn.value && (
                  <span className="ml-2 opacity-75">
                    ({filteredImages.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ══ COUNT ══ */}
          <div
            className="mb-6 text-xs font-bold tracking-widest uppercase text-center"
            style={{ color: sub }}
          >
            {loading ? (
              'Loading gallery...'
            ) : (
              `Showing ${filteredImages.length} ${
                filteredImages.length === 1 ? 'image' : 'images'
              }`
            )}
          </div>

          {/* ══ GALLERY GRID ══ */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton rounded-sm"
                  style={{ aspectRatio: '1', border: `1px solid ${border}` }}
                />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-24">
              <FaImage className="mx-auto mb-4 text-5xl" style={{ color: border }} />
              <p className="text-lg font-semibold mb-2" style={{ color: text }}>
                No images found
              </p>
              <p className="text-sm mb-6" style={{ color: sub }}>
                {filter !== 'all' 
                  ? 'Try selecting a different filter'
                  : 'No images available in the gallery'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-70"
                  style={{ color: gold }}
                >
                  <FaTimes size={10} /> Clear Filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="gallery-item"
                  onClick={() => {
                    setPhotoIndex(index);
                    setLightboxOpen(true);
                  }}
                >
                  {image.url ? (
                    <>
                      <img
                        src={image.url}
                        alt={image.projectName}
                        loading="lazy"
                      />
                      <div className="gallery-overlay">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                          {image.projectName}
                        </h3>
                        {image.company && (
                          <p className="text-xs mb-1" style={{ color: gold }}>
                            {image.company}
                          </p>
                        )}
                        {image.location && (
                          <p className="text-xs text-white opacity-70">
                            {image.location}
                          </p>
                        )}
                        <span
                          className="inline-block text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm mt-2"
                          style={{
                            background: image.status === 'Ongoing'
                              ? 'rgba(201,168,76,0.9)'
                              : 'rgba(34,197,94,0.85)',
                            color: 'white',
                          }}
                        >
                          {image.status}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <FaBuilding style={{ color: gold, fontSize: 28 }} />
                      <span
                        className="text-xs tracking-widest uppercase"
                        style={{ color: sub }}
                      >
                        No Image
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ══ LIGHTBOX ══ */}
          {lightboxOpen && filteredImages.length > 0 && (
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              index={photoIndex}
              slides={filteredImages.map((img) => ({
                src: img.url,
                title: img.projectName,
                description: [
                  img.company,
                  img.location,
                  img.status,
                ]
                  .filter(Boolean)
                  .join(' • '),
              }))}
              on={{
                view: ({ index }) => setPhotoIndex(index),
              }}
              styles={{
                container: { 
                  backgroundColor: dark ? 'rgba(15, 17, 23, 0.95)' : 'rgba(0, 0, 0, 0.9)' 
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Gallery;