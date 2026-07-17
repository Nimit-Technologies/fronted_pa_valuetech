import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Coverage from "@/features/individualEngineer/components/sheet/step3/coverage";

describe("Coverage (sheet step3)", () => {
  it("renders the section header and an editable input per item", () => {
    render(<Coverage data={["east", "west", "north"]} />);

    expect(screen.getByText("How it cover on (Direction)")).toBeInTheDocument();
    expect(screen.getByText("east")).toBeInTheDocument();
    expect(screen.getByText("west")).toBeInTheDocument();
    expect(screen.getByText("north")).toBeInTheDocument();

    const inputs = screen.getAllByDisplayValue("");
    expect(inputs).toHaveLength(3);
    inputs.forEach((input) => expect(input).not.toBeDisabled());
  });

  it("lets the user type into an item's input", async () => {
    const user = userEvent.setup();
    render(<Coverage data={["east", "west", "north"]} />);

    const [eastInput] = screen.getAllByDisplayValue("");
    await user.type(eastInput, "Main road");

    expect(eastInput).toHaveValue("Main road");
  });

  it("spans the last item full-width only when the item count is odd", () => {
    const { container: oddContainer } = render(
      <Coverage data={["east", "west", "north"]} />,
    );
    expect(
      oddContainer.querySelectorAll('[class*="lg:col-span-2"]'),
    ).toHaveLength(1);

    const { container: evenContainer } = render(
      <Coverage data={["east", "west"]} />,
    );
    expect(
      evenContainer.querySelectorAll('[class*="lg:col-span-2"]'),
    ).toHaveLength(0);
  });
});
