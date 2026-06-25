export type Niche = 'Cafe' | 'Dentist' | 'Photography' | 'E-Commerce';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  niche: Niche;
  subtitle: string;
  description: string;
  fullDetails: string;
  challenge: string;
  solution: string;
  technologies: string[];
  features: string[];
  rating: number;
  analytics: {
    views: number;
    conversion: number;
    performance: number; // 0-100 speed index
    rating: number;
  };
  githubUrl?: string;
  liveUrl?: string; // primary link
  additionalLinks?: ProjectLink[]; // for showcasing multiple variations/codepens
  codeSnippet?: {
    filename: string;
    language: string;
    code: string;
  };
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  skills: {
    category: 'Frontend' | 'Backend' | 'Design & UX' | 'Tools & DevOps';
    items: { name: string; level: number }[];
  }[];
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    email: string;
    whatsapp?: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}
