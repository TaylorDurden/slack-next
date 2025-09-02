import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../../convex/_generated/api";

export const useRemoveChannel = () => {
  return useApiMutation(api.channels.remove);
};
