import { Page } from '@playwright/test';

// Страница логина - храним здесь все элементы чтобы не дублировать в тестах
export class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }

  async getFlashMessage() {
    await this.page.waitForSelector('#flash');
    return this.page.locator('#flash').innerText();
  }

  async logout() {
    await this.page.click('a.button.secondary');
  }
}
