Feature: Вход и выход из системы

  Scenario: Успешный вход с правильными данными
    Given пользователь открыл страницу входа
    When он вводит логин "tomsmith" и пароль "SuperSecretPassword!"
    And нажимает кнопку Login
    Then он попадает на страницу /secure
    And видит сообщение "You logged into a secure area!"

  Scenario: Выход из системы
    Given пользователь авторизован
    When он нажимает кнопку Logout
    Then он попадает обратно на страницу входа
    And видит сообщение "You logged out of the secure area!"

  Scenario: Вход с неверным паролем
    Given пользователь открыл страницу входа
    When он вводит логин "tomsmith" и неверный пароль "wrongpassword"
    And нажимает кнопку Login
    Then он остаётся на странице входа
    And видит сообщение "Your password is invalid!"

  Scenario: Вход с пустыми полями
    Given пользователь открыл страницу входа
    When он не заполняет поля и нажимает Login
    Then он остаётся на странице входа
    And видит сообщение об ошибке
