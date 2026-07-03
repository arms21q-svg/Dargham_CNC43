import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { getBlogPostBySlug, blogPosts } from "@/data";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const loc = locale as "ar" | "en";
  const Arrow = locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <article className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold mb-8 transition-colors">
          <Arrow className="w-4 h-4" />
          {t("title")}
        </Link>

        <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
          <Image src={post.image} alt={post.title[loc]} fill className="object-cover" priority sizes="100vw" />
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author[loc]}
          </span>
          <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
            {post.category[loc]}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title[loc]}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <p>{post.content[loc]}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>
      </div>
    </article>
  );
}
