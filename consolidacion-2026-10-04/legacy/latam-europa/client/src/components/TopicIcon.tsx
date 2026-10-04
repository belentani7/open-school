import type { Topic } from "@shared/latam-data";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Home,
  Landmark,
} from "lucide-react";

const icons: Record<Topic, LucideIcon> = {
  documentacion: FileText,
  residencia: Landmark,
  trabajo: BriefcaseBusiness,
  vivienda: Home,
  salud: HeartPulse,
  educacion: GraduationCap,
  integracion: HandHeart,
};

export function TopicIcon({ topic, className, size }: { topic: Topic; className?: string; size?: number }) {
  const Icon = icons[topic];
  return <Icon aria-hidden="true" className={className} size={size} strokeWidth={1.8} />;
}
