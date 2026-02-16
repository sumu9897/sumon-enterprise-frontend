import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import LoadingSpinner from '../components/common/LoadingSpinner';

const Gallery = () => {
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects?limit=100');
      setProjects(response.data.data);
      
      // Extract all images
      const allImages = [];
      response.data.data.forEach((project) => {
        if (project.images && project.images.length > 0) {
          project.images.forEach((img) => {
            allImages.push({
              url: img.url,
              projectName: project.projectName,
              projectId: project._id,
              status: project.status,
            });
          });
        }
      });
      
      setImages(allImages);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = filter === 'all' 
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

        {/* Lightbox */}
        {lightboxOpen && filteredImages.length > 0 && (
          <Lightbox
            mainSrc={filteredImages[photoIndex].url}
            nextSrc={filteredImages[(photoIndex + 1) % filteredImages.length].url}
            prevSrc={filteredImages[(photoIndex + filteredImages.length - 1) % filteredImages.length].url}
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + filteredImages.length - 1) % filteredImages.length)
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % filteredImages.length)
            }
            imageTitle={filteredImages[photoIndex].projectName}
          />
        )}
      </div>
    </div>
  );
};

export default Gallery;