
import { format, isValid } from "date-fns";

// Helper function to ensure dates are valid
export function getValidDate(dateString: string): Date {
  try {
    const date = new Date(dateString);
    return isValid(date) ? date : new Date();
  } catch (error) {
    console.error("Invalid date:", dateString);
    return new Date();
  }
}

export function formatDateForApi(date: Date): string {
  return isValid(date) 
    ? format(date, "yyyy-MM-dd") 
    : format(new Date(), "yyyy-MM-dd");
}
