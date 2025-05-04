
import { Initiative } from "@/types";
import { validateInitiativeStatus, validateTrajectoryType, validatePlanType } from "./types";

export const mapDatabaseToInitiative = (dbInitiative: any, targetIds: string[] = []): Initiative => {
  return {
    id: dbInitiative.id,
    name: dbInitiative.name,
    description: dbInitiative.description || '',
    startDate: dbInitiative.start_date || new Date().toISOString(),
    endDate: dbInitiative.end_date || new Date().toISOString(),
    status: validateInitiativeStatus(dbInitiative.status),
    spend: dbInitiative.budget || 0,
    trajectory: validateTrajectoryType(dbInitiative.trajectory),
    plan: validatePlanType(dbInitiative.plan),
    absolute: dbInitiative.absolute,
    targetIds: targetIds,
    currency: dbInitiative.currency || 'USD',
    createdAt: dbInitiative.created_at,
    updatedAt: dbInitiative.updated_at
  };
};

export const mapInitiativeToDatabase = (initiative: Partial<Initiative>) => {
  const updates: any = {};
  
  if (initiative.name !== undefined) updates.name = initiative.name;
  if (initiative.description !== undefined) updates.description = initiative.description;
  if (initiative.status !== undefined) updates.status = initiative.status;
  if (initiative.plan !== undefined) updates.plan = initiative.plan;
  if (initiative.spend !== undefined) updates.budget = initiative.spend;
  if (initiative.absolute !== undefined) updates.absolute = initiative.absolute;
  if (initiative.startDate !== undefined) updates.start_date = initiative.startDate;
  if (initiative.endDate !== undefined) updates.end_date = initiative.endDate;
  if (initiative.trajectory !== undefined) updates.trajectory = initiative.trajectory;
  if (initiative.currency !== undefined) updates.currency = initiative.currency;
  
  return updates;
};
