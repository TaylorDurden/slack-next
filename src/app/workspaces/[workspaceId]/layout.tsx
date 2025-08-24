import React from "react";
import { ToolBar } from "./toolbar";
import { SideBar } from "./sidebar";

const WorkspaceIdPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <ToolBar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {children}
      </div>
    </div>
  );
};

export default WorkspaceIdPageLayout;
