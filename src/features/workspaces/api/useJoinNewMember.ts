import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useJoinNewMember = () => {
  return useApiMutation(api.workspaces.joinNewMember);
};
