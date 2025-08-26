"use client";

import UserAvatar from "@/features/auth/components/user-avatar";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const { isOpen, open, close } = useCreateWorkspaceModal();
  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();

  const firstWorkspaceId = useMemo(() => {
    return workspaces?.[0]?._id ?? null;
  }, [workspaces]);

  useEffect(() => {
    if (firstWorkspaceId) {
      if (isOpen) {
        close();
      }
      router.replace(`/workspaces/${firstWorkspaceId}`);
    } else if (firstWorkspaceId === null && workspaces?.length === 0) {
      open();
    }
  }, [close, firstWorkspaceId, isOpen, open, router, workspaces?.length]);

  return (
    <div className="flex items-center justify-between p-4">
      <UserAvatar />
    </div>
  );
}
