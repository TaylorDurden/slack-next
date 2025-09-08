import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/useCreateWorkspace";
import { useChannelId, useWorkspaceId } from "@/hooks/useSearchParams";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    setPending(true);
    try {
      console.log({ body, image });
      await createMessage(
        { body, workspaceId, channelId },
        {
          throwError: true,
        }
      );

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        variant="create"
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
        key={editorKey}
      />
    </div>
  );
};
