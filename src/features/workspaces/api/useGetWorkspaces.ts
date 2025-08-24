import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  return { data, isLoading: !data };
};

export const useGetWorkspaceById = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getById, { id });
  return { data, isLoading: !data };
};
