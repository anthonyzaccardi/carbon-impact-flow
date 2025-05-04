
import { Initiative, InitiativeStatus, PlanType, TrajectoryType } from "@/types";

// Helper functions to ensure type safety
export const validateInitiativeStatus = (status: string): InitiativeStatus => {
  const validStatuses: InitiativeStatus[] = ['not_started', 'in_progress', 'completed', 'committed'];
  return validStatuses.includes(status as InitiativeStatus) 
    ? (status as InitiativeStatus) 
    : 'not_started';
};

export const validateTrajectoryType = (trajectory: string | null): TrajectoryType => {
  const validTrajectories: TrajectoryType[] = ['every_year', 'linear'];
  return trajectory && validTrajectories.includes(trajectory as TrajectoryType) 
    ? (trajectory as TrajectoryType) 
    : 'linear';
};

export const validatePlanType = (plan: string | null): PlanType => {
  const validPlans: PlanType[] = ['-2%', '-4%', '-6%', '-8%', '-10%', '-15%', '-5%'];
  return plan && validPlans.includes(plan as PlanType) 
    ? (plan as PlanType) 
    : '-5%';
};
