import { Link } from 'react-router-dom';
import { FaBuilding, FaTools, FaHammer, FaHome, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Main Contractor',
      icon: <FaBuilding className="text-6xl text-primary" />,
      description: 'Complete project management and execution from conception to completion.',
      features: [
        'Full project planning and design coordination',
        'Quality control and assurance',
        'Timeline and budget management',
        'Coordination with all stakeholders',
        'Compliance with building codes and regulations',
        'Post-construction support',
      ],
    },
    {
      id: 2,
      title: 'Sub Contractor',
      icon: <FaTools className="text-6xl text-primary" />,
      description: 'Specialized construction services for specific project phases and requirements.',
      features: [
        'Specialized trade work',
        'Electrical and plumbing installations',
        'HVAC systems',
        'Interior finishing',
        'Structural work',
        'MEP services',
      ],
    },
    {
      id: 3,
      title: 'Repairing Work',
      icon: <FaHammer className="text-6xl text-primary" />,
      description: 'Professional repair and maintenance services for residential and commercial buildings.',
      features: [
        'Structural repairs',
        'Waterproofing solutions',
        'Facade restoration',
        'Foundation repairs',
        'Roof repairs and maintenance',
        'Emergency repair services',
      ],
    },
    {
      id: 4,
      title: 'Apartment Development',
      icon: <FaHome className="text-6xl text-primary" />,
      description: 'End-to-end residential development from land acquisition to handover.',
      features: [
        'Land acquisition and feasibility studies',
        'Architectural design and planning',
        'Construction management',
        'Quality materials and finishes',
        'Timely project delivery',
        'Legal documentation support',
      ],
    },
  ];

  const process = [
    { step: 1, title: 'Consultation', description: 'Initial meeting to understand your requirements' },
    { step: 2, title: 'Planning', description: 'Detailed project planning and design' },
    { step: 3, title: 'Execution', description: 'Professional construction with quality control' },
    { step: 4, title: 'Delivery', description: 'Timely handover with complete documentation' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Our Services
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive construction solutions tailored to your specific needs
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="card p-8">
                    <div className="flex justify-center mb-6">{service.icon}</div>
                    <h2 className="text-3xl font-heading font-bold text-center mb-4">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-center mb-6">
                      {service.description}
                    </p>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <h3 className="text-2xl font-semibold mb-6">Key Features:</h3>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="text-success text-xl flex-shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">
            Our Work Process
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A streamlined approach to deliver your project successfully
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Choose Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="text-5xl font-bold text-primary mb-4">25+</div>
              <h3 className="text-xl font-semibold mb-2">Years Experience</h3>
              <p className="text-gray-600">
                Over two decades of proven expertise in construction
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="text-5xl font-bold text-primary mb-4">50+</div>
              <h3 className="text-xl font-semibold mb-2">Projects Completed</h3>
              <p className="text-gray-600">
                Successfully delivered diverse construction projects
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="text-5xl font-bold text-primary mb-4">100%</div>
              <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">
                Commitment to highest quality standards
              </p>
            </div>
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
            Get in touch with us today to discuss your construction needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="btn bg-white text-primary hover:bg-gray-100 inline-flex items-center gap-2"
            >
              Contact Us <FaArrowRight />
            </Link>
            <Link
              to="/projects"
              className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
            >
              View Our Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;