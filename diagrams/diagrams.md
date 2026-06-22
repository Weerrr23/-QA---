# Задание 5 — Диаграммы

## 1. BPMN — Создание бронирования

Happy path + 2 исключения: комната недоступна, оплата не прошла.

```mermaid
flowchart TD
    A([Начало]) --> B[Выбрать комнату и даты]
    B --> C{Комната доступна?}

    C -- Нет --> D[Показать сообщение о недоступности]
    D --> E([Конец — бронирование не создано])

    C -- Да --> F[Заполнить форму]
    F --> G[Создать бронирование со статусом pending]
    G --> H[Оплатить]

    H --> I{Оплата прошла?}

    I -- Нет --> J[Отменить бронирование, статус cancelled]
    J --> K[Уведомить пользователя об ошибке]
    K --> E

    I -- Да --> L[Подтвердить бронирование, статус confirmed]
    L --> M[Отправить email]
    M --> N([Конец — бронирование создано])
```

---

## 2. Sequence Diagram — Создание бронирования

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Database
    participant EmailService

    User->>Frontend: Заполняет форму
    Frontend->>API: POST /booking
    API->>Database: Проверить доступность комнаты
    Database-->>API: Комната свободна
    API->>Database: Создать бронирование (pending)
    Database-->>API: OK, id=42

    alt Оплата успешна
        API->>Database: Обновить статус на confirmed
        API->>EmailService: Отправить подтверждение
        API-->>Frontend: 200 OK
        Frontend-->>User: Бронирование подтверждено
    else Оплата не прошла
        API->>Database: Обновить статус на cancelled
        API-->>Frontend: 402 Payment Required
        Frontend-->>User: Ошибка оплаты
    end
```

---

## 3. State Transition — Статусы бронирования

```mermaid
stateDiagram-v2
    [*] --> pending : создание бронирования
    pending --> confirmed : оплата прошла
    pending --> cancelled : оплата не прошла / пользователь отменил
    confirmed --> cancelled : отмена до даты заезда
    confirmed --> completed : дата выезда прошла
    cancelled --> [*]
    completed --> [*]
```

### Какие переходы важно покрыть тестами

| Переход | Почему |
|---|---|
| pending → confirmed | основной позитивный сценарий |
| pending → cancelled | оплата не прошла — деньги не должны списаться |
| confirmed → cancelled | отмена после оплаты — нужна проверка возврата |
| confirmed → completed | автоматический переход — легко сломать |
| cancelled → pending | недопустимый переход — система не должна это разрешать |
| completed → любой | недопустимый переход — завершённую бронь нельзя изменить |
