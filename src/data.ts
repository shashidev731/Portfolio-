import { Project, Profile } from './types';

export const INITIAL_PROFILE: Profile = {
  name: "Shashidhar",
  title: "Creative Tech Architect & Niche Experience Specialist",
  bio: "I craft bespoke, high-end web applications and 3D visual experiences designed specifically to elevate business niches. From premium artisanal cafes to hygienic dental planners, luxury photographer galleries, and vibrant custom e-commerce stores, I focus on premium interactions, elegant typography, and stunning fluid layouts.",
  avatarUrl: "",
  skills: [
    {
      category: "Frontend",
      items: [
        { name: "React / Next.js", level: 96 },
        { name: "3D Animations & Transforms", level: 92 },
        { name: "TypeScript", level: 90 },
        { name: "Tailwind CSS", level: 98 },
        { name: "Framer Motion", level: 94 }
      ]
    },
    {
      category: "Backend",
      items: [
        { name: "Node.js / Express", level: 85 },
        { name: "RESTful & GraphQL APIs", level: 88 },
        { name: "State Sync & Web Sockets", level: 82 },
        { name: "Firebase / Firestore", level: 80 }
      ]
    },
    {
      category: "Design & UX",
      items: [
        { name: "Immersive Interactive UI", level: 96 },
        { name: "Responsive Architecture", level: 98 },
        { name: "Micro-interactions & Hover Effects", level: 95 },
        { name: "Premium Typography Pairing", level: 92 }
      ]
    },
    {
      category: "Tools & DevOps",
      items: [
        { name: "Git & Deployment", level: 88 },
        { name: "Vite / Bundlers", level: 90 },
        { name: "SEO & Performance Tuning", level: 95 },
        { name: "Analytics & Conversion Opt", level: 91 }
      ]
    }
  ],
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "Shashidhardev731@gmail.com",
    whatsapp: "8919945284"
  }
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "gourmet-cafe",
    title: "Aromatica Brew & Cafe",
    niche: "Cafe",
    subtitle: "Immersive Culinary & Reservation Experience",
    description: "A sensory-rich cafe storefront featuring interactive grid layouts, floating coffee beans, dynamic digital menu tabs with visual hover effects, and a complete simulated booking system.",
    fullDetails: "Built to elevate artisanal coffee brands, Aromatica showcases how interactive digital menu boards and cozy layout animations translate real-world cafe warmth into the browser. Features rapid menu filters, dynamic table booking validation, and immersive parallax aesthetics.",
    challenge: "Hospitality sites are historically generic, lacking custom interactive storytelling. They fail to convey physical craftsmanship or offer fluid reservation systems on smaller devices.",
    solution: "We integrated customized spring-based 3D transform layers, beautiful negative space, rich serif typography, and an automated booking state system that provides immediate confirmation receipts.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "CSS Perspective", "Framer Motion"],
    features: [
      "Custom 3D-tilting menu cards with delicious description overlays",
      "Interactive digital menu categorizer with live price filters",
      "Robust simulated booking engine with email & date verification",
      "Floating micro-animations that feel like warm ambient cafe air",
      "High-contrast elegant retro color palettes (Gold, Amber, Cream, Charcoal)"
    ],
    rating: 4.95,
    analytics: {
      views: 9420,
      conversion: 8.4, // Reservation rate
      performance: 98,
      rating: 4.9
    },
    liveUrl: "https://codepen.io/Shashidhar-the-styleful/full/KwamPOP",
    additionalLinks: [
      { label: "Interactive Coffee Canvas Menu", url: "https://codepen.io/Shashidhar-the-styleful/full/emgWjzZ" },
      { label: "Aromatica Cafe Landing Page", url: "https://codepen.io/Shashidhar-the-styleful/full/KwamPOP" }
    ],
    codeSnippet: {
      filename: "3dCardTilt.tsx",
      language: "typescript",
      code: `// Custom 3D Card Hover Effect for Culinary Items
import React, { useRef, useState } from 'react';

export function TiltMenuCard({ name, price, desc }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    setRotate({
      x: -y / (box.height / 25), // tilt range
      y: x / (box.width / 25)
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        transform: \`perspective(1000px) rotateX(\${rotate.x}deg) rotateY(\${rotate.y}deg)\`,
        transition: 'transform 0.1s ease-out'
      }}
      className="bg-zinc-900 border border-amber-500/20 p-6 rounded-2xl shadow-2xl"
    >
      <span className="text-amber-400 font-serif text-2xl">\${price}</span>
      <h3 className="text-xl font-bold text-stone-100 mt-2">{name}</h3>
      <p className="text-stone-400 text-sm mt-1">{desc}</p>
    </div>
  );
}`
    }
  },
  {
    id: "smilecare-dentist",
    title: "SmileCare Dental Portal",
    niche: "Dentist",
    subtitle: "Modern Clinical Scheduler & Dentistry Hub",
    description: "A hygienic, sleek clinical dashboard featuring responsive scheduling timelines, clear specialist service filters, interactive doctor bio cards, and comprehensive patient review sliders.",
    fullDetails: "SmileCare converts the typical sterile, scary dentist visit into a modern, welcoming, high-end portal. Built around patient peace of mind, it uses clean calming medical teal colors, interactive dental advice boards, and an elegant calendar scheduler.",
    challenge: "Most medical portals are either clunky, look extremely outdated, or fail to communicate specialized services in a way that builds trust with nervous patients.",
    solution: "Designed a smooth, responsive, ultra-clean web platform with intuitive layouts, instant feedback appointment buttons, clear pricing guidelines, and detailed staff profile cards.",
    technologies: ["React", "Tailwind CSS", "Lucide Icons", "Calming Teal Palette", "Responsive Flex Grid"],
    features: [
      "Interactive appointment slot selection with real-time feedback",
      "Dynamic medical accordion for FAQs and treatment guides",
      "Clear dentist expertise filtering (Orthodontic, Cosmetic, Pediatric)",
      "Trust-enhancing testimonial slider with patient satisfaction metrics",
      "Integrated Google-Maps simulated clinical directions widget"
    ],
    rating: 4.88,
    analytics: {
      views: 7540,
      conversion: 14.2, // Booking conversion rate
      performance: 97,
      rating: 4.9
    },
    liveUrl: "https://lovable.dev/preview/8F18AcrtVTP0uC9ImyUrQVbkaRFilX5R",
    codeSnippet: {
      filename: "AppointmentScheduler.tsx",
      language: "typescript",
      code: `// Calm, Secure Interactive Appointment Grid
export function TimeSelector({ selectedDate, onSelect }: SelectorProps) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const slots = ["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {slots.map(slot => (
        <button
          key={slot}
          onClick={() => {
            setActiveSlot(slot);
            onSelect(slot);
          }}
          className={\`py-3 px-4 rounded-xl font-medium border transition-all duration-300 \${
            activeSlot === slot
              ? "bg-teal-500 text-white border-teal-500 shadow-lg shadow-teal-500/20 scale-[1.03]"
              : "bg-teal-50/50 hover:bg-teal-50 text-teal-900 border-teal-100"
          }\`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}`
    }
  },
  {
    id: "aura-lens",
    title: "Aura Lens Studio & Editorial Galleries",
    niche: "Photography",
    subtitle: "Premium High-Fashion & Fine-Art Editorial Portfolios",
    description: "A premium photography showcase representing dark-canvas layout architectures, masonry galleries, real-time photographic filters, and beautiful overlay descriptions.",
    fullDetails: "Aura Lens presents a collection of photographic masterpieces in a modern museum-like setting. Includes multiple showcase themes (cinematic dark, editorial minimalist, artistic grids) to fit every visual artist's taste perfectly.",
    challenge: "Creative web portfolios typically scale images poorly, distorting framing ratios or lagging during large high-res asset renders.",
    solution: "Designed a lightweight, fluid Masonry arrangement powered by CSS flexbox, utilizing progressive loading techniques, real-time hue and saturation tone controls, and responsive detail cards.",
    technologies: ["React", "Vanilla Parallax", "Masonry CSS", "Interactive Lightbox", "EXIF Data Hooks"],
    features: [
      "Masonry grid adapts dynamically to various landscape & portrait ratios",
      "Real-time visual tone shifter (Sepia, Monochromatic, Vibrant, Cozy Gold)",
      "Immersive dark-canvas modal lightbox supporting smooth gesture swipes",
      "Dynamic technical metadata displays (ISO, Focal Length, Shutter, Aperture)",
      "Visual inquiry custom proposal system for prospective art collectors"
    ],
    rating: 4.98,
    analytics: {
      views: 18400,
      conversion: 7.1, // Booking inquiries
      performance: 96,
      rating: 4.97
    },
    liveUrl: "https://radiant-mooncake-c47bbc.netlify.app/",
    additionalLinks: [
      { label: "Radiant Mooncake Gallery", url: "https://radiant-mooncake-c47bbc.netlify.app/" },
      { label: "Stirring Gingersnap Grid", url: "https://stirring-gingersnap-674de1.netlify.app/" },
      { label: "Peppy Bonbon Gallery Portfolio", url: "https://peppy-bonbon-6a245e.netlify.app/" }
    ],
    codeSnippet: {
      filename: "MasonryRender.tsx",
      language: "typescript",
      code: `// Masonry Layout with Aspect Ratio Protection
export function MasonryGallery({ items, filter }: GalleryProps) {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 p-4">
      {items.map(item => (
        <div 
          key={item.id} 
          className="break-inside-avoid overflow-hidden rounded-2xl group relative bg-zinc-950 border border-zinc-800"
        >
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end" />
        </div>
      ))}
    </div>
  );
}`
    }
  },
  {
    id: "artisan-treasures",
    title: "Artisan Treasures Etsy Hub",
    niche: "E-Commerce",
    subtitle: "Boutique Craft & Handcrafted Showcase Platform",
    description: "An elegant, high-performance boutique storefront that showcases customizable artisan goods with direct buy integrations, active basket counter triggers, and clean checkout sheets.",
    fullDetails: "Designed to showcase premium craft items in an elegant, cozy storefront. Brings the tactile satisfaction of holding handmade creations into the online sphere through high-fidelity item cards, smooth spring-based shopping interactions, and an intuitive client-side checkout simulator.",
    challenge: "Etsy and eBay listings often lack unique visual branding, cramming fine handmade items next to noisy generic items in standard grid search results.",
    solution: "We engineered a clean-room storefront containing dedicated zoom viewports, instant product searching, and custom-designed product descriptions paired with modern trust indicators.",
    technologies: ["React", "Tailwind CSS", "Motion", "Dynamic Search Indexing", "Spring Hooks"],
    features: [
      "Custom product cards with springy hover animations",
      "Dynamic checkout sliding panel detailing mock order receipts",
      "Robust client-side search index scanning and category filtering",
      "Live order-counter simulation representing real-time shop demand",
      "Interactive feedback when adding goods to checkout baskets"
    ],
    rating: 4.92,
    analytics: {
      views: 12500,
      conversion: 6.8, // Checkout conversions
      performance: 99,
      rating: 4.9
    },
    liveUrl: "https://codepen.io/Shashidhar-the-styleful/full/zxNwoav",
    codeSnippet: {
      filename: "EtsyIntegrator.tsx",
      language: "typescript",
      code: `// Custom Springy Storefront Cards
export function StorefrontCard({ product, onAdd }: CardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col rounded-2xl border border-stone-200 bg-white p-4 overflow-hidden transition-all duration-300"
      style={{
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 20px 25px -5px rgb(0 0 0 / 0.05)' : 'none'
      }}
    >
      <div className="relative aspect-square rounded-xl bg-stone-100 overflow-hidden mb-4">
        <img src={product.image} className="h-full w-full object-cover" />
      </div>
      <h3 className="text-stone-900 font-medium text-lg">{product.name}</h3>
      <p className="text-stone-500 text-sm mt-1">{product.category}</p>
      <div className="flex items-center justify-between mt-4">
        <span className="text-emerald-700 font-semibold text-xl">\${product.price}</span>
        <button onClick={() => onAdd(product)} className="bg-stone-900 text-white rounded-full p-2 hover:bg-stone-800" />
      </div>
    </div>
  );
}`
    }
  }
];
