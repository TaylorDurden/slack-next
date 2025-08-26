"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

type ConfirmFunction = () => Promise<boolean>;

export const useConfirm = ({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmOptions): [React.FC, ConfirmFunction] => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => {});
  /**
   * This function is what you call to trigger the dialog.
   * It creates a new Promise and stores its resolve function in the resolvePromise state.
   * It then sets isOpen to true, which makes the ConfirmDialog appear.
   * The promise will remain pending until the user clicks one of the buttons in the dialog.
   */
  const confirm = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      setIsOpen(true);
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    resolvePromise(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolvePromise(false);
    setIsOpen(false);
  };

  const ConfirmDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmDialog, confirm];
};
