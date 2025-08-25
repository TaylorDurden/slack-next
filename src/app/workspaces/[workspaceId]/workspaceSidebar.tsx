import React from "react";
import { useCurrentMember } from "@/features/members/api/useGetMembers";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import { WorkspaceHeader } from "./workspaceHeader";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: membersLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId });

  if (membersLoading || workspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <WorkspaceHeader workspace={workspace} isAdmin={member?.role === "admin"} />
    </div>
  );
};
