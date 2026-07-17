import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step6Data from "@/features/individualEngineer/components/sheet/step6/step6";

describe("Step6Data (sheet step6)", () => {
  it("renders the section header and an editable input per item", () => {
    render(
      <Step6Data
        data={[
          "negative remarks which affect the value of property",
          "positive remarks which affect the value of property",
        ]}
      />,
    );

    expect(screen.getByText("miscellaneous")).toBeInTheDocument();
    expect(
      screen.getByText("negative remarks which affect the value of property"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("positive remarks which affect the value of property"),
    ).toBeInTheDocument();

    const inputs = screen.getAllByDisplayValue("");
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(input).not.toBeDisabled());
  });

  it("lets the user type into an item's input", async () => {
    const user = userEvent.setup();
    render(
      <Step6Data
        data={[
          "negative remarks which affect the value of property",
          "positive remarks which affect the value of property",
        ]}
      />,
    );

    const [negativeInput] = screen.getAllByDisplayValue("");
    await user.type(negativeInput, "None observed");

    expect(negativeInput).toHaveValue("None observed");
  });

  it("spans the last item full-width only when the item count is odd", () => {
    const { container: oddContainer } = render(
      <Step6Data data={["a", "b", "c"]} />,
    );
    expect(
      oddContainer.querySelectorAll('[class*="lg:col-span-3"]'),
    ).toHaveLength(1);

    const { container: evenContainer } = render(
      <Step6Data data={["a", "b"]} />,
    );
    expect(
      evenContainer.querySelectorAll('[class*="lg:col-span-3"]'),
    ).toHaveLength(0);
  });
});
