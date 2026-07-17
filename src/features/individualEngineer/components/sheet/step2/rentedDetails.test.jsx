import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RentedDetails from "@/features/individualEngineer/components/sheet/step2/rentedDetails";

describe("RentedDetails (sheet step2)", () => {
  it("renders the section header and an editable input per item", () => {
    render(<RentedDetails data={["Tenant name", "rent payable"]} />);

    expect(
      screen.getByText("if rented, details of rented area & rent"),
    ).toBeInTheDocument();
    expect(screen.getByText("Tenant name")).toBeInTheDocument();
    expect(screen.getByText("rent payable")).toBeInTheDocument();

    const inputs = screen.getAllByDisplayValue("");
    expect(inputs).toHaveLength(2);
    inputs.forEach((input) => expect(input).not.toBeDisabled());
  });

  it("lets the user type into an item's input", async () => {
    const user = userEvent.setup();
    render(<RentedDetails data={["Tenant name", "rent payable"]} />);

    const [tenantInput] = screen.getAllByDisplayValue("");
    await user.type(tenantInput, "Ravi Kumar");

    expect(tenantInput).toHaveValue("Ravi Kumar");
  });

  it("renders nothing extra when data is not provided", () => {
    render(<RentedDetails />);
    expect(
      screen.getByText("if rented, details of rented area & rent"),
    ).toBeInTheDocument();
  });
});
