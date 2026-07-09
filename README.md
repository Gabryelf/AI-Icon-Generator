# Документация проекта: AI Icon Generator (MVP v1.0)

>Генератор: На данном этапе — это модуль на Python, который создает SVG-код на основе параметров пользователя (цвет, форма, стиль) без использования внешних нейросетей. >Это делает сервис быстрым и бесплатным на старте.


## 1. Архитектура проекта
>Бэкенд: Python 3.10+, FastAPI, SQLAlchemy, Alembic.

>Фронтенд: Чистый HTML, CSS (Flexbox/Grid, современный дизайн), Vanilla JavaScript.

>База данных: PostgreSQL (Render.com).

>Хранение кода: GitHub.

>Деплой: Render.com (Web Service + PostgreSQL).

## 2. Структура папок и файлов
```text
ai_icon_generator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # Точка входа FastAPI
│   │   ├── database.py             # Подключение к БД (SQLAlchemy)
│   │   ├── models.py               # Модели SQLAlchemy (User, Icon)
│   │   ├── schemas.py              # Pydantic схемы для валидации
│   │   ├── auth.py                 # JWT-авторизация (регистрация/логин)
│   │   ├── dependencies.py         # Зависимости (get_current_user)
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py             # Эндпоинты /auth
│   │   │   └── icons.py            # Эндпоинты /icons (генерация, сохранение)
│   │   └── generator/
│   │       ├── __init__.py
│   │       └── svg_engine.py       # Класс генерации SVG-иконок
│   ├── migrations/                 # Папка для Alembic
│   ├── requirements.txt
│   └── .env                        # Переменные окружения (не в Git)
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── index.html              # Главная страница (Лендинг)
│   │   ├── dashboard.html          # Личный кабинет
│   │   ├── css/
│   │   │   ├── style.css           # Глобальные стили
│   │   │   └── dashboard.css       # Стили кабинета
│   │   └── js/
│   │       ├── auth.js             # Логика входа/регистрации
│   │       ├── dashboard.js        # Управление настройками и генерация
│   │       └── api.js              # Обертка для fetch-запросов
├── .gitignore
└── README.md
```
