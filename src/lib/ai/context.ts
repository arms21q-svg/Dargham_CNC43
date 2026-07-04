import type { Project } from "@/types";
import { services, faqs } from "@/data";
import { CATEGORY_LABELS } from "@/lib/categories";

export function buildPortfolioContext(projects: Project[]) {
  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleAr: p.title.ar,
    titleEn: p.title.en,
    category: p.category,
    categoryAr: CATEGORY_LABELS[p.category]?.ar || p.category,
    descriptionAr: p.description.ar.slice(0, 200),
    descriptionEn: p.description.en.slice(0, 200),
    woodTypeAr: p.woodType.ar,
    woodTypeEn: p.woodType.en,
  }));
}

export function buildSearchIndex(projects: Project[]) {
  const projectItems = projects.map((p) => ({
    type: "project" as const,
    id: p.id,
    slug: p.slug,
    titleAr: p.title.ar,
    titleEn: p.title.en,
    text: `${p.title.ar} ${p.title.en} ${p.description.ar} ${p.description.en} ${p.category} ${p.woodType.ar} ${p.woodType.en}`,
  }));

  const serviceItems = services.map((s) => ({
    type: "service" as const,
    id: s.id,
    slug: s.slug,
    titleAr: s.title.ar,
    titleEn: s.title.en,
    text: `${s.title.ar} ${s.title.en} ${s.description.ar} ${s.description.en}`,
  }));

  const pageItems = [
    { type: "page" as const, id: "portfolio", slug: "portfolio", titleAr: "أعمالنا", titleEn: "Portfolio", text: "معرض المشاريع أعمال CNC" },
    { type: "page" as const, id: "services", slug: "services", titleAr: "الخدمات", titleEn: "Services", text: "قص حفر مطابخ أبواب" },
    { type: "page" as const, id: "contact", slug: "contact", titleAr: "اتصل بنا", titleEn: "Contact", text: "تواصل هاتف واتساب" },
    { type: "page" as const, id: "about", slug: "about", titleAr: "من نحن", titleEn: "About", text: "ورشة ضرغام CNC" },
  ];

  const faqItems = faqs.map((f) => ({
    type: "page" as const,
    id: `faq-${f.id}`,
    slug: "faq",
    titleAr: f.question.ar,
    titleEn: f.question.en,
    text: `${f.question.ar} ${f.answer.ar} ${f.question.en} ${f.answer.en}`,
  }));

  return [...projectItems, ...serviceItems, ...pageItems, ...faqItems];
}

export const CNC_SYSTEM_PROMPT = `You are a helpful assistant for Dirgham CNC Woodworks (ضرغام لأعمال CNC الخشب), a professional CNC woodworking company in Baghdad, Iraq.
You answer questions about: CNC cutting/engraving, wood types (oak, walnut, beech, MDF, plywood, melamine), doors, kitchens, bedrooms, furniture, panels, decorations.
Be concise, professional, and practical. If unsure, suggest contacting the workshop.
Never invent prices — direct price questions to the estimate tool or contact.
Respond in the user's language (Arabic or English).`;
