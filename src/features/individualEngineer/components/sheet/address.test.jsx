import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Address from "@/features/individualEngineer/components/sheet/address";

const address = {
  city: "Noida",
  district: "Gautam Budh Nagar",
  state: "Uttar Pradesh",
  pin_code: "201301",
  country: "India",
  lane: "MG Road",
  landmark: "Near City Mall",
};

describe("Address (sheet)", () => {
  it("renders the default label when none is given", () => {
    render(<Address address={address} />);
    expect(screen.getByText("Address as per initiation")).toBeInTheDocument();
  });

  it("renders a custom label", () => {
    render(<Address address={address} label="Address as per site" />);
    expect(screen.getByText("Address as per site")).toBeInTheDocument();
  });

  it("renders every address field as an editable input", () => {
    render(<Address address={address} />);

    expect(screen.getByDisplayValue("Noida")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Gautam Budh Nagar")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Uttar Pradesh")).not.toBeDisabled();
    expect(screen.getByDisplayValue("201301")).not.toBeDisabled();
    expect(screen.getByDisplayValue("India")).not.toBeDisabled();
    expect(screen.getByDisplayValue("MG Road")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Near City Mall")).not.toBeDisabled();
  });

  it("lets the user type into an address field", async () => {
    const user = userEvent.setup();
    render(<Address address={address} />);

    const cityInput = screen.getByDisplayValue("Noida");
    await user.clear(cityInput);
    await user.type(cityInput, "Delhi");

    expect(cityInput).toHaveValue("Delhi");
  });

  it("renders blank fields when address is not provided", () => {
    render(<Address />);
    expect(screen.getByText("Address as per initiation")).toBeInTheDocument();
  });
});
