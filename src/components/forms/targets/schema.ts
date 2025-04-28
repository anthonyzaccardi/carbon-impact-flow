
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
  targetPercentage: z.enum(["-5", "-10", "-20", "-30", "-40"], {
    required_error: "Target percentage is required.",
  }),
  targetDate: z.string(),
  status: z.enum(["not_started", "in_progress", "completed"], {
    required_error: "Status is required.",
  }),
});

export type TargetFormData = z.infer<typeof targetFormSchema>;
