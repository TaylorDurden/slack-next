"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useJoinNewMember } from "@/features/workspaces/api/useJoinNewMember";
import { Id } from "../../../../../../convex/_generated/dataModel";
import Logo from "@/assets/logo.png";
import Image from "next/image";

const JoinPage = () => {
  const router = useRouter();
  const params = useParams();
  const { workspaceId, joinCode } = params;
  const { mutate, isPending } = useJoinNewMember();

  const handleJoin = () => {
    if (!workspaceId || !joinCode) {
      return;
    }

    mutate({
      workspaceId: workspaceId as Id<"workspaces">,
      newJoinCode: joinCode as string,
    })
      .then((workspaceId) => {
        toast.success("Joined workspace successfully!");
        router.push(`/workspaces/${workspaceId}`);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to join workspace.");
        router.push("/");
      });
  };

  return (
    <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md">
      <Image src={"/public/logo.svg"} alt="Logo" width={60} height={60} />
      <Loader className="size-10 animate-spin" />
      <p className="ml-4 text-lg">Joining workspace...</p>
    </div>
  );
};

export default JoinPage;
