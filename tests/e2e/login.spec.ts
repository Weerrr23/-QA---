import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Тесты для страницы входа /login

test.describe('Form Authentication', () => {

  // Позитивные сценарии

  test('успешный вход с правильными данными', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    await expect(page).toHaveURL(/\/secure/);
  });

  test('успешный выход из системы', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');
    await expect(page).toHaveURL(/\/secure/);

    await loginPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  test('после входа показывается сообщение', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    const message = await loginPage.getFlashMessage();
    expect(message).toContain('You logged into a secure area!');
  });

  // Негативные сценарии

  test('неверный пароль показывает ошибку', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('tomsmith', 'wrongpassword');

    await expect(page).toHaveURL(/\/login/);

    const message = await loginPage.getFlashMessage();
    expect(message).toContain('Your password is invalid!');
  });

  test('пустые поля показывают ошибку', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('', '');

    await expect(page).toHaveURL(/\/login/);

    // TODO: хотелось бы чтобы валидация срабатывала на клиенте до отправки формы
    // но сейчас проверка только на сервере (BUG-001)
    const message = await loginPage.getFlashMessage();
    expect(message).toContain('Your username is invalid!');
  });

});
