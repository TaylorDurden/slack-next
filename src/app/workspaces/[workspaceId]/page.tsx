"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspace, isLoading } = useGetWorkspaceById({
    id: workspaceId,
  });

  useEffect(() => {
    if (!isLoading && !workspace) {
      router.replace("/");
    }
  }, [isLoading, workspace, router]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-10 animate-spin" data-testid="loader" />
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{workspace.name}</h1>
          <p className="text-gray-600 mt-2">Workspace ID: {workspace._id}</p>
          <p className="text-gray-600">Join Code: {workspace.joinCode}</p>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Workspace Overview</h2>
          <p className="text-gray-600">
            Welcome to your workspace! This is where you&apos;ll be able to collaborate with your team.
          </p>
          <p className="text-gray-600 mt-2">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
