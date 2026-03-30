# Платформа для обучения языкам программирования

Веб-платформа для обучения JavaScript, HTML+CSS, PHP с системой заданий и прогресса.

## Технологический стек

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- React Hook Form + Zod

### Backend
- NestJS + TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication
- bcrypt

## Требования

- Node.js 18+
- PostgreSQL 14+
- npm или yarn

## Установка и запуск

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd code-learning-platform
```

### 2. Настройка PostgreSQL

Создайте базу данных:

```sql
CREATE DATABASE code_learning;
```

### 3. Запуск Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend будет доступен на http://localhost:3001

### 4. Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на http://localhost:5173

### Docker (опционально)

```bash
docker-compose up -d
```

## Создание администратора

После запуска создайте администратора через API:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","name":"Admin","password":"admin123"}'
```

Затем в базе данных измените роль пользователя на 'admin':

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Структура проекта

```
├── backend/
│   ├── src/
│   │   ├── auth/          # Аутентификация
│   │   ├── users/         # Пользователи
│   │   ├── courses/       # Курсы
│   │   ├── topics/        # Темы
│   │   ├── tasks/         # Задания
│   │   ├── submissions/   # Отправки решений
│   │   └── progress/      # Прогресс
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/    # Компоненты
│   │   ├── pages/         # Страницы
│   │   ├── services/      # API сервисы
│   │   ├── context/       # React контексты
│   │   └── types/         # TypeScript типы
│   └── ...
└── docker-compose.yml
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

### Courses
- `GET /api/courses` - Список курсов
- `GET /api/courses/:id` - Курс по ID
- `POST /api/courses` - Создание курса (admin)
- `PUT /api/courses/:id` - Обновление курса (admin)
- `DELETE /api/courses/:id` - Удаление курса (admin)

### Topics
- `GET /api/topics/course/:courseId` - Темы курса
- `GET /api/topics/:id` - Тема по ID
- `POST /api/topics` - Создание темы (admin)
- `PUT /api/topics/:id` - Обновление темы (admin)
- `DELETE /api/topics/:id` - Удаление темы (admin)

### Tasks
- `GET /api/tasks/topic/:topicId` - Задания темы
- `GET /api/tasks/:id` - Задание по ID
- `POST /api/tasks` - Создание задания (admin)
- `PUT /api/tasks/:id` - Обновление задания (admin)
- `DELETE /api/tasks/:id` - Удаление задания (admin)

### Submissions
- `POST /api/submissions` - Отправить решение
- `GET /api/submissions/my` - Мои решения
- `GET /api/submissions/pending` - На проверке (admin)
- `POST /api/submissions/:id/run` - Запустить тесты
- `PUT /api/submissions/:id/approve` - Принять (admin)
- `PUT /api/submissions/:id/reject` - Отклонить (admin)

## Функциональность

### Для пользователей
- Регистрация и вход
- Просмотр курсов и тем
- Чтение учебных материалов
- Выполнение заданий (автоматическая и ручная проверка)
- Отслеживание прогресса

### Для администраторов
- Управление курсами, темами, заданиями
- Проверка решений
- Выставление баллов и комментариев

## Лицензия

MIT
