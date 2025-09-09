import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useGenerateUploadUrl = () => {
  return useApiMutation(api.upload.generateUploadUrl);
};
