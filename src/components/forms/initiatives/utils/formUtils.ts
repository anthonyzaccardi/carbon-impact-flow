
import { Initiative } from "@/types";
import { InitiativeFormData } from "../schema";
import { getValidDate } from "./dateUtils";

export function getInitiativeFormDefaultValues(
  initialData?: Initiative
): InitiativeFormData {
  return initialData
    ? {
        name: initialData.name,
        description: initialData.description || "",
        startDate: getValidDate(initialData.startDate),
        endDate: getValidDate(initialData.endDate),
        status: initialData.status,
        spend: initialData.spend,
        trajectory: initialData.trajectory,
        plan: initialData.plan,
        currency: initialData.currency,
        targetIds: initialData.targetIds || [],
      }
    : {
        name: "",
        description: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: "not_started",
        spend: 0,
        trajectory: "linear",
        plan: "-6%",
        currency: "USD",
        targetIds: [],
      };
}

export function prepareInitiativeDataForSubmission(data: InitiativeFormData) {
  // Ensure we have valid dates before formatting
  const formattedData = {
    ...data,
    startDate: format(data.startDate, "yyyy-MM-dd"),
    endDate: format(data.endDate, "yyyy-MM-dd"),
  };

  return formattedData;
}
