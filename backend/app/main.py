from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, icons

# Создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Icon Generator API", version="1.0")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # На проде заменить на домен фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(icons.router)

@app.get("/")
def root():
    return {"message": "AI Icon Generator API is running"}