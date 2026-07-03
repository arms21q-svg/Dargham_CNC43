export type Locale = "ar" | "en";

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface Service {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  icon: string;
  image: string;
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  category: ProjectCategory;
  images: string[];
  woodType: LocalizedString;
  cncMachine: LocalizedString;
  duration: LocalizedString;
  client: LocalizedString;
  year: number;
  beforeAfter?: { before: string; after: string }[];
  featured?: boolean;
}

export type ProjectCategory =
  | "decorations"
  | "doors"
  | "kitchens"
  | "bedrooms"
  | "furniture"
  | "panels"
  | "special";

export interface BlogPost {
  id: string;
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  content: LocalizedString;
  image: string;
  category: LocalizedString;
  date: string;
  author: LocalizedString;
}

export interface Testimonial {
  id: string;
  name: LocalizedString;
  role: LocalizedString;
  content: LocalizedString;
  rating: number;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface SiteSettings {
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  mapUrl: string;
  address: LocalizedString;
  social: {
    instagram: string;
    twitter: string;
    facebook: string;
  };
  stats: {
    projects: number;
    clients: number;
    years: number;
    satisfaction: number;
  };
  sliderProjectIds: string[];
}
