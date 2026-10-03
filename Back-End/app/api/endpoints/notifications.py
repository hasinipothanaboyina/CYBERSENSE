from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.all_models import User, Notification

router = APIRouter()

@router.get("")
def list_notifications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notifs = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.id.desc()).all()
    return [{
        "id": f"notif-{n.id}",
        "title": n.title,
        "body": n.body,
        "type": n.type,
        "isRead": n.is_read,
        "createdAt": n.created_at.strftime("%Y-%m-%d %H:%M") if n.created_at else "Just now"
    } for n in notifs]

@router.patch("/{id}/read")
def mark_read(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    notif = db.query(Notification).filter(Notification.id == id, Notification.user_id == current_user.id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "success"}
