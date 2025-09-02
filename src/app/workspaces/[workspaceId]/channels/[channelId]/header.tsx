import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";

export const Header = ({ title, onToggle = () => {} }: { title: string; onToggle?: () => void }) => {
  return (
    <div className="flex items-center py-1 px-4 gap-1 border-b border-muted/70 text-center">
      <Button variant={"ghost"} onClick={onToggle}>
        <span className="font-bold"># {title}</span>
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
};
