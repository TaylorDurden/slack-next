import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateChannelModal } from "../store/useCreateWorkspaceModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateChannel } from "../api/useCreateChannel";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { toast } from "sonner";

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const { isOpen, close } = useCreateChannelModal();
  const { mutate, isPending, error, reset } = useCreateChannel();

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
      toast.error(error.message || "Failed to create channel");
    }
  }, [error]);

  const validateName = useCallback((value: string): string => {
    if (!value.trim()) {
      return "Channel name is required";
    }
    if (value.trim().length < 3) {
      return "Channel name must be at least 3 characters";
    }
    if (value.trim().length > 50) {
      return "Channel name must be less than 50 characters";
    }
    return "";
  }, []);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
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
        { name: trimmedName, workspaceId },
        {
          onSuccess(channelId) {
            toast.success("Channel created successfully!");
            close();
            //TODO: redirect to channel page
          },
          onError(error) {
            toast.error(error.message || "Failed to create channel");
          },
        }
      );
    },
    [name, validateName, mutate, workspaceId, close]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Channel</DialogTitle>
          <DialogDescription>Create a new channel in the workspace.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            value={name}
            disabled={isPending}
            onChange={handleNameChange}
            className={nameError ? "border-red-500" : ""}
            required
            autoFocus
            minLength={3}
            maxLength={50}
            placeholder="Channel Name"
            type="text"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit">{isPending ? "Creating..." : "Create Channel"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
