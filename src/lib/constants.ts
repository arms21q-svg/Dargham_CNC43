export const SITE_CONFIG = {
  name: { ar: "ضرغام", en: "Dirgham" },
  fullName: { ar: "ضرغام لأعمال CNC الخشب", en: "Dirgham CNC Woodworks" },
  phone: "+9647712336614",
  phoneDisplay: "07712336614",
  whatsapp: "+9647712336614",
  whatsappDisplay: "07712336614",
  email: "info@dirgham-cnc.com",
  mapUrl: "https://share.google/2ZzKhGvJDLz1JYIyE",
  address: {
    ar: "بغداد، العراق",
    en: "Baghdad, Iraq",
  },
  social: {
    instagram: "https://instagram.com/dirgham_cnc",
    twitter: "https://twitter.com/dirgham_cnc",
    facebook: "https://facebook.com/dirgham_cnc",
  },
  stats: {
    projects: 350,
    clients: 280,
    years: 10,
    satisfaction: 98,
  },
} as const;

export const PROJECT_CATEGORIES = [
  "decorations",
  "doors",
  "kitchens",
  "bedrooms",
  "furniture",
  "panels",
  "special",
] as const;
