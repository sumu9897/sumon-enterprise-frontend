import { FaHistory, FaCheckCircle, FaUsers, FaAward } from 'react-icons/fa';

const About = () => {
  const milestones = [
    { year: '2000', event: 'Company Established' },
    { year: '2005', event: 'Completed 10th Project' },
    { year: '2010', event: 'Expanded to Major Cities' },
    { year: '2015', event: 'Reached 30 Projects Milestone' },
    { year: '2020', event: 'Completed 50+ Projects' },
    { year: '2025', event: 'Celebrating 25 Years of Excellence' },
  ];

  const values = [
    {
      icon: <FaCheckCircle className="text-5xl text-primary" />,
      title: 'Quality First',
      description: 'We never compromise on the quality of materials and workmanship.',
    },
    {
      icon: <FaUsers className="text-5xl text-primary" />,
      title: 'Client Satisfaction',
      description: 'Our clients success and satisfaction is our top priority.',
    },
    {
      icon: <FaAward className="text-5xl text-primary" />,
      title: 'Professional Excellence',
      description: 'We maintain the highest standards of professionalism in every project.',
    },
    {
      icon: <FaHistory className="text-5xl text-primary" />,
      title: 'Timely Delivery',
      description: 'We commit to deadlines and deliver projects on schedule.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            About M/S SUMON ENTERPRISE
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building Bangladesh's future with 25+ years of construction excellence
          </p>
        </div>
      </section>

      {/* Company History */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2000, M/S SUMON ENTERPRISE has grown from a small
                  construction firm to one of Bangladesh's most trusted construction
                  companies. With over 25 years of experience, we have successfully
                  completed more than 50 projects across the country.
                </p>
                <p>
                  Our journey began with a simple vision: to provide high-quality
                  construction services that combine traditional craftsmanship with
                  modern technology. Today, we are proud to have built lasting
                  relationships with clients who trust us with their most important
                  projects.
                </p>
                <p>
                  From residential apartments to commercial buildings, our portfolio
                  showcases our versatility and commitment to excellence. Every
                  project we undertake reflects our dedication to quality,
                  innovation, and client satisfaction.
                </p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
                alt="Construction site"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Our Milestones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-3">
                  {milestone.year}
                </div>
                <p className="text-gray-700">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-4">
            Our Core Values
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Our Mission</h2>
              <p className="text-lg">
                To deliver exceptional construction services that exceed client
                expectations through innovation, quality craftsmanship, and
                unwavering commitment to excellence. We strive to build not just
                structures, but lasting relationships and communities.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6">Our Vision</h2>
              <p className="text-lg">
                To be Bangladesh's most trusted and respected construction company,
                known for transforming visions into reality while setting new
                standards in quality, safety, and sustainability in the
                construction industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">25+</div>
              <h3 className="text-xl font-semibold mb-2">Years of Experience</h3>
              <p className="text-gray-600">
                Over two decades of proven expertise in construction
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">50+</div>
              <h3 className="text-xl font-semibold mb-2">Projects Completed</h3>
              <p className="text-gray-600">
                Successfully delivered projects across Bangladesh
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-4">100%</div>
              <h3 className="text-xl font-semibold mb-2">Client Satisfaction</h3>
              <p className="text-gray-600">
                Committed to exceeding expectations on every project
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;