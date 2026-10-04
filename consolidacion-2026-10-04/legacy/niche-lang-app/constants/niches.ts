import type { Niche, LanguageName, LanguageCode, NicheType } from "@/shared/types";
import { ALL_LESSONS_BY_NICHE } from "../lib/data/lesson-templates";

const lessonCount = (nicheId: NicheType) => ALL_LESSONS_BY_NICHE[nicheId].length;

export const LANGUAGES: LanguageName = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  zh: "中文",
  ja: "日本語",
};

export const NICHES: Record<string, Niche> = {
  logistics: {
    id: "logistics",
    name: "Logística",
    icon: "🚚",
    description: "Aprende vocabulario de envíos, aduanas y tracking",
    color: "#FF6B35",
    lessonsCount: lessonCount("logistics"),
  },
  medicine: {
    id: "medicine",
    name: "Medicina",
    icon: "💊",
    description: "Términos médicos, síntomas y diagnósticos",
    color: "#EF4444",
    lessonsCount: lessonCount("medicine"),
  },
  sales: {
    id: "sales",
    name: "Ventas",
    icon: "💼",
    description: "Negociación, pitch y cierre de ventas",
    color: "#0A7EA4",
    lessonsCount: lessonCount("sales"),
  },
  tourism: {
    id: "tourism",
    name: "Turismo",
    icon: "✈️",
    description: "Reservas, recomendaciones y atención al cliente",
    color: "#22C55E",
    lessonsCount: lessonCount("tourism"),
  },
  construction: {
    id: "construction",
    name: "Construcción",
    icon: "🏗️",
    description: "Materiales, seguridad y planos",
    color: "#F59E0B",
    lessonsCount: lessonCount("construction"),
  },
  gastronomy: {
    id: "gastronomy",
    name: "Gastronomía",
    icon: "🍽️",
    description: "Recetas, ingredientes y técnicas culinarias",
    color: "#EC4899",
    lessonsCount: lessonCount("gastronomy"),
  },
  technology: {
    id: "technology",
    name: "Tecnología",
    icon: "📱",
    description: "Desarrollo, APIs y soporte técnico",
    color: "#8B5CF6",
    lessonsCount: lessonCount("technology"),
  },
  finance: {
    id: "finance",
    name: "Finanzas",
    icon: "💰",
    description: "Inversión, crédito e impuestos",
    color: "#06B6D4",
    lessonsCount: lessonCount("finance"),
  },
};

export const NICHE_LIST = Object.values(NICHES);

export function isNicheType(value: string): value is NicheType {
  return Object.prototype.hasOwnProperty.call(NICHES, value);
}

