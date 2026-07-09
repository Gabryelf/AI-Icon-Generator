from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
from .database import engine, Base
from .routers import auth, icons
import os

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Icon Generator API", version="1.0")

# CORS для безопасности (можно оставить для API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # На проде заменить на домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры API
app.include_router(auth.router)
app.include_router(icons.router)

# Путь к папке с фронтендом
FRONTEND_DIR = Path(__file__).parent.parent.parent / "frontend"

# Подключаем статику (CSS, JS)
app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")

# Корневой эндпоинт - отдаем index.html
@app.get("/")
async def root():
    return FileResponse(FRONTEND_DIR / "index.html")

# Эндпоинт для дашборда
@app.get("/dashboard")
async def dashboard():
    return FileResponse(FRONTEND_DIR / "dashboard.html")

# Опционально: любой другой HTML файл
@app.get("/{page}.html")
async def get_html(page: str):
    file_path = FRONTEND_DIR / f"{page}.html"
    if file_path.exists():
        return FileResponse(file_path)
    return {"error": "Page not found"}

# API-эндпоинт для проверки статуса
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Icon Generator is running"}