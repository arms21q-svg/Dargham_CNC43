"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, MessageCircle, Search, Lightbulb, ImageIcon,
  Calculator, Palette, Send, Loader2, Upload,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PROJECT_CATEGORIES } from "@/lib/constants";
import { CATEGORY_LABELS } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { useAiApi } from "./useAiApi";

type Tab = "chat" | "search" | "ideas" | "similar" | "estimate" | "colors";

const TABS: { id: Tab; icon: typeof Sparkles }[] = [
  { id: "chat", icon: MessageCircle },
  { id: "search", icon: Search },
  { id: "ideas", icon: Lightbulb },
  { id: "similar", icon: ImageIcon },
  { id: "estimate", icon: Calculator },
  { id: "colors", icon: Palette },
];

const MATERIALS = ["mdf", "plywood", "melamine", "beech", "oak", "walnut"] as const;

export function AiHub() {
  const t = useTranslations("ai");
  const locale = useLocale() as "ar" | "en";
  const isRtl = locale === "ar";
  const { call, loading, error, clearError } = useAiApi();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");

  // Chat
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: t("chat.welcome") },
  ]);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { type: string; id: string; slug?: string; title: string; snippet: string }[]
  >([]);

  // Ideas
  const [ideaStyle, setIdeaStyle] = useState("");
  const [ideaCategory, setIdeaCategory] = useState("");
  const [ideas, setIdeas] = useState<{ title: string; description: string; materials: string[] }[]>([]);

  // Similar
  const fileRef = useRef<HTMLInputElement>(null);
  const [similarDesc, setSimilarDesc] = useState("");
  const [similarProjects, setSimilarProjects] = useState<
    { id: string; slug: string; title: string; image: string }[]
  >([]);

  // Estimate
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(200);
  const [depth, setDepth] = useState(3);
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]>("mdf");
  const [estCategory, setEstCategory] = useState<string>("doors");
  const [complexity, setComplexity] = useState<"simple" | "medium" | "complex">("medium");
  const [estimate, setEstimate] = useState<{
    min: number;
    max: number;
    breakdown: { materialCost: number; laborCost: number; cncCost: number };
    note: { ar: string; en: string };
    tips?: string;
  } | null>(null);

  // Colors
  const [roomType, setRoomType] = useState("");
  const [mood, setMood] = useState("");
  const [colorResult, setColorResult] = useState<{
    palette: { name: string; hex: string; usage: string }[];
    materials: { name: string; reason: string }[];
    tips: string;
  } | null>(null);

  const hrefFor = (type: string, slug?: string) => {
    if (type === "project" && slug) return `/projects/${slug}`;
    if (type === "service" && slug) return "/services";
    if (slug) return `/${slug}`;
    return "/";
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    const data = await call<{ reply: string }>("chat", {
      message: msg,
      history: messages.slice(-4),
    });
    if (data?.reply) {
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    }
  };

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    const data = await call<{ results: typeof searchResults }>("search", { query: searchQuery });
    if (data) setSearchResults(data.results);
  };

  const runIdeas = async () => {
    const data = await call<{ ideas: typeof ideas }>("ideas", {
      style: ideaStyle || undefined,
      category: ideaCategory || undefined,
    });
    if (data) setIdeas(data.ideas);
  };

  const runSimilar = async (file: File) => {
    if (file.size > 4 * 1024 * 1024) return;
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const base64 = dataUrl.split(",")[1];
    if (!base64) return;
    const data = await call<{
      description: string;
      projects: typeof similarProjects;
    }>("similar", { imageBase64: base64, mimeType: file.type as "image/jpeg" });
    if (data) {
      setSimilarDesc(data.description);
      setSimilarProjects(data.projects);
    }
  };

  const runEstimate = async () => {
    const data = await call<{
      estimate: {
        min: number;
        max: number;
        breakdown: { materialCost: number; laborCost: number; cncCost: number };
        note: { ar: string; en: string };
      };
      tips?: string;
    }>("estimate", {
      widthCm: width,
      heightCm: height,
      depthCm: depth,
      material,
      category: estCategory,
      complexity,
      includeTips: false,
    });
    if (data?.estimate) {
      setEstimate({ ...data.estimate, tips: data.tips });
    }
  };

  const runColors = async () => {
    const data = await call<NonNullable<typeof colorResult>>("colors", {
      roomType: roomType || undefined,
      mood: mood || undefined,
      category: estCategory || undefined,
    });
    if (data) setColorResult(data);
  };

  const inputClass =
    "w-full px-3 py-2 rounded-xl glass border border-white/15 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/40";

  return (
    <>
      <div
        className={cn(
          "fixed bottom-6 z-50 flex flex-col gap-3",
          isRtl ? "right-5" : "left-5"
        )}
      >
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setOpen(true); clearError(); }}
          className="w-14 h-14 rounded-2xl gradient-navy text-gold flex items-center justify-center shadow-xl border border-gold/30"
          title={t("button")}
          aria-label={t("button")}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg max-h-[90vh] flex flex-col glass-strong border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div>
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    {t("title")}
                  </h2>
                  <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
                </div>
                <button type="button" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10" aria-label={t("close")}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-1 px-2 py-2 overflow-x-auto border-b border-white/10 scrollbar-hide">
                {TABS.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setTab(id); clearError(); }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0",
                      tab === id ? "bg-gold/20 text-gold" : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t(`tabs.${id}`)}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px]">
                {error && (
                  <p className="text-sm text-amber-200 bg-amber-900/30 border border-amber-700/30 rounded-lg p-3">{error}</p>
                )}

                {tab === "chat" && (
                  <>
                    <div className="space-y-3 max-h-52 overflow-y-auto">
                      {messages.map((m, i) => (
                        <div key={i} className={cn("text-sm rounded-xl px-3 py-2 max-w-[90%]", m.role === "user" ? "ms-auto bg-gold/20 text-foreground" : "bg-white/5 text-muted-foreground")}>
                          {m.content}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className={inputClass} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder={t("chat.placeholder")} onKeyDown={(e) => e.key === "Enter" && sendChat()} />
                      <button type="button" onClick={sendChat} disabled={loading} className="p-2 rounded-xl bg-gold text-navy-900 shrink-0 disabled:opacity-50">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      </button>
                    </div>
                  </>
                )}

                {tab === "search" && (
                  <>
                    <div className="flex gap-2">
                      <input className={inputClass} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("search.placeholder")} onKeyDown={(e) => e.key === "Enter" && runSearch()} />
                      <button type="button" onClick={runSearch} disabled={loading} className="px-3 rounded-xl bg-gold text-navy-900 text-sm font-medium shrink-0 disabled:opacity-50">{t("search.search")}</button>
                    </div>
                    {searchResults.length === 0 && !loading && <p className="text-sm text-muted-foreground text-center py-4">{t("search.noResults")}</p>}
                    {searchResults.map((r) => (
                      <Link key={r.id} href={hrefFor(r.type, r.slug)} className="block p-3 rounded-xl glass-card hover:border-gold/30 transition-colors" onClick={() => setOpen(false)}>
                        <p className="font-medium text-foreground text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{r.snippet}</p>
                      </Link>
                    ))}
                  </>
                )}

                {tab === "ideas" && (
                  <>
                    <input className={inputClass} value={ideaStyle} onChange={(e) => setIdeaStyle(e.target.value)} placeholder={t("ideas.style")} />
                    <select className={inputClass} value={ideaCategory} onChange={(e) => setIdeaCategory(e.target.value)}>
                      <option value="">{t("ideas.category")}</option>
                      {PROJECT_CATEGORIES.map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c][locale]}</option>
                      ))}
                    </select>
                    <button type="button" onClick={runIdeas} disabled={loading} className="w-full py-2.5 rounded-xl bg-gold text-navy-900 font-medium text-sm disabled:opacity-50">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("ideas.generate")}
                    </button>
                    {ideas.map((idea, i) => (
                      <div key={i} className="p-3 rounded-xl glass-card text-sm">
                        <p className="font-bold text-gold mb-1">{idea.title}</p>
                        <p className="text-muted-foreground mb-2">{idea.description}</p>
                        <p className="text-xs text-foreground/70">{idea.materials.join(" · ")}</p>
                      </div>
                    ))}
                  </>
                )}

                {tab === "similar" && (
                  <>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && runSimilar(e.target.files[0])} />
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={loading} className="w-full py-8 rounded-xl border-2 border-dashed border-gold/30 flex flex-col items-center gap-2 text-muted-foreground hover:border-gold/50 transition-colors disabled:opacity-50">
                      {loading ? <Loader2 className="w-8 h-8 animate-spin text-gold" /> : <Upload className="w-8 h-8 text-gold" />}
                      <span className="text-sm">{loading ? t("similar.analyzing") : t("similar.upload")}</span>
                    </button>
                    {similarDesc && <p className="text-sm text-muted-foreground">{similarDesc}</p>}
                    <div className="grid grid-cols-2 gap-2">
                      {similarProjects.map((p) => (
                        <Link key={p.id} href={`/projects/${p.slug}`} className="p-2 rounded-xl glass-card text-sm hover:border-gold/30" onClick={() => setOpen(false)}>
                          <p className="font-medium text-foreground line-clamp-2">{p.title}</p>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {tab === "estimate" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="text-xs text-muted-foreground">{t("estimate.width")}</label><input type="number" className={inputClass} value={width} onChange={(e) => setWidth(Number(e.target.value))} /></div>
                      <div><label className="text-xs text-muted-foreground">{t("estimate.height")}</label><input type="number" className={inputClass} value={height} onChange={(e) => setHeight(Number(e.target.value))} /></div>
                    </div>
                    <div><label className="text-xs text-muted-foreground">{t("estimate.depth")}</label><input type="number" className={inputClass} value={depth} onChange={(e) => setDepth(Number(e.target.value))} /></div>
                    <select className={inputClass} value={material} onChange={(e) => setMaterial(e.target.value as (typeof MATERIALS)[number])}>
                      {MATERIALS.map((m) => <option key={m} value={m}>{m.toUpperCase()}</option>)}
                    </select>
                    <select className={inputClass} value={estCategory} onChange={(e) => setEstCategory(e.target.value)}>
                      {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c][locale]}</option>)}
                    </select>
                    <select className={inputClass} value={complexity} onChange={(e) => setComplexity(e.target.value as typeof complexity)}>
                      <option value="simple">{t("estimate.simple")}</option>
                      <option value="medium">{t("estimate.medium")}</option>
                      <option value="complex">{t("estimate.complex")}</option>
                    </select>
                    <button type="button" onClick={runEstimate} disabled={loading} className="w-full py-2.5 rounded-xl bg-gold text-navy-900 font-medium text-sm disabled:opacity-50">{t("estimate.calculate")}</button>
                    {estimate && (
                      <div className="p-3 rounded-xl glass-card text-sm space-y-2">
                        <p className="font-bold text-gold">{t("estimate.range")}: {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()} IQD</p>
                        <p className="text-xs text-muted-foreground">{locale === "ar" ? estimate.note.ar : estimate.note.en}</p>
                        {estimate.tips && <p className="text-xs"><span className="text-gold">{t("estimate.tips")}: </span>{estimate.tips}</p>}
                      </div>
                    )}
                  </>
                )}

                {tab === "colors" && (
                  <>
                    <input className={inputClass} value={roomType} onChange={(e) => setRoomType(e.target.value)} placeholder={t("colors.room")} />
                    <input className={inputClass} value={mood} onChange={(e) => setMood(e.target.value)} placeholder={t("colors.mood")} />
                    <button type="button" onClick={runColors} disabled={loading} className="w-full py-2.5 rounded-xl bg-gold text-navy-900 font-medium text-sm disabled:opacity-50">{t("colors.suggest")}</button>
                    {colorResult && (
                      <div className="space-y-3 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {colorResult.palette.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 rounded-lg glass-card">
                              <span className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                              <span className="text-xs">{c.name}</span>
                            </div>
                          ))}
                        </div>
                        {colorResult.materials.map((m, i) => (
                          <p key={i} className="text-muted-foreground"><span className="text-gold">{m.name}:</span> {m.reason}</p>
                        ))}
                        <p className="text-xs text-muted-foreground">{colorResult.tips}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
