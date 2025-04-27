
import { z } from "zod";

export const trackFormSchema = z.object({
  name: z.string().min(3, {
    message: "Track name must be at least 3 characters.",
  }),
  emoji: z.string().min(1, {
    message: "Please select an emoji.",
  }),
});

export type TrackFormData = z.infer<typeof trackFormSchema>;

export const emojis = ["🏭", "⚡", "🌐", "💧", "🗑️", "🌱", "🚗", "✈️", "🏢", "🌲"];

