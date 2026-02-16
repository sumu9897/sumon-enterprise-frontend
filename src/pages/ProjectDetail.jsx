import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { FaMapMarkerAlt, FaCalendar, FaBuilding, FaArrowLeft } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import projectsData from '../data/projects.json'; // ← import your JSON file

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [slug]);

  const fetchProject = () => {
    try {
      setLoading(true);
      const found = projectsData.find((p) => p.slug === slug);
      setProject(found || null);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper: build a full address string from the address object
  const buildFullAddress = (address) => {
    return [
      address.plot && `Plot ${address.plot}`,
      address.road && `Road ${address.road}`,
      address.block && `Block ${address.block}`,
      address.area,
      address.city,
    ]
      .filter(Boolean)
      .join(', ');
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
  const fullAddress = buildFullAddress(project.address);

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
          {project.company && (
            <p className="text-xl text-gray-600">{project.company}</p>
          )}
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
                  {project.specifications.floorArea && (
                    <div>
                      <span className="font-semibold">Area per Floor:</span>{' '}
                      {project.specifications.floorArea}
                    </div>
                  )}
                  {project.specifications.type && (
                    <div>
                      <span className="font-semibold">Type:</span>{' '}
                      {project.specifications.type}
                    </div>
                  )}
                  {project.specifications.finish && (
                    <div>
                      <span className="font-semibold">Finish:</span>{' '}
                      {project.specifications.finish}
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
                {project.company && (
                  <div className="flex items-start gap-3">
                    <FaBuilding className="text-primary text-xl mt-1" />
                    <div>
                      <div className="font-semibold">Client</div>
                      <div className="text-gray-600">{project.company}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary text-xl mt-1" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div className="text-gray-600">{fullAddress}</div>
                  </div>
                </div>

                {project.startDate && (
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-primary text-xl mt-1" />
                    <div>
                      <div className="font-semibold">Start Date</div>
                      <div className="text-gray-600">{project.startDate}</div>
                    </div>
                  </div>
                )}

                {project.finishDate && (
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-primary text-xl mt-1" />
                    <div>
                      <div className="font-semibold">Finish Date</div>
                      <div className="text-gray-600">{project.finishDate}</div>
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
              <h3 className="text-xl font-semibold mb-3">
                Interested in a Similar Project?
              </h3>
              <p className="mb-4">Contact us to discuss your construction needs</p>
              <Link
                to="/contact"
                className="btn bg-white text-primary hover:bg-gray-100 w-full"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightboxOpen && images.length > 0 && (
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={photoIndex}
            slides={images.map((src) => ({ src }))}
            on={{
              view: ({ index }) => setPhotoIndex(index),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;