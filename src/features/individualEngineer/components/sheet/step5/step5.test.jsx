import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step5Data from "@/features/individualEngineer/components/sheet/step5/step5";

describe("Step5Data (sheet step5)", () => {
  it("renders the section header and an editable input per item", () => {
    render(<Step5Data data={["internal finish", "external finish"]} />);

    expect(screen.getByText("miscellaneous")).toBeInTheDocument();
    expect(screen.getByText("internal finish")).toBeInTheDocument();
    expect(screen.getByText("external finish")).toBeInTheDocument();

    const inputs = screen.getAllByDisplayValue("");
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(input).not.toBeDisabled());
  });

  it("lets the user type into an item's input", async () => {
    const user = userEvent.setup();
    render(<Step5Data data={["internal finish", "external finish"]} />);

    const [internalFinishInput] = screen.getAllByDisplayValue("");
    await user.type(internalFinishInput, "Marble");

    expect(internalFinishInput).toHaveValue("Marble");
  });

  it("spans the last item full-width only when the item count is odd", () => {
    const { container: oddContainer } = render(
      <Step5Data data={["a", "b", "c"]} />,
    );
    expect(
      oddContainer.querySelectorAll('[class*="lg:col-span-3"]'),
    ).toHaveLength(1);

    const { container: evenContainer } = render(
      <Step5Data data={["a", "b"]} />,
    );
    expect(
      evenContainer.querySelectorAll('[class*="lg:col-span-3"]'),
    ).toHaveLength(0);
  });
});
