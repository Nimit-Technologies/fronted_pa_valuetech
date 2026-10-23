import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Section1 from "@/features/individualEngineer/components/sheet/step1/section1";

const task = {
  task_id: "allocation_0001",
  file_number: "BANK-12345",
  customer_name: "Rahul Sharma",
  customer_contact_number: "9876543210",
  address: {
    city: "Noida",
    district: "Gautam Budh Nagar",
    state: "Uttar Pradesh",
    pin_code: "201301",
    country: "India",
    lane: "MG Road",
    landmark: "Near City Mall",
  },
};

describe("Section1 (sheet step1)", () => {
  it("shows 'Task not found.' when the task is missing", () => {
    render(<Section1 />);
    expect(screen.getByText("Task not found.")).toBeInTheDocument();
  });

  it("renders the selected task's details and pre-fills both address blocks", () => {
    render(<Section1 task={task} />);

    expect(screen.getByDisplayValue("BANK-12345")).not.toBeDisabled();
    expect(screen.getByDisplayValue("Rahul Sharma")).not.toBeDisabled();
    expect(screen.getByDisplayValue("9876543210")).not.toBeDisabled();
    expect(screen.getByText("Address as per initiation")).toBeInTheDocument();
    expect(screen.getByText("Address as per site")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
  });

  it("keeps both address blocks synchronized until the checkbox is unchecked", async () => {
    const user = userEvent.setup();
    render(<Section1 task={task} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[checkboxes.length - 1]);
    const siteCity = screen.getAllByDisplayValue("Noida")[1];
    await user.clear(siteCity);
    await user.type(siteCity, "Greater Noida");

    expect(screen.getByDisplayValue("Noida")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Greater Noida")).toBeInTheDocument();
  });
});
