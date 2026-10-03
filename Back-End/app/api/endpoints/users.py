from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.all_models import User, Submission, TrainingAttempt

router = APIRouter()

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "role": current_user.role,
        "is_admin": current_user.is_admin,
        "risk_score": current_user.risk_score
    }

@router.get("/me/risk")
def get_user_risk_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_scans = db.query(Submission).filter(Submission.user_id == current_user.id).count()
    completed_modules = db.query(TrainingAttempt).filter(TrainingAttempt.user_id == current_user.id).count()

    return {
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "riskScore": current_user.risk_score,
        "trainingScore": 85 if completed_modules > 0 else 50,
        "totalScans": total_scans,
        "reportedPhishCount": 5,
        "failedSimulations": 0
    }
