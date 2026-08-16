import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'M/S Sumon Enterprise';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://sumon-enterprise.vercel.app';

const metadata = {
  '/': ['Construction Company in Bangladesh Since 2000', 'Trusted construction, contracting, repair, and apartment development services across Bangladesh.'],
  '/about': ['About Our Construction Company', 'Learn about M/S Sumon Enterprise, our values, experience, and 25+ years of construction expertise.'],
  '/services': ['Construction Services', 'Explore main contracting, subcontracting, repair, and apartment development services.'],
  '/projects': ['Construction Projects', 'Browse ongoing and completed construction projects delivered across Bangladesh.'],
  '/gallery': ['Project Gallery', 'View selected construction work and completed project photography.'],
  '/contact': ['Request a Construction Quote', 'Contact M/S Sumon Enterprise to discuss your construction project or request a quote.'],
};

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

const RouteEffects = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const isProject = pathname.startsWith('/projects/');
    const [title, description] = metadata[pathname]
      || (isProject
        ? ['Project Details', 'View construction project details, specifications, images, and location.']
        : ['Page Not Found', 'The requested page could not be found.']);
    const fullTitle = `${title} | ${SITE_NAME}`;
    const canonical = `${SITE_URL}${pathname === '/' ? '' : pathname}`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', fullTitle);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[name="twitter:title"]', 'content', fullTitle);
    setMeta('meta[name="twitter:description"]', 'content', description);
    setMeta('link[rel="canonical"]', 'href', canonical);
  }, [pathname]);

  return null;
};

export default RouteEffects;
