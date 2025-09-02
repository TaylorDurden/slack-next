import React from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/useSearchParams";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const workspaceMemberItemVariants = cva(
  "flex items-center justify-start gap-1.5 font-normal h-7 px-2.5 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface WorkspaceMemberItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof workspaceMemberItemVariants>["variant"];
}

export const WorkspaceMemberItem = ({ id, label = "member", image, variant }: WorkspaceMemberItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();
  return (
    <Button asChild variant={"transparent"} size={"sm"} className={cn(workspaceMemberItemVariants({ variant }))}>
      <Link href={`/workspaces/${workspaceId}/members/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md">{avatarFallback}</AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
