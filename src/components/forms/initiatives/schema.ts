
import { z } from "zod";
import { InitiativeStatus, TrajectoryType, PlanType } from "@/types";

export const initiativeFormSchema = z.object({
  name: z.string().min(3, {
    message: "Initiative name must be at least 3 characters.",
  }),
  description: z.string().min(5, {
    message: "Description must be at least 5 characters.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  endDate: z.date({
    required_error: "End date is required.",
  }),
  status: z.enum(["not_started", "in_progress", "completed", "committed"] as const, {
    required_error: "Status is required.",
  }),
  spend: z.coerce.number().nonnegative({
    message: "Spend amount must be a non-negative number.",
  }),
  trajectory: z.enum(["every_year", "linear"], {
    required_error: "Trajectory type is required.",
  }),
  plan: z.enum(["-2%", "-4%", "-6%", "-8%", "-10%", "-15%", "-5%"], {
    required_error: "Reduction plan is required.",
  }),
  currency: z.string().min(1, {
    message: "Currency is required.",
  }),
  targetIds: z.array(z.string()).optional(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export type InitiativeFormData = z.infer<typeof initiativeFormSchema>;
