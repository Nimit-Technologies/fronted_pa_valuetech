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

    expect(screen.getByDisplayValue("BANK-12345")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rahul Sharma")).toBeInTheDocument();
    expect(screen.getByDisplayValue("9876543210")).toBeInTheDocument();
    expect(screen.getByText("Address as per initiation")).toBeInTheDocument();
    expect(screen.getByText("Address as per site")).toBeInTheDocument();
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
  });

  it("shows case info and the initiation address as read-only", async () => {
    const user = userEvent.setup();
    render(<Section1 task={task} />);

    for (const value of ["BANK-12345", "Rahul Sharma", "9876543210"]) {
      const input = screen.getByDisplayValue(value);
      expect(input).toHaveAttribute("readonly");
      await user.type(input, "X");
      expect(input).toHaveValue(value);
    }

    // First "Noida" is the initiation block, second is the site block.
    const [initiationCity, siteCity] = screen.getAllByDisplayValue("Noida");
    expect(initiationCity).toHaveAttribute("readonly");
    expect(siteCity).not.toHaveAttribute("readonly");
  });

  it("shows a saved report's case info, still read-only", () => {
    render(
      <Section1
        task={task}
        initialData={{ caseInfo: { file_number: "SAVED-1" } }}
      />,
    );

    expect(screen.getByDisplayValue("SAVED-1")).toHaveAttribute("readonly");
    expect(screen.getByDisplayValue("Rahul Sharma")).toHaveAttribute(
      "readonly",
    );
  });

  it("pre-checks 'same as initiation' and pre-fills the site address", () => {
    render(<Section1 task={task} />);

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
    expect(screen.getAllByDisplayValue("MG Road")).toHaveLength(2);
  });

  it("clears the site address when unchecked, keeping the initiation one", async () => {
    const user = userEvent.setup();
    const ref = { current: null };
    render(<Section1 ref={ref} task={task} />);

    await user.click(screen.getByRole("checkbox"));

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    // Only the initiation block still holds the values.
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(1);
    expect(screen.getAllByDisplayValue("MG Road")).toHaveLength(1);
    expect(ref.current.getData().addressAsPerSite).toEqual({
      city: "",
      district: "",
      state: "",
      pin_code: "",
      country: "",
      lane: "",
      landmark: "",
    });
    expect(ref.current.getData().sameAsInitiation).toBe(false);
  });

  it("re-fills the site address from initiation when checked again", async () => {
    const user = userEvent.setup();
    render(<Section1 task={task} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(screen.getAllByDisplayValue("Noida")).toHaveLength(2);
  });

  it("lets the engineer type a site address after unchecking", async () => {
    const user = userEvent.setup();
    render(<Section1 task={task} />);

    await user.click(screen.getByRole("checkbox"));
    const siteCity = screen
      .getByText("Address as per site")
      .closest(".space-y-6")
      .querySelector("input:not([type=checkbox])");
    await user.type(siteCity, "Greater Noida");

    expect(screen.getByDisplayValue("Noida")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Greater Noida")).toBeInTheDocument();
  });

  it("keeps a saved draft's own site address on load when it was unchecked", () => {
    render(
      <Section1
        task={task}
        initialData={{
          sameAsInitiation: false,
          addressAsPerSite: { city: "Site City" },
        }}
      />,
    );

    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByDisplayValue("Site City")).toBeInTheDocument();
  });
});
