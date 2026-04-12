# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tmp\overlay.spec.ts >> login and capture support overlay
- Location: tmp\overlay.spec.ts:3:5

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/game/mainHub" until "load"
============================================================
```

# Page snapshot

```yaml
- main [ref=e5]:
  - generic [ref=e6]:
    - navigation [ref=e7]:
      - link "Oracle The Oracle of Lost Knowledge" [ref=e8] [cursor=pointer]:
        - /url: /
        - generic [ref=e9]: Oracle
        - generic [ref=e10]: The Oracle of Lost Knowledge
      - generic [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /
        - link "Login" [ref=e13] [cursor=pointer]:
          - /url: /login
        - link "Register" [ref=e14] [cursor=pointer]:
          - /url: /register
    - generic [ref=e15]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - paragraph [ref=e21]: Quiz RPG MVP
            - img "The Oracle of Lost Knowledge" [ref=e23]
          - generic [ref=e24]:
            - heading "Begin your journey into the archive" [level=1] [ref=e25]
            - paragraph [ref=e26]: Create a persistent account so your player identity, inventory, and progress survive beyond a single browser session.
          - generic [ref=e27]:
            - generic [ref=e28]: Persistent identity backed by PostgreSQL
            - generic [ref=e29]: Session-based login across refreshes
            - generic [ref=e30]: Player progress synced into the game store
        - generic [ref=e32]: Create an account to preserve your character and progress.
      - complementary [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]:
            - paragraph [ref=e36]: Register
            - heading "Create your adventurer" [level=2] [ref=e37]
            - paragraph [ref=e38]: Your username becomes the initial player identity until character setup is expanded.
          - generic [ref=e39]:
            - generic [ref=e40]:
              - text: Username
              - textbox "Username" [ref=e41]:
                - /placeholder: LostScholar
            - generic [ref=e42]:
              - text: Password
              - textbox "Password" [ref=e43]:
                - /placeholder: At least 8 characters
            - generic [ref=e44]:
              - text: Confirm Password
              - textbox "Confirm Password" [ref=e45]:
                - /placeholder: Re-enter password
            - button "Create Account" [ref=e46]
          - paragraph [ref=e47]:
            - text: Already registered?
            - link "Log in here" [ref=e48] [cursor=pointer]:
              - /url: /login
```

# Test source

```ts
  1  | import { test } from "@playwright/test";
  2  | 
  3  | test("login and capture support overlay", async ({ page }) => {
  4  |   const username = "444";
  5  |   const password = "12345678";
  6  | 
  7  |   await page.goto("http://127.0.0.1:3000/login", {
  8  |     waitUntil: "networkidle",
  9  |   });
  10 | 
  11 |   await page.getByPlaceholder("LostScholar").fill(username);
  12 |   await page.getByPlaceholder("Enter your password").fill(password);
  13 |   await page.getByRole("button", { name: "Login" }).click();
  14 | 
  15 |   await page.waitForTimeout(1500);
  16 | 
  17 |   if (!page.url().includes("/game/mainHub")) {
  18 |     await page.goto("http://127.0.0.1:3000/register", {
  19 |       waitUntil: "networkidle",
  20 |     });
  21 |     await page.getByPlaceholder("LostScholar").fill(username);
  22 |     await page.getByPlaceholder("At least 8 characters").fill(password);
  23 |     await page.getByPlaceholder("Re-enter password").fill(password);
  24 |     await page.getByRole("button", { name: "Create Account" }).click();
> 25 |     await page.waitForURL("**/game/mainHub", { timeout: 15000 });
     |                ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  26 |   }
  27 | 
  28 |   await page.goto("http://127.0.0.1:3000/game/battle?debugSupport=1", {
  29 |     waitUntil: "networkidle",
  30 |   });
  31 |   await page.waitForTimeout(2500);
  32 | 
  33 |   await page.screenshot({
  34 |     path: "tmp/overlay-after-login.png",
  35 |     fullPage: true,
  36 |   });
  37 | });
  38 | 
```