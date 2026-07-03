import type { Service, BlogPost, Testimonial, FAQ } from "@/types";

export const services: Service[] = [
  {
    id: "1",
    slug: "cnc-cutting",
    title: { ar: "قص CNC", en: "CNC Cutting" },
    description: {
      ar: "قص دقيق للخشب باستخدام أحدث ماكينات CNC لتحقيق أشكال معقدة بدقة عالية.",
      en: "Precise wood cutting using the latest CNC machines for complex shapes with high accuracy.",
    },
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
  },
  {
    id: "2",
    slug: "cnc-engraving",
    title: { ar: "حفر CNC", en: "CNC Engraving" },
    description: {
      ar: "حفر وزخرفة الخشب بتفاصيل دقيقة ونقوش فنية مميزة.",
      en: "Wood engraving and decoration with fine details and distinctive artistic patterns.",
    },
    icon: "PenTool",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  },
  {
    id: "3",
    slug: "wood-decor",
    title: { ar: "الديكورات الخشبية", en: "Wood Decorations" },
    description: {
      ar: "ديكورات خشبية فاخرة تضيف لمسة جمالية لأي مساحة.",
      en: "Luxury wood decorations that add an aesthetic touch to any space.",
    },
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: "4",
    slug: "kitchens",
    title: { ar: "المطابخ", en: "Kitchens" },
    description: {
      ar: "مطابخ خشبية عصرية مصممة حسب الطلب بأعلى جودة.",
      en: "Modern custom-designed wooden kitchens of the highest quality.",
    },
    icon: "ChefHat",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    id: "5",
    slug: "doors",
    title: { ar: "الأبواب", en: "Doors" },
    description: {
      ar: "أبواب خشبية فاخرة بنقوش CNC دقيقة وتشطيبات راقية.",
      en: "Luxury wooden doors with precise CNC engravings and elegant finishes.",
    },
    icon: "DoorOpen",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: "6",
    slug: "bedrooms",
    title: { ar: "غرف النوم", en: "Bedrooms" },
    description: {
      ar: "غرف نوم متكاملة بتصاميم عصرية وخامات فاخرة.",
      en: "Complete bedrooms with modern designs and premium materials.",
    },
    icon: "Bed",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
  },
  {
    id: "7",
    slug: "furniture",
    title: { ar: "الأثاث", en: "Furniture" },
    description: {
      ar: "أثاث خشبي مخصص يجمع بين الجمال والوظيفة.",
      en: "Custom wooden furniture combining beauty and functionality.",
    },
    icon: "Armchair",
    image: "https://images.unsplash.com/photo-1555041469-a586c36ea9bc?w=800&q=80",
  },
  {
    id: "8",
    slug: "wood-panels",
    title: { ar: "اللوحات الخشبية", en: "Wood Panels" },
    description: {
      ar: "لوحات خشبية فنية للجدران والديكور الداخلي.",
      en: "Artistic wood panels for walls and interior decoration.",
    },
    icon: "LayoutGrid",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
  {
    id: "9",
    slug: "custom-design",
    title: { ar: "التصميم حسب الطلب", en: "Custom Design" },
    description: {
      ar: "تصميم وتنفيذ أي فكرة خشبية حسب رغبتك.",
      en: "Design and execute any wooden idea according to your wishes.",
    },
    icon: "PencilRuler",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "types-of-wood",
    title: { ar: "أنواع الخشب واستخداماتها", en: "Types of Wood and Their Uses" },
    excerpt: {
      ar: "دليل شامل لأنواع الخشب المختلفة وخصائص كل نوع.",
      en: "A comprehensive guide to different types of wood and their properties.",
    },
    content: {
      ar: "الخشب من أقدم المواد المستخدمة في البناء والأثاث...",
      en: "Wood is one of the oldest materials used in construction and furniture...",
    },
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
    category: { ar: "أنواع الخشب", en: "Wood Types" },
    date: "2025-06-15",
    author: { ar: "فريق ضرغام", en: "Dirgham Team" },
  },
  {
    id: "2",
    slug: "cnc-technology",
    title: { ar: "تقنية CNC في صناعة الخشب", en: "CNC Technology in Woodworking" },
    excerpt: {
      ar: "كيف غيرت تقنية CNC عالم صناعة الأثاث والديكور الخشبي.",
      en: "How CNC technology transformed the world of furniture and wood decoration.",
    },
    content: {
      ar: "تقنية CNC أحدثت ثورة في صناعة الخشب...",
      en: "CNC technology has revolutionized the wood industry...",
    },
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
    category: { ar: "CNC", en: "CNC" },
    date: "2025-05-20",
    author: { ar: "فريق ضرغام", en: "Dirgham Team" },
  },
  {
    id: "3",
    slug: "wood-maintenance",
    title: { ar: "نصائح صيانة الأثاث الخشبي", en: "Wood Furniture Maintenance Tips" },
    excerpt: {
      ar: "نصائح عملية للحفاظ على أثاثك الخشبي لسنوات طويلة.",
      en: "Practical tips to preserve your wooden furniture for years.",
    },
    content: {
      ar: "صيانة الأثاث الخشبي تتطلب عناية منتظمة...",
      en: "Wood furniture maintenance requires regular care...",
    },
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    category: { ar: "نصائح الصيانة", en: "Maintenance Tips" },
    date: "2025-04-10",
    author: { ar: "فريق ضرغام", en: "Dirgham Team" },
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: { ar: "أحمد المحمد", en: "Ahmed Al-Mohammed" },
    role: { ar: "صاحب فيلا", en: "Villa Owner" },
    content: {
      ar: "عمل استثنائي! الأبواب الخشبية التي صنعوها لفيلتي تفوق كل التوقعات. دقة عالية وجودة لا مثيل لها.",
      en: "Exceptional work! The wooden doors they made for my villa exceeded all expectations. High precision and unmatched quality.",
    },
    rating: 5,
  },
  {
    id: "2",
    name: { ar: "سارة العتيبي", en: "Sara Al-Otaibi" },
    role: { ar: "مصممة داخلية", en: "Interior Designer" },
    content: {
      ar: "أتعامل مع ضرغام باستمرار لمشاريعي. احترافية عالية والتزام بالمواعيد. أنصح بهم بشدة.",
      en: "I work with Dirgham regularly for my projects. Highly professional and punctual. I highly recommend them.",
    },
    rating: 5,
  },
  {
    id: "3",
    name: { ar: "خالد الشمري", en: "Khalid Al-Shammari" },
    role: { ar: "مقاول", en: "Contractor" },
    content: {
      ar: "مطبخ أحلامي أصبح حقيقة بفضل فريق ضرغام. تصميم رائع وتنفيذ مثالي.",
      en: "My dream kitchen became a reality thanks to the Dirgham team. Great design and perfect execution.",
    },
    rating: 5,
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: {
      ar: "ما هي أنواع الخشب التي تعملون بها؟",
      en: "What types of wood do you work with?",
    },
    answer: {
      ar: "نعمل مع مجموعة واسعة من أنواع الخشب بما في ذلك البلوط، الجوز، الماهوجني، الزان، الصنوبر، والتيك. نساعدك في اختيار النوع المناسب لمشروعك.",
      en: "We work with a wide range of wood types including oak, walnut, mahogany, beech, pine, and teak. We help you choose the right type for your project.",
    },
  },
  {
    id: "2",
    question: {
      ar: "كم تستغرق مدة تنفيذ المشروع؟",
      en: "How long does a project take?",
    },
    answer: {
      ar: "تختلف المدة حسب حجم وتعقيد المشروع. المشاريع البسيطة قد تستغرق أسبوعاً واحداً، بينما المشاريع الكبيرة قد تستغرق عدة أسابيع. نقدم جدولاً زمنياً واضحاً عند بدء المشروع.",
      en: "Duration varies based on project size and complexity. Simple projects may take one week, while large projects may take several weeks. We provide a clear timeline when starting the project.",
    },
  },
  {
    id: "3",
    question: {
      ar: "هل تقدمون خدمة التصميم؟",
      en: "Do you offer design services?",
    },
    answer: {
      ar: "نعم، لدينا فريق تصميم محترف يساعدك في تحويل أفكارك إلى تصاميم قابلة للتنفيذ باستخدام برامج ثلاثية الأبعاد.",
      en: "Yes, we have a professional design team that helps you turn your ideas into executable designs using 3D software.",
    },
  },
  {
    id: "4",
    question: {
      ar: "ما هي مناطق الخدمة؟",
      en: "What are your service areas?",
    },
    answer: {
      ar: "نقدم خدماتنا في بغداد وجميع محافظات العراق. كما نوفر خدمة الشحن والتركيب لكافة المناطق.",
      en: "We provide our services in Baghdad and all Iraqi governorates. We also offer shipping and installation nationwide.",
    },
  },
  {
    id: "5",
    question: {
      ar: "هل تقدمون ضماناً على أعمالكم؟",
      en: "Do you offer a warranty on your work?",
    },
    answer: {
      ar: "نعم، نقدم ضماناً لمدة سنة على جميع أعمالنا ضد عيوب التصنيع. نحن واثقون من جودة منتجاتنا.",
      en: "Yes, we offer a one-year warranty on all our work against manufacturing defects. We are confident in the quality of our products.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
