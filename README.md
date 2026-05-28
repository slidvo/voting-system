# Voting System

REST API для создания опросов и голосования с поддержкой WebSocket для отображения результатов в реальном времени.

**Стек:** NestJS, TypeORM, PostgreSQL, JWT, Socket.IO, Swagger

## Возможности

- Регистрация и аутентификация пользователей (JWT)
- Создание, редактирование и удаление опросов
- Голосование (однократно, конфликт возвращает 409)
- Просмотр своих опросов (`GET /poll/my`)
- Результаты в реальном времени через WebSocket (namespace `/polls`)
- Swagger UI: `http://localhost:3000/api`

## Быстрый старт

### Требования

- Node.js 20+
- PostgreSQL
- yarn

### Установка

```bash
yarn install
```

### Настройка окружения

Создайте файл `.env` в корне проекта:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=voting_system

JWT_SECRET=secret

ORM_SYNC=true
```

При `ORM_SYNC=true` TypeORM автоматически создаёт таблицы. Для production используйте миграции (см. ниже).

### Запуск

```bash
# режим разработки (watch)
yarn start:dev

# production (сначала сбилдить)
yarn build
yarn start:prod
```

Сервер запускается на `http://localhost:3000`.

### Миграции (production)

```bash
# применить миграции
yarn migration:run

# откатить последнюю миграцию
yarn migration:revert

# сгенерировать новую миграцию
yarn migration:generate src/database/migrations/MigrationName
```

## Тестирование

### Unit-тесты

```bash
yarn test
```

### Unit-тесты с покрытием

```bash
yarn test:cov
```

### E2E-тесты

E2E-тесты используют моки для гвардов и сервисов — БД не нужна.

```bash
yarn test:e2e
```

### Postman

Импортируйте файл `voting_system.postman_collection.json` в Postman.

Коллекция содержит переменные `{{host}}`, `{{token}}`, `{{pollId}}` — токен и ID опроса сохраняются автоматически после Register/Login и Create poll.

Порядок запросов:
1. **Auth → Register** (или Login) — сохраняет `{{token}}`
2. **Poll → Create poll** — сохраняет `{{pollId}}`
3. Остальные запросы используют сохранённые переменные

## WebSocket

Namespace: `/polls`  
URL: `ws://localhost:3000/polls`

| Событие | Направление | Payload |
|---|---|---|
| `joinPoll` | client → server | `pollId: number` |
| `leavePoll` | client → server | `pollId: number` |
| `resultsUpdated` | server → client | `{ pollId, title, questions: [{ questionId, text, options: [{ optionId, text, votes }] }] }` |

При `joinPoll` сервер немедленно отправляет текущие результаты. При каждом новом голосовании всем подписчикам рассылается обновлённый `resultsUpdated`.

Быстрая проверка через Node.js:

```js
const { io } = require('socket.io-client');
const socket = io('http://localhost:3000/polls');
socket.emit('joinPoll', 1);
socket.on('resultsUpdated', console.log);
```

## API

Полная документация доступна в Swagger UI по адресу `http://localhost:3000/api` после запуска сервера.

| Метод | Путь | Описание |
|---|---|---|
| POST | `/auth/register` | Регистрация |
| POST | `/auth/login` | Вход |
| GET | `/poll` | Все активные опросы |
| GET | `/poll/my` | Мои опросы |
| GET | `/poll/:id` | Опрос по ID |
| POST | `/poll` | Создать опрос |
| POST | `/poll/:id/answers` | Проголосовать |
| PATCH | `/poll/:id` | Обновить опрос (только владелец) |
| DELETE | `/poll/:id` | Удалить опрос |
