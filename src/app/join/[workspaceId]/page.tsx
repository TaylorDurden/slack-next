"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader } from "lucide-react";
import Image from "next/image";
import VerificationInput from "react-verification-input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useJoinNewMember } from "@/features/workspaces/api/useJoinNewMember";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useSearchParams";
import { useGetWorkspaceInfoById } from "@/features/workspaces/api/useGetWorkspaces";
import { cn } from "@/lib/utils";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspaceInfoById({ workspaceId });
  const { mutate, isPending } = useJoinNewMember();

  const isMember = useMemo(() => workspace?.isMember, [workspace]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspaces/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleJoin = (value: string) => {
    if (!workspaceId || value.length !== 6) {
      return;
    }

    mutate(
      {
        workspaceId: workspaceId as Id<"workspaces">,
        newJoinCode: value,
      },
      {
        onSuccess: (_workspaceId) => {
          toast.success("Joined workspace successfully!");
          router.push(`/workspaces/${_workspaceId}`);
        },
        onError: (error) => {
          toast.error("Failed to join workspace.");
        },
      }
    );
  };

  if (workspaceLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/logo.svg"} alt="Logo" width={60} height={60} />
      <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className="text-2xl font-bold">Join {workspace?.name}</h1>
        </div>
        <p className="text-md text-muted-foreground">Enter the workspace code to join</p>
        <VerificationInput
          classNames={{
            container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
            character:
              "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
          }}
          length={6}
          autoFocus
          onComplete={handleJoin}
        />
      </div>
      <div className="flex gap-x-4">
        <Button size="lg" variant={"outline"} asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
