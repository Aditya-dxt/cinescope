import { test, expect } from "@playwright/test";

test("primary flow: home search + chat streaming + tool demo", async ({ page }) => {
  // Home loads (header logo by text)
  await page.goto("/");
  await expect(page.getByText(/CineScope/i).first()).toBeVisible();

  // Chat primary flow
  await page.goto("/chat");
  await expect(page.getByLabel("Message")).toBeVisible();
  const input = page.getByLabel("Message");
  const send = page.getByRole("button", { name: /^Send$/i });
  await expect(send).toBeDisabled();
  await input.fill("cozy thriller");
  await expect(send).toBeEnabled();
  await send.click();
  await expect(page.getByText("cozy thriller")).toBeVisible({ timeout: 3000 });
  // streaming produces assistant content or thinking/stop
  await expect(page.getByText(/You|thinking|Stop/i).first()).toBeVisible({ timeout: 3000 });

  // Tool result demo present
  await expect(page.getByText(/Demo: lookup/i).first()).toBeVisible();
});
