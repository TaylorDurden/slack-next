"use client";

import UserAvatar from "@/features/auth/components/user-avatar";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { isOpen, open } = useCreateWorkspaceModal();
  const router = useRouter();
  const workspaces = useGetWorkspaces();

  const firstWorkspaceId = useMemo(() => {
    return workspaces?.[0]?._id;
  }, [workspaces]);

  useEffect(() => {
    if (firstWorkspaceId) {
      router.replace(`/workspaces/${firstWorkspaceId}`);
    } else if (!isOpen) {
      open();
    }
  }, [firstWorkspaceId, isOpen, open, router]);

  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">Welcome to Slack Clone</h1>
      <UserAvatar />
    </div>
  );
}
