import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useCreateMessage } from "@/features/messages/api/useCreateWorkspace";
import { useChannelId, useWorkspaceId } from "@/hooks/useSearchParams";
import { toast } from "sonner";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";
import { Id } from "../../../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage">;
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
    setPending(true);
    editorRef?.current?.enable(false);
    try {
      console.log({ body, image });
      const values: CreateMessageValues = { body, workspaceId, channelId, image: undefined };
      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        const result = await fetch(url!, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        const { storageId } = await result.json();
        values.image = storageId;
      }
      await createMessage(values, {
        throwError: true,
      });

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setPending(false);
      editorRef?.current?.enable(true);
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
