import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "../../../hooks/useApiMutation";

export const useRemoveWorkspace = () => {
  return useApiMutation(api.workspaces.remove);
};
