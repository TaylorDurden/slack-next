"use client";

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

export default function WorkspacePage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const router = useRouter();
  const workspaces = useGetWorkspaces();

  const currentWorkspace = useMemo(() => {
    return workspaces?.find((workspace) => workspace._id === workspaceId);
  }, [workspaces, workspaceId]);

  useEffect(() => {
    // If workspaces are loaded but the current workspace doesn't exist, redirect to home
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      router.replace("/");
    }
  }, [workspaces, currentWorkspace, router]);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Workspace not found</h1>
          <p className="text-gray-600 mb-4">The workspace you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{currentWorkspace.name}</h1>
          <p className="text-gray-600 mt-2">Workspace ID: {currentWorkspace._id}</p>
          <p className="text-gray-600">Join Code: {currentWorkspace.joinCode}</p>
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
