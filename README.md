# ضرغام – Dirgham CNC Woodworks

موقع إلكتروني احترافي لأعمال CNC الخشب مبني بأحدث تقنيات الويب.

## التقنيات

- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **Tailwind CSS 4**
- **Framer Motion** – أنيميشن
- **Three.js + React Three Fiber** – عرض ثلاثي الأبعاد
- **next-intl** – دعم العربية (RTL) والإنجليزية (LTR)
- **next-themes** – الوضع الليلي/النهاري

## البدء

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

## الصفحات

| الصفحة | المسار |
|--------|--------|
| الرئيسية | `/ar` أو `/en` |
| الأعمال | `/ar/portfolio` |
| تفاصيل المشروع | `/ar/projects/[slug]` |
| الخدمات | `/ar/services` |
| من نحن | `/ar/about` |
| المدونة | `/ar/blog` |
| الأسئلة الشائعة | `/ar/faq` |
| اتصل بنا | `/ar/contact` |
| لوحة الإدارة | `/admin` |

## الميزات

- دعم كامل للعربية والإنجليزية مع تبديل فوري
- الوضع الليلي والنهاري
- عرض ثلاثي الأبعاد في الصفحة الرئيسية
- SEO كامل (sitemap, robots, metadata)
- أمان (CSP headers, validation, rate limiting)
- تصميم متجاوب لجميع الأجهزة

## هيكل المشروع

```
src/
├── app/
│   ├── [locale]/     # صفحات الموقع
│   ├── admin/        # لوحة الإدارة
│   └── api/          # API routes
├── components/
│   ├── home/         # أقسام الصفحة الرئيسية
│   ├── layout/       # Header, Footer
│   ├── three/        # مكونات 3D
│   └── ui/           # مكونات UI
├── data/             # البيانات
├── i18n/             # إعدادات الترجمة
├── lib/              # أدوات مساعدة
└── types/            # TypeScript types
messages/
├── ar.json
└── en.json
```

## التطوير المستقبلي

- ربط قاعدة بيانات (Prisma + PostgreSQL)
- نظام مصادقة للوحة الإدارة
- رفع الصور
- إرسال البريد الإلكتروني
- CMS كامل
