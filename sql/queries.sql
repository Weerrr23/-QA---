-- Задание 4a — SQL запросы
-- СУБД: PostgreSQL
--
-- Схема:
--   Users    (id, name, email, created_at)
--   Rooms    (id, type, price_per_night)
--   Bookings (id, user_id, room_id, checkin, checkout, status, created_at)
--   status: 'pending' | 'confirmed' | 'cancelled'


-- 1. Пользователи без бронирований
-- Нужно чтобы убедиться что такие пользователи не теряются в системе
-- и зарегистрироваться можно без создания брони
SELECT
    u.id,
    u.name,
    u.email
FROM Users u
LEFT JOIN Bookings b ON b.user_id = u.id
WHERE b.id IS NULL;


-- 2. Пересекающиеся бронирования одной комнаты
-- Система не должна давать забронировать одну комнату на одинаковые даты.
-- Этот запрос помогает найти такие случаи если они всё же попали в базу.
-- Условие перекрытия дат: A.checkin < B.checkout AND A.checkout > B.checkin
SELECT
    a.id       AS booking_a,
    b.id       AS booking_b,
    a.room_id,
    a.checkin  AS a_checkin,
    a.checkout AS a_checkout,
    b.checkin  AS b_checkin,
    b.checkout AS b_checkout
FROM Bookings a
JOIN Bookings b
    ON  a.room_id  = b.room_id
    AND a.id       < b.id
    AND a.checkin  < b.checkout
    AND a.checkout > b.checkin
WHERE a.status != 'cancelled'
  AND b.status != 'cancelled';


-- 3. Топ-3 комнаты по числу подтверждённых броней за последние 30 дней
-- Помогает проверить что аналитика и отчёты считают данные правильно
SELECT
    r.id,
    r.type,
    COUNT(b.id) AS confirmed_count
FROM Rooms r
JOIN Bookings b
    ON  b.room_id = r.id
    AND b.status  = 'confirmed'
    AND b.created_at >= NOW() - INTERVAL '30 days'
GROUP BY r.id, r.type
ORDER BY confirmed_count DESC
LIMIT 3;


-- 4. Подтверждённые брони созданные больше 7 дней назад у которых дата заезда уже прошла
-- Проверяем что фоновая задача меняет статус с confirmed на completed.
-- Если таких броней много — задача, скорее всего, не работает.
SELECT
    b.id,
    u.name,
    u.email,
    b.checkin,
    b.checkout,
    b.created_at
FROM Bookings b
JOIN Users u ON u.id = b.user_id
WHERE b.status     = 'confirmed'
  AND b.created_at < NOW() - INTERVAL '7 days'
  AND b.checkin    < NOW();


-- 5. Количество подтверждённых броней по типу комнаты
-- Проверяем что группировка в отчётах работает корректно
-- и нет типов комнат с аномальными значениями
SELECT
    r.type,
    COUNT(b.id) AS confirmed_count
FROM Rooms r
JOIN Bookings b
    ON  b.room_id = r.id
    AND b.status  = 'confirmed'
GROUP BY r.type
ORDER BY confirmed_count DESC;
