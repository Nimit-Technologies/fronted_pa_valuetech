import { test, expect } from "@playwright/test";

test.describe("Super admin dashboard", () => {
  test("redirects unauthenticated visitors from /super-admin to login", async ({
    page,
  }) => {
    await page.goto("/super-admin");

    await expect(page).toHaveURL("/");
    await expect(page.getByPlaceholder("Enter your Employee Id")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
  });

  test("shows a validation-ready login form on the landing page", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});
