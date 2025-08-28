import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Hint } from "@/components/hint";
import PreferencesModal from "./preferencesModal";
import { InviteModal } from "./inviteModal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [openPreferences, setPreferencesOpen] = useState(false);
  const [openInvite, setInviteOpen] = useState(false);
  return (
    <>
      <InviteModal open={openInvite} setOpen={setInviteOpen} />
      <PreferencesModal open={openPreferences} setOpen={setPreferencesOpen} initialWorkspaceName={workspace.name} />
      <div className="flex items-center justify-between px-2 h-[49px] gap-0.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="transparent" size="sm" className="font-semibold text-lg w-auto p-1.5 overflow-hidden">
              <span className="truncate">{workspace?.name}</span>
              <ChevronDown className="size-4 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" className="w-56">
            {isAdmin && (
              <>
                <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setInviteOpen(true)}>
                  Invite People
                  <DropdownMenuShortcut>⇧⌘I</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setPreferencesOpen(true)}>
                  Preferences
                  <DropdownMenuShortcut>⌘.</DropdownMenuShortcut>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center">
          <Hint label="Search Message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <ListFilter className="size-4" />
            </Button>
          </Hint>
          <Hint label="New Message" side="bottom">
            <Button variant="transparent" size="iconSm">
              <SquarePen className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
