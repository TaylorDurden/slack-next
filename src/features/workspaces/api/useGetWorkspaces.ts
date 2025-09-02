import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetWorkspaces = () => {
  const data = useQuery(api.workspaces.get);
  return { data, isLoading: data === undefined };
};

export const useGetWorkspaceById = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getById, { id });
  return { data, isLoading: data === undefined };
};

/**
 * No membership validation
 * @param param0
 * @returns
 */
export const useGetWorkspaceInfoById = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getInfoById, { workspaceId });
  return { data, isLoading: data === undefined };
};
