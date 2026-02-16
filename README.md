# 🏗️ M/S Sumon Enterprise — Construction Portfolio

<div align="center">

![M/S Sumon Enterprise](https://i.ibb.co/whth5JQm/Screenshot-2026-02-16-at-12-21-28-PM.png)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-C9A84C?style=for-the-badge&logo=vercel)](https://sumon-enterprise.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/sumu9897/sumon-enterprise-frontend)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A professional construction company portfolio website built with React and Tailwind CSS.**  
Showcasing 25+ years of expertise and 50+ completed projects across Bangladesh.

</div>

---

## 📸 Screenshots

| Light Mode | Dark Mode |
|:---:|:---:|
| ![Light Mode](https://i.ibb.co/whth5JQm/Screenshot-2026-02-16-at-12-21-28-PM.png) | ![Dark Mode](https://i.ibb.co/PvgxhVTK/Screenshot-2026-02-16-at-12-09-31-PM.png) |

---

## ✨ Features

- 🌗 **Dark / Light Mode** — Toggle with localStorage persistence and OS preference detection
- 🏠 **Home Page** — Animated hero, scroll-triggered stats counter, featured projects, services overview
- 📋 **Projects Page** — Filter by status, company & search with client-side pagination
- 🔍 **Project Detail** — Full image lightbox gallery, specifications, location map
- 🖼️ **Gallery** — Filterable image gallery across all projects with lightbox
- 📖 **About Page** — Company story, animated milestone timeline, core values, mission & vision
- ⚙️ **Services Page** — Alternating image/text layout, work process steps
- 📞 **Contact Page** — Info cards, Google Maps embed, office hours with today highlight
- 📱 **Fully Responsive** — Mobile, tablet, and desktop optimized
- ⚡ **No Backend** — All data served from a static JSON file
- 🎨 **Polished Animations** — Staggered hero reveals, hover lifts, gold shimmer effects

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React 18, React Router DOM v6 |
| **Styling** | Tailwind CSS, Custom CSS Animations |
| **UI Components** | Swiper.js, Yet Another React Lightbox, React Icons |
| **Data** | Static JSON (no backend required) |
| **Hosting** | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.jsx        # Sticky nav with dark/light toggle
│   │   ├── Footer.jsx
│   │   └── LoadingSpinner.jsx
├── pages/
│   ├── Home.jsx              # Landing page with hero & stats
│   ├── About.jsx             # Company story & milestones
│   ├── Services.jsx          # Services with alternating layout
│   ├── Projects.jsx          # Filterable project grid
│   ├── ProjectDetail.jsx     # Single project with lightbox
│   ├── Gallery.jsx           # Full image gallery
│   └── Contact.jsx           # Contact info & map
├── data/
│   └── projects.json         # All project data (images, specs, etc.)
└── services/
    └── api.js                # (Legacy — no longer used)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 16`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sumu9897/sumon-enterprise-frontend.git

# 2. Navigate to the project directory
cd sumon-enterprise-frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 📊 Data Management

All project data lives in `src/data/projects.json`. To add a new project, append an entry following this structure:

```json
{
  "id": 17,
  "company": "Company Name",
  "projectName": "Project Name",
  "slug": "project-name-slug",
  "description": "Short description of the project",
  "specifications": {
    "floors": "G+9",
    "floorArea": "3000sft per floor",
    "type": "Residential",
    "finish": "Fair-Face"
  },
  "address": {
    "plot": "123",
    "road": "5",
    "block": "A",
    "area": "Bashundhara",
    "city": "Dhaka"
  },
  "status": "Ongoing",
  "startDate": "2025",
  "finishDate": null,
  "images": [
    { "url": "https://i.ibb.co/XXXXXXXX/image.jpg" }
  ]
}
```

> **Image hosting:** Upload images to [ImgBB](https://imgbb.com/) and use the **Direct Link** (format: `https://i.ibb.co/XXXXXXXX/image.jpg`). Make sure the domain is `i.ibb.co` — NOT `i.ibb.co.com`.

---

## 🌗 Dark / Light Mode

The theme system uses a `dark` class on `<html>` toggled by the Header component and stored in `localStorage`. All pages use a shared `useDarkMode()` hook:

```js
const useDarkMode = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains('dark'))
    );
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);
  return dark;
};
```

Make sure your `tailwind.config.js` has:
```js
module.exports = {
  darkMode: 'class',
  // ...
}
```

---

## 📦 Key Dependencies

```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "tailwindcss": "^3.0.0",
  "yet-another-react-lightbox": "^3.0.0",
  "swiper": "^11.0.0",
  "react-icons": "^4.0.0",
  "react-toastify": "^9.0.0"
}
```

---

## 🗺️ Pages Overview

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, stats, featured projects, services, CTA |
| `/about` | About | Story, timeline, values, mission/vision |
| `/services` | Services | 4 services with features and process |
| `/projects` | Projects | Filterable, paginated project grid |
| `/projects/:slug` | Project Detail | Images, specs, map, CTA |
| `/gallery` | Gallery | All project images with lightbox |
| `/contact` | Contact | Info cards, map, office hours |

---

## 🔮 Future Plans

- [ ] Admin panel / CMS for managing projects without editing JSON
- [ ] Contact form with email via Brevo (Sendinblue) API
- [ ] Blog section for construction tips and company news
- [ ] Image optimization with WebP format and lazy loading
- [ ] Google Analytics integration
- [ ] 3D building visualization with Three.js for featured projects

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sumon** — [@sumu9897](https://github.com/sumu9897)

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

[![GitHub stars](https://img.shields.io/github/stars/sumu9897/sumon-enterprise-frontend?style=social)](https://github.com/sumu9897/sumon-enterprise-frontend)

</div>