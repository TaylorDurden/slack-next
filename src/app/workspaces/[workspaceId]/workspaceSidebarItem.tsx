import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { cn } from "@/lib/utils";

const sidebarItemVariants = cva(
  "flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden",
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

interface WorkspaceSidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const WorkspaceSidebarItem = ({ label, icon: Icon, id, variant }: WorkspaceSidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button className={cn(sidebarItemVariants({ variant }))} variant={"transparent"} size={"sm"} asChild>
      <Link href={`/workspaces/${workspaceId}/channels/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};
