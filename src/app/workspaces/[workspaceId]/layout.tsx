"use client";
import React from "react";
import { ToolBar } from "./toolbar";
import { SideBar } from "./sidebar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { WorkspaceSidebar } from "./workspaceSidebar";

const WorkspaceIdPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <ToolBar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        <ResizablePanelGroup autoSaveId="rpg-workspace-layout" direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={11} maxSize={40} className="bg-[#5E2C5F]">
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={50}>{children}</ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceIdPageLayout;
