import { test, expect } from "@playwright/test";

// Logout and session expiry, in two layers.
//
// The stubbed tests below cover the half that is the frontend's own: given the
// API says the session is over, does the app actually end it and get the user
// back to login? That is where the bugs live, and it runs with no backend.
//
// What a stub cannot prove is the handoff — that a real expired or cleared
// cookie makes a real server answer 401. Those tests are at the bottom and run
// only against E2E_BASE_URL, because asserting it against a stub would just be
// asserting the answer we wrote ourselves.

const user = {
  employee_id: "emp12345",
  first_name: "arun",
  role: { name: "super admin" },
};

const stubJson = (page, pattern, status, body) =>
  page.route(pattern, (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    }),
  );

const signIn = async (page) => {
  await page.getByPlaceholder("Enter your Employee Id").fill("emp12345");
  await page.getByPlaceholder("Enter your password").fill("correct");
  await page.getByRole("button", { name: "Login" }).click();
};

// Logout lives inside the account popover, so it has to be opened first.
const logOut = async (page) => {
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
};

test.describe("session handling (stubbed API)", () => {
  test("an expired session on load sends the user back to login", async ({
    page,
  }) => {
    await stubJson(page, "**/auth/login", 200, { success: true, data: user });
    await stubJson(page, "**/auth/session", 200, { success: true, data: user });

    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/super-admin");

    // The cookie has now expired as far as the API is concerned. A reload is
    // what a user does the next morning with the tab still open.
    await page.unroute("**/auth/session");
    await stubJson(page, "**/auth/session", 401, {
      success: false,
      message: "Unauthorized",
    });

    await page.reload();

    // useVerifySession must tear the session down rather than let the
    // persisted isAuthenticated hint keep rendering a dashboard whose every
    // request will fail.
    await expect(page).toHaveURL("/");
    await expect(page.getByPlaceholder("Enter your Employee Id")).toBeVisible();
  });

  test("a 401 from any call redirects to login", async ({ page }) => {
    await stubJson(page, "**/auth/login", 200, { success: true, data: user });
    await stubJson(page, "**/auth/session", 200, { success: true, data: user });

    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/super-admin");

    // Every data call now 401s, the way they would once the cookie lapses
    // mid-session. The interceptor should bounce the user once.
    await stubJson(page, "**/api/v1/**", 401, {
      success: false,
      message: "Unauthorized",
    });

    await page.goto("/super-admin/user");

    await expect(page).toHaveURL("/");
  });

  test("logout returns to login and does not leave a usable session", async ({
    page,
  }) => {
    await stubJson(page, "**/auth/login", 200, { success: true, data: user });
    await stubJson(page, "**/auth/session", 200, { success: true, data: user });
    await stubJson(page, "**/auth/logout", 200, { success: true });

    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/super-admin");

    await logOut(page);
    await expect(page).toHaveURL("/");

    // The persisted auth slice must not survive: going straight back to a
    // protected URL has to bounce rather than render from a stale hint.
    await page.goto("/super-admin");
    await expect(page).toHaveURL("/");
  });

  test("logout still signs the user out when the request fails", async ({
    page,
  }) => {
    await stubJson(page, "**/auth/login", 200, { success: true, data: user });
    await stubJson(page, "**/auth/session", 200, { success: true, data: user });
    await page.route("**/auth/logout", (route) => route.abort("failed"));

    await page.goto("/");
    await signIn(page);
    await expect(page).toHaveURL("/super-admin");

    await logOut(page);

    // The cookie is httpOnly so the client cannot clear it, but leaving
    // someone on a dashboard because the network blipped is worse than
    // signing them out locally and letting the cookie lapse.
    await expect(page).toHaveURL("/");
    await page.goto("/super-admin");
    await expect(page).toHaveURL("/");
  });
});

// Nothing is stubbed here: a real login against a real API, then the cookie is
// genuinely taken away. Skipped unless pointed at a deployed environment.
//
//   E2E_BASE_URL=https://staging.example.com \
//   E2E_EMPLOYEE_ID=... E2E_PASSWORD=... npx playwright test
const liveCredentials =
  process.env.E2E_BASE_URL &&
  process.env.E2E_EMPLOYEE_ID &&
  process.env.E2E_PASSWORD;

test.describe("session handling (live API)", () => {
  test.skip(
    !liveCredentials,
    "needs E2E_BASE_URL, E2E_EMPLOYEE_ID and E2E_PASSWORD",
  );

  test("a cleared cookie bounces the user to login", async ({
    page,
    context,
  }) => {
    await page.goto("/");
    await page
      .getByPlaceholder("Enter your Employee Id")
      .fill(process.env.E2E_EMPLOYEE_ID);
    await page
      .getByPlaceholder("Enter your password")
      .fill(process.env.E2E_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).not.toHaveURL("/");

    // Standing in for a 24-hour wait: the server now sees an anonymous
    // request and answers 401 on its own, which is the part a stub cannot do.
    await context.clearCookies();
    await page.reload();

    await expect(page).toHaveURL("/");
  });

  test("logout revokes the session server-side", async ({ page }) => {
    await page.goto("/");
    await page
      .getByPlaceholder("Enter your Employee Id")
      .fill(process.env.E2E_EMPLOYEE_ID);
    await page
      .getByPlaceholder("Enter your password")
      .fill(process.env.E2E_PASSWORD);
    await page.getByRole("button", { name: "Login" }).click();
    const dashboard = page.url();

    await logOut(page);
    await expect(page).toHaveURL("/");

    // The backend bumps token_version on logout, so even a token that
    // survived somewhere is dead. Going back must not restore the session.
    await page.goto(dashboard);
    await expect(page).toHaveURL("/");
  });
});
