import { useApiMutation } from "@/hooks/useApiMutation";
import { api } from "../../../../convex/_generated/api";

export const useUpdateChannel = () => {
  return useApiMutation(api.channels.update);
};
