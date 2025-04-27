
import { z } from "zod";

export const targetFormSchema = z.object({
  trackId: z.string().min(1, {
    message: "Please select a track.",
  }),
  scenarioId: z.string().optional(),
  supplierId: z.string().optional(),
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string(),
  baselineValue: z.coerce.number().nonnegative({
    message: "Baseline value must be a non-negative number.",
  }),
  targetPercentage: z.coerce.number().min(0).max(100, {
    message: "Target percentage must be between 0 and 100.",
  }),
  targetDate: z.string(), // Changed to only accept string
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;
