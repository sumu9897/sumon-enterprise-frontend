const defaultSiteContent = {
  about: {
    eyebrow: 'Our Story',
    title: 'About M/S Sumon Enterprise',
    subtitle: "Building Bangladesh's future with 25+ years of construction excellence",
    heading: '25 Years of Building Trust',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
    paragraphs: [
      "Founded in 2000, M/S Sumon Enterprise has grown from a small construction firm to one of Bangladesh's trusted contractors.",
      'We combine traditional craftsmanship with modern construction technology and accountable project management.',
      'Our portfolio covers residential apartments, commercial buildings, industrial facilities, repairs, and development work.',
    ],
    milestones: [
      { year: '2000', title: 'Company Established', description: 'Started with a vision to deliver quality construction in Bangladesh.' },
      { year: '2005', title: '10th Project Completed', description: 'Reached our first major residential construction milestone.' },
      { year: '2010', title: 'Expanded to Major Cities', description: 'Extended operations to Dhaka, Comilla, and Narayanganj.' },
      { year: '2015', title: '30 Projects Milestone', description: 'Diversified into commercial and industrial construction.' },
      { year: '2020', title: '70+ Projects Delivered', description: 'Established a strong track record as a trusted contractor.' },
      { year: '2025', title: '25 Years of Excellence', description: "Celebrated a quarter century of building Bangladesh's future." },
    ],
    values: [
      { title: 'Quality First', description: 'We never compromise on materials or workmanship.' },
      { title: 'Client Satisfaction', description: 'Client success and satisfaction guide every decision.' },
      { title: 'Professional Excellence', description: 'We maintain rigorous professional standards on every project.' },
      { title: 'Timely Delivery', description: 'We plan responsibly and remain accountable to agreed schedules.' },
    ],
  },
  services: [
    { title: 'Main Contractor', tagline: 'From conception to completion', description: 'Complete project management and execution covering every phase of construction.', imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800', features: ['Project planning and design coordination', 'Quality control and assurance', 'Timeline and budget management', 'Stakeholder coordination', 'Building-code compliance', 'Post-construction support'], order: 0, active: true },
    { title: 'Sub Contractor', tagline: 'Specialized expertise on demand', description: 'Specialized construction services for specific project phases and trade requirements.', imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800', features: ['Specialized technical work', 'Electrical and plumbing installations', 'HVAC systems', 'Interior finishing', 'Structural and civil work', 'MEP services'], order: 1, active: true },
    { title: 'Repairing Work', tagline: 'Restore, repair, renew', description: 'Professional repair and maintenance services for residential and commercial buildings.', imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800', features: ['Structural assessment', 'Waterproofing solutions', 'Facade restoration', 'Foundation repairs', 'Roof maintenance', 'Emergency response'], order: 2, active: true },
    { title: 'Apartment Development', tagline: 'End-to-end residential solutions', description: 'Complete residential development from land acquisition through final handover.', imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', features: ['Feasibility studies', 'Architectural planning', 'Construction management', 'Premium finishes', 'Timely delivery', 'Documentation support'], order: 3, active: true },
  ],
  contact: {
    phone: '+880 1789779059', whatsapp: '+880 1789779059', email: 'sumonconstruction2024@gmail.com', address: 'Dhaka, Bangladesh', facebookUrl: 'https://facebook.com', mapEmbedUrl: '',
    officeHours: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'].map((day) => ({ day, hours: '8:00 AM – 5:00 PM', open: true })).concat({ day: 'Friday', hours: 'Closed', open: false }),
  },
  gallery: [],
};

export default defaultSiteContent;
