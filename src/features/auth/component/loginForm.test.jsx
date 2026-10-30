import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import authReducer from "@/features/auth/slice/authSlice";
import LoginForm from "@/features/auth/component/loginForm";
import { login as loginRequest } from "@/features/auth/services";
import { rememberReturnTo } from "@/features/auth/returnTo";
import { renderWithStore } from "@/test/renderWithStore";

vi.mock("@/features/auth/services", () => ({
  login: vi.fn(),
  logout: vi.fn(),
  session: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// The destinations are rendered as routes rather than asserted on a mocked
// navigate, so the test fails the same way a user would see it fail: on the
// wrong screen.
const renderLogin = () =>
  renderWithStore(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/engineer" element={<p>Engineer dashboard</p>} />
        <Route
          path="/engineer/case/view/:id"
          element={<p>Engineer case detail</p>}
        />
      </Routes>
    </MemoryRouter>,
    { reducer: { auth: authReducer } },
  );

const signIn = async (user) => {
  await user.type(screen.getByLabelText("Employee ID"), "emp1");
  await user.type(screen.getByLabelText("Password"), "correct");
  await user.click(screen.getByRole("button", { name: "Login" }));
};

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
    loginRequest.mockResolvedValue({
      success: true,
      data: { employee_id: "emp1", role: { name: "engineer" } },
    });
  });

  it("lands on the role's dashboard when there is nowhere to return to", async () => {
    const user = userEvent.setup();
    renderLogin();

    await signIn(user);

    expect(await screen.findByText("Engineer dashboard")).toBeInTheDocument();
  });

  it("returns the user to the page they were trying to reach", async () => {
    const user = userEvent.setup();
    rememberReturnTo("/engineer/case/view/42");
    renderLogin();

    await signIn(user);

    expect(await screen.findByText("Engineer case detail")).toBeInTheDocument();
  });

  it("uses a remembered path once, not on the next login too", async () => {
    const user = userEvent.setup();
    rememberReturnTo("/engineer/case/view/42");
    const first = renderLogin();

    await signIn(user);
    expect(await screen.findByText("Engineer case detail")).toBeInTheDocument();
    first.unmount();

    renderLogin();
    await signIn(user);

    expect(await screen.findByText("Engineer dashboard")).toBeInTheDocument();
  });

  // Password managers fill the wrong field, or nothing at all, without these.
  it("tells a password manager what the fields are", () => {
    renderLogin();

    expect(screen.getByLabelText("Employee ID")).toHaveAttribute(
      "autocomplete",
      "username",
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
  });

  // getByLabelText above only resolves because each label is tied to its
  // input, which is also what a screen reader needs.
  it("ties every label to its field", () => {
    renderLogin();

    expect(screen.getByLabelText("Employee ID")).toHaveAttribute(
      "id",
      "employee_id",
    );
    expect(screen.getByLabelText("Password")).toHaveAttribute("id", "password");
  });

  it("clears and refocuses the password after a rejected login", async () => {
    const user = userEvent.setup();
    loginRequest.mockRejectedValue(
      Object.assign(new Error("Request failed with status code 401"), {
        isAxiosError: true,
        response: {
          status: 401,
          data: { message: "Invalid employee ID or password" },
        },
      }),
    );
    renderLogin();

    await signIn(user);

    const password = screen.getByLabelText("Password");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid employee ID or password",
    );
    expect(password).toHaveValue("");
    expect(password).toHaveFocus();
    // The employee id is kept: retyping it is pure friction, and it is not
    // the secret.
    expect(screen.getByLabelText("Employee ID")).toHaveValue("emp1");
  });
});
