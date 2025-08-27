import React from "react";
import { FaCaretRight } from "react-icons/fa";
import { PlusIcon } from "lucide-react";
import { useToggle } from "react-use";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hintText: string;
  onNew?: () => void;
}

export const WorkspaceSection = ({ children, label, hintText, onNew }: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);
  return (
    <div className="flex flex-col mt-3 px-2">
      <div className="flex items-center px-1 group">
        <Button
          onClick={toggle}
          variant="transparent"
          size="iconSm"
          className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
        >
          <FaCaretRight className={cn("size-4 transition-transform", on && "rotate-90")} />
        </Button>
        <Button
          variant="transparent"
          size="sm"
          className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start items-center overflow-hidden"
        >
          <span className="truncate">{label}</span>
        </Button>
        {onNew && (
          <Hint label={hintText}>
            <Button
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
              onClick={onNew}
              variant={"transparent"}
              size={"iconSm"}
            >
              <PlusIcon className="size-5" />
            </Button>
          </Hint>
        )}
      </div>
      {on && children}
    </div>
  );
};
