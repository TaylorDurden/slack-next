import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useCreateChannel = () => {
  return useApiMutation(api.channels.create);
};
