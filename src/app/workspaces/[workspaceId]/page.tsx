"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useSearchParams";
import { useEffect, useMemo } from "react";
import { Loader, TriangleAlert } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetChannels } from "@/features/channels/api/useGetChannels";
import { useCreateChannelModal } from "@/features/channels/store/useCreateWorkspaceModal";
import { useCurrentMember } from "@/features/members/api/useGetMembers";
import Link from "next/link";
import { AlertHome } from "@/components/alertHome";

export default function WorkspaceIdPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({
    id: workspaceId,
  });
  // const { isOpen, open, close } = useCreateWorkspaceModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { isOpen, open } = useCreateChannelModal();
  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member]);

  useEffect(() => {
    if (workspaceLoading || channelsLoading || memberLoading || !member || !workspace) {
      return;
    }

    if (channelId) {
      router.push(`/workspaces/${workspaceId}/channels/${channelId}`);
    } else if (!isOpen && isAdmin) {
      open();
    }
  }, [
    workspaceLoading,
    workspace,
    router,
    workspaceId,
    channelsLoading,
    channelId,
    isOpen,
    open,
    memberLoading,
    member,
    isAdmin,
  ]);

  if (channelsLoading) {
    return (
      <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
        <Loader className="size-6 text-muted-foreground" data-testid="loader" />
      </div>
    );
  }

  if (workspaceLoading || !workspace) {
    return <AlertHome message="Workspace not found" />;
  }

  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" data-testid="loader" />
      <span className="text-sm text-muted-foreground">Channel not found</span>
    </div>
  );
}
