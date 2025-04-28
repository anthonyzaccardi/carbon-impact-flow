
import { UseFormReturn } from "react-hook-form";
import { TargetFormData } from "./schema";
import { BasicInfoFields } from "./fields/BasicInfoFields";
import { ValueFields } from "./fields/ValueFields";
import { StatusFields } from "./fields/StatusFields";

interface TargetFormFieldsProps {
  form: UseFormReturn<TargetFormData>;
  isViewMode: boolean;
}

export const TargetFormFields = ({ form, isViewMode }: TargetFormFieldsProps) => {
  return (
    <>
      <BasicInfoFields form={form} isViewMode={isViewMode} />
      <ValueFields form={form} isViewMode={isViewMode} />
      <StatusFields form={form} isViewMode={isViewMode} />
    </>
  );
};
