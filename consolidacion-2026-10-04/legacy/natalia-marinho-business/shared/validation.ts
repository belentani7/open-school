import { z } from "zod";

const personName = z.string().trim().min(2).max(180);
const email = z.string().trim().email().max(254);
const optionalText = (max: number) => z.string().trim().max(max).optional();
const requiredText = (min: number, max: number) => z.string().trim().min(min).max(max);

export const leadSubscriptionInput = z.object({
  email,
  language: z.enum(["ES", "PT"]).default("ES"),
  source: z.string().trim().min(1).max(120).default("website"),
});

export const collaborationRequestInput = z.object({
  name: personName,
  email,
  organization: optionalText(180),
  city: z.string().trim().min(2).max(100).default("Barcelona"),
  proposalType: requiredText(2, 120),
  message: requiredText(10, 3000),
});

export const bookingRequestInput = z.object({
  name: personName,
  email,
  message: optionalText(3000),
  service: z.string().trim().min(2).max(160).default("Experiencia privada"),
  preferredDate: optionalText(32),
  preferredTime: optionalText(32),
});

export const bookingAvailabilityInput = z.object({
  date: z.string().trim().min(10).max(32),
});

export const leadStatusInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["active", "unsubscribed"]),
});

export const collaborationStatusInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["new", "reviewing", "contacted", "closed"]),
});
