import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetChannels = ({ workspaceId }: { workspaceId: Id<"workspaces"> }) => {
  const data = useQuery(api.channels.get, { workspaceId });
  return { data, isLoading: data === undefined };
};

export const useGetChannelById = ({ id }: { id: Id<"channels"> }) => {
  const data = useQuery(api.channels.getById, { id: id });
  return { data, isLoading: data === undefined };
};
