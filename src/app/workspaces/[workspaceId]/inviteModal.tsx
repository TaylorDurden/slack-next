import React from "react";
import {
  Dialog,
  DialogDescription,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCw, Copy, Loader } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useGetWorkspaceById } from "@/features/workspaces/api/useGetWorkspaces";
import { useWorkspaceRegenerateJoinCode } from "@/features/workspaces/api/useWorkspaceRegenerateJoinCode";
import { useConfirm } from "@/hooks/useConfirm";
interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const InviteModal = ({ open, setOpen }: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceById({ id: workspaceId });
  const handleCopyInviteLink = () => {
    const copyLink = `${window.location.origin}/join/${workspaceId}/code/${workspace?.joinCode}`;
    navigator.clipboard.writeText(copyLink).then(() => toast.success("Invite link copied to clipboard!"));
  };
  const { mutate, isPending: isRegenerating } = useWorkspaceRegenerateJoinCode();
  const [ConfirmDialog, confirmP] = useConfirm({
    title: "Regenerate Join Code",
    description: "Are you sure you want to regenerate the join code?",
  });
  const handleRegenerateJoinCode = async () => {
    const ok = await confirmP();
    if (!ok) return;
    await mutate(
      { workspaceId },
      {
        onSuccess: (newCode) => {
          if (newCode) toast.success("Invite link regenerated!");
        },
        onError: () => {
          toast.error("Failed to regenerate invite link.");
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to {workspace?.name}</DialogTitle>
            <DialogDescription>Send an invitation link to your workspace members.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {workspaceLoading || isRegenerating ? <Loader /> : workspace?.joinCode}
            </p>
            <Button variant="ghost" onClick={() => handleCopyInviteLink()}>
              Copy Invite Link
              <Copy />
            </Button>
          </div>
          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <Button variant={"outline"} disabled={isRegenerating} onClick={handleRegenerateJoinCode}>
                Regenerate Code
                <RefreshCw />
              </Button>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
