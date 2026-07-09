from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Icon
from ..schemas import IconConfig, IconResponse
from ..generator.svg_engine import SVGEngine
from ..dependencies import get_current_user

router = APIRouter(prefix="/icons", tags=["icons"])


@router.post("/generate", response_model=IconResponse)
def generate_icon(
        config: IconConfig,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Генерируем SVG
    svg_code = SVGEngine.generate_icon(config.style, config.shape, config.color, config.size)

    # Сохраняем в БД
    new_icon = Icon(
        owner_id=current_user.id,
        svg_code=svg_code,
        style=config.style,
        shape=config.shape,
        color=config.color
    )
    db.add(new_icon)
    db.commit()
    db.refresh(new_icon)
    return new_icon


@router.get("/history", response_model=list[IconResponse])
def get_history(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    icons = db.query(Icon).filter(Icon.owner_id == current_user.id).order_by(Icon.created_at.desc()).all()
    return icons