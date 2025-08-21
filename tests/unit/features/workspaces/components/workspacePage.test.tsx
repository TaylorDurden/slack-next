import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useRouter } from "next/navigation";

// Mock the workspace page component
const MockWorkspacePage = ({ params }: { params: { workspaceId: string } }) => {
  const router = useRouter();
  const workspaces = [
    { _id: "workspace123", name: "Test Workspace", userId: "user1", joinCode: "ABC123" },
    { _id: "workspace456", name: "Another Workspace", userId: "user1", joinCode: "DEF456" },
  ];

  const currentWorkspace = workspaces.find((workspace) => workspace._id === params.workspaceId);

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Workspace not found</h1>
          <p className="text-gray-600 mb-4">The workspace you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{currentWorkspace.name}</h1>
          <p className="text-gray-600 mt-2">Workspace ID: {currentWorkspace._id}</p>
          <p className="text-gray-600">Join Code: {currentWorkspace.joinCode}</p>
        </header>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Workspace Overview</h2>
          <p className="text-gray-600">
            Welcome to your workspace! This is where you&apos;ll be able to collaborate with your team.
          </p>
          <p className="text-gray-600 mt-2">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
};

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("WorkspacePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display workspace information for valid workspace", () => {
    render(<MockWorkspacePage params={{ workspaceId: "workspace123" }} />);

    expect(screen.getByText("Test Workspace")).toBeInTheDocument();
    expect(screen.getByText("Workspace ID: workspace123")).toBeInTheDocument();
    expect(screen.getByText("Join Code: ABC123")).toBeInTheDocument();
    expect(screen.getByText("Workspace Overview")).toBeInTheDocument();
    expect(screen.getByText(/Welcome to your workspace!/)).toBeInTheDocument();
  });

  it("should display workspace not found for invalid workspace", () => {
    render(<MockWorkspacePage params={{ workspaceId: "nonexistent" }} />);

    expect(screen.getByText("Workspace not found")).toBeInTheDocument();
    expect(screen.getByText("The workspace you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go back home" })).toBeInTheDocument();
  });

  it("should navigate to home when go back button is clicked", () => {
    render(<MockWorkspacePage params={{ workspaceId: "nonexistent" }} />);

    const goBackButton = screen.getByRole("button", { name: "Go back home" });
    fireEvent.click(goBackButton);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("should display correct workspace for different workspace ID", () => {
    render(<MockWorkspacePage params={{ workspaceId: "workspace456" }} />);

    expect(screen.getByText("Another Workspace")).toBeInTheDocument();
    expect(screen.getByText("Workspace ID: workspace456")).toBeInTheDocument();
    expect(screen.getByText("Join Code: DEF456")).toBeInTheDocument();
  });

  it("should have proper styling classes", () => {
    render(<MockWorkspacePage params={{ workspaceId: "workspace123" }} />);

    // Find the outer container div
    const container = screen.getByText("Test Workspace").closest("div")?.parentElement;
    expect(container).toHaveClass("p-6");

    const header = screen.getByText("Test Workspace").closest("header");
    expect(header).toHaveClass("mb-8");

    const title = screen.getByText("Test Workspace");
    expect(title).toHaveClass("text-3xl", "font-bold", "text-gray-900");
  });

  it("should have accessible button in error state", () => {
    render(<MockWorkspacePage params={{ workspaceId: "nonexistent" }} />);

    const goBackButton = screen.getByRole("button", { name: "Go back home" });
    expect(goBackButton).toBeInTheDocument();
    expect(goBackButton).toHaveClass("px-4", "py-2", "bg-blue-500", "text-white", "rounded");
  });
});
