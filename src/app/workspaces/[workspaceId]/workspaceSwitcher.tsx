import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceById, useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/useCreateWorkspaceModal";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const { setIsOpen } = useCreateWorkspaceModal();

  const id = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filteredWorkspaces = workspaces?.filter((ws) => ws._id !== id) ?? [];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" data-testid="loader" />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/workspaces/${workspace?._id}`)}
            className="cursor-pointer flex-col justify-start items-start  capitalize"
          >
            {workspace?.name}
            <div className="text-xs text-muted-foreground">Active workspace</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {filteredWorkspaces?.map((ws) => (
            <DropdownMenuItem
              key={ws._id}
              onClick={() => router.push(`/workspaces/${ws._id}`)}
              className="cursor-pointer capitalize p-1 overflow-hidden"
            >
              <div className="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex justify-center items-center mr-2">
                {ws?.name.charAt(0).toUpperCase()}
              </div>
              <p className="truncate">{ws?.name}</p>
            </DropdownMenuItem>
          ))}
          {filteredWorkspaces.length > 0 && <DropdownMenuSeparator />}
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setIsOpen(true)}>
            <div className="size-9 relative overflow-hidden bg-[#F2f2f2] text-slate-800 font-semibold text-lg rounded-md flex justify-center items-center mr-2">
              <Plus />
            </div>
            New Workspace
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
