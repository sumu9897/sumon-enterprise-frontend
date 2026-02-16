import { useEffect, useState } from 'react';
import {
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaWhatsapp, FaFacebook, FaArrowRight
} from 'react-icons/fa';

/* ── useDarkMode ── */
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return dark;
};

const Contact = () => {
  const dark = useDarkMode();

  const bg     = dark ? '#0F1117' : '#F8F5EF';
  const card   = dark ? '#1C1E2A' : '#FFFFFF';
  const text   = dark ? '#E8E8F0' : '#1A1A2E';
  const sub    = dark ? '#888899' : '#6B6B8A';
  const border = dark ? '#2A2A3E' : '#E8E4DC';
  const gold   = '#C9A84C';
  const dark2  = dark ? '#13151E' : '#1A1A2E';

  const contactItems = [
    {
      icon: <FaPhone />,
      label: 'Call Us',
      value: '+880 1XXXXXXXXX',
      note: 'Sat – Thu, 9AM – 6PM',
      href: 'tel:+8801XXXXXXXXX',
      cta: 'Call Now',
    },
    {
      icon: <FaWhatsapp />,
      label: 'WhatsApp',
      value: '+880 1XXXXXXXXX',
      note: 'Quick replies on WhatsApp',
      href: 'https://wa.me/8801XXXXXXXXX',
      cta: 'Message Us',
    },
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'sumonconstruction2024@gmail.com',
      note: 'We reply within 24 hours',
      href: 'mailto:sumonconstruction2024@gmail.com',
      cta: 'Send Email',
    },
    {
      icon: <FaMapMarkerAlt />,
      label: 'Office',
      value: 'Dhaka, Bangladesh',
      note: 'Visit us by appointment',
      href: 'https://maps.google.com/?q=Dhaka,Bangladesh',
      cta: 'Get Directions',
    },
  ];

  const officeHours = [
    { day: 'Saturday',  hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Sunday',    hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Monday',    hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Tuesday',   hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Wednesday', hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Thursday',  hours: '9:00 AM – 6:00 PM', open: true  },
    { day: 'Friday',    hours: 'Closed',             open: false },
  ];

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .contact-root { font-family: 'DM Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', serif; }

        .section-label {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: #C9A84C; display: block; margin-bottom: 0.6rem;
        }
        .gold-divider {
          width: 50px; height: 3px;
          background: linear-gradient(90deg, #C9A84C, #E8C96A);
          border-radius: 2px; margin-bottom: 1.5rem;
        }
        .gold-divider.center { margin-left: auto; margin-right: auto; }

        .contact-card {
          border: 1px solid var(--bd);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
        }
        .contact-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px rgba(0,0,0,0.15);
          border-color: #C9A84C;
        }
        .contact-card:hover .card-icon {
          background: #C9A84C !important;
          color: white !important;
        }
        .card-icon { transition: background 0.3s, color 0.3s; }

        .card-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #C9A84C; transition: gap 0.2s;
        }
        .card-cta:hover { gap: 10px; }

        .hours-row { transition: background 0.15s; border-radius: 4px; }
        .hours-row:hover { background: rgba(201,168,76,0.06); }

        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px;
          background: #C9A84C; color: white;
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s;
          position: relative; overflow: hidden;
        }
        .btn-gold::after {
          content: ''; position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: rgba(255,255,255,0.2);
          transform: skewX(-20deg); transition: left 0.45s ease;
        }
        .btn-gold:hover::after { left: 150%; }
        .btn-gold:hover { opacity: 0.9; transform: translateY(-1px); }

        .btn-outline-gold {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 28px;
          border: 2px solid #C9A84C; color: #C9A84C;
          font-weight: 700; font-size: 13px;
          letter-spacing: 0.12em; text-transform: uppercase;
          border-radius: 2px; transition: all 0.25s;
        }
        .btn-outline-gold:hover {
          background: #C9A84C; color: white; transform: translateY(-1px);
        }

        .hero-contact {
          clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
          padding-bottom: 100px;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.65s ease forwards; }
        .d1 { animation-delay: 0.1s; opacity: 0; }
        .d2 { animation-delay: 0.25s; opacity: 0; }
        .d3 { animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div
        className="contact-root"
        style={{ background: bg, color: text, '--bd': border }}
      >

        {/* ══ HERO ══ */}
        <section className="hero-contact relative overflow-hidden pt-20 pb-32" style={{ background: dark2 }}>
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600")`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ background: `linear-gradient(180deg, transparent, ${gold}, transparent)` }}
          />
          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label fade-up d1">Contact</span>
            <div className="gold-divider center fade-up d1" />
            <h1
              className="serif font-black text-white fade-up d2"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}
            >
              Let's Build Something<br />
              <span style={{ color: gold }}>Great Together</span>
            </h1>
            <p
              className="mt-5 text-base max-w-xl mx-auto fade-up d3"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Reach out through any channel below. Our team is ready to discuss
              your construction needs and turn your vision into reality.
            </p>
          </div>
        </section>

        {/* ══ CONTACT CARDS ══ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 -mt-14 mb-20 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactItems.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="contact-card rounded-sm p-7 block"
                style={{ background: card }}
              >
                <div
                  className="card-icon w-12 h-12 rounded-sm flex items-center justify-center text-xl mb-5"
                  style={{ background: dark ? '#13151E' : '#F7F3EC', color: gold }}
                >
                  {item.icon}
                </div>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: gold }}>
                  {item.label}
                </p>
                <p className="font-semibold text-sm mb-1 break-all" style={{ color: text }}>
                  {item.value}
                </p>
                <p className="text-xs mb-5" style={{ color: sub }}>
                  {item.note}
                </p>
                <span className="card-cta">
                  {item.cta} <FaArrowRight />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ══ MAP + HOURS ══ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Map */}
            <div
              className="lg:col-span-2 rounded-sm overflow-hidden relative"
              style={{ height: 430, border: `1px solid ${border}` }}
            >
              <iframe
                title="Dhaka Bangladesh"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.3229159581!2d90.27923706812498!3d23.780573000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%" height="100%"
                style={{
                  border: 0,
                  filter: dark ? 'invert(0.9) hue-rotate(180deg) saturate(0.7)' : 'none',
                }}
                allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div
                className="absolute bottom-4 left-4 px-4 py-2 rounded-sm flex items-center gap-2 text-sm font-semibold shadow-lg"
                style={{ background: dark2, color: 'white' }}
              >
                <FaMapMarkerAlt style={{ color: gold }} />
                Dhaka, Bangladesh
              </div>
            </div>

            {/* Office Hours */}
            <div
              className="rounded-sm p-7 flex flex-col"
              style={{ background: card, border: `1px solid ${border}` }}
            >
              <div className="mb-5">
                <span className="section-label">Schedule</span>
                <div className="gold-divider" />
                <h3 className="serif font-bold text-xl" style={{ color: text }}>
                  Office Hours
                </h3>
              </div>

              <div className="flex-1 space-y-1">
                {officeHours.map((row) => {
                  const isToday = row.day === today;
                  return (
                    <div
                      key={row.day}
                      className="hours-row flex items-center justify-between px-3 py-2.5"
                      style={{ background: isToday ? 'rgba(201,168,76,0.10)' : 'transparent' }}
                    >
                      <span
                        className="text-sm font-medium flex items-center gap-2"
                        style={{ color: isToday ? gold : text }}
                      >
                        {isToday && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: gold }} />
                        )}
                        {row.day}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: row.open ? sub : '#EF4444' }}
                      >
                        {row.hours}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div
                className="mt-5 pt-5 text-xs text-center"
                style={{ borderTop: `1px solid ${border}`, color: sub }}
              >
                <FaClock className="inline mr-1.5" style={{ color: gold }} />
                Today is highlighted in gold
              </div>
            </div>
          </div>
        </section>

        {/* ══ SOCIAL STRIP ══ */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-20">
          <div
            className="rounded-sm p-7 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{ background: card, border: `1px solid ${border}` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: dark ? '#13151E' : '#F7F3EC', color: '#1877F2' }}
              >
                <FaFacebook />
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase mb-0.5" style={{ color: gold }}>
                  Social Media
                </p>
                <p className="font-semibold text-sm" style={{ color: text }}>
                  Follow us on Facebook for project updates & quick messages
                </p>
              </div>
            </div>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-gold flex-shrink-0"
              style={{ borderColor: '#1877F2', color: '#1877F2' }}
            >
              <FaFacebook /> Follow on Facebook
            </a>
          </div>
        </section>

        {/* ══ BOTTOM CTA ══ */}
        <section className="relative overflow-hidden py-24" style={{ background: dark2 }}>
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: gold }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: gold }} />
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <span className="section-label">Ready to Begin?</span>
            <h2
              className="serif font-black text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Start Your Project Today
            </h2>
            <p className="mb-10 max-w-2xl mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
              25+ years of expertise · 50+ completed projects · Trusted across Bangladesh
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="tel:+8801XXXXXXXXX" className="btn-gold">
                <FaPhone /> Call Us Now
              </a>
              <a href="mailto:sumonconstruction2024@gmail.com" className="btn-outline-gold">
                <FaEnvelope /> Email Us
              </a>
              <a
                href="https://wa.me/8801XXXXXXXXX"
                target="_blank" rel="noreferrer"
                className="btn-outline-gold"
                style={{ borderColor: '#25D366', color: '#25D366' }}
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Contact;