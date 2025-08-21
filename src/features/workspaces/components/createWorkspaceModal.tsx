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
import { Label } from "@/components/ui/label";
import { useCreateWorkspaceModal } from "../store/useCreateWorkspaceModal";
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const router = useRouter();
  const { isOpen, close } = useCreateWorkspaceModal();
  const { mutate, isPending, error, reset } = useCreateWorkspace();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setNameError("");
      reset();
    }
  }, [isOpen, reset]);

  // Show error toast when mutation fails
  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create workspace");
    }
  }, [error]);

  const validateName = useCallback((value: string): string => {
    if (!value.trim()) {
      return "Workspace name is required";
    }
    if (value.trim().length < 3) {
      return "Workspace name must be at least 3 characters";
    }
    if (value.trim().length > 50) {
      return "Workspace name must be less than 50 characters";
    }
    return "";
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setName(value);
      setNameError(validateName(value));
    },
    [validateName]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
      }
    },
    [close]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedName = name.trim();
      const validationError = validateName(trimmedName);

      if (validationError) {
        setNameError(validationError);
        return;
      }

      mutate(
        { name: trimmedName },
        {
          onSuccess(workspaceId) {
            toast.success("Workspace created successfully!");
            router.push(`/workspaces/${workspaceId}`);
            close();
          },
          onError(error) {
            toast.error(error.message || "Failed to create workspace");
          },
        }
      );
    },
    [name, validateName, mutate, router, close]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to organize your projects and collaborate with your team.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">Workspace name</Label>
            <Input
              id="workspace-name"
              value={name}
              disabled={isPending}
              onChange={handleNameChange}
              placeholder="Enter workspace name..."
              className={nameError ? "border-red-500" : ""}
              autoFocus
              minLength={3}
              maxLength={50}
            />
            {nameError && <p className="text-sm text-red-500">{nameError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !!nameError || !name.trim()}>
              {isPending ? "Creating..." : "Create workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
