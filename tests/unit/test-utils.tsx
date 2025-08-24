import React from "react";
import { render } from "@testing-library/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient("https://dummy.convex.dev");

export const renderWithConvex = (ui: React.ReactElement) => {
  return render(<ConvexProvider client={convex}>{ui}</ConvexProvider>);
};
