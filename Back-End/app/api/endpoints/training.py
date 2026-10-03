from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from app.api.deps import get_current_user
from app.database.session import get_db
from app.models.all_models import User, TrainingModule, QuizQuestion, TrainingAttempt

router = APIRouter()

class QuizAttemptRequest(BaseModel):
    answers: List[int]

@router.get("/modules")
def list_training_modules(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    modules = db.query(TrainingModule).all()
    attempts = {att.module_id: att for att in db.query(TrainingAttempt).filter(TrainingAttempt.user_id == current_user.id).all()}
    
    out = []
    for m in modules:
        questions = db.query(QuizQuestion).filter(QuizQuestion.module_id == m.id).all()
        att = attempts.get(m.id)
        out.append({
            "id": f"mod-{m.id}",
            "title": m.title,
            "topic": m.topic,
            "difficulty": m.difficulty,
            "duration": m.duration,
            "content": m.content,
            "completed": att is not None,
            "score": att.score if att else None,
            "questions": [
                {
                    "id": f"q{q.id}",
                    "question": q.question,
                    "options": q.options,
                    "correctIndex": q.correct_index,
                    "explanation": q.explanation
                } for q in questions
            ]
        })
    return out

@router.post("/modules/{id}/attempts")
def submit_quiz_attempt(id: int, req: QuizAttemptRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    module = db.query(TrainingModule).filter(TrainingModule.id == id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    questions = db.query(QuizQuestion).filter(QuizQuestion.module_id == id).all()
    correct = 0
    for idx, q in enumerate(questions):
        if idx < len(req.answers) and req.answers[idx] == q.correct_index:
            correct += 1
            
    score = round((correct / len(questions)) * 100) if questions else 100
    attempt = TrainingAttempt(user_id=current_user.id, module_id=id, score=score)
    db.add(attempt)
    
    if score >= 70:
        current_user.risk_score = max(0, current_user.risk_score - 5)
        db.add(current_user)
        
    db.commit()
    return {"score": score, "passed": score >= 70, "new_risk_score": current_user.risk_score}
