import React, { useState, useEffect, useRef } from 'react';
import { 
  Coffee, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Check, 
  Copy, 
  RotateCcw, 
  Code2, 
  Sliders, 
  Eye, 
  TrendingUp, 
  Gauge, 
  Star, 
  Send, 
  Smartphone, 
  Laptop, 
  ChevronRight, 
  Info, 
  X, 
  Bookmark, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Layers, 
  Settings, 
  Briefcase, 
  Heart, 
  Camera, 
  ShoppingBag, 
  Plus, 
  Trash, 
  Undo, 
  Menu, 
  User, 
  Inbox, 
  CheckCircle2, 
  ExternalLink, 
  Cpu,
  Cloud,
  Leaf,
  Sun,
  Moon,
  Zap,
  Compass
} from 'lucide-react';
import { INITIAL_PROFILE, INITIAL_PROJECTS } from './data';
import { Project, Niche } from './types';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

// Custom hourly telemetry performance and conversion data for each unique project
const PERFORMANCE_TRENDS: Record<string, { time: string; performance: number; conversion: number }[]> = {
  "gourmet-cafe": [
    { time: "08:00 AM", performance: 90, conversion: 6.2 },
    { time: "10:00 AM", performance: 93, conversion: 7.1 },
    { time: "12:00 PM", performance: 95, conversion: 7.9 },
    { time: "02:00 PM", performance: 98, conversion: 8.4 },
    { time: "04:00 PM", performance: 98, conversion: 8.4 },
  ],
  "smilecare-dentist": [
    { time: "08:00 AM", performance: 88, conversion: 10.5 },
    { time: "10:00 AM", performance: 92, conversion: 12.0 },
    { time: "12:00 PM", performance: 95, conversion: 13.1 },
    { time: "02:00 PM", performance: 97, conversion: 14.2 },
    { time: "04:00 PM", performance: 97, conversion: 14.2 },
  ],
  "aura-lens": [
    { time: "08:00 AM", performance: 85, conversion: 5.0 },
    { time: "10:00 AM", performance: 89, conversion: 5.8 },
    { time: "12:00 PM", performance: 92, conversion: 6.5 },
    { time: "02:00 PM", performance: 96, conversion: 7.1 },
    { time: "04:00 PM", performance: 96, conversion: 7.1 },
  ],
  "artisan-treasures": [
    { time: "08:00 AM", performance: 91, conversion: 4.8 },
    { time: "10:00 AM", performance: 94, conversion: 5.5 },
    { time: "12:00 PM", performance: 97, conversion: 6.2 },
    { time: "02:00 PM", performance: 99, conversion: 6.8 },
    { time: "04:00 PM", performance: 99, conversion: 6.8 },
  ],
};

const getProjectLinkName = (projectId: string, url?: string): string => {
  if (!url) return "Live Preview";
  if (projectId === "gourmet-cafe") {
    if (url.includes("emgWjzZ")) return "Interactive Coffee Canvas Menu";
    return "Aromatica Cafe Landing Page";
  }
  if (projectId === "smilecare-dentist") {
    return "SmileCare Dental Portal";
  }
  if (projectId === "aura-lens") {
    if (url.includes("stirring-gingersnap")) return "Stirring Gingersnap Grid";
    if (url.includes("peppy-bonbon")) return "Peppy Bonbon Gallery Portfolio";
    return "Radiant Mooncake Gallery";
  }
  if (projectId === "artisan-treasures") {
    return "Artisan Treasures Etsy Hub";
  }
  return "Live Preview";
};

const getLinkPlatformLabel = (url: string): { name: string; color: string; icon: string } => {
  if (url.includes("codepen.io")) {
    return { name: "CodePen", color: "bg-stone-950 text-amber-400 border-zinc-800", icon: "CP" };
  }
  if (url.includes("lovable.dev")) {
    return { name: "Lovable", color: "bg-indigo-950 text-indigo-400 border-indigo-900/50", icon: "LV" };
  }
  if (url.includes("netlify.app")) {
    return { name: "Netlify", color: "bg-teal-950 text-teal-400 border-teal-900/50", icon: "NT" };
  }
  return { name: "Web App", color: "bg-zinc-900 text-zinc-400 border-zinc-800", icon: "WEB" };
};

export default function App() {
  // Profile & Projects State
  const profile = INITIAL_PROFILE;
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [activeNiche, setActiveNiche] = useState<Niche | 'All'>('All');
  const [portfolioTheme, setPortfolioTheme] = useState<'sky' | 'cosmic'>('sky');

  // Compute clean, deduplicated, named list of deployment links for the selected project
  const allProjectLinks = React.useMemo(() => {
    const links: { label: string; url: string; isPrimary: boolean }[] = [];
    if (selectedProject.liveUrl) {
      const primaryLabel = getProjectLinkName(selectedProject.id, selectedProject.liveUrl);
      links.push({
        label: primaryLabel,
        url: selectedProject.liveUrl,
        isPrimary: true
      });
    }
    
    if (selectedProject.additionalLinks) {
      selectedProject.additionalLinks.forEach(lnk => {
        if (!links.some(l => l.url === lnk.url)) {
          links.push({
            label: lnk.label,
            url: lnk.url,
            isPrimary: false
          });
        }
      });
    }
    return links;
  }, [selectedProject]);

  // Dynamic telemetry chart data based on selected project
  const chartData = React.useMemo(() => {
    return PERFORMANCE_TRENDS[selectedProject.id] || [
      { time: "08:00 AM", performance: selectedProject.analytics.performance - 6, conversion: selectedProject.analytics.conversion - 2 },
      { time: "10:00 AM", performance: selectedProject.analytics.performance - 3, conversion: selectedProject.analytics.conversion - 1 },
      { time: "12:00 PM", performance: selectedProject.analytics.performance - 1, conversion: selectedProject.analytics.conversion },
      { time: "02:00 PM", performance: selectedProject.analytics.performance, conversion: selectedProject.analytics.conversion },
      { time: "04:00 PM", performance: selectedProject.analytics.performance, conversion: selectedProject.analytics.conversion },
    ];
  }, [selectedProject]);

  // Interactive 3D Control States
  const [tiltX, setTiltX] = useState<number>(-12);
  const [tiltY, setTiltY] = useState<number>(18);
  const [perspective, setPerspective] = useState<number>(1200);
  const [scale, setScale] = useState<number>(1.0);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isMouseTracking, setIsMouseTracking] = useState<boolean>(false);
  const deviceRef = useRef<HTMLDivElement>(null);

  // Active Code Tab
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Simulated Live Visitor Feed
  const [liveVisitors, setLiveVisitors] = useState<number>(4);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next < 2 ? 2 : next > 9 ? 9 : next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Mouse tilt tracking handler
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseTracking || !deviceRef.current || !is3DMode) return;
    const box = deviceRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Convert coordinate offset to degrees (max tilt ~28 degrees)
    const degX = -(y / (box.height / 2)) * 25;
    const degY = (x / (box.width / 2)) * 25;
    
    setTiltX(Number(degX.toFixed(1)));
    setTiltY(Number(degY.toFixed(1)));
  };

  const handleMouseLeave = () => {
    if (isMouseTracking) {
      setTiltX(-10);
      setTiltY(15);
    }
  };

  // Reset 3D device rotations
  const reset3DRotations = () => {
    setTiltX(-12);
    setTiltY(18);
    setPerspective(1200);
    setScale(1.0);
    setIsMouseTracking(false);
  };

  // Copy Code Helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // --- NICHE PLAYGROUND SIMULATORS ---
  
  // 1. Cafe Brewing Simulator
  const [cafeDrink, setCafeDrink] = useState<'Espresso' | 'Cappuccino' | 'Latte' | 'Americano'>('Espresso');
  const [cafeMilk, setCafeMilk] = useState<'None' | 'Oat Milk' | 'Almond' | 'Whole Milk'>('None');
  const [cafeTemp, setCafeTemp] = useState<number>(75); // °C
  const [cafeSweetness, setCafeSweetness] = useState<number>(20); // %
  const [isBrewing, setIsBrewing] = useState<boolean>(false);
  const [brewProgress, setBrewProgress] = useState<number>(0);
  const [brewResult, setBrewResult] = useState<string>('');

  const triggerBrewing = () => {
    if (isBrewing) return;
    setIsBrewing(true);
    setBrewProgress(0);
    setBrewResult('');
    
    const interval = setInterval(() => {
      setBrewProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsBrewing(false);
            setBrewResult(`Perfect ${cafeDrink} crafted with ${cafeMilk === 'None' ? 'No' : cafeMilk} Milk at ${cafeTemp}°C (${cafeSweetness}% sweetness). Delicious 3D pour complete!`);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  // 2. Dentist Timeline & Patient Planner
  const [dentistService, setDentistService] = useState<'Checkup' | 'Whitening' | 'Crown' | 'Braces'>('Checkup');
  const [dentistDate, setDentistDate] = useState<string>('2026-06-26');
  const [dentistTime, setDentistTime] = useState<string>('10:30 AM');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [dentistConfirmed, setDentistConfirmed] = useState<boolean>(false);

  const getToothAdvice = (num: number) => {
    const adviceMap: Record<number, { condition: string; action: string }> = {
      8: { condition: 'Minor Incisor Flaking', action: 'Cosmic polishing' },
      9: { condition: 'Slight Misalignment', action: 'Invisalign contouring' },
      14: { condition: 'Deep Cavity Detected', action: 'Micro-ceramic filling' },
      19: { condition: 'Plaque Accumulation', action: 'Hygienic ultrasonic clean' },
      30: { condition: 'Healthy Molar', action: 'Routine sealing protective layer' }
    };
    return adviceMap[num] || { condition: 'Healthy Condition', action: 'Fluoride wash preservation' };
  };

  // 3. Photography Interactive Filter Board
  const [photoFilter, setPhotoFilter] = useState<'original' | 'noir' | 'vintage' | 'cyberpunk'>('original');
  const [photoBrightness, setPhotoBrightness] = useState<number>(100);
  const [photoContrast, setPhotoContrast] = useState<number>(100);
  const [photoVignette, setPhotoVignette] = useState<boolean>(false);
  const [photoFocusPoint, setPhotoFocusPoint] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const getFilterStyle = () => {
    let filterStr = `brightness(${photoBrightness}%) contrast(${photoContrast}%)`;
    if (photoFilter === 'noir') filterStr += ' grayscale(1) contrast(125%)';
    if (photoFilter === 'vintage') filterStr += ' sepia(0.8) hue-rotate(10deg) saturate(110%)';
    if (photoFilter === 'cyberpunk') filterStr += ' hue-rotate(140deg) saturate(160%) brightness(105%)';
    return filterStr;
  };

  // 4. Etsy Customized Engraving Bench
  const [etsyMaterial, setEtsyMaterial] = useState<'Walnut wood' | 'Ceramic Clay' | 'Polished Brass'>('Walnut wood');
  const [etsyEngraving, setEtsyEngraving] = useState<string>('CREATIVE TECH');
  const [etsyAccent, setEtsyAccent] = useState<'Gold' | 'Bronze' | 'Silver'>('Gold');
  const [etsyCartCount, setEtsyCartCount] = useState<number>(0);
  const [etsyMessage, setEtsyMessage] = useState<string>('');

  const handleEtsyAddToBasket = () => {
    setEtsyCartCount(prev => prev + 1);
    setEtsyMessage('Added custom masterpiece to simulated basket!');
    setTimeout(() => setEtsyMessage(''), 3000);
  };

  // --- "BUILD ONE NOW" BLUEPRINT SYNTHESIZER ---
  const [builderBizName, setBuilderBizName] = useState<string>('');
  const [builderNiche, setBuilderNiche] = useState<Niche>('E-Commerce');
  const [builderTheme, setBuilderTheme] = useState<'Warm Retro' | 'Teal Mint' | 'Cinematic Dark' | 'Premium Gold' | 'Floating Sky'>('Floating Sky');
  const [builderGoal, setBuilderGoal] = useState<string>('Boost Booking Rate');
  const [builderAddons, setBuilderAddons] = useState<string[]>(['Interactive 3D Sandbox']);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [savedProposals, setSavedProposals] = useState<any[]>([]);
  const [activeProposal, setActiveProposal] = useState<any | null>(null);

  // Load saved proposals
  useEffect(() => {
    const saved = localStorage.getItem('shashidhar_proposals');
    if (saved) {
      try {
        setSavedProposals(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAddonToggle = (addon: string) => {
    setBuilderAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const synthesizeBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    const nameToUse = builderBizName.trim() || 'My Premium Project';
    setIsSynthesizing(true);

    setTimeout(() => {
      // Calculate realistic metrics
      const performanceIndex = Math.floor(Math.random() * 5) + 95; // 95 - 99
      const estConversion = builderNiche === 'Cafe' ? '12.4%' : 
                            builderNiche === 'Dentist' ? '16.8%' : 
                            builderNiche === 'Photography' ? '8.5%' : '14.2%';
      const estimatedCost = 2800 + (builderAddons.length * 450);

      const newProposal = {
        id: 'prop_' + Date.now(),
        businessName: nameToUse,
        niche: builderNiche,
        theme: builderTheme,
        goal: builderGoal,
        addons: [...builderAddons],
        performance: performanceIndex,
        conversionBoost: estConversion,
        cost: estimatedCost,
        date: new Date().toLocaleDateString()
      };

      const updated = [newProposal, ...savedProposals];
      setSavedProposals(updated);
      localStorage.setItem('shashidhar_proposals', JSON.stringify(updated));
      setActiveProposal(newProposal);
      setIsSynthesizing(false);
    }, 1200);
  };

  const deleteProposal = (id: string) => {
    const updated = savedProposals.filter(p => p.id !== id);
    setSavedProposals(updated);
    localStorage.setItem('shashidhar_proposals', JSON.stringify(updated));
    if (activeProposal?.id === id) {
      setActiveProposal(null);
    }
  };

  // --- CONTACT / LEAD INBOX ENGINE ---
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactSubject, setContactSubject] = useState<string>('');
  const [contactText, setContactText] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);

  useEffect(() => {
    const savedMsg = localStorage.getItem('shashidhar_inbox');
    if (savedMsg) {
      try {
        setInboxMessages(JSON.parse(savedMsg));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactText) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      name: contactName,
      email: contactEmail,
      subject: contactSubject || 'Custom Niche Project Inquiry',
      message: contactText,
      date: new Date().toLocaleString()
    };

    const updated = [newMsg, ...inboxMessages];
    setInboxMessages(updated);
    localStorage.setItem('shashidhar_inbox', JSON.stringify(updated));

    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactText('');
    setContactSubmitted(true);

    setTimeout(() => {
      setContactSubmitted(false);
    }, 5000);
  };

  const clearMessage = (id: string) => {
    const updated = inboxMessages.filter(m => m.id !== id);
    setInboxMessages(updated);
    localStorage.setItem('shashidhar_inbox', JSON.stringify(updated));
  };

  // Project Niche filtering
  const filteredProjects = projects.filter(p => activeNiche === 'All' || p.niche === activeNiche);

  // Quick select project helper
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    // Reset specific states
    setBrewResult('');
    setDentistConfirmed(false);
    setSelectedTooth(null);
  };

  const isSky = portfolioTheme === 'sky';

  return (
    <div className={`min-h-screen transition-all duration-1000 relative overflow-x-hidden font-sans ${
      isSky 
        ? 'bg-gradient-to-b from-sky-300 via-emerald-50 to-amber-50 text-zinc-800 selection:bg-emerald-200 selection:text-emerald-900 animate-sky-shimmer' 
        : 'bg-zinc-950 text-stone-100 selection:bg-amber-500/30 selection:text-amber-200'
    }`}>
      
      {/* Immersive Space Mesh Background Grid */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${isSky ? 'opacity-20' : 'opacity-50'} animate-grid-move`} 
        style={{ 
          backgroundImage: isSky 
            ? 'linear-gradient(to_right,#0f766e0c_1px,transparent_1px),linear-gradient(to_bottom,#0f766e0c_1px,transparent_1px)' 
            : 'linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)',
          backgroundSize: '40px_40px'
        }}
      />

      {/* Floating Atmosphere Lights based on Niche */}
      {!isSky ? (
        <>
          <div className="absolute top-[-10%] left-[5%] w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none opacity-20 bg-amber-500/40 animate-pulse-slow" />
          <div className="absolute top-[40%] right-[-5%] w-[45vw] h-[45vw] rounded-full blur-[140px] pointer-events-none opacity-15 bg-teal-500/30 animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[-5%] left-[10%] w-[35vw] h-[35vw] rounded-full blur-[110px] pointer-events-none opacity-20 bg-emerald-500/25 animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </>
      ) : (
        <>
          {/* Nature Sunray & Meadow Atmosphere */}
          <div className="absolute top-[-15%] left-[30%] w-[50vw] h-[50vw] rounded-full blur-[140px] pointer-events-none opacity-40 bg-amber-200/50" />
          <div className="absolute top-[30%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[150px] pointer-events-none opacity-30 bg-emerald-300/40" />
          <div className="absolute bottom-[5%] left-[5%] w-[45vw] h-[45vw] rounded-full blur-[120px] pointer-events-none opacity-35 bg-teal-200/40" />
        </>
      )}

      {/* Floating Sky Theme Overlay (Clouds & Nature) */}
      {isSky && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Beautiful moving Vector Clouds */}
          <div className="absolute top-[8%] left-0 w-64 h-24 opacity-60 animate-cloud-slow-1">
            <svg viewBox="0 0 100 40" fill="white" className="w-full h-full drop-shadow-[0_8px_16px_rgba(255,255,255,0.4)]">
              <path d="M 20 30 Q 10 30 15 20 Q 20 10 35 15 Q 45 5 60 10 Q 75 5 80 20 Q 90 20 85 30 Z" />
            </svg>
          </div>
          <div className="absolute top-[28%] left-0 w-80 h-28 opacity-45 animate-cloud-slow-2">
            <svg viewBox="0 0 100 40" fill="white" className="w-full h-full drop-shadow-[0_8px_16px_rgba(255,255,255,0.3)]">
              <path d="M 20 30 Q 10 30 15 20 Q 20 10 35 15 Q 45 5 60 10 Q 75 5 80 20 Q 90 20 85 30 Z" />
            </svg>
          </div>
          <div className="absolute top-[55%] left-0 w-72 h-26 opacity-55 animate-cloud-slow-3">
            <svg viewBox="0 0 100 40" fill="white" className="w-full h-full drop-shadow-[0_8px_16px_rgba(255,255,255,0.35)]">
              <path d="M 20 30 Q 10 30 15 20 Q 20 10 35 15 Q 45 5 60 10 Q 75 5 80 20 Q 90 20 85 30 Z" />
            </svg>
          </div>
          
          {/* Swirling, drifting green nature leaves */}
          <div className="absolute top-0 left-[15%] w-6 h-6 text-emerald-600/40 animate-leaf-swirl-1">
            <Leaf className="w-full h-full fill-emerald-500/20" />
          </div>
          <div className="absolute top-[15%] left-[65%] w-8 h-8 text-emerald-500/30 animate-leaf-swirl-2">
            <Leaf className="w-full h-full fill-emerald-400/10" />
          </div>
          <div className="absolute top-[35%] left-[80%] w-5 h-5 text-teal-600/40 animate-leaf-swirl-3">
            <Leaf className="w-full h-full fill-teal-500/20" />
          </div>
          <div className="absolute top-[50%] left-[30%] w-7 h-7 text-emerald-500/30 animate-leaf-swirl-2">
            <Leaf className="w-full h-full fill-emerald-500/15" />
          </div>
          <div className="absolute top-[75%] left-[10%] w-6 h-6 text-emerald-600/40 animate-leaf-swirl-1">
            <Leaf className="w-full h-full fill-emerald-600/20" />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">

        {/* --- PREMIUM HEADER --- */}
        <header id="portfolio-header" className={`mb-12 border-b pb-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-1000 ${
          isSky ? 'border-zinc-200/80' : 'border-zinc-900'
        }`}>
          <div className="flex items-center gap-5">
            {/* Avatar with 3D Rotate Interaction */}
            <div className="relative group cursor-pointer perspective-1000">
              <div className={`absolute -inset-1.5 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition duration-500 ${
                isSky ? 'bg-gradient-to-tr from-emerald-400 to-sky-500' : 'bg-gradient-to-tr from-amber-500 to-teal-500'
              }`} />
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.name} 
                  className={`relative w-16 h-16 rounded-full object-cover border-2 transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(360deg)] ${
                    isSky ? 'border-white' : 'border-zinc-900'
                  }`}
                />
              ) : (
                <div className={`relative w-16 h-16 rounded-full border-2 text-2xl font-extrabold flex items-center justify-center font-serif shadow-inner transition-transform duration-700 preserve-3d group-hover:[transform:rotateY(360deg)] ${
                  isSky 
                    ? 'bg-gradient-to-tr from-emerald-500 to-sky-400 border-white text-white' 
                    : 'bg-gradient-to-tr from-zinc-900 to-zinc-800 border-zinc-700 text-amber-400'
                }`}>
                  {profile.name[0]}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-pulse" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className={`text-3xl font-extrabold tracking-tight bg-clip-text text-transparent font-serif transition-colors duration-1000 ${
                  isSky 
                    ? 'bg-gradient-to-r from-teal-950 via-sky-900 to-emerald-950' 
                    : 'bg-gradient-to-r from-stone-50 via-stone-200 to-amber-200'
                }`}>
                  {profile.name}
                </h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-1000 ${
                  isSky 
                    ? 'bg-white/80 border-emerald-200/80 text-emerald-800 shadow-sm' 
                    : 'bg-zinc-900 border border-zinc-800 text-amber-400'
                }`}>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
                  {isSky ? 'Nature-Inspired Architect' : '3D Animation Specialist'}
                </span>
              </div>
              <p className={`mt-1 font-medium text-sm md:text-base transition-colors duration-1000 ${
                isSky ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                {profile.title}
              </p>
            </div>
          </div>

          {/* Interactive Themes Control + Live Visitors */}
          <div className="flex flex-col items-stretch md:items-end gap-3.5 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-3">
              {/* Premium Theme Switcher */}
              <div className={`flex items-center gap-1.5 p-1 rounded-xl shadow-lg border transition-all duration-1000 ${
                isSky ? 'bg-white/80 border-emerald-200' : 'bg-zinc-900/80 border-zinc-800'
              }`}>
                <button 
                  type="button"
                  onClick={() => setPortfolioTheme('sky')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    isSky 
                      ? 'bg-gradient-to-r from-sky-400 to-emerald-400 text-zinc-950 shadow-md scale-105' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Floating Sky Theme</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPortfolioTheme('cosmic')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    !isSky 
                      ? 'bg-amber-500 text-zinc-950 shadow-md scale-105' 
                      : 'text-zinc-500 hover:text-zinc-800'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Cosmic Space</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3">
              {/* Live Counter Display */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-1000 ${
                isSky ? 'bg-white/70 border-emerald-200/50 text-zinc-700' : 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
              }`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <p className="text-xs font-medium">
                  <strong className={isSky ? 'text-zinc-900' : 'text-zinc-100'}>{liveVisitors}</strong> clients exploring right now
                </p>
              </div>

              {/* Availability Indicator */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-1000 ${
                isSky 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' 
                  : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Fixing Premium Deals Today
              </div>
            </div>
          </div>
        </header>


        {/* --- MAIN INTERACTIVE 3D PERSPECTIVE STUDIO --- */}
        <section id="perspective-studio" className="mb-20">
          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            
            {/* Left Column: Project Showcase Details */}
            <div className="w-full lg:w-[42%] flex flex-col justify-between">
              <div>
                <div className={`flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest mb-3 ${
                  isSky ? 'text-emerald-700' : 'text-amber-500'
                }`}>
                  <span className={`h-[1px] w-6 ${isSky ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  Niche Showcase Portfolio
                </div>

                {/* Main Heading */}
                <h2 className={`text-4xl sm:text-5xl font-black tracking-tight leading-none mb-4 font-serif transition-colors duration-1000 ${
                  isSky ? 'text-zinc-900' : 'text-stone-100'
                }`}>
                  {selectedProject.title}
                </h2>
                
                <p className={`text-lg mb-6 leading-relaxed transition-colors duration-1000 ${
                  isSky ? 'text-zinc-700' : 'text-zinc-300'
                }`}>
                  {selectedProject.subtitle}. {selectedProject.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.technologies.map(tech => (
                    <span 
                      key={tech} 
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors duration-1000 ${
                        isSky 
                          ? 'bg-white/80 border-emerald-100 text-zinc-800' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Project Links Section */}
                <div className={`p-5 rounded-2xl mb-8 transition-all duration-1000 ${
                  isSky ? 'bg-white/70 border border-white/80 shadow-md text-zinc-800 shadow-sky-900/5' : 'glass-panel'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-widest mb-3.5 flex items-center justify-between transition-colors duration-1000 ${
                    isSky ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <Info className={`w-3.5 h-3.5 ${isSky ? 'text-emerald-600' : 'text-amber-400'}`} />
                      Verified Deployments & Portfolios
                    </div>
                    <span className="text-[10px] lowercase opacity-60">real live previews</span>
                  </div>

                  <div className="space-y-3">
                    {allProjectLinks.map((lnk, idx) => {
                      const platform = getLinkPlatformLabel(lnk.url);
                      return (
                        <a 
                          key={idx}
                          href={lnk.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 group ${
                            isSky 
                              ? 'bg-zinc-50 hover:bg-emerald-50/50 border-zinc-200 hover:border-emerald-300 text-zinc-800 shadow-sm'
                              : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800/80 hover:border-amber-500/30 text-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden pr-2">
                            {/* Visual Platform Badge Icon */}
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider border shrink-0 ${platform.color}`}>
                              {platform.name}
                            </span>
                            <span className="text-xs font-bold truncate group-hover:text-emerald-600 dark:group-hover:text-amber-400 transition-colors">
                              {lnk.label}
                            </span>
                          </div>
                          <ArrowUpRight className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                            isSky ? 'text-zinc-400 group-hover:text-emerald-600' : 'text-zinc-500 group-hover:text-amber-400'
                          }`} />
                        </a>
                      );
                    })}
                  </div>

                  <p className={`text-[10px] mt-3.5 text-center transition-colors duration-1000 ${
                    isSky ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>
                    🚀 Launching redirects to the live, fully-functional responsive applet on <strong>{selectedProject.liveUrl?.includes("codepen") ? "CodePen" : selectedProject.liveUrl?.includes("netlify") ? "Netlify" : "Lovable"}</strong>.
                  </p>
                </div>
              </div>

              {/* Quick Niche Switch Tabs */}
              <div className="mt-auto border-t border-zinc-900 pt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5">
                  Explore Specialized Niches:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                  {['All', 'Cafe', 'Dentist', 'Photography', 'E-Commerce'].map(n => (
                    <button
                      key={n}
                      onClick={() => setActiveNiche(n as any)}
                      className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all duration-300 border ${
                        activeNiche === n 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-lg shadow-amber-500/5' 
                          : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/60 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Floating 3D Device & Interactive Simulation Engine */}
            <div className="w-full lg:w-[58%] flex flex-col">
              
              {/* Interactive Device Viewport */}
              <div className="relative flex-1 flex flex-col">
                
                {/* 3D Visual Sandbox Controls */}
                <div className={`flex flex-wrap items-center justify-between gap-3 p-4 backdrop-blur-md rounded-2xl mb-4 transition-all duration-1000 ${
                  isSky 
                    ? 'bg-white/80 border border-white/90 shadow-md text-zinc-800 shadow-sky-900/5' 
                    : 'bg-zinc-900/60 border border-zinc-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Sliders className={`w-4 h-4 ${isSky ? 'text-emerald-600' : 'text-amber-500'}`} />
                    <span className={`text-xs font-extrabold tracking-wider uppercase transition-colors duration-1000 ${
                      isSky ? 'text-zinc-800' : 'text-zinc-200'
                    }`}>
                      3D Perspective HUD Controller
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Mouse Tracking */}
                    {is3DMode && (
                      <button
                        onClick={() => setIsMouseTracking(!isMouseTracking)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase border transition-all duration-300 ${
                          isMouseTracking 
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                        }`}
                      >
                        {isMouseTracking ? '🎯 Mouse Track Active' : '📍 Enable Mouse Tilt'}
                      </button>
                    )}

                    {/* Toggle 3D Viewport Mode */}
                    <button
                      onClick={() => {
                        setIs3DMode(!is3DMode);
                        if (!is3DMode) {
                          setTiltX(-12);
                          setTiltY(18);
                        } else {
                          setTiltX(0);
                          setTiltY(0);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-300 ${
                        is3DMode 
                          ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400' 
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                    >
                      {is3DMode ? 'Disable 3D Flat View' : 'Enable 3D Pitch'}
                    </button>
                  </div>
                </div>

                {/* Orbit Sliders HUD (Visible only when flat mode is disabled) */}
                {is3DMode && !isMouseTracking && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 py-3 bg-zinc-900/30 border border-zinc-900/40 rounded-xl mb-6">
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                        <span>ROTATE X: {tiltX}°</span>
                        <RotateCcw className="w-2.5 h-2.5 cursor-pointer hover:text-amber-400" onClick={() => setTiltX(-12)} />
                      </div>
                      <input 
                        type="range" min="-45" max="45" value={tiltX} 
                        onChange={(e) => setTiltX(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                        <span>ROTATE Y: {tiltY}°</span>
                        <RotateCcw className="w-2.5 h-2.5 cursor-pointer hover:text-amber-400" onClick={() => setTiltY(18)} />
                      </div>
                      <input 
                        type="range" min="-45" max="45" value={tiltY} 
                        onChange={(e) => setTiltY(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                        <span>DEPTH (PX): {perspective}</span>
                        <RotateCcw className="w-2.5 h-2.5 cursor-pointer hover:text-amber-400" onClick={() => setPerspective(1200)} />
                      </div>
                      <input 
                        type="range" min="600" max="3000" step="100" value={perspective} 
                        onChange={(e) => setPerspective(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                        <span>SCALE: {scale}x</span>
                        <RotateCcw className="w-2.5 h-2.5 cursor-pointer hover:text-amber-400" onClick={() => setScale(1.0)} />
                      </div>
                      <input 
                        type="range" min="0.8" max="1.2" step="0.05" value={scale} 
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full accent-amber-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* THE 3D CONTAINER */}
                <div 
                  className="perspective-2000 flex-1 flex items-center justify-center py-10 px-4 min-h-[460px] relative transition-all duration-300"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  
                  {/* Dynamic Neon Backlighting based on Project Niche */}
                  <div 
                    className={`absolute w-72 h-72 rounded-full blur-[90px] opacity-25 transition-all duration-700 pointer-events-none ${
                      selectedProject.niche === 'Cafe' ? 'bg-amber-500 shadow-[0_0_80px_rgba(245,158,11,0.3)]' :
                      selectedProject.niche === 'Dentist' ? 'bg-teal-400 shadow-[0_0_80px_rgba(20,184,166,0.3)]' :
                      selectedProject.niche === 'Photography' ? 'bg-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.3)]' :
                      'bg-emerald-400 shadow-[0_0_80px_rgba(16,185,129,0.3)]'
                    }`} 
                    style={{
                      transform: `translate3d(${tiltY * 1.5}px, ${-tiltX * 1.5}px, -100px)`
                    }}
                  />

                  {/* Floating Device Frame with 3D Rotate styles */}
                  <div
                    ref={deviceRef}
                    style={{
                      transform: is3DMode 
                        ? `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`
                        : 'none',
                      transition: isMouseTracking ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                    className="w-full max-w-lg rounded-2xl border border-zinc-800/80 bg-zinc-950 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden preserve-3d"
                  >
                    
                    {/* Simulated Browser Bar */}
                    <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      </div>

                      <div className="flex-1 max-w-[280px] mx-auto bg-zinc-950 border border-zinc-800/80 px-3 py-1 rounded-lg flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                        <span className="text-emerald-500">🔒</span>
                        <span className="truncate font-mono">{selectedProject.liveUrl}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                          SSL
                        </span>
                      </div>
                    </div>

                    {/* --- DYNAMIC INTERACTIVE PLAYGROUND CANVAS --- */}
                    <div className="relative h-[340px] bg-zinc-950 p-6 overflow-y-auto">
                      
                      {/* Interactive Reflection Light Mask */}
                      <div 
                        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay bg-gradient-to-tr from-transparent via-white to-transparent"
                        style={{
                          transform: `translate3d(${-tiltY * 5}px, ${tiltX * 5}px, 50px)`
                        }}
                      />

                      {/* SIMULATION FOR GOURMET CAFE */}
                      {selectedProject.id === 'gourmet-cafe' && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="border-b border-zinc-900 pb-3">
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 uppercase font-bold tracking-widest">
                              <Coffee className="w-3 h-3 animate-bounce" /> Gourmet Cafe Simulator
                            </span>
                            <h4 className="text-base font-bold font-serif text-amber-100 mt-1">Aromatica Coffee Sandbox</h4>
                          </div>

                          <div className="grid grid-cols-2 gap-4 my-3 text-xs">
                            <div>
                              <label className="block text-[10px] text-zinc-400 font-bold mb-1">CHOOSE BREW:</label>
                              <select 
                                value={cafeDrink} 
                                onChange={(e: any) => setCafeDrink(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1.5 focus:border-amber-500"
                              >
                                <option value="Espresso">Espresso (Classic)</option>
                                <option value="Cappuccino">Cappuccino (Frothy)</option>
                                <option value="Latte">Latte (Creamy)</option>
                                <option value="Americano">Americano (Intense)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] text-zinc-400 font-bold mb-1">MILK LAYER:</label>
                              <select 
                                value={cafeMilk} 
                                onChange={(e: any) => setCafeMilk(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1.5 focus:border-amber-500"
                              >
                                <option value="None">No Milk (Black)</option>
                                <option value="Oat Milk">Oat Milk (Premium)</option>
                                <option value="Almond">Almond (Nutty)</option>
                                <option value="Whole Milk">Whole Milk (Dairy)</option>
                              </select>
                            </div>

                            <div className="col-span-2">
                              <div className="flex justify-between text-[10px] text-zinc-400 font-bold mb-1">
                                <span>WATER TEMP: {cafeTemp}°C</span>
                                <span>SWEETNESS: {cafeSweetness}%</span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <input 
                                  type="range" min="65" max="95" value={cafeTemp} 
                                  onChange={(e) => setCafeTemp(Number(e.target.value))}
                                  className="w-full accent-amber-500"
                                />
                                <input 
                                  type="range" min="0" max="100" value={cafeSweetness} 
                                  onChange={(e) => setCafeSweetness(Number(e.target.value))}
                                  className="w-full accent-amber-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Interactive Brew Output Visual */}
                          <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center h-20 text-center relative overflow-hidden">
                            {isBrewing ? (
                              <div className="w-full text-center">
                                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest animate-pulse">Brewing Custom Cup...</p>
                                <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-2 overflow-hidden border border-zinc-800">
                                  <div className="bg-amber-500 h-full transition-all duration-100" style={{ width: `${brewProgress}%` }} />
                                </div>
                              </div>
                            ) : brewResult ? (
                              <p className="text-xs font-semibold text-amber-200 leading-snug">{brewResult}</p>
                            ) : (
                              <p className="text-xs text-zinc-400">Configure parameters and click Brew to watch the interactive canvas flow.</p>
                            )}
                          </div>

                          <button
                            onClick={triggerBrewing}
                            disabled={isBrewing}
                            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold text-xs uppercase tracking-wider transition duration-300"
                          >
                            {isBrewing ? '☕ Synthesizing Aromatics...' : '🔥 Brew 3D Sample'}
                          </button>
                        </div>
                      )}

                      {/* SIMULATION FOR CLINICAL DENTIST */}
                      {selectedProject.id === 'smilecare-dentist' && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="border-b border-zinc-900 pb-2">
                            <span className="inline-flex items-center gap-1 text-[10px] text-teal-400 uppercase font-bold tracking-widest">
                              🦷 Clinical Patient Workspace
                            </span>
                            <h4 className="text-base font-bold text-teal-100 mt-0.5 font-serif">SmileCare Interactive Consultation</h4>
                          </div>

                          {/* Simulated Teeth Diagram Grid */}
                          <div className="my-2.5">
                            <p className="text-[9px] text-zinc-400 font-extrabold uppercase mb-2">Select a dental quadrant tooth to diagnose:</p>
                            <div className="flex justify-center gap-3.5 bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800">
                              {[8, 9, 14, 19, 30].map(num => (
                                <button
                                  key={num}
                                  onClick={() => setSelectedTooth(num)}
                                  className={`w-9 h-11 flex flex-col items-center justify-center rounded-lg border text-xs font-extrabold transition-all duration-300 ${
                                    selectedTooth === num 
                                      ? 'bg-teal-500 text-zinc-950 border-teal-400 scale-[1.08] shadow-lg shadow-teal-500/20' 
                                      : 'bg-zinc-950 text-teal-300 border-zinc-800 hover:border-teal-700/60'
                                  }`}
                                >
                                  <span className="text-sm">🦷</span>
                                  <span className="text-[8px] mt-0.5">#{num}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Diagnostic HUD */}
                          {selectedTooth !== null && (
                            <div className="p-2.5 bg-teal-500/5 rounded-xl border border-teal-500/20 text-xs">
                              <p className="text-[10px] text-teal-400 font-bold uppercase">Clinical Advice Tooth #{selectedTooth}:</p>
                              <p className="font-semibold text-zinc-200 mt-0.5">{getToothAdvice(selectedTooth).condition}</p>
                              <p className="text-zinc-400 text-[10px] mt-0.5">Action: {getToothAdvice(selectedTooth).action}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-xs my-1">
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold">TREATMENT:</label>
                              <select 
                                value={dentistService} 
                                onChange={(e: any) => setDentistService(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1 text-[11px] mt-1"
                              >
                                <option value="Checkup">Hygiene Checkup ($90)</option>
                                <option value="Whitening">Enamel Whitening ($240)</option>
                                <option value="Crown">Ceramic Crown ($450)</option>
                                <option value="Braces">Teeth Alignment ($1800)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold">CHOOSE TIME:</label>
                              <select 
                                value={dentistTime} 
                                onChange={(e) => setDentistTime(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1 text-[11px] mt-1"
                              >
                                <option value="09:00 AM">09:00 AM (Available)</option>
                                <option value="10:30 AM">10:30 AM (Available)</option>
                                <option value="01:30 PM">01:30 PM (Quick Slot)</option>
                                <option value="04:00 PM">04:00 PM (Sunset Slot)</option>
                              </select>
                            </div>
                          </div>

                          {dentistConfirmed ? (
                            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Clinical Appointment Scheduled!
                              </p>
                              <p className="text-[10px] text-zinc-400 mt-0.5">Scheduled on {dentistDate} at {dentistTime} for {dentistService}.</p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDentistConfirmed(true)}
                              className="w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition duration-300"
                            >
                              📅 Reserve Diagnostic Slot
                            </button>
                          )}
                        </div>
                      )}

                      {/* SIMULATION FOR EDITORIAL PHOTOGRAPHY */}
                      {selectedProject.id === 'aura-lens' && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="border-b border-zinc-900 pb-2">
                            <span className="inline-flex items-center gap-1 text-[10px] text-cyan-400 uppercase font-bold tracking-widest">
                              <Camera className="w-3 h-3 animate-pulse" /> Camera Filter Sandbox
                            </span>
                            <h4 className="text-base font-bold text-zinc-100 mt-0.5 font-serif">Aura Lens Photography Deck</h4>
                          </div>

                          {/* Image Canvas with Real-time Filter Style */}
                          <div 
                            className={`relative h-32 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 ${photoVignette ? 'shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]' : ''}`}
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setPhotoFocusPoint({
                                x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
                                y: Math.round(((e.clientY - rect.top) / rect.height) * 100)
                              });
                            }}
                          >
                            <img 
                              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600" 
                              alt="Fashion Editorial"
                              className="w-full h-full object-cover transition-all duration-300"
                              style={{ filter: getFilterStyle() }}
                            />
                            {/* Floating Vignette Mask */}
                            {photoVignette && (
                              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black pointer-events-none opacity-85" />
                            )}
                            {/* Focus Indicator Overlay */}
                            <div 
                              className="absolute w-6 h-6 border border-cyan-400 rounded-full pointer-events-none flex items-center justify-center opacity-60 -translate-x-1/2 -translate-y-1/2"
                              style={{ left: `${photoFocusPoint.x}%`, top: `${photoFocusPoint.y}%` }}
                            >
                              <span className="w-1 h-1 bg-cyan-400 rounded-full" />
                            </div>

                            <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-mono tracking-wider text-zinc-300">
                              ISO 100 • 85mm • f/1.4
                            </span>
                          </div>

                          {/* Filter Preset Buttons */}
                          <div className="grid grid-cols-4 gap-1.5 my-2">
                            {[
                              { id: 'original', label: 'Original' },
                              { id: 'noir', label: 'Noir Black' },
                              { id: 'vintage', label: 'Vintage' },
                              { id: 'cyberpunk', label: 'Cyberpunk' }
                            ].map(item => (
                              <button
                                key={item.id}
                                onClick={() => setPhotoFilter(item.id as any)}
                                className={`py-1 rounded text-[9px] font-bold uppercase transition-all duration-300 ${
                                  photoFilter === item.id 
                                    ? 'bg-cyan-500 text-zinc-950' 
                                    : 'bg-zinc-900 text-zinc-400 border border-zinc-850 hover:text-stone-200'
                                }`}
                              >
                                {item.label}
                              </button>
                            ))}
                          </div>

                          {/* Sliders for Manual Overrides */}
                          <div className="grid grid-cols-2 gap-3 text-xs my-1 bg-zinc-900/50 p-2 rounded-lg border border-zinc-850">
                            <div>
                              <span className="text-[9px] text-zinc-400 font-extrabold uppercase">Brightness: {photoBrightness}%</span>
                              <input 
                                type="range" min="60" max="140" value={photoBrightness} 
                                onChange={(e) => setPhotoBrightness(Number(e.target.value))}
                                className="w-full accent-cyan-400 mt-0.5"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] text-zinc-400 font-extrabold uppercase">Contrast: {photoContrast}%</span>
                              <input 
                                type="range" min="60" max="140" value={photoContrast} 
                                onChange={(e) => setPhotoContrast(Number(e.target.value))}
                                className="w-full accent-cyan-400 mt-0.5"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-1">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="checkbox" checked={photoVignette} 
                                onChange={() => setPhotoVignette(!photoVignette)}
                                className="rounded bg-zinc-900 border-zinc-800 text-cyan-500 accent-cyan-500 focus:ring-0"
                              />
                              Vignette Shade Border
                            </label>
                            <span>Focus Coord: {photoFocusPoint.x}, {photoFocusPoint.y}</span>
                          </div>
                        </div>
                      )}

                      {/* SIMULATION FOR ARTISAN ETSY HUB */}
                      {selectedProject.id === 'artisan-treasures' && (
                        <div className="h-full flex flex-col justify-between">
                          <div className="border-b border-zinc-900 pb-2">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 uppercase font-bold tracking-widest">
                              <ShoppingBag className="w-3 h-3 animate-bounce" /> Artisan Customization Desk
                            </span>
                            <h4 className="text-base font-bold text-stone-100 mt-0.5 font-serif">Handmade Etsy Workshop</h4>
                          </div>

                          {/* Product Preview Card */}
                          <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-850 my-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                {etsyMaterial}
                              </span>
                              <span className="text-xs font-bold text-emerald-400">$64.00</span>
                            </div>

                            {/* Simulated custom product rendering */}
                            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-center relative min-h-[50px] flex flex-col items-center justify-center">
                              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Engraved Blueprint Label</p>
                              <div className="text-sm font-extrabold tracking-widest mt-1 uppercase font-mono px-3 py-1 bg-stone-900/80 rounded border border-stone-800 text-stone-100">
                                {etsyEngraving || 'YOUR ENGRAVING'}
                              </div>
                              <span className="absolute bottom-1 right-1 text-[8px] text-zinc-500">
                                Accent: {etsyAccent} Gilding
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold">MATERIAL BASE:</label>
                              <select 
                                value={etsyMaterial} 
                                onChange={(e: any) => setEtsyMaterial(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1 text-[11px] mt-1"
                              >
                                <option value="Walnut wood">American Walnut</option>
                                <option value="Ceramic Clay">Bespoke Matte Clay</option>
                                <option value="Polished Brass">Hardened Polished Brass</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold">GILDING COLOR:</label>
                              <select 
                                value={etsyAccent} 
                                onChange={(e: any) => setEtsyAccent(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg p-1 text-[11px] mt-1"
                              >
                                <option value="Gold">Luxury Gold Leaf</option>
                                <option value="Bronze">Acoustic Bronze Coating</option>
                                <option value="Silver">Polished Silver Lining</option>
                              </select>
                            </div>

                            <div className="col-span-2">
                              <label className="block text-[9px] text-zinc-400 font-bold">CUSTOM TEXT ENGRAVING (LIVE):</label>
                              <input 
                                type="text" 
                                value={etsyEngraving} 
                                onChange={(e) => setEtsyEngraving(e.target.value.toUpperCase())}
                                maxLength={20}
                                placeholder="E.g. COFFEE LOVER"
                                className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-lg px-2.5 py-1.5 mt-1 font-mono text-xs focus:border-emerald-500"
                              />
                            </div>
                          </div>

                          {etsyMessage && (
                            <p className="text-[10px] text-emerald-400 font-bold text-center animate-pulse py-1">
                              {etsyMessage}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={handleEtsyAddToBasket}
                              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition duration-300"
                            >
                              🛒 Add Custom Item to Basket
                            </button>
                            <span className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 font-bold text-xs relative">
                              🧺 {etsyCartCount}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Simulated Bottom Controls */}
                    <div className="px-6 py-4 bg-zinc-900 border-t border-zinc-850 flex items-center justify-between">
                      <p className="text-[10px] text-zinc-500 font-mono">3D Environment Engine • Active</p>
                      <span className="text-[10px] font-bold text-amber-500 animate-pulse flex items-center gap-1">
                        ● Interactivity High
                      </span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Selected Project Full Pitch & Real Analytics Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Challenge & Solution Card */}
                <div className={`p-5 rounded-2xl flex flex-col justify-between transition-all duration-1000 ${
                  isSky ? 'bg-white/80 border border-white/90 shadow-md text-zinc-800 shadow-sky-900/5' : 'glass-panel'
                }`}>
                  <div>
                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-1000 ${
                      isSky ? 'text-emerald-700' : 'text-amber-400'
                    }`}>Challenge & Solution</h4>
                    <p className={`text-xs leading-relaxed mb-3 transition-colors duration-1000 ${
                      isSky ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      <strong className={`block mb-0.5 transition-colors duration-1000 ${
                        isSky ? 'text-zinc-900' : 'text-zinc-200'
                      }`}>The Challenge:</strong>
                      {selectedProject.challenge}
                    </p>
                    <p className={`text-xs leading-relaxed transition-colors duration-1000 ${
                      isSky ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      <strong className={`block mb-0.5 transition-colors duration-1000 ${
                        isSky ? 'text-zinc-900' : 'text-zinc-200'
                      }`}>The Solution:</strong>
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Real Statistics & Performance Benchmarks */}
                <div className={`p-5 rounded-2xl transition-all duration-1000 ${
                  isSky ? 'bg-white/80 border border-white/90 shadow-md text-zinc-800 shadow-sky-900/5' : 'glass-panel'
                }`}>
                  <h4 className={`text-xs font-bold uppercase tracking-widest mb-4 transition-colors duration-1000 ${
                    isSky ? 'text-emerald-700' : 'text-amber-400'
                  }`}>Lighthouse Real Telemetry</h4>
                  
                  <div className="space-y-4">
                    
                    {/* Performance Progress Ring */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-medium transition-colors duration-1000 ${
                          isSky ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>Core Performance Index</span>
                        <span className="text-emerald-500 font-bold font-mono">{selectedProject.analytics.performance}%</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors duration-1000 ${
                        isSky ? 'bg-zinc-200' : 'bg-zinc-900'
                      }`}>
                        <div className="bg-emerald-500 h-full" style={{ width: `${selectedProject.analytics.performance}%` }} />
                      </div>
                    </div>

                    {/* Conversion Lift */}
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`font-medium transition-colors duration-1000 ${
                          isSky ? 'text-zinc-600' : 'text-zinc-400'
                        }`}>Industry Conversion Lift</span>
                        <span className="text-teal-600 font-bold font-mono">+{selectedProject.analytics.conversion}% Boost</span>
                      </div>
                      <div className={`w-full h-1.5 rounded-full overflow-hidden transition-colors duration-1000 ${
                        isSky ? 'bg-zinc-200' : 'bg-zinc-900'
                      }`}>
                        <div className="bg-teal-500 h-full" style={{ width: `${selectedProject.analytics.conversion * 6}%` }} />
                      </div>
                    </div>

                    {/* Recharts Performance & Conversion Trend Chart */}
                    <div className="pt-2 border-t border-zinc-200/20 dark:border-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSky ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                          Dynamic Real-time Audit Trend
                        </span>
                        <div className="flex gap-2 text-[9px] font-bold">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Perf
                          </span>
                          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                            Conv
                          </span>
                        </div>
                      </div>

                      <div className="h-28 w-full mt-1.5">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={chartData}
                            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isSky ? "#10b981" : "#f59e0b"} stopOpacity={0.25}/>
                                <stop offset="95%" stopColor={isSky ? "#10b981" : "#f59e0b"} stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis 
                              dataKey="time" 
                              tick={{ fill: isSky ? '#4b5563' : '#a1a1aa', fontSize: 8, fontWeight: 500 }} 
                              axisLine={false}
                              tickLine={false}
                            />
                            <YAxis 
                              domain={[0, 100]}
                              tick={{ fill: isSky ? '#4b5563' : '#a1a1aa', fontSize: 8 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <RechartsTooltip content={
                              ({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className={`p-2 rounded-xl text-[10px] font-sans border shadow-md backdrop-blur-md transition-all duration-300 ${
                                      isSky 
                                        ? 'bg-white/95 border-emerald-100 text-zinc-800 shadow-emerald-950/10' 
                                        : 'bg-zinc-950/95 border-zinc-800 text-stone-200'
                                    }`}>
                                      <p className="font-extrabold mb-1 opacity-90">{label}</p>
                                      <div className="space-y-0.5 font-bold">
                                        <p className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                          <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                          Perf Index: <span className="font-mono">{payload[0].value}%</span>
                                        </p>
                                        {payload[1] && (
                                          <p className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-teal-500" />
                                            Conv Lift: <span className="font-mono">+{payload[1].value}%</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }
                            } />
                            <Area 
                              type="monotone" 
                              dataKey="performance" 
                              stroke={isSky ? "#059669" : "#f59e0b"} 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorPerf)" 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="conversion" 
                              stroke="#14b8a6" 
                              strokeWidth={1.5}
                              strokeDasharray="3 3"
                              fillOpacity={1} 
                              fill="url(#colorConv)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Total Views Simulated */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-200/20 dark:border-zinc-800/50">
                      <div className={`flex items-center gap-1.5 transition-colors duration-1000 ${
                        isSky ? 'text-zinc-600' : 'text-zinc-400'
                      }`}>
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Interactive Sandbox Audits</span>
                      </div>
                      <span className={`font-bold font-mono transition-colors duration-1000 ${
                        isSky ? 'text-zinc-900' : 'text-zinc-200'
                      }`}>
                        {selectedProject.analytics.views.toLocaleString()} visits
                      </span>
                    </div>

                    {/* Average Rating */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Client Satisfaction Index</span>
                      </div>
                      <span className={`font-bold font-mono transition-colors duration-1000 ${
                        isSky ? 'text-zinc-900' : 'text-zinc-200'
                      }`}>
                        {selectedProject.analytics.rating} / 5.0
                      </span>
                    </div>

                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* --- GRID OF OTHER NICHE PROJECTS --- */}
        <section id="niche-grid-section" className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
                Filtered Niche Showcase Catalog
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select any custom-engineered web application to load into the 3D interactive emulator above.
              </p>
            </div>
            
            {/* Filter Pill Badge Count */}
            <span className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold font-mono">
              Count: {filteredProjects.length} Niche {filteredProjects.length === 1 ? 'App' : 'Apps'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map(project => {
              const isActive = selectedProject.id === project.id;
              return (
                <div 
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className={`group cursor-pointer rounded-2xl p-5 border transition-all duration-500 flex flex-col justify-between ${
                    isActive 
                      ? 'bg-amber-500/5 border-amber-500/45 shadow-[0_10px_30px_rgba(245,158,11,0.06)]' 
                      : 'bg-zinc-900/35 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        project.niche === 'Cafe' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        project.niche === 'Dentist' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' :
                        project.niche === 'Photography' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {project.niche}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{project.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors duration-300 mt-2 font-serif">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-3 mt-1.5 leading-relaxed">
                      {project.subtitle}. {project.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-900/50 flex items-center justify-between text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                    <span className="group-hover:text-amber-400 transition duration-300">
                      {isActive ? 'Active Preview' : 'Interactive Demo'}
                    </span>
                    <ArrowUpRight className={`w-3.5 h-3.5 transition duration-300 ${
                      isActive ? 'text-amber-400 rotate-45' : 'text-zinc-500 group-hover:text-amber-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* --- DYNAMIC CUSTOM INTERACTIVE APPS CONSTRUCTOR ("BUILD ONE NOW") --- */}
        <section id="custom-app-builder-section" className="mb-20 border-t border-zinc-900 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Form Column */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2.5 text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">
                <span className="h-[1px] w-6 bg-amber-500" />
                Build One Now!
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none mb-4 font-serif">
                Tailored Niche App Blueprint Synthesizer
              </h2>
              
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Need a highly premium interactive solution designed directly for your niche? Configure your business name, pick your goals, customize features, and instantly synthesize an optimized code architecture blueprint.
              </p>

              <form onSubmit={synthesizeBlueprint} className="p-6 bg-zinc-900/40 rounded-2xl border border-zinc-900 space-y-5">
                <div>
                  <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2">
                    Business / Project Name:
                  </label>
                  <input 
                    type="text"
                    required
                    value={builderBizName}
                    onChange={(e) => setBuilderBizName(e.target.value)}
                    placeholder="E.g., Bella Vista Retreat or Apex Ortho"
                    className="w-full bg-zinc-950 border border-zinc-800 text-stone-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2">
                      Target Niche Industry:
                    </label>
                    <select
                      value={builderNiche}
                      onChange={(e) => setBuilderNiche(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Cafe">Cafe / Restaurant</option>
                      <option value="Dentist">Dentist / Healthcare</option>
                      <option value="Photography">Creative Photography</option>
                      <option value="E-Commerce">E-Commerce Store</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2">
                      Visual Mood & Theme:
                    </label>
                    <select
                      value={builderTheme}
                      onChange={(e) => setBuilderTheme(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-stone-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Floating Sky">Floating Sky & Clouds (Premium Deal Fixer)</option>
                      <option value="Warm Retro">Warm Retro Amber</option>
                      <option value="Teal Mint">Calming Mint Teal</option>
                      <option value="Cinematic Dark">Cinematic Deep Slate</option>
                      <option value="Premium Gold">Luxury Gold Accents</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2">
                    Primary Conversion Goal:
                  </label>
                  <select
                    value={builderGoal}
                    onChange={(e) => setBuilderGoal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-stone-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Boost Booking Rate">Maximize Booking Bookings Rate</option>
                    <option value="Explode checkout rates">Explode Checkout & Cart conversions</option>
                    <option value="Elevate artistic aesthetics">Elevate Premium Brand Aesthetics</option>
                    <option value="Enhance Mobile Client Speed">Ultra-Fast Mobile Interactive Experience</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-zinc-300 uppercase tracking-wider mb-2">
                    Select Target Modules:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      'Interactive 3D Sandbox',
                      'Bespoke Scheduler Grid',
                      'EXIF Lens Metadata HUD',
                      'Visual CSS Processing Filters',
                      'Bounce Shopping Basket',
                      'Simulated Instant Invoice'
                    ].map(addon => {
                      const selected = builderAddons.includes(addon);
                      return (
                        <button
                          key={addon}
                          type="button"
                          onClick={() => handleAddonToggle(addon)}
                          className={`p-2.5 rounded-xl text-left border font-semibold transition-all duration-300 ${
                            selected 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                              : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-xs">{selected ? '✓' : '+'}</span>
                            {addon}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSynthesizing}
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-zinc-950 font-extrabold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSynthesizing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Synthesizing Core Architecture...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4" />
                      Synthesize Custom Niche Blueprint
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Synthesized Output Column */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-[480px]">
              
              {activeProposal ? (
                <div className={`p-6 rounded-2xl border transition-all duration-1000 animate-float flex-1 flex flex-col justify-between ${
                  isSky 
                    ? 'bg-white/95 border-emerald-300/80 shadow-2xl shadow-emerald-950/10 text-zinc-800' 
                    : 'glass-panel border-amber-500/25 glow-amber'
                }`}>
                  <div>
                    <div className={`flex items-center justify-between border-b pb-4 mb-4 transition-colors duration-1000 ${
                      isSky ? 'border-zinc-200/80' : 'border-zinc-900'
                    }`}>
                      <div>
                        <p className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-1000 ${
                          isSky ? 'text-emerald-700' : 'text-amber-400'
                        }`}>
                          CUSTOM SYNTHESIZED BLUEPRINT
                        </p>
                        <h3 className={`text-2xl font-bold font-serif mt-1 transition-colors duration-1000 ${
                          isSky ? 'text-zinc-900' : 'text-amber-100'
                        }`}>
                          {activeProposal.businessName} Blueprint
                        </h3>
                      </div>
                      <button 
                        onClick={() => deleteProposal(activeProposal.id)}
                        className={`p-1.5 rounded-lg transition-colors duration-1000 ${
                          isSky ? 'bg-zinc-100 text-zinc-500 hover:text-rose-500 hover:bg-rose-50' : 'bg-zinc-900 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800'
                        }`}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                      <div className={`p-3 rounded-xl border transition-all duration-1000 ${
                        isSky ? 'bg-zinc-50/80 border-zinc-200/80' : 'bg-zinc-950/60 border-zinc-900'
                      }`}>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Core Niche</span>
                        <span className={`text-sm font-bold transition-colors duration-1000 ${isSky ? 'text-zinc-900' : 'text-zinc-200'}`}>{activeProposal.niche}</span>
                      </div>
                      <div className={`p-3 rounded-xl border transition-all duration-1000 ${
                        isSky ? 'bg-zinc-50/80 border-zinc-200/80' : 'bg-zinc-950/60 border-zinc-900'
                      }`}>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Visual Palette</span>
                        <span className={`text-sm font-bold transition-colors duration-1000 ${isSky ? 'text-zinc-900' : 'text-zinc-200'}`}>{activeProposal.theme}</span>
                      </div>
                      <div className={`p-3 rounded-xl border transition-all duration-1000 ${
                        isSky ? 'bg-zinc-50/80 border-zinc-200/80' : 'bg-zinc-950/60 border-zinc-900'
                      } col-span-2 sm:col-span-1`}>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase block">Target Goal</span>
                        <span className={`text-sm font-bold transition-colors duration-1000 ${isSky ? 'text-zinc-900' : 'text-zinc-200'}`}>{activeProposal.goal}</span>
                      </div>
                    </div>

                    {/* Performance Benchmarks */}
                    <div className="mb-6">
                      <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 transition-colors duration-1000 ${
                        isSky ? 'text-zinc-700' : 'text-zinc-300'
                      }`}>Projected Telemetry</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`p-3 rounded-xl border transition-all duration-1000 flex items-center justify-between ${
                          isSky ? 'bg-emerald-50/60 border-emerald-200/80' : 'bg-emerald-500/5 border-emerald-500/10'
                        }`}>
                          <span className={`text-xs transition-colors duration-1000 ${isSky ? 'text-zinc-700' : 'text-zinc-400'}`}>Projected Performance Speed</span>
                          <span className="text-base font-extrabold text-emerald-600 font-mono">{activeProposal.performance} / 100</span>
                        </div>
                        <div className={`p-3 rounded-xl border transition-all duration-1000 flex items-center justify-between ${
                          isSky ? 'bg-teal-50/60 border-teal-200/80' : 'bg-teal-500/5 border-teal-500/10'
                        }`}>
                          <span className={`text-xs transition-colors duration-1000 ${isSky ? 'text-zinc-700' : 'text-zinc-400'}`}>Target Conversion Lift</span>
                          <span className="text-base font-extrabold text-teal-600 font-mono">+{activeProposal.conversionBoost}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enabled Modules */}
                    <div className="mb-6">
                      <h4 className={`text-xs font-bold uppercase tracking-widest mb-2.5 transition-colors duration-1000 ${
                        isSky ? 'text-zinc-700' : 'text-zinc-300'
                      }`}>Synthesized Tech Modules</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeProposal.addons.map((add: string) => (
                          <span 
                            key={add} 
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-1000 ${
                              isSky 
                                ? 'bg-emerald-100/80 text-emerald-900 border-emerald-200' 
                                : 'bg-zinc-900 text-amber-400 border-zinc-800'
                            }`}
                          >
                            ✓ {add}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`border-t pt-5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-1000 ${
                    isSky ? 'border-zinc-200/80' : 'border-zinc-900'
                  }`}>
                    <div className="text-center sm:text-left">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase block">Estimated Development Scope</span>
                      <span className={`text-2xl font-extrabold font-mono transition-colors duration-1000 ${
                        isSky ? 'text-emerald-800' : 'text-amber-400'
                      }`}>
                        ${activeProposal.cost.toLocaleString()} <span className={`text-xs font-sans font-medium transition-colors duration-1000 ${isSky ? 'text-zinc-500' : 'text-zinc-400'}`}>USD</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setContactSubject(`Inquiry for: ${activeProposal.businessName} (${activeProposal.niche})`);
                        setContactText(`Hi Shashidhar,\n\nI just simulated a premium ${activeProposal.niche} blueprint titled "${activeProposal.businessName}" with a visual theme of "${activeProposal.theme}" and target modules: ${activeProposal.addons.join(', ')}.\n\nI would love to get a real quote and start building!`);
                        const formSection = document.getElementById('contact-form-section');
                        if (formSection) {
                          formSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 transition-all"
                    >
                      ✉ Send Draft Proposal to Developer
                    </button>
                  </div>

                </div>
              ) : (
                <div className="p-10 rounded-2xl bg-zinc-900/10 border border-zinc-900 border-dashed flex flex-col items-center justify-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-2xl text-amber-400">
                    💡
                  </div>
                  <h3 className="text-lg font-bold text-zinc-300">No Custom Blueprint Synthesized</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
                    Fill out the niche builder on the left to immediately compile a custom optimized visual sandbox proposal card with Lighthouse statistics.
                  </p>
                </div>
              )}

              {/* Saved Blueprint History */}
              {savedProposals.length > 0 && (
                <div className="mt-6 bg-zinc-900/30 p-4 rounded-xl border border-zinc-900/60">
                  <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block mb-2">
                    Your Saved Proposal History:
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {savedProposals.map((prop) => (
                      <button
                        key={prop.id}
                        onClick={() => setActiveProposal(prop)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition duration-300 flex items-center gap-1.5 ${
                          activeProposal?.id === prop.id 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                            : 'bg-zinc-950 text-zinc-400 border-zinc-850 hover:bg-zinc-900'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {prop.businessName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>


        {/* --- SHASHIDHAR CODE VAULT AND SNIPPET EXPLORER --- */}
        <section id="code-vault" className="mb-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
                <Code2 className="w-4 h-4" />
                Engineering Vault
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight font-serif mt-1">
                Core Interactive Source Modules
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Inspect the clean, optimized TypeScript modules used to power premium animations and schedules.
              </p>
            </div>

            {/* Language indicator */}
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-xs text-zinc-400 font-mono">
              Language: TypeScript (React 19)
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden shadow-2xl">
            
            {/* Editor File Selector Bar */}
            <div className="px-4 py-3 bg-zinc-900 border-b border-zinc-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="h-4 w-[1px] bg-zinc-800 mx-2" />
                <span className="text-xs font-semibold font-mono text-amber-400">
                  {selectedProject.codeSnippet?.filename || 'Module.tsx'}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(selectedProject.codeSnippet?.code || '')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-stone-100 text-xs font-bold border border-zinc-850 transition duration-300"
              >
                {codeCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Highlight Editor area */}
            <div className="p-6 overflow-x-auto max-h-[380px] bg-zinc-950 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed selection:bg-amber-500/20">
              <pre className="whitespace-pre">{selectedProject.codeSnippet?.code || '// Select a project to preview its code snippet'}</pre>
            </div>

            {/* Editor Status Bar */}
            <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-850 text-[10px] text-zinc-500 flex items-center justify-between font-mono">
              <span>Lines: {(selectedProject.codeSnippet?.code.split('\n').length || 0)} • Tab: UTF-8</span>
              <span>100% Production Grade Architecture</span>
            </div>

          </div>
        </section>


        {/* --- PERSISTENT CONTACT & HIRES INBOX HUB --- */}
        <section id="contact-form-section" className="mb-20 pt-10 border-t border-zinc-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Form Column */}
            <div className="lg:col-span-6">
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-2">
                Hiring Engagement Office
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight font-serif mb-4 text-stone-100">
                Kickstart a Custom Niche Integration
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Ready to elevate your business with breathtaking 3D transitions and responsive layouts? Send your specifications, budget constraints, or a pre-compiled draft blueprint proposal directly to Shashidhar.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Your Full Name:</label>
                    <input 
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="E.g. Michael Chen"
                      className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Email Address:</label>
                    <input 
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="E.g. michael@nicheapp.com"
                      className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Subject Heading:</label>
                  <input 
                    type="text"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="E.g. Custom Healthcare booking dashboard setup"
                    className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">Project Brief / Inquiry Details:</label>
                  <textarea
                    required
                    rows={4}
                    value={contactText}
                    onChange={(e) => setContactText(e.target.value)}
                    placeholder="Describe your target niche features, scope constraints, and timelines..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-stone-100 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-amber-500 transition duration-300 resize-none"
                  />
                </div>

                {contactSubmitted ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Message Submitted Successfully!
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Your inquiry has been logged in the local persistent Lead Inbox on the right.</p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs uppercase tracking-wider transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Engagement Request
                  </button>
                )}
              </form>
            </div>

            {/* Persistent lead inbox column */}
            <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[420px]">
              <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-900 flex-1 flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Inbox className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
                      <div>
                        <h4 className="text-base font-bold font-serif text-amber-100">Lead Engagement Inbox</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Mock dashboard persisting actual inquiries locally</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-zinc-950 text-[10px] font-bold text-teal-400 font-mono">
                      Stored: {inboxMessages.length} Messages
                    </span>
                  </div>

                  {inboxMessages.length > 0 ? (
                    <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                      {inboxMessages.map(msg => (
                        <div key={msg.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-850">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold text-zinc-200">{msg.name}</span>
                            <span className="text-[9px] text-zinc-500 font-mono">{msg.date}</span>
                          </div>
                          
                          <p className="text-[10px] font-bold text-amber-400 font-mono mb-1 truncate">{msg.subject}</p>
                          <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          
                          <div className="flex items-center justify-between gap-2 mt-3.5 pt-2 border-t border-zinc-900/60 text-[10px] text-zinc-500">
                            <span>Email: <strong className="text-zinc-400 font-mono">{msg.email}</strong></span>
                            <button 
                              onClick={() => clearMessage(msg.id)}
                              className="text-rose-400/80 hover:text-rose-400 font-bold transition uppercase"
                            >
                              Archive
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-3xl text-zinc-600 mb-2">✉</div>
                      <p className="text-xs font-bold text-zinc-400">Lead Inbox is empty</p>
                      <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto">
                        Inquiries submitted via the form on the left are captured in real time and persisted in local storage.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-zinc-900/60 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Based out of Remote Global</span>
                  </div>
                  <span>Response time: &lt; 24 hrs</span>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* --- FOOTER SOCIALS --- */}
        <footer className="border-t border-zinc-900 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 Shashidhar. Engineered with pure 3D Perspective & Niche Dedication.</p>
          <div className="flex items-center gap-5 font-bold uppercase tracking-wider text-zinc-400">
            {profile.socials.whatsapp && (
              <>
                <a href={`https://wa.me/91${profile.socials.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition text-emerald-500/90">WhatsApp</a>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
              </>
            )}
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">GitHub</a>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400 transition">LinkedIn</a>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <a href={`mailto:${profile.socials.email}`} className="hover:text-amber-400 transition">Email</a>
          </div>
        </footer>

      </div>
    </div>
  );
}
