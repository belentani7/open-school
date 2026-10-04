export const AVAILABLE_BOOKING_TIMES = ["10:00", "12:00", "16:00", "18:00"] as const;

export type BookingTime = (typeof AVAILABLE_BOOKING_TIMES)[number];
