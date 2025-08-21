"use client";

import UserAvatar from "@/features/auth/components/user-avatar";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const router = useRouter();
  const workspaces = useGetWorkspaces();
  const workspaceId = useMemo(() => {
    return workspaces?.[0]?._id;
  }, [workspaces]);

  useEffect(() => {
    if (workspaceId) {
      router.replace(`/workspaces/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [workspaceId, isOpen, setIsOpen, router]);
  return (
    <div>
      <UserAvatar />
    </div>
  );
}
function createWorkspace() {
  throw new Error("Function not implemented.");
}
