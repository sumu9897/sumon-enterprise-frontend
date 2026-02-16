import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { FaMapMarkerAlt, FaCalendar, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/slug/${slug}`);
      setProject(response.data.data);
    } catch (error) {
      toast.error('Failed to load project details');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading project details..." />;
  }

  if (!project) {
    return (
      <div className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-semibold mb-4">Project Not Found</h2>
          <Link to="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images?.map((img) => img.url) || [];

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Back Button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-8"
        >
          <FaArrowLeft /> Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h1 className="text-4xl font-heading font-bold">{project.projectName}</h1>
            <span
              className={`badge ${
                project.status === 'Ongoing' ? 'badge-ongoing' : 'badge-finished'
              } text-lg`}
            >
              {project.status}
            </span>
          </div>
          <p className="text-xl text-gray-600">{project.company}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            {images.length > 0 && (
              <div className="mb-8">
                <img
                  src={images[0]}
                  alt={project.projectName}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => setLightboxOpen(true)}
                />
              </div>
            )}

            {/* Image Gallery */}
            {images.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Project Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.projectName} ${index + 1}`}
                      className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition"
                      onClick={() => {
                        setPhotoIndex(index);
                        setLightboxOpen(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Project Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
            </div>

            {/* Specifications */}
            {project.specifications && (
              <div className="card p-6">
                <h2 className="text-2xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.specifications.floors && (
                    <div>
                      <span className="font-semibold">Floors:</span>{' '}
                      {project.specifications.floors}
                    </div>
                  )}
                  {project.specifications.areaPerFloor && (
                    <div>
                      <span className="font-semibold">Area per Floor:</span>{' '}
                      {project.specifications.areaPerFloor}
                    </div>
                  )}
                  {project.specifications.totalArea && (
                    <div>
                      <span className="font-semibold">Total Area:</span>{' '}
                      {project.specifications.totalArea}
                    </div>
                  )}
                  {project.specifications.constructionType && (
                    <div>
                      <span className="font-semibold">Construction Type:</span>{' '}
                      {project.specifications.constructionType}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info Card */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Project Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaBuilding className="text-primary text-xl mt-1" />
                  <div>
                    <div className="font-semibold">Client</div>
                    <div className="text-gray-600">{project.company}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-gray-600">{project.fullAddress}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaCalendar className="text-primary text-xl mt-1" />
                  <div>
                    <div className="font-semibold">Start Date</div>
                    <div className="text-gray-600">
                      {new Date(project.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  </div>
                </div>

                {project.finishDate && (
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-primary text-xl mt-1" />
                    <div>
                      <div className="font-semibold">Finish Date</div>
                      <div className="text-gray-600">
                        {new Date(project.finishDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">Location Map</h3>
              <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
                <p className="text-gray-500">Map: {project.address.area}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="card p-6 bg-primary text-white">
              <h3 className="text-xl font-semibold mb-3">Interested in a Similar Project?</h3>
              <p className="mb-4">Contact us to discuss your construction needs</p>
              <Link to="/contact" className="btn bg-white text-primary hover:bg-gray-100 w-full">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && images.length > 0 && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => setLightboxOpen(false)}
            onMovePrevRequest={() =>
              setPhotoIndex((photoIndex + images.length - 1) % images.length)
            }
            onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;