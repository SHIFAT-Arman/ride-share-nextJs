import { type Page, type Locator } from "@playwright/test";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  age: string | number;
};

/**
 * Page Object for /register.
 * Keep all knowledge of the DOM in this one place — if a label or
 * button text changes, you fix it here instead of in every test.
 */
export class RegisterPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly role: Locator;
  readonly age: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // getByLabel/getByRole tie the test to what a user actually sees,
    // not to CSS classes or DOM structure that can change freely.
    this.firstName = page.getByLabel("First name");
    this.lastName = page.getByLabel("Last name");
    this.email = page.getByLabel("Email");
    this.password = page.getByLabel("Password");
    this.role = page.getByLabel("Role");
    this.age = page.getByLabel("Age");
    this.submitButton = page.getByRole("button", { name: /register|sign up/i });
  }

  async goto() {
    await this.page.goto("/register");
  }

  async fill(data: Partial<RegisterFormData>) {
    if (data.firstName !== undefined) await this.firstName.fill(data.firstName);
    if (data.lastName !== undefined) await this.lastName.fill(data.lastName);
    if (data.email !== undefined) await this.email.fill(data.email);
    if (data.password !== undefined) await this.password.fill(data.password);
    if (data.role !== undefined) await this.role.selectOption(data.role);
    if (data.age !== undefined) await this.age.fill(String(data.age));
  }

  async submit() {
    await this.submitButton.click();
  }

  /**
   * Error message for a given field. This assumes each error is rendered
   * with something like <p data-testid="error-firstName">...</p>.
   * data-testid is the right tool here specifically because an error
   * message has no natural accessible role/label of its own — pair it
   * with aria-describedby on the input for real accessibility too.
   */
  errorFor(field: keyof RegisterFormData): Locator {
    return this.page.getByTestId(`error-${field}`);
  }
}
