"use client";

import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useEffect } from "react";

export default function WorkspacePage() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspace } = useGetWorkspaceById({ id: workspaceId });

  useEffect(() => {
    // If workspaces are loaded but the current workspace doesn't exist, redirect to home
    // if (!workspace) {
    //   router.replace("/");
    // }
  }, [workspace, router]);

  if (!workspace) {
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
