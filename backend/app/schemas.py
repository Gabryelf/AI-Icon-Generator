from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class IconConfig(BaseModel):
    style: str = "minimal"      # minimal, colorful, outline
    shape: str = "circle"       # circle, square, hexagon
    color: str = "#3B82F6"      # blue-500
    size: int = 128

class IconResponse(BaseModel):
    id: int
    svg_code: str
    style: str
    shape: str
    color: str
    created_at: datetime

    class Config:
        orm_mode = True