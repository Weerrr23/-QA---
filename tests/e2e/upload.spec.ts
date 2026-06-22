import { test, expect } from '@playwright/test';
import { UploadPage } from '../pages/UploadPage';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// Тесты для страницы загрузки файлов /upload

test.describe('File Upload', () => {

  test('успешная загрузка текстового файла', async ({ page }) => {
    const uploadPage = new UploadPage(page);

    // Создаём временный файл для теста
    const filePath = path.join(os.tmpdir(), 'test-file.txt');
    fs.writeFileSync(filePath, 'test content');

    await uploadPage.open();
    await uploadPage.uploadFile(filePath);

    // Проверяем что файл загрузился
    await expect(page.locator('h3')).toContainText('File Uploaded!');
    await expect(page.locator('#uploaded-files')).toContainText('test-file.txt');

    fs.unlinkSync(filePath);
  });

  // Негативный сценарий - BUG-002
  test('загрузка без файла возвращает ошибку', async ({ page }) => {
    const uploadPage = new UploadPage(page);

    await uploadPage.open();
    await uploadPage.clickUploadEmpty();

    // Сервер возвращает 500 - это баг, должно быть понятное сообщение об ошибке
    await expect(page.locator('body')).toContainText('Internal Server Error');
  });

});
