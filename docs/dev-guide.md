# Dev Guide

## Быстрый старт

### 1. Установить зависимости

```bash
yarn install
```

### 2. Настроить переменные окружения

Скопируй `.env.example` в `.env.development` и заполни значения:

```bash
cp .env.example .env.development
```

Минимальный набор переменных для запуска:

```env
JWT_SECRET=secret
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=voting_system
```

### 3. Запустить PostgreSQL

> **Обязательно** — приложение не запустится без работающей БД.

Запусти контейнер с флагом `--restart always`, чтобы он поднимался автоматически после перезагрузки ПК:

```bash
docker run -d \
  --name voting-postgres \
  --restart always \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=voting_system \
  -p 5432:5432 \
  postgres:16
```

Проверить, что контейнер работает:

```bash
docker ps
```

### 4. Запустить приложение

**Dev-режим** (с hot-reload):

```bash
yarn start:dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

---

## Тесты

| Команда | Описание |
|---|---|
| `yarn test` | Юнит-тесты |
| `yarn test:watch` | Юнит-тесты в watch-режиме |
| `yarn test:cov` | Юнит-тесты с покрытием |
| `yarn test:e2e` | E2E-тесты |

---

## Полезные команды Docker

```bash
# Остановить контейнер
docker stop voting-postgres

# Запустить снова
docker start voting-postgres

# Посмотреть логи
docker logs voting-postgres
```
