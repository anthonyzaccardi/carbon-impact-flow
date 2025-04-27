
import { z } from "zod";

export const measurementFormSchema = z.object({
  trackId: z.string().min(1, {
    message: "Please select a track.",
  }),
  factorId: z.string().min(1, {
    message: "Please select a factor.",
  }),
  supplierId: z.string().optional(),
  date: z.date({
    required_error: "Date is required.",
  }),
  quantity: z.coerce.number().positive({
    message: "Quantity must be a positive number.",
  }),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
  notes: z.string().optional(),
  status: z.enum(["active", "pending", "completed", "cancelled"]),
});

export type MeasurementFormData = z.infer<typeof measurementFormSchema>;
