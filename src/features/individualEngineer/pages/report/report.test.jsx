import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Report from "@/features/individualEngineer/pages/report/report";
import { renderWithRoute } from "@/test/renderWithRouter";

function renderForId(id) {
  return renderWithRoute(<Report />, {
    route: `/engineer/report/create/${id}`,
    path: "/engineer/report/create/:id",
  });
}

describe("Report (wizard page)", () => {
  it("shows one step at a time and advances through the wizard on Next", async () => {
    const user = userEvent.setup();
    renderForId("case_0001");

    // Step1 is visible; Step2 stays mounted (to preserve its state) but hidden.
    expect(screen.getByText(/page 1 of 7/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
    expect(
      screen.getByText("Type of colony").closest(".hidden"),
    ).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step2
    expect(screen.getByText("Type of colony").closest(".hidden")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step3
    expect(screen.getByText("Property Usage")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step4
    expect(screen.getByText("Floor wise : Built up area")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step5
    expect(screen.getByText("landmark")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step6
    expect(
      screen.getByText("negative remarks which affect the value of property"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next" }));
    // Step7 - last step shows a Submit button instead of Next
    expect(screen.getByText(/page 7 of 7/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("preserves earlier steps' values and logs every step's data on submit", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    renderForId("case_0001");

    // Edit a Step1 field, then navigate all the way to the last step.
    const fileNumberInput = screen.getByDisplayValue("BANK-12345");
    await user.clear(fileNumberInput);
    await user.type(fileNumberInput, "BANK-99999");

    for (let i = 0; i < 6; i++) {
      await user.click(screen.getByRole("button", { name: "Next" }));
    }

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Report submitted:",
      expect.objectContaining({
        step1: expect.objectContaining({
          caseInfo: expect.objectContaining({ file_number: "BANK-99999" }),
        }),
        step7: expect.objectContaining({
          requiredPhotos: expect.any(Object),
          additionalPhotos: expect.any(Array),
        }),
      }),
    );

    consoleSpy.mockRestore();
  });
});
