import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import React from "react";

export const AlertHome = ({ message }: { message: string }) => {
  return (
    <div className="h-full flex flex-1 items-center justify-center flex-col gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" data-testid="loader" />
      {message ? <span className="text-sm text-muted-foreground">{message}</span> : ""}
      <Link href={"/"}>Back to Home</Link>
    </div>
  );
};
