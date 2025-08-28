import React from "react";
import { useCurrentMember, useGetMembers } from "@/features/members/api/useGetMembers";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizontal } from "lucide-react";
import { WorkspaceHeader } from "./workspaceHeader";
import { WorkspaceSidebarItem } from "./workspaceSidebarItem";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { Doc } from "../../../../convex/_generated/dataModel";
import { WorkspaceSection } from "./workspaceSection";
import { WorkspaceMemberItem } from "./workspaceMemberItem";
import { useCreateChannelModal } from "@/features/channels/store/useCreateWorkspaceModal";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { isOpen, setIsOpen } = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  if (memberLoading || workspaceLoading) {
    return (
      <div data-testid="loader" className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
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
      <div className="flex flex-col px-2 mt-3">
        <WorkspaceSidebarItem label="Threads" icon={MessageSquareText} id="threads" />
        <WorkspaceSidebarItem label="Drafts & Sent" icon={SendHorizontal} id="drafts" />
      </div>
      <WorkspaceSection
        label="Channels"
        hintText="New Channel"
        onNew={member.role === "admin" ? () => setIsOpen(true) : undefined}
      >
        {channels?.map((channel: Doc<"channels">) => (
          <WorkspaceSidebarItem key={channel._id} label={channel.name} icon={HashIcon} id={channel._id} />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label="Direct Messages" hintText="New DM" onNew={() => {}}>
        {members?.map((m) => <WorkspaceMemberItem key={m._id} label={m.user.name} image={m.user.image} id={m._id} />)}
      </WorkspaceSection>
    </div>
  );
};
