import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWorkspaceModal } from "../store/useCreateWorkspaceModal";
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const [name, setName] = useState("");
  const router = useRouter();
  const [isOpen, setIsOpen] = useCreateWorkspaceModal();
  const { mutate, isPending } = useCreateWorkspace();
  const handleOpenChange = (open: boolean = false) => {
    setIsOpen(open);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = mutate(
      { name },
      {
        onSuccess(workspaceId) {
          toast.success("Workspace created!");
          router.push(`/workspaces/${workspaceId}`);
          handleOpenChange();
        },
        onError(error) {
          toast.error(error.message);
        },
        onSettled() {
          // Reset form
        },
      }
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a workspace</DialogTitle>
          <DialogDescription>Create a new workspace to get started</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            id="name"
            disabled={isPending}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
