import { test, expect } from "@playwright/test";

// Addressing: what the app does with a URL that is wrong, that belongs to
// another role, or that the user reached before they had a session. Every API
// call is stubbed, so these run without a backend.

const engineer = {
  employee_id: "emp12345",
  first_name: "arun",
  role: { name: "engineer" },
  branch: { name: "noida" },
};

const superAdmin = { ...engineer, role: { name: "super admin" } };

const stubAuth = async (page, user) => {
  // Registered first on purpose: Playwright matches route handlers in reverse
  // registration order, so this catch-all has to go down before the auth
  // routes below or it would answer the login call with an empty list.
  //
  // The dashboards fetch their lists on mount. Left unstubbed they hit a real
  // API — or nothing at all — and a 401 from one would redirect mid-assertion.
  await page.route("**/api/v1/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [], totalCount: 0 }),
    }),
  );

  for (const pattern of ["**/auth/login", "**/auth/session"]) {
    await page.route(pattern, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: user }),
      }),
    );
  }
};

const signIn = async (page) => {
  await page.getByLabel("Employee ID").fill("emp12345");
  await page.getByLabel("Password").fill("correct");
  await page.getByRole("button", { name: "Login" }).click();
};

test.describe("unknown addresses", () => {
  // Before the catch-all route existed, every one of these rendered the navbar
  // and footer around an empty page, which reads as a broken app.
  test("shows a 404 page for an unknown path, with a way out", async ({
    page,
  }) => {
    await page.goto("/no-such-page");

    await expect(
      page.getByRole("heading", { name: /this page doesn't exist/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Go to login" }).click();
    await expect(page).toHaveURL("/");
  });

  test("keeps the dashboard around a 404 inside it", async ({ page }) => {
    await stubAuth(page, engineer);
    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/engineer");

    await page.goto("/engineer/nothing-here");

    await expect(
      page.getByRole("heading", { name: /this page doesn't exist/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Go to dashboard" }),
    ).toBeVisible();
  });

  // Linked from the footer of every screen, and a dead link until it had a
  // route of its own.
  test("the footer's support link reaches a real page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /developer support/i }).click();

    await expect(
      page.getByRole("heading", { name: /developer support/i }),
    ).toBeVisible();
    // The support reference the user is asked to quote, which travels with
    // every API call as X-Client-Reference.
    await expect(page.getByText(/^PA-[2-9CFGHJKMPQRTVWXY]{8}$/)).toBeVisible();
  });
});

test.describe("another role's page", () => {
  test("redirects to the user's own dashboard, not a blank page", async ({
    page,
  }) => {
    await stubAuth(page, engineer);
    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/engineer");

    await page.goto("/super-admin/user");

    await expect(page).toHaveURL("/engineer");
  });
});

test.describe("deep links", () => {
  test("returns the user to the page they asked for after login", async ({
    page,
  }) => {
    await stubAuth(page, engineer);

    // The usual way in: a link to one case, opened cold with no session.
    await page.goto("/engineer/case/view/42");
    await expect(page).toHaveURL("/");

    await signIn(page);

    await expect(page).toHaveURL("/engineer/case/view/42");
  });

  test("forgets the deep link once it has been used", async ({ page }) => {
    await stubAuth(page, engineer);

    await page.goto("/engineer/case/view/42");
    await signIn(page);
    await expect(page).toHaveURL("/engineer/case/view/42");

    // Signing out and in again must start at the dashboard rather than replay
    // the previous session's last page.
    await page.getByRole("button", { name: "Account menu" }).click();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("/");

    await signIn(page);

    await expect(page).toHaveURL("/engineer");
  });

  // A remembered path is only a hint; the guard still decides. A super admin
  // logging in on a machine where an engineer deep-linked must not be carried
  // into the engineer's dashboard.
  test("still obeys the role guard on the remembered path", async ({
    page,
  }) => {
    await stubAuth(page, engineer);
    await page.goto("/engineer/case/view/42");
    await expect(page).toHaveURL("/");

    await page.unroute("**/auth/login");
    await page.unroute("**/auth/session");
    await stubAuth(page, superAdmin);

    await signIn(page);

    await expect(page).toHaveURL("/super-admin");
  });
});
