import { test, expect } from "@playwright/test";

// Every API call is stubbed, so these run without a backend or a database.
// What is under test is the frontend's own auth plumbing: the route guard, the
// role-based destination after login, and the failure path.

const superAdmin = {
  employee_id: "emp12345",
  first_name: "arun",
  // Masked, exactly as the API returns it.
  aadhaar_number: "XXXXXXXX9015",
  role: { name: "super admin" },
  branch: { name: "noida" },
};

const stubLogin = (page, user) =>
  page.route("**/auth/login", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: user }),
    }),
  );

// useVerifySession refetches the authoritative user on mount, so a signed-in
// page needs this too or the guard tears the session straight back down.
const stubSession = (page, user) =>
  page.route("**/auth/session", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: user }),
    }),
  );

const signIn = async (page, { id = "emp12345", password = "correct" } = {}) => {
  await page.getByPlaceholder("Enter your Employee Id").fill(id);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};

test.describe("route guard", () => {
  // The dashboards are guarded per role; only /super-admin was covered before,
  // so a guard dropped from any of the others would have gone unnoticed.
  for (const path of [
    "/super-admin",
    "/branch-admin",
    "/cordinator",
    "/engineer",
  ]) {
    test(`sends an unauthenticated visitor from ${path} to login`, async ({
      page,
    }) => {
      await page.goto(path);

      await expect(page).toHaveURL("/");
      await expect(
        page.getByPlaceholder("Enter your Employee Id"),
      ).toBeVisible();
    });
  }

  test("guards a nested route, not just the dashboard root", async ({
    page,
  }) => {
    await page.goto("/super-admin/user");

    await expect(page).toHaveURL("/");
  });
});

test.describe("login", () => {
  test("sends a super admin to their own dashboard", async ({ page }) => {
    await stubLogin(page, superAdmin);
    await stubSession(page, superAdmin);

    await page.goto("/");
    await signIn(page);

    await expect(page).toHaveURL("/super-admin");
  });

  test("sends an engineer to the engineer dashboard", async ({ page }) => {
    const engineer = { ...superAdmin, role: { name: "engineer" } };
    await stubLogin(page, engineer);
    await stubSession(page, engineer);

    await page.goto("/");
    await signIn(page);

    await expect(page).toHaveURL("/engineer");
  });

  test("shows the API's message and clears the password on bad credentials", async ({
    page,
  }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message: "Invalid employee id or password",
        }),
      }),
    );

    await page.goto("/");
    await signIn(page, { password: "wrong" });

    await expect(page.getByRole("alert")).toHaveText(
      "Invalid employee id or password",
    );
    // Still on the login screen: a 401 from /auth/login must not trip the
    // interceptor's redirect, which would reload the page and throw the
    // error message away before anyone could read it.
    await expect(page).toHaveURL("/");
    await expect(page.getByPlaceholder("Enter your password")).toHaveValue("");
  });

  test("surfaces the rate-limit message on 429", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          message:
            "Too many login attempts for this account. Please try again later.",
        }),
      }),
    );

    await page.goto("/");
    await signIn(page, { password: "wrong" });

    await expect(page.getByRole("alert")).toContainText(
      "Too many login attempts",
    );
  });
});
