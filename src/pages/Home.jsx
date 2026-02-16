import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaArrowRight, FaBuilding, FaTools, FaHome, FaUsers } from 'react-icons/fa';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ experience: 0, projects: 0 });

  useEffect(() => {
    fetchFeaturedProjects();
    animateStats();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await api.get('/projects/featured');
      setFeaturedProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateStats = () => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const targetExperience = 25;
    const targetProjects = 50;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setStats({
        experience: Math.floor(targetExperience * progress),
        projects: Math.floor(targetProjects * progress),
      });

      if (currentStep >= steps) {
        setStats({ experience: targetExperience, projects: targetProjects });
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  };

  const services = [
    {
      id: 1,
      title: 'Main Contractor',
      description: 'Complete construction project management from start to finish.',
      icon: <FaBuilding className="text-5xl text-primary" />,
    },
    {
      id: 2,
      title: 'Sub Contractor',
      description: 'Specialized construction services for specific project phases.',
      icon: <FaTools className="text-5xl text-primary" />,
    },
    {
      id: 3,
      title: 'Repairing Work',
      description: 'Professional repair and maintenance services for buildings.',
      icon: <FaTools className="text-5xl text-primary" />,
    },
    {
      id: 4,
      title: 'Apartment Development',
      description: 'End-to-end residential apartment development and construction.',
      icon: <FaHome className="text-5xl text-primary" />,
    },
  ];

  const statsData = [
    { label: 'Years of Experience', value: stats.experience, suffix: '+' },
    { label: 'Projects Completed', value: stats.projects, suffix: '+' },
    { label: 'Services Offered', value: 4, suffix: '' },
    { label: 'Client Satisfaction', value: 100, suffix: '%' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[600px] flex items-center"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920")',
        }}
      >
        <div className="container-custom relative z-10">
          <div className="max-w-2xl text-white">
            <div className="bg-secondary inline-block px-4 py-2 rounded mb-4">
              <span className="font-semibold">Established 2000</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
              M/S SUMON ENTERPRISE
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Building Dreams, Creating Landmarks Since 2000
            </p>
            <p className="text-lg mb-8">
              Leading construction company providing excellence in Main Contracting,
              Sub-Contracting, Repairing, and Apartment Development.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/projects" className="btn-primary">
                View Projects
              </Link>
              <Link to="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Featured Projects</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of our most prestigious construction projects across Bangladesh
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.slice(0, 3).map((project) => (
                <Link
                  key={project._id}
                  to={`/projects/${project.slug}`}
                  className="card group"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {project.images?.[0] && (
                      <img
                        src={project.images[0].url}
                        alt={project.projectName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{project.projectName}</h3>
                    <p className="text-gray-600 mb-2">{project.company}</p>
                    <p className="text-sm text-gray-500 mb-3">
                      {project.address.area}, {project.address.city}
                    </p>
                    <span
                      className={`badge ${
                        project.status === 'Ongoing' ? 'badge-ongoing' : 'badge-finished'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
              View All Projects <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive construction solutions tailored to your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card p-8 text-center hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-outline inline-flex items-center gap-2">
              Learn More About Our Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's build something amazing together. Contact us today for a consultation.
          </p>
          <Link to="/contact" className="btn bg-white text-primary hover:bg-gray-100">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;