import { test, expect } from "@playwright/test";
import { RegisterFormData, RegisterPage } from "./page-objects/register.page";

// Unique email per run so a real backend/DB doesn't reject the second
// test run with "already registered". If you point this at a real
// test database, this matters more than it looks like it does.
const validUser: RegisterFormData = {
  firstName: "Shifat",
  lastName: "Islam",
  email: `user_${Date.now()}@example.com`,
  password: "Str0ng!Pass1",
  role: "user",
  age: 25,
};

test.describe("Registration form", () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test("registers successfully with valid data", async ({ page }) => {
    await test.step("fill and submit", async () => {
      await registerPage.fill(validUser);
      await registerPage.submit();
    });

    await expect(page).toHaveURL(/\/(login|dashboard)/);
  });

  // One representative failure per validation rule — not every possible
  // bad string. The exhaustive combinations belong in the schema's own
  // unit tests (see register.schema.test.ts), which run in milliseconds
  // without a browser. Playwright's job is proving the UI actually wires
  // the schema's errors up to the screen, not re-proving the schema.
  const invalidCases: Array<{
    name: string;
    overrides: Partial<RegisterFormData>;
    field: keyof RegisterFormData;
    expectedMessage: RegExp;
  }> = [
    {
      name: "first name too short",
      overrides: { firstName: "A" },
      field: "firstName",
      expectedMessage: /at least 2 characters/i,
    },
    {
      name: "first name has digits",
      overrides: { firstName: "Sh1fat" },
      field: "firstName",
      expectedMessage: /only contain letters/i,
    },
    {
      name: "last name too short",
      overrides: { lastName: "B" },
      field: "lastName",
      expectedMessage: /at least 2 characters/i,
    },
    {
      name: "invalid email format",
      overrides: { email: "not-an-email" },
      field: "email",
      expectedMessage: /valid email/i,
    },
    {
      name: "password too short",
      overrides: { password: "Ab1!" },
      field: "password",
      expectedMessage: /at least 8 characters/i,
    },
    {
      name: "password missing uppercase",
      overrides: { password: "weakpass1!" },
      field: "password",
      expectedMessage: /uppercase/i,
    },
    {
      name: "password missing number",
      overrides: { password: "WeakPass!" },
      field: "password",
      expectedMessage: /number/i,
    },
    {
      name: "password missing special character",
      overrides: { password: "WeakPass1" },
      field: "password",
      expectedMessage: /special character/i,
    },
    {
      name: "age under 18",
      overrides: { age: 16 },
      field: "age",
      expectedMessage: /at least 18/i,
    },
    {
      name: "age over 100",
      overrides: { age: 150 },
      field: "age",
      expectedMessage: /valid age/i,
    },
    {
      name: "age not a whole number",
      overrides: { age: 21.5 },
      field: "age",
      expectedMessage: /whole number/i,
    },
  ];

  for (const { name, overrides, field, expectedMessage } of invalidCases) {
    test(`shows a validation error: ${name}`, async () => {
      await registerPage.fill({ ...validUser, ...overrides });
      await registerPage.submit();
      await expect(registerPage.errorFor(field)).toHaveText(expectedMessage);
    });
  }

  test("shows an error when no role is selected", async () => {
    const { role, ...rest } = validUser;
    await registerPage.fill(rest);
    await registerPage.submit();
    await expect(registerPage.errorFor("role")).toHaveText(/select a role/i);
  });
});

test.describe("Registration form — server integration", () => {
  // These mock the API response so the test doesn't depend on backend
  // state (an account that happens to already exist, rate limits, etc.)
  test("surfaces a server error when the email is already taken", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await page.route("**/api/auth/register", (route) =>
      route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ message: "Email already registered" }),
      }),
    );

    await registerPage.fill(validUser);
    await registerPage.submit();

    await expect(page.getByText(/email already registered/i)).toBeVisible();
  });

  test("disables the submit button while the request is pending", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await page.route("**/api/auth/register", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({ status: 201, body: "{}" });
    });

    await registerPage.fill(validUser);
    await registerPage.submit();

    await expect(registerPage.submitButton).toBeDisabled();
  });
});
