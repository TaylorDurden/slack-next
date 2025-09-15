import { api } from "../../../../convex/_generated/api";
import { useApiMutation } from "@/hooks/useApiMutation";

export const useCreateMessage = () => {
  return useApiMutation(api.messages.create);
};
