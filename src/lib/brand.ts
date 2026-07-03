/** هوية ضرغام – Dirgham Brand System */
export const BRAND = {
  colors: {
    navy: {
      950: "#060d18",
      900: "#0a1628",
      800: "#0f2744",
      700: "#1a365d",
      600: "#1e4d8c",
      500: "#2563b8",
      400: "#4a8fe7",
    },
    gold: {
      DEFAULT: "#c9a227",
      light: "#e8d5a3",
      dark: "#9a7b1a",
    },
    wood: {
      oak: "#a67c52",
      walnut: "#5c3d2e",
      engrave: "#3d2817",
      light: "#c4a882",
    },
    white: "#f8fafc",
  },
  fonts: {
    ar: {
      display: "var(--font-tajawal)",
      body: "var(--font-tajawal)",
    },
    en: {
      display: "var(--font-jakarta)",
      body: "var(--font-jakarta)",
    },
  },
} as const;

/** ألوان Three.js للمشهد */
export const SCENE_COLORS = {
  navyDark: BRAND.colors.navy[900],
  navyMetal: BRAND.colors.navy[600],
  navyFrame: BRAND.colors.navy[800],
  gold: BRAND.colors.gold.DEFAULT,
  woodOak: BRAND.colors.wood.oak,
  woodWalnut: BRAND.colors.wood.walnut,
  woodEngrave: BRAND.colors.wood.engrave,
  ambient: BRAND.colors.navy[400],
} as const;
