import type { estimateRequestSchema } from "./schemas";
import type { z } from "zod";

type EstimateInput = z.infer<typeof estimateRequestSchema>;

const MATERIAL_RATES_IQD: Record<EstimateInput["material"], number> = {
  mdf: 45_000,
  plywood: 55_000,
  melamine: 50_000,
  beech: 95_000,
  oak: 130_000,
  walnut: 160_000,
};

const CATEGORY_MULTIPLIER: Record<EstimateInput["category"], number> = {
  decorations: 1.2,
  doors: 1.35,
  kitchens: 1.5,
  bedrooms: 1.4,
  furniture: 1.25,
  panels: 1.15,
  special: 1.3,
};

const COMPLEXITY_MULTIPLIER: Record<EstimateInput["complexity"], number> = {
  simple: 1,
  medium: 1.25,
  complex: 1.55,
};

const CNC_BASE_FEE = 75_000;

export interface PriceEstimate {
  min: number;
  max: number;
  currency: "IQD";
  breakdown: {
    materialCost: number;
    laborCost: number;
    cncCost: number;
    total: number;
  };
  note: { ar: string; en: string };
}

export function calculateEstimate(input: EstimateInput): PriceEstimate {
  const areaSqm = (input.widthCm * input.heightCm) / 10_000;
  const depthFactor = input.depthCm ? 1 + Math.min(input.depthCm / 200, 0.5) : 1;

  const materialRate = MATERIAL_RATES_IQD[input.material];
  const materialCost = Math.round(areaSqm * materialRate * depthFactor * CATEGORY_MULTIPLIER[input.category]);

  const laborCost = Math.round(materialCost * 0.45 * COMPLEXITY_MULTIPLIER[input.complexity]);
  const cncCost = Math.round(CNC_BASE_FEE * COMPLEXITY_MULTIPLIER[input.complexity]);
  const total = materialCost + laborCost + cncCost;

  const variance = 0.12;
  return {
    min: Math.round(total * (1 - variance)),
    max: Math.round(total * (1 + variance)),
    currency: "IQD",
    breakdown: { materialCost, laborCost, cncCost, total },
    note: {
      ar: "تقدير تقريبي — السعر النهائي يعتمد على التصميم والتشطيبات والمعاينة.",
      en: "Approximate estimate — final price depends on design, finishes, and site visit.",
    },
  };
}
