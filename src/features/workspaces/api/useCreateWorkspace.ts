import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useCreateWorkspace = () => {
  return useApiMutation(api.workspaces.create);
};
