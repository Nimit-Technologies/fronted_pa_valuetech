import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Section1 from "@/features/individualEngineer/components/sheet/step1/section1";
import { renderWithRoute } from "@/test/renderWithRouter";

function renderForId(id) {
  return renderWithRoute(<Section1 />, {
    route: `/engineer/report/create/${id}`,
    path: "/engineer/report/create/:id",
  });
}

describe("Section1 (sheet step1)", () => {
  it("shows 'Case not found.' for an unknown id", () => {
    renderForId("does-not-exist");
    expect(screen.getByText("Case not found.")).toBeInTheDocument();
  });

  it("renders the matched case's details and both address blocks", () => {
    renderForId("case_0001");

    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).not.toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).not.toBeDisabled();
    expect(screen.getByText("Address as per initiation")).toBeInTheDocument();
    expect(screen.getByText("Address as per site")).toBeInTheDocument();
    // "Address as per site" starts blank; only "as per initiation" is pre-filled.
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(1);
  });

  it("auto-fills 'Address as per site' from 'Address as per initiation' only once the sync checkbox is checked", async () => {
    const user = userEvent.setup();
    renderForId("case_0001");

    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(1);

    // The initiation block's sync checkbox is visually hidden; the site
    // block's is the one the user actually interacts with (last in DOM order).
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[checkboxes.length - 1]);

    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
  });
});
