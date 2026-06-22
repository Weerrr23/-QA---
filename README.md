# QA Middle Assignment

## Структура

```
/
├── README.md
├── postman/
│   ├── collection.json
│   └── environment.json
├── test-cases/
│   └── ui-test-cases.md
├── tests/
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   └── upload.spec.ts
│   ├── features/
│   │   ├── login.feature
│   │   └── upload.feature
│   └── pages/
│       ├── LoginPage.ts
│       └── UploadPage.ts
├── sql/
│   └── queries.sql
├── nosql/
│   └── mongodb-answer.md
└── diagrams/
    └── diagrams.md
```

---

## Запуск автотестов

Node.js 18+

```bash
npm install
npx playwright install chromium
npx playwright test
```

---

## Запуск Postman коллекции

```bash
npm install -g newman
newman run postman/collection.json -e postman/environment.json
```

---

## Что сделано

**Задание 1 — Postman:** 30 тест-кейсов, все 7 эндпоинтов, позитивные + негативные + граничные значения дат, assertions на каждый запрос.

**Задание 2 — UI тест-кейсы:** 15 тест-кейсов по трём страницам (/login, /upload, /dynamic_loading), применены EP, BVA и State Transition, найдено 2 бага.

**Задание 3 — Автотесты:** 7 тестов на Playwright, Page Object Model для login и upload, Gherkin для обеих страниц.

**Задание 4 — SQL:** 5 запросов на PostgreSQL с комментариями. NoSQL — письменный ответ по MongoDB.

**Задание 5 — Диаграммы:** BPMN с двумя исключениями, Sequence Diagram, State Transition — всё в Mermaid.

---

## Найденные баги

**BUG-001** — /login: форма отправляется с пустыми полями без клиентской валидации. Severity: Low.

**BUG-002** — /upload: нажатие Upload без файла возвращает 500 вместо понятного сообщения. Severity: Medium.

**BUG-003** — POST /booking принимает checkout раньше checkin без ошибки валидации. Severity: High.

**BUG-004** — POST /auth возвращает 200 при неверном пароле вместо 401. Severity: Medium.

---

## Что бы улучшил при наличии времени

- Добавить тесты для /dynamic_loading
- Вынести тестовые данные в отдельный fixtures файл и параметризовать негативные тесты
- Настроить GitHub Actions для автозапуска тестов на каждый push
- Подключить Allure Report для истории запусков
