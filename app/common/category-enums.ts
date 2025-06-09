import { pgEnum } from "drizzle-orm/pg-core";

export const commissionCategory = pgEnum("commission_category", [
  "character",
  "illustration",
  "virtual-3d",
  "live2d",
  "design",
  "video",
  "animation",
  "concept-art",
  "mixed",
]);

export const COMMISSION_CATEGORIES = [
  "character",
  "illustration",
  "virtual-3d",
  "live2d",
  "design",
  "video",
  "animation",
  "concept-art",
  "mixed",
] as const;

export type CommissionCategory = (typeof COMMISSION_CATEGORIES)[number];
