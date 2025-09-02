import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useUpdateChannel } from "../api/useUpdateChannel";
import { useRemoveChannel } from "../api/useRemoveChannel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { Id } from "../../../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/useSearchParams";
import { useRouter } from "next/navigation";

interface EditChannelModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialChannelName: string;
  channelId: Id<"channels">;
}

const EditChannelModal = ({ open, setOpen, initialChannelName, channelId }: EditChannelModalProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(initialChannelName);
  const { mutate: updateChannel, isPending: updateLoading } = useUpdateChannel();
  const { mutate: removeChannel, isPending: removeLoading } = useRemoveChannel();
  const [ConfirmDialog, confirmP] = useConfirm({
    title: "Remove channel",
    description: "Are you sure you want to remove this channel?",
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name },
      {
        onSuccess: () => {
          toast.success("Channel name updated!");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel name. Please try again.");
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirmP();
    if (!ok) return;
    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel removed!");
          setOpen(false);
          router.replace(`/workspaces/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to remove channel. Please try again.");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle># {name}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel Name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>
                  </div>
                  <p className="text-sm"># {name}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdate}>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={50}
                    placeholder="Channel name e.g. 'general' 'random'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={updateLoading} type="submit" variant="outline">
                      Save
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button
              disabled={removeLoading}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <TrashIcon className="size-4" />
              <p className="text-sm text-semibold">Delete Channel</p>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditChannelModal;
