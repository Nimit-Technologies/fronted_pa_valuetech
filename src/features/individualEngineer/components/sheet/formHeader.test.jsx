import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormHeader from "@/features/individualEngineer/components/sheet/formHeader";

describe("FormHeader", () => {
  it("renders its children as the heading text", () => {
    render(<FormHeader>Type of colony</FormHeader>);
    expect(
      screen.getByRole("heading", { name: "Type of colony" }),
    ).toBeInTheDocument();
  });
});
