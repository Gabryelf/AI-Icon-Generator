from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    icons = relationship("Icon", back_populates="owner")

class Icon(Base):
    __tablename__ = "icons"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    svg_code = Column(Text, nullable=False)  # Полный SVG код
    png_url = Column(String, nullable=True)   # Задел под будущий PNG
    style = Column(String)                    # "minimal", "colorful", "outline"
    shape = Column(String)                    # "circle", "square", "hexagon"
    color = Column(String)                    # HEX цвет
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="icons")