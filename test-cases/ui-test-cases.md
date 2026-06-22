# Задание 2 — UI тест-кейсы

## Выбранные страницы

| Страница | URL | Почему выбрал |
|---|---|---|
| Form Authentication | /login | Базовая авторизация — без неё ничего не работает |
| File Upload | /upload | Интересные граничные значения по файлам |
| Dynamic Loading | /dynamic_loading/1 | Асинхронное поведение — частый источник багов |

---

## Техники тест-дизайна

**Equivalence Partitioning (EP)** — применил на /login и /upload. Суть в том, что все возможные значения делятся на группы где поведение одинаковое. Например для логина: верные данные, неверный пароль, неверный логин, пустые поля — это четыре разных класса, достаточно проверить по одному представителю каждого.

**Boundary Value Analysis (BVA)** — применил на /upload для длины имени файла. Ошибки чаще всего на границах, поэтому проверяю имя файла ровно в 255 символов.

**State Transition** — применил на /dynamic_loading. Страница имеет три чётких состояния: ничего не происходит → идёт загрузка → загрузка завершена. Проверяю каждый переход.

---

## Form Authentication (/login)

### TC-LOGIN-001
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-001 |
| **Title** | Успешный вход с правильными данными |
| **Priority** | High |
| **Preconditions** | Открыта страница /login, пользователь не авторизован |
| **Steps** | 1. Ввести username: tomsmith 2. Ввести password: SuperSecretPassword! 3. Нажать Login |
| **Expected result** | Редирект на /secure, зелёное сообщение «You logged into a secure area!», кнопка Logout видна |
| **Actual result** | Редирект на /secure, сообщение отображается, кнопка Logout есть |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «валидные данные» |

### TC-LOGIN-002
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-002 |
| **Title** | Вход с неверным паролем |
| **Priority** | High |
| **Preconditions** | Открыта страница /login |
| **Steps** | 1. Ввести username: tomsmith 2. Ввести password: wrongpassword 3. Нажать Login |
| **Expected result** | Остаётся на /login, красное сообщение «Your password is invalid!» |
| **Actual result** | Остаётся на /login, сообщение отображается |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «неверный пароль» |

### TC-LOGIN-003
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-003 |
| **Title** | Вход с неверным логином |
| **Priority** | High |
| **Preconditions** | Открыта страница /login |
| **Steps** | 1. Ввести username: wronguser 2. Ввести password: SuperSecretPassword! 3. Нажать Login |
| **Expected result** | Остаётся на /login, сообщение «Your username is invalid!» |
| **Actual result** | Остаётся на /login, сообщение отображается |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «неверный логин» |

### TC-LOGIN-004
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-004 |
| **Title** | Отправка формы с пустыми полями |
| **Priority** | High |
| **Preconditions** | Открыта страница /login, поля пустые |
| **Steps** | 1. Не заполнять поля 2. Нажать Login |
| **Expected result** | Форма не отправляется, браузер показывает «заполните поле» |
| **Actual result** | Форма отправляется на сервер, приходит ответ «Your username is invalid!» — нет клиентской валидации |
| **Status** | ✅ Pass (с замечанием — BUG-001) |
| **Техника** | EP — класс «пустые значения» |

### TC-LOGIN-005
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-005 |
| **Title** | Выход из системы |
| **Priority** | High |
| **Preconditions** | Пользователь авторизован (выполнен TC-LOGIN-001) |
| **Steps** | 1. Нажать кнопку Logout |
| **Expected result** | Редирект на /login, сообщение «You logged out of the secure area!», повторный переход на /secure требует входа |
| **Actual result** | Всё работает как ожидается |
| **Status** | ✅ Pass |
| **Техника** | State Transition — переход «авторизован → не авторизован» |

### TC-LOGIN-006
| Поле | Значение |
|---|---|
| **Test ID** | TC-LOGIN-006 |
| **Title** | Пробелы вместо логина и пароля |
| **Priority** | Medium |
| **Preconditions** | Открыта страница /login |
| **Steps** | 1. Ввести в username три пробела 2. Ввести в password три пробела 3. Нажать Login |
| **Expected result** | Вход не выполняется, показывается сообщение об ошибке |
| **Actual result** | «Your username is invalid!» — пробелы не принимаются как логин |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «пробельные символы» |

---

## File Upload (/upload)

### TC-UPLOAD-001
| Поле | Значение |
|---|---|
| **Test ID** | TC-UPLOAD-001 |
| **Title** | Загрузка обычного текстового файла |
| **Priority** | High |
| **Preconditions** | Открыта страница /upload, есть файл test.txt |
| **Steps** | 1. Нажать Choose File 2. Выбрать test.txt 3. Нажать Upload |
| **Expected result** | Страница показывает «File Uploaded!» и имя файла test.txt |
| **Actual result** | Работает корректно |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «обычный файл» |

### TC-UPLOAD-002
| Поле | Значение |
|---|---|
| **Test ID** | TC-UPLOAD-002 |
| **Title** | Загрузка PNG изображения |
| **Priority** | High |
| **Preconditions** | Открыта страница /upload, есть файл image.png |
| **Steps** | 1. Нажать Choose File 2. Выбрать image.png 3. Нажать Upload |
| **Expected result** | «File Uploaded!» и имя файла image.png |
| **Actual result** | Работает корректно |
| **Status** | ✅ Pass |
| **Техника** | EP — класс «файл изображения» |

### TC-UPLOAD-003
| Поле | Значение |
|---|---|
| **Test ID** | TC-UPLOAD-003 |
| **Title** | Нажатие Upload без выбора файла |
| **Priority** | High |
| **Preconditions** | Открыта страница /upload, файл не выбран |
| **Steps** | 1. Сразу нажать Upload, не выбирая файл |
| **Expected result** | Понятное сообщение об ошибке — нужно выбрать файл |
| **Actual result** | Страница показывает «Internal Server Error» |
| **Status** | ❌ Fail — BUG-002 |
| **Техника** | EP — класс «пустое значение» |

### TC-UPLOAD-004
| Поле | Значение |
|---|---|
| **Test ID** | TC-UPLOAD-004 |
| **Title** | Файл с именем 255 символов |
| **Priority** | Medium |
| **Preconditions** | Открыта страница /upload, подготовлен файл с именем 255 символов |
| **Steps** | 1. Выбрать файл с длинным именем 2. Нажать Upload |
| **Expected result** | Файл загружается, имя отображается корректно |
| **Actual result** | Загрузился без ошибок |
| **Status** | ✅ Pass |
| **Техника** | BVA — верхняя граница длины имени |

### TC-UPLOAD-005
| Поле | Значение |
|---|---|
| **Test ID** | TC-UPLOAD-005 |
| **Title** | Файл с кириллицей в имени |
| **Priority** | Medium |
| **Preconditions** | Открыта страница /upload, есть файл «тест.txt» |
| **Steps** | 1. Выбрать файл с кириллическим именем 2. Нажать Upload |
| **Expected result** | Файл загружается, имя отображается без кракозябр |
| **Actual result** | Загрузился, имя отображается нормально |
| **Status** | ✅ Pass |
| **Техника** | EP — нестандартные символы в имени |

---

## Dynamic Loading (/dynamic_loading/1)

### TC-DYNLOAD-001
| Поле | Значение |
|---|---|
| **Test ID** | TC-DYNLOAD-001 |
| **Title** | Текст появляется после нажатия Start |
| **Priority** | High |
| **Preconditions** | Открыта страница /dynamic_loading/1, текст «Hello World!» не виден |
| **Steps** | 1. Убедиться что «Hello World!» не отображается 2. Нажать Start 3. Подождать пока исчезнет загрузка |
| **Expected result** | Появляется текст «Hello World!», загрузочная анимация исчезает |
| **Actual result** | Работает как ожидается, текст появляется примерно через 2 секунды |
| **Status** | ✅ Pass |
| **Техника** | State Transition — Idle → Loading → Loaded |

### TC-DYNLOAD-002
| Поле | Значение |
|---|---|
| **Test ID** | TC-DYNLOAD-002 |
| **Title** | Анимация загрузки видна пока идёт загрузка |
| **Priority** | Medium |
| **Preconditions** | Открыта страница /dynamic_loading/1 |
| **Steps** | 1. Нажать Start 2. Наблюдать за страницей во время загрузки |
| **Expected result** | Сразу после нажатия появляется спиннер, исчезает только когда появился текст |
| **Actual result** | Спиннер появляется и исчезает в нужные моменты |
| **Status** | ✅ Pass |
| **Техника** | State Transition — проверка промежуточного состояния Loading |

### TC-DYNLOAD-003
| Поле | Значение |
|---|---|
| **Test ID** | TC-DYNLOAD-003 |
| **Title** | Обновление страницы сбрасывает всё в начало |
| **Priority** | Medium |
| **Preconditions** | Пользователь уже нажал Start и увидел «Hello World!» |
| **Steps** | 1. Нажать F5 2. Посмотреть на состояние страницы |
| **Expected result** | Страница в начальном состоянии: кнопка Start видна, текст скрыт |
| **Actual result** | Всё сбросилось как ожидается |
| **Status** | ✅ Pass |
| **Техника** | State Transition — Loaded → Idle через обновление |

### TC-DYNLOAD-004
| Поле | Значение |
|---|---|
| **Test ID** | TC-DYNLOAD-004 |
| **Title** | Элемент есть в HTML с самого начала, просто скрыт |
| **Priority** | Low |
| **Preconditions** | Открыта страница, DevTools открыты (F12) |
| **Steps** | 1. До нажатия Start открыть DevTools → Elements 2. Найти div#finish |
| **Expected result** | Элемент присутствует в DOM со style="display:none" |
| **Actual result** | Так и есть — элемент скрыт через CSS, не добавляется динамически |
| **Status** | ✅ Pass |
| **Техника** | State Transition — проверка механизма скрытия |

---

## Итого

| Test ID | Название | Priority | Status |
|---|---|---|---|
| TC-LOGIN-001 | Успешный вход | High | ✅ Pass |
| TC-LOGIN-002 | Неверный пароль | High | ✅ Pass |
| TC-LOGIN-003 | Неверный логин | High | ✅ Pass |
| TC-LOGIN-004 | Пустые поля | High | ✅ Pass |
| TC-LOGIN-005 | Logout | High | ✅ Pass |
| TC-LOGIN-006 | Пробелы | Medium | ✅ Pass |
| TC-UPLOAD-001 | Загрузка TXT | High | ✅ Pass |
| TC-UPLOAD-002 | Загрузка PNG | High | ✅ Pass |
| TC-UPLOAD-003 | Upload без файла | High | ❌ Fail |
| TC-UPLOAD-004 | Имя 255 символов | Medium | ✅ Pass |
| TC-UPLOAD-005 | Кириллица в имени | Medium | ✅ Pass |
| TC-DYNLOAD-001 | Текст появляется после Start | High | ✅ Pass |
| TC-DYNLOAD-002 | Спиннер во время загрузки | Medium | ✅ Pass |
| TC-DYNLOAD-003 | Обновление сбрасывает страницу | Medium | ✅ Pass |
| TC-DYNLOAD-004 | Элемент скрыт в DOM | Low | ✅ Pass |

Всего: 15. Pass: 14, Fail: 1.

---

## Найденные баги

### BUG-001 — Форма входа отправляется с пустыми полями

| Поле | Значение |
|---|---|
| **Title** | /login: нет валидации пустых полей на клиенте |
| **Severity** | Low |
| **Связанный тест** | TC-LOGIN-004 |

**Steps to reproduce:**
1. Открыть /login
2. Оставить поля пустыми
3. Нажать Login

**Expected:** браузер блокирует отправку и показывает «заполните поле»

**Actual:** форма уходит на сервер, возвращается «Your username is invalid!»

**Почему это баг:** лишний запрос к серверу на пустом месте, плюс пользователь не сразу понимает что нужно заполнить поля.

---

### BUG-002 — 500 ошибка при загрузке без файла

| Поле | Значение |
|---|---|
| **Title** | /upload: нажатие Upload без файла вызывает Internal Server Error |
| **Severity** | Medium |
| **Связанный тест** | TC-UPLOAD-003 |

**Steps to reproduce:**
1. Открыть /upload
2. Не выбирать файл
3. Нажать Upload

**Expected:** понятное сообщение «выберите файл», статус 400

**Actual:** страница показывает «Internal Server Error», статус 500

**Почему это баг:** обычная пользовательская ошибка не должна ронять сервер. 500 — это непредвиденный сбой, а здесь ситуация абсолютно предсказуемая.
