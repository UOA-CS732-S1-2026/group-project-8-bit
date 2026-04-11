import { test } from "@playwright/test";

test("login and capture support overlay", async ({ page }) => {
  const username = "444";
  const password = "12345678";

  await page.goto("http://127.0.0.1:3000/login", {
    waitUntil: "networkidle",
  });

  await page.getByPlaceholder("LostScholar").fill(username);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForTimeout(1500);

  if (!page.url().includes("/game/mainHub")) {
    await page.goto("http://127.0.0.1:3000/register", {
      waitUntil: "networkidle",
    });
    await page.getByPlaceholder("LostScholar").fill(username);
    await page.getByPlaceholder("At least 8 characters").fill(password);
    await page.getByPlaceholder("Re-enter password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await page.waitForURL("**/game/mainHub", { timeout: 15000 });
  }

  await page.goto("http://127.0.0.1:3000/game/battle?debugSupport=1", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2500);

  await page.screenshot({
    path: "tmp/overlay-after-login.png",
    fullPage: true,
  });
});
