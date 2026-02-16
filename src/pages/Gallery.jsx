import { useState, useEffect } from 'react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import LoadingSpinner from '../components/common/LoadingSpinner';
import projectsData from '../data/projects.json'; // ← import your JSON file

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    try {
      // Extract all images from every project in the JSON
      const allImages = [];
      projectsData.forEach((project) => {
        if (project.images && project.images.length > 0) {
          project.images.forEach((img) => {
            allImages.push({
              url: img.url,
              projectName: project.projectName,
              projectId: project.id,
              status: project.status,
            });
          });
        }
      });
      setImages(allImages);
    } catch (error) {
      console.error('Failed to load gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages =
    filter === 'all'
      ? images
      : images.filter((img) => img.status === filter);

  if (loading) {
    return <LoadingSpinner text="Loading gallery..." />;
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Project Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our collection of completed and ongoing construction projects
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All Projects
          </button>
          <button
            onClick={() => setFilter('Ongoing')}
            className={`btn ${filter === 'Ongoing' ? 'btn-primary' : 'btn-outline'}`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setFilter('Finished')}
            className={`btn ${filter === 'Finished' ? 'btn-primary' : 'btn-outline'}`}
          >
            Finished
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <p className="text-center text-gray-600 py-20">No images found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden rounded-lg cursor-pointer group relative"
                onClick={() => {
                  setPhotoIndex(index);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={image.url}
                  alt={image.projectName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <p className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-2 text-center">
                    {image.projectName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox — updated to yet-another-react-lightbox v3 API */}
        {lightboxOpen && filteredImages.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={filteredImages.map((img) => ({
              src: img.url,
              title: img.projectName,
            }))}
            on={{
              view: ({ index }) => setPhotoIndex(index),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;