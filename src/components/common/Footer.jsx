import { Link } from 'react-router-dom';
import { FaEnvelope, FaFacebookF, FaHardHat, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const links = [
  { to: '/about', label: 'About us' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

const services = ['Main contracting', 'Subcontracting', 'Repair & renovation', 'Apartment development'];

const Footer = () => (
  <footer className="border-t border-white/10 bg-[#0F1117] text-white/60">
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1.2fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 text-white" aria-label="M/S Sumon Enterprise home">
            <span className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary text-white"><FaHardHat /></span>
            <span>
              <span className="block font-heading text-lg font-black uppercase leading-none">M/S Sumon</span>
              <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Enterprise</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7">
            Trusted construction and development services across Bangladesh since 2000, built on quality, accountability, and lasting client relationships.
          </p>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-primary hover:text-primary"
            aria-label="Visit M/S Sumon Enterprise on Facebook"
          >
            <FaFacebookF />
          </a>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Company</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {links.map((link) => <li key={link.to}><Link className="transition hover:text-primary" to={link.to}>{link.label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Expertise</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {services.map((service) => <li key={service}>{service}</li>)}
          </ul>
        </div>

        <address className="not-italic">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
          <div className="mt-5 space-y-4 text-sm">
            <p className="flex items-start gap-3"><FaMapMarkerAlt className="mt-1 shrink-0 text-primary" /><span>Dhaka, Bangladesh</span></p>
            <a className="flex items-center gap-3 transition hover:text-primary" href="tel:+8801789779059"><FaPhoneAlt className="shrink-0 text-primary" /><span>+880 1789-779059</span></a>
            <a className="flex items-start gap-3 break-all transition hover:text-primary" href="mailto:sumonconstruction2024@gmail.com"><FaEnvelope className="mt-1 shrink-0 text-primary" /><span>sumonconstruction2024@gmail.com</span></a>
          </div>
        </address>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-center text-xs sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
        <p>© {new Date().getFullYear()} M/S Sumon Enterprise. All rights reserved.</p>
        <p>Construction excellence since 2000.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
