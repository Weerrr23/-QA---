import { Page } from '@playwright/test';
import * as path from 'path';

// Страница загрузки файлов
export class UploadPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('/upload');
  }

  async uploadFile(filePath: string) {
    await this.page.setInputFiles('#file-upload', path.resolve(filePath));
    await this.page.click('#file-submit');
  }

  async clickUploadEmpty() {
    await this.page.click('#file-submit');
  }
}
