import { test, expect } from "@playwright/test";

test("homepage opens", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/PA ValueTech - Admin Portal/i);
});
